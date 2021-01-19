const mongoose = require('mongoose');
const config = require('./../config');

class Comments
{
    constructor(connection)
    {
        const collectionName = 'Comments';

        const schema = new mongoose.Schema({
            id: {type: Number, required: true, unique: true},
            postId: {type: Number, required: true},
            sender: {type: Number, required: true},
            senderName: {type: String, required: true},
            senderPhoto: {type: String},
            senderPhotoBg: {type: Number},
            text: {type: String, required: true},
            time: {type: Number, required: true},
            step: {type: Number, required: true},
            repliesCount: {type: Number, required: true, default: 0},
            likesCount: {type: Number, required: true, default: 0},
            replyTo: {type: Number},
            notiMessageId: {type: Number, required: true}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async new(data)
    {
        await (new this.model(data).save());
    }

    async getById(id)
    {
        return (await this.model.findOne({id: id}));
    }

    async addRepliesNum(ids)
    {
        return (await this.model.updateMany({id: {$in: ids}}, {$inc: {repliesCount: 1}}, {multi: true}));
    }

    async checkSender(id, sender)
    {
        let count = await this.model.countDocuments({id: id, sender: sender});
        return count > 0;
    }

    async update(id, data)
    {
        return (await this.model.updateOne({id: id}, data));
    }

    async updateSenderData(where, data)
    {
        return (await this.model.updateMany(where, data, {multi: true}));
    }

    async getCommentsAndReplies(postId, userTid, likesModel, timestamp)
    {
        let Comments = [];

        let where = {postId: postId, step: 1};
        if(timestamp)
            where.time = {$lt: timestamp};

        let step1Comments = await this.model
            .find(where)
            .sort({_id: -1})
            .limit(config.commentLimit)
            .exec();

        let step1Count = step1Comments.length;
        if(step1Count > 0)
        {
            let likes = await likesModel.get(userTid, postId);

            step1Comments.reverse();
            step1Comments = (step1Count > 20) ? step1Comments.slice(0, 20) : step1Comments;

            let step1Ids = [];
            step1Comments.forEach(function(comment){
                if(comment.repliesCount > 0)
                    step1Ids.push(comment.id);
            });

            let step2Comments = await this.model.find({postId: postId, step: 2, replyTo: {$in: step1Ids}});
            let step3Comments = await this.model.find({postId: postId, step: 3});

            let comments1Replies = [],
                comments2Replies = [];

            step3Comments.forEach(function(comment){
                let thisComment = {
                    id: comment.id,
                    _: comment,
                    likeEnable: likes.indexOf(comment.id) != -1
                };

                if(comments2Replies[comment.replyTo])
                    comments2Replies[comment.replyTo].push(thisComment);
                else
                    comments2Replies[comment.replyTo] = [thisComment];
            });

            step2Comments.forEach(function(comment){
                let thisComment = {
                    id: comment.id,
                    _: comment,
                    replies: (comments2Replies[comment.id]) ? comments2Replies[comment.id] : [],
                    likeEnable: likes.indexOf(comment.id) != -1
                };

                if(comments1Replies[comment.replyTo])
                    comments1Replies[comment.replyTo].push(thisComment);
                else
                    comments1Replies[comment.replyTo] = [thisComment];
            });

            step1Comments.forEach(function(comment){
                let thisComment = {
                    id: comment.id,
                    _: comment,
                    replies: (comments1Replies[comment.id]) ? comments1Replies[comment.id] : [],
                    likeEnable: likes.indexOf(comment.id) != -1
                };

                Comments.push(thisComment);
            });

            return Comments;
        }else
            return [];
    }

    async getAndCheckSender(id, sender)
    {
        return (await this.model.findOne({id: id, sender: sender}));
    }

    async delete(id)
    {
        return (await this.model.deleteMany({id: id}));
    }

    async deleteByReplyIds(ids)
    {
        return (await this.model.deleteMany({replyTo: {$in: ids}}));
    }

    async deleteByIds(ids)
    {
        return (await this.model.deleteMany({id: {$in: ids}}));
    }

    async nextResultsCount(postId, time)
    {
        return (await this.model.countDocuments({postId: postId, step: 1, time: {$lt: time}}));
    }

    async getStep2ReplyData(id)
    {
        let query = await this.model.findOne({id: id, step: 2});

        if(query)
            return query;
        else
            throw null;
    }

    async getUserComments(t_id)
    {
        let query = await this.model
            .find({sender: t_id})
            .sort({step: -1})
            .exec();

        return query;
    }

    async deleteByTid(t_id)
    {
        return (await this.model.deleteMany({sender: t_id}));
    }

    async getReplies(commentIds)
    {
        return (await this.model.distinct('id', {replyTo: {$in: commentIds}}))
    }
}

module.exports = Comments;