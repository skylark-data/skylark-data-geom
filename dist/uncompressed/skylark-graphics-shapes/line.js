/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define([
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
