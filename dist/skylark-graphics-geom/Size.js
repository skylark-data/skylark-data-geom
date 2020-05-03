/**
 * skylark-graphics-geom - The geom type library for skylark graphics.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./geom","./Geometry"],function(t,i,n){var e=i.Size=n.inherit({klassName:"Size",width:{get:function(){return this._.width}},height:{get:function(){return this._.height}},clone:function(){var t=this._;return new e(t.width,t.height)},toArray:function(){return[this.width,this.height]},toPlain:function(){return{width:this.width,height:this.height}},toString:function(){return this.width+","+this.height},init:function(t,i){var n=this._={};n.width=t||0,n.height=i||0}});return e.fromString=function(t){var i=t.split(",");return new e(parseFloat(i[0]),parseFloat(i[1]))},e.fromPlain=function(t){return new e(t.w||t.width,t.h||t.height)},e.fromArray=function(t){return new e(t[0],t[1])},e.Zero=new e(0,0),e});
//# sourceMappingURL=sourcemaps/Size.js.map
