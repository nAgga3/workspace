import{R as O,r as z,i as A,o as s,c as a,F as m,e as b,w as _,k as C,n as u,a as h,t as p,g as T,j as g,h as y,Z as k,D as L,a2 as V,a3 as H,f as B,d as x,A as I,T as R,a4 as Z,l as N,b as D}from"../main.js";var S={name:"Menuitem",inheritAttrs:!1,emits:["click"],props:{item:null,template:null,exact:null},methods:{onClick(e,n){this.$emit("click",{originalEvent:e,item:this.item,navigate:n})},linkClass(e,n){return["p-menuitem-link",{"p-disabled":this.disabled(e),"router-link-active":n&&n.isActive,"router-link-active-exact":this.exact&&n&&n.isExactActive}]},visible(){return typeof this.item.visible=="function"?this.item.visible():this.item.visible!==!1},disabled(e){return typeof e.disabled=="function"?e.disabled():e.disabled},label(){return typeof this.item.label=="function"?this.item.label():this.item.label}},computed:{containerClass(){return["p-menuitem",this.item.class]}},directives:{ripple:O}};const M=["href","onClick"],F={class:"p-menuitem-text"},U=["href","target","tabindex"],W={class:"p-menuitem-text"};function j(e,n,i,c,r,t){const f=z("router-link"),l=A("ripple");return t.visible()?(s(),a("li",{key:0,class:u(t.containerClass),role:"none",style:g(i.item.style)},[i.template?(s(),b(T(i.template),{key:1,item:i.item},null,8,["item"])):(s(),a(m,{key:0},[i.item.to&&!t.disabled(i.item)?(s(),b(f,{key:0,to:i.item.to,custom:""},{default:_(({navigate:d,href:o,isActive:v,isExactActive:E})=>[C((s(),a("a",{href:o,onClick:w=>t.onClick(w,d),class:u(t.linkClass(i.item,{isActive:v,isExactActive:E})),role:"menuitem"},[h("span",{class:u(["p-menuitem-icon",i.item.icon])},null,2),h("span",F,p(t.label()),1)],10,M)),[[l]])]),_:1},8,["to"])):C((s(),a("a",{key:1,href:i.item.url,class:u(t.linkClass(i.item)),onClick:n[0]||(n[0]=(...d)=>t.onClick&&t.onClick(...d)),target:i.item.target,role:"menuitem",tabindex:t.disabled(i.item)?null:"0"},[h("span",{class:u(["p-menuitem-icon",i.item.icon])},null,2),h("span",W,p(t.label()),1)],10,U)),[[l]])],64))],6)):y("",!0)}S.render=j;var q={name:"Menu",emits:["show","hide"],inheritAttrs:!1,props:{popup:{type:Boolean,default:!1},model:{type:Array,default:null},appendTo:{type:String,default:"body"},autoZIndex:{type:Boolean,default:!0},baseZIndex:{type:Number,default:0},exact:{type:Boolean,default:!0}},data(){return{overlayVisible:!1}},target:null,outsideClickListener:null,scrollHandler:null,resizeListener:null,container:null,beforeUnmount(){this.unbindResizeListener(),this.unbindOutsideClickListener(),this.scrollHandler&&(this.scrollHandler.destroy(),this.scrollHandler=null),this.target=null,this.container&&this.autoZIndex&&k.clear(this.container),this.container=null},methods:{itemClick(e){const n=e.item;this.disabled(n)||(n.command&&n.command(e),n.to&&e.navigate&&e.navigate(e.originalEvent),this.hide())},toggle(e){this.overlayVisible?this.hide():this.show(e)},show(e){this.overlayVisible=!0,this.target=e.currentTarget},hide(){this.overlayVisible=!1,this.target=null},onEnter(e){this.alignOverlay(),this.bindOutsideClickListener(),this.bindResizeListener(),this.bindScrollListener(),this.autoZIndex&&k.set("menu",e,this.baseZIndex+this.$primevue.config.zIndex.menu),this.$emit("show")},onLeave(){this.unbindOutsideClickListener(),this.unbindResizeListener(),this.unbindScrollListener(),this.$emit("hide")},onAfterLeave(e){this.autoZIndex&&k.clear(e)},alignOverlay(){L.absolutePosition(this.container,this.target),this.container.style.minWidth=L.getOuterWidth(this.target)+"px"},bindOutsideClickListener(){this.outsideClickListener||(this.outsideClickListener=e=>{this.overlayVisible&&this.container&&!this.container.contains(e.target)&&!this.isTargetClicked(e)&&this.hide()},document.addEventListener("click",this.outsideClickListener))},unbindOutsideClickListener(){this.outsideClickListener&&(document.removeEventListener("click",this.outsideClickListener),this.outsideClickListener=null)},bindScrollListener(){this.scrollHandler||(this.scrollHandler=new V(this.target,()=>{this.overlayVisible&&this.hide()})),this.scrollHandler.bindScrollListener()},unbindScrollListener(){this.scrollHandler&&this.scrollHandler.unbindScrollListener()},bindResizeListener(){this.resizeListener||(this.resizeListener=()=>{this.overlayVisible&&this.hide()},window.addEventListener("resize",this.resizeListener))},unbindResizeListener(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)},isTargetClicked(e){return this.target&&(this.target===e.target||this.target.contains(e.target))},visible(e){return typeof e.visible=="function"?e.visible():e.visible!==!1},disabled(e){return typeof e.disabled=="function"?e.disabled():e.disabled},label(e){return typeof e.label=="function"?e.label():e.label},containerRef(e){this.container=e},onOverlayClick(e){H.emit("overlay-click",{originalEvent:e,target:this.target})}},computed:{containerClass(){return["p-menu p-component",{"p-menu-overlay":this.popup,"p-input-filled":this.$primevue.config.inputStyle==="filled","p-ripple-disabled":this.$primevue.config.ripple===!1}]}},components:{Menuitem:S}};const G={class:"p-menu-list p-reset",role:"menu"},J={key:0,class:"p-submenu-header"};function K(e,n,i,c,r,t){const f=z("Menuitem");return s(),b(Z,{to:i.appendTo,disabled:!i.popup},[B(R,{name:"p-connected-overlay",onEnter:t.onEnter,onLeave:t.onLeave,onAfterLeave:t.onAfterLeave},{default:_(()=>[!i.popup||r.overlayVisible?(s(),a("div",I({key:0,ref:t.containerRef,class:t.containerClass},e.$attrs,{onClick:n[0]||(n[0]=(...l)=>t.onOverlayClick&&t.onOverlayClick(...l))}),[h("ul",G,[(s(!0),a(m,null,x(i.model,(l,d)=>(s(),a(m,{key:t.label(l)+d.toString()},[l.items&&t.visible(l)&&!l.separator?(s(),a(m,{key:0},[l.items?(s(),a("li",J,[N(e.$slots,"item",{item:l},()=>[D(p(t.label(l)),1)])])):y("",!0),(s(!0),a(m,null,x(l.items,(o,v)=>(s(),a(m,{key:o.label+d+v},[t.visible(o)&&!o.separator?(s(),b(f,{key:0,item:o,onClick:t.itemClick,template:e.$slots.item,exact:i.exact},null,8,["item","onClick","template","exact"])):t.visible(o)&&o.separator?(s(),a("li",{class:u(["p-menu-separator",o.class]),style:g(o.style),key:"separator"+d+v,role:"separator"},null,6)):y("",!0)],64))),128))],64)):t.visible(l)&&l.separator?(s(),a("li",{class:u(["p-menu-separator",l.class]),style:g(l.style),key:"separator"+d.toString(),role:"separator"},null,6)):(s(),b(f,{key:t.label(l)+d.toString(),item:l,onClick:t.itemClick,template:e.$slots.item,exact:i.exact},null,8,["item","onClick","template","exact"]))],64))),128))])],16)):y("",!0)]),_:3},8,["onEnter","onLeave","onAfterLeave"])],8,["to","disabled"])}function Q(e,n){n===void 0&&(n={});var i=n.insertAt;if(!(!e||typeof document=="undefined")){var c=document.head||document.getElementsByTagName("head")[0],r=document.createElement("style");r.type="text/css",i==="top"&&c.firstChild?c.insertBefore(r,c.firstChild):c.appendChild(r),r.styleSheet?r.styleSheet.cssText=e:r.appendChild(document.createTextNode(e))}}var X=`
.p-menu-overlay {
    position: absolute;
    top: 0;
    left: 0;
}
.p-menu ul {
    margin: 0;
    padding: 0;
    list-style: none;
}
.p-menu .p-menuitem-link {
    cursor: pointer;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    text-decoration: none;
    overflow: hidden;
    position: relative;
}
.p-menu .p-menuitem-text {
    line-height: 1;
}
`;Q(X);q.render=K;export{q as s};
