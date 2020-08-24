define([
    "skylark-langx/langx",
    "./shapes",
    "./Geometry",
],function(langx, shapes, Geometry) {

    var Point = shapes.Point = Geometry.inherit({
        "klassName": "Point",
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
		"clone"	: function(){
			var _ = this._;
			return new Point(_.x,_.y);
		
		},
		"move"	: function(/*Number*/dx,/*Number*/dy) {
			var _ = this._;
			return new Point(_.x + dx,_.y + dy);
		},
		"notEqual"	:	function(/*Point*/p) {
			var _ = this._;
			return !p || p.x != _.x || p.y != _.y;
		},
		
		"equal"	:	function(/*Point*/p){
			return  !this.notEqual(p);
		},
		
        "init" : function(x, y) {
            var _ = this._ = {};
            _.x = x || 0;
            _.y = y || 0;
        }
	});
	
	Point.fromString = function(s) {
		var a = s.split(",");
		return new Point(parseFloat(a[0]),parseFloat(a[1]));
	};

	Point.fromPlain = function(o) {
		return new Point(o.x,o.y);
	};

	Point.fromArray = function(a) {
		return new Point(a[0],a[1]);
	};
	
	Point.Zero = new Point(0,0);

	return Point;
	
});	
