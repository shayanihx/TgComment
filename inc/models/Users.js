const mongoose = require('mongoose');

class Users
{
    constructor(connection)
    {
        const collectionName = 'Users';

        const schema = new mongoose.Schema({
            t_id: {type: Number, required: true, unique: true},
            pass: {type: String, required: true, unique: true},
            photo: {type: String},
            photoFileId : {type: String},
            photoBg: {type: Number},
            name: {type: String, required: true},
            username: {type: String},
            updateTime: {type: String, required: true},
            signupTime: {type: Number, required: true},
            process: {type: String},
            status: {type: Boolean, required: true, default: true},
            block: {type: Boolean, required: true, default: false},
            reqsInMin: {type: Number, required: true, default: 0},
            invitesCount: {type: Number, required: true, default: 0}
        },{collection: collectionName});

        this.model = connection.model(collectionName, schema);
    }

    async get(t_id)
    {
        return (await this.model.findOne({t_id: t_id}));
    }

    async new(data)
    {
        return (await new this.model(data).save());
    }

    async update(id, data)
    {
        return (await this.model.updateOne({_id: id}, data));
    }

    async updateByTid(t_id, data)
    {
        return (await this.model.updateOne({t_id: t_id}, data));
    }

    async exists(t_id)
    {
        let count = await this.model.countDocuments({t_id: t_id});
        return count > 0;
    }

    async resetReqsCount()
    {
        return (await this.model.updateMany({}, {reqsInMin: 0}));
    }

    async checkPass(t_id, pass)
    {
        let count = await this.model.countDocuments({t_id: t_id, pass: pass});
        return count > 0;
    }

    async getByIdAndPass(t_id, pass)
    {
        return (await this.model.findOne({t_id: t_id, pass: pass}));
    }
}

module.exports = Users;