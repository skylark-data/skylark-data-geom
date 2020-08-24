define([
    "skylark-langx/langx",
    "./shapes",
    "./Geometry",
    "./Point"
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
