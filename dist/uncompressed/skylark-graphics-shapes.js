/**
 * skylark-graphics-shapes - The skylark shape class library.
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
    var skylarkjs = require("skylark-langx-ns");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-graphics-shapes/shapes',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark, langx) {
	
	var shapes =  {

	  log2 : function (x) {
	    var n = 1, i = 0;
	    while (x > n) {
	      n <<= 1;
	      i++;
	    }
	    return i;
	  }

	};


	return skylark.attach("graphics.shapes",shapes);
});
define('skylark-graphics-shapes/geometry',[
    "skylark-langx/langx",
    "./shapes"
],function(langx, shapes) {
	var Geometry  = shapes.Geometry = langx.klass({
		"klassName"	:	"Geometry",
	});


	return Geometry;

});

define('skylark-graphics-shapes/point',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry",
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

define('skylark-graphics-shapes/arrow',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry",
    "./point"
], function(langx, shapes, Geometry, Point) {
    var Direction = {
        "left" : 1,
        "top" : 2,
        "right" : 3, 
        "bottom" : 4
    };

    var Arrow = shapes.Arrow = Geometry.inherit({
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

define('skylark-graphics-shapes/circle',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry"
], function(langx, shapes, Geometry) {

    var Circle = shapes.Circle = Geometry.inherit({
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

define('skylark-graphics-shapes/ellipse',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry",
], function(langx, shapes, Geometry) {

    var Ellipse = shapes.Ellipse = Geometry.inherit({
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
define('skylark-graphics-shapes/line',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry",
    "./point"
], function(langx, shapes, Geometry, Point) {

    var Line = shapes.Line = Geometry.inherit({
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

define('skylark-graphics-shapes/polyline',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry"
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

define('skylark-graphics-shapes/polystar',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry",
],function(langx, shapes, Geometry) {

    var Polystar = shapes.Polystar = Geometry.inherit({
        "klassName": "Polystar",
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
	
	
	return Polystar;
	
});	

define('skylark-graphics-shapes/size',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry"
],function(langx,shapes,Geometry) {

    var Size = shapes.Size = Geometry.inherit({
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

define('skylark-graphics-shapes/rect',[
    "skylark-langx/langx",
    "./shapes",
    "./geometry",
    "./point",
	"./size"
],function(langx, shapes, Geometry,Point,Size) {

    var Rect = shapes.Rect = Geometry.inherit({
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

define('skylark-graphics-shapes/main',[
    "./shapes",
    "./arrow",
    "./circle",
    "./ellipse",
    "./geometry",
    "./line",
    "./point",
    "./polyline",
    "./polystar",
    "./rect",
    "./size"
], function(shapes) {

	return shapes;
});
define('skylark-graphics-shapes', ['skylark-graphics-shapes/main'], function (main) { return main; });


},this);
//# sourceMappingURL=sourcemaps/skylark-graphics-shapes.js.map
