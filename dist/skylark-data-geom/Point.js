/**
 * skylark-data-geom - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./math","./Geometry"],function(n,t,r){var e=t.Point=r.inherit({klassName:"Point",x:{get:function(){return this._.x}},y:{get:function(){return this._.y}},clone:function(){var n=this._;return new e(n.x,n.y)},move:function(n,t){var r=this._;return new e(r.x+n,r.y+t)},notEqual:function(n){var t=this._;return!n||n.x!=t.x||n.y!=t.y},equal:function(n){return!this.notEqual(n)},init:function(n,t){var r=this._={};r.x=n||0,r.y=t||0}});return e.fromString=function(n){var t=n.split(",");return new e(parseFloat(t[0]),parseFloat(t[1]))},e.fromPlain=function(n){return new e(n.x,n.y)},e.fromArray=function(n){return new e(n[0],n[1])},e.Zero=new e(0,0),e});
//# sourceMappingURL=sourcemaps/Point.js.map
