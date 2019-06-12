/**
 * skylark-data-geom - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                resolved: false,
                exports: null
            };
            require(id);
        } else {
            map[id] = {
                factory : null,
                resolved : true,
                exports : factory
            };
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.resolved) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args) || null;
            module.resolved = true;
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-data-geom/geom',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark, langx) {
	
	var geom =  {

	  log2 : function (x) {
	    var n = 1, i = 0;
	    while (x > n) {
	      n <<= 1;
	      i++;
	    }
	    return i;
	  }

	};


	return skylark.attach("data.geom",geom);
});
define('skylark-data-geom/Geometry',[
    "skylark-langx/langx",
    "./geom"
],function(langx, geom) {
	var Geometry  = geom.Geometry = langx.klass({
		"klassName"	:	"Geometry",
	});


	return Geometry;

});

define('skylark-data-geom/Point',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry",
],function(langx, geom, Geometry) {

    var Point = geom.Point = Geometry.inherit({
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

define('skylark-data-geom/Arrow',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry",
    "./Point"
], function(langx, geom, Geometry, Point) {
    var Direction = {
        "left" : 1,
        "top" : 2,
        "right" : 3, 
        "bottom" : 4
    };

    var Arrow = geom.Arrow = Geometry.inherit({
        "klassName": "Arrow",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
                var 
                    _ = this._,
                    box = {
                    x: _.x,
                    y: this.y,
                    width: _.width,
                    height: _.height
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
        // width: Number
        //		The width of the default rectangle, value 100.
        "width": {
            get : function() {
                return this._.width;
            }
        },
        // height: Number
        //		The height of the default rectangle, value 100.
        "height": {
            get : function() {
                return this._.height;
            }
        },
        // r: Number
        //		The corner radius for the default rectangle, value 0.
        "direction": {
            get : function() {
                return this._.direction;
            }
        },
        "leftTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y);
            }
        },
        "leftBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y + _.height);
            }
        },
        "rightTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y);
            }
        },
        "rightBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y + _.height);
            }
        },
        "move": function(dx, dy) {
            var _ = this._;
            return new Arrow(_.x + dx,_.y + dy,_.width,_.height,_.direction);
        },
        "containPoint": function(x,y) {
            // support function(p)
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;

            return (x >= _.x) && (x < _.x + _.width) && (y >= _.y) && (y < _.y + _.height);
        },
        "init" : function(x, y, width, height, direction) {
            var _ = this._ = {};
            _.x = x || 0;
            _.y = y || 0;
            _.width = width || 0;
            _.height = height || 0;
            _.direction = direction || Direction.top;
        }
    });

    Arrow.Direction = Direction;

    return Arrow;
});

define('skylark-data-geom/Circle',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry"
], function(langx, geom, Geometry) {

    var Circle = geom.Circle = Geometry.inherit({
        "klassName": "Circle",

        "bounds": {
            get : function() {
                // summary:
                //      returns the bounding box
                var _ = this._,
                    box = {
                        x: _.cx - _.r,
                        y: _.cy - _.r,
                        width: 2 * _.r,
                        height: 2 * _.r
                    };
                return box;
            }
        },

        // cx: Number
        //		The X coordinate of the center of the circle, default value 0.
        "cx": {
            get : function() {
                return this._.cx;
            }
        },
        // cy: Number
        //		The Y coordinate of the center of the circle, default value 0.
        "cy": {
            get : function() {
                return this._.cy;
            }
        },
        // r: Number
        //		The radius, default value 100.
        "r": {
            get : function() {
                return this._.r;
            }
        },
        move: function(dx, dy) {
            var _ = this._;            
            return new Circle(_.cx + dx,_.cy + dy,_.r);
        },
        containPoint: function(x,y) {
            // support function(p)
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;

            var diff = (x - _.x) * (x - _.x) + (y - _.y) * (y - _.y);
            if (diff < _.r * _.r) {
                return true;
            }
            return false;
        },
        "init" : function(cx, cy, r) {
            var _ = this._ = {};
            _.cx = cx || 0;
            _.cy = cy || 0;
            _.r = r || 0;
        }

    });

    return Circle;
});

define('skylark-data-geom/Ellipse',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry",
], function(langx, geom, Geometry) {

    var Ellipse = geom.Ellipse = Geometry.inherit({
        "klassName": "Ellipse",

        "bounds": {
            get : function() {
                // summary:
                //      returns the bounding box
                var _ = this._,
                    box = {
                        x: _.cx - _.rx,
                        y: _.cy - _.ry,
                        width: 2 * _.rx,
                        height: 2 * _.ry
                    };
                return box;
            }
        },

        // cx: Number
        //		The X coordinate of the center of the ellipse, default value 0.
        "cx": {
            get : function() {
                return this._.cx;
            }
        },
        // cy: Number
        //		The Y coordinate of the center of the ellipse, default value 0.
        "cy": {
            get : function() {
                return this._.cy;
            }
        },
        // rx: Number
        //		The radius of the ellipse in the X direction, default value 200.
        "rx": {
            get : function() {
                return this._.rx;
            }
        },
        // ry: Number
        //		The radius of the ellipse in the Y direction, default value 200.
        "ry": {
            get : function() {
                return this._.ry;
            }
        },
        "move": function(dx, dy) {
            var _ = this._;            
            return new Ellipse(_.cx + dx,_.cy + dy,_.rx,_.ry);
        },

        "containPoint": function(p) {
        },

        "init" :  function(cx, cy, rx, ry) {
            var _ = this._ = {};
            _.cx = cx || 0;
            _.cy = cy || 0;
            _.rx = rx || 0;
            _.ry = ry || 0;
        }
    });

    return Ellipse;
});

/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define('skylark-data-geom/Line',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry",
    "./Point"
], function(langx, geom, Geometry, Point) {

    var Line = geom.Line = Geometry.inherit({
        "klassName": "Line",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
                var 
                    _ = this._,
                    box = {
						x:		Math.min(_.x1, _.x2),
						y:		Math.min(_.y1, _.y2),
						width:	Math.abs(_.x2 - _.x1),
						height:	Math.abs(_.y2 -_.y1)
	                };
                return box;
            }
        },
       "x1": {
            get : function() {
                return this._.x1;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y1": {
            get : function() {
                return this._.y1;
            }
        },
        "x2": {
            get : function() {
                return this._.x2;
            }
        },
        "y2": {
            get : function() {
                return this._.y2;
            }
        },

		"startPoint" :{
			get : function(){
				var _ = this._;
				return new Point(_.x1,_.y1);
			}
		},
		"endPointer" :{
			get : function(){
				var _ = this._;
				return new Point(_.x2,_.y2);
			}
		},
			
		move	: function(dx,dy) {
			var _ = this._;
			return new Line(_.x1+dx,_.y1+dy,_.x2+dx,_.y2+dy);
		},

		containPoint : function(x,y) {
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;
		
    		return Math.abs((y-_.y1)*(_.x2-_.x1) - (_.y2-_.y1)*(x-_.x1)) < 1e-6;

		},

        "init" : function(x1, y1, x2,y2) {
            var _ = this._ = {};
            _.x1 = x1 || 0;
            _.y1 = y1 || 0;
            _.x2 = x2 || 0;
            _.y2 = y2 || 0;
        }
	});
	
	
	return Line;
	
});	

define('skylark-data-geom/Polyline',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry"
], function(langx, geom, Geometry) {

    var Polyline = geom.Polyline = Geometry.inherit({
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

define('skylark-data-geom/PolyStar',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry",
],function(langx, geom, Geometry) {

    var PolyStar = geom.PolyStar = Geometry.inherit({
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

define('skylark-data-geom/Size',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry"
],function(langx,geom,Geometry) {

    var Size = geom.Size = Geometry.inherit({
        "klassName": "Size",
		// width: Number
		//		The width of the default rectangle, value 100.
		"width" : {
			get : function() {
				return this._.width;
			}
		},
		// height: Number
		//		The height of the default rectangle, value 100.
		"height" : {
			get : function() {
				return this._.height;
			}
		},

		"clone"	: function(){
			var _ = this._;
			return new Size(_.width,_.height);
		},

        "toArray" : function() {
            return [this.width,this.height];
        },

        "toPlain" : function() {
            return {
                "width"  : this.width,
                "height"  : this.height
            };
        },
        "toString": function() {
        	return this.width +"," + this.height;
        },

        "init" : function(width,height) {
        	var _ = this._ = {};
        	_.width = width || 0;
        	_.height = height || 0;
        }
	});
	
	Size.fromString = function(s) {
		var a = s.split(",");
		return new Size(parseFloat(a[0]),parseFloat(a[1]));
	};

	Size.fromPlain = function(o) {
		return new Size(o.w || o.width,o.h || o.height);
	};

	Size.fromArray = function(a) {
		return new Size(a[0],a[1]);
	};

	Size.Zero = new Size(0,0);
	
	return Size;
	
});	

define('skylark-data-geom/Rect',[
    "skylark-langx/langx",
    "./geom",
    "./Geometry",
    "./Point",
	"./Size"
],function(langx, geom, Geometry,Point,Size) {

    var Rect = geom.Rect = Geometry.inherit({
        "klassName": "Rect",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
                var 
                    _ = this._,
                    box = {
                    x: _.x,
                    y: this.y,
                    width: _.width,
                    height: _.height
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
        // width: Number
        //		The width of the default rectangle, value 100.
        "width": {
            get : function() {
                return this._.width;
            }
        },
        // height: Number
        //		The height of the default rectangle, value 100.
        "height": {
            get : function() {
                return this._.height;
            }
        },
        // r: Number
        //		The corner radius for the default rectangle, value 0.
        "radius": {
            get : function() {
                return this._.radius;
            }
        },
        "leftTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y);
            }
        },
        "leftBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y + _.height);
            }
        },
        "rightTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y);
            }
        },
        "rightBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y + _.height);
            }
        },

        "size": {
            get: function() {
                var _ = this._;
                return new Size(_.width, _.height);
            }
        },

        "move": function(dx, dy) {
            var _ = this._;
            return new Rect(_.x + dx,_.y + dy,_.width,_.height,_.radius);
        },

        "containPoint": function(x,y) {
            // support function(p)
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;

            return (x >= _.x) && (x < _.x + _.width) && (y >= _.y) && (y < _.y + _.height);
        },

		"isEmpty"	:	function(){
			return this.width <=0 || this.height<=0;
		},
		
		"notEqual"	:	function(/*Rect*/r) {
			return !r || r.x != this.x || r.y != this.y || r.width != this.width || r.height != this.height || r.radius != this.radius;
		},
		
		"equal"	:	function(/*Rect*/r){
			return  !this.notEqual(r);
		},
		
		"isIntersect"	:function(/*Number*/x2,/*Number*/y2,/*Number*/width2,/*Number*/height2){
			var x1 = this.x1,y1=this.y,width1=this.width,height1=this.height;
			 
		    return (Math.min(x1 + width1, x2 + width2) - (x1 > x2 ? x1 : x2)) > 0 &&
		           (Math.min(y1 + height1, y2 + height2) - (y1 > y2 ? y1 : y2)) > 0;
		},
		
		"intersect"	:	function(/*Number*/x2,/*Number*/y2,/*Number*/width2,/*Number*/height2){
			var x1 = this.x1,y1=this.y,width1=this.width,height1=this.height;
			 
		    return (Math.min(x1 + width1, x2 + width2) - (x1 > x2 ? x1 : x2)) > 0 &&
		           (Math.min(y1 + height1, y2 + height2) - (y1 > y2 ? y1 : y2)) > 0;
		},
						
		"unite"	: function(/*Number*/x2,/*Number*/y2,/*Number*/width2,/*Number*/height2){
			var x1 = this.x1,y1=this.y,width1=this.width,height1=this.height;
			 
			var x = x1 < x2 ? x1 : x2,
				y = y1 < y2 ? y1 : y2,
				width  = Math.max(x1 + width1, x2 + width2) - x;
				height = Math.max(y1 + height1, y2 + height2) - y;
		    
		    return new Rect(x,y,width,height);
		},
		
		"clone"	: function(){
			var _ = this._;
			return new Rect(_.x,_.y,_.width,_.height,_.radius);
		},

        "init" : function(x, y, width, height, radius) {
            var _ = this._ = {};
            _.x = x || 0;
            _.y = y || 0;
            _.width = width || 0;
            _.height = height || 0;
            _.radius = radius || 0;
        }
    });


	Rect.fromString = function(s) {
		var a = s.split(",");
		return new Rect(parseFloat(a[0]),parseFloat(a[1]),parseFloat(a[2]),parseFloat(a[3]));
	};

	Rect.fromPlain = function(o) {
		return new Rect(o.x || o.l,o.y || o.t, o.w || o.width,o.h || o.height);
	};

	Rect.fromArray = function(a) {
		return new Rect(a[0],a[1],a[2],a[3]);
	};
	
	Rect.Zero = new Rect(0,0,0,0);
	
	return Rect;
	
});	

define( 'skylark-data-geom/transform/Matrix',[
    "skylark-langx/langx",
    "../geom",
], function(langx,geom){
	// reference easeljs/geom/Matrix2D  and dojox/gfx/matrix
	
	var DEG_TO_RAD = Math.PI/180;
	var _degToRadCache = {};
	var degToRad = function(degree){
		return _degToRadCache[degree] || (_degToRadCache[degree] = (Math.PI * degree / 180));
	};
	var radToDeg = function(radian){ return radian / Math.PI * 180; };
	

	//Represents a 3 x 3 affine transformation matrix used for transformation in 2-D space.
	//|----------|
	//|m11|m21|dx| 
	//|----------|
	//|m12|m22|dy|
	//|----------|
	//|  0|  0| 1|
	//|----------|
	
    var Matrix = geom.TransformMatrix = langx.klass({
        "klassName": "TransformMatrix",

		"_multiplyPoint"	: 	function(p){
			// summary:
			//		applies the matrix to a point
			// p: Point
			//		a point
			// returns: Point
			var _ = this._,
				x = p.x * _.m11 + p.y * _.m21  + _.dx,
			    y = p.x * _.m12 +  p.y * _.m22 + _.dy;
			return new Point(x,y); // Point
		},

       "m11": {
       		//Position (0, 0) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m11;
            }
        },

       "m12": {
       		//Position (0, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m12;
            }
        },

       "m21": {
       		//Position (1, 0) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m21;
            }
        },

       "m22": {
       		//Position (1, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m22;
            }
        },

       "dx": {
       		// Position (2, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.dx;
            }
        },

       "dy": {
       		// Position (2, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.dy;
            }
        },

       "alpha": {
       		// Property representing the alpha that will be applied to a display object. This is not part of matrix
       		// operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values.
            get : function() {
                return this._.alpha;
            }
        },

       "shadow": {
       		// Property representing the shadow that will be applied to a display object. This is not part of matrix
       		// operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values..
            get : function() {
                return this._.shadow;
            }
        },

       "compositeOperation": {
			/**
			 * Property representing the compositeOperation that will be applied to a display object. This is not part of
			 * matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated
			 * compositeOperation values. You can find a list of valid composite operations at:
			 * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
			 * @property compositeOperation
			 * @type String
			 **/
            get : function() {
                return this._.compositeOperation;
            }
        },

        //Converts the specified point with Matrix and returns the result.
		multiplyPoint: /*Point*/function(/*Point */ p){
			// summary:
			//		applies the matrix to a point
			return this._multiplyPoint(p); // Point
		},
				/**
				 * 指定した矩形を Matrix で変換し、その結果を返します。
				 */
		multiplyRectangle: /*Rect*/function(/*Rect*/ rect){
			// summary:
			//		Applies the matrix to a rectangle.
			// returns: Rect
			if(this.isIdentity())
				return rect.clone(); // Rect
			var p0 = this.multiplyPoint(rect.leftTop),
				p1 = this.multiplyPoint(rect.leftBottom),
				p2 = this.multiplyPoint(rect.right),
				p3 = this.multiplyPoint(rect.rightBottom),
				minx = Math.min(p0.x, p1.x, p2.x, p3.x),
				miny = Math.min(p0.y, p1.y, p2.y, p3.y),
				maxx = Math.max(p0.x, p1.x, p2.x, p3.x),
				maxy = Math.max(p0.y, p1.y, p2.y, p3.y);
			return new Rect(minx,miny,maxx-minx,maxy-miny);  // Rect
		},
		/**
		 * Concatenates the specified matrix properties with this matrix. All parameters are required.
		 * @method prepend
		 * @param {Number} m11
		 * @param {Number} m12
		 * @param {Number} m21
		 * @param {Number} m22
		 * @param {Number} dx
		 * @param {Number} dy
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		prepend : function(m11, m12, m21, m22, dx, dy) {
			var tx1 = this.dx;
			if (m11 != 1 || m12 != 0 || m21 != 0 || m22 != 1) {
				var a1 = this.m11;
				var c1 = this.m21;
				this.m11  = a1*m11+this.m12*m21;
				this.m12  = a1*m12+this.m12*m22;
				this.m21  = c1*m11+this.m22*m21;
				this.m22  = c1*m12+this.m22*m22;
			}
			this.dx = tx1*m11+this.dy*m21+dx;
			this.dy = tx1*m12+this.dy*m22+dy;
			return this;
		},

		/**
		 * Appends the specified matrix properties with this matrix. All parameters are required.
		 * 指定した Matrixをこの Matrixに追加します。
		 * @method append
		 * @param {Number} m11
		 * @param {Number} m12
		 * @param {Number} m21
		 * @param {Number} m22
		 * @param {Number} dx
		 * @param {Number} dy
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		append : function(m11, m12, m21, m22, dx, dy) {
			var a1 = this.m11;
			var b1 = this.m12;
			var c1 = this.m21;
			var d1 = this.m22;

			this.m11  = m11*a1+m12*c1;
			this.m12  = m11*b1+m12*d1;
			this.m21  = m21*a1+m22*c1;
			this.m22  = m21*b1+m22*d1;
			this.dx = dx*a1+dy*c1+this.dx;
			this.dy = dx*b1+dy*d1+this.dy;
			return this;
		},

		/**
		 * Prepends the specified matrix with this matrix.
		 * @method prependMatrix
		 * @param {Matrix} matrix
		 **/
		prependMatrix : function(matrix) {
			this.prepend(matrix.m11, matrix.m12, matrix.m21, matrix.m22, matrix.dx, matrix.dy);
			this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
			return this;
		},

		/**
		 * Appends the specified matrix with this matrix.
		 * 指定した Matrixをこの Matrixに追加します。
		 * @method appendMatrix
		 * @param {Matrix} matrix
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		appendMatrix : function(matrix) {
			this.append(matrix.m11, matrix.m12, matrix.m21, matrix.m22, matrix.dx, matrix.dy);
			this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
			return this;
		},

		/**
		 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
		 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix();
		 * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
		 * @method prependTransform
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} scaleX
		 * @param {Number} scaleY
		 * @param {Number} rotation
		 * @param {Number} skewX
		 * @param {Number} skewY
		 * @param {Number} regX Optional.
		 * @param {Number} regY Optional.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		prependTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
			if (rotation%360) {
				var r = rotation*DEG_TO_RAD;
				var cos = Math.cos(r);
				var sin = Math.sin(r);
			} else {
				cos = 1;
				sin = 0;
			}

			if (regX || regY) {
				// append the registration offset:
				this.dx -= regX; this.dy -= regY;
			}
			if (skewX || skewY) {
				// TODO: can this be combined into a single prepend operation?
				skewX *= DEG_TO_RAD;
				skewY *= DEG_TO_RAD;
				this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
				this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			} else {
				this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
			}
			return this;
		},

		/**
		 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
		 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix();
		 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
		 * @method appendTransform
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} scaleX
		 * @param {Number} scaleY
		 * @param {Number} rotation
		 * @param {Number} skewX
		 * @param {Number} skewY
		 * @param {Number} regX Optional.
		 * @param {Number} regY Optional.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		appendTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
			if (rotation%360) {
				var r = rotation*DEG_TO_RAD;
				var cos = Math.cos(r);
				var sin = Math.sin(r);
			} else {
				cos = 1;
				sin = 0;
			}

			if (skewX || skewY) {
				// TODO: can this be combined into a single append?
				skewX *= DEG_TO_RAD;
				skewY *= DEG_TO_RAD;
				this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
				this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			} else {
				this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
			}

			if (regX || regY) {
				// prepend the registration offset:
				this.dx -= regX*this.m11+regY*this.m21; 
				this.dy -= regX*this.m12+regY*this.m22;
			}
			return this;
		},

		/**
		 * Applies a rotation transformation to the matrix.
		 * この Matrix の原点を中心とする指定した角度の回転を適用します。
		 * @method rotate
		 * @param {Number} angle The angle in degrees.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		rotate : function(angle) {
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var a1 = this.m11;
			var c1 = this.m21;
			var tx1 = this.dx;

			this.m11 = a1*cos-this.m12*sin;
			this.m12 = a1*sin+this.m12*cos;
			this.m21 = c1*cos-this.m22*sin;
			this.m22 = c1*sin+this.m22*cos;
			this.dx = tx1*cos-this.dy*sin;
			this.dy = tx1*sin+this.dy*cos;
			return this;
		},

		/**
		 * Applies a skew transformation to the matrix.
		 * @method skew
		 * @param {Number} skewX The amount to skew horizontally in degrees.
		 * @param {Number} skewY The amount to skew vertically in degrees.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		skew : function(skewX, skewY) {
			skewX = skewX*DEG_TO_RAD;
			skewY = skewY*DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
			return this;
		},

		/**
		 * Applies a scale transformation to the matrix.
		 * @method scale
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		scale : function(x, y) {
			this.m11 *= x;
			this.m22 *= y;
			this.dx *= x;
			this.dy *= y;
			return this;
		},

		/**
		 * Translates the matrix on the x and y axes.
		 * @method translate
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		translate : function(x, y) {
			this.dx += x;
			this.dy += y;
			return this;
		},

		/**
		 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
		 * @method identity
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		identity : function() {
			this.alpha = this.m11 = this.m22 = 1;
			this.m12 = this.m21 = this.dx = this.dy = 0;
			this.shadow = this.compositeOperation = null;
			return this;
		},

		/**
		 * Inverts the matrix, causing it to perform the opposite transformation.
		 * @method invert
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		invert : function() {
			var a1 = this.m11;
			var b1 = this.m12;
			var c1 = this.m21;
			var d1 = this.m22;
			var tx1 = this.dx;
			var n = a1*d1-b1*c1;

			this.m11 = d1/n;
			this.m12 = -b1/n;
			this.m21 = -c1/n;
			this.m22 = a1/n;
			this.dx = (c1*this.dy-d1*tx1)/n;
			this.dy = -(a1*this.dy-b1*tx1)/n;
			return this;
		},

		/**
		 * Returns true if the matrix is an identity matrix.
		 * @method isIdentity
		 * @return {Boolean}
		 **/
		isIdentity : function() {
			return this.dx == 0 && this.dy == 0 && this.m11 == 1 && this.m12 == 0 && this.m21 == 0 && this.m22 == 1;
		},

		/**
		 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
		 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
		 * results.
		 * @method decompose
		 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		decompose : function(target) {
			// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
			// even when scale is negative
			if (target == null) { target = {}; }
			target.x = this.dx;
			target.y = this.dy;
			target.scaleX = Math.sqrt(this.m11 * this.m11 + this.m12 * this.m12);
			target.scaleY = Math.sqrt(this.m21 * this.m21 + this.m22 * this.m22);

			var skewX = Math.atan2(-this.m21, this.m22);
			var skewY = Math.atan2(this.m12, this.m11);

			if (skewX == skewY) {
				target.rotation = skewY/DEG_TO_RAD;
				if (this.m11 < 0 && this.m22 >= 0) {
					target.rotation += (target.rotation <= 0) ? 180 : -180;
				}
				target.skewX = target.skewY = 0;
			} else {
				target.skewX = skewX/DEG_TO_RAD;
				target.skewY = skewY/DEG_TO_RAD;
			}
			return target;
		},

		/**
		 * Reinitializes all matrix properties to those specified.
		 * @method appendProperties
		 * @param {Number} m11
		 * @param {Number} m12
		 * @param {Number} m21
		 * @param {Number} m22
		 * @param {Number} dx
		 * @param {Number} dy
		 * @param {Number} alpha desired alpha value
		 * @param {Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		reinitialize : function(m11,m12,m21,m22,dx,dy,alpha,shadow,compositeOperation) {
			this._initialize(m11,m12,m21,m22,dx,dy);
			this.alpha = alpha || 1;
			this.shadow = shadow;
			this.compositeOperation = compositeOperation;
			return this;
		},

		/**
		 * Appends the specified visual properties to the current matrix.
		 * @method appendProperties
		 * @param {Number} alpha desired alpha value
		 * @param {Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		appendProperties : function(alpha, shadow, compositeOperation) {
			this.alpha *= alpha;
			this.shadow = shadow || this.shadow;
			this.compositeOperation = compositeOperation || this.compositeOperation;
			return this;
		},

		/**
		 * Prepends the specified visual properties to the current matrix.
		 * @method prependProperties
		 * @param {Number} alpha desired alpha value
		 * @param {Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		prependProperties : function(alpha, shadow, compositeOperation) {
			this.alpha *= alpha;
			this.shadow = this.shadow || shadow;
			this.compositeOperation = this.compositeOperation || compositeOperation;
			return this;
		},

		/**
		 *Multiply Matrix by another Matrix.
		 */
		multiply: function(matrix){
			// summary:
			//		combines matrices by multiplying them sequentially in the given order
			// matrix: Matrix
			//		a 2D matrix-like object,
			//		all subsequent arguments are matrix-like objects too

			// combine matrices
			var m11 = this.m11,m12 = this.m12,m21 = this.m21,m22=this.m22,dx=this.dx,dy=this.dy;
			var r = matrix;
			this.m11 = m11 * r.m11 + m21 * r.m12;
			this.m12 = m12 * r.m11 + m22 * r.m12;
			this.m21 = m11 * r.m21 + m21 * r.m22;
			this.m22 = m12 * r.m21 + m22 * r.m22;
			this.dx =  m11 * r.dx + m21 * r.dy + dx;
			this.dy =  m12 * r.dx + m22 * r.dy + dy;
			return this // Matrix
		},

		/**
		 * Returns a clone of the Matrix instance.
		 * @method clone
		 * @return {Matrix} a clone of the Matrix instance.
		 **/
		clone : function() {

			var _ = this._,
				mtx = new Matrix(_.m11, _.m12, _.m21, _.m22, _.dx, _.dy);
			mtx.shadow = this.shadow;
			mtx.alpha = this.alpha;
			mtx.compositeOperation = this.compositeOperation;
			return mtx;
		},

		/**
		 * Returns a string representation of this object.
		 * @method toString
		 * @return {String} a string representation of the instance.
		 **/
		toString : function() {
			var _ = this._;
			return "[Matrix (m11="+_.m11+" m12="+_.m12+" m21="+_.m21+" m22="+_.m22+" dx="+_.dx+" dy="+_.dy+")]";
		},
		
		"init" : function(m11, m12, m21, m22, dx, dy) {
			var _ = this._;
			_.m11 = m11 || 1;
			_.m12 = m12 || 0;
			_.m21 = m21 || 0;
			_.m22 = m22 || 1;
			_.dx = dx || 0;
			_.dy = dy || 0;
		}

	});
	
	langx.mixin(Matrix,{
		translate: function(a, b){
			// summary:
			//		forms a translation matrix
			// description:
			//		The resulting matrix is used to translate (move) points by specified offsets.
			// a: Number
			//		an x coordinate value
			// b: Number
			//		a y coordinate value
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1|   0| a|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   1| b|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|

			return new Matrix(1,0,0,1,a,b); // Matrix
		},
		scale: function(a, b){
			// summary:
			//		forms a scaling matrix
			// description:
			//		The resulting matrix is used to scale (magnify) points by specified offsets.
			// a: Number
			//		a scaling factor used for the x coordinate
			// b: Number?
			//		a scaling factor used for the y coordinate
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  a|   0| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   b| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			return new Matrix(a,0,0,b?b:a,0,0); // Matrix
		},
		rotate: function(angle){
			// summary:
			//		forms a rotating matrix
			// description:
			//		The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		an angle of rotation in radians (>0 for CW)
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |cos|-sin| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |sin| cos| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			return new Matrix(cos,sin,-sin,cos,0,0); // Matrix
		},
		rotateg: function(degree){
			// summary:
			//		forms a rotating matrix
			// description:
			//		The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified degree.
			//		Seerotate() for comparison.
			// degree: Number
			//		an angle of rotation in degrees (>0 for CW)
			// returns: Matrix
			return this.rotate(degToRad(degree)); // Matrix
		},
		skewX: function(angle) {
			//TODO : will be modified
			// summary:
			//		forms an x skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		a skewing angle in radians
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1| tan| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   1| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var tan = Math.tan(angle);
			return new Matrix(1,0,tan,1); // Matrix
		},
		skewXg: function(degree){
			//TODO : will be modified
			// summary:
			//		forms an x skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See dojox/gfx/matrix.skewX() for comparison.
			// degree: Number
			//		a skewing angle in degrees
			// returns: Matrix
			return this.skewX(degToRad(degree)); // dojox/gfx/matrix.Matrix
		},
		skewY: function(angle){
			//TODO : will be modified
			// summary:
			//		forms a y skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		a skewing angle in radians
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1|   0| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |tan|   1| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var tan = Math.tan(angle);

			return new Matrix(1,tan,0,1); // Matrix
		},
		skewYg: function(degree){
			//TODO : will be modified
			// summary:
			//		forms a y skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See skewY() for comparison.
			// degree: Number
			//		a skewing angle in degrees
			// returns: Matrix
			return this.skewY(degToRad(degree)); // Matrix
		},
		reflect: function(a, b){
			// summary:
			//		forms a reflection matrix
			// description:
			//		The resulting matrix is used to reflect points around a vector,
			//		which goes through the origin.
			// a: dojox/gfx.Point|Number
			//		a point-like object, which specifies a vector of reflection, or an X value
			// b: Number?
			//		a Y value
			// returns: Matrix
			if(arguments.length == 1){
				b = a.y;
				a = a.x;
			}
			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, 
				xx=2 * a2 / n2 - 1, 
				xy = 2 * a * b / n2,
				yx = xy,
				yy = 2 * b2 / n2 - 1;
			return new Matrix(xx,yx,xy, yy); // Matrix
		},
		project: function(a, b){
			// summary:
			//		forms an orthogonal projection matrix
			// description:
			//		The resulting matrix is used to project points orthogonally on a vector,
			//		which goes through the origin.
			// a:   Number
			//		an x coordinate value
			// b: Number?
			//		a y coordinate value
			// returns: Matrix

			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, 
				xx = a2 / n2,
				xy = a * b / n2
				yx = xy,
				yy = b2 / n2;
			return new Matrix(xx,yx,xy,yy); // Matrix
		},

		// common operations

		// high level operations

		_sandwich: function(matrix, x, y){
			// summary:
			//		applies a matrix at a central point
			// matrix: Matrix
			//		a 2D matrix-like object, which is applied at a central point
			// x: Number
			//		an x component of the central point
			// y: Number
			//		a y component of the central point
			return this.translate(x, y).multiply(matrix)
			                           .multiply(this.translate(-x, -y)); // Matrix
		},
		scaleAt: function(a, b, c, d){
			// summary:
			//		scales a picture using a specified point as a center of scaling
			// description:
			//		Compare with scale().
			// a: Number
			//		a scaling factor used for the x coordinate, or a uniform scaling factor used for both coordinates
			// b: Number?
			//		a scaling factor used for the y coordinate
			// c: Number|Point
			//		an x component of a central point, or a central point
			// d: Number
			//		a y component of a central point
			// returns: Matrix
			switch(arguments.length){
				case 4:
					// a and b are scale factor components, c and d are components of a point
					return this._sandwich(this.scale(a, b), c, d); // Matrix
				case 3:
					if(typeof c == "number"){
						return this._sandwich(this.scale(a), b, c); // Matrix
					}
					return this._sandwich(this.scale(a, b), c.x, c.y); // Matrix
			}
			return this._sandwich(this.scale(a), b.x, b.y); // Matrix
		},
		rotateAt: function(angle, a, b){
			// summary:
			//		rotates a picture using a specified point as a center of rotation
			// description:
			//		Compare with rotate().
			// angle: Number
			//		an angle of rotation in radians (>0 for CW)
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.rotate(angle), a, b); // Matrix
			}
			return this._sandwich(this.rotate(angle), a.x, a.y); // Matrix
		},
		rotategAt: function(degree, a, b){
			// summary:
			//		rotates a picture using a specified point as a center of rotation
			// description:
			//		Compare with rotateg().
			// degree: Number
			//		an angle of rotation in degrees (>0 for CW)
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.rotateg(degree), a, b); // Matrix
			}
			return this._sandwich(this.rotateg(degree), a.x, a.y); // Matrix
		},
		skewXAt: function(angle, a, b){
			// summary:
			//		skews a picture along the x axis using a specified point as a center of skewing
			// description:
			//		Compare with skewX().
			// angle: Number
			//		a skewing angle in radians
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewX(angle), a, b); // Matrix
			}
			return this._sandwich(this.skewX(angle), a.x, a.y); // Matrix
		},
		skewXgAt: function(degree, a, b){
			// summary:
			//		skews a picture along the x axis using a specified point as a center of skewing
			// description:
			//		Compare with skewXg().
			// degree: Number
			//		a skewing angle in degrees
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewXg(degree), a, b); // Matrix
			}
			return this._sandwich(this.skewXg(degree), a.x, a.y); // Matrix
		},
		skewYAt: function(angle, a, b){
			// summary:
			//		skews a picture along the y axis using a specified point as a center of skewing
			// description:
			//		Compare with skewY().
			// angle: Number
			//		a skewing angle in radians
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewY(angle), a, b); // Matrix
			}
			return this._sandwich(this.skewY(angle), a.x, a.y); // Matrix
		},
		skewYgAt: function(/* Number */ degree, /* Number||Point */ a, /* Number? */ b){
			// summary:
			//		skews a picture along the y axis using a specified point as a center of skewing
			// description:
			//		Compare with skewYg().
			// degree: Number
			//		a skewing angle in degrees
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewYg(degree), a, b); // Matrix
			}
			return this._sandwich(this.skewYg(degree), a.x, a.y); // Matrix
		}
	
	
	});

	return Matrix;
});

define('skylark-data-geom/transform/Transform',[
    "skylark-langx/langx",
    "../geom",
	"./Matrix"
], function(langx,geom, Matrix) {

    var Transform = geom.Transform = langx.klass({
        "klassName": "Transform",
		"value": {
			get : function(){
				return this._.value;
			}
		}
	});

	return Transform;
});

define('skylark-data-geom/transform/MatrixTransform',[
    "skylark-langx/langx",
    "../geom",
	"./Transform",
	"../Point",
	"../Rect"
],function(langx,geom,Transform,Point,Rect) {

    var MatrixTransform = geom.MatrixTransform = Transform.inherit({
        "klassName": "MatrixTransform",

		"value"	:	{
			get : function(){
				return this.matrix.clone();
			}
		},
		
		"matrix" : {
			get : function(){
				return this._.matrix;
			}
		},

		clone : /*ScaleTransform*/function() {
		},
		
		transform : /*Point*/function(/*Point*/point) {
		},
		
		//�w�肳�ꂽ���E�{�b�N�X��ϊ����A��������傤�Ǌi�[�ł���傫���̎����s���E�{�b�N�X��Ԃ��܂��B
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		},		
		"initialize" : function(/*Martix*/matrix) {
            var _ = this._;
			
			_.matrix = matrix;
		}
				
	});

	return MatrixTransform;
	
});	

define('skylark-data-geom/transform/RotateTransform',[
    "skylark-langx/langx",
    "../geom",
	"./Transform",
	"./Matrix",
	"../Point",
	"../Rect"
],function(langx,geom,Transform,Matrix,Point,Rect) {


    var RotateTransform = geom.RotateTransform = Transform.inherit({
        "klassName": "RotateTransform",

        "value": {
            get: function() {
                return Matrix.rotateAt(this.angle, this.centerX, this.centerY);
            }
        },

        "angle": {
            get : function() {
                return this._.angle;
            }
        },
        // cy: Number
        //		The Y coordinate of the center of the circle, default value 0.
        "centerX": {
            get : function() {
                return this._.centerX;
            }
        },
        // r: Number
        //		The radius, default value 100.
        "centerY": {
            get : function() {
                return this._.centerY;
            }
        },

		clone : /*ScaleTransform*/function() {
		},
		
		transform : /*Point*/function(/*Point*/point) {
		},
		
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		},
		
		"init" : function(/*Number*/angle,/*Number*/centerX,/*Number*/centerY) {
			var _ = this._ = {};
			_.angle = angle ? angle :0;
			_.centerX = centerX ? centerX :0;
			_.centerY = centerY ? centerY :0;
		}
	});

	return RotateTransform;
	
});	

define('skylark-data-geom/transform/ScaleTransform',[
    "skylark-langx/langx",
    "../geom",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
], function(langx,geom, Transform, Matrix, Point, Rect) {

   var ScaleTransform = geom.ScaleTransform = Transform.inherit({
        "klassName": "ScaleTransform",

        "value": {
            get: function() {
                    return Matrix.scaleAt(this.scaleX, this.scaleY, this.centerX, this.centerY);
            }
        },

        "scaleX": {
            get : function() {
                return this._.scaleX;
            }
        },

        "scaleY": {
            get : function() {
                return this._.scaleY;
            }
        },

        // cy: Number
        //      The Y coordinate of the center of the circle, default value 0.
        "centerX": {
            get : function() {
                return this._.centerX;
            }
        },
        // r: Number
        //      The radius, default value 100.
        "centerY": {
            get : function() {
                return this._.centerY;
            }
        },

        clone: /*ScaleTransform*/ function() {},

        transform: /*Point*/ function( /*Point*/ point) {},

        transformBounds: /*Rect*/ function( /*Rect*/ rect) {},

        "init": function( /*Number*/ scaleX, /*Number*/ scaleY, /*Number*/ centerX, /*Number*/ centerY) {
            var _ = this._;

            _.scaleX = scaleX ? scaleX : 1;
            _.scaleY = scaleY ? scaleY : 1;
            _.centerX = centerX ? centerX : 0;
            _.centerY = centerY ? centerY : 0;
        }
    });

    return ScaleTransform;

});

define('skylark-data-geom/transform/SkewTransform',[
    "skylark-langx/langx",
    "../geom",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
], function(Class, Transform, Matrix, Point, Rect) {

   var SkewTransform = geom.SkewTransform = Transform.inherit({
        "klassName": "SkewTransform",

        "value": {
            get: function() {
                    return Matrix.scaleAt(this.skewX, this.skewY);
            }
        },

        "skewX": {
            get : function() {
                return this._.skewX;
            }
        },

        "skewY": {
            get : function() {
                return this._.skewY;
            }
        },

        clone: /*SkewTransform*/ function() {},

        transform: /*Point*/ function( /*Point*/ point) {},

        transformBounds: /*Rect*/ function( /*Rect*/ rect) {},

        "init": function( /*Number*/ skewX, /*Number*/ skewY) {
            var _ = this._;

            _.skewX = skewX ? skewX : 0;
            _.skewY = skewY ? skewY : 0;
        }
    });

    return SkewTransform;

});

define('skylark-data-geom/transform/TranslateTransform',[
    "skylark-langx/langx",
    "../geom",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
],function(langx,geom,Transform,Matrix,Point,Rect) {

    //|1   0   dx|
    //|0   1   dy|
    //|0   0    1|

   var TranslateTransform = geom.TranslateTransform = Transform.inherit({
        "klassName": "TranslateTransform",

        "value": {
            get: function() {
                    return Matrix.scaleAt(this.x, this.y);
            }
        },

        "x": {
            get : function() {
                return this._.x;
            }
        },

        "y": {
            get : function() {
                return this._.y;
            }
        },

        clone: /*SkewTransform*/ function() {},

        transform: /*Point*/ function( /*Point*/ point) {},

        transformBounds: /*Rect*/ function( /*Rect*/ rect) {},

        "init": function( /*Number*/ x, /*Number*/ y) {
            var _ = this._;

            _.x = x ? x : 0;
            _.y = y ? y : 0;
        }
    });

    return TranslateTransform;

	var TranslateTransform = Class.declare(Transform,{
		"-parent-"	:	Transform,
		
		"-module-"	:	"qface/geom/transform/TranslateTransform",

		"-protected-" : {
			"-methods-"	:	{
				_valueGetter : function(){
					return Matrix.translate(this.x,this.y);
				}
			}
		},
		"-public-" : {
			"-attributes-" : {
				//x ���ɉ����ĕ��s�ړ����鋗�����擾�܂��͐ݒ肵�܂��B
				"x" : {
					type : Number,
					readOnly : true
				},
				//y ���ɉ����ăI�u�W�F�N�g��ϊ� (�ړ�) ���鋗�����擾�܂��͐ݒ肵�܂��B
				"y" : {
					type : Number,
					readOnly : true
				}
			},
			"-methods-"	:	{
				//���� ScaleTransform �̒l�̏ڍ׃R�s�[���쐬���ĕԂ��܂��B
				clone : /*ScaleTransform*/function() {
				},
				
				//�w�肵���_��ϊ����A���ʂ�Ԃ��܂��B
				transform : /*Point*/function(/*Point*/point) {
				},
				
				//�w�肳�ꂽ���E�{�b�N�X��ϊ����A��������傤�Ǌi�[�ł���傫���̎����s���E�{�b�N�X��Ԃ��܂��B
				transformBounds : /*Rect*/function(/*Rect*/rect) {
				}
			}
		},
		"-constructor-"	:	{		
			"initialize" : function(x,y) {
				this._x = x ? x :0;
				this._y = y ? y :0;
			}
		}
	});

	return TranslateTransform;
	
});	

define('skylark-data-geom/main',[
    "./geom",
    "./Arrow",
    "./Circle",
    "./Ellipse",
    "./Geometry",
    "./Line",
    "./Point",
    "./Polyline",
    "./PolyStar",
    "./Rect",
    "./Size",
    "./transform/Matrix",
    "./transform/MatrixTransform",
    "./transform/RotateTransform",
    "./transform/ScaleTransform",
    "./transform/SkewTransform",
    "./transform/Transform",
    "./transform/TranslateTransform"
], function(geom) {

	return geom;
});
define('skylark-data-geom', ['skylark-data-geom/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-data-geom.js.map
