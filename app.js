const filesVersion = 1.9;

const config = require('./inc/config');
const model = require('./inc/models/all');

const Text = require('./inc/text');
const text = new Text();

const Helper = require('./inc/helper');
const helper = new Helper();

const path = require('path');
const express = require('express');
const app = express();

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.token);

app.set('view engine', 'pug');
app.use('/static', express.static(path.join(__dirname, 'inc/views/static/')));

app.get('/', async function(req, res, next){
    try {
        const data = req.query;

        if(data.pid)
        {
            if(data.id || data.ps)
            {
                let userId = (data.id) ? data.id : null,
                    pass = (data.ps) ? data.ps : null;

                let check = await model.Users.checkPass(userId, pass);
                if(!check) throw null;
            }

            const post = await model.Posts.get(data.pid);
            let comments = '';

            if(post.commentsCount > 0)
            {
                let commentsQuery = await model.Comments.getCommentsAndReplies(data.pid, data.id, model.Likes);

                commentsQuery.forEach(function(comment){
                    comments += helper.dataToHtml(comment, data.id);
                });
            }

            let notLoadedCommentsCount = post.commentsCountWithoutReplies - config.commentLimit;
            const viewData = {
                t_id: data.id,
                comments: comments,
                staticDirUrl: config.staticDirUrl,
                title: text.pageTitle(post.messageId),
                postLink: `https://t.me/${config.channel.replace('@', '')}/${post.messageId}`,
                commentsCount: post.commentsCount,
                moreResultsCount: (notLoadedCommentsCount > config.commentLimit) ? config.commentLimit : notLoadedCommentsCount,
                bannerPost: post.bannerPost,
                appVersion: filesVersion
            };

            res.render(path.join(__dirname, 'inc/views/index.pug'), viewData);
        }else
            next();
    }catch (e) {
        next();
    }
});

app.use(function(req, res, next){
    res.sendFile(path.join(__dirname, '/inc/views/error.html'));
});

app.listen(3050, '127.0.0.1');