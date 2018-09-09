/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
define(["skylark-langx/langx","./math","./Geometry"],function(t,n,i){var b=n.PolyStar=i.inherit({klassName:"PolyStar",bounds:{get:function(){var t=this._,n=t.points,i=n.length,b=n[0];bbox={l:b.x,t:b.y,r:b.x,b:b.y};for(var r=1;r<i;++r)b=n[r],bbox.l>b.x&&(bbox.l=b.x),bbox.r<b.x&&(bbox.r=b.x),bbox.t>b.y&&(bbox.t=b.y),bbox.b<b.y&&(bbox.b=b.y);var o={x:bbox.l,y:bbox.t,width:bbox.r-bbox.l,height:bbox.b-bbox.t};return o}},x:{get:function(){return this._.x}},y:{get:function(){return this._.y}},radius:{get:function(){return this._.radius}},sides:{get:function(){return this._.sides}},pointSize:{get:function(){return this._.pointSize}},angle:{get:function(){return this._.angle}},init:function(t,n,i,b,r,o){var e=this._;e.x=t,e.y=n,e.radius=i,e.sides=b,e.pointSize=r,e.angle=o}});return b});
//# sourceMappingURL=sourcemaps/PolyStar.js.map
