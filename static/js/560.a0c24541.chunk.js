/*! For license information please see 560.a0c24541.chunk.js.LICENSE.txt */
(self.webpackChunkweb=self.webpackChunkweb||[]).push([[560],{59007:function(t,n,e){"use strict";e.d(n,{Z:function(){return a}});var r=e(27378),o=e(48484),c=e.n(o),a=function(t){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"normal";return"small"==n||"S"==n?r.createElement("div",{className:"loader small"},r.createElement("h6",null,t)):r.createElement("div",{className:"loader normal"},r.createElement(c(),{type:"spinningBubbles",color:"#116270",height:50,width:50}),r.createElement("h2",null,t))}},3560:function(t,n,e){"use strict";e.r(n),e(76721),e(96085),e(14078),e(60740);var r=e(27378),o=e(98889),c=e(31786),a=e(8019),u=(e(46401),e(59007));function i(t,n){return function(t){if(Array.isArray(t))return t}(t)||function(t,n){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var r,o,c=[],a=!0,u=!1;try{for(e=e.call(t);!(a=(r=e.next()).done)&&(c.push(r.value),!n||c.length!==n);a=!0);}catch(t){u=!0,o=t}finally{try{a||null==e.return||e.return()}finally{if(u)throw o}}return c}}(t,n)||function(t,n){if(t){if("string"==typeof t)return l(t,n);var e=Object.prototype.toString.call(t).slice(8,-1);return"Object"===e&&t.constructor&&(e=t.constructor.name),"Map"===e||"Set"===e?Array.from(t):"Arguments"===e||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)?l(t,n):void 0}}(t,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,n){(null==n||n>t.length)&&(n=t.length);for(var e=0,r=new Array(n);e<n;e++)r[e]=t[e];return r}e(29459),n.default=function(){var t=i((0,r.useState)([]),2),n=t[0],e=t[1],l=i((0,r.useState)([]),2),f=l[0],s=l[1],p=i((0,r.useState)(!0),2),h=p[0],v=p[1],d=i((0,r.useState)(!1),2),m=d[0],y=d[1],g=i((0,r.useState)(""),2),E=g[0],b=g[1];return(0,r.useEffect)((function(){(0,a.VR)().then((function(t){s(t.data)}),(function(t){console.log(t),b(t.response),v(!1),y(!0)})),(0,a.A9)().then((function(t){e(t.data),v(!1)})).catch((function(t){console.log(t),b(t.response),v(!1),y(!0)}))}),[]),h?(0,u.Z)("Loading Profiles..."):m?AxiosError(E):r.createElement("div",null,r.createElement(c.MetaTags,null,r.createElement("title",null,"Overview Profiles")),r.createElement("div",{className:"component"},r.createElement("h1",null,"Overview Profiles"),r.createElement("table",{className:"table_vliz"},r.createElement("thead",null,r.createElement("tr",null,r.createElement("th",null,"Name"),r.createElement("th",null,"Parent Space"))),r.createElement("tbody",null,n.map((function(t){return r.createElement("tr",{key:t.uuid},r.createElement("td",null,r.createElement(o.Link,{to:o.routes.specificProfile({profile_id:String(t.uuid)})},t.name)),r.createElement("td",null,function(t){for(var n=0;n<f.length;n++)if(f[n].name===t){var e=f[n].uuid;return r.createElement(o.Link,{to:o.routes.specificSpace({space_id:String(e)})},t)}return t}(t.parent_space)))}))))))}},8019:function(t,n,e){"use strict";e.d(n,{$o:function(){return d},A9:function(){return u},Ai:function(){return i},Eh:function(){return h},JX:function(){return y},J_:function(){return I},Pj:function(){return f},Sq:function(){return g},V4:function(){return x},VR:function(){return l},Wk:function(){return m},Wr:function(){return w},YQ:function(){return A},h1:function(){return p},p:function(){return S},sq:function(){return E},tF:function(){return s},vp:function(){return v},wC:function(){return b}});var r=e(14206),o=e.n(r),c=e(61194);(0,c.ZP)(o(),{retries:4}),(0,c.ZP)(o(),{retryDelay:c.ZP.exponentialDelay});var a="".concat("http://localhost:6656","/apiv1"),u=function(){return o().get("".concat(a,"/profiles"))},i=function(t){return o().get("".concat(a,"/profiles/").concat(t))},l=function(){return o().get("".concat(a,"/projects"))},f=function(t){return o().get("".concat(a,"/projects/").concat(t))},s=function(){return o().get("".concat(a,"/spaces/"))},p=function(t){return o().get("".concat(a,"/spaces/").concat(t))},h=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/fixcrate"))},v=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/git/status/"))},d=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/git/diff/"))},m=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/git/history/"))},y=function(t,n,e){return o().post("".concat(a,"/spaces/").concat(t,"/git/").concat(n),e)},g=function(t,n){return o().get("".concat(a,"/spaces/").concat(t,"/content/").concat(n))},E=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/content/openexplorer"))},b=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/annotation/"))},w=function(t,n,e){return o().post("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(n),e)},S=function(t,n){return o().get("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(n))},x=function(t,n,e){return o().post("".concat(a,"/spaces/").concat(t,"/annotation/file/blanknode/").concat(n),e)},A=function(t,n,e){return o().delete("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(e,"/").concat(n))},I=function(t){return o().get("".concat(a,"/spaces/").concat(t,"/annotation/shacl_report"))}},46401:function(t,n,e){"use strict";e.d(n,{PX:function(){return o},bO:function(){return c}});var r=e(27378),o=(e(76721),e(96085),e(95623),e(39393),e(96083),e(72254),function(t){return console.log(t),Array.isArray(t)?t.map((function(t){return null===t?null:t.includes("http")||t.includes("https")?r.createElement("a",{href:t,target:"_blank"},t):t})):null===t?t:t.includes("http")||t.includes("https")?r.createElement("a",{href:t,target:"_blank"},t):t}),c=function(t){if(null==t)return null;var n=t.split("/"),e=n[n.length-1].split("\\");return e[e.length-1]}},51855:function(t,n,e){var r=e(95516),o=TypeError;t.exports=function(t,n){if(r(n,t))return t;throw o("Incorrect invocation")}},87739:function(t,n,e){"use strict";var r=e(59413),o=e(45089),c=e(56112),a=e(17620),u=e(10563),i=e(26057),l=e(80154),f=function(t){var n=0==t,e=1==t,f=2==t,s=3==t;return function(t,p,h){var v=i(t),d=u("Promise"),m=v.iterator,y=v.next,g=0,E=void 0!==p;return!E&&n||o(p),new d((function(t,o){var u=function(t){l(m,o,t,o)},i=function(){try{if(n&&E)try{a(g)}catch(t){u(t)}d.resolve(c(r(y,m))).then((function(r){try{if(c(r).done)n?(h.length=g,t(h)):t(!s&&(f||void 0));else{var a=r.value;try{E?d.resolve(n?p(a,g):p(a)).then((function(r){if(e)i();else if(f)r?i():l(m,t,!1,o);else if(n)try{h[g++]=r,i()}catch(t){u(t)}else r?l(m,t,s||a,o):i()}),u):(h[g++]=a,i())}catch(t){u(t)}}}catch(t){o(t)}}),o)}catch(t){o(t)}};i()}))}};t.exports={toArray:f(0),forEach:f(1),every:f(2),some:f(3),find:f(4)}},17620:function(t){var n=TypeError;t.exports=function(t){if(t>9007199254740991)throw n("Maximum allowed index exceeded");return t}},18516:function(t,n,e){var r=e(78240),o=e(45089),c=e(86059),a=r(r.bind);t.exports=function(t,n){return o(t),void 0===n?t:c?a(t,n):function(){return t.apply(n,arguments)}}},61667:function(t,n,e){var r=e(90375),o=e(2964),c=e(97719),a=e(50211)("iterator");t.exports=function(t){if(null!=t)return o(t,a)||o(t,"@@iterator")||c[r(t)]}},73546:function(t,n,e){var r=e(59413),o=e(45089),c=e(56112),a=e(9268),u=e(61667),i=TypeError;t.exports=function(t,n){var e=arguments.length<2?u(t):n;if(o(e))return c(r(e,t));throw i(a(t)+" is not iterable")}},92814:function(t,n,e){var r=e(50211),o=e(97719),c=r("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||a[c]===t)}},94722:function(t,n,e){var r=e(18516),o=e(59413),c=e(56112),a=e(9268),u=e(92814),i=e(82871),l=e(95516),f=e(73546),s=e(61667),p=e(26737),h=TypeError,v=function(t,n){this.stopped=t,this.result=n},d=v.prototype;t.exports=function(t,n,e){var m,y,g,E,b,w,S,x=e&&e.that,A=!(!e||!e.AS_ENTRIES),I=!(!e||!e.IS_RECORD),P=!(!e||!e.IS_ITERATOR),T=!(!e||!e.INTERRUPTED),_=r(n,x),k=function(t){return m&&p(m,"normal",t),new v(!0,t)},R=function(t){return A?(c(t),T?_(t[0],t[1],k):_(t[0],t[1])):T?_(t,k):_(t)};if(I)m=t.iterator;else if(P)m=t;else{if(!(y=s(t)))throw h(a(t)+" is not iterable");if(u(y)){for(g=0,E=i(t);E>g;g++)if((b=R(t[g]))&&l(d,b))return b;return new v(!1)}m=f(t,y)}for(w=I?t.next:m.next;!(S=o(w,m)).done;){try{b=R(S.value)}catch(t){p(m,"throw",t)}if("object"==typeof b&&b&&l(d,b))return b}return new v(!1)}},39393:function(t,n,e){"use strict";var r=e(51695),o=e(87739).forEach;r({target:"AsyncIterator",proto:!0,real:!0,forced:!0},{forEach:function(t){return o(this,t)}})},96083:function(t,n,e){"use strict";var r=e(51695),o=e(22086),c=e(51855),a=e(90930),u=e(72585),i=e(63677),l=e(49606),f=e(50211),s=e(13083).IteratorPrototype,p=e(43296),h=f("toStringTag"),v=o.Iterator,d=p||!a(v)||v.prototype!==s||!i((function(){v({})})),m=function(){c(this,s)};l(s,h)||u(s,h,"Iterator"),!d&&l(s,"constructor")&&s.constructor!==Object||u(s,"constructor",m),m.prototype=s,r({global:!0,constructor:!0,forced:d},{Iterator:m})},72254:function(t,n,e){"use strict";var r=e(51695),o=e(94722),c=e(26057);r({target:"Iterator",proto:!0,real:!0,forced:!0},{forEach:function(t){o(c(this),t,{IS_RECORD:!0})}})},29459:function(){}}]);