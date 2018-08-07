/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../math","./Transform","./Matrix","../Point","../Rect"],function(n,t,e,r,s){var i=math.SkewTransform=t.inherit({klassName:"SkewTransform",value:{get:function(){return e.scaleAt(this.skewX,this.skewY)}},skewX:{get:function(){return this._.skewX}},skewY:{get:function(){return this._.skewY}},clone:function(){},transform:function(n){},transformBounds:function(n){},init:function(n,t){var e=this._;e.skewX=n?n:0,e.skewY=t?t:0}});return i});
//# sourceMappingURL=../sourcemaps/transform/SkewTransform.js.map
