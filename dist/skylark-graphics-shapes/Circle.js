/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./shapes","./Geometry"],function(r,n,t){var i=n.Circle=t.inherit({klassName:"Circle",bounds:{get:function(){var r=this._;return{x:r.cx-r.r,y:r.cy-r.r,width:2*r.r,height:2*r.r}}},cx:{get:function(){return this._.cx}},cy:{get:function(){return this._.cy}},r:{get:function(){return this._.r}},move:function(r,n){var t=this._;return new i(t.cx+r,t.cy+n,t.r)},containPoint:function(r,n){if(void 0===n){var t=r;r=t.x,n=t.y}var i=this._;return(r-i.x)*(r-i.x)+(n-i.y)*(n-i.y)<i.r*i.r},init:function(r,n,t){var i=this._={};i.cx=r||0,i.cy=n||0,i.r=t||0}});return i});
//# sourceMappingURL=sourcemaps/Circle.js.map
