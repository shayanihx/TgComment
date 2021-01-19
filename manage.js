const config = require('./inc/config');
const model = require('./inc/models/all');

const socket = require('socket.io-client')(`http://localhost:3051`, {query: `adminPass=${config.socketAdminPass}`});
const Helper = require('./inc/helper');
const helper = new Helper();

const Text = require('./inc/text');
const text = new Text();

const timestamp = require('unix-timestamp');
const moment = require('moment');

const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(config.adminToken, {polling: true});
const clientBot = new TelegramBot(config.token);

bot.on('message', async function(msg){
    var admin = await model.Admins.get(msg.from.id);

    if(admin)
    {
        if (admin.process)
        {
            if(msg.text)
            {
                if(msg.text == '❎ کنسل')
                {
                    model.Admins.update(admin._id, {process: null});

                    var keyboard = {reply_markup: {remove_keyboard: true}};
                    bot.sendMessage(msg.from.id, '✅ کنسل شد', keyboard);
                }else
                {
                    var processData = JSON.parse(admin.process);
                    if(processData.buttonText == null)
                    {
                        processData.buttonText = msg.text;
                        model.Admins.update(admin._id, {process: JSON.stringify(processData)});

                        var keyboard = {
                            reply_markup: {
                                "keyboard": [["❎ کنسل"]],
                                "resize_keyboard": true
                            }
                        };

                        bot.sendMessage(msg.from.id, '🔰 لینک مورد نظر رو بفرست', keyboard);
                    }else if(processData.link == null)
                    {
                        model.Admins.update(admin._id, {process: null});
                        model.WaitingPosts.updateByMessageId(processData.messageId, {buttonText: processData.buttonText, link: msg.text});

                        var keyboard = {reply_markup: {remove_keyboard: true}};
                        bot.sendMessage(msg.from.id, '✅ ثبت شد', keyboard);
                    }
                }
            }

            return;
        }

        if(msg.reply_to_message)
        {
            var replyData = msg.reply_to_message;

            if(/^([01]?[0-9]|2[0-3]):([0-9]?|[0-5][0-9])$/.test(msg.text))
            {
                var newPost = {messageId: replyData.message_id};

                var sendTime = msg.text.split(":");
                sendTime[0] = helper.addZeroBeforeNum(sendTime[0]);
                sendTime[1] = helper.addZeroBeforeNum(sendTime[1]);

                var m = moment();
                newPost.sendTimestamp = helper.toTimestamp(`${m.format("MM/DD/Y")} ${sendTime[0]}:${sendTime[1]}:00`);

                var nowTimestamp = Math.ceil(timestamp.now());
                var dayName;

                if(nowTimestamp < newPost.sendTimestamp)
                    dayName = "امروز";
                else
                {
                    dayName = "فردا";
                    newPost.sendTimestamp += 86400;
                }

                if(replyData.caption)
                    newPost.caption = replyData.caption;

                if(replyData.entities)
                    replyData.text = helper.setEntities(replyData.text, replyData.entities);
                else if(replyData.caption_entities)
                    newPost.caption = helper.setEntities(newPost.caption, replyData.caption_entities);

                if(replyData.text)
                    newPost.text = replyData.text;
                else if(replyData.photo)
                    newPost.photo = replyData.photo[replyData.photo.length-1].file_id;
                else if(replyData.document)
                    newPost.document = replyData.document.file_id;
                else if(replyData.video)
                    newPost.video = replyData.video.file_id;
                else if(replyData.audio)
                    newPost.audio = replyData.audio.file_id;
                else if(replyData.voice)
                    newPost.voice = replyData.voice.file_id;
                else if(replyData.poll)
                {
                    var pollData = {question: replyData.poll.question, answers: []};

                    replyData.poll.options.forEach(function(answer){
                        pollData.answers.push(answer.text);
                    });

                    newPost.poll = JSON.stringify(pollData);
                }

                var deleteCallback = await model.WaitingPosts.deleteByMessageId(replyData.message_id);

                if(deleteCallback.deletedCount > 0)
                    var message = `✅ زمان ارسال این پست آپدیت و ساعت ${sendTime[0]}:${sendTime[1]} ${dayName} ارسال خواهد شد.`;
                else
                    var message = `✅ این پست ساعت ${sendTime[0]}:${sendTime[1]} ${dayName} ارسال خواهد شد.`;

                message += `\n\n🗑 حذف: /Del${newPost.messageId}`;
                var messageOptions = {
                    reply_to_message_id: replyData.message_id,
                    reply_markup: JSON.stringify({
                        inline_keyboard: [[{text: 'تنظیم لینک', callback_data: `/Link${newPost.messageId}`}]]
                    })
                };

                bot.sendMessage(msg.from.id, message, messageOptions);
                model.WaitingPosts.new(newPost);
            }else
                bot.sendMessage(msg.from.id, '❎ الگوی ساعت معتبر نیست');
        }else
        {
            if(msg.text && msg.text.indexOf('/Del') != -1)
            {
                var messageId = parseInt(msg.text.replace('/Del', '').trim());
                var deleteData = await model.WaitingPosts.deleteByMessageId(messageId);

                if(deleteData.deletedCount > 0)
                    bot.sendMessage(msg.from.id, '✅ حذف شد');
                else
                    bot.sendMessage(msg.from.id, '❎ این پست قبلا حذف شده');
            }
        }
    }else
    {
        if(msg.text && msg.text.toLocaleLowerCase().indexOf("/start") != -1)
        {
            var code = msg.text.toLocaleLowerCase().replace("/start", "").trim();

            if(code == "e8fa7e3ae1cf98cb8ff1c159196703ac")
            {
                var message = "✅ این اکانت به لیست ادمین ها اضافه شد.";
                bot.sendMessage(msg.from.id, message);

                model.Admins.new({t_id: msg.from.id});
            }else
                bot.sendMessage(msg.from.id, "❎ شما ادمین نیستید");
        }else
            bot.sendMessage(msg.from.id, "❎ شما ادمین نیستید");
    }
});

bot.on('callback_query', async function(msg){
   try {
       var admin = await model.Admins.get(msg.from.id);

       if(admin)
       {
           if(msg.data.indexOf('/Link') != -1)
           {
               bot.answerCallbackQuery(msg.id);
               var messageId = msg.data.replace('/Link', '');

               var processData = JSON.stringify({messageId: messageId});
               model.Admins.update(admin._id, {process: processData});

               var keyboard = {
                   reply_markup: {
                       "keyboard": [["❎ کنسل"]],
                       "resize_keyboard": true
                   }
               };

               bot.sendMessage(msg.from.id, '🔅متن داخل دکمه رو بفرست (طولانی نباشه)', keyboard);
           }else if(msg.data.indexOf('/Block') != -1)
           {
               bot.answerCallbackQuery(msg.id, {text: 'Dn ✅'});
               bot.deleteMessage(config.managerChannel, msg.message.message_id);

               let userTid = parseInt(msg.data.replace('/Block', ''));
               model.Users.updateByTid(userTid, {block: true});

               let userComments = await model.Comments.getUserComments(userTid);
               if(userComments.length)
               {
                   for(i=0; i < userComments.length; i++)
                   {
                       let comment = userComments[i];

                       if(comment.step == 1)
                           await model.Posts.substractCommentNum(comment.postId, 0, 1);
                       else if(comment.step == 2)
                       {
                           await model.Comments.update(comment.replyTo, {$inc: {
                                   repliesCount: (comment.repliesCount + 1) * -1
                               }});

                           await model.Posts.substractCommentNum(comment.postId, comment.repliesCount, 0);
                       }else if(comment.step == 3)
                       {
                           let replyToCommentData = await model.Comments.getById(comment.replyTo);

                           if(replyToCommentData)
                           {
                               await model.Comments.update(comment.replyTo, {$inc: {
                                       repliesCount: (replyToCommentData.repliesCount + 1) * -1
                                   }});

                               await model.Posts.substractCommentNum(comment.postId, replyToCommentData.repliesCount, 0);
                           }
                       }
                   }

                   model.Comments.deleteByTid(userTid);
                   let newPostData = await model.Posts.get(userComments[0].postId);

                   if(!newPostData.bannerPost)
                       bot.editMessageReplyMarkup(helper.createLoginUrlKeyboard(newPostData.id, newPostData.commentsCount), {
                           chat_id: config.channel,
                           message_id: newPostData.messageId
                       });
               }

               clientBot.sendMessage(userTid, text.block());
           }else if(msg.data.indexOf('/Del') != -1)
           {
               bot.answerCallbackQuery(msg.id, {text: 'Dn ✅'});
               bot.deleteMessage(config.managerChannel, msg.message.message_id);

               let commentId = msg.data.replace('/Del', '');
               let commentData = await model.Comments.getById(commentId);

               if(commentData)
               {
                   let senderData = await model.Users.get(commentData.sender);

                   socket.emit('delete', {
                       user: `id=${commentData.sender}&pid=${commentData.postId}&ps=${senderData.pass}`,
                       ln: commentData.id
                   });
               }
           }else if(msg.data.indexOf('/Warning') != -1)
           {
               bot.answerCallbackQuery(msg.id, {text: 'Dn ✅'});
               bot.deleteMessage(config.managerChannel, msg.message.message_id);

               let commentId = msg.data.replace('/Warning', '');
               let commentData = await model.Comments.getById(commentId);

               if(commentData)
               {
                   let senderData = await model.Users.get(commentData.sender);

                   socket.emit('delete', {
                       user: `id=${commentData.sender}&pid=${commentData.postId}&ps=${senderData.pass}`,
                       ln: commentData.id
                   });

                   clientBot.sendMessage(commentData.sender, text.warning(), {reply_to_message_id: commentData.notiMessageId});
               }
           }
       }
   }catch (e) {
       console.log(e);
   }
});