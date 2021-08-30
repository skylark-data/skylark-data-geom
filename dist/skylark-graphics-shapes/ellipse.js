/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./shapes","./geometry"],function(n,t,r){var i=t.Ellipse=r.inherit({klassName:"Ellipse",bounds:{get:function(){var n=this._;return{x:n.cx-n.rx,y:n.cy-n.ry,width:2*n.rx,height:2*n.ry}}},cx:{get:function(){return this._.cx}},cy:{get:function(){return this._.cy}},rx:{get:function(){return this._.rx}},ry:{get:function(){return this._.ry}},move:function(n,t){var r=this._;return new i(r.cx+n,r.cy+t,r.rx,r.ry)},containPoint:function(n){},init:function(n,t,r,i){var e=this._={};e.cx=n||0,e.cy=t||0,e.rx=r||0,e.ry=i||0}});return i});
//# sourceMappingURL=sourcemaps/ellipse.js.map
