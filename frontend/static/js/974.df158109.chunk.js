/*! For license information please see 974.df158109.chunk.js.LICENSE.txt */
"use strict";(self.webpackChunkweb=self.webpackChunkweb||[]).push([[974],{42659:function(e,t,n){n.d(t,{Z:function(){return r}});var o=n(27378);function r(e){var t,n,r=(t=e,(n=(0,o.useRef)(t)).current=t,n);(0,o.useEffect)((function(){return function(){return r.current()}}),[])}},44098:function(e,t,n){n.d(t,{Z:function(){return l}});var o=n(26783),r=n(93335),s=n(27378),a=n(33937);const i=(e,t)=>{var n;return r.Z?null==e?(t||(0,o.Z)()).body:("function"==typeof e&&(e=e()),e&&"current"in e&&(e=e.current),null!=(n=e)&&n.nodeType&&e||null):null};function l(e,t){const n=(0,a.Z)(),[o,r]=(0,s.useState)((()=>i(e,null==n?void 0:n.document)));if(!o){const t=i(e);t&&r(t)}return(0,s.useEffect)((()=>{t&&o&&t(o)}),[t,o]),(0,s.useEffect)((()=>{const t=i(e);t!==o&&r(t)}),[e,o]),o}},33937:function(e,t,n){n.d(t,{Z:function(){return a}});var o=n(27378),r=n(93335);const s=(0,o.createContext)(r.Z?window:void 0);function a(){return(0,o.useContext)(s)}s.Provider},19874:function(e,t,n){function o(e,t){return e.contains?e.contains(t):e.compareDocumentPosition?e===t||!!(16&e.compareDocumentPosition(t)):void 0}n.d(t,{Z:function(){return o}})},57353:function(e,t,n){function o(e,t){return e.classList?!!t&&e.classList.contains(t):-1!==(" "+(e.className.baseVal||e.className)+" ").indexOf(" "+t+" ")}n.d(t,{Z:function(){return o}})},5974:function(e,t,n){n.d(t,{Z:function(){return ie}});var o,r=n(60042),s=n.n(r),a=n(45072),i=n(93335),l=n(26783),c=n(56978);function d(e){if((!o&&0!==o||e)&&i.Z){var t=document.createElement("div");t.style.position="absolute",t.style.top="-9999px",t.style.width="50px",t.style.height="50px",t.style.overflow="scroll",document.body.appendChild(t),o=t.offsetWidth-t.clientWidth,document.body.removeChild(t)}return o}var u=n(31818),f=n(4708),m=n(59809),h=n(42659),g=n(47533),p=n(27378);function b(e){void 0===e&&(e=(0,l.Z)());try{var t=e.activeElement;return t&&t.nodeName?t:null}catch(t){return e.body}}var v=n(19874),y=n(42385),E=n(31542),x=n(89440),Z=n(75164),w=n(49981);const k="data-rr-ui-modal-open";var N=class{constructor({ownerDocument:e,handleContainerOverflow:t=!0,isRTL:n=!1}={}){this.handleContainerOverflow=t,this.isRTL=n,this.modals=[],this.ownerDocument=e}getScrollbarWidth(){return function(e=document){const t=e.defaultView;return Math.abs(t.innerWidth-e.documentElement.clientWidth)}(this.ownerDocument)}getElement(){return(this.ownerDocument||document).body}setModalAttributes(e){}removeModalAttributes(e){}setContainerStyle(e){const t={overflow:"hidden"},n=this.isRTL?"paddingLeft":"paddingRight",o=this.getElement();e.style={overflow:o.style.overflow,[n]:o.style[n]},e.scrollBarWidth&&(t[n]=`${parseInt((0,w.Z)(o,n)||"0",10)+e.scrollBarWidth}px`),o.setAttribute(k,""),(0,w.Z)(o,t)}reset(){[...this.modals].forEach((e=>this.remove(e)))}removeContainerStyle(e){const t=this.getElement();t.removeAttribute(k),Object.assign(t.style,e.style)}add(e){let t=this.modals.indexOf(e);return-1!==t||(t=this.modals.length,this.modals.push(e),this.setModalAttributes(e),0!==t||(this.state={scrollBarWidth:this.getScrollbarWidth(),style:{}},this.handleContainerOverflow&&this.setContainerStyle(this.state))),t}remove(e){const t=this.modals.indexOf(e);-1!==t&&(this.modals.splice(t,1),!this.modals.length&&this.handleContainerOverflow&&this.removeContainerStyle(this.state),this.removeModalAttributes(e))}isTopModal(e){return!!this.modals.length&&this.modals[this.modals.length-1]===e}},C=n(44098),R=n(33937),j=n(24246);const T=["show","role","className","style","children","backdrop","keyboard","onBackdropClick","onEscapeKeyDown","transition","backdropTransition","autoFocus","enforceFocus","restoreFocus","restoreFocusOptions","renderDialog","renderBackdrop","manager","container","onShow","onHide","onExit","onExited","onExiting","onEnter","onEntering","onEntered"];let S;const O=(0,p.forwardRef)(((e,t)=>{let{show:n=!1,role:o="dialog",className:r,style:s,children:a,backdrop:l=!0,keyboard:c=!0,onBackdropClick:d,onEscapeKeyDown:u,transition:m,backdropTransition:g,autoFocus:w=!0,enforceFocus:k=!0,restoreFocus:O=!0,restoreFocusOptions:F,renderDialog:D,renderBackdrop:L=(e=>(0,j.jsx)("div",Object.assign({},e))),manager:A,container:B,onShow:M,onHide:$=(()=>{}),onExit:P,onExited:W,onExiting:H,onEnter:I,onEntering:K,onEntered:V}=e,z=function(e,t){if(null==e)return{};var n,o,r={},s=Object.keys(e);for(o=0;o<s.length;o++)n=s[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,T);const U=(0,C.Z)(B),_=function(e){const t=(0,R.Z)(),n=e||function(e){return S||(S=new N({ownerDocument:null==e?void 0:e.document})),S}(t),o=(0,p.useRef)({dialog:null,backdrop:null});return Object.assign(o.current,{add:()=>n.add(o.current),remove:()=>n.remove(o.current),isTopModal:()=>n.isTopModal(o.current),setDialogRef:(0,p.useCallback)((e=>{o.current.dialog=e}),[]),setBackdropRef:(0,p.useCallback)((e=>{o.current.backdrop=e}),[])})}(A),q=(0,x.Z)(),G=(0,Z.Z)(n),[J,Q]=(0,p.useState)(!n),X=(0,p.useRef)(null);(0,p.useImperativeHandle)(t,(()=>_),[_]),i.Z&&!G&&n&&(X.current=b()),m||n||J?n&&J&&Q(!1):Q(!0);const Y=(0,f.Z)((()=>{if(_.add(),se.current=(0,y.Z)(document,"keydown",oe),re.current=(0,y.Z)(document,"focus",(()=>setTimeout(te)),!0),M&&M(),w){const e=b(document);_.dialog&&e&&!(0,v.Z)(_.dialog,e)&&(X.current=e,_.dialog.focus())}})),ee=(0,f.Z)((()=>{var e;_.remove(),null==se.current||se.current(),null==re.current||re.current(),O&&(null==(e=X.current)||null==e.focus||e.focus(F),X.current=null)}));(0,p.useEffect)((()=>{n&&U&&Y()}),[n,U,Y]),(0,p.useEffect)((()=>{J&&ee()}),[J,ee]),(0,h.Z)((()=>{ee()}));const te=(0,f.Z)((()=>{if(!k||!q()||!_.isTopModal())return;const e=b();_.dialog&&e&&!(0,v.Z)(_.dialog,e)&&_.dialog.focus()})),ne=(0,f.Z)((e=>{e.target===e.currentTarget&&(null==d||d(e),!0===l&&$())})),oe=(0,f.Z)((e=>{c&&27===e.keyCode&&_.isTopModal()&&(null==u||u(e),e.defaultPrevented||$())})),re=(0,p.useRef)(),se=(0,p.useRef)(),ae=m;if(!U||!(n||ae&&!J))return null;const ie=Object.assign({role:o,ref:_.setDialogRef,"aria-modal":"dialog"===o||void 0},z,{style:s,className:r,tabIndex:-1});let le=D?D(ie):(0,j.jsx)("div",Object.assign({},ie,{children:p.cloneElement(a,{role:"document"})}));ae&&(le=(0,j.jsx)(ae,{appear:!0,unmountOnExit:!0,in:!!n,onExit:P,onExiting:H,onExited:(...e)=>{Q(!0),null==W||W(...e)},onEnter:I,onEntering:K,onEntered:V,children:le}));let ce=null;if(l){const e=g;ce=L({ref:_.setBackdropRef,onClick:ne}),e&&(ce=(0,j.jsx)(e,{appear:!0,in:!!n,children:ce}))}return(0,j.jsx)(j.Fragment,{children:E.createPortal((0,j.jsxs)(j.Fragment,{children:[ce,le]}),U)})}));O.displayName="Modal";var F=Object.assign(O,{Manager:N}),D=n(57353),L=Function.prototype.bind.call(Function.prototype.call,[].slice);function A(e,t){return L(e.querySelectorAll(t))}function B(e,t){return e.replace(new RegExp("(^|\\s)"+t+"(?:\\s|$)","g"),"$1").replace(/\s+/g," ").replace(/^\s*|\s*$/g,"")}const M=".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",$=".sticky-top",P=".navbar-toggler";class W extends N{adjustAndStore(e,t,n){const o=t.style[e];t.dataset[e]=o,(0,w.Z)(t,{[e]:`${parseFloat((0,w.Z)(t,e))+n}px`})}restore(e,t){const n=t.dataset[e];void 0!==n&&(delete t.dataset[e],(0,w.Z)(t,{[e]:n}))}setContainerStyle(e){super.setContainerStyle(e);const t=this.getElement();var n,o;if(o="modal-open",(n=t).classList?n.classList.add(o):(0,D.Z)(n,o)||("string"==typeof n.className?n.className=n.className+" "+o:n.setAttribute("class",(n.className&&n.className.baseVal||"")+" "+o)),!e.scrollBarWidth)return;const r=this.isRTL?"paddingLeft":"paddingRight",s=this.isRTL?"marginLeft":"marginRight";A(t,M).forEach((t=>this.adjustAndStore(r,t,e.scrollBarWidth))),A(t,$).forEach((t=>this.adjustAndStore(s,t,-e.scrollBarWidth))),A(t,P).forEach((t=>this.adjustAndStore(s,t,e.scrollBarWidth)))}removeContainerStyle(e){super.removeContainerStyle(e);const t=this.getElement();var n,o;o="modal-open",(n=t).classList?n.classList.remove(o):"string"==typeof n.className?n.className=B(n.className,o):n.setAttribute("class",B(n.className&&n.className.baseVal||"",o));const r=this.isRTL?"paddingLeft":"paddingRight",s=this.isRTL?"marginLeft":"marginRight";A(t,M).forEach((e=>this.restore(r,e))),A(t,$).forEach((e=>this.restore(s,e))),A(t,P).forEach((e=>this.restore(s,e)))}}let H;var I=n(46110),K=n(66014),V=(0,K.Z)("modal-body"),z=p.createContext({onHide(){}}),U=n(28398);const _=p.forwardRef((({bsPrefix:e,className:t,contentClassName:n,centered:o,size:r,fullscreen:a,children:i,scrollable:l,...c},d)=>{const u=`${e=(0,U.vE)(e,"modal")}-dialog`,f="string"==typeof a?`${e}-fullscreen-${a}`:`${e}-fullscreen`;return(0,j.jsx)("div",{...c,ref:d,className:s()(u,t,r&&`${e}-${r}`,o&&`${u}-centered`,l&&`${u}-scrollable`,a&&f),children:(0,j.jsx)("div",{className:s()(`${e}-content`,n),children:i})})}));_.displayName="ModalDialog";var q=_,G=(0,K.Z)("modal-footer"),J=n(55541);const Q=p.forwardRef((({closeLabel:e,closeVariant:t,closeButton:n,onHide:o,children:r,...s},a)=>{const i=(0,p.useContext)(z),l=(0,f.Z)((()=>{null==i||i.onHide(),null==o||o()}));return(0,j.jsxs)("div",{ref:a,...s,children:[r,n&&(0,j.jsx)(J.Z,{"aria-label":e,variant:t,onClick:l})]})}));Q.defaultProps={closeLabel:"Close",closeButton:!1};var X=Q;const Y=p.forwardRef((({bsPrefix:e,className:t,...n},o)=>(e=(0,U.vE)(e,"modal-header"),(0,j.jsx)(X,{ref:o,...n,className:s()(t,e)}))));Y.displayName="ModalHeader",Y.defaultProps={closeLabel:"Close",closeButton:!1};var ee=Y;const te=(0,n(25284).Z)("h4");var ne=(0,K.Z)("modal-title",{Component:te});const oe={show:!1,backdrop:!0,keyboard:!0,autoFocus:!0,enforceFocus:!0,restoreFocus:!0,animation:!0,dialogAs:q};function re(e){return(0,j.jsx)(I.Z,{...e,timeout:null})}function se(e){return(0,j.jsx)(I.Z,{...e,timeout:null})}const ae=p.forwardRef((({bsPrefix:e,className:t,style:n,dialogClassName:o,contentClassName:r,children:b,dialogAs:v,"aria-labelledby":y,"aria-describedby":E,"aria-label":x,show:Z,animation:w,backdrop:k,keyboard:N,onEscapeKeyDown:C,onShow:R,onHide:T,container:S,autoFocus:O,enforceFocus:D,restoreFocus:L,restoreFocusOptions:A,onEntered:B,onExit:M,onExiting:$,onEnter:P,onEntering:I,onExited:K,backdropClassName:V,manager:_,...q},G)=>{const[J,Q]=(0,p.useState)({}),[X,Y]=(0,p.useState)(!1),ee=(0,p.useRef)(!1),te=(0,p.useRef)(!1),ne=(0,p.useRef)(null),[oe,ae]=(0,u.Z)(),ie=(0,m.Z)(G,ae),le=(0,f.Z)(T),ce=(0,U.SC)();e=(0,U.vE)(e,"modal");const de=(0,p.useMemo)((()=>({onHide:le})),[le]);function ue(){return _||(H||(H=new W({isRTL:ce})),H)}function fe(e){if(!i.Z)return;const t=ue().getScrollbarWidth()>0,n=e.scrollHeight>(0,l.Z)(e).documentElement.clientHeight;Q({paddingRight:t&&!n?d():void 0,paddingLeft:!t&&n?d():void 0})}const me=(0,f.Z)((()=>{oe&&fe(oe.dialog)}));(0,h.Z)((()=>{(0,c.Z)(window,"resize",me),null==ne.current||ne.current()}));const he=()=>{ee.current=!0},ge=e=>{ee.current&&oe&&e.target===oe.dialog&&(te.current=!0),ee.current=!1},pe=()=>{Y(!0),ne.current=(0,g.Z)(oe.dialog,(()=>{Y(!1)}))},be=e=>{"static"!==k?te.current||e.target!==e.currentTarget?te.current=!1:null==T||T():(e=>{e.target===e.currentTarget&&pe()})(e)},ve=(0,p.useCallback)((t=>(0,j.jsx)("div",{...t,className:s()(`${e}-backdrop`,V,!w&&"show")})),[w,V,e]),ye={...n,...J};return ye.display="block",(0,j.jsx)(z.Provider,{value:de,children:(0,j.jsx)(F,{show:Z,ref:ie,backdrop:k,container:S,keyboard:!0,autoFocus:O,enforceFocus:D,restoreFocus:L,restoreFocusOptions:A,onEscapeKeyDown:e=>{N||"static"!==k?N&&C&&C(e):(e.preventDefault(),pe())},onShow:R,onHide:T,onEnter:(e,t)=>{e&&fe(e),null==P||P(e,t)},onEntering:(e,t)=>{null==I||I(e,t),(0,a.ZP)(window,"resize",me)},onEntered:B,onExit:e=>{null==ne.current||ne.current(),null==M||M(e)},onExiting:$,onExited:e=>{e&&(e.style.display=""),null==K||K(e),(0,c.Z)(window,"resize",me)},manager:ue(),transition:w?re:void 0,backdropTransition:w?se:void 0,renderBackdrop:ve,renderDialog:n=>(0,j.jsx)("div",{role:"dialog",...n,style:ye,className:s()(t,e,X&&`${e}-static`),onClick:k?be:void 0,onMouseUp:ge,"aria-label":x,"aria-labelledby":y,"aria-describedby":E,children:(0,j.jsx)(v,{...q,onMouseDown:he,className:o,contentClassName:r,children:b})})})})}));ae.displayName="Modal",ae.defaultProps=oe;var ie=Object.assign(ae,{Body:V,Header:ee,Title:ne,Footer:G,Dialog:q,TRANSITION_DURATION:300,BACKDROP_TRANSITION_DURATION:150})}}]);