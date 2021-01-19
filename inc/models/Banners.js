const mongoose = require('mongoose');
const mongoRand = require('mongoose-simple-random');

class Banners
{
    constructor(connection)
    {
        const collectionName = 'Banners';

        const schema = new mongoose.Schema({
            text: {type: String},
            photo: {type: String},
            postId: {type: Number, required: true, unique: true}
        },{collection: collectionName});

        schema.plugin(mongoRand);
        this.model = connection.model(collectionName, schema);
    }

    async new(data)
    {
        return (await new this.model(data).save());
    }

    async get(postsModel)
    {
        return new Promise((async (resolve, reject) => {
            this.model.findRandom({}, {}, {limit: 1}, async function(e, banner){
                if(e)
                    reject(e);

                if(banner && banner[0])
                {
                    let postData = await postsModel.get(banner[0].postId);

                    if(postData)
                        resolve({_: banner[0], commentsCount: postData.commentsCount});
                    else
                        reject();
                }else
                    reject();
            })
        }));
    }
}

module.exports = Banners;