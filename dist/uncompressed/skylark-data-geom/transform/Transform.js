define([
    "skylark-langx/langx",
    "../math",
	"./Matrix"
], function(langx,math, Matrix) {

    var Transform = math.Transform = langx.klass({
        "klassName": "Transform",
		"value": {
			get : function(){
				return this._.value;
			}
		}
	});

	return Transform;
});
