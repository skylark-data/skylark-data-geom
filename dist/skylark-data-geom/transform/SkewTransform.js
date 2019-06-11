/**
 * skylark-data-geom - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../math","./Transform","./Matrix","../Point","../Rect"],function(n,t,e,s,r){return math.SkewTransform=t.inherit({klassName:"SkewTransform",value:{get:function(){return e.scaleAt(this.skewX,this.skewY)}},skewX:{get:function(){return this._.skewX}},skewY:{get:function(){return this._.skewY}},clone:function(){},transform:function(n){},transformBounds:function(n){},init:function(n,t){var e=this._;e.skewX=n||0,e.skewY=t||0}})});
//# sourceMappingURL=../sourcemaps/transform/SkewTransform.js.map
