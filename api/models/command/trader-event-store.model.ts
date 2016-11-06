import { Document, Schema, Model } from 'mongoose';

import * as api from '../../../api';

let mongoose = api.DataAccess.mongooseInstance;


export interface TraderEventStore {
    traderId: api.Trader;
    isDispatched: boolean;
    raised: Date;
    version: number;
    event: string;
    payload: api.TraderCreatedPayload;
}

export interface TraderEventStoreModel extends api.TraderEventStore, Document {
    findUndispatchedEvents(): Promise<TraderEventStoreModel[]>;
}

let schema = new Schema({
    traderId: { type: Schema.Types.ObjectId, ref: 'Trader' },
    isDispatched: { type: Boolean, default: false },
    raised: Date,
    version: Number,
    event: { type: String, enum: ['trader_created'] },
    payload: { type: Schema.Types.Mixed },
});

schema.statics.findUndispatchedEvents = async () => {
    return this.traderEventStoreModel
        .find({ isDispatched: false })
        .sort({ 'event.version': -1 })
        .exec();
};

export let traderEventStoreModel = mongoose.model<TraderEventStoreModel>('TraderEventStore', schema);

