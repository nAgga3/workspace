var G=Object.defineProperty,J=Object.defineProperties;var x=Object.getOwnPropertyDescriptors;var F=Object.getOwnPropertySymbols;var H=Object.prototype.hasOwnProperty,z=Object.prototype.propertyIsEnumerable;var D=(e,s,i)=>s in e?G(e,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[s]=i,y=(e,s)=>{for(var i in s||(s={}))H.call(s,i)&&D(e,i,s[i]);if(F)for(var i of F(s))z.call(s,i)&&D(e,i,s[i]);return e},$=(e,s)=>J(e,x(s));/* empty css                          */import{_ as k,r as f,o as d,c,a as t,f as u,h as p,F as V,p as W,m as Q,d as X,e as C,w as M,t as n,n as L,s as Y,x as Z,E as T,i as ee,k as se,b as oe}from"../main.js";import{C as te,e as I,u as ie,r as v,p as B,a as le}from"./validators.31c1fb33.js";import{C as ne}from"./CodeField.5fc4a798.js";import{i as O,a as N,b as ae}from"./InstancingModes.enum.dddbd849.js";import{c as de,a as E,b as re}from"./connectionModes.enum.1a94a4a1.js";import{D as A}from"./DialogMixin.c05a30f4.js";import{v as P}from"./v4.90f1a8cc.js";const b=Object.freeze({NONE:"pmNone",BREADTHFIRST:"pmBreadthFirst",DEPTHFIRST:"pmDepthFirst"}),K=Object.freeze({[b.NONE]:"None",[b.BREADTHFIRST]:"Breadth First",[b.DEPTHFIRST]:"Depth First"}),ce=Object.freeze({[b.NONE]:"none",[b.BREADTHFIRST]:"breadthFirst",[b.DEPTHFIRST]:"depthFirst"});const ue={props:{valueKey:{type:String,default:""},value:{type:String,default:""},id:{type:String,default:""},suggestions:{type:Array,default:()=>[]},readOnly:{type:Boolean,default:!1},required:{type:Boolean,default:!1}},emits:["remove"],data(){return{suggestedKeys:[]}},computed:{_key:{get(){return this.valueKey},set(e){this.$emit("update:valueKey",e)}},_value:{get(){return this.value},set(e){this.$emit("update:value",e)}}},methods:{searchKey(e){this.suggestedKeys=this.suggestions.filter(s=>s.toLowerCase().includes(e.query.toLowerCase()))},remove(){this.$emit("remove",this.id)}}},q=e=>(W("data-v-61963588"),e=e(),Q(),e),me={class:"grid grid-nogutter flex my-2"},pe={class:"field col-5 align-items-center"},ge=q(()=>t("label",{for:"name"},"Key",-1)),fe={class:"col-5 field align-items-center"},he=q(()=>t("label",{for:"name"},"Value",-1)),ve={key:0,class:"col-2 flex align-items-center justify-content-center"},_e=q(()=>t("div",{class:"w-full separator my-2"},null,-1));function ye(e,s,i,o,r,l){const h=f("AutoComplete"),m=f("InputText"),_=f("Button");return d(),c(V,null,[t("div",me,[t("div",pe,[ge,u(h,{modelValue:l._key,"onUpdate:modelValue":s[0]||(s[0]=g=>l._key=g),suggestions:r.suggestedKeys,onComplete:s[1]||(s[1]=g=>l.searchKey(g)),dropdown:!0,class:"mr-4",disabled:i.readOnly||i.required},null,8,["modelValue","suggestions","disabled"])]),t("div",fe,[he,u(m,{autofocus:"autofocus",class:"mr-4",modelValue:l._value,"onUpdate:modelValue":s[2]||(s[2]=g=>l._value=g),readOnly:i.readOnly},null,8,["modelValue","readOnly"])]),!i.readOnly&&!i.required?(d(),c("div",ve,[u(_,{onClick:l.remove,icon:"thin-cancel",class:"p-button mt-3"},null,8,["onClick"])])):p("",!0)]),_e],64)}var be=k(ue,[["render",ye],["__scopeId","data-v-61963588"]]);const $e={components:{JSONKeyValueListItem:be},props:{items:{type:Array,default:[]},suggestions:{type:Array,default:()=>[]},readOnly:{type:Boolean,default:!1},requiredFields:{type:Array,default:()=>[]}},data(){return{_items:[]}},watch:{items:{deep:!0,immediate:!0,handler(e){this._items=e}},_items:{deep:!0,handler(e){this.$emit("update:items",e)}}},computed:{filteredSuggestions(){return this.suggestions.filter(e=>!this._items.some(s=>s.key==e))}},methods:{removeItem(e){this._items.length>1&&(this._items=this._items.filter(s=>s.id!==e))}},mounted(){}},Ie={class:"flex flex-column"};function Ve(e,s,i,o,r,l){const h=f("JSONKeyValueListItem");return d(),c("div",Ie,[(d(!0),c(V,null,X(r._items,m=>{var _;return d(),C(h,{readOnly:i.readOnly,suggestions:l.filteredSuggestions,onRemove:l.removeItem,valueKey:m.key,"onUpdate:valueKey":g=>m.key=g,value:m.value,"onUpdate:value":g=>m.value=g,required:(_=m.required)!=null?_:!1,id:m.id,key:m.id},null,8,["readOnly","suggestions","onRemove","valueKey","onUpdate:valueKey","value","onUpdate:value","required","id"])}),128))])}var Ce=k($e,[["render",Ve]]);const Me="components.JSONKeyValueListModal",Oe={mixins:[A],props:{suggestions:{type:Array,default:()=>[]},readOnly:{type:Boolean,default:!1},requiredFields:{type:Array,default:()=>[]}},setup(){return{i18nComponentBase:Me}},data(){return{defaults:{title:"",items:[],focus:""},fields:{title:"",items:[],focus:""},readOnly:!1}},methods:{async show(e,{readOnly:s=!1}={}){var i;return Object.assign(this.$data,{readOnly:s}),this.fields=$(y(y({},this.defaults),e),{items:(i=e==null?void 0:e.items.map(o=>$(y({},o),{id:P()})))!=null?i:[]}),this.fields.items.length==0&&this.addItem(),A.methods.show.call(this,e)},addItem(){this.fields.items.push({id:P(),key:"",value:""})},save(){this.emitResponse({status:"ok",items:this.fields.items},!0,"ok")},close(){this.emitResponse({status:"close"},!0,"close")},hide(){this.fields=y({},this.defaults)}},mounted(){},components:{JSONKeyValueList:Ce}},ke={class:"p-dialog-title"},Te={class:"grid p-3"},Le={class:"flex"},Se={key:0,class:"flex flex-1 justify-content-end"},qe={class:"flex"},we={class:"flex flex-1 justify-content-end"};function Fe(e,s,i,o,r,l){const h=f("JSONKeyValueList"),m=f("Button"),_=f("Dialog");return d(),C(_,{class:"simpledialog",modal:!0,closeOnEscape:!1,onHide:l.hide,visible:e.internal.show,"onUpdate:visible":s[2]||(s[2]=g=>e.internal.show=g)},{header:M(()=>[t("span",ke,n(r.fields.title),1)]),footer:M(()=>[t("div",Le,[r.readOnly?(d(),c("div",Se,[u(m,{label:e.$t("common.close"),onClick:l.close,class:L(r.fields.acceptClass),autofocus:r.fields.focus=="close"},null,8,["label","onClick","class","autofocus"])])):p("",!0),r.readOnly?p("",!0):(d(),c(V,{key:1},[t("div",qe,[u(m,{label:e.$t(`${o.i18nComponentBase}.add_parameter`),onClick:l.addItem,autofocus:r.fields.focus=="ok"},null,8,["label","onClick","autofocus"])]),t("div",we,[u(m,{label:e.$t("common.ok"),onClick:l.save,class:L(r.fields.acceptClass),autofocus:r.fields.focus=="ok"},null,8,["label","onClick","class","autofocus"]),u(m,{label:e.$t("common.cancel"),onClick:s[1]||(s[1]=g=>e.emitResponse({status:"cancel"},!0,"cancel")),class:L(r.fields.rejectClass),autofocus:r.fields.focus=="cancel"},null,8,["label","class","autofocus"])])],64))])]),default:M(()=>[t("div",Te,[u(h,{ref:"jsonKeyValueList",requiredFields:i.requiredFields,readOnly:r.readOnly,suggestions:i.suggestions,items:r.fields.items,"onUpdate:items":s[0]||(s[0]=g=>r.fields.items=g)},null,8,["requiredFields","readOnly","suggestions","items"])])]),_:1},8,["onHide","visible"])}var De=k(Oe,[["render",Fe]]);const Be={props:{items:{type:Object,default:{}},suggestions:{type:Array,default:()=>[]},readOnly:{type:Boolean,default:!1},requiredFields:{type:Array,default:()=>[]}},components:{JSONKeyValueListModal:De},emits:["update:items"],data(){return{}},computed:{_items:{get(){let e=[...this.requiredFields];return Object.keys(this.items).map(s=>{let i=e.includes(s);return{key:s,value:this.items[s],required:i}})},set(e){this.$emit("update:items",e.reduce((s,i)=>(s[i.key]=i.value,s),{}))}},hasData(){var e;try{return((e=this._items)==null?void 0:e.length)>0}catch{return!1}}},methods:{view(){this.$refs.modal.show({title:"View Parameters",items:this._items},{readOnly:!0})},edit(){this.$refs.modal.show({title:"Edit Parameters",items:this._items}).then(e=>{e.status=="ok"&&(this._items=e.items)})},remove(){this._items=[]}}},Ne={class:"grid grid-nogutter"},Ee={class:"col-12 flex"};function Ae(e,s,i,o,r,l){const h=f("Button"),m=f("JSONKeyValueListModal");return d(),c(V,null,[t("div",Ne,[t("div",Ee,[i.readOnly?(d(),c(V,{key:0},[l.hasData?(d(),C(h,{key:0,class:"flex-1 m-1",onClick:l.view,label:"View"},null,8,["onClick"])):p("",!0)],64)):p("",!0),i.readOnly?p("",!0):(d(),c(V,{key:1},[l.hasData?p("",!0):(d(),C(h,{key:0,class:"flex-1 m-1",onClick:l.edit,label:"Add"},null,8,["onClick"])),l.hasData?(d(),C(h,{key:1,class:"flex-1 m-1",onClick:l.edit,label:"Edit"},null,8,["onClick"])):p("",!0)],64))])]),u(m,{requiredFields:i.requiredFields,suggestions:i.suggestions,ref:"modal"},null,8,["requiredFields","suggestions"])],64)}var Pe=k(Be,[["render",Ae]]);const S="models",Ke=e=>e&&Object.values(e).every(s=>(s==null?void 0:s.trim().length)>0),Ue={name:"EditModel",mixins:[te],components:{CodeField:ne,JSONKeyValueField:Pe},setup(){return{editorModes:I,pageBase:S,v$:ie(),instancingModesEnum:O}},data:()=>({name:"",description:"",credentialsId:null,group:"",location:null,templateId:"",parameters:{},instancingMode:O.ONDEMAND,scheduleId:null,stopAfterDisconnect:5,estimatedProvisioningTime:10,poolMode:b.NONE,connectionMode:de.PUBLICIP,maxInstancesCount:1,maxClientCount:1,submitted:!1,saving:!1,_locations:[],_loadingLocations:!1,_readOnly:!1,_appendLocationToGroup:!0,_appendLocationToGroupSeparator:"_",_parameters:{}}),validations(){return{name:{required:v,providerIdRegExpValidatorWMessage:B},description:{required:v},credentialsId:{required:v},group:{required:v},groupFullName:{providerIdRegExpValidatorWMessage:B},location:{required:v},templateId:{required:v},parametersF:{required:v,valuesMustNotBeEmpty:Ke},instancingMode:{required:v},scheduleId:{required:le(this.requiredIf_scheduleId)},stopAfterDisconnect:{required:v},estimatedProvisioningTime:{required:v},poolMode:{required:v},connectionMode:{required:v},maxInstancesCount:{required:v},maxClientCount:{required:v}}},computed:$(y({},Y(Z,["credentials","templates","schedules"])),{requiredIf_scheduleId(){return[O.SCHEDULED,O.BOTH].includes(this.instancingMode)},credential:{get(){return this.credentials.find(e=>e.id===this.credentialsId)},set(e){var s;this.credentialsId=(s=e==null?void 0:e.id)!=null?s:null}},groupFullName(){return`${this.group}${this._appendLocationToGroup?`${this._appendLocationToGroupSeparator}${this.location}`:""}`},templatesF(){var s,i;let e=this.credentials.find(o=>o.id===this.credentialsId);return(i=(s=this.templates)==null?void 0:s.filter(o=>o.active&&o.credentialsId==(e==null?void 0:e.id)))!=null?i:[]},instancingModes(){return Object.keys(N).map(e=>({id:e,name:N[e]}))},poolModes(){return Object.keys(K).map(e=>({id:e,name:K[e]}))},connectionModes(){return Object.keys(E).map(e=>({id:e,name:E[e]}))},templateParameters(){var s,i,o,r;let e=(i=(s=this.templates.find(l=>l.id==this.templateId))==null?void 0:s.parameters)!=null?i:"{}";try{e=(r=(o=JSON.parse(e))==null?void 0:o.parameters)!=null?r:{}}catch{e={}}return e},templateParameterKeys(){var e;return Object.keys((e=this.templateParameters)!=null?e:{})},suggestions(){var e;return Object.keys((e=this.templateParameters)!=null?e:{})},_requiredParams(){return this.templateParameterKeys.filter(s=>this.templateParameters[s].value==null)},parametersF:{get(){let e=this._requiredParams.reduce((s,i)=>{var o,r;return $(y({},s),{[i]:(r=(o=this.templateParameters[i])==null?void 0:o.value)!=null?r:null})},{});return y(y({},e),this.parameters)},set(e){this.parameters=e}}}),watch:{async credentialsId(e){this._locations=[],this._loadingLocations=!0;try{this._locations=(await T.getLocations({credentialsId:e})).items}catch{}finally{this._loadingLocations=!1}}},methods:{async load({id:e,mode:s=I.EDIT}){var r,l,h,m,_;let i=(l=(r=await T.get(e))==null?void 0:r.items)!=null?l:{};const o=((h=i.group)==null?void 0:h.split(this._appendLocationToGroupSeparator).at(-1))===i.location;s===I.TEMPLATE&&(i=$(y({},i),{id:null,name:null,desc:null,inUse:!1})),Object.assign(this.$data,{id:i.id,name:i.name,description:i.desc,credentialsId:i.credentialsId,group:o?(m=i.group)==null?void 0:m.split(this._appendLocationToGroupSeparator).slice(0,-1).join(this._appendLocationToGroupSeparator):i.group,location:i.location,templateId:i.templateId,parameters:i.parameters,instancingMode:i.instancingMode,scheduleId:i.scheduleId,stopAfterDisconnect:i.stopAfterDisconnect,estimatedProvisioningTime:i.estimatedProvisioningTime,poolMode:i.poolMode,connectionMode:i.connectionMode,maxInstancesCount:i.maxInstancesCount,maxClientCount:i.maxClientCount,_readOnly:(_=i.inUse)!=null?_:!1,_appendLocationToGroup:o})},async save(){var s,i,o,r;let e=!1;try{if(this.submitted=!0,!await this.v$.$validate())return e;this.saving=!0;const l={name:this.name,desc:this.description,credentialsId:this.credentialsId,group:this.groupFullName,location:this.location,templateId:this.templateId,parameters:this.parametersF,instancingMode:ae[this.instancingMode],scheduleId:this.instancingMode==O.ONDEMAND?null:this.scheduleId,stopAfterDisconnect:this.stopAfterDisconnect,estimatedProvisioningTime:this.estimatedProvisioningTime,poolMode:ce[this.poolMode],connectionMode:re[this.connectionMode],maxInstancesCount:this.maxInstancesCount,maxClientCount:this.maxClientCount,id:this.id};this._mode===I.CREATE?await T.create(l):await T.update(l),this.toasts&&this.$toast.add({group:"br",severity:"success",summary:this.$t(`${S}.toasts.events.${this._mode===I.CREATE?"created":"updated"}.summary`),detail:this.$t(`${S}.toasts.events.${this._mode===I.CREATE?"created":"updated"}.detail`,{name:this.name}),life:3e3}),e=!0,this.$emit("saved"),this.back()}catch(l){this.$toast.add({group:"br",severity:"error",summary:this.$t("common.toasts.events.error.summary"),detail:this.$t("common.toasts.events.error.detail",{error:(r=(o=(i=(s=l==null?void 0:l.response)==null?void 0:s.data)==null?void 0:i.error)==null?void 0:o.message)!=null?r:l}),life:3e3}),this.$emit("error")}finally{this.saving=!1}return e}}},Re={class:"grid grid-nogutter flex flex-column flex-1 overflow-hidden custom-scrollbars h-full edit-model side-panel"},je={class:"grid grid-nogutter flex-1 overflow-hidden flex-column flex-nowrap"},Ge={class:"overflow-hidden flex-1 flex-column"},Je={class:"overflow-hidden flex-1 h-full"},xe={class:"overflow-auto h-full flex-1 px-4"},He={class:"flex flex-column flex-1 flex-nowrap h-full"},ze={class:"col flex-1 mt-2 overflow-auto"},We={class:"grid grid-nogutter flex-column"},Qe={class:"col mb-2"},Xe={class:"grid grid-nogutter my-2 align-items-center"},Ye={class:"col col flex justify-content-start align-items-center"},Ze={class:"text-xl m-0"},es={class:"col"},ss={class:"formgrid grid"},os={class:"field col"},ts={for:"name"},is={key:0,class:"p-error"},ls={class:"formgrid grid"},ns={class:"field col"},as={for:"description"},ds={key:0,class:"p-error"},rs={class:"formgrid grid"},cs={class:"field col"},us={for:"credential"},ms={key:0,class:"p-dropdown-option flex"},ps={class:"flex-1"},gs={key:1},fs={class:"p-dropdown-option flex"},hs={class:"flex-1"},vs={key:0,class:"p-error"},_s={class:"formgrid grid"},ys={class:"field col"},bs={for:"template"},$s={key:0,class:"p-error"},Is={class:"formgrid grid"},Vs={class:"field col"},Cs={for:"group"},Ms={class:"p-inputgroup mb-2"},Os={key:0,class:"p-inputgroup-addon"},ks={key:0,class:"p-error"},Ts={class:"field-checkbox mt-3"},Ls=t("label",{for:"appendLocationToGroup"},"Append Location to Group",-1),Ss={class:"formgrid grid"},qs={class:"field col"},ws={for:"location"},Fs={key:0,class:"p-error"},Ds={class:"formgrid grid"},Bs={class:"field col"},Ns={class:"flex"},Es={class:"flex-1 flex align-items-center"},As={for:"parameters"},Ps={class:"flex-1"},Ks={key:0,class:"p-error"},Us={class:"formgrid grid"},Rs={class:"field col"},js={for:"instancingMode"},Gs={key:0,class:"p-error"},Js={key:0,class:"formgrid grid"},xs={class:"field col"},Hs={for:"scheduleId"},zs={key:0,class:"p-error"},Ws={class:"formgrid grid"},Qs={class:"field col"},Xs={for:"stopAfterDisconnect"},Ys={class:"p-inputgroup mb-2"},Zs={class:"p-inputgroup-addon"},eo={key:0,class:"p-error"},so={class:"formgrid grid"},oo={class:"field col"},to={for:"estimatedProvisioningTime"},io={class:"p-inputgroup mb-2"},lo={class:"p-inputgroup-addon"},no={key:0,class:"p-error"},ao={class:"formgrid grid"},ro={class:"field col"},co={for:"poolMode"},uo={key:0,class:"p-error"},mo={class:"formgrid grid"},po={class:"field col"},go={for:"connectionMode"},fo={key:0,class:"p-error"},ho={class:"formgrid grid"},vo={class:"field col"},_o={for:"maxInstancesCount"},yo={key:0,class:"p-error"},bo={class:"formgrid grid"},$o={class:"field col"},Io={for:"maxClientCount"},Vo={key:0,class:"p-error"},Co={class:"footer-buttons flex w-full py-5 justify-content-end"},Mo={class:"grid grid-nogutter mx-2"},Oo={class:"flex flex-1 mx-2"},ko={class:"flex flex-1 mx-2"};function To(e,s,i,o,r,l){const h=f("InlineMessage"),m=f("InputText"),_=f("Tag"),g=f("Dropdown"),U=f("Checkbox"),R=f("JSONKeyValueField"),w=f("Button"),j=ee("tooltip");return d(),c("div",Re,[t("div",je,[t("div",Ge,[t("div",Je,[t("div",xe,[t("div",He,[t("div",ze,[t("div",We,[t("div",Qe,[t("div",Xe,[t("div",Ye,[t("p",Ze,n(e.$t(`${o.pageBase}.${this._mode==o.editorModes.CREATE?"add":"edit"}_title`)),1)]),e._readOnly?se((d(),C(h,{key:0,class:"cursor-pointer",severity:"warn"},{default:M(()=>[oe(n(e.$t("common.entityInUse",{type:"model"})),1)]),_:1})),[[j,e.$t("common.entityInUseDetails"),void 0,{bottom:!0}]]):p("",!0)])]),t("div",es,[t("div",ss,[t("div",os,[t("label",ts,n(e.$t(`${o.pageBase}.name`)),1),u(m,{autofocus:"autofocus",id:"name",class:"w-full mb-2",readOnly:e._readOnly,modelValue:e.name,"onUpdate:modelValue":s[0]||(s[0]=a=>e.name=a)},null,8,["readOnly","modelValue"]),o.v$.name.$invalid&&e.submitted||o.v$.name.$pending.$response?(d(),c("small",is,n(o.v$.name.required.$invalid?o.v$.name.required.$message.replace("Value","Name"):"")+" "+n(o.v$.name.providerIdRegExpValidatorWMessage.$invalid?o.v$.name.providerIdRegExpValidatorWMessage.$message:""),1)):p("",!0)])]),t("div",ls,[t("div",ns,[t("label",as,n(e.$t(`${o.pageBase}.description`)),1),u(m,{id:"description",class:"w-full mb-2",modelValue:e.description,"onUpdate:modelValue":s[1]||(s[1]=a=>e.description=a),readOnly:e._readOnly},null,8,["modelValue","readOnly"]),o.v$.description.$invalid&&e.submitted||o.v$.description.$pending.$response?(d(),c("small",ds,n(o.v$.description.required.$message.replace("Value","Description")),1)):p("",!0)])]),t("div",rs,[t("div",cs,[t("label",us,n(e.$t(`${o.pageBase}.credential`)),1),u(g,{id:"credential",class:"w-full mb-2",optionLabel:"Name",placeholder:"Select credential",options:e.credentials,modelValue:l.credential,"onUpdate:modelValue":s[2]||(s[2]=a=>l.credential=a),disabled:e._readOnly},{value:M(a=>[a.value?(d(),c("div",ms,[t("div",ps,[t("span",null,n(a.value.name),1)]),u(_,{class:"ml-2",value:a.value.provider},null,8,["value"])])):(d(),c("span",gs,n(a.placeholder),1))]),option:M(a=>[t("div",fs,[t("div",hs,[t("span",null,n(a.option.name),1)]),u(_,{class:"ml-2",value:a.option.provider},null,8,["value"])])]),_:1},8,["options","modelValue","disabled"]),o.v$.credentialsId.$invalid&&e.submitted||o.v$.credentialsId.$pending.$response?(d(),c("small",vs,n(o.v$.credentialsId.required.$message.replace("Value","Credential")),1)):p("",!0)])]),t("div",_s,[t("div",ys,[t("label",bs,n(e.$t(`${o.pageBase}.template`)),1),u(g,{id:"template",class:"w-full mb-2",optionLabel:"name",optionValue:"id",placeholder:"Select template",options:l.templatesF,modelValue:e.templateId,"onUpdate:modelValue":s[3]||(s[3]=a=>e.templateId=a),disabled:e._readOnly},null,8,["options","modelValue","disabled"]),o.v$.templateId.$invalid&&e.submitted||o.v$.templateId.$pending.$response?(d(),c("small",$s,n(o.v$.templateId.required.$message.replace("Value","Template")),1)):p("",!0)])]),t("div",Is,[t("div",Vs,[t("label",Cs,n(e.$t(`${o.pageBase}.group`)),1),t("div",Ms,[u(m,{id:"group",class:"",modelValue:e.group,"onUpdate:modelValue":s[4]||(s[4]=a=>e.group=a),readOnly:e._readOnly},null,8,["modelValue","readOnly"]),e.location&&e._appendLocationToGroup?(d(),c("span",Os,n(e._appendLocationToGroupSeparator)+n(e.location),1)):p("",!0)]),(o.v$.group.$invalid||o.v$.groupFullName.$invalid)&&e.submitted||o.v$.group.$pending.$response||o.v$.groupFullName.$pending.$response?(d(),c("small",ks,n(o.v$.group.required.$invalid?o.v$.group.required.$message.replace("Value","Group"):"")+" "+n(o.v$.groupFullName.providerIdRegExpValidatorWMessage.$invalid?o.v$.groupFullName.providerIdRegExpValidatorWMessage.$message:""),1)):p("",!0),t("div",Ts,[u(U,{disabled:e._readOnly,name:"appendLocationToGroup",id:"appendLocationToGroup",binary:!0,modelValue:e._appendLocationToGroup,"onUpdate:modelValue":s[5]||(s[5]=a=>e._appendLocationToGroup=a)},null,8,["disabled","modelValue"]),Ls])])]),t("div",Ss,[t("div",qs,[t("label",ws,n(e.$t(`${o.pageBase}.location`)),1),u(g,{id:"location",class:"w-full mb-2",optionValue:"name",optionLabel:"displayname",placeholder:e._loadingLocations?"Loading Locations":"Select Location",options:e._locations,loading:e._loadingLocations,modelValue:e.location,"onUpdate:modelValue":s[6]||(s[6]=a=>e.location=a),disabled:e._readOnly},null,8,["placeholder","options","loading","modelValue","disabled"]),o.v$.location.$invalid&&e.submitted||o.v$.location.$pending.$response?(d(),c("small",Fs,n(o.v$.location.required.$message.replace("Value","Location")),1)):p("",!0)])]),t("div",Ds,[t("div",Bs,[t("div",Ns,[t("div",Es,[t("label",As,n(e.$t(`${o.pageBase}.parameters`)),1)]),t("div",Ps,[u(R,{readOnly:e._readOnly,suggestions:l.suggestions,items:l.parametersF,"onUpdate:items":s[7]||(s[7]=a=>l.parametersF=a),requiredFields:l._requiredParams},null,8,["readOnly","suggestions","items","requiredFields"])])]),o.v$.parametersF.$invalid&&e.submitted||o.v$.parametersF.$pending.$response?(d(),c("small",Ks,n(o.v$.parametersF.required.$message.replace("Value","Parameters")),1)):p("",!0)])]),t("div",Us,[t("div",Rs,[t("label",js,n(e.$t(`${o.pageBase}.instancingMode`)),1),u(g,{id:"instancingMode",class:"w-full mb-2",optionValue:"id",optionLabel:"name",placeholder:"Select Instancing Mode",options:l.instancingModes,modelValue:e.instancingMode,"onUpdate:modelValue":s[8]||(s[8]=a=>e.instancingMode=a)},null,8,["options","modelValue"]),o.v$.instancingMode.$invalid&&e.submitted||o.v$.instancingMode.$pending.$response?(d(),c("small",Gs,n(o.v$.instancingMode.required.$message.replace("Value","Instancing Mode")),1)):p("",!0)])]),l.requiredIf_scheduleId?(d(),c("div",Js,[t("div",xs,[t("label",Hs,n(e.$t(`${o.pageBase}.scheduleId`)),1),u(g,{id:"scheduleId",class:"w-full mb-2",optionValue:"id",optionLabel:"name",placeholder:"Select Planner",options:e.schedules,modelValue:e.scheduleId,"onUpdate:modelValue":s[9]||(s[9]=a=>e.scheduleId=a)},null,8,["options","modelValue"]),o.v$.scheduleId.$invalid&&e.submitted||o.v$.scheduleId.$pending.$response?(d(),c("small",zs,n(o.v$.scheduleId.required.$message.replace("value","Schedule")),1)):p("",!0)])])):p("",!0),t("div",Ws,[t("div",Qs,[t("label",Xs,n(e.$t(`${o.pageBase}.stopAfterDisconnect`)),1),t("div",Ys,[u(m,{id:"stopAfterDisconnect",class:"",modelValue:e.stopAfterDisconnect,"onUpdate:modelValue":s[10]||(s[10]=a=>e.stopAfterDisconnect=a),readOnly:e._readOnly},null,8,["modelValue","readOnly"]),t("span",Zs,n(e.$t(`${o.pageBase}.minutes`)),1)]),o.v$.stopAfterDisconnect.$invalid&&e.submitted||o.v$.stopAfterDisconnect.$pending.$response?(d(),c("small",eo,n(o.v$.stopAfterDisconnect.required.$message.replace("Value","Stop After Disconnect")),1)):p("",!0)])]),t("div",so,[t("div",oo,[t("label",to,n(e.$t(`${o.pageBase}.estimatedProvisioningTime`)),1),t("div",io,[u(m,{id:"estimatedProvisioningTime",class:"",modelValue:e.estimatedProvisioningTime,"onUpdate:modelValue":s[11]||(s[11]=a=>e.estimatedProvisioningTime=a),readOnly:e._readOnly},null,8,["modelValue","readOnly"]),t("span",lo,n(e.$t(`${o.pageBase}.minutes`)),1)]),o.v$.estimatedProvisioningTime.$invalid&&e.submitted||o.v$.estimatedProvisioningTime.$pending.$response?(d(),c("small",no,n(o.v$.estimatedProvisioningTime.required.$message.replace("Value","Estimated Provisioning Time")),1)):p("",!0)])]),t("div",ao,[t("div",ro,[t("label",co,n(e.$t(`${o.pageBase}.poolMode`)),1),u(g,{id:"poolMode",class:"w-full mb-2",optionValue:"id",optionLabel:"name",placeholder:"Select Pool Mode",options:l.poolModes,modelValue:e.poolMode,"onUpdate:modelValue":s[12]||(s[12]=a=>e.poolMode=a),disabled:e._readOnly},null,8,["options","modelValue","disabled"]),o.v$.poolMode.$invalid&&e.submitted||o.v$.poolMode.$pending.$response?(d(),c("small",uo,n(o.v$.poolMode.required.$message.replace("Value","Pool Mode")),1)):p("",!0)])]),t("div",mo,[t("div",po,[t("label",go,n(e.$t(`${o.pageBase}.connectionMode`)),1),u(g,{id:"connectionMode",class:"w-full mb-2",optionValue:"id",optionLabel:"name",placeholder:"Select Connection Mode",options:l.connectionModes,modelValue:e.connectionMode,"onUpdate:modelValue":s[13]||(s[13]=a=>e.connectionMode=a),disabled:e._readOnly},null,8,["options","modelValue","disabled"]),o.v$.connectionMode.$invalid&&e.submitted||o.v$.connectionMode.$pending.$response?(d(),c("small",fo,n(o.v$.connectionMode.required.$message.replace("Value","Connection Mode")),1)):p("",!0)])]),t("div",ho,[t("div",vo,[t("label",_o,n(e.$t(`${o.pageBase}.maxInstancesCount`)),1),u(m,{id:"maxInstancesCount",class:"w-full mb-2",modelValue:e.maxInstancesCount,"onUpdate:modelValue":s[14]||(s[14]=a=>e.maxInstancesCount=a),readOnly:e._readOnly},null,8,["modelValue","readOnly"]),o.v$.maxInstancesCount.$invalid&&e.submitted||o.v$.maxInstancesCount.$pending.$response?(d(),c("small",yo,n(o.v$.maxInstancesCount.required.$message.replace("Value","Max Instances Count")),1)):p("",!0)])]),t("div",bo,[t("div",$o,[t("label",Io,n(e.$t(`${o.pageBase}.maxClientCount`)),1),u(m,{id:"maxClientCount",class:"w-full mb-2",modelValue:e.maxClientCount,"onUpdate:modelValue":s[15]||(s[15]=a=>e.maxClientCount=a),readOnly:e._readOnly},null,8,["modelValue","readOnly"]),o.v$.maxClientCount.$invalid&&e.submitted||o.v$.maxClientCount.$pending.$response?(d(),c("small",Vo,n(o.v$.maxClientCount.required.$message.replace("Value","Max Client Count")),1)):p("",!0)])])])])]),t("div",Co,[t("div",Mo,[t("div",Oo,[u(w,{label:e.$t("common.cancel"),icon:"pi pi-times",class:"p-button-secondary",disabled:e.saving,onClick:e.cancel},null,8,["label","disabled","onClick"])]),t("div",ko,[u(w,{label:e.$t("common.save"),icon:"pi pi-check",class:"p-button-success",loading:e.saving,onClick:l.save},null,8,["label","loading","onClick"])])])])])])])])])])}var Ao=k(Ue,[["render",To]]);export{Ao as default};