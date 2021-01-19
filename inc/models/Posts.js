const mongoose = require('mongoose');

class Posts
{
    constructor(connection)
    {
        const collectionName = 'Posts';

        const schema = new mongoose.Schema({
            id: {type: Number, required: true, unique: true},
            messageId: {type: Number, required: true, unique: true},
            commentsCount: {type: Number, required: true, default: 0},
            commentsCountWithoutReplies: {type: Number, required: true, default: 0},
            sendTime: {type: Number, required: true},
            bannerPost: {type: Boolean, required: true, default: false}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async new(data)
    {
        await (new this.model(data).save());
    }

    async get(pid)
    {
        let query = await this.model.findOne({id: pid});

        if(query)
            return query;
        else
            throw null;
    }

    async exists(pid)
    {
        let count = await this.model.countDocuments({id: pid});
        return count > 0;
    }

    async addCommentNum(pid, isReply)
    {
        let newData = {commentsCount: 1};
        if(isReply == 0) newData.commentsCountWithoutReplies = 1;

        return (await this.model.updateOne({id: pid}, {$inc: newData}));
    }

    async substractCommentNum(id, repliesCount, mainSubstract)
    {
        return (await this.model.updateOne({id: id}, {
            $inc: {
                commentsCount: (repliesCount + 1) * -1,
                commentsCountWithoutReplies: mainSubstract * -1
            }
        }));
    }

    async getCommentsCount(id)
    {
        let query = await this.model.findOne({id: id}).select('commentsCount');

        if(query)
            return query.commentsCount;
        else
            throw null;
    }
}

module.exports = Posts;