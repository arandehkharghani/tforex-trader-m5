import * as kafka from 'kafka-node';

import * as api from '../../../api';

export class M5TopicConsumerService {
    private static _consumer: kafka.Consumer;
    public static connect() {
        let client = new kafka.Client(
            api.Config.settings.kafka_conn_string,
            api.Config.settings.client_id);
        M5TopicConsumerService._consumer = new kafka.Consumer(
            client, [
                { topic: api.Config.settings.topic_m5, partition: 0 },
            ], {
                autoCommit: true,
                groupId: api.Config.settings.client_id,
            }
        );

        // if you don't see any message coming, it may be because you have deleted the topic and the offset 
        // is not reset with this client id.
        M5TopicConsumerService._consumer.on('message', async (message: any) => {
            if (message && message.value) {
                let item = JSON.parse(message.value);
                if (item.event) {
                    let queryService = new api.TraderQueryService();
                    await queryService.update(item);
                }
            }
        });
        M5TopicConsumerService._consumer.on('error', (err: string) => {
            console.log(err);
        });
        // dispatch all undispatched events
        setTimeout(() => {
            let dispatcher = new api.TraderEventDispatcherService();
            dispatcher.dispatch();
        }, 5000);
    }
    public static resetOffset() {
        M5TopicConsumerService._consumer.setOffset(api.Config.settings.topic_m5, 0, 0);
    }
}

M5TopicConsumerService.connect();
// M5TopicConsumerService.resetOffset();

