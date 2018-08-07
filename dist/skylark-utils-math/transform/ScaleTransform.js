/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../math","./Transform","./Matrix","../Point","../Rect"],function(n,t,e,r,c,s){var a=t.ScaleTransform=e.inherit({klassName:"ScaleTransform",value:{get:function(){return r.scaleAt(this.scaleX,this.scaleY,this.centerX,this.centerY)}},scaleX:{get:function(){return this._.scaleX}},scaleY:{get:function(){return this._.scaleY}},centerX:{get:function(){return this._.centerX}},centerY:{get:function(){return this._.centerY}},clone:function(){},transform:function(n){},transformBounds:function(n){},init:function(n,t,e,r){var c=this._;c.scaleX=n?n:1,c.scaleY=t?t:1,c.centerX=e?e:0,c.centerY=r?r:0}});return a});
//# sourceMappingURL=../sourcemaps/transform/ScaleTransform.js.map
