/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./shapes","./geometry","./point"],function(t,n,i,e){var r=n.Line=i.inherit({klassName:"Line",bounds:{get:function(){var t=this._;return{x:Math.min(t.x1,t.x2),y:Math.min(t.y1,t.y2),width:Math.abs(t.x2-t.x1),height:Math.abs(t.y2-t.y1)}}},x1:{get:function(){return this._.x1}},y1:{get:function(){return this._.y1}},x2:{get:function(){return this._.x2}},y2:{get:function(){return this._.y2}},startPoint:{get:function(){var t=this._;return new e(t.x1,t.y1)}},endPointer:{get:function(){var t=this._;return new e(t.x2,t.y2)}},move:function(t,n){var i=this._;return new r(i.x1+t,i.y1+n,i.x2+t,i.y2+n)},containPoint:function(t,n){if(void 0===n){var i=t;t=i.x,n=i.y}var e=this._;return Math.abs((n-e.y1)*(e.x2-e.x1)-(e.y2-e.y1)*(t-e.x1))<1e-6},init:function(t,n,i,e){var r=this._={};r.x1=t||0,r.y1=n||0,r.x2=i||0,r.y2=e||0}});return r});
//# sourceMappingURL=sourcemaps/line.js.map
