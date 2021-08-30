/**
 * skylark-graphics-shapes - The skylark shape class library.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./shapes","./geometry"],function(t,n,i){return n.Polyline=i.inherit({klassName:"Polyline",bounds:{get:function(){for(var t=this._.points,n=t.length,i=t[0],e={l:i.x,t:i.y,r:i.x,b:i.y},r=1;r<n;++r)i=t[r],e.l>i.x&&(e.l=i.x),e.r<i.x&&(e.r=i.x),e.t>i.y&&(e.t=i.y),e.b<i.y&&(e.b=i.y);return{x:e.l,y:e.t,width:e.r-e.l,height:e.b-e.t}}},points:{get:function(){return this._.points}},init:function(t){(this._={}).points=t||[]}})});
//# sourceMappingURL=sourcemaps/polyline.js.map
