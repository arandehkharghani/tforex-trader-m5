import { Types } from 'mongoose';

import * as api from '../../../api';

export class TraderQueryService {
    public async get(userId: string | number, id: string | null = null): Promise<api.TraderQueryModel[]> {
        let data = await api.traderQueryModel.find({ userId: userId }).exec();
        return data;
    }

    public async update(event: api.TraderEvent) {
        switch (event.event) {
            case api.EventEnum.trader_created:
                let model = new api.traderQueryModel({
                    _id: new Types.ObjectId(event.payload.traderId),
                    userId: new Types.ObjectId(event.payload.userId),
                    status: api.TraderStatusEnum[api.TraderStatusEnum.Created],
                    updated: event.raised,
                    created: event.raised,
                    version: event.version,
                    instrument: api.InstrumentEnum[event.payload.instrument],
                });
                await model.save();
                break;

        }
        return null;
    }
}