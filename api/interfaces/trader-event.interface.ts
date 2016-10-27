import * as api from '../../api';
export interface TraderEvent {
    version: number;
    raised: Date;
    event: api.EventEnum;
    payload: TraderCreatedPayload;
}


export interface TraderCreatedPayload {
    traderId: string;
    userId: string;
    strategyId: string;
    instrument: api.InstrumentEnum;
}