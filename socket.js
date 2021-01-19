const config = require('./inc/config');
const model = require('./inc/models/all');

const Text = require('./inc/text');
const text = new Text();

const Helper = require('./inc/helper');
const helper = new Helper();

const path = require('path');
const express = require('express');
const app = express();

const EventEmitter = require('events');
const event = new EventEmitter();

// const http = require('http');
// const server = http.createServer(app);
// const ws = server.listen(3051 , '0.0.0.0');

const io = require('socket.io')(3051)

const TelegramBot = require('node-telegram-bot-api');
const adminBot = new TelegramBot(config.adminToken);
const bot = new TelegramBot(config.token);

model.SocketClients.deleteAll();

io.on('connection', function(socket){
    let getParams = socket.request._query;
    let isBotServer = typeof getParams.adminPass != 'undefined' && getParams.adminPass == config.socketAdminPass;

    if(isBotServer || getParams.pid)
    {
        if(!isBotServer)
        {
            socket.join(`post${getParams.pid}`);

            model.SocketClients.new({
                socketId: socket.id,
                t_id: (getParams.id) ? getParams.id : null,
                time: helper.nowTime()
            });
        }

        socket.use(async function(packet, next){
            let eventType = 'error',
                eventData = {socket: socket};

            if(eventType == 'disconnect')
                return next();

            try {
                if(packet[1] && packet[1].user)
                {
                    packet[1].user = helper.strToObj(packet[1].user);
                    if(packet[1].user.id || packet[1].user.ps)
                    {
                        let userTid = (packet[1].user.id) ? packet[1].user.id : null,
                            pass = (packet[1].user.ps) ? packet[1].user.ps : null;

                        let userData = await model.Users.getByIdAndPass(userTid, pass);
                        if(userData)
                        {
                            if(isBotServer)
                            {
                                socket.isBotServer = true;
                                socket.sendTo8536f = userData.t_id;
                            }

                            if(isBotServer || userData.reqsInMin < 30)
                            {
                                if(!userData.block)
                                {
                                    model.Users.update(userData._id, {$inc: {reqsInMin: 1}});

                                    let pakcet1 = packet[1].user;

                                    delete packet[1].user;
                                    packet[1].pid = pakcet1.pid;

                                    eventType = packet[0];
                                    eventData = {
                                        socket: socket,
                                        userData: userData,
                                        data: packet[1]
                                    };
                                }else
                                    eventData.type = 'blocked_user';
                            }else
                                eventData.type = 'reqs_count_error';
                        }else
                            eventData.type = 'anonymous_error';
                    }else
                    {
                        if(packet[0] == 'more-result')
                        {
                            let pakcet1 = packet[1].user;

                            delete packet[1].user;
                            packet[1].pid = pakcet1.pid;

                            eventType = packet[0];
                            eventData = {
                                socket: socket,
                                userData: {t_id: null},
                                data: packet[1]
                            };
                        }else
                            eventData.type = 'user_not_found';
                    }
                }
            }catch (e) {
                eventData.type = 'anonymous_error';
            }

            event.emit(eventType, eventData);
        });

        socket.on('disconnect', function(){
            model.SocketClients.delete(socket.id);
        });
    }else
        event.emit('error', {socket: socket, type: 'authorization_error'});
});

event.on('error', function(req){
    let type = (req.type) ? req.type : 'anonymous_error';

    if(req.socket.sendTo8536f)
        req.socket.emit('client-error', {to: req.socket.sendTo8536f, msg: text.socketErrors(type)});
    else
        req.socket.emit('client-error', text.socketErrors(type));
});

event.on('new', async function(req){
    try {
        
        if(req.data.text && req.data.replyTo)
        {
            if(req.data.text.trim() != '')
            {
                let postData = await model.Posts.get(req.data.pid);

                let replyToLength = req.data.replyTo.length;
                let replyTo = (replyToLength) ? req.data.replyTo[replyToLength - 1] : null;

                let blockLicense = true;
                if(replyTo)
                {
                    var replyToComment = await model.Comments.getById(replyTo);

                    if(replyToComment)
                        blockLicense = !(await model.Blocks.exists(replyToComment.sender, req.data.id));
                    else
                        throw null;
                }

                if(blockLicense)
                {
                    if(helper.checkLink(req.data.text))
                    {
                        if(helper.checkBadWords(req.data.text))
                        {
                            let commentText = helper.xssFilter(req.data.text.trim());

                            let broadcastNotiOptions = {
                                parse_mode: 'HTML',
                                disable_web_page_preview: true
                            };

                            let broadcastNotiMessageId;
                            if(req.data.message_id && req.socket.isBotServer)
                            {
                                broadcastNotiMessageId = req.data.message_id;

                                model.Users.updateByTid(req.userData.t_id, {process: null});
                                if(replyTo)
                                    bot.sendMessage(req.userData.t_id, text.replySended(), {reply_markup: {'remove_keyboard': true}});
                                else
                                    bot.sendMessage(req.userData.t_id, text.commentSaved(), {reply_markup: {'remove_keyboard': true}});
                            }else
                            {
                                let notiData = await bot.sendMessage(req.userData.t_id, text.savedNoti(req.data.text, postData.messageId), broadcastNotiOptions);
                                broadcastNotiMessageId = notiData.message_id;
                            }

                            let newCommentData = {
                                id: helper.createId(),
                                postId: req.data.pid,
                                sender: req.userData.t_id,
                                senderName: req.userData.name,
                                senderPhoto: req.userData.photo,
                                senderPhotoBg: req.userData.photoBg,
                                time: helper.nowTime(),
                                text: commentText,
                                step: replyToLength + 1,
                                replyTo: replyTo,
                                notiMessageId: broadcastNotiMessageId
                            };

                            await model.Comments.new(newCommentData);
                            await model.Posts.addCommentNum(req.data.pid, replyToLength);

                            if(replyToLength)
                                await model.Comments.addRepliesNum(req.data.replyTo);

                            newCommentData.repliesCount = 0;
                            newCommentData.likesCount = 0;

                            let passData = {
                                id: newCommentData.id,
                                _: newCommentData,
                                likeEnable: false,
                                replies: [],
                            };

                            io.to(`post${req.data.pid}`).emit('client-new', passData);

                            if(!postData.bannerPost)
                            {
                                adminBot.editMessageReplyMarkup(helper.createLoginUrlKeyboard(postData.id, postData.commentsCount + 1), {
                                    chat_id: config.channel,
                                    message_id: postData.messageId
                                });
                            }

                            if(replyTo && replyToComment.sender != req.userData.t_id)
                            {
                                let replySenderNoti = text.replyNoti(req.userData.name, req.data.text);
                                let keyboard = [];

                                if(replyToComment.step == 1)
                                    keyboard.push([{text: '📝 ارسال ریپلای', callback_data: `/Reply${newCommentData.id}`}]);

                                keyboard.push([{text: '📨 درخواست چت', callback_data: `/Request${req.userData.t_id}`}]);

                                let replySenderMessageOptions = {
                                    reply_to_message_id: replyToComment.notiMessageId,
                                    reply_markup: JSON.stringify({
                                        inline_keyboard: keyboard
                                    })
                                };

                                bot.sendMessage(replyToComment.sender, replySenderNoti, replySenderMessageOptions);
                            }

                            let managerChannelMsg = `💬 ${req.data.text}\n\n<a href="https://t.me/${config.channel.replace('@', '')}/${postData.messageId}">Post Link</a>`;
                            let managerChannelMessageOptions = {
                                parse_mode: 'HTML',
                                disable_web_page_preview: true,
                                reply_markup: JSON.stringify({
                                    inline_keyboard: [[
                                        {text: '❌', callback_data: `/Block${req.userData.t_id}`},
                                        {text: '⚠️', callback_data: `/Warning${newCommentData.id}`},
                                        {text: '❎', callback_data: `/Del${newCommentData.id}`}
                                    ]]
                                })
                            };

                            adminBot.sendMessage(config.managerChannel, managerChannelMsg, managerChannelMessageOptions);
                        }else
                            event.emit('error', {socket: req.socket, type: 'badwords_error'});
                    }else
                        event.emit('error', {socket: req.socket, type: 'link_error'});
                }else
                    event.emit('error', {socket: req.socket, type: 'sender_block'});
            }else
                throw null;
        }
    }catch (e) {
        event.emit('error', {socket: req.socket});
    }
});

event.on('edit', async function(req){
    try {
        if(req.data.text && req.data.editId)
        {
            if(req.data.trim() != '')
            {
                if(await model.Comments.checkSender(req.data.editId, req.userData.t_id))
                {
                    let commentText = helper.xssFilter(req.data.text.trim());

                    if(helper.checkLink(commentText))
                    {
                        if(helper.checkBadWords(commentText))
                        {
                            model.Comments.update(req.data.editId, {text: commentText});

                            io.to(`post${req.data.pid}`).emit('client-edited', {
                                id: req.data.editId,
                                newText: commentText,
                                sender: req.userData.t_id
                            });
                        }else
                            event.emit('error', {socket: req.socket, type: 'badwords_error'});
                    }else
                        event.emit('error', {socket: req.socket, type: 'link_error'});
                }else
                    throw null;
            }else
                throw null;
        }
    }catch (e) {
        event.emit('error', {socket: req.socket});
    }
});

event.on('delete', async function(req){
    try {
        if(req.data.ln)
        {
            let commentData = (req.socket.isBotServer)
                ? await model.Comments.getById(req.data.ln)
                : await model.Comments.getAndCheckSender(req.data.ln, req.userData.t_id);

            if(commentData)
            {
                model.Comments.delete(commentData.id);
                let substract_num = (commentData.repliesCount + 1) * -1;

                if(commentData.step == 1)
                {
                    await model.Posts.substractCommentNum(commentData.postId, commentData.repliesCount, 1);

                    if(commentData.repliesCount)
                    {
                        let repliesStep2 = await model.Comments.getReplies([commentData.id]);
                        model.Comments.deleteByReplyIds([commentData.id]);

                        if(repliesStep2.length != commentData.repliesCount)
                        {
                            let repliesStep3 = await model.Comments.getReplies(repliesStep2);
                            model.Comments.deleteByIds(repliesStep3);
                        }
                    }
                }else if(commentData.step == 2)
                {
                    await model.Posts.substractCommentNum(commentData.postId, commentData.repliesCount, 0);
                    model.Comments.update(commentData.replyTo, {$inc: {repliesCount: substract_num}});

                    if(commentData.repliesCount)
                    {
                        let repliesStep3 = await model.Comments.getReplies([commentData.id]);
                        model.Comments.deleteByIds(repliesStep3);
                    }
                }else if(commentData.step == 3)
                {
                    let step2Data = await model.Comments.getById(commentData.replyTo);
                    model.Comments.update(step2Data.replyTo, {$inc: {repliesCount: substract_num}});

                    await model.Posts.substractCommentNum(commentData.postId, 0, 0);
                    model.Comments.update(commentData.replyTo, {$inc: {repliesCount: substract_num}});
                }

                io.to(`post${req.data.pid}`).emit('client-deleted', {
                    id: commentData.id,
                    step: commentData.step,
                    substractNum: substract_num
                });

                let newPostData = await model.Posts.get(commentData.postId);
                if(!newPostData.bannerPost)
                {
                    adminBot.editMessageReplyMarkup(helper.createLoginUrlKeyboard(newPostData.id, newPostData.commentsCount), {
                        chat_id: config.channel,
                        message_id: newPostData.messageId
                    });
                }
            }else
                throw null;
        }else
            throw null;
    }catch (e) {
        event.emit('error', {socket: req.socket});
    }
});

event.on('like', async function(req){
    try {
        if(req.data.ln)
        {
            let commentData = await model.Comments.getById(req.data.ln);
            let newNum;

            if(commentData)
            {
                let likeExists = await model.Likes.exists(req.userData.t_id, commentData.id);

                if(likeExists)
                {
                    newNum = commentData.likesCount - 1;

                    model.Likes.delete(req.userData.t_id, commentData.id);
                    model.Comments.update(commentData.id, {$inc: {likesCount: -1}});
                }else
                {
                    newNum = commentData.likesCount + 1;

                    model.Likes.new({
                        t_id: req.userData.t_id,
                        commentId: commentData.id,
                        postId: commentData.postId
                    });

                    model.Comments.update(commentData.id, {$inc: {likesCount: 1}});
                }

                io.to(`post${req.data.pid}`).emit('client-like', {
                    userId: req.userData.t_id,
                    id: commentData.id,
                    num: newNum
                });
            }else
                throw null;
        }else
            throw null;
    }catch (e) {
        event.emit('error', {socket: req.socket});
    }
});

event.on('more-result', async function(req){
    try {
        if(req.data.jd)
        {
            let jd = (req.data.jd != 'null') ? req.data.jd : null;
            let Comments = await model.Comments.getCommentsAndReplies(req.data.pid, req.userData.t_id, model.Likes, jd);

            if(Comments.length)
            {
                let nextResultsCount = await model.Comments.nextResultsCount(req.data.pid, Comments[0]._.time);

                req.socket.emit('client-more', {
                    comments: Comments,
                    moreResultsCount: (nextResultsCount > config.commentLimit) ? config.commentLimit : nextResultsCount
                });
            }else
                req.socket.emit('client-more', {comments: 'no_result'});
        }else
            throw null;
    }catch (e) {
        event.emit('error', {socket: req.socket});
    }
});

event.on('request', async function(req){
    try {
        if(req.data.to && req.data.to != req.userData.t_id)
        {
            let from = req.userData;
            let to = req.data.to;

            let relationExists = await model.Relations.exists(from.t_id, to);
            if(!relationExists)
            {
                let requestExists = await model.Requests.exists(from.t_id, to);
                if(!requestExists)
                {
                    req.socket.emit('client-success-request');

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
                    event.emit('error', {socket: req.socket, type: 'request_exists'})
            }else
                event.emit('error', {socket: req.socket, type: 'relation_exists'});
        }else
            throw null;
    }catch (e) {
        event.emit('error', {socket: req.socket});
    }
});

