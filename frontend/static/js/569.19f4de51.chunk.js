/*! For license information please see 569.19f4de51.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[569],{72644:function(t,n,e){e.d(n,{Z:function(){return p}}),e(60740);var c=e(27378),r=e(98889),a=e(87228),o=e(90866),i=e(65852),u=e(62581),l=(e(20610),e(8019)),s=e(46401);function f(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,c=new Array(n);e<n;e++)c[e]=t[e];return c}var p=function(t){var n,e,p=(n=(0,c.useState)({}),e=2,function(t){if(Array.isArray(t))return t}(n)||function(t,n){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var c,r,a,o,i=[],u=!0,l=!1;try{if(a=(e=e.call(t)).next,0===n){if(Object(e)!==e)return;u=!1}else for(;!(u=(c=a.call(e)).done)&&(i.push(c.value),i.length!==n);u=!0);}catch(t){l=!0,r=t}finally{try{if(!u&&null!=e.return&&(o=e.return(),Object(o)!==o))return}finally{if(l)throw r}}return i}}(n,e)||function(t,n){if(t){if("string"==typeof t)return f(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?f(t,n):void 0}}(n,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()),g=p[0],m=p[1];return(0,c.useEffect)((function(){(0,l.h1)(t).then((function(t){m(t.data)})).catch((function(t){console.log(t)}))}),[t]),c.createElement("div",{className:"component"},c.createElement("div",{className:"row_navigation"},c.createElement(r.Link,{className:"navigation_button",to:r.routes.specificDatacrate({datacrate_id:String(t)})},c.createElement("div",null,(0,s.bO)(g.storage_path)||c.createElement(u.Z,null))),c.createElement(r.Link,{className:"navigation_button",to:r.routes.specificDatacrateContent({datacrate_id:String(t)})},c.createElement("div",null,c.createElement(a.MDs,null))),c.createElement(r.Link,{className:"navigation_button",to:r.routes.specificDatacrateGit({datacrate_id:String(t)})},c.createElement("div",null,c.createElement(o.HxG,null))),c.createElement(r.Link,{className:"navigation_button",to:r.routes.specificDatacrateSettings({datacrate_id:String(t)})},c.createElement("div",null,c.createElement(i.xRF,null)))))}},45448:function(t,n,e){e.r(n);var c=e(27378),r=e(98889),a=e(31786),o=e(72644);n.default=function(t){var n=t.datacrate_id;return c.createElement(c.Fragment,null,c.createElement(a.MetaTags,{title:"SpecificDatacrateSettings",description:"SpecificDatacrateSettings page"}),(0,o.Z)(n),c.createElement("h1",null,"SpecificDatacrateSettingsPage"),c.createElement("p",null,"Find me in"," ",c.createElement("code",null,"./web/src/pages/SpecificDatacrateSettingsPage/SpecificDatacrateSettingsPage.js")),c.createElement("p",null,"My default route is named ",c.createElement("code",null,"specificDatacrateSettings"),", link to me with `",c.createElement(r.Link,{to:r.routes.specificDatacrateSettings({datacrate_id:"42"})},"SpecificDatacrateSettings 42"),"`"),c.createElement("p",null,"The parameter passed to me is ",n))}},8019:function(t,n,e){e.d(n,{$o:function(){return d},A9:function(){return i},Ai:function(){return u},Eh:function(){return g},JX:function(){return v},J_:function(){return w},ON:function(){return o},Pj:function(){return s},Ry:function(){return D},Sq:function(){return E},VR:function(){return l},Wk:function(){return h},Wr:function(){return b},YQ:function(){return k},h1:function(){return p},p:function(){return _},sq:function(){return y},tF:function(){return f},vp:function(){return m},wC:function(){return S}});var c=e(14206),r=e.n(c),a=e(61194);(0,a.ZP)(r(),{retries:5}),(0,a.ZP)(r(),{retryDelay:a.ZP.exponentialDelay}),(0,a.ZP)(r(),{shouldResetTimeout:!0}),(0,a.ZP)(r(),{retryCondition:function(){return!0}});var o="".concat("http://localhost:6656","/apiv1"),i=function(){return r().get("".concat(o,"/profiles"))},u=function(t){return r().get("".concat(o,"/profiles/").concat(t))},l=function(){return r().get("".concat(o,"/projects"))},s=function(t){return r().get("".concat(o,"/projects/").concat(t))},f=function(){return r().get("".concat(o,"/spaces/"))},p=function(t){return r().get("".concat(o,"/spaces/").concat(t))},g=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/fixcrate"))},m=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/git/status/"))},d=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/git/diff/"))},h=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/git/history/"))},v=function(t,n,e){return r().post("".concat(o,"/spaces/").concat(t,"/git/").concat(n),e)},E=function(t,n){return r().get("".concat(o,"/spaces/").concat(t,"/content/").concat(n))},y=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/content/openexplorer"))},S=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/annotation/"))},b=function(t,n,e){return r().post("".concat(o,"/spaces/").concat(t,"/annotation/file/").concat(n),e)},_=function(t,n){return r().get("".concat(o,"/spaces/").concat(t,"/annotation/file/").concat(n))},D=function(t,n,e){return r().post("".concat(o,"/spaces/").concat(t,"/annotation/file/node/").concat(n),e)},k=function(t,n,e){return r().delete("".concat(o,"/spaces/").concat(t,"/annotation/file/").concat(e,"/").concat(n))},w=function(t){return r().get("".concat(o,"/spaces/").concat(t,"/annotation/shacl_report"))}},46401:function(t,n,e){e.d(n,{PX:function(){return r},bO:function(){return a}});var c=e(27378),r=(e(76721),e(96085),e(39393),e(96083),e(72254),function(t){return console.log(t),Array.isArray(t)?t.map((function(t){return null===t?null:t.includes("http")||t.includes("https")?c.createElement("a",{href:t,target:"_blank"},t):t})):null===t?t:t.includes("http")||t.includes("https")?c.createElement("a",{href:t,target:"_blank"},t):t}),a=function(t){if(null==t)return null;var n=t.split("/"),e=n[n.length-1].split("\\");return e[e.length-1]}}}]);