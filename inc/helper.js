const config = require('./config');

const Text = require('./text');
const text = new Text();

const RandomInt = require('random-int');
const randomstring = require("randomstring");
const timestamp = require('unix-timestamp');
const crypto = require('crypto');
const Jimp = require('jimp');
const decode = require('urldecode');
const xss = require("xss");
const fs = require("fs");

function getTimeStr(unix)
{
    let pastTime = Math.ceil(timestamp.now()) - unix;

    if(pastTime < 180)
        return 'لحظاتی پیش';
    else if(pastTime < 3600)
        return `${Math.floor(pastTime / 60)} دقیقه پیش`;
    else if(pastTime < 86400)
        return `${Math.floor(pastTime / 3600)} ساعت پیش`;
    else
        return `${Math.floor(pastTime / 86400)} روز پیش`;
}

function dataToHtml(comment, userTid)
{
    let broadcast = userTid == comment._.sender;
    let msg = `<div class="comment">`;

    if(comment._.senderPhoto)
        msg += `<a href="#"><img src="https://darsgoo.com/static/img/u/small/${comment._.senderPhoto}" alt="${comment._.senderName}" class="user-img"></a>`;
    else
    {
        msg += `<div class="no-img bg${comment._.senderPhotoBg}">
                    <a href="#"><i>${comment._.senderName[0]}</i></a>
                </div>`;
    }

    msg += '<div class="content">';
    msg += `<p><a href="#">${comment._.senderName}</a><span>${comment._.text}</span><br class="clear"></p>`;
    msg += '<div class="options">';
    msg += `<data data-ln="${comment._.id}" data-mt="${comment._.sender}" data-jd="${comment._.time}"></data>`;

    msg += `<span class="time">${getTimeStr(comment._.time)}</span>
            <span class="line">.</span>`;

    if(broadcast)
        msg += `<button class="edit">ادیت</button>
                <span class="line">.</span>
                <button class="del">حذف</button>
                <span class="line">.</span>`;

    msg += `<button class="like ${(comment.likeEnable) ? 'enable' : 'disable'}">
                <span class="num">${comment._.likesCount}</span>
                <i class="far fa-heart"></i>
                <i class="fas fa-heart"></i>
            </button>`;

    if(comment._.step != 3)
        msg += `<span class="line">.</span>
                <button class="reply">ریپلای</button>`;

    msg += '<br class="clear">';

    if(comment.replies && comment.replies.length)
    {
        msg += `<button class="show-replies">
                    <i class="fas fa-plus"></i>
                    <span> مشاهده ریپلای ها (${comment._.repliesCount})</span>
                </button>
                <br class="clear replies-clear">`;

        msg += '<div class="replies">';
        comment.replies.forEach(function(reply){
            msg += dataToHtml(reply, userTid);
        });
        msg += '</div>'
    }

    msg += '</div>';
    msg += '</div>';
    msg += '</div>';

    return msg;
}

class Helper
{
    constructor(bot)
    {
        this.bot = (bot) ? bot : null;
    }

    addZeroBeforeNum(num)
    {
        var num = parseInt(num);
        return (num < 10) ? `0${num}` : num;
    }

    toTimestamp(strDate)
    {
        var datum = Date.parse(strDate);
        return datum/1000;
    }

    setEntities(text, entities)
    {
        var newText = text;

        var plusOffset = 0;
        entities.forEach(function(entity){
            if(entity.type == "text_link")
            {
                entity.offset += plusOffset;
                var p1 = newText.substring(0, entity.offset);

                var p2 = newText.slice(entity.offset, entity.offset + entity.length);
                p2 = `<a href="${entity.url}">${p2}</a>`;
                plusOffset += (p2.length - entity.length);

                var p3 = newText.substring(entity.offset + entity.length);
                newText = p1 + p2 + p3;
            }
        });

        return newText;
    }

    createKeyboard(keyboard)
    {
        return {
            reply_markup: JSON.stringify({
                inline_keyboard: keyboard
            })
        };
    }

    createReplyMarkup(keyboards)
    {
        return {
            reply_markup: {
                "keyboard": keyboards,
                "resize_keyboard": true
            }
        };
    }

    createLoginUrlKeyboard(postId, newNum)
    {
        return JSON.stringify({
            inline_keyboard: [[{ text: text.commentsPostButtons(newNum), url: `https://t.me/${config.username}?start=Cmnt${postId}`}]]
        });
    }

    nowTime()
    {
        return Math.ceil(timestamp.now());
    }

    checkBadWords(str)
    {
        var str = str.replace(/[\u200B-\u200D\uFEFF]/g, " ");
        var strLength = str.length;

        var badWords = ["کص", "گص", "گس", "گسس", "کسو", "کصو", "کصوو", "کسوو", "کث", "کصمغز", "کصنمک", "کصکلک", "کسمغز", "کسکش", "کصکش", "گصکش",
            "گسکش", "جاکش", "جنده", "کسده", "ننه", "ممه", "خایه", "بی خایه", "خایمال", "کیسه", "لنگی", "کیرمم", "کیرشم", "کیرش", "کییر",
            "کیییر", "کیییییر", "کییییییر", "کصخل", "کسخل", "پلشت", "مادرجند", "ننه جنده", "مادرقوه", "مادرقبحه", "کیری خان", "ننش", "خواهرش", "بی ناموس", "بیناموس",
            "ک۳", "کیر", "کیری", "کیرم", "کیرمم", "بیا بخورش", "گوه", "گوه نخور", "خارکسده", "خارکسته", "خارجنده", "خواهرجنده", "بی پدرو مادر", "خارکصه",
            "خارکسه", "کیری خان", "کون", "کونی", "کوون", "کووون", "مادرخراب", "جیندا", "گاییده",
            "گاییدمت", "گاییدی", "گایدی", "بگا", "بگامت", "می گامت", "گایش", "گاییدن", "گایید", "گاییده", "نگاییده", "گوه نخور", "عن", "لاشی",
            "سیک", "داشاق", "کصننه", "کصننت", "کسننه", "کسننت", "تخمی", "مادرتو", "کاییدی", "کاییدمت", "ساییدمت", "ساییدی", "فحش", "دیوس"];

        for(let i=0; i<badWords.length; i++)
        {
            var thisWord = badWords[i];
            var thisWordExists = str.indexOf(thisWord);

            if(thisWordExists != -1)
            {
                var badWord = false;

                if(thisWordExists == 0)
                    badWord = str.indexOf(thisWord + " ") != -1;
                else if(strLength - thisWordExists == thisWord.length)
                    badWord = str.indexOf(" " + thisWord) != -1;
                else
                    badWord = str.indexOf(thisWord + " ") != -1 && str.indexOf(" " + thisWord) != -1;

                if(badWord)
                    return false;
            }
        }

        return true;
    }

    checkLink(Text)
    {
        let text = `${Text}`;
        text = text.toLowerCase();

        var linkRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
        var link1Regex = /^(.*)([Hh]ttp|[Hh]ttps|t.me)(.*)|([Hh]ttp|[Hh]ttps|t.me)(.*)|(.*)([Hh]ttp|[Hh]ttps|t.me)|(.*)[Tt]elegram.me(.*)|[Tt]elegram.me(.*)|(.*)[Tt]elegram.me|(.*)[Tt].me(.*)|[Tt].me(.*)|(.*)[Tt].me/;
        var idRegex = /^(.*)@|@(.*)|(.*)@(.*)/;

        var linkExists = idRegex.test(text) || link1Regex.test(text) || linkRegex.test(text);
        return !linkExists;
    }

    getStartParam(msg)
    {
        if(msg.text && msg.text.toLowerCase().indexOf('/start') != -1)
        {
            var param = msg.text.toLowerCase().replace('/start', '').trim();
            return (param != '') ? param : null;
        }else
            return null;
    }

    async memberExists(t_id)
    {
        try {
            var data = await this.bot.getChatMember(config.channel, t_id);
            return ['creator', 'administrator', 'member'].indexOf(data.status) != -1;
        }catch (e) {
            return false;
        }
    }

    async getUserPhoto(t_id)
    {
        try {
            let photos = await this.bot.getUserProfilePhotos(t_id);

            if(photos.total_count > 0)
                return photos.photos[0][photos.photos[0].length - 1].file_id;
            else
                return null;
        }catch (e) {
            return null;
        }
    }

    randomInt(start, end)
    {
        return RandomInt(start, end);
    }

    strToObj(str)
    {
        let splitData = decode(str).split('&');
        let data = [];

        splitData.forEach(function(param){
            let splitParam = param.split('=');
            data[splitParam[0]] = splitParam[1];
        });

        return data;
    }

    authorization(data, usersModel)
    {
        var dataType = typeof data;

        if(dataType === 'string' || dataType === 'object')
        {
            var newData = {};

            if(dataType === 'object')
            {
                let intendedKeys = ['id', 'first_name', 'last_name', 'username', 'auth_date', 'photo_url', 'pid', 'hash'];

                Object.keys(data).forEach(function(key){
                    if(intendedKeys.indexOf(key) != -1)
                        newData[key] = (key == 'photo_url') ? decode(data[key]) : data[key];
                });
            }else
                newData = this.strToObj(data);

            return newData.pid && newData.id && newData.ps;
        }else
            return false;
    }

    createId()
    {
        let id = `${this.nowTime()}${this.randomInt(100,999)}`;
        return parseInt(id);
    }

    async downloadUserImg(file_id, filename){
        try {
            let url = await this.bot.getFileLink(file_id);
            let img = await Jimp.read(url);

            img
                .quality(100)
                .writeAsync(`${config.staticDir}/img/u/${filename}`);

            img
                .resize(50, 50)
                .quality(100)
                .writeAsync(`${config.staticDir}/img/u/small/${filename}`);

            return true;
        }catch (e) {
            return false;
        }
    };

    xssFilter(data)
    {
        if(typeof data == 'object')
        {
            let newObj = {};

            Object.keys(data).forEach(function(key){
                newObj[key] = xss(data[key]);
            });

            return newObj;
        }else
            return xss(data);
    }

    getTimeStr(unix)
    {
        return getTimeStr(unix);
    }

    dataToHtml(comment, userTid)
    {
        return dataToHtml(comment, userTid);
    }

    getPhoto(filename)
    {
        return `https://okcomment.com/static/img/u/${filename}`;
    }

    generatePass()
    {
        return randomstring.generate(12) + '' + this.nowTime();
    }
}

module.exports = Helper;