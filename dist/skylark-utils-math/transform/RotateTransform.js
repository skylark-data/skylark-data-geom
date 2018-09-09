/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../math","./Transform","./Matrix","../Point","../Rect"],function(n,t,e,r,i,a){var o=t.RotateTransform=e.inherit({klassName:"RotateTransform",value:{get:function(){return r.rotateAt(this.angle,this.centerX,this.centerY)}},angle:{get:function(){return this._.angle}},centerX:{get:function(){return this._.centerX}},centerY:{get:function(){return this._.centerY}},clone:function(){},transform:function(n){},transformBounds:function(n){},init:function(n,t,e){var r=this._={};r.angle=n?n:0,r.centerX=t?t:0,r.centerY=e?e:0}});return o});
//# sourceMappingURL=../sourcemaps/transform/RotateTransform.js.map
