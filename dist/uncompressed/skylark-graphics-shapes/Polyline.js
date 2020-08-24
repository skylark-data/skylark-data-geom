define([
    "skylark-langx/langx",
    "./shapes",
    "./Geometry"
], function(langx, shapes, Geometry) {

    var Polyline = shapes.Polyline = Geometry.inherit({
        "klassName": "Polyline",

        "bounds": {
            get : function() {
                // summary:
                //      returns the bounding box
                var _ = this._,
					p = _.points,
					l = p.length,
					t = p[0],
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
		"points" : {
            get : function() {
                return this._.points;
            }
		},
		
		"init" : function(/*Array*/points) {
			//TODO: will be modified
			var _ = this._ = {};
			_.points = points?points:[];
		}
	});
	
	
	return Polyline;
	
});	
