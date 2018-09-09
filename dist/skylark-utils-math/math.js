/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-utils/skylark","skylark-utils/langx"],function(r,n){var a=r.math={log2:function(r){for(var n=1,a=0;r>n;)n<<=1,a++;return a}};return n.mixin(a,Math),a});
//# sourceMappingURL=sourcemaps/math.js.map
