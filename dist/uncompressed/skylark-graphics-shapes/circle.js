define([
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
