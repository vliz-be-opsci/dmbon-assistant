/*! For license information please see 545.2f0a2388.chunk.js.LICENSE.txt */
(self.webpackChunkweb=self.webpackChunkweb||[]).push([[545],{66961:function(t,e,n){"use strict";n.d(e,{Z:function(){return c}});var r=n(27378),c=function(t){console.log(t);try{return r.createElement("div",{className:"component"},r.createElement("div",{className:"Axios_error"},r.createElement("h1",null,t.status," : ",t.statusText),r.createElement("h2",null,"url request method : ",t.config.method),r.createElement("p",null,r.createElement("i",null,t.config.url)),r.createElement("p",null,t.data.detail),r.createElement("hr",null),r.createElement("a",{href:"/"},r.createElement("b",null,"return to homepage")),r.createElement("br",null),r.createElement("a",{href:"."},r.createElement("b",null,"reload page"))))}catch(t){return r.createElement("div",{className:"component"},r.createElement("div",{className:"Axios_error"},r.createElement("h2",null,"UI error"),r.createElement("p",null,t.errorMessage),r.createElement("hr",null),r.createElement("a",{href:"/"},r.createElement("b",null,"return to homepage")),r.createElement("br",null),r.createElement("a",{href:"."},r.createElement("b",null,"reload page"))))}}},75545:function(t,e,n){"use strict";n.r(e),n(76721),n(96085),n(14078),n(60740);var r=n(98889),c=n(31786),o=n(27378),a=n(8019),u=n(46401),i=n(66961);function l(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,c,o=[],a=!0,u=!1;try{for(n=n.call(t);!(a=(r=n.next()).done)&&(o.push(r.value),!e||o.length!==e);a=!0);}catch(t){u=!0,c=t}finally{try{a||null==n.return||n.return()}finally{if(u)throw c}}return o}}(t,e)||function(t,e){if(t){if("string"==typeof t)return f(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?f(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function f(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}e.default=function(t){var e=t.profile_id,n=l((0,o.useState)({}),2),f=n[0],s=n[1],p=l((0,o.useState)([]),2),m=p[0],h=p[1],d=l((0,o.useState)(!0),2),E=d[0],g=d[1],v=l((0,o.useState)(!1),2),y=v[0],b=v[1],S=l((0,o.useState)(""),2),x=S[0],w=S[1],A=function(t){console.log(t);var e=t.keyo;return"parent_space"==e?o.createElement(o.Fragment,null,o.createElement("td",null,e),o.createElement("td",null,null===f[e]?null:function(t){for(var e=0;e<m.length;e++)if(m[e].name===t){var n=m[e].uuid;return o.createElement(r.Link,{to:r.routes.specificSpace({space_id:String(n)})},t)}return t}(f[e]))):o.createElement(o.Fragment,null,o.createElement("td",null,e),o.createElement("td",null,(0,u.PX)(f[e])))};return(0,o.useEffect)((function(){(0,a.Ai)(e).then((function(t){s(t.data),g(!1)})).catch((function(t){console.log(t),w(t.response),g(!1),b(!0)})),(0,a.VR)().then((function(t){h(t.data)}),(function(t){console.log(t),w(t.response),g(!1),b(!0)}))}),[]),E?o.createElement("div",null,"Loading..."):y?(0,i.Z)(x):o.createElement(o.Fragment,null,o.createElement(c.MetaTags,{title:"SpecificProfile",description:"SpecificProfile page"}),o.createElement("h1",null,"SpecificProfilePage"),o.createElement("table",{className:"table_vliz"},o.createElement("tbody",null,Object.keys(f).map((function(t){return o.createElement("tr",{key:t},o.createElement(A,{keyo:t}))})))))}},8019:function(t,e,n){"use strict";n.d(e,{$o:function(){return d},A9:function(){return u},Ai:function(){return i},Eh:function(){return m},JX:function(){return g},J_:function(){return I},Pj:function(){return f},Sq:function(){return v},V4:function(){return w},VR:function(){return l},Wk:function(){return E},Wr:function(){return S},YQ:function(){return A},h1:function(){return p},p:function(){return x},sq:function(){return y},tF:function(){return s},vp:function(){return h},wC:function(){return b}});var r=n(14206),c=n.n(r),o=n(61194);(0,o.ZP)(c(),{retries:4}),(0,o.ZP)(c(),{retryDelay:o.ZP.exponentialDelay});var a="".concat("http://localhost:6656","/apiv1"),u=function(){return c().get("".concat(a,"/profiles"))},i=function(t){return c().get("".concat(a,"/profiles/").concat(t))},l=function(){return c().get("".concat(a,"/projects"))},f=function(t){return c().get("".concat(a,"/projects/").concat(t))},s=function(){return c().get("".concat(a,"/spaces/"))},p=function(t){return c().get("".concat(a,"/spaces/").concat(t))},m=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/fixcrate"))},h=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/git/status/"))},d=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/git/diff/"))},E=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/git/history/"))},g=function(t,e,n){return c().post("".concat(a,"/spaces/").concat(t,"/git/").concat(e),n)},v=function(t,e){return c().get("".concat(a,"/spaces/").concat(t,"/content/").concat(e))},y=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/content/openexplorer"))},b=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/annotation/"))},S=function(t,e,n){return c().post("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(e),n)},x=function(t,e){return c().get("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(e))},w=function(t,e,n){return c().post("".concat(a,"/spaces/").concat(t,"/annotation/file/blanknode/").concat(e),n)},A=function(t,e,n){return c().delete("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(n,"/").concat(e))},I=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/annotation/shacl_report"))}},46401:function(t,e,n){"use strict";n.d(e,{PX:function(){return c},bO:function(){return o}});var r=n(27378),c=(n(76721),n(96085),n(95623),n(39393),n(96083),n(72254),function(t){return console.log(t),Array.isArray(t)?t.map((function(t){return null===t?null:t.includes("http")||t.includes("https")?r.createElement("a",{href:t,target:"_blank"},t):t})):null===t?t:t.includes("http")||t.includes("https")?r.createElement("a",{href:t,target:"_blank"},t):t}),o=function(t){if(null==t)return null;var e=t.split("/"),n=e[e.length-1].split("\\");return n[n.length-1]}},51855:function(t,e,n){var r=n(95516),c=TypeError;t.exports=function(t,e){if(r(e,t))return t;throw c("Incorrect invocation")}},87739:function(t,e,n){"use strict";var r=n(59413),c=n(45089),o=n(56112),a=n(17620),u=n(10563),i=n(26057),l=n(80154),f=function(t){var e=0==t,n=1==t,f=2==t,s=3==t;return function(t,p,m){var h=i(t),d=u("Promise"),E=h.iterator,g=h.next,v=0,y=void 0!==p;return!y&&e||c(p),new d((function(t,c){var u=function(t){l(E,c,t,c)},i=function(){try{if(e&&y)try{a(v)}catch(t){u(t)}d.resolve(o(r(g,E))).then((function(r){try{if(o(r).done)e?(m.length=v,t(m)):t(!s&&(f||void 0));else{var a=r.value;try{y?d.resolve(e?p(a,v):p(a)).then((function(r){if(n)i();else if(f)r?i():l(E,t,!1,c);else if(e)try{m[v++]=r,i()}catch(t){u(t)}else r?l(E,t,s||a,c):i()}),u):(m[v++]=a,i())}catch(t){u(t)}}}catch(t){c(t)}}),c)}catch(t){c(t)}};i()}))}};t.exports={toArray:f(0),forEach:f(1),every:f(2),some:f(3),find:f(4)}},17620:function(t){var e=TypeError;t.exports=function(t){if(t>9007199254740991)throw e("Maximum allowed index exceeded");return t}},18516:function(t,e,n){var r=n(78240),c=n(45089),o=n(86059),a=r(r.bind);t.exports=function(t,e){return c(t),void 0===e?t:o?a(t,e):function(){return t.apply(e,arguments)}}},61667:function(t,e,n){var r=n(90375),c=n(2964),o=n(97719),a=n(50211)("iterator");t.exports=function(t){if(null!=t)return c(t,a)||c(t,"@@iterator")||o[r(t)]}},73546:function(t,e,n){var r=n(59413),c=n(45089),o=n(56112),a=n(9268),u=n(61667),i=TypeError;t.exports=function(t,e){var n=arguments.length<2?u(t):e;if(c(n))return o(r(n,t));throw i(a(t)+" is not iterable")}},92814:function(t,e,n){var r=n(50211),c=n(97719),o=r("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(c.Array===t||a[o]===t)}},94722:function(t,e,n){var r=n(18516),c=n(59413),o=n(56112),a=n(9268),u=n(92814),i=n(82871),l=n(95516),f=n(73546),s=n(61667),p=n(26737),m=TypeError,h=function(t,e){this.stopped=t,this.result=e},d=h.prototype;t.exports=function(t,e,n){var E,g,v,y,b,S,x,w=n&&n.that,A=!(!n||!n.AS_ENTRIES),I=!(!n||!n.IS_RECORD),_=!(!n||!n.IS_ITERATOR),k=!(!n||!n.INTERRUPTED),P=r(e,w),T=function(t){return E&&p(E,"normal",t),new h(!0,t)},R=function(t){return A?(o(t),k?P(t[0],t[1],T):P(t[0],t[1])):k?P(t,T):P(t)};if(I)E=t.iterator;else if(_)E=t;else{if(!(g=s(t)))throw m(a(t)+" is not iterable");if(u(g)){for(v=0,y=i(t);y>v;v++)if((b=R(t[v]))&&l(d,b))return b;return new h(!1)}E=f(t,g)}for(S=I?t.next:E.next;!(x=c(S,E)).done;){try{b=R(x.value)}catch(t){p(E,"throw",t)}if("object"==typeof b&&b&&l(d,b))return b}return new h(!1)}},39393:function(t,e,n){"use strict";var r=n(51695),c=n(87739).forEach;r({target:"AsyncIterator",proto:!0,real:!0,forced:!0},{forEach:function(t){return c(this,t)}})},96083:function(t,e,n){"use strict";var r=n(51695),c=n(22086),o=n(51855),a=n(90930),u=n(72585),i=n(63677),l=n(49606),f=n(50211),s=n(13083).IteratorPrototype,p=n(43296),m=f("toStringTag"),h=c.Iterator,d=p||!a(h)||h.prototype!==s||!i((function(){h({})})),E=function(){o(this,s)};l(s,m)||u(s,m,"Iterator"),!d&&l(s,"constructor")&&s.constructor!==Object||u(s,"constructor",E),E.prototype=s,r({global:!0,constructor:!0,forced:d},{Iterator:E})},72254:function(t,e,n){"use strict";var r=n(51695),c=n(94722),o=n(26057);r({target:"Iterator",proto:!0,real:!0,forced:!0},{forEach:function(t){c(o(this),t,{IS_RECORD:!0})}})}}]);