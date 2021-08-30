/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./shapes","./geometry"],function(t,i,n){var h=i.Size=n.inherit({klassName:"Size",width:{get:function(){return this._.width}},height:{get:function(){return this._.height}},clone:function(){var t=this._;return new h(t.width,t.height)},toArray:function(){return[this.width,this.height]},toPlain:function(){return{width:this.width,height:this.height}},toString:function(){return this.width+","+this.height},init:function(t,i){var n=this._={};n.width=t||0,n.height=i||0}});return h.fromString=function(t){var i=t.split(",");return new h(parseFloat(i[0]),parseFloat(i[1]))},h.fromPlain=function(t){return new h(t.w||t.width,t.h||t.height)},h.fromArray=function(t){return new h(t[0],t[1])},h.Zero=new h(0,0),h});
//# sourceMappingURL=sourcemaps/size.js.map
