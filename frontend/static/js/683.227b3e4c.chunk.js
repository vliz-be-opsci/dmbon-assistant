/*! For license information please see 683.227b3e4c.chunk.js.LICENSE.txt */
(self.webpackChunkweb=self.webpackChunkweb||[]).push([[683],{63683:function(t,e,n){"use strict";n.r(e),n.d(e,{default:function(){return P}}),n(14078),n(60740),n(39393),n(96083),n(72254),n(98889);var r=n(31786),o=n(27378),a=n(5974),i=n(14206),c=n.n(i),s=n(8019),l=(n(76721),n(96085),n(31542),n(61194),n(48484)),u=n.n(l),f=n(29874),p=n(34135),h=n(74566),d=n(33218),m=n(65638),v=n.n(m);function y(t){return y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},y(t)}function g(){g=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",a=r.asyncIterator||"@@asyncIterator",i=r.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var o=e&&e.prototype instanceof f?e:f,a=Object.create(o.prototype),i=new S(r||[]);return a._invoke=function(t,e,n){var r="suspendedStart";return function(o,a){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw a;return{value:void 0,done:!0}}for(n.method=o,n.arg=a;;){var i=n.delegate;if(i){var c=E(i,n);if(c){if(c===u)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var s=l(t,e,n);if("normal"===s.type){if(r=n.done?"completed":"suspendedYield",s.arg===u)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r="completed",n.method="throw",n.arg=s.arg)}}}(t,n,i),a}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var u={};function f(){}function p(){}function h(){}var d={};c(d,o,(function(){return this}));var m=Object.getPrototypeOf,v=m&&m(m(L([])));v&&v!==e&&n.call(v,o)&&(d=v);var w=h.prototype=f.prototype=Object.create(d);function b(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function x(t,e){function r(o,a,i,c){var s=l(t[o],t,a);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==y(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){u.value=t,i(u)}),(function(t){return r("throw",t,i,c)}))}c(s.arg)}var o;this._invoke=function(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}}function E(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,E(t,e),"throw"===e.method))return u;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var r=l(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,u;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,u):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,u)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function N(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function S(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function L(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,a=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return a.next=a}}return{next:j}}function j(){return{value:void 0,done:!0}}return p.prototype=h,c(w,"constructor",h),c(h,"constructor",p),p.displayName=c(h,i,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===p||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,h):(t.__proto__=h,c(t,i,"GeneratorFunction")),t.prototype=Object.create(w),t},t.awrap=function(t){return{__await:t}},b(x.prototype),c(x.prototype,a,(function(){return this})),t.AsyncIterator=x,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var i=new x(s(e,n,r,o),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},b(w),c(w,i,"Generator"),c(w,o,(function(){return this})),c(w,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=L,S.prototype={constructor:S,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(N),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return i.type="throw",i.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,u):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),u},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),N(n),u}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;N(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:L(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),u}},t}function w(t,e,n,r,o,a,i){try{var c=t[a](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function b(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function i(t){w(a,r,o,i,c,"next",t)}function c(t){w(a,r,o,i,c,"throw",t)}i(void 0)}))}}function x(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,a=[],i=!0,c=!1;try{for(n=n.call(t);!(i=(r=n.next()).done)&&(a.push(r.value),!e||a.length!==e);i=!0);}catch(t){c=!0,o=t}finally{try{i||null==n.return||n.return()}finally{if(c)throw o}}return a}}(t,e)||function(t,e){if(t){if("string"==typeof t)return E(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?E(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function E(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var k=function(t){var e=x((0,o.useState)(!1),2),n=(e[0],e[1]),r=x((0,o.useState)(!1),2),a=r[0],i=r[1],l=x((0,o.useState)(!1),2),m=l[0],y=l[1],w=x((0,o.useState)(!1),2),E=w[0],k=w[1],N=x((0,o.useState)(t.TaskRequest),2),S=N[0],L=N[1],j=x((0,o.useState)(t.TypeRequest),2),T=(j[0],j[1],x((0,o.useState)(t.TaskDescription),2)),_=T[0],P=T[1],O=x((0,o.useState)(t.TaskPayload),2),I=O[0],C=O[1],F=x((0,o.useState)(""),2),R=F[0],Z=F[1],A=t.targetsuccess,$=x((0,o.useState)(""),2),q=($[0],$[1]),G=x((0,o.useState)({}),2),D=(G[0],G[1]),V=function(){var t=b(g().mark((function t(e){var n,r;return g().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:try{n=e.Payload,r=e.Task,M({Task:r,Payload:n})}catch(t){M({Task:S,Payload:I})}case 1:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),M=function(){var t=b(g().mark((function t(e){var r,o;return g().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:r=e.Payload,o=e.Task,console.log(Object.keys(r).length),console.log(o),y(!1),r.length>0||Object.keys(r).length>0?(console.log(r),q(S),n(!0),console.log(S),console.log(I),k(!0),c().post(s.ON+"/tasks/"+o,r).then((function(t){console.log(t.data),Z(t.data.data),k(!1),i(!0),console.log(t.data.next_task),null!=t.data.next_task?(console.log("going for next task"),k(!1),P(t.data.next_task.TaskDescription),C(t.data.next_task.Payload),i(!1),L(t.data.next_task.TaskRequest),0==t.data.next_task.Payload.length&&V({Task:t.data.next_task.TaskRequest,Payload:t.data.next_task.Payload})):(console.log("no next task"),A(!0))})).catch((function(t){y(!0),k(!1),Z(t.message)}))):(q(S),n(!0),console.log(S),console.log(I),k(!0),c().get(s.ON+"/tasks/"+o).then((function(t){console.log(t.data),Z(t.data.data),k(!1),i(!0),console.log(t.data.next_task),null!=t.data.next_task?(console.log("going for next task"),k(!1),P(t.data.next_task.TaskDescription),C(t.data.next_task.Payload),i(!1),L(t.data.next_task.TaskRequest),0==t.data.next_task.Payload.length&&V({Task:t.data.next_task.TaskRequest,Payload:t.data.next_task.Payload})):(console.log("no next task"),A(!0))})).catch((function(t){y(!0),k(!1),Z(t.message)})));case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),z=function(){return a?o.createElement(d.Reu,{color:"green",size:40}):m?o.createElement(h.vVM,{size:40,color:"red"}):E?o.createElement(u(),{type:"spinningBubbles",color:"#006582",height:"40px",width:"40px"}):o.createElement(h.k71,{size:40,color:"darkgrey"})},B=function(){return I.length>0?o.createElement("div",{className:"form_userdata"},o.createElement("h4",null,_),I.map((function(t,e){return o.createElement(o.Fragment,null,o.createElement(f.Z.Group,null,o.createElement(p.Z,{label:t.description,controlId:"floatingInput",className:"mb-3"},o.createElement(f.Z.Control,{type:"text",name:"select"+t.label}))))})),o.createElement("button",{className:"large",onClick:function(){!function(t){for(var e={},n=0;n<I.length;n++){console.log(I[n].label);var r="select"+I[n].label,o=v()("input[name='"+r+"']").val();console.log(o),e[I[n].label]=o}D([]),C([]),V({Task:S,Payload:e})}()}},"Submit form")):a?o.createElement("div",{className:"taskrow success"},o.createElement(z,null),o.createElement("p",null," ",o.createElement("div",{dangerouslySetInnerHTML:{__html:R}}))):m?o.createElement("div",{className:"taskrow error"},o.createElement(z,null),o.createElement("p",null,o.createElement("p",null,_),R)):E?o.createElement("div",{className:"taskrow running"},o.createElement(z,null),o.createElement("p",null,_)):o.createElement("div",{className:"taskrow pending"},o.createElement(z,null),o.createElement("p",null,_))};return(0,o.useEffect)((function(){V()}),[S]),o.createElement("div",null,o.createElement(B,null))};function N(t){return N="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},N(t)}function S(){S=function(){return t};var t={},e=Object.prototype,n=e.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},o=r.iterator||"@@iterator",a=r.asyncIterator||"@@asyncIterator",i=r.toStringTag||"@@toStringTag";function c(t,e,n){return Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{c({},"")}catch(t){c=function(t,e,n){return t[e]=n}}function s(t,e,n,r){var o=e&&e.prototype instanceof f?e:f,a=Object.create(o.prototype),i=new k(r||[]);return a._invoke=function(t,e,n){var r="suspendedStart";return function(o,a){if("executing"===r)throw new Error("Generator is already running");if("completed"===r){if("throw"===o)throw a;return{value:void 0,done:!0}}for(n.method=o,n.arg=a;;){var i=n.delegate;if(i){var c=b(i,n);if(c){if(c===u)continue;return c}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===r)throw r="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);r="executing";var s=l(t,e,n);if("normal"===s.type){if(r=n.done?"completed":"suspendedYield",s.arg===u)continue;return{value:s.arg,done:n.done}}"throw"===s.type&&(r="completed",n.method="throw",n.arg=s.arg)}}}(t,n,i),a}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var u={};function f(){}function p(){}function h(){}var d={};c(d,o,(function(){return this}));var m=Object.getPrototypeOf,v=m&&m(m(L([])));v&&v!==e&&n.call(v,o)&&(d=v);var y=h.prototype=f.prototype=Object.create(d);function g(t){["next","throw","return"].forEach((function(e){c(t,e,(function(t){return this._invoke(e,t)}))}))}function w(t,e){function r(o,a,i,c){var s=l(t[o],t,a);if("throw"!==s.type){var u=s.arg,f=u.value;return f&&"object"==N(f)&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){r("next",t,i,c)}),(function(t){r("throw",t,i,c)})):e.resolve(f).then((function(t){u.value=t,i(u)}),(function(t){return r("throw",t,i,c)}))}c(s.arg)}var o;this._invoke=function(t,n){function a(){return new e((function(e,o){r(t,n,e,o)}))}return o=o?o.then(a,a):a()}}function b(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,b(t,e),"throw"===e.method))return u;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return u}var r=l(n,t.iterator,e.arg);if("throw"===r.type)return e.method="throw",e.arg=r.arg,e.delegate=null,u;var o=r.arg;return o?o.done?(e[t.resultName]=o.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,u):o:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,u)}function x(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function E(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function k(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(x,this),this.reset(!0)}function L(t){if(t){var e=t[o];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,a=function e(){for(;++r<t.length;)if(n.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return a.next=a}}return{next:j}}function j(){return{value:void 0,done:!0}}return p.prototype=h,c(y,"constructor",h),c(h,"constructor",p),p.displayName=c(h,i,"GeneratorFunction"),t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===p||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,h):(t.__proto__=h,c(t,i,"GeneratorFunction")),t.prototype=Object.create(y),t},t.awrap=function(t){return{__await:t}},g(w.prototype),c(w.prototype,a,(function(){return this})),t.AsyncIterator=w,t.async=function(e,n,r,o,a){void 0===a&&(a=Promise);var i=new w(s(e,n,r,o),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},g(y),c(y,i,"Generator"),c(y,o,(function(){return this})),c(y,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var r=e.pop();if(r in t)return n.value=r,n.done=!1,n}return n.done=!0,n}},t.values=L,k.prototype={constructor:k,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(E),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(n,r){return i.type="throw",i.arg=t,e.next=n,r&&(e.method="next",e.arg=void 0),!!r}for(var o=this.tryEntries.length-1;o>=0;--o){var a=this.tryEntries[o],i=a.completion;if("root"===a.tryLoc)return r("end");if(a.tryLoc<=this.prev){var c=n.call(a,"catchLoc"),s=n.call(a,"finallyLoc");if(c&&s){if(this.prev<a.catchLoc)return r(a.catchLoc,!0);if(this.prev<a.finallyLoc)return r(a.finallyLoc)}else if(c){if(this.prev<a.catchLoc)return r(a.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return r(a.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&n.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var a=o;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=e&&e<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=e,a?(this.method="next",this.next=a.finallyLoc,u):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),u},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),E(n),u}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var r=n.completion;if("throw"===r.type){var o=r.arg;E(n)}return o}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:L(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),u}},t}function L(t,e,n,r,o,a,i){try{var c=t[a](i),s=c.value}catch(t){return void n(t)}c.done?e(s):Promise.resolve(s).then(r,o)}function j(t){return function(){var e=this,n=arguments;return new Promise((function(r,o){var a=t.apply(e,n);function i(t){L(a,r,o,i,c,"next",t)}function c(t){L(a,r,o,i,c,"throw",t)}i(void 0)}))}}function T(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,a=[],i=!0,c=!1;try{for(n=n.call(t);!(i=(r=n.next()).done)&&(a.push(r.value),!e||a.length!==e);i=!0);}catch(t){c=!0,o=t}finally{try{i||null==n.return||n.return()}finally{if(c)throw o}}return a}}(t,e)||function(t,e){if(t){if("string"==typeof t)return _(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}n(93845);var P=function(){var t=T((0,o.useState)(!1),2),e=t[0],n=t[1],i=T((0,o.useState)(!0),2),l=i[0],u=i[1],f=T((0,o.useState)(""),2),p=(f[0],f[1],T((0,o.useState)(""),2)),h=(p[0],p[1],T((0,o.useState)(!1),2)),d=(h[0],h[1],T((0,o.useState)(!1),2)),m=(d[0],d[1],T((0,o.useState)(!1),2)),v=(m[0],m[1],T((0,o.useState)(!1),2)),y=(v[0],v[1],T((0,o.useState)(""),2)),g=(y[0],y[1],T((0,o.useState)(!1),2)),w=g[0],b=g[1],x=T((0,o.useState)(!1),2),E=(x[0],x[1]),N=T((0,o.useState)(!1),2),L=N[0],_=N[1],P=T((0,o.useState)("Complete setup first"),2),O=P[0],I=P[1],C=[],F=function(){w&&L&&(I("Continue"),u(!1))},R=function(){var t=j(S().mark((function t(){return S().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,c().get(s.ON+"/tasks/checkcompletestatus").then((function(t){console.log(t.data)})).catch((function(t){n(!0)}));case 2:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}(),Z=function(){var t=j(S().mark((function t(){var e;return S().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,c().get(s.ON+"/tasks/finishsetup");case 3:e=t.sent,console.log(e.data),b(!0),E(!0),_(!0),u(!1),F(),t.next=15;break;case 12:t.prev=12,t.t0=t.catch(0),console.log(t.t0);case 15:case"end":return t.stop()}}),t,null,[[0,12]])})));return function(){return t.apply(this,arguments)}}();return(0,o.useEffect)((function(){R(),F()}),[w,L]),o.createElement(o.Fragment,null,o.createElement(r.MetaTags,{title:"Home",description:"Home page"}),o.createElement("main",null,o.createElement("div",null,o.createElement("section",{className:"blue"},o.createElement("h2",null,"DM-BON Assistant"),o.createElement("p",null,"Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.")),o.createElement("section",{className:"dark"},o.createElement("h2",null,"TODO have a section for the user to create a new space"),o.createElement("p",null,"Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."),o.createElement("div",{class:"custom-shape-divider-top-1649669784"},o.createElement("svg",{"data-name":"Layer 1",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 1200 120",preserveAspectRatio:"none"},o.createElement("path",{d:"M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z",opacity:".25",class:"shape-fill"}),o.createElement("path",{d:"M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z",opacity:".5",class:"shape-fill"}),o.createElement("path",{d:"M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z",class:"shape-fill"})))),o.createElement("div",{className:"sidebox_one counterclockwise_turned"}),o.createElement("div",{className:"sidebox_two clockwise_turned"}),o.createElement("section",{className:"light"},o.createElement("h2",null,"TODO have a section for the user to create a new space"),o.createElement("p",null,"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus libero leo, pellentesque ornare, adipiscing vitae, rhoncus commodo, nulla. Fusce quis ipsum. Nulla neque massa, feugiat sed, commodo in, adipiscing ut, est. In fermentum mattis ligula."),o.createElement("div",null,o.createElement("svg",{className:"blob-motion",id:"visual",viewBox:"0 0 960 330",width:"960",height:"330",xmlns:"http://www.w3.org/2000/svg",xmlnsXlink:"http://www.w3.org/1999/xlink",version:"1.1"},o.createElement("rect",{x:"0",y:"0",width:"960",height:"330",fill:"#6cb2c5"}),o.createElement("g",{transform:"translate(471.1486233589775 170.3596269558737)"},o.createElement("path",{id:"blob1",d:"M51.6 -99.6C66.4 -80.7 77.9 -66.1 90.9 -50.3C103.9 -34.4 118.4 -17.2 125.8 4.2C133.1 25.7 133.2 51.3 123.1 72.1C112.9 92.9 92.5 108.8 70.2 120.3C48 131.8 24 138.9 -0.7 140.1C-25.3 141.2 -50.7 136.4 -66.8 121.4C-83 106.4 -90 81.2 -97.5 59.3C-105 37.3 -113 18.7 -113.3 -0.2C-113.6 -19 -106.2 -38 -99.2 -60.8C-92.2 -83.6 -85.6 -110.2 -69.1 -128.2C-52.7 -146.2 -26.3 -155.6 -4 -148.7C18.3 -141.8 36.7 -118.5 51.6 -99.6",fill:"#2c3e50"}))))),o.createElement("div",{className:"spacer layer1"}),o.createElement("section",{className:"blue"},o.createElement("h2",null,"TODO have a section for the user to create a new space"),o.createElement("p",null,"Nulla ipsum. Vestibulum condimentum condimentum augue. Nunc purus risus, volutpat sagittis, lobortis at, dignissim sed, sapien. Fusce porttitor iaculis ante. Curabitur eu arcu. Morbi quam purus, tempor eget, ullamcorper feugiat, commodo ullamcorper, neque.")))),o.createElement(a.Z,{show:e,size:"lg"},o.createElement(a.Z.Header,null,o.createElement(a.Z.Title,null,"Welcome to the site new user!")),o.createElement(a.Z.Body,null,o.createElement("p",null,"Set up the DMBON assistent by filling in the form below."),o.createElement(k,{TaskRequest:"foldersetup",TaskDescription:"Setting up folder structure for first usage",TypeRequest:"get",targetsuccess:_,TaskPayload:C}),o.createElement(k,{TaskRequest:"sshcheck",TaskDescription:"Checking if ssh key exists and is connected",TypeRequest:"get",targetsuccess:b,TaskPayload:C})),o.createElement(a.Z.Footer,null,o.createElement("button",{disabled:l,className:"btn modalbutton large",onClick:function(){Z(),window.location.href="/"}},O))))}},8019:function(t,e,n){"use strict";n.d(e,{$o:function(){return m},A9:function(){return c},Ai:function(){return s},Eh:function(){return h},JX:function(){return y},J_:function(){return S},ON:function(){return i},Pj:function(){return u},Sq:function(){return g},V4:function(){return k},VR:function(){return l},Wk:function(){return v},Wr:function(){return x},YQ:function(){return N},h1:function(){return p},p:function(){return E},sq:function(){return w},tF:function(){return f},vp:function(){return d},wC:function(){return b}});var r=n(14206),o=n.n(r),a=n(61194);(0,a.ZP)(o(),{retries:4}),(0,a.ZP)(o(),{retryDelay:a.ZP.exponentialDelay});var i="".concat("http://localhost:6656","/apiv1"),c=function(){return o().get("".concat(i,"/profiles"))},s=function(t){return o().get("".concat(i,"/profiles/").concat(t))},l=function(){return o().get("".concat(i,"/projects"))},u=function(t){return o().get("".concat(i,"/projects/").concat(t))},f=function(){return o().get("".concat(i,"/spaces/"))},p=function(t){return o().get("".concat(i,"/spaces/").concat(t))},h=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/fixcrate"))},d=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/git/status/"))},m=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/git/diff/"))},v=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/git/history/"))},y=function(t,e,n){return o().post("".concat(i,"/spaces/").concat(t,"/git/").concat(e),n)},g=function(t,e){return o().get("".concat(i,"/spaces/").concat(t,"/content/").concat(e))},w=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/content/openexplorer"))},b=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/annotation/"))},x=function(t,e,n){return o().post("".concat(i,"/spaces/").concat(t,"/annotation/file/").concat(e),n)},E=function(t,e){return o().get("".concat(i,"/spaces/").concat(t,"/annotation/file/").concat(e))},k=function(t,e,n){return o().post("".concat(i,"/spaces/").concat(t,"/annotation/file/blanknode/").concat(e),n)},N=function(t,e,n){return o().delete("".concat(i,"/spaces/").concat(t,"/annotation/file/").concat(n,"/").concat(e))},S=function(t){return o().get("".concat(i,"/spaces/").concat(t,"/annotation/shacl_report"))}},51855:function(t,e,n){var r=n(95516),o=TypeError;t.exports=function(t,e){if(r(e,t))return t;throw o("Incorrect invocation")}},87739:function(t,e,n){"use strict";var r=n(59413),o=n(45089),a=n(56112),i=n(17620),c=n(10563),s=n(26057),l=n(80154),u=function(t){var e=0==t,n=1==t,u=2==t,f=3==t;return function(t,p,h){var d=s(t),m=c("Promise"),v=d.iterator,y=d.next,g=0,w=void 0!==p;return!w&&e||o(p),new m((function(t,o){var c=function(t){l(v,o,t,o)},s=function(){try{if(e&&w)try{i(g)}catch(t){c(t)}m.resolve(a(r(y,v))).then((function(r){try{if(a(r).done)e?(h.length=g,t(h)):t(!f&&(u||void 0));else{var i=r.value;try{w?m.resolve(e?p(i,g):p(i)).then((function(r){if(n)s();else if(u)r?s():l(v,t,!1,o);else if(e)try{h[g++]=r,s()}catch(t){c(t)}else r?l(v,t,f||i,o):s()}),c):(h[g++]=i,s())}catch(t){c(t)}}}catch(t){o(t)}}),o)}catch(t){o(t)}};s()}))}};t.exports={toArray:u(0),forEach:u(1),every:u(2),some:u(3),find:u(4)}},17620:function(t){var e=TypeError;t.exports=function(t){if(t>9007199254740991)throw e("Maximum allowed index exceeded");return t}},18516:function(t,e,n){var r=n(78240),o=n(45089),a=n(86059),i=r(r.bind);t.exports=function(t,e){return o(t),void 0===e?t:a?i(t,e):function(){return t.apply(e,arguments)}}},61667:function(t,e,n){var r=n(90375),o=n(2964),a=n(97719),i=n(50211)("iterator");t.exports=function(t){if(null!=t)return o(t,i)||o(t,"@@iterator")||a[r(t)]}},73546:function(t,e,n){var r=n(59413),o=n(45089),a=n(56112),i=n(9268),c=n(61667),s=TypeError;t.exports=function(t,e){var n=arguments.length<2?c(t):e;if(o(n))return a(r(n,t));throw s(i(t)+" is not iterable")}},92814:function(t,e,n){var r=n(50211),o=n(97719),a=r("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||i[a]===t)}},94722:function(t,e,n){var r=n(18516),o=n(59413),a=n(56112),i=n(9268),c=n(92814),s=n(82871),l=n(95516),u=n(73546),f=n(61667),p=n(26737),h=TypeError,d=function(t,e){this.stopped=t,this.result=e},m=d.prototype;t.exports=function(t,e,n){var v,y,g,w,b,x,E,k=n&&n.that,N=!(!n||!n.AS_ENTRIES),S=!(!n||!n.IS_RECORD),L=!(!n||!n.IS_ITERATOR),j=!(!n||!n.INTERRUPTED),T=r(e,k),_=function(t){return v&&p(v,"normal",t),new d(!0,t)},P=function(t){return N?(a(t),j?T(t[0],t[1],_):T(t[0],t[1])):j?T(t,_):T(t)};if(S)v=t.iterator;else if(L)v=t;else{if(!(y=f(t)))throw h(i(t)+" is not iterable");if(c(y)){for(g=0,w=s(t);w>g;g++)if((b=P(t[g]))&&l(m,b))return b;return new d(!1)}v=u(t,y)}for(x=S?t.next:v.next;!(E=o(x,v)).done;){try{b=P(E.value)}catch(t){p(v,"throw",t)}if("object"==typeof b&&b&&l(m,b))return b}return new d(!1)}},39393:function(t,e,n){"use strict";var r=n(51695),o=n(87739).forEach;r({target:"AsyncIterator",proto:!0,real:!0,forced:!0},{forEach:function(t){return o(this,t)}})},96083:function(t,e,n){"use strict";var r=n(51695),o=n(22086),a=n(51855),i=n(90930),c=n(72585),s=n(63677),l=n(49606),u=n(50211),f=n(13083).IteratorPrototype,p=n(43296),h=u("toStringTag"),d=o.Iterator,m=p||!i(d)||d.prototype!==f||!s((function(){d({})})),v=function(){a(this,f)};l(f,h)||c(f,h,"Iterator"),!m&&l(f,"constructor")&&f.constructor!==Object||c(f,"constructor",v),v.prototype=f,r({global:!0,constructor:!0,forced:m},{Iterator:v})},72254:function(t,e,n){"use strict";var r=n(51695),o=n(94722),a=n(26057);r({target:"Iterator",proto:!0,real:!0,forced:!0},{forEach:function(t){o(a(this),t,{IS_RECORD:!0})}})},93845:function(){},34135:function(t,e,n){"use strict";var r=n(60042),o=n.n(r),a=n(27378),i=n(61401),c=n(28398),s=n(24246);const l=a.forwardRef((({bsPrefix:t,className:e,children:n,controlId:r,label:a,...l},u)=>(t=(0,c.vE)(t,"form-floating"),(0,s.jsxs)(i.Z,{ref:u,className:o()(e,t),controlId:r,...l,children:[n,(0,s.jsx)("label",{htmlFor:r,children:a})]}))));l.displayName="FloatingLabel",e.Z=l},29874:function(t,e,n){"use strict";n.d(e,{Z:function(){return G}});var r=n(60042),o=n.n(r),a=n(23615),i=n.n(a),c=n(27378),s=n(24246);const l={type:i().string,tooltip:i().bool,as:i().elementType},u=c.forwardRef((({as:t="div",className:e,type:n="valid",tooltip:r=!1,...a},i)=>(0,s.jsx)(t,{...a,ref:i,className:o()(e,`${n}-${r?"tooltip":"feedback"}`)})));u.displayName="Feedback",u.propTypes=l;var f=u,p=n(7034),h=n(28398);const d=c.forwardRef((({id:t,bsPrefix:e,className:n,type:r="checkbox",isValid:a=!1,isInvalid:i=!1,as:l="input",...u},f)=>{const{controlId:d}=(0,c.useContext)(p.Z);return e=(0,h.vE)(e,"form-check-input"),(0,s.jsx)(l,{...u,ref:f,type:r,id:t||d,className:o()(n,e,a&&"is-valid",i&&"is-invalid")})}));d.displayName="FormCheckInput";var m=d;const v=c.forwardRef((({bsPrefix:t,className:e,htmlFor:n,...r},a)=>{const{controlId:i}=(0,c.useContext)(p.Z);return t=(0,h.vE)(t,"form-check-label"),(0,s.jsx)("label",{...r,ref:a,htmlFor:n||i,className:o()(e,t)})}));v.displayName="FormCheckLabel";var y=v,g=n(81038);const w=c.forwardRef((({id:t,bsPrefix:e,bsSwitchPrefix:n,inline:r=!1,disabled:a=!1,isValid:i=!1,isInvalid:l=!1,feedbackTooltip:u=!1,feedback:d,feedbackType:v,className:w,style:b,title:x="",type:E="checkbox",label:k,children:N,as:S="input",...L},j)=>{e=(0,h.vE)(e,"form-check"),n=(0,h.vE)(n,"form-switch");const{controlId:T}=(0,c.useContext)(p.Z),_=(0,c.useMemo)((()=>({controlId:t||T})),[T,t]),P=!N&&null!=k&&!1!==k||(0,g.XW)(N,y),O=(0,s.jsx)(m,{...L,type:"switch"===E?"checkbox":E,ref:j,isValid:i,isInvalid:l,disabled:a,as:S});return(0,s.jsx)(p.Z.Provider,{value:_,children:(0,s.jsx)("div",{style:b,className:o()(w,P&&e,r&&`${e}-inline`,"switch"===E&&n),children:N||(0,s.jsxs)(s.Fragment,{children:[O,P&&(0,s.jsx)(y,{title:x,children:k}),d&&(0,s.jsx)(f,{type:v,tooltip:u,children:d})]})})})}));w.displayName="FormCheck";var b=Object.assign(w,{Input:m,Label:y});n(91895);const x=c.forwardRef((({bsPrefix:t,type:e,size:n,htmlSize:r,id:a,className:i,isValid:l=!1,isInvalid:u=!1,plaintext:f,readOnly:d,as:m="input",...v},y)=>{const{controlId:g}=(0,c.useContext)(p.Z);let w;return t=(0,h.vE)(t,"form-control"),w=f?{[`${t}-plaintext`]:!0}:{[t]:!0,[`${t}-${n}`]:n},(0,s.jsx)(m,{...v,type:e,size:r,ref:y,readOnly:d,id:a||g,className:o()(i,w,l&&"is-valid",u&&"is-invalid","color"===e&&`${t}-color`)})}));x.displayName="FormControl";var E=Object.assign(x,{Feedback:f}),k=(0,n(66014).Z)("form-floating"),N=n(61401);const S=c.forwardRef(((t,e)=>{const[{className:n,...r},{as:a="div",bsPrefix:i,spans:c}]=function({as:t,bsPrefix:e,className:n,...r}){e=(0,h.vE)(e,"col");const a=(0,h.pi)(),i=[],c=[];return a.forEach((t=>{const n=r[t];let o,a,s;delete r[t],"object"==typeof n&&null!=n?({span:o,offset:a,order:s}=n):o=n;const l="xs"!==t?`-${t}`:"";o&&i.push(!0===o?`${e}${l}`:`${e}${l}-${o}`),null!=s&&c.push(`order${l}-${s}`),null!=a&&c.push(`offset${l}-${a}`)})),[{...r,className:o()(n,...i,...c)},{as:t,bsPrefix:e,spans:i}]}(t);return(0,s.jsx)(a,{...r,ref:e,className:o()(n,!c.length&&i)})}));S.displayName="Col";var L=S;const j=c.forwardRef((({as:t="label",bsPrefix:e,column:n,visuallyHidden:r,className:a,htmlFor:i,...l},u)=>{const{controlId:f}=(0,c.useContext)(p.Z);e=(0,h.vE)(e,"form-label");let d="col-form-label";"string"==typeof n&&(d=`${d} ${d}-${n}`);const m=o()(a,e,r&&"visually-hidden",n&&d);return i=i||f,n?(0,s.jsx)(L,{ref:u,as:"label",className:m,htmlFor:i,...l}):(0,s.jsx)(t,{ref:u,className:m,htmlFor:i,...l})}));j.displayName="FormLabel",j.defaultProps={column:!1,visuallyHidden:!1};var T=j;const _=c.forwardRef((({bsPrefix:t,className:e,id:n,...r},a)=>{const{controlId:i}=(0,c.useContext)(p.Z);return t=(0,h.vE)(t,"form-range"),(0,s.jsx)("input",{...r,type:"range",ref:a,className:o()(e,t),id:n||i})}));_.displayName="FormRange";var P=_;const O=c.forwardRef((({bsPrefix:t,size:e,htmlSize:n,className:r,isValid:a=!1,isInvalid:i=!1,id:l,...u},f)=>{const{controlId:d}=(0,c.useContext)(p.Z);return t=(0,h.vE)(t,"form-select"),(0,s.jsx)("select",{...u,size:n,ref:f,className:o()(r,t,e&&`${t}-${e}`,a&&"is-valid",i&&"is-invalid"),id:l||d})}));O.displayName="FormSelect";var I=O;const C=c.forwardRef((({bsPrefix:t,className:e,as:n="small",muted:r,...a},i)=>(t=(0,h.vE)(t,"form-text"),(0,s.jsx)(n,{...a,ref:i,className:o()(e,t,r&&"text-muted")}))));C.displayName="FormText";var F=C;const R=c.forwardRef(((t,e)=>(0,s.jsx)(b,{...t,ref:e,type:"switch"})));R.displayName="Switch";var Z=Object.assign(R,{Input:b.Input,Label:b.Label}),A=n(34135);const $={_ref:i().any,validated:i().bool,as:i().elementType},q=c.forwardRef((({className:t,validated:e,as:n="form",...r},a)=>(0,s.jsx)(n,{...r,ref:a,className:o()(t,e&&"was-validated")})));q.displayName="Form",q.propTypes=$;var G=Object.assign(q,{Group:N.Z,Control:E,Floating:k,Check:b,Switch:Z,Label:T,Text:F,Range:P,Select:I,FloatingLabel:A.Z})},7034:function(t,e,n){"use strict";const r=n(27378).createContext({});e.Z=r},61401:function(t,e,n){"use strict";var r=n(27378),o=n(7034),a=n(24246);const i=r.forwardRef((({controlId:t,as:e="div",...n},i)=>{const c=(0,r.useMemo)((()=>({controlId:t})),[t]);return(0,a.jsx)(o.Z.Provider,{value:c,children:(0,a.jsx)(e,{...n,ref:i})})}));i.displayName="FormGroup",e.Z=i}}]);