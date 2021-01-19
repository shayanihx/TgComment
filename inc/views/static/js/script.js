!function(e,t){if("function"==typeof define&&define.amd)define(["module","exports"],t);else if("undefined"!=typeof exports)t(module,exports);else{var n={exports:{}};t(n,n.exports),e.autosize=n.exports}}(this,function(e,t){"use strict";var n,o,p="function"==typeof Map?new Map:(n=[],o=[],{has:function(e){return-1<n.indexOf(e)},get:function(e){return o[n.indexOf(e)]},set:function(e,t){-1===n.indexOf(e)&&(n.push(e),o.push(t))},delete:function(e){var t=n.indexOf(e);-1<t&&(n.splice(t,1),o.splice(t,1))}}),c=function(e){return new Event(e,{bubbles:!0})};try{new Event("test")}catch(e){c=function(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!1),t}}function r(r){if(r&&r.nodeName&&"TEXTAREA"===r.nodeName&&!p.has(r)){var e,n=null,o=null,i=null,d=function(){r.clientWidth!==o&&a()},l=function(t){window.removeEventListener("resize",d,!1),r.removeEventListener("input",a,!1),r.removeEventListener("keyup",a,!1),r.removeEventListener("autosize:destroy",l,!1),r.removeEventListener("autosize:update",a,!1),Object.keys(t).forEach(function(e){r.style[e]=t[e]}),p.delete(r)}.bind(r,{height:r.style.height,resize:r.style.resize,overflowY:r.style.overflowY,overflowX:r.style.overflowX,wordWrap:r.style.wordWrap});r.addEventListener("autosize:destroy",l,!1),"onpropertychange"in r&&"oninput"in r&&r.addEventListener("keyup",a,!1),window.addEventListener("resize",d,!1),r.addEventListener("input",a,!1),r.addEventListener("autosize:update",a,!1),r.style.overflowX="hidden",r.style.wordWrap="break-word",p.set(r,{destroy:l,update:a}),"vertical"===(e=window.getComputedStyle(r,null)).resize?r.style.resize="none":"both"===e.resize&&(r.style.resize="horizontal"),n="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(n)&&(n=0),a()}function s(e){var t=r.style.width;r.style.width="0px",r.offsetWidth,r.style.width=t,r.style.overflowY=e}function u(){if(0!==r.scrollHeight){var e=function(e){for(var t=[];e&&e.parentNode&&e.parentNode instanceof Element;)e.parentNode.scrollTop&&t.push({node:e.parentNode,scrollTop:e.parentNode.scrollTop}),e=e.parentNode;return t}(r),t=document.documentElement&&document.documentElement.scrollTop;r.style.height="",r.style.height=r.scrollHeight+n+"px",o=r.clientWidth,e.forEach(function(e){e.node.scrollTop=e.scrollTop}),t&&(document.documentElement.scrollTop=t)}}function a(){u();var e=Math.round(parseFloat(r.style.height)),t=window.getComputedStyle(r,null),n="content-box"===t.boxSizing?Math.round(parseFloat(t.height)):r.offsetHeight;if(n<e?"hidden"===t.overflowY&&(s("scroll"),u(),n="content-box"===t.boxSizing?Math.round(parseFloat(window.getComputedStyle(r,null).height)):r.offsetHeight):"hidden"!==t.overflowY&&(s("hidden"),u(),n="content-box"===t.boxSizing?Math.round(parseFloat(window.getComputedStyle(r,null).height)):r.offsetHeight),i!==n){i=n;var o=c("autosize:resized");try{r.dispatchEvent(o)}catch(e){}}}}function i(e){var t=p.get(e);t&&t.destroy()}function d(e){var t=p.get(e);t&&t.update()}var l=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?((l=function(e){return e}).destroy=function(e){return e},l.update=function(e){return e}):((l=function(e,t){return e&&Array.prototype.forEach.call(e.length?e:[e],function(e){return r(e)}),e}).destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],i),e},l.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],d),e}),t.default=l,e.exports=t.default});
var emojies = ["🏴󠁧󠁢󠁥󠁮󠁧󠁿","🏴󠁧󠁢󠁳󠁣󠁴󠁿","🏴󠁧󠁢󠁷󠁬󠁳󠁿","👨‍❤️‍💋‍👨","👩‍❤️‍💋‍👩","👨‍👩‍👧‍👦","👨‍👩‍👦‍👦","👨‍👩‍👧‍👧","👨‍👨‍👧‍👦","👨‍👨‍👦‍👦","👨‍👨‍👧‍👧","👩‍👩‍👧‍👦","👩‍👩‍👦‍👦","👩‍👩‍👧‍👧","🧑‍🤝‍🧑","👨‍❤️‍👨","👩‍❤️‍👩","👨‍👩‍👦","👨‍👩‍👧","👨‍👨‍👦","👨‍👨‍👧","👩‍👩‍👦","👩‍👩‍👧","👨‍👦‍👦","👨‍👧‍👦","👨‍👧‍👧","👩‍👦‍👦","👩‍👧‍👦","👩‍👧‍👧","👁️‍🗨️","🕵️‍♂️","🕵️‍♀️","🏌️‍♂️","🏌️‍♀️","🏋️‍♂️","🏋️‍♀️","🏳️‍🌈","👨‍🦰","👨‍🦱","👨‍🦳","👨‍🦲","👩‍🦰","🧑‍🦰","👩‍🦱","🧑‍🦱","👩‍🦳","🧑‍🦳","👩‍🦲","🧑‍🦲","👱‍♀️","👱‍♂️","🙍‍♂️","🙍‍♀️","🙎‍♂️","🙎‍♀️","🙅‍♂️","🙅‍♀️","🙆‍♂️","🙆‍♀️","💁‍♂️","💁‍♀️","🙋‍♂️","🙋‍♀️","🧏‍♂️","🧏‍♀️","🙇‍♂️","🙇‍♀️","🤦‍♂️","🤦‍♀️","🤷‍♂️","🤷‍♀️","🧑‍⚕️","👨‍⚕️","👩‍⚕️","🧑‍🎓","👨‍🎓","👩‍🎓","🧑‍🏫","👨‍🏫","👩‍🏫","🧑‍⚖️","👨‍⚖️","👩‍⚖️","🧑‍🌾","👨‍🌾","👩‍🌾","🧑‍🍳","👨‍🍳","👩‍🍳","🧑‍🔧","👨‍🔧","👩‍🔧","🧑‍🏭","👨‍🏭","👩‍🏭","🧑‍💼","👨‍💼","👩‍💼","🧑‍🔬","👨‍🔬","👩‍🔬","🧑‍💻","👨‍💻","👩‍💻","🧑‍🎤","👨‍🎤","👩‍🎤","🧑‍🎨","👨‍🎨","👩‍🎨","🧑‍✈️","👨‍✈️","👩‍✈️","🧑‍🚀","👨‍🚀","👩‍🚀","🧑‍🚒","👨‍🚒","👩‍🚒","👮‍♂️","👮‍♀️","💂‍♂️","💂‍♀️","👷‍♂️","👷‍♀️","👳‍♂️","👳‍♀️","🦸‍♂️","🦸‍♀️","🦹‍♂️","🦹‍♀️","🧙‍♂️","🧙‍♀️","🧚‍♂️","🧚‍♀️","🧛‍♂️","🧛‍♀️","🧜‍♂️","🧜‍♀️","🧝‍♂️","🧝‍♀️","🧞‍♂️","🧞‍♀️","🧟‍♂️","🧟‍♀️","💆‍♂️","💆‍♀️","💇‍♂️","💇‍♀️","🚶‍♂️","🚶‍♀️","🧍‍♂️","🧍‍♀️","🧎‍♂️","🧎‍♀️","🧑‍🦯","👨‍🦯","👩‍🦯","🧑‍🦼","👨‍🦼","👩‍🦼","🧑‍🦽","👨‍🦽","👩‍🦽","🏃‍♂️","🏃‍♀️","👯‍♂️","👯‍♀️","🧖‍♂️","🧖‍♀️","👨‍👦","👨‍👧","👩‍👦","👩‍👧","🐕‍🦺","🧗‍♂️","🧗‍♀️","🏄‍♂️","🏄‍♀️","🚣‍♂️","🚣‍♀️","🏊‍♂️","🏊‍♀️","⛹️‍♂️","⛹️‍♀️","🚴‍♂️","🚴‍♀️","🚵‍♂️","🚵‍♀️","🤸‍♂️","🤸‍♀️","🤼‍♂️","🤼‍♀️","🤽‍♂️","🤽‍♀️","🤾‍♂️","🤾‍♀️","🤹‍♂️","🤹‍♀️","🧘‍♂️","🧘‍♀️","🏴‍☠️","🇦🇨","🇦🇩","🇦🇪","🇦🇫","🇦🇬","🇦🇮","🇦🇱","🇦🇲","🇦🇴","🇦🇶","🇦🇷","🇦🇸","🇦🇹","🇦🇺","🇦🇼","🇦🇽","🇦🇿","🇧🇦","🇧🇧","🇧🇩","🇧🇪","🇧🇫","🇧🇬","🇧🇭","🇧🇮","🇧🇯","🇧🇱","🇧🇲","🇧🇳","🇧🇴","🇧🇶","🇧🇷","🇧🇸","🇧🇹","🇧🇻","🇧🇼","🇧🇾","🇧🇿","🇨🇦","🇨🇨","🇨🇩","🇨🇫","🇨🇬","🇨🇭","🇨🇮","🇨🇰","🇨🇱","🇨🇲","🇨🇳","🇨🇴","🇨🇵","🇨🇷","🇨🇺","🇨🇻","🇨🇼","🇨🇽","🇨🇾","🇨🇿","🇩🇪","🇩🇬","🇩🇯","🇩🇰","🇩🇲","🇩🇴","🇩🇿","🇪🇦","🇪🇨","🇪🇪","🇪🇬","🇪🇭","🇪🇷","🇪🇸","🇪🇹","🇪🇺","🇫🇮","🇫🇯","🇫🇰","🇫🇲","🇫🇴","🇫🇷","🇬🇦","🇬🇧","🇬🇩","🇬🇪","🇬🇫","🇬🇬","🇬🇭","🇬🇮","🇬🇱","🇬🇲","🇬🇳","🇬🇵","🇬🇶","🇬🇷","🇬🇸","🇬🇹","🇬🇺","🇬🇼","🇬🇾","🇭🇰","🇭🇲","🇭🇳","🇭🇷","🇭🇹","🇭🇺","🇮🇨","🇮🇩","🇮🇪","🇮🇱","🇮🇲","🇮🇳","🇮🇴","🇮🇶","🇮🇷","🇮🇸","🇮🇹","🇯🇪","🇯🇲","🇯🇴","🇯🇵","🇰🇪","🇰🇬","🇰🇭","🇰🇮","🇰🇲","🇰🇳","🇰🇵","🇰🇷","🇰🇼","🇰🇾","🇰🇿","🇱🇦","🇱🇧","🇱🇨","🇱🇮","🇱🇰","🇱🇷","🇱🇸","🇱🇹","🇱🇺","🇱🇻","🇱🇾","🇲🇦","🇲🇨","🇲🇩","🇲🇪","🇲🇫","🇲🇬","🇲🇭","🇲🇰","🇲🇱","🇲🇲","🇲🇳","🇲🇴","🇲🇵","🇲🇶","🇲🇷","🇲🇸","🇲🇹","🇲🇺","🇲🇻","🇲🇼","🇲🇽","🇲🇾","🇲🇿","🇳🇦","🇳🇨","🇳🇪","🇳🇫","🇳🇬","🇳🇮","🇳🇱","🇳🇴","🇳🇵","🇳🇷","🇳🇺","🇳🇿","🇴🇲","🇵🇦","🇵🇪","🇵🇫","🇵🇬","🇵🇭","🇵🇰","🇵🇱","🇵🇲","🇵🇳","🇵🇷","🇵🇸","🇵🇹","🇵🇼","🇵🇾","🇶🇦","🇷🇪","🇷🇴","🇷🇸","🇷🇺","🇷🇼","🇸🇦","🇸🇧","🇸🇨","🇸🇩","🇸🇪","🇸🇬","🇸🇭","🇸🇮","🇸🇯","🇸🇰","🇸🇱","🇸🇲","🇸🇳","🇸🇴","🇸🇷","🇸🇸","🇸🇹","🇸🇻","🇸🇽","🇸🇾","🇸🇿","🇹🇦","🇹🇨","🇹🇩","🇹🇫","🇹🇬","🇹🇭","🇹🇯","🇹🇰","🇹🇱","🇹🇲","🇹🇳","🇹🇴","🇹🇷","🇹🇹","🇹🇻","🇹🇼","🇹🇿","🇺🇦","🇺🇬","🇺🇲","🇺🇳","🇺🇸","🇺🇾","🇺🇿","🇻🇦","🇻🇨","🇻🇪","🇻🇬","🇻🇮","🇻🇳","🇻🇺","🇼🇫","🇼🇸","🇽🇰","🇾🇪","🇾🇹","🇿🇦","🇿🇲","🇿🇼","🖐️","👁️","🕵️","🕴️","🗣️","🕶️","🐿️","🕊️","🕷️","🕸️","🏵️","🌤️","🌥️","🌦️","🌧️","🌨️","🌩️","🌪️","🌫️","🌬️","🌶️","🍽️","🏌️","🏋️","🎗️","🎟️","🎖️","🏔️","🏕️","🏖️","🏜️","🏝️","🏞️","🏟️","🏛️","🏗️","🏘️","🏚️","🏙️","🏎️","🏍️","🛣️","🛤️","🛳️","🛥️","🛩️","🛰️","🕳️","🗺️","🛢️","🛎️","🕰️","🌡️","🕹️","🖼️","🛍️","🎙️","🎚️","🎛️","🖥️","🖨️","🖱️","🖲️","🎞️","📽️","🕯️","🗞️","🏷️","🗳️","🖋️","🖊️","🖌️","🖍️","🗂️","🗒️","🗓️","🖇️","🗃️","🗄️","🗑️","🗝️","🛠️","🗡️","🛡️","🗜️","🛏️","🛋️","🗨️","🗯️","🕉️","#️⃣","0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🅰️","🅱️","🅾️","🅿️","🈂️","🈷️","🏳️","😀","😃","😄","😁","😆","😅","🤣","😂","🙂","🙃","😉","😊","😇","🥰","😍","🤩","😘","😗","☺️","😚","😙","😋","😛","😜","🤪","😝","🤑","🤗","🤭","🤫","🤔","🤐","🤨","😐","😑","😶","😏","😒","🙄","😬","🤥","😌","😔","😪","🤤","😴","😷","🤒","🤕","🤢","🤮","🤧","🥵","🥶","🥴","😵","🤯","🤠","🥳","😎","🤓","🧐","😕","😟","🙁","☹️","😮","😯","😲","😳","🥺","😦","😧","😨","😰","😥","😢","😭","😱","😖","😣","😞","😓","😩","😫","🥱","😤","😡","😠","🤬","😈","👿","💀","☠️","💩","🤡","👹","👺","👻","👽","👾","🤖","😺","😸","😹","😻","😼","😽","🙀","😿","😾","💋","👋","🤚","🖖","👌","🤏","✌️","🤞","🤟","🤘","🤙","👈","👉","👆","🖕","👇","☝️","👍","👎","👊","🤛","🤜","👏","🙌","👐","🤲","🤝","🙏","✍️","💅","🤳","💪","🦾","🦿","🦵","🦶","👂","🦻","👃","🧠","🦷","🦴","👀","👅","👄","👶","🧒","👦","👧","🧑","👱","👨","🧔","👩","🧓","👴","👵","🙍","🙎","🙅","🙆","💁","🙋","🧏","🙇","🤦","🤷","👮","💂","👷","🤴","👸","👳","👲","🧕","🤵","👰","🤰","🤱","👼","🎅","🤶","🦸","🦹","🧙","🧚","🧛","🧜","🧝","🧞","🧟","💆","💇","🚶","🧍","🧎","🏃","💃","🕺","👯","🧖","🧘","👭","👫","👬","💏","💑","👪","👤","👥","👣","🧳","🌂","☂️","🎃","🧵","👓","🥽","🥼","🦺","👔","👕","👖","🧣","🧤","🧥","🧦","👗","👘","🥻","🩱","🩲","🩳","👙","👚","👛","👜","👝","🎒","👞","👟","🥾","🥿","👠","👡","🩰","👢","👑","👒","🎩","🎓","🧢","⛑️","💄","💍","💼","🩸","🙈","🙉","🙊","💥","💫","💦","💨","🐵","🐒","🦍","🦧","🐶","🐕","🦮","🐩","🐺","🦊","🦝","🐱","🐈","🦁","🐯","🐅","🐆","🐴","🐎","🦄","🦓","🦌","🐮","🐂","🐃","🐄","🐷","🐖","🐗","🐽","🐏","🐑","🐐","🐪","🐫","🦙","🦒","🐘","🦏","🦛","🐭","🐁","🐀","🐹","🐰","🐇","🦔","🦇","🐻","🐨","🐼","🦥","🦦","🦨","🦘","🦡","🐾","🦃","🐔","🐓","🐣","🐤","🐥","🐦","🐧","🦅","🦆","🦢","🦉","🦩","🦚","🦜","🐸","🐊","🐢","🦎","🐍","🐲","🐉","🦕","🦖","🐳","🐋","🐬","🐟","🐠","🐡","🦈","🐙","🐚","🐌","🦋","🐛","🐜","🐝","🐞","🦗","🦂","🦟","🦠","💐","🌸","💮","🌹","🥀","🌺","🌻","🌼","🌷","🌱","🌲","🌳","🌴","🌵","🌾","🌿","☘️","🍀","🍁","🍂","🍃","🍄","🦀","🦞","🦐","🦑","🌍","🌎","🌏","🌐","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌙","🌚","🌛","🌜","☀️","🌝","🌞","🌟","🌠","☁️","⛈️","🌈","❄️","☃️","☄️","🔥","💧","🌊","🎄","🎋","🎍","🍇","🍈","🍉","🍊","🍋","🍌","🍍","🥭","🍎","🍏","🍐","🍑","🍒","🍓","🥝","🍅","🥥","🥑","🍆","🥔","🥕","🌽","🥒","🥬","🥦","🧄","🧅","🥜","🌰","🍞","🥐","🥖","🥨","🥯","🥞","🧇","🧀","🍖","🍗","🥩","🥓","🍔","🍟","🍕","🌭","🥪","🌮","🌯","🥙","🧆","🍳","🥘","🍲","🥣","🥗","🍿","🧈","🧂","🥫","🍱","🍘","🍙","🍚","🍛","🍜","🍝","🍠","🍢","🍣","🍤","🍥","🥮","🍡","🥟","🥠","🥡","🦪","🍦","🍧","🍨","🍩","🍪","🎂","🍰","🧁","🥧","🍫","🍬","🍭","🍮","🍯","🍼","🥛","🍵","🍶","🍾","🍷","🍸","🍹","🍺","🍻","🥂","🥃","🥤","🧃","🧉","🧊","🥢","🍴","🥄","🧗","🤺","🏇","⛷️","🏂","🏄","🚣","🏊","⛹️","🚴","🚵","🤸","🤼","🤽","🤾","🤹","🧘","🎪","🛹","🛶","🎫","🏆","🏅","🥇","🥈","🥉","🥎","🏀","🏐","🏈","🏉","🎾","🥏","🎳","🏏","🏑","🏒","🥍","🏓","🏸","🥊","🥋","🥅","⛸️","🎣","🎽","🎿","🛷","🥌","🎯","🎱","🎮","🎰","🎲","🧩","♟️","🎭","🎨","🧶","🎼","🎤","🎧","🎷","🎸","🎹","🎺","🎻","🥁","🎬","🏹","🗾","⛰️","🌋","🗻","🏠","🏡","🏢","🏣","🏤","🏥","🏦","🏨","🏩","🏪","🏫","🏬","🏭","🏯","🏰","💒","🗼","🗽","🕌","🛕","🕍","⛩️","🕋","🌁","🌃","🌄","🌅","🌆","🌇","🌉","🎠","🎡","🎢","🚂","🚃","🚄","🚅","🚆","🚇","🚈","🚉","🚊","🚝","🚞","🚋","🚌","🚍","🚎","🚐","🚑","🚒","🚓","🚔","🚕","🚖","🚗","🚘","🚚","🚛","🚜","🛵","🛺","🚲","🛴","🚏","🚨","🚥","🚦","🚧","🚤","⛴️","🚢","✈️","🛫","🛬","🪂","💺","🚁","🚟","🚠","🚡","🚀","🛸","🪐","🌠","🌌","🎆","🎇","🎑","💴","💵","💶","💷","🗿","🛂","🛃","🛄","🛅","💌","💣","🛀","🛌","🔪","🏺","🧭","🧱","💈","🦽","🦼","⏱️","⏲️","⛱️","🧨","🎈","🎉","🎊","🎎","🎏","🎐","🧧","🎀","🎁","🤿","🪀","🪁","🔮","🧿","🧸","📿","💎","📯","📻","🪕","📱","📲","☎️","📞","📟","📠","🔋","🔌","💻","⌨️","💽","💾","💿","📀","🧮","🎥","📺","📷","📸","📹","📼","🔍","🔎","💡","🔦","🏮","🪔","📔","📕","📖","📗","📘","📙","📚","📓","📃","📜","📄","📰","📑","🔖","💰","💸","💳","🧾","✉️","📧","📨","📩","📤","📥","📦","📫","📪","📬","📭","📮","✏️","✒️","📝","📁","📂","📅","📆","📇","📈","📉","📊","📋","📌","📍","📎","📏","📐","✂️","🔒","🔓","🔏","🔐","🔑","🔨","🪓","⛏️","⚒️","⚔️","🔫","🔧","🔩","⚙️","⚖️","🦯","🔗","⛓️","🧰","🧲","⚗️","🧪","🧫","🧬","🔬","🔭","📡","💉","💊","🩹","🩺","🚪","🪑","🚽","🚿","🛁","🪒","🧴","🧷","🧹","🧺","🧻","🧼","🧽","🧯","🛒","🚬","⚰️","⚱️","🚰","💘","💝","💖","💗","💓","💞","💕","💟","❣️","💔","❤️","🧡","💛","💚","💙","💜","🤎","🖤","🤍","💯","💢","💬","💭","💤","♨️","🛑","🕛","🕧","🕐","🕜","🕑","🕝","🕒","🕞","🕓","🕟","🕔","🕠","🕕","🕡","🕖","🕢","🕗","🕣","🕘","🕤","🕙","🕥","🕚","🕦","🌀","♠️","♥️","♦️","♣️","🃏","🀄","🎴","🔇","🔈","🔉","🔊","📢","📣","🔔","🔕","🎵","🎶","💹","🏧","🚮","🚹","🚺","🚻","🚼","🚾","⚠️","🚸","🚫","🚳","🚭","🚯","🚱","🚷","📵","🔞","☢️","☣️","⬆️","↗️","➡️","↘️","⬇️","↙️","⬅️","↖️","↕️","↔️","↩️","↪️","⤴️","⤵️","🔃","🔄","🔙","🔚","🔛","🔜","🔝","🛐","⚛️","✡️","☸️","☯️","✝️","☦️","☪️","☮️","🕎","🔯","🔀","🔁","🔂","▶️","◀️","🔼","🔽","⏹️","⏏️","🎦","🔅","🔆","📶","📳","📴","✖️","♾️","‼️","⁉️","〰️","💱","💲","⚕️","♻️","⚜️","🔱","📛","🔰","☑️","✔️","〽️","✳️","✴️","❇️","©️","®️","™️","🔟","🔠","🔡","🔢","🔣","🔤","🆎","🆑","🆒","🆓","ℹ️","🆔","Ⓜ️","🆕","🆖","🆗","🆘","🆙","🆚","🈁","🈶","🈯","🉐","🈹","🈚","🈲","🉑","🈸","🈴","🈳","㊗️","㊙️","🈺","🈵","🔴","🟠","🟡","🟢","🔵","🟣","🟤","🟥","🟧","🟨","🟩","🟦","🟪","🟫","◼️","◻️","▪️","▫️","🔶","🔷","🔸","🔹","🔺","🔻","💠","🔘","🔳","🔲","🏁","🚩","🎌","🏴","✋","✊","⭐","⛅","☔","⚡","⛄","✨","☕","⚽","⚾","⛳","⛪","⛲","⛺","⛽","⚓","⛵","⌛","⏳","⌚","⏰","♿","⛔","♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓","⛎","⏩","⏪","⏫","⏬","➕","➖","➗","❓","❔","❕","❗","⭕","✅","❌","❎","➰","➿","⚫","⚪","⬛","⬜","◾","◽"];

$.fn.emojiParser = function(data){
    var emData = {};

    emData.width = (data && data.width) ? data.width : 18;
    emData.height = (data && data.height) ? data.height : 18;
    emData.spriteImg = (data && data.spriteImg) ? data.spriteImg : 'https://darsgoo.com/static/img/all-emojies.png';

    $('head').append(`<style type="text/css">.emoji{vertical-align: middle;display: inline-block;width: ${emData.width}px;height: ${emData.height}px;background: url(${emData.spriteImg});background-size: ${emData.width}px ${emData.height * emojies.length}px;}</style>`);

    this.each(function(){
        if($(this).find('.emoji').length == 0)
        {
            var new_str = $(this).html();

            for (var key in emojies)
                new_str = new_str.replace(new RegExp(emojies[key], "g"), `<i class="emoji" emoji="${emojies[key]}" style="background-position-y: ${key * emData.height * -1}px"></i>`);

            $(this).html(new_str);
        }
    });
};


function noti(text, success)
{
    let notiData = (success) ? ['success', 'fa-check-circle'] : ['error', 'fa-times-circle'];
    $('#noties').append(`<div class="noti ${notiData[0]}"><i class="fas ${notiData[1]}"></i><span>${text}</span></div>`);

    $('.noti').fadeIn(300, function(){
        let this_el = this;

        setTimeout(function(){
            closeNoti(this_el);
        }, 3000)
    });

    $(document).on("click", ".noti", function(){
        closeNoti(this);
    });
}

function closeNoti(el)
{
    $(el).fadeOut(300, function(){
        $(el).remove();
    });
}

function getUserId()
{
    let params = urlData().split('&');

    for(key in params)
    {
        let dataSplit = params[key].split('=');

        if(dataSplit[0] == 'id')
            return dataSplit[1];
    }
}

function urlData()
{
    return window.location.search.substr(1);
}

function getTimeStr(unix)
{
    let currentTime = Math.floor(Date.now() / 1000);
    let pastTime = currentTime - unix;

    if(pastTime < 180)
        return 'لحظاتی پیش';
    else if(pastTime < 3600)
        return `${Math.floor(pastTime / 60)} دقیقه پیش`;
    else if(pastTime < 86400)
        return `${Math.floor(pastTime / 3600)} ساعت پیش`;
    else
        return `${Math.floor(pastTime / 86400)} روز پیش`;
}

function dataToHtml(comment)
{

    let broadcast = getUserId() == comment._.sender;
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
                    <span>مشاهده ریپلای ها (${comment._.repliesCount})</span>
                </button>
                <br class="clear replies-clear">`;

        msg += '<div class="replies">';
        comment.replies.forEach(function(reply){ msg += dataToHtml(reply) });
        msg += '</div>'
    }

    msg += '</div>';
    msg += '</div>';
    msg += '</div>';

    return msg;
}

function showSendProcess(comment, type)
{
    let content = comment.find('p:nth-child(1)'),
            el = $('#edit-or-reply'),
            typeStr;

    if(type == 'edit')
    {
        typeStr = `درحال ویرایش کامنت`;

        let str = content.find('span').html();
        let temp = document.createElement('div');
        temp.innerHTML = str;

        var emojies = temp.getElementsByTagName("i");
        for(let i=0; i < emojies.length; i++)
        {
            let thisTag = emojies[i];
            let thisEmoji = thisTag.getAttribute('emoji');
            let thisTagStr = `<i class="emoji" emoji="${thisEmoji}" style="${thisTag.getAttribute('style')}"></i>`;

            str = str.replace(thisTagStr, thisEmoji);
        }

        let textareaEl = $('form#send-cmnt textarea');
        textareaEl.val(str);
        autosize.update(textareaEl);
    }else
        typeStr = `درحال پاسخ به <b>${content.find('a').html()}</b>`;

    el.find('#type').html(typeStr)
    el.find('#content').html(content.find('span').html());
    el.css('display', 'flex');

    $('form#send-cmnt').find('textarea').focus();
}

function extractNumFromString(str)
{
    let nums = (str.match(/\d+/g) || []).map(n => parseInt(n));
    return nums[0];
}

function scrollToComment(dataName, val, scrollProcess)
{
    let intendedAttr = `data-${dataName}=${val}`;

    let intendedComment = $('.comment')
        .find(`data[${intendedAttr}]`)
        .closest('.comment');

    intendedComment.css('background-color', '#f5f4fc');
    setTimeout(function(){
        intendedComment.css('background-color', '#ffffff');
    }, 4000)

    if(scrollProcess)
        $('body').animate({scrollTop: intendedComment.offset().top});
}

$.fn.getDataTag = function(data_name){
    return this.closest('.comment').find('data:nth-child(1)').data(data_name);
}

function receiveReply(comment)
{
    let userId = getUserId();
    let replyToEl = $('.comment').find(`data[data-ln='${comment._.replyTo}']`);

    if(replyToEl.length)
    {
        let repliesEl = replyToEl.siblings('.replies');

        if(repliesEl.length)
        {
            repliesEl.append(dataToHtml(comment));

            if(userId == comment._.sender)
            {
                let showRepliesEl = repliesEl.siblings('.show-replies');

                if(showRepliesEl.find('i').hasClass('fa-plus'))
                {
                    showRepliesEl.find('i').attr('class', 'fa fa-minus');
                    showRepliesEl.find('span').text('مخفی کردن');

                    replyToEl.siblings('.replies').fadeIn();
                }

                scrollToComment('ln', comment.id, true);
            }else
            {
                replyToEl.parents('.comment').each(function(){
                    var thisShowRepliesEl = $(this).find('.show-replies').eq(0);

                    if(thisShowRepliesEl.length)
                    {
                        if(thisShowRepliesEl.find('.fa-plus').length)
                        {
                            var currentNum = extractNumFromString(thisShowRepliesEl.find('span').html());
                            thisShowRepliesEl.find('span').html(`مشاهده ریپلای ها (${currentNum + 1})`);
                        }
                    }
                });
            }
        }else
        {
            if(userId == comment._.sender)
            {
                let code = `<button class="show-replies">
                                <i class="fas fa-minus"></i>
                                <span>مخفی کردن</span>
                            </button>
                            <br class="clear replies-clear">`;

                code += '<div class="replies">';
                code += dataToHtml(comment);
                code += '</div>';

                replyToEl.closest('.options').append(code);
                replyToEl.siblings('.replies').fadeIn();
            }else
            {
                replyToEl.parents('.comment').each(function(){
                    var thisShowRepliesEl = $(this).find('.show-replies').eq(0);

                    if(thisShowRepliesEl.length)
                    {
                        if(thisShowRepliesEl.find('.fa-plus').length)
                        {
                            var currentNum = extractNumFromString(thisShowRepliesEl.find('span').html());
                            thisShowRepliesEl.find('span').html(`مشاهده ریپلای ها (${currentNum + 1})`);
                        }
                    }else
                    {
                        let code = `<button class="show-replies">
                                        <i class="fas fa-plus"></i>
                                        <span>مشاهده ریپلای ها (1)</span>
                                    </button>
                                    <br class="clear replies-clear">`;

                        code += '<div class="replies">';
                        code += dataToHtml(comment);
                        code += '</div>';

                        $(this).find('.options').eq(0).append(code);
                    }
                });
            }
        }
    }
}

var replyTo = [],
    edit = null;

function resetSendForm(ln)
{
    edit = null;
    replyTo = [];

    let sendForm = $('form#send-cmnt');
    sendForm.removeAttr('disable');
    sendForm.find('button i').attr('class', 'fas fa-paper-plane');

    $('#edit-or-reply').hide();
    let textareaEl = $('form#send-cmnt').find('textarea');
    textareaEl.val('');

    autosize.update(textareaEl);

    if(ln)
        scrollToComment('ln', ln, true);
}

$(document).scrollTop($(document).height());
$(function(){
    setInterval(function(){
        $('.comment').each(function(){
            let jd = $(this).find('data').first().data('jd');
            $(this).find('.time').first().text(getTimeStr(jd));
        });
    }, 60000);

    $('.comment p').emojiParser();
    autosize($('textarea'));

    var socket = io('/', { query: urlData() , transports: ['websocket'] });
    socket.on('client-error', function(data){
        noti(data, false);
        resetSendForm();
    });

    $(document).on('submit', 'form#send-cmnt', function(e){
        e.preventDefault();

        if($(this).attr('disable'))
            return;

        let textarea = $(this).find('textarea');
        if(textarea.val().trim() != '')
        {
            $(this).attr('disable', '');
            $(this).find('button i').attr('class', 'fas fa-spinner');

            if(edit)
                socket.emit('edit', {
                    user: urlData(),
                    text: textarea.val().trim(),
                    editId: edit
                });
            else
                socket.emit('new', {
                    user: urlData(),
                    text: textarea.val(),
                    replyTo: replyTo
                });
        }else
            textarea.focus();
    });

    $(document).on('click', '.reply', function(e){
        let Parents = [];
        $(this).parents('.comment').each(function(key, val){ Parents.push($(val).find('data:nth-child(1)').data('ln')) });
        replyTo = Parents.reverse();

        let comment = $(this).closest('.comment');
        showSendProcess(comment, 'reply');
    });

    $(document).on('click', '.edit', function(){
        let ln = $(this).getDataTag('ln');
        let commentContent = $(this).closest('.comment');

        edit = ln;
        showSendProcess(commentContent, 'edit');
    });

    $(document).on('click', '#edit-or-reply .fa-times', function(){
        $('#edit-or-reply').hide();
        $('form#send-cmnt textarea').val('');

        replyTo = [];
        edit = null;
    });

    $(document).on('click', '#edit-or-reply p', function(){
        let intendedLn = (replyTo.length) ? replyTo[replyTo.length - 1] : edit;;
        scrollToComment('ln', intendedLn, true);
    });

    $(document).on('click', '.show-replies', function(){
        let thisI = $(this).find('i');
        let thisSpan = $(this).find('span');
        let siblingDiv = $(this).siblings('.replies');

        if(thisI.hasClass('fa-plus'))
        {
            siblingDiv.fadeIn();

            thisI.attr('class', 'fas fa-minus');
            thisSpan.text('مخفی کردن');
        }else
        {
            siblingDiv.hide();
            thisI.attr('class', 'fas fa-plus');

            let repliesCount = siblingDiv.find('.comment').length;
            thisSpan.text(`مشاهده ریپلای ها (${ repliesCount })`);
        }
    });

    $(document).on('click', '.del', function(){
        let lnData = $(this).getDataTag('ln');

        socket.emit('delete', {
            user: urlData(),
            ln: lnData
        });
    });

    $(document).on('click', '.like', function(){
        let newStatus, newNum;
        let numEl = $(this).find('span.num');

        if($(this).hasClass('owner'))
            return;

        if($(this).hasClass('disable'))
        {
            newStatus = 'enable';
            newNum = parseInt(numEl.text()) + 1;
        }else
        {
            newStatus = 'disable';
            newNum = parseInt(numEl.text()) - 1;
        }

        $(this).attr('class', `like ${newStatus}`);
        numEl.text(newNum);

        socket.emit('like', {
            user: urlData(),
            ln: $(this).getDataTag('ln')
        });
    });

    $(document).on('click', '#more-result', function(){
        if($(this).find('i').length)
            return;

        $(this).html('<i class="fas fa-spinner"></i>');

        let firstCommentEl = $('.comment').first();
        let lastJd = (firstCommentEl.length) ? firstCommentEl.find('data').data('jd') : 'null';
        socket.emit('more-result', {user: urlData(), jd: lastJd});
    });

    $(document).on('click', '.comment p a, .comment a img, .comment .no-img', function(e){
        e.preventDefault();

        let mt = $(this).getDataTag('mt');
        if($(this).attr('disable') == '' || mt == getUserId())
            return;

        $(this).attr('disable', '');
        socket.emit('request', {user: urlData(), to: mt});
    });

    socket.on('client-new', function(data){
        let commentsCountSpan = $('#comments-count span');
        let currentCount = parseInt(commentsCountSpan.text().replace(' کامنت', ''));
        commentsCountSpan.text(`${currentCount + 1} کامنت`);

        $('#no-comment').remove();
        if(data._.step != 1)
            receiveReply(data);
        else
            $('.comments').append(dataToHtml(data));

        $('.comment')
            .find(`data[data-ln='${data.id}']`)
            .parent('.options')
            .siblings('p')
            .emojiParser();

        if(getUserId() == data._.sender)
            resetSendForm(data.id);
        else
        {
            let scrollProcessing = false;
            scrollToComment('ln', data.id, false);
        }
    });

    socket.on('client-edited', function(data){
        let el = $('.comment').find(`data[data-ln='${data.id}']`).parent('.options').siblings('p');

        if(el.length)
        {
            el.find('span').html(data.newText);
            el.emojiParser();

            if(getUserId() == data.sender)
                resetSendForm(data.id);
            else
                scrollToComment('ln', data.id, false);
        }
    });

    socket.on('client-deleted', function(data){
        let el = $('.comment').find(`data[data-ln='${data.id}']`).closest('.comment');
        let commentsCount = parseInt($('#comments-count span').html().replace(' کامنت'));

        let newNum = commentsCount + data.substractNum;
        $('#comments-count span').html(`${newNum} کامنت`);

        if(edit == data.id || replyTo.indexOf(data.id) != -1)
        {
            edit = null;
            replyTo = [];

            $('#edit-or-reply').hide();
        }

        if(el.length)
        {
            if(data.step == 1 && newNum == 0)
            {
                el.remove();
                $('.comments').html('<div id="no-comment"><i class="fas fa-comment-slash"></i><p>هنوز کامنتی برای این پست ثبت نشده !</p></div>');
            }else
            {
                let parents = el.parents('.comment');
                el.remove();

                parents.each(function(){
                    let commentsCountInEl = $(this).find('.comment').length;
                    let showRepliesEl = $(this).find('.show-replies');

                    if(commentsCountInEl == 0)
                    {
                        showRepliesEl.remove();
                        $(this).find('.replies-clear').remove();
                        $(this).find('.replies').remove();
                    }else
                    {
                        if(showRepliesEl.find('.fa-plus').length)
                            showRepliesEl.find('span').html(`مشاهده ریپلای ها (${commentsCountInEl})`);
                    }
                });
            }
        }
    });

    socket.on('client-like', function(data){
        if(data.userId != getUserId())
        {
            let el = $('.comment').find(`data[data-ln='${data.id}']`).eq(0);

            if(el.length)
                el.siblings('.like').find('.num').text(data.num);
        }
    });

    socket.on('client-more', function(data){
        $('#more-result').remove();

        if(typeof data.comments == 'string' && data.comments == 'no_result')
            noti('متاسفانه کامنت بیشتری پیدا نشد', false);
        else
        {
            let htmlCode = '';

            data.comments.forEach(function(comment){
                htmlCode += dataToHtml(comment);
            });

            $('.comments').prepend(htmlCode);
            $('.comment p').emojiParser();

            if(data.moreResultsCount > 0)
                $('.comments').prepend(`<button id="more-result">مشاهده ${data.moreResultsCount} کامنت بیشتر</button>`);
        }
    });

    socket.on('client-success-request', function(){
        noti('درخواست شما با موفقیت ارسال شد', true);

        $('.comment').find("*[disable='']").each(function(){
            $(this).removeAttr('disable');
        });
    });
});
