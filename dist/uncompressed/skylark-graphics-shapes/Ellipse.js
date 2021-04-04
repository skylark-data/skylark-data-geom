define([
    "skylark-langx/langx",
    "./shapes",
    "./Geometry",
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
