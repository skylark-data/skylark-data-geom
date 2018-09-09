/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./math","./Geometry"],function(r,t,n){var i=t.Circle=n.inherit({klassName:"Circle",bounds:{get:function(){var r=this._,t={x:r.cx-r.r,y:r.cy-r.r,width:2*r.r,height:2*r.r};return t}},cx:{get:function(){return this._.cx}},cy:{get:function(){return this._.cy}},r:{get:function(){return this._.r}},move:function(r,t){var n=this._;return new i(n.cx+r,n.cy+t,n.r)},containPoint:function(r,t){if(void 0===t){var n=r;r=n.x,t=n.y}var i=this._,e=(r-i.x)*(r-i.x)+(t-i.y)*(t-i.y);return e<i.r*i.r},init:function(r,t,n){var i=this._={};i.cx=r||0,i.cy=t||0,i.r=n||0}});return i});
//# sourceMappingURL=sourcemaps/Circle.js.map
