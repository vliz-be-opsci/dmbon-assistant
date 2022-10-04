/*! For license information please see 277.a31fb749.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[277],{81038:function(a,t,r){r.d(t,{UI:function(){return n},XW:function(){return i}});var e=r(27378);function n(a,t){let r=0;return e.Children.map(a,(a=>e.isValidElement(a)?t(a,r++):a))}function i(a,t){return e.Children.toArray(a).some((a=>e.isValidElement(a)&&a.type===t))}},86364:function(a,t,r){var e=r(60042),n=r.n(e),i=r(27378),l=r(28398),s=r(81038),d=r(24246);function u(a,t,r){const e=(a-t)/(r-t)*100;return Math.round(1e3*e)/1e3}function c({min:a,now:t,max:r,label:e,visuallyHidden:i,striped:l,animated:s,className:c,style:o,variant:v,bsPrefix:f,...h},m){return(0,d.jsx)("div",{ref:m,...h,role:"progressbar",className:n()(c,`${f}-bar`,{[`bg-${v}`]:v,[`${f}-bar-animated`]:s,[`${f}-bar-striped`]:s||l}),style:{width:`${u(t,a,r)}%`,...o},"aria-valuenow":t,"aria-valuemin":a,"aria-valuemax":r,children:i?(0,d.jsx)("span",{className:"visually-hidden",children:e}):e})}const o=i.forwardRef((({isChild:a,...t},r)=>{if(t.bsPrefix=(0,l.vE)(t.bsPrefix,"progress"),a)return c(t,r);const{min:e,now:u,max:o,label:v,visuallyHidden:f,striped:h,animated:m,bsPrefix:p,variant:C,className:g,children:w,...x}=t;return(0,d.jsx)("div",{ref:r,...x,className:n()(g,p),children:w?(0,s.UI)(w,(a=>(0,i.cloneElement)(a,{isChild:!0}))):c({min:e,now:u,max:o,label:v,visuallyHidden:f,striped:h,animated:m,bsPrefix:p,variant:C},r)})}));o.displayName="ProgressBar",o.defaultProps={min:0,max:100,animated:!1,isChild:!1,visuallyHidden:!1,striped:!1},t.Z=o},33218:function(a,t,r){r.d(t,{dnY:function(){return l},eEq:function(){return n},eMk:function(){return s},xwm:function(){return i}});var e=r(65898);function n(a){return(0,e.w_)({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"}},{tag:"path",attr:{d:"M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"}}]})(a)}function i(a){return(0,e.w_)({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{fillRule:"evenodd",d:"M4.406 1.342A5.53 5.53 0 0 1 8 0c2.69 0 4.923 2 5.166 4.579C14.758 4.804 16 6.137 16 7.773 16 9.569 14.502 11 12.687 11H10a.5.5 0 0 1 0-1h2.688C13.979 10 15 8.988 15 7.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 2.825 10.328 1 8 1a4.53 4.53 0 0 0-2.941 1.1c-.757.652-1.153 1.438-1.153 2.055v.448l-.445.049C2.064 4.805 1 5.952 1 7.318 1 8.785 2.23 10 3.781 10H6a.5.5 0 0 1 0 1H3.781C1.708 11 0 9.366 0 7.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383z"}},{tag:"path",attr:{fillRule:"evenodd",d:"M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3z"}}]})(a)}function l(a){return(0,e.w_)({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1H2.5zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5zM8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5zm3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0z"}}]})(a)}function s(a){return(0,e.w_)({tag:"svg",attr:{fill:"currentColor",viewBox:"0 0 16 16"},child:[{tag:"path",attr:{d:"M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"}},{tag:"path",attr:{d:"M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"}}]})(a)}}}]);