/*
 * jQuery Tools 1.2.4 - The missing UI library for the Web
 *
 * [tooltip, tooltip.dynamic]
 *
 * NO COPYRIGHTS OR LICENSES. DO WHAT YOU LIKE.
 *
 * http://flowplayer.org/tools/
 *
 * File generated: Mon Aug 30 11:53:49 GMT 2010
 */
(function(f){function p(a,b,c){var h=c.relative?a.position().top:a.offset().top,e=c.relative?a.position().left:a.offset().left,i=c.position[0];h-=b.outerHeight()-c.offset[0];e+=a.outerWidth()+c.offset[1];var j=b.outerHeight()+a.outerHeight();if(i=="center")h+=j/2;if(i=="bottom")h+=j;i=c.position[1];a=b.outerWidth()+a.outerWidth();if(i=="center")e-=a/2;if(i=="left")e-=a;return{top:h,left:e}}function u(a,b){var c=this,h=a.add(c),e,i=0,j=0,m=a.attr("title"),q=a.attr("data-tooltip"),r=n[b.effect],l,s=
    a.is(":input"),v=s&&a.is(":checkbox, :radio, select, :button, :submit"),t=a.attr("type"),k=b.events[t]||b.events[s?v?"widget":"input":"def"];if(!r)throw'Nonexistent effect "'+b.effect+'"';k=k.split(/,\s*/);if(k.length!=2)throw"Tooltip: bad events configuration for "+t;a.bind(k[0],function(d){clearTimeout(i);if(b.predelay)j=setTimeout(function(){c.show(d)},b.predelay);else c.show(d)}).bind(k[1],function(d){clearTimeout(j);if(b.delay)i=setTimeout(function(){c.hide(d)},b.delay);else c.hide(d)});if(m&&
    b.cancelDefault){a.removeAttr("title");a.data("title",m)}f.extend(c,{show:function(d){if(!e){if(q)e=f(q);else if(m)e=f(b.layout).addClass(b.tipClass).appendTo(document.body).hide().append(m);else if(b.tip)e=f(b.tip).eq(0);else{e=a.next();e.length||(e=a.parent().next())}if(!e.length)throw"Cannot find tooltip for "+a;}if(c.isShown())return c;e.stop(true,true);var g=p(a,e,b);d=d||f.Event();d.type="onBeforeShow";h.trigger(d,[g]);if(d.isDefaultPrevented())return c;g=p(a,e,b);e.css({position:"absolute",
        top:g.top,left:g.left});l=true;r[0].call(c,function(){d.type="onShow";l="full";h.trigger(d)});g=b.events.tooltip.split(/,\s*/);e.bind(g[0],function(){clearTimeout(i);clearTimeout(j)});g[1]&&!a.is("input:not(:checkbox, :radio), textarea")&&e.bind(g[1],function(o){o.relatedTarget!=a[0]&&a.trigger(k[1].split(" ")[0])});return c},hide:function(d){if(!e||!c.isShown())return c;d=d||f.Event();d.type="onBeforeHide";h.trigger(d);if(!d.isDefaultPrevented()){l=false;n[b.effect][1].call(c,function(){d.type="onHide";
        h.trigger(d)});return c}},isShown:function(d){return d?l=="full":l},getConf:function(){return b},getTip:function(){return e},getTrigger:function(){return a}});f.each("onHide,onBeforeShow,onShow,onBeforeHide".split(","),function(d,g){f.isFunction(b[g])&&f(c).bind(g,b[g]);c[g]=function(o){f(c).bind(g,o);return c}})}f.tools=f.tools||{version:"1.2.4"};f.tools.tooltip={conf:{effect:"toggle",fadeOutSpeed:"fast",predelay:0,delay:30,opacity:1,tip:0,position:["top","center"],offset:[0,0],relative:false,cancelDefault:true,
        events:{def:"mouseenter,mouseleave",input:"focus,blur",widget:"focus mouseenter,blur mouseleave",tooltip:"mouseenter,mouseleave"},layout:"<div/>",tipClass:"tooltip"},addEffect:function(a,b,c){n[a]=[b,c]}};var n={toggle:[function(a){var b=this.getConf(),c=this.getTip();b=b.opacity;b<1&&c.css({opacity:b});c.show();a.call()},function(a){this.getTip().hide();a.call()}],fade:[function(a){var b=this.getConf();this.getTip().fadeTo(b.fadeInSpeed,b.opacity,a)},function(a){this.getTip().fadeOut(this.getConf().fadeOutSpeed,
        a)}]};f.fn.tooltip2=function(a){var b=this.data("tooltip");if(b)return b;a=f.extend(true,{},f.tools.tooltip.conf,a);if(typeof a.position=="string")a.position=a.position.split(/,?\s/);this.each(function(){b=new u(f(this),a);f(this).data("tooltip",b)});return a.api?b:this}})(jQuery);
(function(g){function j(a){var c=g(window),d=c.width()+c.scrollLeft(),h=c.height()+c.scrollTop();return[a.offset().top<=c.scrollTop(),d<=a.offset().left+a.width(),h<=a.offset().top+a.height(),c.scrollLeft()>=a.offset().left]}function k(a){for(var c=a.length;c--;)if(a[c])return false;return true}var i=g.tools.tooltip;i.dynamic={conf:{classNames:"top right bottom left"}};g.fn.dynamic=function(a){if(typeof a=="number")a={speed:a};a=g.extend({},i.dynamic.conf,a);var c=a.classNames.split(/\s/),d;this.each(function(){var h=
    g(this).tooltip2().onBeforeShow(function(e,f){e=this.getTip();var b=this.getConf();d||(d=[b.position[0],b.position[1],b.offset[0],b.offset[1],g.extend({},b)]);g.extend(b,d[4]);b.position=[d[0],d[1]];b.offset=[d[2],d[3]];e.css({visibility:"hidden",position:"absolute",top:f.top,left:f.left}).show();f=j(e);if(!k(f)){if(f[2]){g.extend(b,a.top);b.position[0]="top";e.addClass(c[0])}if(f[3]){g.extend(b,a.right);b.position[1]="right";e.addClass(c[1])}if(f[0]){g.extend(b,a.bottom);b.position[0]="bottom";e.addClass(c[2])}if(f[1]){g.extend(b,
        a.left);b.position[1]="left";e.addClass(c[3])}if(f[0]||f[2])b.offset[0]*=-1;if(f[1]||f[3])b.offset[1]*=-1}e.css({visibility:"visible"}).hide()});h.onBeforeShow(function(){var e=this.getConf();this.getTip();setTimeout(function(){e.position=[d[0],d[1]];e.offset=[d[2],d[3]]},0)});h.onHide(function(){var e=this.getTip();e.removeClass(a.classNames)});ret=h});return a.api?ret:this}})(jQuery);
/*
* jQuery timepicker addon
* By: Trent Richardson [http://trentrichardson.com]
* Version 0.6.2
* Last Modified: 9/26/2010
*
* Copyright 2010 Trent Richardson
* Dual licensed under the MIT and GPL licenses.
* http://trentrichardson.com/Impromptu/GPL-LICENSE.txt
* http://trentrichardson.com/Impromptu/MIT-LICENSE.txt
*
* HERES THE CSS:
* .ui-timepicker-div dl{ text-align: left; }
* .ui-timepicker-div dl dt{ height: 25px; }
* .ui-timepicker-div dl dd{ margin: -25px 0 10px 65px; }
*/
(function($){function Timepicker(singleton){if(typeof(singleton)==='boolean'&&singleton==true){this.regional=[];this.regional['']={currentText:'Now',ampm:false,timeFormat:'hh:mm tt',timeOnlyTitle:'Choose Time',timeText:'Time',hourText:'Hour',minuteText:'Minute',secondText:'Second'};this.defaults={showButtonPanel:true,timeOnly:false,showHour:true,showMinute:true,showSecond:false,showTime:true,stepHour:0.05,stepMinute:0.05,stepSecond:0.05,hour:0,minute:0,second:0,hourMin:0,minuteMin:0,secondMin:0,hourMax:23,minuteMax:59,secondMax:59,alwaysSetTime:true};$.extend(this.defaults,this.regional['']);}else{this.defaults=$.extend({},$.timepicker.defaults);}}Timepicker.prototype={$input:null,$timeObj:null,inst:null,hour_slider:null,minute_slider:null,second_slider:null,hour:0,minute:0,second:0,ampm:'',formattedDate:'',formattedTime:'',formattedDateTime:'',addTimePicker:function(dp_inst){var tp_inst=this;var currDT=this.$input.val();var regstr=this.defaults.timeFormat.toString().replace(/h{1,2}/ig,'(\\d?\\d)').replace(/m{1,2}/ig,'(\\d?\\d)').replace(/s{1,2}/ig,'(\\d?\\d)').replace(/t{1,2}/ig,'(am|pm|a|p)?').replace(/\s/g,'\\s?')+'$';if(!this.defaults.timeOnly){var dp_dateFormat=$.datepicker._get(dp_inst,'dateFormat');regstr='.{'+dp_dateFormat.length+',}\\s+'+regstr;}var order=this.getFormatPositions();var treg=currDT.match(new RegExp(regstr,'i'));if(treg){if(order.t!==-1){this.ampm=((treg[order.t]===undefined||treg[order.t].length===0)?'':(treg[order.t].charAt(0).toUpperCase()=='A')?'AM':'PM').toUpperCase();}if(order.h!==-1){if(this.ampm=='AM'&&treg[order.h]=='12'){this.hour=0;}else if(this.ampm=='PM'&&treg[order.h]!='12'){this.hour=(parseFloat(treg[order.h])+12).toFixed(0);}else{this.hour=treg[order.h];}}if(order.m!==-1){this.minute=treg[order.m];}if(order.s!==-1){this.second=treg[order.s];}}tp_inst.timeDefined=(treg)?true:false;if(typeof(dp_inst.stay_open)!=='boolean'||dp_inst.stay_open===false){setTimeout(function(){tp_inst.injectTimePicker(dp_inst,tp_inst);},10);}else{tp_inst.injectTimePicker(dp_inst,tp_inst);}},getFormatPositions:function(){var finds=this.defaults.timeFormat.toLowerCase().match(/(h{1,2}|m{1,2}|s{1,2}|t{1,2})/g);var orders={h:-1,m:-1,s:-1,t:-1};if(finds){for(var i=0;i<finds.length;i++){if(orders[finds[i].toString().charAt(0)]==-1){orders[finds[i].toString().charAt(0)]=i+1;}}}return orders;},injectTimePicker:function(dp_inst,tp_inst){var $dp=dp_inst.dpDiv;var opts=tp_inst.defaults;var hourMax=opts.hourMax-(opts.hourMax%opts.stepHour);var minMax=opts.minuteMax-(opts.minuteMax%opts.stepMinute);var secMax=opts.secondMax-(opts.secondMax%opts.stepSecond);if($dp.find("div#ui-timepicker-div-"+dp_inst.id).length===0){var noDisplay=' style="display:none;"';var html='<div class="ui-timepicker-div" id="ui-timepicker-div-'+dp_inst.id+'"><dl>'+'<dt class="ui_tpicker_time_label" id="ui_tpicker_time_label_'+dp_inst.id+'"'+((opts.showTime)?'':noDisplay)+'>'+opts.timeText+'</dt>'+'<dd class="ui_tpicker_time" id="ui_tpicker_time_'+dp_inst.id+'"'+((opts.showTime)?'':noDisplay)+'></dd>'+'<dt class="ui_tpicker_hour_label" id="ui_tpicker_hour_label_'+dp_inst.id+'"'+((opts.showHour)?'':noDisplay)+'>'+opts.hourText+'</dt>'+'<dd class="ui_tpicker_hour" id="ui_tpicker_hour_'+dp_inst.id+'"'+((opts.showHour)?'':noDisplay)+'></dd>'+'<dt class="ui_tpicker_minute_label" id="ui_tpicker_minute_label_'+dp_inst.id+'"'+((opts.showMinute)?'':noDisplay)+'>'+opts.minuteText+'</dt>'+'<dd class="ui_tpicker_minute" id="ui_tpicker_minute_'+dp_inst.id+'"'+((opts.showMinute)?'':noDisplay)+'></dd>'+'<dt class="ui_tpicker_second_label" id="ui_tpicker_second_label_'+dp_inst.id+'"'+((opts.showSecond)?'':noDisplay)+'>'+opts.secondText+'</dt>'+'<dd class="ui_tpicker_second" id="ui_tpicker_second_'+dp_inst.id+'"'+((opts.showSecond)?'':noDisplay)+'></dd>'+'</dl></div>';$tp=$(html);if(opts.timeOnly===true){$tp.prepend('<div class="ui-widget-header ui-helper-clearfix ui-corner-all">'+'<div class="ui-datepicker-title">'+opts.timeOnlyTitle+'</div>'+'</div>');$dp.find('.ui-datepicker-header, .ui-datepicker-calendar').hide();}tp_inst.hour_slider=$tp.find('#ui_tpicker_hour_'+dp_inst.id).slider({orientation:"horizontal",value:tp_inst.hour,min:opts.hourMin,max:hourMax,step:opts.stepHour,slide:function(event,ui){tp_inst.hour_slider.slider("option","value",ui.value);tp_inst.onTimeChange(dp_inst,tp_inst);}});tp_inst.minute_slider=$tp.find('#ui_tpicker_minute_'+dp_inst.id).slider({orientation:"horizontal",value:tp_inst.minute,min:opts.minuteMin,max:minMax,step:opts.stepMinute,slide:function(event,ui){tp_inst.minute_slider.slider("option","value",ui.value);tp_inst.onTimeChange(dp_inst,tp_inst);}});tp_inst.second_slider=$tp.find('#ui_tpicker_second_'+dp_inst.id).slider({orientation:"horizontal",value:tp_inst.second,min:opts.secondMin,max:secMax,step:opts.stepSecond,slide:function(event,ui){tp_inst.second_slider.slider("option","value",ui.value);tp_inst.onTimeChange(dp_inst,tp_inst);}});$dp.find('.ui-datepicker-calendar').after($tp);tp_inst.$timeObj=$('#ui_tpicker_time_'+dp_inst.id);if(dp_inst!==null){var timeDefined=tp_inst.timeDefined;tp_inst.onTimeChange(dp_inst,tp_inst);tp_inst.timeDefined=timeDefined;}}},onTimeChange:function(dp_inst,tp_inst){var hour=tp_inst.hour_slider.slider('value');var minute=tp_inst.minute_slider.slider('value');var second=tp_inst.second_slider.slider('value');var ampm=(hour<12)?'AM':'PM';var hasChanged=false;if(tp_inst.hour!=hour||tp_inst.minute!=minute||tp_inst.second!=second||(tp_inst.ampm.length>0&&tp_inst.ampm!=ampm)){hasChanged=true;}tp_inst.hour=parseFloat(hour).toFixed(0);tp_inst.minute=parseFloat(minute).toFixed(0);tp_inst.second=parseFloat(second).toFixed(0);tp_inst.ampm=ampm;tp_inst.formatTime(tp_inst);tp_inst.$timeObj.text(tp_inst.formattedTime);if(hasChanged){tp_inst.updateDateTime(dp_inst,tp_inst);tp_inst.timeDefined=true;}},formatTime:function(tp_inst){var tmptime=tp_inst.defaults.timeFormat.toString();var hour12=((tp_inst.ampm=='AM')?(tp_inst.hour):(tp_inst.hour%12));hour12=(hour12===0)?12:hour12;if(tp_inst.defaults.ampm===true){tmptime=tmptime.toString().replace(/hh/g,((hour12<10)?'0':'')+hour12).replace(/h/g,hour12).replace(/mm/g,((tp_inst.minute<10)?'0':'')+tp_inst.minute).replace(/m/g,tp_inst.minute).replace(/ss/g,((tp_inst.second<10)?'0':'')+tp_inst.second).replace(/s/g,tp_inst.second).replace(/TT/g,tp_inst.ampm.toUpperCase()).replace(/tt/g,tp_inst.ampm.toLowerCase()).replace(/T/g,tp_inst.ampm.charAt(0).toUpperCase()).replace(/t/g,tp_inst.ampm.charAt(0).toLowerCase());}else{tmptime=tmptime.toString().replace(/hh/g,((tp_inst.hour<10)?'0':'')+tp_inst.hour).replace(/h/g,tp_inst.hour).replace(/mm/g,((tp_inst.minute<10)?'0':'')+tp_inst.minute).replace(/m/g,tp_inst.minute).replace(/ss/g,((tp_inst.second<10)?'0':'')+tp_inst.second).replace(/s/g,tp_inst.second);tmptime=$.trim(tmptime.replace(/t/gi,''));}tp_inst.formattedTime=tmptime;return tp_inst.formattedTime;},updateDateTime:function(dp_inst,tp_inst){var dt=new Date(dp_inst.selectedYear,dp_inst.selectedMonth,dp_inst.selectedDay);var dateFmt=$.datepicker._get(dp_inst,'dateFormat');var formatCfg=$.datepicker._getFormatConfig(dp_inst);this.formattedDate=$.datepicker.formatDate(dateFmt,(dt===null?new Date():dt),formatCfg);var formattedDateTime=this.formattedDate;var timeAvailable=dt!==null&&tp_inst.timeDefined;if(this.defaults.timeOnly===true){formattedDateTime=this.formattedTime;}else if(this.defaults.timeOnly!==true&&(this.defaults.alwaysSetTime||timeAvailable)){formattedDateTime+=' '+this.formattedTime;}this.formattedDateTime=formattedDateTime;this.$input.val(formattedDateTime);this.$input.trigger("change");},setDefaults:function(settings){extendRemove(this.defaults,settings||{});return this;}};jQuery.fn.datetimepicker=function(o){var opts=(o===undefined?{}:o);var input=$(this);var tp=new Timepicker();var inlineSettings={};for(var attrName in tp.defaults){var attrValue=input.attr('time:'+attrName);if(attrValue){try{inlineSettings[attrName]=eval(attrValue);}catch(err){inlineSettings[attrName]=attrValue;}}}tp.defaults=$.extend(tp.defaults,inlineSettings);var beforeShowFunc=function(input,inst){tp.hour=tp.defaults.hour;tp.minute=tp.defaults.minute;tp.second=tp.defaults.second;tp.ampm='';tp.$input=$(input);tp.inst=inst;tp.addTimePicker(inst);if($.isFunction(opts.beforeShow)){opts.beforeShow(input,inst);}};var onChangeMonthYearFunc=function(year,month,inst){tp.updateDateTime(inst,tp);if($.isFunction(opts.onChangeMonthYear)){opts.onChangeMonthYear(year,month,inst);}};var onCloseFunc=function(dateText,inst){if(tp.timeDefined===true&&input.val()!=''){tp.updateDateTime(inst,tp);}if($.isFunction(opts.onClose)){opts.onClose(dateText,inst);}};tp.defaults=$.extend({},tp.defaults,opts,{beforeShow:beforeShowFunc,onChangeMonthYear:onChangeMonthYearFunc,onClose:onCloseFunc,timepicker:tp});$(this).datepicker(tp.defaults);};jQuery.fn.timepicker=function(opts){opts=$.extend(opts,{timeOnly:true});$(this).datetimepicker(opts);};$.datepicker._base_selectDate=$.datepicker._selectDate;$.datepicker._selectDate=function(id,dateStr){var target=$(id);var inst=this._getInst(target[0]);var tp_inst=$.datepicker._get(inst,'timepicker');if(tp_inst){inst.inline=true;inst.stay_open=true;$.datepicker._base_selectDate(id,dateStr);inst.stay_open=false;inst.inline=false;this._notifyChange(inst);this._updateDatepicker(inst);}else{$.datepicker._base_selectDate(id,dateStr);}};$.datepicker._base_updateDatepicker=$.datepicker._updateDatepicker;$.datepicker._updateDatepicker=function(inst){if(typeof(inst.stay_open)!=='boolean'||inst.stay_open===false){this._base_updateDatepicker(inst);this._beforeShow(inst.input,inst);}};$.datepicker._beforeShow=function(input,inst){var beforeShow=this._get(inst,'beforeShow');if(beforeShow){inst.stay_open=true;beforeShow.apply((inst.input?inst.input[0]:null),[inst.input,inst]);inst.stay_open=false;}};$.datepicker._base_doKeyPress=$.datepicker._doKeyPress;$.datepicker._doKeyPress=function(event){var inst=$.datepicker._getInst(event.target);var tp_inst=$.datepicker._get(inst,'timepicker');if(tp_inst){if($.datepicker._get(inst,'constrainInput')){var dateChars=$.datepicker._possibleChars($.datepicker._get(inst,'dateFormat'));var chr=String.fromCharCode(event.charCode===undefined?event.keyCode:event.charCode);var chrl=chr.toLowerCase();return event.ctrlKey||(chr<' '||!dateChars||dateChars.indexOf(chr)>-1||event.keyCode==58||event.keyCode==32||chr==':'||chr==' '||chrl=='a'||chrl=='p'||charl=='m');}}else{return $.datepicker._base_doKeyPress(event);}};$.datepicker._base_gotoToday=$.datepicker._gotoToday;$.datepicker._gotoToday=function(id){$.datepicker._base_gotoToday(id);var target=$(id);var dp_inst=this._getInst(target[0]);var tp_inst=$.datepicker._get(dp_inst,'timepicker');if(tp_inst){var date=new Date();var hour=date.getHours();var minute=date.getMinutes();var second=date.getSeconds();if((hour<tp_inst.defaults.hourMin||hour>tp_inst.defaults.hourMax)||(minute<tp_inst.defaults.minuteMin||minute>tp_inst.defaults.minuteMax)||(second<tp_inst.defaults.secondMin||second>tp_inst.defaults.secondMax)){hour=tp_inst.defaults.hourMin;minute=tp_inst.defaults.minuteMin;second=tp_inst.defaults.secondMin;}tp_inst.hour_slider.slider('value',hour);tp_inst.minute_slider.slider('value',minute);tp_inst.second_slider.slider('value',second);tp_inst.onTimeChange(dp_inst,tp_inst);}};function extendRemove(target,props){$.extend(target,props);for(var name in props)if(props[name]==null||props[name]==undefined)target[name]=props[name];return target;};$.timepicker=new Timepicker(true);})(jQuery);

/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#dt/dt-1.10.18/fc-3.2.5/fh-3.1.4
 *
 * Included libraries:
 *   DataTables 1.10.18, FixedColumns 3.2.5, FixedHeader 3.1.4
 */

// SweetAlert2 polyfill for IE11
/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/promise-polyfill@8.1.3/lib/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,n){"object"==typeof exports&&"undefined"!=typeof module?n():"function"==typeof define&&define.amd?define(n):n()}(0,function(){"use strict";function e(e){var n=this.constructor;return this.then(function(t){return n.resolve(e()).then(function(){return t})},function(t){return n.resolve(e()).then(function(){return n.reject(t)})})}function n(e){return!(!e||"undefined"==typeof e.length)}function t(){}function o(e){if(!(this instanceof o))throw new TypeError("Promises must be constructed via new");if("function"!=typeof e)throw new TypeError("not a function");this._state=0,this._handled=!1,this._value=undefined,this._deferreds=[],c(e,this)}function r(e,n){for(;3===e._state;)e=e._value;0!==e._state?(e._handled=!0,o._immediateFn(function(){var t=1===e._state?n.onFulfilled:n.onRejected;if(null!==t){var o;try{o=t(e._value)}catch(r){return void f(n.promise,r)}i(n.promise,o)}else(1===e._state?i:f)(n.promise,e._value)})):e._deferreds.push(n)}function i(e,n){try{if(n===e)throw new TypeError("A promise cannot be resolved with itself.");if(n&&("object"==typeof n||"function"==typeof n)){var t=n.then;if(n instanceof o)return e._state=3,e._value=n,void u(e);if("function"==typeof t)return void c(function(e,n){return function(){e.apply(n,arguments)}}(t,n),e)}e._state=1,e._value=n,u(e)}catch(r){f(e,r)}}function f(e,n){e._state=2,e._value=n,u(e)}function u(e){2===e._state&&0===e._deferreds.length&&o._immediateFn(function(){e._handled||o._unhandledRejectionFn(e._value)});for(var n=0,t=e._deferreds.length;t>n;n++)r(e,e._deferreds[n]);e._deferreds=null}function c(e,n){var t=!1;try{e(function(e){t||(t=!0,i(n,e))},function(e){t||(t=!0,f(n,e))})}catch(o){if(t)return;t=!0,f(n,o)}}var a=setTimeout;o.prototype["catch"]=function(e){return this.then(null,e)},o.prototype.then=function(e,n){var o=new this.constructor(t);return r(this,new function(e,n,t){this.onFulfilled="function"==typeof e?e:null,this.onRejected="function"==typeof n?n:null,this.promise=t}(e,n,o)),o},o.prototype["finally"]=e,o.all=function(e){return new o(function(t,o){function r(e,n){try{if(n&&("object"==typeof n||"function"==typeof n)){var u=n.then;if("function"==typeof u)return void u.call(n,function(n){r(e,n)},o)}i[e]=n,0==--f&&t(i)}catch(c){o(c)}}if(!n(e))return o(new TypeError("Promise.all accepts an array"));var i=Array.prototype.slice.call(e);if(0===i.length)return t([]);for(var f=i.length,u=0;i.length>u;u++)r(u,i[u])})},o.resolve=function(e){return e&&"object"==typeof e&&e.constructor===o?e:new o(function(n){n(e)})},o.reject=function(e){return new o(function(n,t){t(e)})},o.race=function(e){return new o(function(t,r){if(!n(e))return r(new TypeError("Promise.race accepts an array"));for(var i=0,f=e.length;f>i;i++)o.resolve(e[i]).then(t,r)})},o._immediateFn="function"==typeof setImmediate&&function(e){setImmediate(e)}||function(e){a(e,0)},o._unhandledRejectionFn=function(e){void 0!==console&&console&&console.warn("Possible Unhandled Promise Rejection:",e)};var l=function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if("undefined"!=typeof global)return global;throw Error("unable to locate global object")}();"Promise"in l?l.Promise.prototype["finally"]||(l.Promise.prototype["finally"]=e):l.Promise=o});

/*!
	autosize 4.0.2
	license: MIT
	http://www.jacklmoore.com/autosize
*/
!function(e,t){if("function"==typeof define&&define.amd)define(["module","exports"],t);else if("undefined"!=typeof exports)t(module,exports);else{var n={exports:{}};t(n,n.exports),e.autosize=n.exports}}(this,function(e,t){"use strict";var n,o,p="function"==typeof Map?new Map:(n=[],o=[],{has:function(e){return-1<n.indexOf(e)},get:function(e){return o[n.indexOf(e)]},set:function(e,t){-1===n.indexOf(e)&&(n.push(e),o.push(t))},delete:function(e){var t=n.indexOf(e);-1<t&&(n.splice(t,1),o.splice(t,1))}}),c=function(e){return new Event(e,{bubbles:!0})};try{new Event("test")}catch(e){c=function(e){var t=document.createEvent("Event");return t.initEvent(e,!0,!1),t}}function r(r){if(r&&r.nodeName&&"TEXTAREA"===r.nodeName&&!p.has(r)){var e,n=null,o=null,i=null,d=function(){r.clientWidth!==o&&a()},l=function(t){window.removeEventListener("resize",d,!1),r.removeEventListener("input",a,!1),r.removeEventListener("keyup",a,!1),r.removeEventListener("autosize:destroy",l,!1),r.removeEventListener("autosize:update",a,!1),Object.keys(t).forEach(function(e){r.style[e]=t[e]}),p.delete(r)}.bind(r,{height:r.style.height,resize:r.style.resize,overflowY:r.style.overflowY,overflowX:r.style.overflowX,wordWrap:r.style.wordWrap});r.addEventListener("autosize:destroy",l,!1),"onpropertychange"in r&&"oninput"in r&&r.addEventListener("keyup",a,!1),window.addEventListener("resize",d,!1),r.addEventListener("input",a,!1),r.addEventListener("autosize:update",a,!1),r.style.overflowX="hidden",r.style.wordWrap="break-word",p.set(r,{destroy:l,update:a}),"vertical"===(e=window.getComputedStyle(r,null)).resize?r.style.resize="none":"both"===e.resize&&(r.style.resize="horizontal"),n="content-box"===e.boxSizing?-(parseFloat(e.paddingTop)+parseFloat(e.paddingBottom)):parseFloat(e.borderTopWidth)+parseFloat(e.borderBottomWidth),isNaN(n)&&(n=0),a()}function s(e){var t=r.style.width;r.style.width="0px",r.offsetWidth,r.style.width=t,r.style.overflowY=e}function u(){if(0!==r.scrollHeight){var e=function(e){for(var t=[];e&&e.parentNode&&e.parentNode instanceof Element;)e.parentNode.scrollTop&&t.push({node:e.parentNode,scrollTop:e.parentNode.scrollTop}),e=e.parentNode;return t}(r),t=document.documentElement&&document.documentElement.scrollTop;r.style.height="",r.style.height=r.scrollHeight+n+"px",o=r.clientWidth,e.forEach(function(e){e.node.scrollTop=e.scrollTop}),t&&(document.documentElement.scrollTop=t)}}function a(){u();var e=Math.round(parseFloat(r.style.height)),t=window.getComputedStyle(r,null),n="content-box"===t.boxSizing?Math.round(parseFloat(t.height)):r.offsetHeight;if(n<e?"hidden"===t.overflowY&&(s("scroll"),u(),n="content-box"===t.boxSizing?Math.round(parseFloat(window.getComputedStyle(r,null).height)):r.offsetHeight):"hidden"!==t.overflowY&&(s("hidden"),u(),n="content-box"===t.boxSizing?Math.round(parseFloat(window.getComputedStyle(r,null).height)):r.offsetHeight),i!==n){i=n;var o=c("autosize:resized");try{r.dispatchEvent(o)}catch(e){}}}}function i(e){var t=p.get(e);t&&t.destroy()}function d(e){var t=p.get(e);t&&t.update()}var l=null;"undefined"==typeof window||"function"!=typeof window.getComputedStyle?((l=function(e){return e}).destroy=function(e){return e},l.update=function(e){return e}):((l=function(e,t){return e&&Array.prototype.forEach.call(e.length?e:[e],function(e){return r(e)}),e}).destroy=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],i),e},l.update=function(e){return e&&Array.prototype.forEach.call(e.length?e:[e],d),e}),t.default=l,e.exports=t.default});

/*! word-and-character-counter.js
v2.5 (c) Wilkins Fernandez
MIT License
*/
(function($){"use strict";$.fn.extend({counter:function(options){var defaults={type:"char",count:"down",goal:140,text:true,target:false,append:true,translation:"",msg:""};var $countObj="",countIndex="",noLimit=false,options=$.extend({},defaults,options);var methods={init:function($obj){var objID=$obj.attr("id"),counterID=objID+"_count";methods.isLimitless();$countObj=$("<span id="+counterID+"/>");var counterDiv=$("<div/>").attr("id",objID+"_counter").append($countObj).append(" "+methods.setMsg());if(!options.target||!$(options.target).length){options.append?counterDiv.insertAfter($obj):counterDiv.insertBefore($obj)}else{options.append?$(options.target).append(counterDiv):$(options.target).prepend(counterDiv)}methods.bind($obj)},bind:function($obj){$obj.bind("keypress.counter keydown.counter keyup.counter blur.counter focus.counter change.counter paste.counter",methods.updateCounter);$obj.bind("keydown.counter",methods.doStopTyping);$obj.trigger("keydown")},isLimitless:function(){if(options.goal==="sky"){options.count="up";noLimit=true;return noLimit}},setMsg:function(){if(options.msg!==""){return options.msg}if(options.text===false){return""}if(noLimit){if(options.msg!==""){return options.msg}else{return""}}this.text=options.translation||"character word left max";this.text=this.text.split(" ");this.chars="s ( )".split(" ");this.msg=null;switch(options.type){case"char":if(options.count===defaults.count&&options.text){this.msg=this.text[0]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.text[2]}else if(options.count==="up"&&options.text){this.msg=this.text[0]+this.chars[0]+" "+this.chars[1]+options.goal+" "+this.text[3]+this.chars[2]}break;case"word":if(options.count===defaults.count&&options.text){this.msg=this.text[1]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.text[2]}else if(options.count==="up"&&options.text){this.msg=this.text[1]+this.chars[1]+this.chars[0]+this.chars[2]+" "+this.chars[1]+options.goal+" "+this.text[3]+this.chars[2]}break;default:}return this.msg},getWords:function(val){if(val!==""){return $.trim(val).replace(/\s+/g," ").split(" ").length}else{return 0}},updateCounter:function(e){var $this=$(this);if(countIndex<0||countIndex>options.goal){methods.passedGoal($this)}if(options.type===defaults.type){if(options.count===defaults.count){countIndex=options.goal-$this.val().length;if(countIndex<=0){$countObj.text("0")}else{$countObj.text(countIndex)}}else if(options.count==="up"){countIndex=$this.val().length;$countObj.text(countIndex)}}else if(options.type==="word"){if(options.count===defaults.count){countIndex=methods.getWords($this.val());if(countIndex<=options.goal){countIndex=options.goal-countIndex;$countObj.text(countIndex)}else{$countObj.text("0")}}else if(options.count==="up"){countIndex=methods.getWords($this.val());$countObj.text(countIndex)}}return},doStopTyping:function(e){var keys=[46,8,9,35,36,37,38,39,40,32];if(methods.isGoalReached(e)){if(e.keyCode!==keys[0]&&e.keyCode!==keys[1]&&e.keyCode!==keys[2]&&e.keyCode!==keys[3]&&e.keyCode!==keys[4]&&e.keyCode!==keys[5]&&e.keyCode!==keys[6]&&e.keyCode!==keys[7]&&e.keyCode!==keys[8]){if(options.type===defaults.type){return false}else if(e.keyCode!==keys[9]&&e.keyCode!==keys[1]&&options.type!=defaults.type){return true}else{return false}}}},isGoalReached:function(e,_goal){if(noLimit){return false}if(options.count===defaults.count){_goal=0;return countIndex<=_goal?true:false}else{_goal=options.goal;return countIndex>=_goal?true:false}},wordStrip:function(numOfWords,text){var wordCount=text.replace(/\s+/g," ").split(" ").length;text=$.trim(text);if(numOfWords<=0||numOfWords===wordCount){return text}else{text=$.trim(text).split(" ");text.splice(numOfWords,wordCount,"");return $.trim(text.join(" "))}},passedGoal:function($obj){var userInput=$obj.val();if(options.type==="word"){$obj.val(methods.wordStrip(options.goal,userInput))}if(options.type==="char"){$obj.val(userInput.substring(0,options.goal))}if(options.type==="down"){$countObj.val("0")}if(options.type==="up"){$countObj.val(options.goal)}}};return this.each(function(){methods.init($(this))})}})})(jQuery);

// Based on "Dynamic Client Side Table Sorting" by Tom Dell'Aringa at http://www.dmxzone.com/
// index of the column that was sorted last. -1 specifies that the user has never clicked a sort column
var lastSort = -1;

// @param tableid string ID of the table to sort (e.g., <table id="rr_table" ...)
// @param sortColumn int Column index to sort (e.g., <tr><th>ID</th><th>Title</th></tr>, 0 = sort by id, 1 = sort by title)
// @param type string Specifies which algorithm to use when comparing values. (e.g., 'string','int','date')
function SortTable(tableid, sortColumn, type)
{
    // get table
    var table = document.getElementById(tableid);
    // get the table body
    var tbody = table.getElementsByTagName('tbody')[0];
    // get all rows of the table body
    var rows = tbody.getElementsByTagName('tr');
    // our new array of rows
    var rowArray = new Array();
    // number of rows we are working with
    var length = rows.length;
    //clone each row for sorting
    for (var i=0; i<length; i++)
    {
        // Ignore TH headers
        if (rows[i].getElementsByTagName('td').length > 0) {
            rowArray[i] = rows[i].cloneNode(true);
        }
    }
    // if user clicked on column 1 header two times in a row (for example)
    if (sortColumn == lastSort)
    {
        // merely reverse the array
        rowArray.reverse();
    }
    // else user is sorting by a different column header
    else
    {
        // save the index of the column we are sorting by in case we need to reverse
        lastSort = sortColumn;
        // what type of values exist in the column? string, int, date, float?
        switch(type)
        {
            // sort by number
            case 'float':
                rowArray.sort(RowCompareNumbers);
                break;
            // sort by integer
            case 'int':
                rowArray.sort(RowCompareIntegers);
                break;
            // sort by string/text
            case 'string':
                rowArray.sort(RowCompare);
                break;
            // sort by date
            case 'date':
                rowArray.sort(RowCompareDates);
                break;
        }
    }
    // create our new tbody to replace the old one
    var newTbody = document.createElement('tbody');
    var length = rowArray.length;
    var rowclass = '';
    // append all of our newly sorted rows
    for (var i=0; i<length; i++)
    {
        // determine row class (e.g., use "even" or "odd" css class)
        rowclass = (i % 2) ? 'erow' : '';
        // set class
        rowArray[i].className = rowclass;
        // append row to new tbody
        newTbody.appendChild(rowArray[i]);
    }
    // replace old data with new data
    table.replaceChild(newTbody, tbody);
}
// Text sort
function RowCompare(a, b)
{
    // Get all innerHtml
    var aValPre = a.getElementsByTagName('td')[lastSort].innerHTML.toLowerCase();
    var bValPre = b.getElementsByTagName('td')[lastSort].innerHTML.toLowerCase();
    // Remove all html
    var aValStripTags = aValPre.replace(/(<([^>]+)>)/ig,"").replace(/^\s*|\s*$/g,"");
    var bValStripTags = bValPre.replace(/(<([^>]+)>)/ig,"").replace(/^\s*|\s*$/g,"");
    // If contains only html and nothing else, then leave html (so we have something to compare against), else strip all tags
    var aVal = (aValStripTags.length==0) ? aValPre : aValStripTags;
    var bVal = (bValStripTags.length==0) ? bValPre : bValStripTags;
    var rVal;
    if(aVal == bVal)
    {
        rVal = 0;
    }
    else
    {
        if(aVal > bVal)
        {
            rVal = 1;
        }
        else
        {
            rVal = -1;
        }
    }
    return rVal;
}
// Integer sort
function RowCompareIntegers(a, b)
{
    var aVal = parseInt(a.getElementsByTagName('td')[lastSort].innerHTML.replace(/(<([^>]+)>)/ig,""), 10);
    var bVal = parseInt(b.getElementsByTagName('td')[lastSort].innerHTML.replace(/(<([^>]+)>)/ig,""), 10);
    return (aVal - bVal);
}
// Number sort
function RowCompareNumbers(a, b)
{
    var aVal = a.getElementsByTagName('td')[lastSort].innerHTML.replace(/(<([^>]+)>)/ig,"")*1;
    var bVal = b.getElementsByTagName('td')[lastSort].innerHTML.replace(/(<([^>]+)>)/ig,"")*1;
    return (aVal - bVal);
}
// Date sort
function RowCompareDates(a, b)
{
    var aVal = a.getElementsByTagName('td')[lastSort].innerHTML;
    var bVal = b.getElementsByTagName('td')[lastSort].innerHTML;

    if((a == '' || aVal == '&nbsp;') && (bVal == '' || bVal == '&nbsp;'))
        return 0;
    if(a == '' || aVal == '&nbsp;')
        return -1;
    if(bVal == '' || bVal == '&nbsp;')
        return 1;

    aVal = Date.parse(aVal.replace(/(<([^>]+)>)/ig,""));
    bVal = Date.parse(bVal.replace(/(<([^>]+)>)/ig,""));
    return (aVal - bVal);
}

// Quicksearch for searching text in html tables
jQuery(function ($) {
    $.fn.quicksearch = function (target, opt) {
        var timeout, cache, rowcache, jq_results, val = '', e = this, options = $.extend({
            delay: 100,
            selector: null,
            stripeRows: null,
            loader: null,
            noResults: '',
            bind: 'keyup',
            onBefore: function () {
                return;
            },
            onAfter: function () {
                return;
            },
            show: function () {
                this.style.display = "";
            },
            hide: function () {
                this.style.display = "none";
            }
        }, opt);

        this.go = function () {

            var i = 0, noresults = true, vals = val.toLowerCase().split(' ');

            var rowcache_length = rowcache.length;
            for (var i = 0; i < rowcache_length; i++)
            {
                if (this.test(vals, cache[i]) || val == "") {
                    options.show.apply(rowcache[i]);
                    noresults = false;
                } else {
                    options.hide.apply(rowcache[i]);
                }
            }

            if (noresults) {
                this.results(false);
            } else {
                this.results(true);
                this.stripe();
            }

            this.loader(false);
            options.onAfter();

            return this;
        };

        this.stripe = function () {

            if (typeof options.stripeRows === "object" && options.stripeRows !== null)
            {
                var joined = options.stripeRows.join(' ');
                var stripeRows_length = options.stripeRows.length;

                jq_results.not(':hidden').each(function (i) {
                    $(this).removeClass(joined).addClass(options.stripeRows[i % stripeRows_length]);
                });
            }

            return this;
        };

        this.strip_html = function (input) {
            var output = input.replace(/<\/?[^>]+>/gi, '');
            output = $.trim(output.toLowerCase());
            return output;
        };

        this.results = function (bool) {
            if (typeof options.noResults === "string" && options.noResults !== "") {
                if (bool) {
                    $(options.noResults).hide();
                } else {
                    $(options.noResults).show();
                }
            }
            return this;
        };

        this.loader = function (bool) {
            if (typeof options.loader === "string" && options.loader !== "") {
                (bool) ? $(options.loader).show() : $(options.loader).hide();
            }
            return this;
        };

        this.test = function (vals, t) {
            for (var i = 0; i < vals.length; i += 1) {
                if (t.indexOf(vals[i]) === -1) {
                    return false;
                }
            }
            return true;
        };

        this.cache = function () {

            jq_results = $(target);

            if (typeof options.noResults === "string" && options.noResults !== "") {
                jq_results = jq_results.not(options.noResults);
            }

            var t = (typeof options.selector === "string") ? jq_results.find(options.selector) : $(target).not(options.noResults);
            cache = t.map(function () {
                return e.strip_html(this.innerHTML);
            });

            rowcache = jq_results.map(function () {
                return this;
            });

            return this.go();
        };

        this.trigger = function () {
            this.loader(true);
            options.onBefore();

            window.clearTimeout(timeout);
            timeout = window.setTimeout(function () {
                e.go();
            }, options.delay);

            return this;
        };

        this.cache();
        this.results(true);
        this.stripe();
        this.loader(false);

        return this.each(function () {
            $(this).bind(options.bind, function () {
                val = $(this).val();
                e.trigger();
            });
        });

    };
});

/*
 * jQuery doTimeout: Like setTimeout, but better! - v1.0 - 3/3/2010
 * http://benalman.com/projects/jquery-dotimeout-plugin/
 *
 * Copyright (c) 2010 "Cowboy" Ben Alman
 * Dual licensed under the MIT and GPL licenses.
 * http://benalman.com/about/license/
 */
(function($){var a={},c="doTimeout",d=Array.prototype.slice;$[c]=function(){return b.apply(window,[0].concat(d.call(arguments)))};$.fn[c]=function(){var f=d.call(arguments),e=b.apply(this,[c+f[0]].concat(f));return typeof f[0]==="number"||typeof f[1]==="number"?this:e};function b(l){var m=this,h,k={},g=l?$.fn:$,n=arguments,i=4,f=n[1],j=n[2],p=n[3];if(typeof f!=="string"){i--;f=l=0;j=n[1];p=n[2]}if(l){h=m.eq(0);h.data(l,k=h.data(l)||{})}else{if(f){k=a[f]||(a[f]={})}}k.id&&clearTimeout(k.id);delete k.id;function e(){if(l){h.removeData(l)}else{if(f){delete a[f]}}}function o(){k.id=setTimeout(function(){k.fn()},j)}if(p){k.fn=function(q){if(typeof p==="string"){p=g[p]}p.apply(m,d.call(n,i))===true&&!q?o():e()};o()}else{if(k.fn){j===undefined?e():k.fn(j===false);return true}else{e()}}}})(jQuery);

// Add CustomEvent since IE does not support Event object
(function () {
    if ( typeof window.CustomEvent === "function" ) return false; //If not IE
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

// VARIABLE DECLARATIONS
var digits = "0123456789";
var lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
var uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
// whitespace characters
var whitespace = " \t\n\r";
// decimal point character differs by language and culture
var decimalPointDelimiter = "."
// non-digit characters which are allowed in phone numbers
var phoneNumberDelimiters = "()- ";
// characters which are allowed in US phone numbers
var validUSPhoneChars = digits + phoneNumberDelimiters;
// characters which are allowed in international phone numbers
// (a leading + is OK)
var validWorldPhoneChars = digits + phoneNumberDelimiters + "+";
// U.S. Social Security Numbers have 9 digits.
// They are formatted as 123-45-6789.
var digitsInSocialSecurityNumber = 9;
// U.S. phone numbers have 10 digits.
// They are formatted as 123 456 7890 or (123) 456-7890.
var digitsInUSPhoneNumber = 10;
// non-digit characters which are allowed in ZIP Codes
var ZIPCodeDelimiters = "-";
// our preferred delimiter for reformatting ZIP Codes
var ZIPCodeDelimeter = "-"
// characters which are allowed in Social Security Numbers
var validZIPCodeChars = digits + ZIPCodeDelimiters
// U.S. ZIP codes have 5 or 9 digits.
// They are formatted as 12345 or 12345-6789.
var digitsInZIPCode1 = 5
var digitsInZIPCode2 = 9
// CONSTANT STRING DECLARATIONS
// (grouped for ease of translation and localization)

// m is an abbreviation for "missing"
var mPrefix = "You did not enter a value into the "
var mSuffix = " field. This is a required field. Please enter it now."

// s is an abbreviation for "string"
var sUSLastName = "Last Name"
var sUSFirstName = "First Name"
var sWorldLastName = "Family Name"
var sWorldFirstName = "Given Name"
var sTitle = "Title"
var sCompanyName = "Company Name"
var sUSAddress = "Street Address"
var sCity = "City"
var sStateCode = "State Code"
var sCountry = "Country"
var sZIPCode = "ZIP Code"
var sWorldPostalCode = "Postal Code"
var sPhone = "Phone Number"
var sFax = "Fax Number"
var sDateOfBirth = "Date of Birth"
var sExpirationDate = "Expiration Date"
var sEmail = "Email"
var sOtherInfo = "Other Information"

// i is an abbreviation for "invalid"
var iZIPCode = "This field must be a 5 or 9 digit U.S. ZIP Code (like 94043). Please re-enter it now.";
var iUSPhone = "This field must be a 10 digit U.S. phone number. Please use a format such as (999) 999-9999, 999-999-9999, 9999999999, or with an extension such as (999) 999-9999 x9999 or 999-999-9999x999. Please re-enter it now.";
var iEmail = "This field must be a valid email address (like joe@user.com). Please re-enter it now.";
var iStateCode = "This field must be a valid two character U.S. state abbreviation (like CA for California). Please re-enter it now."
var iDay = "This field must be a day number between 1 and 31.  Please re-enter it now."
var iMonth = "This field must be a month number between 1 and 12.  Please re-enter it now."
var iYear = "This field must be a 2 or 4 digit year number.  Please re-enter it now."
var iDatePrefix = "The Day, Month, and Year for "
var iDateSuffix = " do not form a valid date.  Please re-enter them now."

// p is an abbreviation for "prompt"
var pEntryPrompt = "Please enter a "
var pStateCode = "2 character code (like CA)."
var pZIPCode = "5 or 9 digit U.S. ZIP Code (like 94043)."
var pUSPhone = "10 digit U.S. phone number (like 415 555 1212)."
var pEmail = "valid email address (like joe@user.com)."
var pDay = "day number between 1 and 31."
var pMonth = "month number between 1 and 12."
var pYear = "2 or 4 digit year number."


// Global variable defaultEmptyOK defines default return value
// for many functions when they are passed the empty string.
// By default, they will return defaultEmptyOK.
//
// defaultEmptyOK is false, which means that by default,
// these functions will do "strict" validation.  Function
// isInteger, for example, will only return true if it is
// passed a string containing an integer; if it is passed
// the empty string, it will return false.
//
// You can change this default behavior globally (for all
// functions which use defaultEmptyOK) by changing the value
// of defaultEmptyOK.
//
// Most of these functions have an optional argument emptyOK
// which allows you to override the default behavior for
// the duration of a function call.
//
// This functionality is useful because it is possible to
// say "if the user puts anything in this field, it must
// be an integer (or a phone number, or a string, etc.),
// but it's OK to leave the field empty too."
// This is the case for fields which are optional but which
// must have a certain kind of content if filled in.

var defaultEmptyOK = false




// Attempting to make this library run on Navigator 2.0,
// so I'm supplying this array creation routine as per
// JavaScript 1.0 documentation.  If you're using
// Navigator 3.0 or later, you don't need to do this;
// you can use the Array constructor instead.

function makeArray(n) {
//*** BUG: If I put this line in, I get two error messages:
//(1) Window.length can't be set by assignment
//(2) daysInMonth has no property indexed by 4
//If I leave it out, the code works fine.
//   this.length = n;
    for (var i = 1; i <= n; i++) {
        this[i] = 0
    }
    return this
}



var daysInMonth = makeArray(12);
daysInMonth[1] = 31;
daysInMonth[2] = 29;   // must programmatically check this
daysInMonth[3] = 31;
daysInMonth[4] = 30;
daysInMonth[5] = 31;
daysInMonth[6] = 30;
daysInMonth[7] = 31;
daysInMonth[8] = 31;
daysInMonth[9] = 30;
daysInMonth[10] = 31;
daysInMonth[11] = 30;
daysInMonth[12] = 31;

// Check whether string s is empty.

function isEmpty(s)
{   return ((s == null) || (s.length == 0))
}

// Removes all characters which appear in string bag from string s.

function stripCharsInBag (s, bag)

{   var i;
    var returnString = "";

    // Search through string's characters one by one.
    // If character is not in bag, append to returnString.

    for (i = 0; i < s.length; i++)
    {
        // Check that current character isn't whitespace.
        var c = s.charAt(i);
        if (bag.indexOf(c) == -1) returnString += c;
    }

    return returnString;
}

// Returns true if character c is an English letter
// (A .. Z, a..z).
//
// NOTE: Need i18n version to support European characters.
// This could be tricky due to different character
// sets and orderings for various languages and platforms.

function isLetter (c)
{   return ( ((c >= "a") && (c <= "z")) || ((c >= "A") && (c <= "Z")) )
}

// Returns true if character c is a digit
// (0 .. 9).

function isDigit (c)
{   return ((c >= "0") && (c <= "9"))
}

// isInteger (STRING s [, BOOLEAN emptyOK])
//
// Returns true if all characters in string s are numbers.
//
// Accepts non-signed integers only. Does not accept floating
// point, exponential notation, etc.
//
// We don't use parseInt because that would accept a string
// with trailing non-numeric characters.
//
// By default, returns defaultEmptyOK if s is empty.
// There is an optional second argument called emptyOK.
// emptyOK is used to override for a single function call
//      the default behavior which is specified globally by
//      defaultEmptyOK.
// If emptyOK is false (or any value other than true),
//      the function will return false if s is empty.
// If emptyOK is true, the function will return true if s is empty.
//
// EXAMPLE FUNCTION CALL:     RESULT:
// isInteger ("5")            true
// isInteger ("")             defaultEmptyOK
// isInteger ("-5")           false
// isInteger ("", true)       true
// isInteger ("", false)      false
// isInteger ("5", false)     true

function isInteger (s)

{   var i;

    if (isEmpty(s))
        if (isInteger.arguments.length == 1) return defaultEmptyOK;
        else return (isInteger.arguments[1] == true);

    // Search through string's characters one by one
    // until we find a non-numeric character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {
        // Check that current character is number.
        var c = s.charAt(i);

        if (!isDigit(c)) return false;
    }

    // All characters are numbers.
    return true;
}

// isSignedInteger (STRING s [, BOOLEAN emptyOK])
//
// Returns true if all characters are numbers;
// first character is allowed to be + or - as well.
//
// Does not accept floating point, exponential notation, etc.
//
// We don't use parseInt because that would accept a string
// with trailing non-numeric characters.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.
//
// EXAMPLE FUNCTION CALL:          RESULT:
// isSignedInteger ("5")           true
// isSignedInteger ("")            defaultEmptyOK
// isSignedInteger ("-5")          true
// isSignedInteger ("+5")          true
// isSignedInteger ("", false)     false
// isSignedInteger ("", true)      true

function isSignedInteger (s)

{   if (isEmpty(s))
    if (isSignedInteger.arguments.length == 1) return defaultEmptyOK;
    else return (isSignedInteger.arguments[1] == true);

else {
    var startPos = 0;
    var secondArg = defaultEmptyOK;

    if (isSignedInteger.arguments.length > 1)
        secondArg = isSignedInteger.arguments[1];

    // skip leading + or -
    if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") )
        startPos = 1;
    return (isInteger(s.substring(startPos, s.length), secondArg))
}
}

// isNonnegativeInteger (STRING s [, BOOLEAN emptyOK])
//
// Returns true if string s is an integer >= 0.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isNonnegativeInteger (s)
{   var secondArg = defaultEmptyOK;

    if (isNonnegativeInteger.arguments.length > 1)
        secondArg = isNonnegativeInteger.arguments[1];

    // The next line is a bit byzantine.  What it means is:
    // a) s must be a signed integer, AND
    // b) one of the following must be true:
    //    i)  s is empty and we are supposed to return true for
    //        empty strings
    //    ii) this is a number >= 0

    return (isSignedInteger(s, secondArg)
        && ( (isEmpty(s) && secondArg)  || (parseInt (s) >= 0) ) );
}

// isFloat (STRING s [, BOOLEAN emptyOK])
//
// True if string s is an unsigned floating point (real) number.
//
// Also returns true for unsigned integers. If you wish
// to distinguish between integers and floating point numbers,
// first call isInteger, then call isFloat.
//
// Does not accept exponential notation.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isFloat (s)

{   var i;
    var seenDecimalPoint = false;

    if (isEmpty(s))
        if (isFloat.arguments.length == 1) return defaultEmptyOK;
        else return (isFloat.arguments[1] == true);

    if (s == decimalPointDelimiter) return false;

    // Search through string's characters one by one
    // until we find a non-numeric character.
    // When we do, return false; if we don't, return true.

    for (i = 0; i < s.length; i++)
    {
        // Check that current character is number.
        var c = s.charAt(i);

        if ((c == decimalPointDelimiter) && !seenDecimalPoint) seenDecimalPoint = true;
        else if (!isDigit(c)) return false;
    }

    // All characters are numbers.
    return true;
}

// isSignedFloat (STRING s [, BOOLEAN emptyOK])
//
// True if string s is a signed or unsigned floating point
// (real) number. First character is allowed to be + or -.
//
// Also returns true for unsigned integers. If you wish
// to distinguish between integers and floating point numbers,
// first call isSignedInteger, then call isSignedFloat.
//
// Does not accept exponential notation.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isSignedFloat (s) {
    if (isEmpty(s)) {
        if (isSignedFloat.arguments.length == 1) {
            return defaultEmptyOK;
        } else {
            return (isSignedFloat.arguments[1] == true);
        }
    } else {
        var startPos = 0;
        var secondArg = defaultEmptyOK;
        if (isSignedFloat.arguments.length > 1) {
            secondArg = isSignedFloat.arguments[1];
        }
        // skip leading + or -
        if ( (s.charAt(0) == "-") || (s.charAt(0) == "+") ) {
            startPos = 1;
        }
        return (isFloat(s.substring(startPos, s.length), secondArg))
    }
}

// reformat (TARGETSTRING, STRING, INTEGER, STRING, INTEGER ... )
//
// Handy function for arbitrarily inserting formatting characters
// or delimiters of various kinds within TARGETSTRING.
//
// reformat takes one named argument, a string s, and any number
// of other arguments.  The other arguments must be integers or
// strings.  These other arguments specify how string s is to be
// reformatted and how and where other strings are to be inserted
// into it.
//
// reformat processes the other arguments in order one by one.
// * If the argument is an integer, reformat appends that number
//   of sequential characters from s to the resultString.
// * If the argument is a string, reformat appends the string
//   to the resultString.
//
// NOTE: The first argument after TARGETSTRING must be a string.
// (It can be empty.)  The second argument must be an integer.
// Thereafter, integers and strings must alternate.  This is to
// provide backward compatibility to Navigator 2.0.2 JavaScript
// by avoiding use of the typeof operator.
//
// It is the caller's responsibility to make sure that we do not
// try to copy more characters from s than s.length.
//
// EXAMPLES:
//
// * To reformat a 10-digit U.S. phone number from "1234567890"
//   to "(123) 456-7890" make this function call:
//   reformat("1234567890", "(", 3, ") ", 3, "-", 4)
//
// * To reformat a 9-digit U.S. Social Security number from
//   "123456789" to "123-45-6789" make this function call:
//   reformat("123456789", "", 3, "-", 2, "-", 4)
//
// HINT:
//
// If you have a string which is already delimited in one way
// (example: a phone number delimited with spaces as "123 456 7890")
// and you want to delimit it in another way using function reformat,
// call function stripCharsNotInBag to remove the unwanted
// characters, THEN call function reformat to delimit as desired.
//
// EXAMPLE:
//
// reformat (stripCharsNotInBag ("123 456 7890", digits),
//           "(", 3, ") ", 3, "-", 4)

function reformat (s)

{   var arg;
    var sPos = 0;
    var resultString = "";

    for (var i = 1; i < reformat.arguments.length; i++) {
        arg = reformat.arguments[i];
        if (i % 2 == 1) resultString += arg;
        else {
            resultString += s.substring(sPos, sPos + arg);
            sPos += arg;
        }
    }
    return resultString;
}

// isUSPhoneNumber (STRING s [, BOOLEAN emptyOK])
//
// isUSPhoneNumber returns true if string s is a valid U.S. Phone
// Number.  Must be 10 digits.
//
// NOTE: Strip out any delimiters (spaces, hyphens, parentheses, etc.)
// from string s before calling this function.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isUSPhoneNumber (s)
{   if (isEmpty(s))
    if (isUSPhoneNumber.arguments.length == 1) return defaultEmptyOK;
    else return (isUSPhoneNumber.arguments[1] == true);
    return (isInteger(s) && s.length == digitsInUSPhoneNumber)
}

// isZIPCode (STRING s [, BOOLEAN emptyOK])
//
// isZIPCode returns true if string s is a valid
// U.S. ZIP code.  Must be 5 or 9 digits only.
//
// NOTE: Strip out any delimiters (spaces, hyphens, etc.)
// from string s before calling this function.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isZIPCode (s)
{  if (isEmpty(s))
    if (isZIPCode.arguments.length == 1) return defaultEmptyOK;
    else return (isZIPCode.arguments[1] == true);
    return (isInteger(s) &&
        ((s.length == digitsInZIPCode1) ||
            (s.length == digitsInZIPCode2)))
}

// isEmail (STRING s [, BOOLEAN emptyOK])
//
// Email address must be of form a@b.c -- in other words:
// * there must be at least one character before the @
// * there must be at least one character before and after the .
// * the characters @ and . are both required
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isEmail (s)
{
    re5 = /^(?!\.)((?!.*\.{2})[a-zA-Z0-9\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF\.!#$%&'*+-/=?^_`{|}~\-\d]+)@(?!\.)([a-zA-Z0-9\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF\-\.\d]+)((\.([a-zA-Z\u0080-\u00FF\u0100-\u017F\u0180-\u024F\u0250-\u02AF\u0300-\u036F\u0370-\u03FF\u0400-\u04FF\u0500-\u052F\u0530-\u058F\u0590-\u05FF\u0600-\u06FF\u0700-\u074F\u0750-\u077F\u0780-\u07BF\u07C0-\u07FF\u0900-\u097F\u0980-\u09FF\u0A00-\u0A7F\u0A80-\u0AFF\u0B00-\u0B7F\u0B80-\u0BFF\u0C00-\u0C7F\u0C80-\u0CFF\u0D00-\u0D7F\u0D80-\u0DFF\u0E00-\u0E7F\u0E80-\u0EFF\u0F00-\u0FFF\u1000-\u109F\u10A0-\u10FF\u1100-\u11FF\u1200-\u137F\u1380-\u139F\u13A0-\u13FF\u1400-\u167F\u1680-\u169F\u16A0-\u16FF\u1700-\u171F\u1720-\u173F\u1740-\u175F\u1760-\u177F\u1780-\u17FF\u1800-\u18AF\u1900-\u194F\u1950-\u197F\u1980-\u19DF\u19E0-\u19FF\u1A00-\u1A1F\u1B00-\u1B7F\u1D00-\u1D7F\u1D80-\u1DBF\u1DC0-\u1DFF\u1E00-\u1EFF\u1F00-\u1FFF\u20D0-\u20FF\u2100-\u214F\u2C00-\u2C5F\u2C60-\u2C7F\u2C80-\u2CFF\u2D00-\u2D2F\u2D30-\u2D7F\u2D80-\u2DDF\u2F00-\u2FDF\u2FF0-\u2FFF\u3040-\u309F\u30A0-\u30FF\u3100-\u312F\u3130-\u318F\u3190-\u319F\u31C0-\u31EF\u31F0-\u31FF\u3200-\u32FF\u3300-\u33FF\u3400-\u4DBF\u4DC0-\u4DFF\u4E00-\u9FFF\uA000-\uA48F\uA490-\uA4CF\uA700-\uA71F\uA800-\uA82F\uA840-\uA87F\uAC00-\uD7AF\uF900-\uFAFF]){2,63})+)$/i;
    return re5.test(s);
}

// isYear (STRING s [, BOOLEAN emptyOK])
//
// isYear returns true if string s is a valid
// Year number.  Must be 2 or 4 digits only.
//
// For Year 2000 compliance, you are advised
// to use 4-digit year numbers everywhere.
//
// And yes, this function is not Year 10000 compliant, but
// because I am giving you 8003 years of advance notice,
// I don't feel very guilty about this ...
//
// For B.C. compliance, write your own function. ;->
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isYear (s)
{   if (isEmpty(s))
    if (isYear.arguments.length == 1) return defaultEmptyOK;
    else return (isYear.arguments[1] == true);
    if (!isNonnegativeInteger(s)) return false;
    return ((s.length == 2) || (s.length == 4));
}

// isIntegerInRange (STRING s, INTEGER a, INTEGER b [, BOOLEAN emptyOK])
//
// isIntegerInRange returns true if string s is an integer
// within the range of integer arguments a and b, inclusive.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.
function isIntegerInRange (s, a, b)
{   if (isEmpty(s))
    if (isIntegerInRange.arguments.length == 1) return defaultEmptyOK;
    else return (isIntegerInRange.arguments[1] == true);

    // Catch non-integer strings to avoid creating a NaN below,
    // which isn't available on JavaScript 1.0 for Windows.

    //MODIFIED BY PAUL HARRIS - 051204 WAS isInteger(...)
    if (!isSignedInteger(s, false)) return false;

    // Now, explicitly change the type to integer via parseInt
    // so that the comparison code below will work both on
    // JavaScript 1.2 (which typechecks in equality comparisons)
    // and JavaScript 1.1 and before (which doesn't).
    var num = parseInt (s);
    return ((num >= a) && (num <= b));
}

// isMonth (STRING s [, BOOLEAN emptyOK])
//
// isMonth returns true if string s is a valid
// month number between 1 and 12.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isMonth (s)
{   if (isEmpty(s))
    if (isMonth.arguments.length == 1) return defaultEmptyOK;
    else return (isMonth.arguments[1] == true);
    return isIntegerInRange (s, 1, 12);
}

// isDay (STRING s [, BOOLEAN emptyOK])
//
// isDay returns true if string s is a valid
// day number between 1 and 31.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function isDay (s)
{   if (isEmpty(s))
    if (isDay.arguments.length == 1) return defaultEmptyOK;
    else return (isDay.arguments[1] == true);
    return isIntegerInRange (s, 1, 31);
}

// daysInFebruary (INTEGER year)
//
// Given integer argument year,
// returns number of days in February of that year.

function daysInFebruary (year)
{   // February has 29 days in any year evenly divisible by four,
    // EXCEPT for centurial years which are not also divisible by 400.
    return (  ((year % 4 == 0) && ( (!(year % 100 == 0)) || (year % 400 == 0) ) ) ? 29 : 28 );
}

// isDate (STRING year, STRING month, STRING day)
//
// isDate returns true if string arguments year, month, and day
// form a valid date.
//

function isDate (year, month, day)
{   // catch invalid years (not 2- or 4-digit) and invalid months and days.
    if (! (isYear(year, false) && isMonth(month, false) && isDay(day, false))) return false;

    // Explicitly change type to integer to make code work in both
    // JavaScript 1.1 and JavaScript 1.2.
    var intYear = parseInt(year);
    var intMonth = parseInt(month);
    var intDay = parseInt(day);

    // catch invalid days, except for February
    if (intDay > daysInMonth[intMonth]) return false;

    if ((intMonth == 2) && (intDay > daysInFebruary(intYear))) return false;

    return true;
}

// takes ZIPString, a string of 5 or 9 digits;
// if 9 digits, inserts separator hyphen

function reformatZIPCode (ZIPString)
{   if (ZIPString.length == 5) return ZIPString;
else return (reformat (ZIPString, "", 5, "-", 4));
}

// checkZIPCode (TEXTFIELD theField [, BOOLEAN emptyOK==false])
//
// Check that string theField.value is a valid ZIP code.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function checkZIPCode (theField, emptyOK)
{   if (checkZIPCode.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    else
    { var normalizedZIP = stripCharsInBag(theField.value, ZIPCodeDelimiters)
        if (!isZIPCode(normalizedZIP, false))
            return warnInvalid (theField, iZIPCode);
        else
        {  // if you don't want to insert a hyphen, comment next line out
            theField.value = reformatZIPCode(normalizedZIP)
            return true;
        }
    }
}



// takes USPhone, a string of 10 digits
// and reformats as (123) 456-789

function reformatUSPhone (USPhone)
{   return (reformat (USPhone, "(", 3, ") ", 3, "-", 4))
}



// checkUSPhone (TEXTFIELD theField [, BOOLEAN emptyOK==false])
//
// Check that string theField.value is a valid US Phone.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

/*
function checkUSPhone (theField, emptyOK)
{   if (checkUSPhone.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    else
    {  var normalizedPhone = stripCharsInBag(theField.value, phoneNumberDelimiters)
       if (!isUSPhoneNumber(normalizedPhone, false))
          return warnInvalid (theField, iUSPhone);
       else
       {  // if you don't want to reformat as (123) 456-789, comment next line out
          theField.value = reformatUSPhone(normalizedPhone)
          return true;
       }
    }
}
 */
function checkUSPhone (theField, emptyOK)
{ if (checkUSPhone.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    else
    { var ext = ""; // A.P. start
        var fv = new String(theField.value);
        if (fv.indexOf("x") > -1) // Extension; check it and remove
        { ext = fv.slice(fv.indexOf("x")+1);
            ext = ext.replace(/[\s-\.]/g,"");
            fv = fv.slice(0,fv.indexOf("x"));
            if (/[^\d]/.test(ext)) return warnInvalid (theField, iUSPhone);
            ext = " x"+ext;
        }
        var normalizedPhone = stripCharsInBag(fv, phoneNumberDelimiters);
        fv = fv.replace(/[\s]/g,"");
        fv = fv.replace(/[-]/g,"");
        if (!/^\(?\d{3}\)?\d{3}-?\d{4}$/.test(fv)) // A.P. end
            // if (!isUSPhoneNumber(normalizedPhone, false))
            return warnInvalid (theField, iUSPhone);
        else
        {  // if you don't want to reformat as (123) 456-7890 x12345, comment next line out
            theField.value = reformatUSPhone(normalizedPhone)+ext; // OK, one more change - "+ext" added
            return true;
        }
    }
}

// checkEmail (TEXTFIELD theField [, BOOLEAN emptyOK==false])
//
// Check that string theField.value is a valid Email.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function checkEmail (theField, emptyOK)
{   if (checkEmail.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    else if (!isEmail(theField.value, false)) {
        return warnInvalid (theField, iEmail);
    }
    else return true;
}

// Check that string theField.value is a valid Year.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function checkYear (theField, emptyOK)
{   if (checkYear.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    if (!isYear(theField.value, false))
        return warnInvalid (theField, iYear);
    else return true;
}


// Check that string theField.value is a valid Month.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function checkMonth (theField, emptyOK)
{   if (checkMonth.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    if (!isMonth(theField.value, false))
        return warnInvalid (theField, iMonth);
    else return true;
}


// Check that string theField.value is a valid Day.
//
// For explanation of optional argument emptyOK,
// see comments of function isInteger.

function checkDay (theField, emptyOK)
{   if (checkDay.arguments.length == 1) emptyOK = defaultEmptyOK;
    if ((emptyOK == true) && (isEmpty(theField.value))) return true;
    if (!isDay(theField.value, false))
        return warnInvalid (theField, iDay);
    else return true;
}



// checkDate (yearField, monthField, dayField, STRING labelString [, OKtoOmitDay==false])
//
// Check that yearField.value, monthField.value, and dayField.value
// form a valid date.
//
// If they don't, labelString (the name of the date, like "Birth Date")
// is displayed to tell the user which date field is invalid.
//
// If it is OK for the day field to be empty, set optional argument
// OKtoOmitDay to true.  It defaults to false.

function checkDate (yearField, monthField, dayField, labelString, OKtoOmitDay)
{   // Next line is needed on NN3 to avoid "undefined is not a number" error
    // in equality comparison below.
    if (checkDate.arguments.length == 4) OKtoOmitDay = false;
    if (!isYear(yearField.value)) return warnInvalid (yearField, iYear);
    if (!isMonth(monthField.value)) return warnInvalid (monthField, iMonth);
    if ( (OKtoOmitDay == true) && isEmpty(dayField.value) ) return true;
    else if (!isDay(dayField.value))
        return warnInvalid (dayField, iDay);
    if (isDate (yearField.value, monthField.value, dayField.value))
        return true;
    alert (iDatePrefix + labelString + iDateSuffix)
    return false
}

//Begin Add - script from Vanderbilt
//2004-05-12 by Paul Harris

// ===================================================================
// Author: Matt Kruse <matt@mattkruse.com>
// WWW: http://www.mattkruse.com/
//
// NOTICE: You may use this code for any purpose, commercial or
// private, without any further permission from the author. You may
// remove this notice from your final code if you wish, however it is
// appreciated by the author if at least my web site address is kept.
//
// You may *NOT* re-distribute this code in any way except through its
// use. That means, you can include it in your product, or your web
// site, or any other form where the code is actually being used. You
// may not put the plain javascript up on your site for download or
// include it in your javascript libraries for download.
// If you wish to share this code with others, please just point them
// to the URL instead.
// Please DO NOT link directly to my .js files from your site. Copy
// the files to your server and use them there. Thank you.
// ===================================================================

// HISTORY
// ------------------------------------------------------------------
// May 17, 2003: Fixed bug in parseDate() for dates <1970
// March 11, 2003: Added parseDate() function
// March 11, 2003: Added "NNN" formatting option. Doesn't match up
//                 perfectly with SimpleDateFormat formats, but
//                 backwards-compatability was required.

// ------------------------------------------------------------------
// These functions use the same 'format' strings as the
// java.text.SimpleDateFormat class, with minor exceptions.
// The format string consists of the following abbreviations:
//
// Field        | Full Form          | Short Form
// -------------+--------------------+-----------------------
// Year         | yyyy (4 digits)    | yy (2 digits), y (2 or 4 digits)
// Month        | MMM (name or abbr.)| MM (2 digits), M (1 or 2 digits)
//              | NNN (abbr.)        |
// Day of Month | dd (2 digits)      | d (1 or 2 digits)
// Day of Week  | EE (name)          | E (abbr)
// Hour (1-12)  | hh (2 digits)      | h (1 or 2 digits)
// Hour (0-23)  | HH (2 digits)      | H (1 or 2 digits)
// Hour (0-11)  | KK (2 digits)      | K (1 or 2 digits)
// Hour (1-24)  | kk (2 digits)      | k (1 or 2 digits)
// Minute       | mm (2 digits)      | m (1 or 2 digits)
// Second       | ss (2 digits)      | s (1 or 2 digits)
// AM/PM        | a                  |
//
// NOTE THE DIFFERENCE BETWEEN MM and mm! Month=MM, not mm!
// Examples:
//  "MMM d, y" matches: January 01, 2000
//                      Dec 1, 1900
//                      Nov 20, 00
//  "M/d/yy"   matches: 01/20/00
//                      9/2/00
//  "MMM dd, yyyy hh:mm:ssa" matches: "January 01, 2000 12:30:45AM"
// ------------------------------------------------------------------

var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) {return(x<0||x>9?"":"0")+x}

// ------------------------------------------------------------------
// isDate ( date_string, format_string )
// Returns true if date string matches format of format string and
// is a valid date. Else returns false.
// It is recommended that you trim whitespace around the value before
// passing it to this function, as whitespace is NOT ignored!
// ------------------------------------------------------------------
function isDate(val,format) {
    var date=getDateFromFormat(val,format);
    if (date==0) { return false; }
    return true;
}

// -------------------------------------------------------------------
// compareDates(date1,date1format,date2,date2format)
//   Compare two date strings to see which is greater.
//   Returns:
//   1 if date1 is greater than date2
//   0 if date2 is greater than date1 or if they are the same
//  -1 if either of the dates is in an invalid format
// -------------------------------------------------------------------
function compareDates(date1,dateformat1,date2,dateformat2) {
    var d1=getDateFromFormat(date1,dateformat1);
    var d2=getDateFromFormat(date2,dateformat2);
    if (d1==0 || d2==0) {
        return -1;
    }
    else if (d1 > d2) {
        return 1;
    }
    return 0;
}

// ------------------------------------------------------------------
// formatDate (date_object, format)
// Returns a date in the output format specified.
// The format string uses the same abbreviations as in getDateFromFormat()
// ------------------------------------------------------------------
function formatDate(date,format) {
    format=format+"";
    var result="";
    var i_format=0;
    var c="";
    var token="";
    var y=date.getYear()+"";
    var M=date.getMonth()+1;
    var d=date.getDate();
    var E=date.getDay();
    var H=date.getHours();
    var m=date.getMinutes();
    var s=date.getSeconds();
    var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
    // Convert real date parts into formatted versions
    var value=new Array();
    if (y.length < 4) {
        y=""+(y-0+1900);
    }
    value["y"]=""+y;
    value["yyyy"]=y;
    value["yy"]=y.substring(2,4);
    value["M"]=M;
    value["MM"]=LZ(M);
    value["MMM"]=MONTH_NAMES[M-1];
    value["NNN"]=MONTH_NAMES[M+11];
    value["d"]=d;
    value["dd"]=LZ(d);
    value["E"]=DAY_NAMES[E+7];
    value["EE"]=DAY_NAMES[E];
    value["H"]=H;
    value["HH"]=LZ(H);
    if (H==0){value["h"]=12;}
    else if (H>12){value["h"]=H-12;}
    else {value["h"]=H;}
    value["hh"]=LZ(value["h"]);
    if (H>11){value["K"]=H-12;} else {value["K"]=H;}
    value["k"]=H+1;
    value["KK"]=LZ(value["K"]);
    value["kk"]=LZ(value["k"]);
    if (H > 11) { value["a"]="PM"; }
    else { value["a"]="AM"; }
    value["m"]=m;
    value["mm"]=LZ(m);
    value["s"]=s;
    value["ss"]=LZ(s);
    while (i_format < format.length) {
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) { result=result + value[token]; }
        else { result=result + token; }
    }
    return result;
}

// ------------------------------------------------------------------
// Utility functions for parsing in getDateFromFormat()
// ------------------------------------------------------------------
function _isInteger(val) {
    var digits="1234567890";
    for (var i=0; i < val.length; i++) {
        if (digits.indexOf(val.charAt(i))==-1) { return false; }
    }
    return true;
}
function _getInt(str,i,minlength,maxlength) {
    for (var x=maxlength; x>=minlength; x--) {
        var token=str.substring(i,i+x);
        if (token.length < minlength) { return null; }
        if (_isInteger(token)) { return token; }
    }
    return null;
}

// ------------------------------------------------------------------
// getDateFromFormat( date_string , format_string )
//
// This function takes a date string and a format string. It matches
// If the date string matches the format string, it returns the
// getTime() of the date. If it does not match, it returns 0.
// ------------------------------------------------------------------
function getDateFromFormat(val,format) {
    val=val+"";
    format=format+"";
    var i_val=0;
    var i_format=0;
    var c="";
    var token="";
    var token2="";
    var x,y;
    var now=new Date();
    var year=now.getYear();
    var month=now.getMonth()+1;
    var date=1;
    var hh=now.getHours();
    var mm=now.getMinutes();
    var ss=now.getSeconds();
    var ampm="";

    while (i_format < format.length) {
        // Get next token from format string
        c=format.charAt(i_format);
        token="";
        while ((format.charAt(i_format)==c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        // Extract contents of value based on format token
        if (token=="yyyy" || token=="yy" || token=="y") {
            if (token=="yyyy") { x=4;y=4; }
            if (token=="yy")   { x=2;y=2; }
            if (token=="y")    { x=2;y=4; }
            year=_getInt(val,i_val,x,y);
            if (year==null) { return 0; }
            i_val += year.length;
            if (year.length==2) {
                //START RT Changed this Code
                var this_year_2d = ""+now.getFullYear();
                this_year_2d = this_year_2d.substring(2)*1;
                year = (year <= (this_year_2d+10)) ? (year-0+2000) : (year-0+1900);
                //END RT Changed this Code
                //START PH Changed this Code
                //The code now assumes any 2 digit year is in the future if
                //within 5 years of this year or in the past if otherwise.
                // var thisyear=now.getYear();
                // year=2000+(year-0);
                // if (year>thisyear+5){
                // year=year-100;
                // }
                //WAS
                //if (year > 70) { year=1900+(year-0); }
                //else { year=2000+(year-0); }
                //END PH Changed this Code
            }
        }
        else if (token=="MMM"||token=="NNN"){
            month=0;
            for (var i=0; i<MONTH_NAMES.length; i++) {
                var month_name=MONTH_NAMES[i];
                if (val.substring(i_val,i_val+month_name.length).toLowerCase()==month_name.toLowerCase()) {
                    if (token=="MMM"||(token=="NNN"&&i>11)) {
                        month=i+1;
                        if (month>12) { month -= 12; }
                        i_val += month_name.length;
                        break;
                    }
                }
            }
            if ((month < 1)||(month>12)){return 0;}
        }
        else if (token=="EE"||token=="E"){
            for (var i=0; i<DAY_NAMES.length; i++) {
                var day_name=DAY_NAMES[i];
                if (val.substring(i_val,i_val+day_name.length).toLowerCase()==day_name.toLowerCase()) {
                    i_val += day_name.length;
                    break;
                }
            }
        }
        else if (token=="MM"||token=="M") {
            month=_getInt(val,i_val,token.length,2);
            if(month==null||(month<1)||(month>12)){return 0;}
            i_val+=month.length;}
        else if (token=="dd"||token=="d") {
            date=_getInt(val,i_val,token.length,2);
            if(date==null||(date<1)||(date>31)){return 0;}
            i_val+=date.length;}
        else if (token=="hh"||token=="h") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>12)){return 0;}
            i_val+=hh.length;}
        else if (token=="HH"||token=="H") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>23)){return 0;}
            i_val+=hh.length;}
        else if (token=="KK"||token=="K") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<0)||(hh>11)){return 0;}
            i_val+=hh.length;}
        else if (token=="kk"||token=="k") {
            hh=_getInt(val,i_val,token.length,2);
            if(hh==null||(hh<1)||(hh>24)){return 0;}
            i_val+=hh.length;hh--;}
        else if (token=="mm"||token=="m") {
            mm=_getInt(val,i_val,token.length,2);
            if(mm==null||(mm<0)||(mm>59)){return 0;}
            i_val+=mm.length;}
        else if (token=="ss"||token=="s") {
            ss=_getInt(val,i_val,token.length,2);
            if(ss==null||(ss<0)||(ss>59)){return 0;}
            i_val+=ss.length;}
        else if (token=="a") {
            if (val.substring(i_val,i_val+2).toLowerCase()=="am") {ampm="AM";}
            else if (val.substring(i_val,i_val+2).toLowerCase()=="pm") {ampm="PM";}
            else {return 0;}
            i_val+=2;}
        else {
            if (val.substring(i_val,i_val+token.length)!=token) {return 0;}
            else {i_val+=token.length;}
        }
    }
    // If there are any trailing characters left in the value, it doesn't match
    if (i_val != val.length) { return 0; }
    // Is date valid for month?
    if (month==2) {
        // Check for leap year
        if ( ( (year%4==0)&&(year%100 != 0) ) || (year%400==0) ) { // leap year
            if (date > 29){ return 0; }
        }
        else { if (date > 28) { return 0; } }
    }
    if ((month==4)||(month==6)||(month==9)||(month==11)) {
        if (date > 30) { return 0; }
    }
    // Correct hours value
    if (hh<12 && ampm=="PM") { hh=hh-0+12; }
    else if (hh>11 && ampm=="AM") { hh-=12; }
    var newdate=new Date(year,month-1,date,hh,mm,ss);
    return newdate.getTime();
}

// ------------------------------------------------------------------
// parseDate( date_string [, prefer_euro_format] )
//
// This function takes a date string and tries to match it to a
// number of possible date formats to get the value. It will try to
// match against the following international formats, in this order:
// y-M-d   MMM d, y   MMM d,y   y-MMM-d   d-MMM-y  MMM d
// M/d/y   M-d-y      M.d.y     MMM-d     M/d      M-d
// d/M/y   d-M-y      d.M.y     d-MMM     d/M      d-M
// A second argument may be passed to instruct the method to search
// for formats like d/M/y (european format) before M/d/y (American).
// Returns a Date object or null if no patterns match.
// ------------------------------------------------------------------
function parseDate(val) {
    var preferEuro=(arguments.length==2)?arguments[1]:false;
    generalFormats=new Array('y-M-d','MMM d, y','MMM d,y','y-MMM-d','d-MMM-y','MMM d');
    monthFirst=new Array('M/d/y','M-d-y','M.d.y','MMM-d','M/d','M-d');
    dateFirst =new Array('d/M/y','d-M-y','d.M.y','d-MMM','d/M','d-M');
    var checkList=new Array('generalFormats',preferEuro?'dateFirst':'monthFirst',preferEuro?'monthFirst':'dateFirst');
    var d=null;
    for (var i=0; i<checkList.length; i++) {
        var l=window[checkList[i]];
        for (var j=0; j<l.length; j++) {
            d=getDateFromFormat(val,l[j]);
            if (d!=0) { return new Date(d); }
        }
    }
    return null;
}

// Check if in HH:MM military format
function isTime(val,hasSeconds) {
    if (hasSeconds) {
        var regex=/^(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23)[:](0|1|2|3|4|5)\d{1}[:](0|1|2|3|4|5)\d{1}$/;
    } else {
        var regex=/^(00|01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23)[:](0|1|2|3|4|5)\d{1}$/;
    }
    return regex.test(val);
}