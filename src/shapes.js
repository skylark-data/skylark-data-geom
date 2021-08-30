define([
    "skylark-langx/skylark",
    "skylark-langx/langx"
], function(skylark, langx) {
	
	var shapes =  {

	  log2 : function (x) {
	    var n = 1, i = 0;
	    while (x > n) {
	      n <<= 1;
	      i++;
	    }
	    return i;
	  }

	};


	return skylark.attach("graphics.shapes",shapes);
});