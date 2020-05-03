define([
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
