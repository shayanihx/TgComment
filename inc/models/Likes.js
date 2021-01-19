const mongoose = require('mongoose');

class Likes
{
    constructor(connection)
    {
        const collectionName = 'Likes';

        const schema = new mongoose.Schema({
            t_id: {type: Number, required: true},
            postId: {type: Number, required: true},
            commentId: {type: Number, required: true}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async get(t_id, postId)
    {
        return (await this.model.distinct('commentId', {t_id: t_id, postId: postId}));
    }

    async exists(t_id, commentId)
    {
        let count = await this.model.countDocuments({t_id: t_id, commentId: commentId});
        return count > 0;
    }

    async new(data)
    {
        return (await new this.model(data).save());
    }

    async delete(t_id, commentId)
    {
        return (await this.model.deleteOne({t_id: t_id, commentId: commentId}));
    }
}

module.exports = Likes;