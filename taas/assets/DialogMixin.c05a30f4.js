var s={data(){return{internal:{show:!1,resolve:null}}},methods:{emitResponse(e,t=!0,i=e){t&&this.$emit(i,e),this.internal.show=!1,this.internal.resolve&&this.internal.resolve(e)},async show(){return new Promise(e=>{this.internal.resolve=e,this.internal.show=!0})}}};export{s as D};