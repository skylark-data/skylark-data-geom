define([
    "skylark-langx/langx",
    "../shapes",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
], function(Class, Transform, Matrix, Point, Rect) {

   var SkewTransform = shapes.SkewTransform = Transform.inherit({
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
