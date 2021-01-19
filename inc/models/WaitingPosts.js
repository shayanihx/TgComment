const mongoose = require('mongoose');

class WaitingPosts
{
    constructor(connection)
    {
        const collectionName = 'WaitingPosts';

        const schema = new mongoose.Schema({
            messageId: {type: Number, required: true, unique: true},
            sendTimestamp: {type: Number, required: true},
            text: {type: String},
            photo: {type: String},
            document: {type: String},
            video: {type: String},
            audio: {type: String},
            voice: {type: String},
            caption: {type: String},
            poll: {type: String},
            buttonText: {type: String},
            link: {type: String}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async updateByMessageId(id, newData)
    {
        return (await this.model.updateOne({messageId: id}, newData));
    }

    async new(data)
    {
        return (await new this.model(data).save());
    }

    async delete(id)
    {
        return (await this.model.deleteOne({_id: id}))
    }

    async deleteByMessageId(messageId)
    {
        return (await this.model.deleteOne({messageId: messageId}))
    }

    async get(time)
    {
        return await this.model
            .find({sendTimestamp: {$lt: time}})
            .limit(1)
            .sort({sendTimestamp: 1})
            .exec();
    }
}

module.exports = WaitingPosts;