const mongoose = require('mongoose');

class Requests
{
    constructor(connection)
    {
        const collectionName = 'Requests';

        const schema = new mongoose.Schema({
            from: {type: Number, required: true},
            to: {type: Number, required: true}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async exists(from, to)
    {
        let count = await this.model.countDocuments({from: from, to: to});
        return count > 0;
    }

    async new(from, to)
    {
        return await new this.model({
            from: from,
            to: to
        }).save();
    }
}

module.exports = Requests;