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


export async function get(req, res, next) {

    try {
        let result: api.TraderQuery[] = [];
        let userId: string | number;
        if (req.swagger.params && req.swagger.params.userId) {
            userId = req.swagger.params.userId.value;
        } else {
            throw new Error('userId is required!');
        }

        let _id: string | null = null;
        if (req.swagger.params && req.swagger.params._id) {
            _id = req.swagger.params._id.value;
        }

        let service = new api.TraderQueryService();
        let data = await service.get(userId, _id);
        for (let item of data) {
            result.push({
                id: item.id,
                created: item.created,
                updated: item.updated,
                status: item.status,
                version: item.version,
                instrument: item.instrument,
                userId: item.userId,
            });
        }
        res.json(result);
    } catch (err) {
        res.statusCode = 500; // bad gateway
        next(err);
    }
}

