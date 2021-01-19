const config = require('./inc/config');
const model = require('./inc/models/all');

const socket = require('socket.io-client')(`http://localhost:3051`, {query: `adminPass=${config.socketAdminPass}`});
const TelegramBot = require('node-telegram-bot-api');

// const webhookOptions = {
//     webHook: {
//         port: 8443,
//         host: '194.5.193.231',
//         cert: '/etc/cert/ip194/public.pem',
//         key: '/etc/cert/ip194/private.key'
//     }
// };

const bot = new TelegramBot(config.token);
const adminBot = new TelegramBot(config.adminToken);

const Helper = require('./inc/helper');
const helper = new Helper(bot);

const Text = require('./inc/text');
const text = new Text();

function CancelKeyboard()
{
    return helper.createReplyMarkup([['❎ بیخیال']]);
}

async function SendProcess(user, msg)
{
    if(true) //user.invitesCount >= config.invitesCount
    {
        let to, message_id = null;

        if(msg.data.indexOf('/Request') != -1)
            to = msg.data.replace('/Request', '');
        else
        {
            let splitData = msg.data.split('-');
            to = splitData[0].replace('/Snd', '');
            message_id = (splitData[1]) ? parseInt(splitData[1]) : null;
        }

        if(await model.Requests.exists(user.t_id, to))
        {
            let block = await model.Blocks.exists(to, user.t_id)

            if(!block)
            {
                bot.answerCallbackQuery(msg.id);

                let newProcess = {
                    type: 'SendPm',
                    to: to,
                    message_id: message_id
                };

                model.Users.update(user._id, {process: JSON.stringify(newProcess)});

                var messageOptions = CancelKeyboard();
                messageOptions.reply_to_message_id = msg.message.message_id;

                bot.sendMessage(msg.from.id, text.sendPm(), messageOptions);
            }else
                bot.answerCallbackQuery(msg.id, {text: '🚫 این کاربر شما را بلاک کرده است'});
        }else
            throw null;
    }else
    {
        bot.answerCallbackQuery(msg.id);

        let keyboard = helper.createKeyboard([[ {text: 'بزن بریم', callback_data: '/CreateLink'} ]]);
        bot.sendMessage(msg.from.id, text.vipError(), keyboard);
    }
}

async function showCommentMsg(t_id, postId, pass)
{
    let keyboard = helper.createKeyboard([[ {text: 'بزن بریم', url: `${config.domain}/?pid=${postId}&id=${t_id}&ps=${pass}`} ]]);
    await bot.sendMessage(t_id, text.showAllComments(), keyboard);
}

bot.on('message', async function(msg){
    try {
        let user = await model.Users.get(msg.from.id);

        if(user)
        {
            if(user.block)
                return;

            if(helper.nowTime() - user.updateTime > 172800)
            {
                let lastName = (msg.from.last_name) ? ` ${msg.from.last_name}` : '';
                let newUserData = {
                    name: `${msg.from.first_name} ${lastName}`,
                    username: (msg.from.username) ? msg.from.username : null,
                    updateTime: helper.nowTime(),
                    process: user.process
                };

                let userPhoto = await helper.getUserPhoto(msg.from.id);
                if(userPhoto && userPhoto != user.photoFileId)
                {
                    newUserData.photo = `${helper.createId()}.jpg`;
                    newUserData.photoFileId = userPhoto;
                    newUserData.photoBg = null;

                    helper.downloadUserImg(userPhoto, newUserData.photo);
                }else
                {
                    newUserData.photoBg = helper.randomInt(1, 5);
                    newUserData.photo = null;
                    newUserData.photoFileId = null;
                }

                model.Users.update(user._id, newUserData);
            }

            let startParam = helper.getStartParam(msg);
            if(await helper.memberExists(msg.from.id))
            {
                if(startParam)
                {
                    if(startParam.indexOf('cmnt') != -1)
                    {
                        let postId = startParam.replace('cmnt', '');

                        let newProcess = JSON.stringify({type: 'NewComment', postId: postId});
                        await model.Users.update(user._id, {process: newProcess});

                        await showCommentMsg(msg.from.id, postId, user.pass);
                        bot.sendMessage(msg.from.id, text.sendCommentText(), CancelKeyboard());
                    }
                }else if(user.process)
                {
                    let process = JSON.parse(user.process);

                    if(msg.text && msg.text == '❎ بیخیال')
                    {
                        model.Users.update(user._id, {process: null});

                        let removeKeyboard = {reply_markup: {'remove_keyboard': true}};
                        bot.sendMessage(msg.from.id, text.processCancel(), removeKeyboard);

                        return;
                    }

                    if(process.type == 'NewComment')
                    {
                        if(msg.text)
                        {
                            if(msg.text.indexOf('/start') == -1)
                            {
                                let postData = await model.Posts.get(process.postId);

                                socket.emit('new', {
                                    user: `id=${msg.from.id}&pid=${postData.id}&ps=${user.pass}`,
                                    text: msg.text,
                                    replyTo: [],
                                    message_id: msg.message_id
                                });
                            }
                        }else
                            bot.sendMessage(msg.from.id, text.onlyTextError(), CancelKeyboard());
                    }else if(process.type == 'SendReply')
                    {
                        if(msg.text)
                        {
                            if(msg.text.indexOf('/start') == -1)
                            {
                                let commentData = await model.Comments.getStep2ReplyData(process.commentId);

                                socket.emit('new', {
                                    user: `id=${msg.from.id}&pid=${commentData.postId}`,
                                    text: msg.text,
                                    replyTo: [commentData.replyTo, commentData.id],
                                    message_id: msg.message_id
                                });
                            }
                        }else
                            bot.sendMessage(msg.from.id, text.onlyTextError(), CancelKeyboard());
                    }else if(process.type == 'SendPm')
                    {
                        if(msg.text)
                        {
                            if(helper.checkBadWords(msg.text))
                            {
                                model.Users.update(user._id, {process: null});
                                bot.sendMessage(msg.from.id, text.pmSended(), {reply_markup: {'remove_keyboard': true}});

                                let notiMessage = '🔔 پیام جدید از ' + user.name + '\n' + '\n' + '✏️ متن پیام: ' + msg.text;
                                let notiMessageOptions = helper.createKeyboard([
                                    [{text: '✉️ ارسال پیام خصوصی', callback_data: `/Snd${msg.from.id}-${msg.message_id}`}],
                                    [{text: 'بلاک', callback_data: `/Block${msg.from.id}`}]
                                ]);

                                if(process.message_id)
                                    notiMessageOptions.reply_to_message_id = process.message_id;

                                bot.sendMessage(process.to, notiMessage, notiMessageOptions);
                            }else
                                bot.sendMessage(msg.from.id, text.socketErrors('badwords_error'), CancelKeyboard());
                        }else
                            bot.sendMessage(msg.from.id, text.onlyTextError(), CancelKeyboard());
                    }
                }else
                    bot.sendMessage(msg.from.id, text.iDontUnderstand());
            }else
            {
                if(startParam.indexOf('cmnt') != -1)
                {
                    let postId = startParam.replace('cmnt', '');

                    let keyboard = helper.createKeyboard([[ {text: 'عضو شدم و ارسال کامنت', callback_data: `/Join${postId}`} ]]);
                    bot.sendMessage(msg.from.id, text.sendCommentJoinError(), keyboard);
                }else
                    bot.sendMessage(msg.from.id, text.iDontUnderstand(), {reply_markup: {'remove_keyboard': true}});
            }
        }else
        {
            let lastName = (msg.from.last_name) ? ` ${msg.from.last_name}` : '';
            let newUserData = {
                t_id: msg.from.id,
                pass: helper.generatePass(),
                name: `${msg.from.first_name} ${lastName}`,
                username: (msg.from.username) ? msg.from.username : null,
                signupTime: helper.nowTime(),
                updateTime: helper.nowTime()
            };

            let startParam = helper.getStartParam(msg);
            if(startParam)
            {
                if(startParam.indexOf('cmnt') != -1)
                {
                    let postId = startParam.replace('cmnt', '');

                    if(await helper.memberExists(msg.from.id))
                    {
                        newUserData.process = JSON.stringify({type: 'NewComment', postId: postId});

                        await showCommentMsg(msg.from.id, postId, newUserData.pass);
                        await bot.sendMessage(msg.from.id, text.sendCommentText(), CancelKeyboard());
                    }else
                    {
                        let keyboard = helper.createKeyboard([[ {text: 'عضو شدم و ارسال کامنت', callback_data: `/Join${postId}`} ]]);
                        bot.sendMessage(msg.from.id, text.sendCommentJoinError(), keyboard);
                    }
                }
            }else
                bot.sendMessage(msg.from.id, text.newUser());

            let userPhoto = await helper.getUserPhoto(msg.from.id);
            if(userPhoto)
            {
                newUserData.photo = `${helper.createId()}.jpg`;
                newUserData.photoFileId = userPhoto;

                helper.downloadUserImg(userPhoto, newUserData.photo);
            }else
                newUserData.photoBg = helper.randomInt(1, 5);

            model.Users.new(newUserData);
        }
    }catch (e) {
        bot.sendMessage(msg.from.id, text.error());
    }
});

bot.on('callback_query', async function(msg){
    try {
        let user = await model.Users.get(msg.from.id);

        if(user)
        {
            if(user.block)
                return;

            if(await helper.memberExists(msg.from.id))
            {
                if(msg.data.indexOf('/Join') != -1)
                {
                    bot.answerCallbackQuery(msg.id, {text: '✅ عضویت شما تایید شد'});
                    bot.deleteMessage(msg.from.id, msg.message.message_id);

                    let postId = msg.data.replace('/Join', '');
                    if(postId != '')
                    {
                        model.Users.update(user._id, {process: JSON.stringify({type: 'NewComment', postId: postId})});

                        await showCommentMsg(msg.from.id, postId, user.pass);
                        bot.sendMessage(msg.from.id, text.sendCommentText(), CancelKeyboard());
                    }
                }else if(msg.data.indexOf('/Reply') != -1)
                {
                    let commentId = msg.data.replace('/Reply', '');
                    let commentData = await model.Comments.getStep2ReplyData(commentId);

                    let newProcess = {
                        type: 'SendReply',
                        commentId: commentData.id
                    };

                    model.Users.update(user._id, {process: JSON.stringify(newProcess)});

                    let newInlineKeyboard = JSON.stringify({
                        inline_keyboard: [msg.message.reply_markup.inline_keyboard[1]]
                    })

                    bot.editMessageReplyMarkup(newInlineKeyboard, {
                        chat_id: msg.from.id,
                        message_id: msg.message.message_id
                    });

                    var messageOptions = CancelKeyboard();
                    messageOptions.reply_to_message_id = msg.message.message_id;

                    bot.sendMessage(msg.from.id, text.sendReply(), messageOptions);
                }else if(msg.data.indexOf('/Request') != -1)
                {
                    let to = msg.data.replace('/Request', '');

                    if(to != msg.from.id)
                    {
                        let from = user;

                        let relationExists = await model.Relations.exists(from.t_id, to);
                        if(!relationExists)
                        {
                            let requestExists = await model.Requests.exists(from.t_id, to);
                            if(!requestExists)
                            {
                                bot.answerCallbackQuery(msg.id, {text: '✅ درخواست با موفقیت ارسال شد'});

                                let fromPhoto = (from.photo) ? from.photo : 'no_image.png';
                                fromPhoto = helper.getPhoto(fromPhoto);

                                let notiOptions = {
                                    caption: text.requestNoti(from.name),
                                    reply_markup: JSON.stringify({
                                        inline_keyboard: [[{text: '✅ قبول درخواست', callback_data: `/Accept${from.t_id}`}]]
                                    })
                                };

                                bot.sendPhoto(to, fromPhoto, notiOptions);
                                model.Requests.new(from.t_id, to);
                            }else
                                bot.answerCallbackQuery(msg.id, {text: `❎ ${text.socketErrors('request_exists')}`});
                        }else
                            SendProcess(user, msg);
                    }else
                        throw null;
                }else if(msg.data.indexOf('/Accept') != -1)
                {
                    let t_id = msg.data.replace('/Accept', '');

                    if(await model.Users.exists(t_id))
                    {
                        let relationExists = await model.Relations.exists(msg.from.id, t_id);

                        if(!relationExists)
                            model.Relations.new(msg.from.id, t_id);

                        let newKeyboard = JSON.stringify({
                            inline_keyboard: [[ {text: '✉️ ارسال پیام خصوصی', callback_data: `/Snd${t_id}`} ]]
                        });
                        bot.editMessageReplyMarkup(newKeyboard, {chat_id: msg.from.id, message_id: msg.message.message_id});

                        let userPhoto = (user.photo) ? user.photo : 'no_image.png';
                        userPhoto = helper.getPhoto(userPhoto);

                        let photoOptions = {
                            caption: text.requestAccepted(user.name),
                            reply_markup: JSON.stringify({
                                inline_keyboard: [[ {text: '✉️ ارسال پیام خصوصی', callback_data: `/Snd${user.t_id}`} ]]
                            })
                        };

                        bot.sendPhoto(t_id, userPhoto, photoOptions);
                    }else
                        throw null;
                }else if(msg.data.indexOf('/Snd') != -1)
                    SendProcess(user, msg);
                else if(msg.data.indexOf('/Block') != -1)
                {
                    var unblock = msg.data.indexOf('/unBlock') != -1;
                    var currentInlineKeyboard = msg.message.reply_markup.inline_keyboard;
                    var notiText, t_id;

                    if(unblock)
                    {
                        t_id = msg.data.replace('/unBlock', '');
                        notiText = '✅ این کاربر با موفقیت آن بلاک شد';
                        currentInlineKeyboard[1][0] = {text: 'بلاک', callback_data: `/Block${t_id}`};
                    }else
                    {
                        t_id = msg.data.replace('/Block', '');
                        notiText = '✅ این کاربر با موفقیت بلاک شد';
                        currentInlineKeyboard[1][0] = {text: 'آن بلاک', callback_data: `/unBlock${t_id}`};
                    }

                    bot.answerCallbackQuery(msg.id, {text: notiText});

                    var newKeyboard = JSON.stringify({ inline_keyboard: currentInlineKeyboard })
                    var editOptions = {chat_id: msg.from.id, message_id: msg.message.message_id};
                    bot.editMessageReplyMarkup(newKeyboard, editOptions);

                    var queryData = {tid: msg.from.id, blockedTid: t_id};
                    model.Blocks.delete(queryData);

                    if(!unblock)
                        model.Blocks.new(queryData);
                }
            }else
            {
                if(msg.data.indexOf('/Join') != -1)
                    bot.answerCallbackQuery(msg.id, {text: '❎ شما هنوز عضو کانال نشده اید'});
                else
                {
                    bot.answerCallbackQuery(msg.id);

                    let keyboard = helper.createKeyboard([[{text: 'عضو شدم', callback_data: '/Join'}]]);
                    bot.sendMessage(msg.from.id, text.joinError(), keyboard);
                }
            }
        }else
            throw null;
    }catch (e) {
        console.log(ex)
        bot.sendMessage(msg.from.id, text.error());
    }
});

socket.on('client-error', function(data){
    bot.sendMessage(data.to, data.msg);
});

bot.startPolling();