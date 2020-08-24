define([
    "skylark-langx/langx",
    "../shapes",
	"./Matrix"
], function(langx,shapes, Matrix) {

    var Transform = shapes.Transform = langx.klass({
        "klassName": "Transform",
		"value": {
			get : function(){
				return this._.value;
			}
		}
	});

	return Transform;
});
