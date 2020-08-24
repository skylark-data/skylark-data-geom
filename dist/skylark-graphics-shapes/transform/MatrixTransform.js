/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","../shapes","./Transform","../Point","../Rect"],function(n,t,i,r,a){return t.MatrixTransform=i.inherit({klassName:"MatrixTransform",value:{get:function(){return this.matrix.clone()}},matrix:{get:function(){return this._.matrix}},clone:function(){},transform:function(n){},transformBounds:function(n){},initialize:function(n){this._.matrix=n}})});
//# sourceMappingURL=../sourcemaps/transform/MatrixTransform.js.map
