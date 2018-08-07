/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.0-beta
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./math","./Geometry"],function(t,n,i){var r=n.Polyline=i.inherit({klassName:"Polyline",bounds:{get:function(){for(var t=this._,n=t.points,i=n.length,r=n[0],e={l:r.x,t:r.y,r:r.x,b:r.y},l=1;l<i;++l)r=n[l],e.l>r.x&&(e.l=r.x),e.r<r.x&&(e.r=r.x),e.t>r.y&&(e.t=r.y),e.b<r.y&&(e.b=r.y);var o={x:e.l,y:e.t,width:e.r-e.l,height:e.b-e.t};return o}},points:{get:function(){return this._.points}},init:function(t){var n=this._={};n.points=t?t:[]}});return r});
//# sourceMappingURL=sourcemaps/Polyline.js.map
