import { Types } from 'mongoose';

import * as api from '../../../api';

export class TraderQueryService {
    public async updateQuery(event: api.TraderEvent) {
        switch (event.event) {
            case api.EventEnum.trader_created:
                let model = new api.traderQueryModel({
                    traderId: new Types.ObjectId(event.payload.traderId),
                    userId: new Types.ObjectId(event.payload.userId),
                    status: api.TraderStatusEnum[api.TraderStatusEnum.Created],
                    updated: event.raised,
                    version: event.version,
                    instrument: api.InstrumentEnum[event.payload.instrument],
                });
                await model.save();
                break;

        }
        return null;
    }
}