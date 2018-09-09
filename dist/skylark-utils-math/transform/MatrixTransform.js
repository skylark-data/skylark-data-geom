/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../math","./Transform","../Point","../Rect"],function(n,t,r,i,a){var o=t.MatrixTransform=r.inherit({klassName:"MatrixTransform",value:{get:function(){return this.matrix.clone()}},matrix:{get:function(){return this._.matrix}},clone:function(){},transform:function(n){},transformBounds:function(n){},initialize:function(n){var t=this._;t.matrix=n}});return o});
//# sourceMappingURL=../sourcemaps/transform/MatrixTransform.js.map
