/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../math","./Transform","./Matrix","../Point","../Rect"],function(n,t,r,a,i,e){var s=t.TranslateTransform=r.inherit({klassName:"TranslateTransform",value:{get:function(){return a.scaleAt(this.x,this.y)}},x:{get:function(){return this._.x}},y:{get:function(){return this._.y}},clone:function(){},transform:function(n){},transformBounds:function(n){},init:function(n,t){var r=this._;r.x=n?n:0,r.y=t?t:0}});return s;var s});
//# sourceMappingURL=../sourcemaps/transform/TranslateTransform.js.map
