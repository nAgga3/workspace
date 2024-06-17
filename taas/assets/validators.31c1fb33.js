var je=Object.defineProperty,Oe=Object.defineProperties;var _e=Object.getOwnPropertyDescriptors;var Z=Object.getOwnPropertySymbols;var Ce=Object.prototype.hasOwnProperty,Ve=Object.prototype.propertyIsEnumerable;var H=(e,t,r)=>t in e?je(e,t,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[t]=r,Q=(e,t)=>{for(var r in t||(t={}))Ce.call(t,r)&&H(e,r,t[r]);if(Z)for(var r of Z(t))Ve.call(t,r)&&H(e,r,t[r]);return e},X=(e,t)=>Oe(e,_e(t));import{J as v,L as p,M as Te,N as b,O as Pe,P,Q as B,S as Ae,V as ze,W,X as Ie,Y,$ as K,a0 as ee,u as te,a1 as Le}from"../main.js";const j=Object.freeze({CREATE:"CREATE",EDIT:"EDIT",TEMPLATE:"TEMPLATE"});function z(e){return typeof e=="function"}function G(e){return e!==null&&typeof e=="object"&&!Array.isArray(e)}function L(e){return z(e.$validator)?Object.assign({},e):{$validator:e}}function le(e){return typeof e=="object"?e.$valid:e}function ce(e){return e.$validator||e}function Ne(e,t){if(!G(e))throw new Error(`[@vuelidate/validators]: First parameter to "withParams" should be an object, provided ${typeof e}`);if(!G(t)&&!z(t))throw new Error("[@vuelidate/validators]: Validator must be a function or object with $validator parameter");const r=L(t);return r.$params=Object.assign({},r.$params||{},e),r}function Se(e,t){if(!z(e)&&typeof v(e)!="string")throw new Error(`[@vuelidate/validators]: First parameter to "withMessage" should be string or a function returning a string, provided ${typeof e}`);if(!G(t)&&!z(t))throw new Error("[@vuelidate/validators]: Validator must be a function or object with $validator parameter");const r=L(t);return r.$message=e,r}function De(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];const r=L(e);return Object.assign({},r,{$async:!0,$watchTargets:t})}function Me(e){return{$validator(t){for(var r=arguments.length,n=new Array(r>1?r-1:0),a=1;a<r;a++)n[a-1]=arguments[a];return v(t).reduce((i,h,l)=>{const f=Object.entries(h).reduce((u,d)=>{let[$,g]=d;const m=e[$]||{},s=Object.entries(m).reduce((o,c)=>{let[y,x]=c;const _=ce(x).call(this,g,h,l,...n),R=le(_);if(o.$data[y]=_,o.$data.$invalid=!R||!!o.$data.$invalid,o.$data.$error=o.$data.$invalid,!R){let C=x.$message||"";const T=x.$params||{};typeof C=="function"&&(C=C({$pending:!1,$invalid:!R,$params:T,$model:g,$response:_})),o.$errors.push({$property:$,$message:C,$params:T,$response:_,$model:g,$pending:!1,$validator:y})}return{$valid:o.$valid&&R,$data:o.$data,$errors:o.$errors}},{$valid:!0,$data:{},$errors:[]});return u.$data[$]=s.$data,u.$errors[$]=s.$errors,{$valid:u.$valid&&s.$valid,$data:u.$data,$errors:u.$errors}},{$valid:!0,$data:{},$errors:{}});return{$valid:i.$valid&&f.$valid,$data:i.$data.concat(f.$data),$errors:i.$errors.concat(f.$errors)}},{$valid:!0,$data:[],$errors:[]})},$message:t=>{let{$response:r}=t;return r?r.$errors.map(n=>Object.values(n).map(a=>a.map(i=>i.$message)).reduce((a,i)=>a.concat(i),[])):[]}}}const N=e=>{if(e=v(e),Array.isArray(e))return!!e.length;if(e==null)return!1;if(e===!1)return!0;if(e instanceof Date)return!isNaN(e.getTime());if(typeof e=="object"){for(let t in e)return!0;return!1}return!!String(e).length},Fe=e=>(e=v(e),Array.isArray(e)?e.length:typeof e=="object"?Object.keys(e).length:String(e).length);function O(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return n=>(n=v(n),!N(n)||t.every(a=>a.test(n)))}var de=Object.freeze({__proto__:null,withParams:Ne,withMessage:Se,withAsync:De,forEach:Me,req:N,len:Fe,regex:O,unwrap:v,unwrapNormalizedValidator:ce,unwrapValidatorResponse:le,normalizeValidatorObject:L});O(/^[a-zA-Z]*$/);O(/^[a-zA-Z0-9]*$/);O(/^\d*(\.\d+)?$/);const qe=/^(?:[A-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/i;O(qe);function ke(e){return typeof e=="string"&&(e=e.trim()),N(e)}var lt={$validator:ke,$message:"Value is required",$params:{type:"required"}};const re=(e,t)=>e?N(typeof t=="string"?t.trim():t):!0;function Be(e){return function(t,r){if(typeof e!="function")return re(v(e),t);const n=e.call(this,t,r);return re(n,t)}}function ct(e){return{$validator:Be(e),$message:"The value is required",$params:{type:"requiredIf",prop:e}}}const Ge=/^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;O(Ge);O(/(^[0-9]*$)|(^-[0-9]+$)/);O(/^[-]?\d*(\.\d+)?$/);function ne(e){let t=arguments.length>1&&arguments[1]!==void 0?arguments[1]:[];return Object.keys(e).reduce((r,n)=>(t.includes(n)||(r[n]=v(e[n])),r),{})}function I(e){return typeof e=="function"}function Je(e){return Ae(e)||ze(e)}function $e(e,t,r){let n=e;const a=t.split(".");for(let i=0;i<a.length;i++){if(!n[a[i]])return r;n=n[a[i]]}return n}function q(e,t,r){return p(()=>e.some(n=>$e(t,n,{[r]:!1})[r]))}function ae(e,t,r){return p(()=>e.reduce((n,a)=>{const i=$e(t,a,{[r]:!1})[r]||[];return n.concat(i)},[]))}function fe(e,t,r,n){return e.call(n,v(t),v(r),n)}function ve(e){return e.$valid!==void 0?!e.$valid:!e}function We(e,t,r,n,a,i,h){let{$lazy:l,$rewardEarly:f}=a,u=arguments.length>7&&arguments[7]!==void 0?arguments[7]:[],d=arguments.length>8?arguments[8]:void 0,$=arguments.length>9?arguments[9]:void 0,g=arguments.length>10?arguments[10]:void 0;const m=b(!!n.value),s=b(0);r.value=!1;const o=P([t,n].concat(u,g),()=>{if(l&&!n.value||f&&!$.value&&!r.value)return;let c;try{c=fe(e,t,d,h)}catch(y){c=Promise.reject(y)}s.value++,r.value=!!s.value,m.value=!1,Promise.resolve(c).then(y=>{s.value--,r.value=!!s.value,i.value=y,m.value=ve(y)}).catch(y=>{s.value--,r.value=!!s.value,i.value=y,m.value=!0})},{immediate:!0,deep:typeof t=="object"});return{$invalid:m,$unwatch:o}}function Ue(e,t,r,n,a,i,h,l){let{$lazy:f,$rewardEarly:u}=n;const d=()=>({}),$=p(()=>{if(f&&!r.value||u&&!l.value)return!1;let g=!0;try{const m=fe(e,t,h,i);a.value=m,g=ve(m)}catch(m){a.value=m}return g});return{$unwatch:d,$invalid:$}}function Ze(e,t,r,n,a,i,h,l,f,u,d){const $=b(!1),g=e.$params||{},m=b(null);let s,o;e.$async?{$invalid:s,$unwatch:o}=We(e.$validator,t,$,r,n,m,a,e.$watchTargets,f,u,d):{$invalid:s,$unwatch:o}=Ue(e.$validator,t,r,n,m,a,f,u);const c=e.$message;return{$message:I(c)?p(()=>c(ne({$pending:$,$invalid:s,$params:ne(g),$model:t,$response:m,$validator:i,$propertyPath:l,$property:h}))):c||"",$params:g,$pending:$,$invalid:s,$response:m,$unwatch:o}}function He(){let e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};const t=v(e),r=Object.keys(t),n={},a={},i={};let h=null;return r.forEach(l=>{const f=t[l];switch(!0){case I(f.$validator):n[l]=f;break;case I(f):n[l]={$validator:f};break;case l==="$validationGroups":h=f;break;case l.startsWith("$"):i[l]=f;break;default:a[l]=f}}),{rules:n,nestedValidators:a,config:i,validationGroups:h}}function Qe(){}const Xe="__root";function me(e,t,r){if(r)return t?t(e()):e();try{var n=Promise.resolve(e());return t?n.then(t):n}catch(a){return Promise.reject(a)}}function Ye(e,t){return me(e,Qe,t)}function Ke(e,t){var r=e();return r&&r.then?r.then(t):t(r)}function et(e){return function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];try{return Promise.resolve(e.apply(this,t))}catch(n){return Promise.reject(n)}}}function tt(e,t,r,n,a,i,h,l,f){const u=Object.keys(e),d=n.get(a,e),$=b(!1),g=b(!1),m=b(0);if(d){if(!d.$partial)return d;d.$unwatch(),$.value=d.$dirty.value}const s={$dirty:$,$path:a,$touch:()=>{$.value||($.value=!0)},$reset:()=>{$.value&&($.value=!1)},$commit:()=>{}};return u.length?(u.forEach(o=>{s[o]=Ze(e[o],t,s.$dirty,i,h,o,r,a,f,g,m)}),s.$externalResults=p(()=>l.value?[].concat(l.value).map((o,c)=>({$propertyPath:a,$property:r,$validator:"$externalResults",$uid:`${a}-externalResult-${c}`,$message:o,$params:{},$response:null,$pending:!1})):[]),s.$invalid=p(()=>{const o=u.some(c=>v(s[c].$invalid));return g.value=o,!!s.$externalResults.value.length||o}),s.$pending=p(()=>u.some(o=>v(s[o].$pending))),s.$error=p(()=>s.$dirty.value?s.$pending.value||s.$invalid.value:!1),s.$silentErrors=p(()=>u.filter(o=>v(s[o].$invalid)).map(o=>{const c=s[o];return W({$propertyPath:a,$property:r,$validator:o,$uid:`${a}-${o}`,$message:c.$message,$params:c.$params,$response:c.$response,$pending:c.$pending})}).concat(s.$externalResults.value)),s.$errors=p(()=>s.$dirty.value?s.$silentErrors.value:[]),s.$unwatch=()=>u.forEach(o=>{s[o].$unwatch()}),s.$commit=()=>{g.value=!0,m.value=Date.now()},n.set(a,e,s),s):(d&&n.set(a,e,s),s)}function rt(e,t,r,n,a,i,h){const l=Object.keys(e);return l.length?l.reduce((f,u)=>(f[u]=J({validations:e[u],state:t,key:u,parentKey:r,resultsCache:n,globalConfig:a,instance:i,externalResults:h}),f),{}):{}}function nt(e,t,r){const n=p(()=>[t,r].filter(s=>s).reduce((s,o)=>s.concat(Object.values(v(o))),[])),a=p({get(){return e.$dirty.value||(n.value.length?n.value.every(s=>s.$dirty):!1)},set(s){e.$dirty.value=s}}),i=p(()=>{const s=v(e.$silentErrors)||[],o=n.value.filter(c=>(v(c).$silentErrors||[]).length).reduce((c,y)=>c.concat(...y.$silentErrors),[]);return s.concat(o)}),h=p(()=>{const s=v(e.$errors)||[],o=n.value.filter(c=>(v(c).$errors||[]).length).reduce((c,y)=>c.concat(...y.$errors),[]);return s.concat(o)}),l=p(()=>n.value.some(s=>s.$invalid)||v(e.$invalid)||!1),f=p(()=>n.value.some(s=>v(s.$pending))||v(e.$pending)||!1),u=p(()=>n.value.some(s=>s.$dirty)||n.value.some(s=>s.$anyDirty)||a.value),d=p(()=>a.value?f.value||l.value:!1),$=()=>{e.$touch(),n.value.forEach(s=>{s.$touch()})},g=()=>{e.$commit(),n.value.forEach(s=>{s.$commit()})},m=()=>{e.$reset(),n.value.forEach(s=>{s.$reset()})};return n.value.length&&n.value.every(s=>s.$dirty)&&$(),{$dirty:a,$errors:h,$invalid:l,$anyDirty:u,$error:d,$pending:f,$touch:$,$reset:m,$silentErrors:i,$commit:g}}function J(e){const t=et(function(){return F(),Ke(function(){if(c.$rewardEarly)return U(),Ye(ee)},function(){return me(ee,function(){return new Promise(E=>{if(!M.value)return E(!D.value);const V=P(M,()=>{E(!D.value),V()})})})})});let{validations:r,state:n,key:a,parentKey:i,childResults:h,resultsCache:l,globalConfig:f={},instance:u,externalResults:d}=e;const $=i?`${i}.${a}`:a,{rules:g,nestedValidators:m,config:s,validationGroups:o}=He(r),c=Object.assign({},f,s),y=a?p(()=>{const E=v(n);return E?v(E[a]):void 0}):n,x=Object.assign({},v(d)||{}),S=p(()=>{const E=v(d);return a?E?v(E[a]):void 0:E}),_=tt(g,y,a,l,$,c,u,S,n),R=rt(m,y,$,l,c,u,S),C={};o&&Object.entries(o).forEach(E=>{let[V,w]=E;C[V]={$invalid:q(w,R,"$invalid"),$error:q(w,R,"$error"),$pending:q(w,R,"$pending"),$errors:ae(w,R,"$errors"),$silentErrors:ae(w,R,"$silentErrors")}});const{$dirty:T,$errors:ge,$invalid:D,$anyDirty:pe,$error:ye,$pending:M,$touch:F,$reset:Ee,$silentErrors:Re,$commit:U}=nt(_,R,h),be=a?p({get:()=>v(y),set:E=>{T.value=!0;const V=v(n),w=v(d);w&&(w[a]=x[a]),B(V[a])?V[a].value=E:V[a]=E}}):null;a&&c.$autoDirty&&P(y,()=>{T.value||F();const E=v(d);E&&(E[a]=x[a])},{flush:"sync"});function xe(E){return(h.value||{})[E]}function we(){B(d)?d.value=x:Object.keys(x).length===0?Object.keys(d).forEach(E=>{delete d[E]}):Object.assign(d,x)}return W(Object.assign({},_,{$model:be,$dirty:T,$error:ye,$errors:ge,$invalid:D,$anyDirty:pe,$pending:M,$touch:F,$reset:Ee,$path:$||Xe,$silentErrors:Re,$validate:t,$commit:U},h&&{$getResultsForChild:xe,$clearExternalResults:we,$validationGroups:C},R))}class at{constructor(){this.storage=new Map}set(t,r,n){this.storage.set(t,{rules:r,result:n})}checkRulesValidity(t,r,n){const a=Object.keys(n),i=Object.keys(r);return i.length!==a.length||!i.every(l=>a.includes(l))?!1:i.every(l=>r[l].$params?Object.keys(r[l].$params).every(f=>v(n[l].$params[f])===v(r[l].$params[f])):!0)}get(t,r){const n=this.storage.get(t);if(!n)return;const{rules:a,result:i}=n,h=this.checkRulesValidity(t,r,a),l=i.$unwatch?i.$unwatch:()=>({});return h?i:{$dirty:i.$dirty,$partial:!0,$unwatch:l}}}const A={COLLECT_ALL:!0,COLLECT_NONE:!1},se=Symbol("vuelidate#injectChildResults"),ie=Symbol("vuelidate#removeChildResults");function st(e){let{$scope:t,instance:r}=e;const n={},a=b([]),i=p(()=>a.value.reduce((d,$)=>(d[$]=v(n[$]),d),{}));function h(d,$){let{$registerAs:g,$scope:m,$stopPropagation:s}=$;s||t===A.COLLECT_NONE||m===A.COLLECT_NONE||t!==A.COLLECT_ALL&&t!==m||(n[g]=d,a.value.push(g))}r.__vuelidateInjectInstances=[].concat(r.__vuelidateInjectInstances||[],h);function l(d){a.value=a.value.filter($=>$!==d),delete n[d]}r.__vuelidateRemoveInstances=[].concat(r.__vuelidateRemoveInstances||[],l);const f=Y(se,[]);K(se,r.__vuelidateInjectInstances);const u=Y(ie,[]);return K(ie,r.__vuelidateRemoveInstances),{childResults:i,sendValidationResultsToParent:f,removeValidationResultsFromParent:u}}function he(e){return new Proxy(e,{get(t,r){return typeof t[r]=="object"?he(t[r]):p(()=>t[r])}})}let oe=0;function dt(e,t){var r;let n=arguments.length>2&&arguments[2]!==void 0?arguments[2]:{};arguments.length===1&&(n=e,e=void 0,t=void 0);let{$registerAs:a,$scope:i=A.COLLECT_ALL,$stopPropagation:h,$externalResults:l,currentVueInstance:f}=n;const u=f||((r=Te())===null||r===void 0?void 0:r.proxy),d=u?u.$options:{};a||(oe+=1,a=`_vuelidate_${oe}`);const $=b({}),g=new at,{childResults:m,sendValidationResultsToParent:s,removeValidationResultsFromParent:o}=u?st({$scope:i,instance:u}):{childResults:b({})};if(!e&&d.validations){const c=d.validations;t=b({}),Pe(()=>{t.value=u,P(()=>I(c)?c.call(t.value,new he(t.value)):c,y=>{$.value=J({validations:y,state:t,childResults:m,resultsCache:g,globalConfig:n,instance:u,externalResults:l||u.vuelidateExternalResults})},{immediate:!0})}),n=d.validationsConfig||n}else{const c=B(e)||Je(e)?e:W(e||{});P(c,y=>{$.value=J({validations:y,state:t,childResults:m,resultsCache:g,globalConfig:n,instance:u!=null?u:{},externalResults:l})},{immediate:!0})}return u&&(s.forEach(c=>c($,{$registerAs:a,$scope:i,$stopPropagation:h})),Ie(()=>o.forEach(c=>c(a)))),p(()=>Object.assign({},v($.value),m.value))}const ue="configurationEditorMixin",k=(e,t)=>Object.keys(e).reduce((r,n)=>X(Q({},r),{[n]:t[n]}),{});var $t={props:{mode:{type:String,default:j.CREATE},standalone:{type:Boolean,default:!0},vId:{type:Number,default:null},toasts:{type:Boolean,default:!0}},computed:{_mode(){var t;let e=this.__mode;return e||(e=this.mode,this.standalone&&(this.$route.params.mode?e=this.$route.params.mode:((t=this.$route.params.id)==null?void 0:t.toUpperCase())!=="NEW"&&(e=j.EDIT))),e},_id(){let e=this.vId;return this.standalone&&(this._mode==j.EDIT||this._mode==j.TEMPLATE)&&(e=this.$route.params.id),e}},emits:["saved","error","closed"],async mounted(){this.standalone&&(te().allowExpand=!1,te().allowClose=!1),(this._mode==j.EDIT||this._mode==j.TEMPLATE)&&await this.load({id:this._id,mode:this._mode});try{this._frozenData=k(this.$options.validations(),this.$data)}catch{}this.__mode=this._mode===j.TEMPLATE?j.CREATE:this.__mode},data(){return{_frozenData:{},__mode:null}},methods:{cancel(){try{const e=k(this.$options.validations(),this.$data);JSON.stringify(e)!==JSON.stringify(this._frozenData)?this.$confirm.require({message:this.$t(`${ue}.discardChanges.message`),header:this.$t(`${ue}.discardChanges.title`),icon:"thin-alert",accept:()=>{this.back()},reject:()=>{}}):this.back()}catch{this.back()}},isDirty(){const e=k(this.$options.validations(),this.$data);JSON.stringify(e),JSON.stringify(this._frozenData)},back(){this.standalone&&this.$router.push({name:"configuration"}),this.$emit("closed")}}};const it=de.regex(/^[-\w\._\(\)]+[^\.]$/),ft=de.withMessage(Le.global.t("common.validators.providerIdRegExpValidator"),it);export{$t as C,ct as a,j as e,ft as p,lt as r,dt as u};
