const config = require('./inc/config');
const model = require('./inc/models/all');

const Text = require('./inc/text');
const text = new Text();

const Helper = require('./inc/helper');
const helper = new Helper();

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.adminToken);

async function Send(Post)
{
    return new Promise(async function (resolve, reject) {
        try {
            var postId = helper.createId();
            var messageOptions = {
                parse_mode: "HTML",
                disable_web_page_preview: true
            };

            let keyboard = (Post.link)
                ? [[{text: Post.buttonText, url: Post.link}]]
                : [[{text: text.commentsPostButtons(0), url: `https://t.me/${config.username}?start=cmnt${postId}`}]]

            messageOptions.reply_markup = JSON.stringify({
                inline_keyboard: keyboard
            });

            var messageData;
            if(Post.text)
                messageData = await bot.sendMessage(config.channel, Post.text, messageOptions);
            else
            {
                if(Post.caption) messageOptions.caption = Post.caption;

                if(Post.photo)
                    messageData = await bot.sendPhoto(config.channel, Post.photo, messageOptions);
                else if(Post.document)
                    messageData = await bot.sendDocument(config.channel, Post.document, messageOptions);
                else if(Post.video)
                    messageData = await bot.sendVideo(config.channel, Post.video, messageOptions);
                else if(Post.audio)
                    messageData = await bot.sendAudio(config.channel, Post.audio, messageOptions);
                else if(Post.voice)
                    messageData = await bot.sendVoice(config.channel, Post.voice, messageOptions);
                else if(Post.poll)
                {
                    var poll = JSON.parse(Post.poll);
                    messageData = await bot.sendPoll(config.channel, poll.question, JSON.stringify(poll.answers), messageOptions);
                }
            }

            if(Post.link)
                resolve({messageId: messageData.message_id});
            else
                resolve({messageId: messageData.message_id, postId: postId});
        }catch (e) {
            reject(e);
        }
    });
}

setInterval(async function(){
    var nowTimestamp = helper.nowTime();
    var Post = await model.WaitingPosts.get(nowTimestamp);

    if(Post[0])
    {
        await model.WaitingPosts.delete(Post[0]._id);
        var callbackData = await Send(Post[0]);

        if(callbackData.postId)
            model.Posts.new({
                id: callbackData.postId,
                messageId: callbackData.messageId,
                sendTime: nowTimestamp
            });
    }
}, 5000);