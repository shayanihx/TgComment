const mongoose = require('mongoose');

class Admins
{
    constructor(connection)
    {
        const collectionName = 'Admins';

        const schema = new mongoose.Schema({
            t_id: {type: Number, required: true, unique: true},
            process: {type: String}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async get(t_id)
    {
        return (await this.model.findOne({t_id: t_id}));
    }

    async update(id, newData)
    {
        return (await this.model.updateOne({_id: id}, newData));
    }

    async new(data)
    {
        await (new this.model(data).save());
    }
}

module.exports = Admins;