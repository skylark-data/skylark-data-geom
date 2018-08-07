define([
    "skylark-langx/langx",
    "./math",
    "./Geometry",
],function(langx, math, Geometry) {

    var PolyStar = math.PolyStar = Geometry.inherit({
        "klassName": "PolyStar",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
				var _ = this._,
					p = _.points,
					l = p.length,
					t = p[0];
					bbox = {l: t.x, t: t.y, r: t.x, b: t.y};
				for(var i = 1; i < l; ++i){
					t = p[i];
					if(bbox.l > t.x) bbox.l = t.x;
					if(bbox.r < t.x) bbox.r = t.x;
					if(bbox.t > t.y) bbox.t = t.y;
					if(bbox.b < t.y) bbox.b = t.y;
				}
				var box = {
					x:		bbox.l,
					y:		bbox.t,
					width:	bbox.r - bbox.l,
					height:	bbox.b - bbox.t
				};
				return box;	
            }
        },
       "x": {
            get : function() {
                return this._.x;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y": {
            get : function() {
                return this._.y;
            }
        },
        "radius": {
            get : function() {
                return this._.radius;
            }
        },
        "sides": {
            get : function() {
                return this._.sides;
            }
        },
        "pointSize": {
            get : function() {
                return this._.pointSize;
            }
        },
        "angle": {
            get : function() {
                return this._.angle;
            }
         },
		"init"	:function(x, y, radius, sides, pointSize, angle){
			var _ = this._;
			_.x = x;
			_.y = y;
			_.radius = radius;
			_.sides = sides;
			_.pointSize = pointSize;
			_.angle = angle;
		}

	});
	
	
	return PolyStar;
	
});	
