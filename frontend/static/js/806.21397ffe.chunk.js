/*! For license information please see 806.21397ffe.chunk.js.LICENSE.txt */
(self.webpackChunkweb=self.webpackChunkweb||[]).push([[806],{66961:function(t,e,n){"use strict";n.d(e,{Z:function(){return c}});var r=n(27378),c=function(t){console.log(t.errorMessage);try{return r.createElement("div",{className:"component"},r.createElement("div",{className:"Axios_error"},r.createElement("h1",null,t.status," : ",t.statusText),r.createElement("h2",null,"url request method : ",t.config.method),r.createElement("p",null,r.createElement("i",null,t.config.url)),r.createElement("p",null,t.data.detail),r.createElement("hr",null),r.createElement("a",{href:"/"},r.createElement("b",null,"return to homepage")),r.createElement("br",null),r.createElement("a",{href:"."},r.createElement("b",null,"reload page"))))}catch(n){try{var e={message:t.errorMessage.message,name:t.errorMessage.name,code:t.errorMessage.code};return r.createElement("div",{className:"component"},r.createElement("div",{className:"Axios_error"},r.createElement("h1",null,e.name," : ",e.message),r.createElement("h2",null,"message: ",e.message),r.createElement("h2",null,"code : ",e.code),r.createElement("hr",null),r.createElement("a",{href:"/"},r.createElement("b",null,"return to homepage")),r.createElement("br",null),r.createElement("a",{href:"."},r.createElement("b",null,"reload page"))))}catch(t){return r.createElement("div",{className:"component"},r.createElement("div",{className:"Axios_error"},r.createElement("h2",null,"UI error"),r.createElement("p",null,n.errorMessage),r.createElement("hr",null),r.createElement("a",{href:"/"},r.createElement("b",null,"return to homepage")),r.createElement("br",null),r.createElement("a",{href:"."},r.createElement("b",null,"reload page"))))}}}},35806:function(t,e,n){"use strict";n.r(e),n(76721),n(96085),n(60740),n(98889);var r=n(31786),c=n(27378),o=n(8019),a=n(66961),u=n(46401);function i(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,c,o,a,u=[],i=!0,l=!1;try{if(o=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;i=!1}else for(;!(i=(r=o.call(n)).done)&&(u.push(r.value),u.length!==e);i=!0);}catch(t){l=!0,c=t}finally{try{if(!i&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(l)throw c}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return l(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?l(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}e.default=function(t){var e=t.space_id,n=i((0,c.useState)({}),2),l=n[0],s=n[1],f=i((0,c.useState)(!0),2),p=f[0],m=f[1],h=i((0,c.useState)(!1),2),E=h[0],g=h[1],d=i((0,c.useState)(""),2),v=d[0],y=d[1];return(0,c.useEffect)((function(){(0,o.Pj)(e).then((function(t){s(t.data),m(!1)})).catch((function(t){console.log(t),y(t.response),m(!1),g(!0)}))}),[]),p?c.createElement("div",null,"Loading..."):E?(0,a.Z)(v):c.createElement(c.Fragment,null,c.createElement(r.MetaTags,{title:"SpecificSpace",description:"SpecificSpace page"}),c.createElement("h1",null,"SpecificSpacePage"),c.createElement("table",{className:"table_vliz"},c.createElement("tbody",null,Object.keys(l).map((function(t){return c.createElement("tr",{key:t},c.createElement("td",null,t),c.createElement("td",null,(0,u.PX)(l[t])))})))))}},8019:function(t,e,n){"use strict";n.d(e,{$o:function(){return E},A9:function(){return u},Ai:function(){return i},Eh:function(){return m},JX:function(){return d},J_:function(){return I},ON:function(){return a},Pj:function(){return s},Ry:function(){return w},Sq:function(){return v},VR:function(){return l},Wk:function(){return g},Wr:function(){return x},YQ:function(){return A},h1:function(){return p},p:function(){return S},sq:function(){return y},tF:function(){return f},vp:function(){return h},wC:function(){return b}});var r=n(14206),c=n.n(r),o=n(61194);(0,o.ZP)(c(),{retries:5}),(0,o.ZP)(c(),{retryDelay:o.ZP.exponentialDelay}),(0,o.ZP)(c(),{shouldResetTimeout:!0}),(0,o.ZP)(c(),{retryCondition:function(){return!0}});var a="".concat("http://localhost:6656","/apiv1"),u=function(){return c().get("".concat(a,"/profiles"))},i=function(t){return c().get("".concat(a,"/profiles/").concat(t))},l=function(){return c().get("".concat(a,"/projects"))},s=function(t){return c().get("".concat(a,"/projects/").concat(t))},f=function(){return c().get("".concat(a,"/spaces/"))},p=function(t){return c().get("".concat(a,"/spaces/").concat(t))},m=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/fixcrate"))},h=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/git/status/"))},E=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/git/diff/"))},g=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/git/history/"))},d=function(t,e,n){return c().post("".concat(a,"/spaces/").concat(t,"/git/").concat(e),n)},v=function(t,e){return c().get("".concat(a,"/spaces/").concat(t,"/content/").concat(e))},y=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/content/openexplorer"))},b=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/annotation/"))},x=function(t,e,n){return c().post("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(e),n)},S=function(t,e){return c().get("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(e))},w=function(t,e,n){return c().post("".concat(a,"/spaces/").concat(t,"/annotation/file/node/").concat(e),n)},A=function(t,e,n){return c().delete("".concat(a,"/spaces/").concat(t,"/annotation/file/").concat(n,"/").concat(e))},I=function(t){return c().get("".concat(a,"/spaces/").concat(t,"/annotation/shacl_report"))}},46401:function(t,e,n){"use strict";n.d(e,{PX:function(){return c},bO:function(){return o}});var r=n(27378),c=(n(76721),n(96085),n(39393),n(96083),n(72254),function(t){return console.log(t),Array.isArray(t)?t.map((function(t){return null===t?null:t.includes("http")||t.includes("https")?r.createElement("a",{href:t,target:"_blank"},t):t})):null===t?t:t.includes("http")||t.includes("https")?r.createElement("a",{href:t,target:"_blank"},t):t}),o=function(t){if(null==t)return null;var e=t.split("/"),n=e[e.length-1].split("\\");return n[n.length-1]}},51855:function(t,e,n){var r=n(95516),c=TypeError;t.exports=function(t,e){if(r(e,t))return t;throw c("Incorrect invocation")}},87739:function(t,e,n){"use strict";var r=n(59413),c=n(45089),o=n(56112),a=n(28759),u=n(17620),i=n(10563),l=n(26057),s=n(80154),f=function(t){var e=0==t,n=1==t,f=2==t,p=3==t;return function(t,m,h){var E=l(t),g=i("Promise"),d=E.iterator,v=E.next,y=0,b=void 0!==m;return!b&&e||c(m),new g((function(t,c){var i=function(t){s(d,c,t,c)},l=function(){try{if(b)try{u(y)}catch(t){i(t)}g.resolve(o(r(v,d))).then((function(r){try{if(o(r).done)e?(h.length=y,t(h)):t(!p&&(f||void 0));else{var u=r.value;try{if(b){var E=m(u,y),v=function(r){if(n)l();else if(f)r?l():s(d,t,!1,c);else if(e)try{h[y++]=r,l()}catch(t){i(t)}else r?s(d,t,p||u,c):l()};a(E)?g.resolve(E).then(v,i):v(E)}else h[y++]=u,l()}catch(t){i(t)}}}catch(t){c(t)}}),c)}catch(t){c(t)}};l()}))}};t.exports={toArray:f(0),forEach:f(1),every:f(2),some:f(3),find:f(4)}},17620:function(t){var e=TypeError;t.exports=function(t){if(t>9007199254740991)throw e("Maximum allowed index exceeded");return t}},18516:function(t,e,n){var r=n(91175),c=n(45089),o=n(86059),a=r(r.bind);t.exports=function(t,e){return c(t),void 0===e?t:o?a(t,e):function(){return t.apply(e,arguments)}}},91175:function(t,e,n){var r=n(52306),c=n(78240);t.exports=function(t){if("Function"===r(t))return c(t)}},61667:function(t,e,n){var r=n(90375),c=n(2964),o=n(71858),a=n(97719),u=n(50211)("iterator");t.exports=function(t){if(!o(t))return c(t,u)||c(t,"@@iterator")||a[r(t)]}},73546:function(t,e,n){var r=n(59413),c=n(45089),o=n(56112),a=n(9268),u=n(61667),i=TypeError;t.exports=function(t,e){var n=arguments.length<2?u(t):e;if(c(n))return o(r(n,t));throw i(a(t)+" is not iterable")}},92814:function(t,e,n){var r=n(50211),c=n(97719),o=r("iterator"),a=Array.prototype;t.exports=function(t){return void 0!==t&&(c.Array===t||a[o]===t)}},94722:function(t,e,n){var r=n(18516),c=n(59413),o=n(56112),a=n(9268),u=n(92814),i=n(82871),l=n(95516),s=n(73546),f=n(61667),p=n(26737),m=TypeError,h=function(t,e){this.stopped=t,this.result=e},E=h.prototype;t.exports=function(t,e,n){var g,d,v,y,b,x,S,w=n&&n.that,A=!(!n||!n.AS_ENTRIES),I=!(!n||!n.IS_RECORD),T=!(!n||!n.IS_ITERATOR),P=!(!n||!n.INTERRUPTED),_=r(e,w),j=function(t){return g&&p(g,"normal",t),new h(!0,t)},R=function(t){return A?(o(t),P?_(t[0],t[1],j):_(t[0],t[1])):P?_(t,j):_(t)};if(I)g=t.iterator;else if(T)g=t;else{if(!(d=f(t)))throw m(a(t)+" is not iterable");if(u(d)){for(v=0,y=i(t);y>v;v++)if((b=R(t[v]))&&l(E,b))return b;return new h(!1)}g=s(t,d)}for(x=I?t.next:g.next;!(S=c(x,g)).done;){try{b=R(S.value)}catch(t){p(g,"throw",t)}if("object"==typeof b&&b&&l(E,b))return b}return new h(!1)}},97719:function(t){t.exports={}},39393:function(t,e,n){"use strict";var r=n(51695),c=n(87739).forEach;r({target:"AsyncIterator",proto:!0,real:!0},{forEach:function(t){return c(this,t)}})},96083:function(t,e,n){"use strict";var r=n(51695),c=n(22086),o=n(51855),a=n(90930),u=n(72585),i=n(63677),l=n(49606),s=n(50211),f=n(13083).IteratorPrototype,p=n(43296),m=s("toStringTag"),h=c.Iterator,E=p||!a(h)||h.prototype!==f||!i((function(){h({})})),g=function(){o(this,f)};l(f,m)||u(f,m,"Iterator"),!E&&l(f,"constructor")&&f.constructor!==Object||u(f,"constructor",g),g.prototype=f,r({global:!0,constructor:!0,forced:E},{Iterator:g})},72254:function(t,e,n){"use strict";var r=n(51695),c=n(94722),o=n(45089),a=n(26057);r({target:"Iterator",proto:!0,real:!0},{forEach:function(t){var e=a(this),n=0;o(t),c(e,(function(e){t(e,n++)}),{IS_RECORD:!0})}})}}]);