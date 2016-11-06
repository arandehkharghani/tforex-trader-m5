import * as api from '../../api';

export interface TraderCreatedPayload {
    traderId: string;
    userId: string;
    strategyId: string;
    instrument: api.InstrumentEnum;
}