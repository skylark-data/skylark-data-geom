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
				//x 軸に沿って平行移動する距離を取得または設定します。
				"x" : {
					type : Number,
					readOnly : true
				},
				//y 軸に沿ってオブジェクトを変換 (移動) する距離を取得または設定します。
				"y" : {
					type : Number,
					readOnly : true
				}
			},
			"-methods-"	:	{
				//この ScaleTransform の値の詳細コピーを作成して返します。
				clone : /*ScaleTransform*/function() {
				},
				
				//指定した点を変換し、結果を返します。
				transform : /*Point*/function(/*Point*/point) {
				},
				
				//指定された境界ボックスを変換し、それをちょうど格納できる大きさの軸平行境界ボックスを返します。
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
