define([
    "skylark-langx/langx",
    "../shapes",
	"./Transform",
	"../Point",
	"../Rect"
],function(langx,shapes,Transform,Point,Rect) {

    var MatrixTransform = shapes.MatrixTransform = Transform.inherit({
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
