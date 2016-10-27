import { Document, Schema, Model, Types } from 'mongoose';

import * as api from '../../../api';

let mongoose = api.DataAccess.mongooseInstance;

export interface TraderQuery {
    traderId: string | number;
    userId: string | number;
    status: string;
    updated: string;
    version: number;
    instrument: string;
}

export interface TraderQueryModel extends api.TraderQuery, Document {
}

let schema = new Schema({
    traderId: { type: Schema.Types.ObjectId, required: 'traderId is required' },
    userId: { type: Schema.Types.ObjectId, required: 'userId is required' },
    updated: { type: Date, default: Date.now },
    version: { type: Number, required: 'version is required', min: 0 },
    status: { type: String, enum: ['Created', 'In', 'Out'], required: 'status is required' },
    instrument: { type: String, enum: ['AUD_USD'], required: 'instrument is required' },
});

export let traderQueryModel = mongoose.model<TraderQueryModel>('TraderQuery', schema);
