const mongoose = require('mongoose');

class Blocks
{
    constructor(connection)
    {
        const collectionName = 'Blocks';

        const schema = new mongoose.Schema({
            tid: {type: Number, required: true},
            blockedTid: {type: Number, required: true}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async exists(tid, blockedTid)
    {
        let count = await this.model.countDocuments({tid: tid, blockedTid: blockedTid});
        return count > 0;
    }

    async new(data)
    {
        return (await new this.model(data).save());
    }

    async delete(data)
    {
        return (await this.model.deleteMany(data));
    }
}

module.exports = Blocks;