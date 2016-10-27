import * as api from '../../api';

export async function create(req, res, next) {
    let event: api.TraderCreatedPayload = req.body;
    if (!event) {
        throw new Error('event is undefined');
    }
    try {
        let service = new api.TraderCommandService();
        await service.create(event);
        res.json('event dispatched');
    } catch (err) {
        res.statusCode = 500; // internal server error
        next(err);
    }
}
