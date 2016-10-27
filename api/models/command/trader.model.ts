import { Document, Schema, Model, Types } from 'mongoose';

import * as api from '../../../api';

let mongoose = api.DataAccess.mongooseInstance;


export interface Trader {
    userId: Types.ObjectId;
    strategyId: Types.ObjectId;
    instrument: string;
    snapshotVersion: number; // for snapshot
    status: string;
    createdDate: Date;
    updatedDate: Date;
    events: api.TraderEventStore[];
}

export interface TraderModel extends api.Trader, Document {
}

let schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId },
    strategyId: { type: mongoose.Schema.Types.ObjectId },
    instrument: { type: String, enum: ['AUD_USD'], required: 'instrument is required' },
    status: { type: String, default: 'Created', enum: ['Created', 'In', 'Out'], required: 'status is required' },
    snapshotVersion: { type: Number, default: 0 },
    createdDate: Date,
    updatedDate: Date,
    // events: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TraderEventStore' }],
});


export let traderModel = mongoose.model<TraderModel>('Trader', schema);

