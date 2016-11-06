import * as mongoose from 'mongoose';
import * as api from '../../../api';

export class TraderCommandService {
    public async create(payload: api.TraderCreatedPayload): Promise<boolean> {
        /*
        / create a new event and persist it in db
        / dispatch the event to the message broker
        */
        let trader: api.Trader = {
            createdDate: new Date(),
            updatedDate: new Date(),
            instrument: api.InstrumentEnum[payload.instrument],
            snapshotVersion: 0,
            status: api.TraderStatusEnum[api.TraderStatusEnum.Created],
            strategyId: new mongoose.Types.ObjectId(payload.strategyId),
            userId: new mongoose.Types.ObjectId(payload.userId),
            events: [],
        };
        let traderModel = new api.traderModel(trader);
        await traderModel.save();
        payload.traderId = traderModel._id.toString();

        let traderEventStore: api.TraderEventStore = {
            isDispatched: false,
            traderId: traderModel._id,
            event: api.EventEnum[api.EventEnum.trader_created],
            raised: new Date(),
            version: 0,
            payload: payload,
        };

        let traderEventStoreModel = new api.traderEventStoreModel(traderEventStore);
        await traderEventStoreModel.save();
        // dispatch event
        let dispatcher = new api.TraderEventDispatcherService();
        await dispatcher.dispatch();
        return true;
    }
}
