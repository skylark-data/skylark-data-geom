define([
    "skylark-utils/skylark",
    "skylark-utils/langx"
], function(skylark, langx) {
	
	var math = skylark.math = {

	  log2 : function (x) {
	    var n = 1, i = 0;
	    while (x > n) {
	      n <<= 1;
	      i++;
	    }
	    return i;
	  }

	};

	langx.mixin(math,Math);

	return math;
});