const mongoose = require('mongoose');

class Relations
{
    constructor(connection)
    {
        const collectionName = 'Relations';

        const schema = new mongoose.Schema({
            u1: {type: Number, required: true},
            u2: {type: Number, required: true}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async exists(u1, u2)
    {
        let count = this.model.countDocuments({$or: [{u1: u1, u2: u2}, {u1: u2, u2: u1}]});
        return count > 0;
    }

    async new(u1, u2)
    {
        return (await new this.model({u1: u1, u2: u2}).save());
    }
}

module.exports = Relations;