const config = require('./config');

class Text
{
    numsToPerNums(str)
    {
        var str = str + "";

        str = str.replace(/0/g, '\u06F0');
        str = str.replace(/1/g, '\u06F1');
        str = str.replace(/2/g, '\u06F2');
        str = str.replace(/3/g, '\u06F3');
        str = str.replace(/4/g, '\u06F4');
        str = str.replace(/5/g, '\u06F5');
        str = str.replace(/6/g, '\u06F6');
        str = str.replace(/7/g, '\u06F7');
        str = str.replace(/8/g, '\u06F8');
        str = str.replace(/9/g, '\u06F9');

        return str;
    }

    commentsPostButtons(num)
    {
        return `کامنت ها ${this.numsToPerNums(num)}`;
    }

    pageTitle(postMessageId)
    {
        return `کامنت های پست ${postMessageId}`;
    }

    socketErrors(type)
    {
        switch (type) {
            case 'authorization_error':
                return 'اطلاعات شما معتبر نیست';
                break;
            case 'data_error':
                return 'اطلاعات کاربری شما ناقص است';
                break;
            case 'user_not_found':
                return 'شما هنوز عضو ربات نشده اید';
                break;
            case 'reqs_count_error':
                return 'خطای ارسال زیاد درخواست';
                break;
            case 'blocked_user':
                return 'شما داخل سیستم بلاک شدید';
                break;
            case 'anonymous_error':
                return 'خطای سیستم!';
                break;
            case 'sender_block':
                return 'امکان ثبت ریپلای روی کامنت شخصی که شما را بلاک کرده است، وجود ندارد';
                break;
            case 'link_error':
                return 'امکان استفاده از لینک، هشتگ یا آیدی داخل کامنت وجود ندارد';
                break;
            case 'badwords_error':
                return 'به تشخیص سیستم داخل متن کامنت کلمات رکیک وجود دارد، لطفا ادب را رعایت نمایید';
                break;
            case 'relations_exists':
                return 'این کاربر قبلا درخواست شما را قبول کرده است، لطفا در ربات با ایشان چت کنید';
                break;
            case 'request_exists':
                return 'شما قبلا برای این کاربر درخواست ارسال کرده اید';
                break;
        }
    }

    requestNoti(userName)
    {
        return `👤 کاربر ${userName} برای شما درخواست چت ارسال کرده است.`;
    }

    savedNoti(commentText, postMessageId)
    {
        let msg;

        let postLink = `<a href="https://t.me/${config.channel.replace('@', '')}/${postMessageId}">پست ${postMessageId}</a>`;
        msg = '💬 کامنت شما: ' + commentText + '\n\n' + 'برای ' + postLink + ' ثبت شد✔️';

        return msg;
    }

    replyNoti(userName, text)
    {
        return '↩️ ریپلای از ' + userName + '\n\n' + 'متن: ' + text;
    }

    newUser()
    {
        return 'سلام دوست عزیز، به ربات کامنت کانال اوکی خوش اومدی.\n' +
            '\n' +
            'اگر شخصی برای کامنت شما ریپلای یا درخواست دوستی ارسال کرد، با استفاده از این ربات به شما اطلاع میدیم 👍\n' +
            '\n' +
            '\n' +
            'جایگزین:\n' +
            'سلام دوست عزیز🌹\n' +
            'به ربات کامنت کانال OK خوش اومدی.\n' +
            '\n' +
            'این ربات برای شما دو کار مهم انجام میده\n' +
            '\n' +
            '1_ اگر کسی کامنت شمارو ریپلای کنه گزارش میده تا باخبر بشید👌\n' +
            '2_ اگر کسی بخواد با شما چت خصوصی کنه پیامش اینجا به دستتون میرسه😍';
    }

    error()
    {
        return '❎ خطای سیستم !';
    }

    joinError()
    {
        return 'برای انجام این کار باید عضو کانال OK باشید.\n' +
            '\n' +
            '🆔 ' + config.channel;
    }

    sendReply()
    {
        return '✏️ ریپلای خودتون رو ارسال کنید:';
    }

    iDontUnderstand()
    {
        return 'متوجه منظورت نشدم 🤔';
    }

    processCancel()
    {
        return '✅ کنسل شد';
    }

    onlyTextError()
    {
        return '❎ فقط مجاز به ارسال متن هستید';
    }

    replySended()
    {
        return '✅ ریپلای شما ثبت شد.\n' +
            '\n' +
            '🔔 در صورت دریافت ریپلای یا درخواست چت از سوی این کاربر، ربات شما را با خبر خواهد کرد.';
    }

    block()
    {
        return '🚫 شما به دلیل رعایت نکردن قوانین ربات برای همیشه بلاک شدید.';
    }

    warning()
    {
        return '⚠️ کامنت شما به دلیل نداشتن محتوای مناسب حذف شد.\n' +
            '\n' +
            'در صورت ارسال مجدد کامنت های مخالف با قوانین ربات، بلاک خواهید شد.';
    }

    requestAccepted(name)
    {
        return '🔔 کاربر ' + name + ' درخواست شما را قبول کرد.';
    }

    sendPm()
    {
        return '📝 متن مورد نظر خود را بنویسید:';
    }

    pmSended()
    {
        return '✅ پیام شما با موفقیت ارسال شد.';
    }

    vipError()
    {
        return '✅ برای ارسال پیام و ارتباط با اعضای کانال OK، باید ' + this.numsToPerNums(config.invitesCount) + ' نفر را به ربات دعوت کنید.\n' +
            '\n' +
            'از همراهیتون متشکریم 🙏';
    }

    inviteNoti(invitesCount)
    {
        let msg = '🔔 یک کاربر جدید از طریق لینک شما وارد ربات شد.' + '\n\n';

        if(invitesCount < config.invitesCount)
            msg += '👤 برای نامحدود شدن ربات، باید ' + this.numsToPerNums(config.invitesCount - invitesCount) + ' نفر دیگر را به ربات دعوت کنید.';
        else
            msg += '✅ اکانت نامحدود به صورت دائم برای شما فعال شد.';

        return msg;
    }

    afterBanner(invitesCount)
    {
        return '✅ برای استفاده ی نامحدود از ربات، باید ' + this.numsToPerNums(config.invitesCount) + ' نفر با استفاده از لینک بالا داخل ربات عضو شوند.\n' +
            '\n' +
            '👤 شما تاکنون ' + this.numsToPerNums(invitesCount) + ' نفر را دعوت کرده اید.';
    }

    disablePreVersion()
    {
        return '❎ متاسفانه نسخه قدیمی ربات از کار افتاده و امکان ارسال کامنت برای این پست وجود نداره !';
    }

    sendCommentText()
    {
        return '💬 کامنت خود را بنویسید';
    }

    sendCommentJoinError()
    {
        return 'برای ارسال کامنت، باید جزو اعضای کانال OK باشید. \n' + '\n' + '🆔 ' + config.channel;
    }

    commentSaved()
    {
        return '✅ کامنت شما ثبت شد.';
    }

    showAllComments()
    {
        return '👀 مشاهده کامنت های کاربران با قابلیت ثبت ریپلای و امکان چت خصوصی در لینک زیر:';
    }
}

module.exports = Text;