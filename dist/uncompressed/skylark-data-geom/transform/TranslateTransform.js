define([
    "skylark-langx/langx",
    "../math",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
],function(langx,math,Transform,Matrix,Point,Rect) {

    //|1   0   dx|
    //|0   1   dy|
    //|0   0    1|

   var TranslateTransform = math.TranslateTransform = Transform.inherit({
        "klassName": "TranslateTransform",

        "value": {
            get: function() {
                    return Matrix.scaleAt(this.x, this.y);
            }
        },

        "x": {
            get : function() {
                return this._.x;
            }
        },

        "y": {
            get : function() {
                return this._.y;
            }
        },

        clone: /*SkewTransform*/ function() {},

        transform: /*Point*/ function( /*Point*/ point) {},

        transformBounds: /*Rect*/ function( /*Rect*/ rect) {},

        "init": function( /*Number*/ x, /*Number*/ y) {
            var _ = this._;

            _.x = x ? x : 0;
            _.y = y ? y : 0;
        }
    });

    return TranslateTransform;

	var TranslateTransform = Class.declare(Transform,{
		"-parent-"	:	Transform,
		
		"-module-"	:	"qface/geom/transform/TranslateTransform",

		"-protected-" : {
			"-methods-"	:	{
				_valueGetter : function(){
					return Matrix.translate(this.x,this.y);
				}
			}
		},
		"-public-" : {
			"-attributes-" : {
				//x ���ɉ����ĕ��s�ړ����鋗�����擾�܂��͐ݒ肵�܂��B
				"x" : {
					type : Number,
					readOnly : true
				},
				//y ���ɉ����ăI�u�W�F�N�g��ϊ� (�ړ�) ���鋗�����擾�܂��͐ݒ肵�܂��B
				"y" : {
					type : Number,
					readOnly : true
				}
			},
			"-methods-"	:	{
				//���� ScaleTransform �̒l�̏ڍ׃R�s�[���쐬���ĕԂ��܂��B
				clone : /*ScaleTransform*/function() {
				},
				
				//�w�肵���_��ϊ����A���ʂ�Ԃ��܂��B
				transform : /*Point*/function(/*Point*/point) {
				},
				
				//�w�肳�ꂽ���E�{�b�N�X��ϊ����A��������傤�Ǌi�[�ł���傫���̎����s���E�{�b�N�X��Ԃ��܂��B
				transformBounds : /*Rect*/function(/*Rect*/rect) {
				}
			}
		},
		"-constructor-"	:	{		
			"initialize" : function(x,y) {
				this._x = x ? x :0;
				this._y = y ? y :0;
			}
		}
	});

	return TranslateTransform;
	
});	
