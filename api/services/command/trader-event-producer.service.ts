import * as mongoose from 'mongoose';
import * as kafka from 'kafka-node';

import * as api from '../../../api';

export class TraderEventDispatcherService {
    private _producer: kafka.Producer;

    constructor() {
        let client = new kafka.Client(
            api.Config.settings.kafka_conn_string,
            api.Config.settings.client_id);

        this._producer = new kafka.Producer(client);
    }

    public async dispatch(): Promise<void> {
        let unpatched: api.TraderEventStoreModel[] = await (<any>api.traderEventStoreModel).findUndispatchedEvents();
        let keyedMessages: kafka.KeyedMessage[] = [];

        for (let item of unpatched) {
            switch (item.event.event) {
                case api.EventEnum.trader_created:
                    keyedMessages.push(new kafka.KeyedMessage(item.traderId.toString(), JSON.stringify(item.event)));
                    break;
            }
        }

        let produceRequests: kafka.ProduceRequest[] = [{
            topic: api.Config.settings.topic_m5,
            messages: keyedMessages,
        }];

        this._producer.on('ready', () => {
            if (keyedMessages.length > 0) {
                this._producer.send(produceRequests, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        for (let item of unpatched) {
                            item.isDispatched = true;
                            item.save();
                        }
                    }
                });
            }
        });

        this._producer.on('error', (err) => {
            console.log(err);
        });
    }
}
