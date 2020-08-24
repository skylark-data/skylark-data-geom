/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./shapes","./Geometry","./Point"],function(t,i,n,e){var r={left:1,top:2,right:3,bottom:4},h=i.Arrow=n.inherit({klassName:"Arrow",bounds:{get:function(){var t=this._;return{x:t.x,y:this.y,width:t.width,height:t.height}}},x:{get:function(){return this._.x}},y:{get:function(){return this._.y}},width:{get:function(){return this._.width}},height:{get:function(){return this._.height}},direction:{get:function(){return this._.direction}},leftTop:{get:function(){var t=this._;return new e(t.x,t.y)}},leftBottom:{get:function(){var t=this._;return new e(t.x,t.y+t.height)}},rightTop:{get:function(){var t=this._;return new e(t.x+t.width,t.y)}},rightBottom:{get:function(){var t=this._;return new e(t.x+t.width,t.y+t.height)}},move:function(t,i){var n=this._;return new h(n.x+t,n.y+i,n.width,n.height,n.direction)},containPoint:function(t,i){if(void 0===i){var n=t;t=n.x,i=n.y}var e=this._;return t>=e.x&&t<e.x+e.width&&i>=e.y&&i<e.y+e.height},init:function(t,i,n,e,h){var o=this._={};o.x=t||0,o.y=i||0,o.width=n||0,o.height=e||0,o.direction=h||r.top}});return h.Direction=r,h});
//# sourceMappingURL=sourcemaps/Arrow.js.map
