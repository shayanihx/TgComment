const mongoose = require('mongoose');

class SocketClients
{
    constructor(connection)
    {
        const collectionName = 'SocketClients';

        const schema = new mongoose.Schema({
            socketId: {type: String, required: true, unique: true},
            t_id: {type: Number},
            time: {type: Number, required: true}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async new(data)
    {
        return (await new this.model(data).save());
    }

    async delete(socketId)
    {
        return (await this.model.deleteOne({socketId: socketId}));
    }

    async deleteAll()
    {
        return (await this.model.deleteMany());
    }
}

module.exports = SocketClients;