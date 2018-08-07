/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./math","./Geometry"],function(t,n,r){var i=n.Ellipse=r.inherit({klassName:"Ellipse",bounds:{get:function(){var t=this._,n={x:t.cx-t.rx,y:t.cy-t.ry,width:2*t.rx,height:2*t.ry};return n}},cx:{get:function(){return this._.cx}},cy:{get:function(){return this._.cy}},rx:{get:function(){return this._.rx}},ry:{get:function(){return this._.ry}},move:function(t,n){var r=this._;return new i(r.cx+t,r.cy+n,r.rx,r.ry)},containPoint:function(t){},init:function(t,n,r,i){var e=this._={};e.cx=t||0,e.cy=n||0,e.rx=r||0,e.ry=i||0}});return i});
//# sourceMappingURL=sourcemaps/Ellipse.js.map
