/**
 * skylark-utils-math - The math features enhancement for skylark utils.
 * @author Hudaokeji Co.,Ltd
 * @version v0.9.1
 * @link www.skylarkjs.org
 * @license MIT
 */
(function(factory,globals) {
  var define = globals.define,
      require = globals.require,
      isAmd = (typeof define === 'function' && define.amd),
      isCmd = (!isAmd && typeof exports !== 'undefined');

  if (!isAmd && !define) {
    var map = {};
    function absolute(relative, base) {
        if (relative[0]!==".") {
          return relative;
        }
        var stack = base.split("/"),
            parts = relative.split("/");
        stack.pop(); 
        for (var i=0; i<parts.length; i++) {
            if (parts[i] == ".")
                continue;
            if (parts[i] == "..")
                stack.pop();
            else
                stack.push(parts[i]);
        }
        return stack.join("/");
    }
    define = globals.define = function(id, deps, factory) {
        if (typeof factory == 'function') {
            map[id] = {
                factory: factory,
                deps: deps.map(function(dep){
                  return absolute(dep,id);
                }),
                exports: null
            };
            require(id);
        } else {
            map[id] = factory;
        }
    };
    require = globals.require = function(id) {
        if (!map.hasOwnProperty(id)) {
            throw new Error('Module ' + id + ' has not been defined');
        }
        var module = map[id];
        if (!module.exports) {
            var args = [];

            module.deps.forEach(function(dep){
                args.push(require(dep));
            })

            module.exports = module.factory.apply(globals, args);
        }
        return module.exports;
    };
  }
  
  if (!define) {
     throw new Error("The module utility (ex: requirejs or skylark-utils) is not loaded!");
  }

  factory(define,require);

  if (!isAmd) {
    var skylarkjs = require("skylark-langx/skylark");

    if (isCmd) {
      module.exports = skylarkjs;
    } else {
      globals.skylarkjs  = skylarkjs;
    }
  }

})(function(define,require) {

define('skylark-langx/skylark',[], function() {
    var skylark = {

    };
    return skylark;
});

define('skylark-langx/types',[
],function(){
    var toString = {}.toString;
    
    var type = (function() {
        var class2type = {};

        // Populate the class2type map
        "Boolean Number String Function Array Date RegExp Object Error Symbol".split(" ").forEach(function(name) {
            class2type["[object " + name + "]"] = name.toLowerCase();
        });

        return function type(obj) {
            return obj == null ? String(obj) :
                class2type[toString.call(obj)] || "object";
        };
    })();

    function isArray(object) {
        return object && object.constructor === Array;
    }


    /**
     * Checks if `value` is array-like. A value is considered array-like if it's
     * not a function/string/element and has a `value.length` that's an integer greater than or
     * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
     *
     * @category Lang
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
     * @example
     *
     * isArrayLike([1, 2, 3])
     * // => true
     *
     * isArrayLike(document.body.children)
     * // => false
     *
     * isArrayLike('abc')
     * // => true
     *
     * isArrayLike(Function)
     * // => false
     */    
    function isArrayLike(obj) {
        return !isString(obj) && !isHtmlNode(obj) && typeof obj.length == 'number' && !isFunction(obj);
    }

    /**
     * Checks if `value` is classified as a boolean primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a boolean, else `false`.
     * @example
     *
     * isBoolean(false)
     * // => true
     *
     * isBoolean(null)
     * // => false
     */
    function isBoolean(obj) {
        return typeof(obj) === "boolean";
    }

    function isDefined(obj) {
        return typeof obj !== 'undefined';
    }

    function isDocument(obj) {
        return obj != null && obj.nodeType == obj.DOCUMENT_NODE;
    }

    function isEmptyObject(obj) {
        var name;
        for (name in obj) {
            if (obj[name] !== null) {
                return false;
            }
        }
        return true;
    }


    /**
     * Checks if `value` is classified as a `Function` object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a function, else `false`.
     * @example
     *
     * isFunction(parseInt)
     * // => true
     *
     * isFunction(/abc/)
     * // => false
     */
    function isFunction(value) {
        return type(value) == "function";
    }

    function isHtmlNode(obj) {
        return obj && (obj instanceof Node);
    }

    function isInstanceOf( /*Object*/ value, /*Type*/ type) {
        //Tests whether the value is an instance of a type.
        if (value === undefined) {
            return false;
        } else if (value === null || type == Object) {
            return true;
        } else if (typeof value === "number") {
            return type === Number;
        } else if (typeof value === "string") {
            return type === String;
        } else if (typeof value === "boolean") {
            return type === Boolean;
        } else if (typeof value === "string") {
            return type === String;
        } else {
            return (value instanceof type) || (value && value.isInstanceOf ? value.isInstanceOf(type) : false);
        }
    }

    function isNull(value) {
      return type(value) === "null";
    }

    function isNumber(obj) {
        return typeof obj == 'number';
    }

    function isObject(obj) {
        return type(obj) == "object";
    }

    function isPlainObject(obj) {
        return isObject(obj) && !isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    }

    function isString(obj) {
        return typeof obj === 'string';
    }

    function isWindow(obj) {
        return obj && obj == obj.window;
    }

    function isSameOrigin(href) {
        if (href) {
            var origin = location.protocol + '//' + location.hostname;
            if (location.port) {
                origin += ':' + location.port;
            }
            return href.startsWith(origin);
        }
    }

    /**
     * Checks if `value` is classified as a `Symbol` primitive or object.
     *
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
     * @example
     *
     * _.isSymbol(Symbol.iterator);
     * // => true
     *
     * _.isSymbol('abc');
     * // => false
     */
    function isSymbol(value) {
      return typeof value == 'symbol' ||
        (isObjectLike(value) && objectToString.call(value) == symbolTag);
    }

    function isUndefined(value) {
      return value === undefined
    }

    return {

        isArray: isArray,

        isArrayLike: isArrayLike,

        isBoolean: isBoolean,

        isDefined: isDefined,

        isDocument: isDocument,

        isEmpty : isEmptyObject,

        isEmptyObject: isEmptyObject,

        isFunction: isFunction,

        isHtmlNode: isHtmlNode,

        isNull: isNull,

        isNumber: isNumber,

        isObject: isObject,

        isPlainObject: isPlainObject,

        isString: isString,

        isSameOrigin: isSameOrigin,

        isSymbol : isSymbol,

        isUndefined: isUndefined,

        isWindow: isWindow,

        type: type
    };

});
define('skylark-langx/arrays',[
	"./types"
],function(types,objects){
	var filter = Array.prototype.filter,
		isArrayLike = types.isArrayLike;

    /**
     * The base implementation of `_.findIndex` and `_.findLastIndex` without
     * support for iteratee shorthands.
     *
     * @param {Array} array The array to inspect.
     * @param {Function} predicate The function invoked per iteration.
     * @param {number} fromIndex The index to search from.
     * @param {boolean} [fromRight] Specify iterating from right to left.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length,
          index = fromIndex + (fromRight ? 1 : -1);

      while ((fromRight ? index-- : ++index < length)) {
        if (predicate(array[index], index, array)) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
     *
     * @param {Array} array The array to inspect.
     * @param {*} value The value to search for.
     * @param {number} fromIndex The index to search from.
     * @returns {number} Returns the index of the matched value, else `-1`.
     */
    function baseIndexOf(array, value, fromIndex) {
      if (value !== value) {
        return baseFindIndex(array, baseIsNaN, fromIndex);
      }
      var index = fromIndex - 1,
          length = array.length;

      while (++index < length) {
        if (array[index] === value) {
          return index;
        }
      }
      return -1;
    }

    /**
     * The base implementation of `isNaN` without support for number objects.
     *
     * @private
     * @param {*} value The value to check.
     * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
     */
    function baseIsNaN(value) {
      return value !== value;
    }


    function compact(array) {
        return filter.call(array, function(item) {
            return item != null;
        });
    }

    function flatten(array) {
        if (isArrayLike(array)) {
            var result = [];
            for (var i = 0; i < array.length; i++) {
                var item = array[i];
                if (isArrayLike(item)) {
                    for (var j = 0; j < item.length; j++) {
                        result.push(item[j]);
                    }
                } else {
                    result.push(item);
                }
            }
            return result;
        } else {
            return array;
        }
        //return array.length > 0 ? concat.apply([], array) : array;
    }

    function grep(array, callback) {
        var out = [];

        each(array, function(i, item) {
            if (callback(item, i)) {
                out.push(item);
            }
        });

        return out;
    }

    function inArray(item, array) {
        if (!array) {
            return -1;
        }
        var i;

        if (array.indexOf) {
            return array.indexOf(item);
        }

        i = array.length;
        while (i--) {
            if (array[i] === item) {
                return i;
            }
        }

        return -1;
    }

    function makeArray(obj, offset, startWith) {
       if (isArrayLike(obj) ) {
        return (startWith || []).concat(Array.prototype.slice.call(obj, offset || 0));
      }

      // array of single index
      return [ obj ];             
    }


    function forEach (arr, fn) {
      if (arr.forEach) return arr.forEach(fn)
      for (var i = 0; i < arr.length; i++) fn(arr[i], i);
    }

    function map(elements, callback) {
        var value, values = [],
            i, key
        if (isArrayLike(elements))
            for (i = 0; i < elements.length; i++) {
                value = callback.call(elements[i], elements[i], i);
                if (value != null) values.push(value)
            }
        else
            for (key in elements) {
                value = callback.call(elements[key], elements[key], key);
                if (value != null) values.push(value)
            }
        return flatten(values)
    }

    function uniq(array) {
        return filter.call(array, function(item, idx) {
            return array.indexOf(item) == idx;
        })
    }

    return {
        baseFindIndex: baseFindIndex,

        baseIndexOf : baseIndexOf,
        
        compact: compact,

        first : function(items,n) {
            if (n) {
                return items.slice(0,n);
            } else {
                return items[0];
            }
        },

        flatten: flatten,

        inArray: inArray,

        makeArray: makeArray,

        forEach : forEach,

        map : map,
        
        uniq : uniq

    }
});
define('skylark-langx/numbers',[
	"./types"
],function(types){
	var isObject = types.isObject,
		isSymbol = types.isSymbol;

	var INFINITY = 1 / 0,
	    MAX_SAFE_INTEGER = 9007199254740991,
	    MAX_INTEGER = 1.7976931348623157e+308,
	    NAN = 0 / 0;

	/** Used to match leading and trailing whitespace. */
	var reTrim = /^\s+|\s+$/g;

	/** Used to detect bad signed hexadecimal string values. */
	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

	/** Used to detect binary string values. */
	var reIsBinary = /^0b[01]+$/i;

	/** Used to detect octal string values. */
	var reIsOctal = /^0o[0-7]+$/i;

	/** Used to detect unsigned integer values. */
	var reIsUint = /^(?:0|[1-9]\d*)$/;

	/** Built-in method references without a dependency on `root`. */
	var freeParseInt = parseInt;

	/**
	 * Converts `value` to a finite number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.12.0
	 * @category Lang
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted number.
	 * @example
	 *
	 * _.toFinite(3.2);
	 * // => 3.2
	 *
	 * _.toFinite(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toFinite(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toFinite('3.2');
	 * // => 3.2
	 */
	function toFinite(value) {
	  if (!value) {
	    return value === 0 ? value : 0;
	  }
	  value = toNumber(value);
	  if (value === INFINITY || value === -INFINITY) {
	    var sign = (value < 0 ? -1 : 1);
	    return sign * MAX_INTEGER;
	  }
	  return value === value ? value : 0;
	}

	/**
	 * Converts `value` to an integer.
	 *
	 * **Note:** This method is loosely based on
	 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
	 *
	 * @static
	 * @memberOf _
	 * @param {*} value The value to convert.
	 * @returns {number} Returns the converted integer.
	 * @example
	 *
	 * _.toInteger(3.2);
	 * // => 3
	 *
	 * _.toInteger(Number.MIN_VALUE);
	 * // => 0
	 *
	 * _.toInteger(Infinity);
	 * // => 1.7976931348623157e+308
	 *
	 * _.toInteger('3.2');
	 * // => 3
	 */
	function toInteger(value) {
	  var result = toFinite(value),
	      remainder = result % 1;

	  return result === result ? (remainder ? result - remainder : result) : 0;
	}	

	/**
	 * Converts `value` to a number.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {number} Returns the number.
	 * @example
	 *
	 * _.toNumber(3.2);
	 * // => 3.2
	 *
	 * _.toNumber(Number.MIN_VALUE);
	 * // => 5e-324
	 *
	 * _.toNumber(Infinity);
	 * // => Infinity
	 *
	 * _.toNumber('3.2');
	 * // => 3.2
	 */
	function toNumber(value) {
	  if (typeof value == 'number') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return NAN;
	  }
	  if (isObject(value)) {
	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
	    value = isObject(other) ? (other + '') : other;
	  }
	  if (typeof value != 'string') {
	    return value === 0 ? value : +value;
	  }
	  value = value.replace(reTrim, '');
	  var isBinary = reIsBinary.test(value);
	  return (isBinary || reIsOctal.test(value))
	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
	    : (reIsBadHex.test(value) ? NAN : +value);
	}

	return  {
		toFinite : toFinite,
		toNumber : toNumber,
		toInteger : toInteger
	}
});
define('skylark-langx/objects',[
	"./types",
    "./numbers"
],function(types,numbers){
	var hasOwnProperty = Object.prototype.hasOwnProperty,
        slice = Array.prototype.slice,
        isBoolean = types.isBoolean,
        isFunction = types.isFunction,
		isObject = types.isObject,
		isPlainObject = types.isPlainObject,
		isArray = types.isArray,
        isArrayLike = types.isArrayLike,
        isString = types.isString,
        toInteger = numbers.toInteger;

     // An internal function for creating assigner functions.
    function createAssigner(keysFunc, defaults) {
        return function(obj) {
          var length = arguments.length;
          if (defaults) obj = Object(obj);  
          if (length < 2 || obj == null) return obj;
          for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;
            for (var i = 0; i < l; i++) {
              var key = keys[i];
              if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
          }
          return obj;
       };
    }

    // Internal recursive comparison function for `isEqual`.
    var eq, deepEq;
    var SymbolProto = typeof Symbol !== 'undefined' ? Symbol.prototype : null;

    eq = function(a, b, aStack, bStack) {
        // Identical objects are equal. `0 === -0`, but they aren't identical.
        // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
        if (a === b) return a !== 0 || 1 / a === 1 / b;
        // `null` or `undefined` only equal to itself (strict comparison).
        if (a == null || b == null) return false;
        // `NaN`s are equivalent, but non-reflexive.
        if (a !== a) return b !== b;
        // Exhaust primitive checks
        var type = typeof a;
        if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
        return deepEq(a, b, aStack, bStack);
    };

    // Internal recursive comparison function for `isEqual`.
    deepEq = function(a, b, aStack, bStack) {
        // Unwrap any wrapped objects.
        //if (a instanceof _) a = a._wrapped;
        //if (b instanceof _) b = b._wrapped;
        // Compare `[[Class]]` names.
        var className = toString.call(a);
        if (className !== toString.call(b)) return false;
        switch (className) {
            // Strings, numbers, regular expressions, dates, and booleans are compared by value.
            case '[object RegExp]':
            // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
            case '[object String]':
                // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
                // equivalent to `new String("5")`.
                return '' + a === '' + b;
            case '[object Number]':
                // `NaN`s are equivalent, but non-reflexive.
                // Object(NaN) is equivalent to NaN.
                if (+a !== +a) return +b !== +b;
                // An `egal` comparison is performed for other numeric values.
                return +a === 0 ? 1 / +a === 1 / b : +a === +b;
            case '[object Date]':
            case '[object Boolean]':
                // Coerce dates and booleans to numeric primitive values. Dates are compared by their
                // millisecond representations. Note that invalid dates with millisecond representations
                // of `NaN` are not equivalent.
                return +a === +b;
            case '[object Symbol]':
                return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        }

        var areArrays = className === '[object Array]';
        if (!areArrays) {
            if (typeof a != 'object' || typeof b != 'object') return false;
            // Objects with different constructors are not equivalent, but `Object`s or `Array`s
            // from different frames are.
            var aCtor = a.constructor, bCtor = b.constructor;
            if (aCtor !== bCtor && !(isFunction(aCtor) && aCtor instanceof aCtor &&
                               isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
                return false;
            }
        }
        // Assume equality for cyclic structures. The algorithm for detecting cyclic
        // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

        // Initializing stack of traversed objects.
        // It's done here since we only need them for objects and arrays comparison.
        aStack = aStack || [];
        bStack = bStack || [];
        var length = aStack.length;
        while (length--) {
            // Linear search. Performance is inversely proportional to the number of
            // unique nested structures.
            if (aStack[length] === a) return bStack[length] === b;
        }

        // Add the first object to the stack of traversed objects.
        aStack.push(a);
        bStack.push(b);

        // Recursively compare objects and arrays.
        if (areArrays) {
            // Compare array lengths to determine if a deep comparison is necessary.
            length = a.length;
            if (length !== b.length) return false;
            // Deep compare the contents, ignoring non-numeric properties.
            while (length--) {
                if (!eq(a[length], b[length], aStack, bStack)) return false;
            }
        } else {
            // Deep compare objects.
            var keys = Object.keys(a), key;
            length = keys.length;
            // Ensure that both objects contain the same number of properties before comparing deep equality.
            if (Object.keys(b).length !== length) return false;
            while (length--) {
                // Deep compare each member
                key = keys[length];
                if (!(b[key]!==undefined && eq(a[key], b[key], aStack, bStack))) return false;
            }
        }
        // Remove the first object from the stack of traversed objects.
        aStack.pop();
        bStack.pop();
        return true;
    };

    // Retrieve all the property names of an object.
    function allKeys(obj) {
        if (!isObject(obj)) return [];
        var keys = [];
        for (var key in obj) keys.push(key);
        return keys;
    }

    function each(obj, callback) {
        var length, key, i, undef, value;

        if (obj) {
            length = obj.length;

            if (length === undef) {
                // Loop object items
                for (key in obj) {
                    if (obj.hasOwnProperty(key)) {
                        value = obj[key];
                        if (callback.call(value, key, value) === false) {
                            break;
                        }
                    }
                }
            } else {
                // Loop array items
                for (i = 0; i < length; i++) {
                    value = obj[i];
                    if (callback.call(value, i, value) === false) {
                        break;
                    }
                }
            }
        }

        return this;
    }

    function extend(target) {
        var deep, args = slice.call(arguments, 1);
        if (typeof target == 'boolean') {
            deep = target
            target = args.shift()
        }
        if (args.length == 0) {
            args = [target];
            target = this;
        }
        args.forEach(function(arg) {
            mixin(target, arg, deep);
        });
        return target;
    }

    // Retrieve the names of an object's own properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`.
    function keys(obj) {
        if (isObject(obj)) return [];
        var keys = [];
        for (var key in obj) if (has(obj, key)) keys.push(key);
        return keys;
    }

    function has(obj, path) {
        if (!isArray(path)) {
            return obj != null && hasOwnProperty.call(obj, path);
        }
        var length = path.length;
        for (var i = 0; i < length; i++) {
            var key = path[i];
            if (obj == null || !hasOwnProperty.call(obj, key)) {
                return false;
            }
            obj = obj[key];
        }
        return !!length;
    }

    /**
     * Checks if `value` is in `collection`. If `collection` is a string, it's
     * checked for a substring of `value`, otherwise
     * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
     * is used for equality comparisons. If `fromIndex` is negative, it's used as
     * the offset from the end of `collection`.
     *
     * @static
     * @memberOf _
     * @since 0.1.0
     * @category Collection
     * @param {Array|Object|string} collection The collection to inspect.
     * @param {*} value The value to search for.
     * @param {number} [fromIndex=0] The index to search from.
     * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
     * @returns {boolean} Returns `true` if `value` is found, else `false`.
     * @example
     *
     * _.includes([1, 2, 3], 1);
     * // => true
     *
     * _.includes([1, 2, 3], 1, 2);
     * // => false
     *
     * _.includes({ 'a': 1, 'b': 2 }, 1);
     * // => true
     *
     * _.includes('abcd', 'bc');
     * // => true
     */
    function includes(collection, value, fromIndex, guard) {
      collection = isArrayLike(collection) ? collection : values(collection);
      fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

      var length = collection.length;
      if (fromIndex < 0) {
        fromIndex = nativeMax(length + fromIndex, 0);
      }
      return isString(collection)
        ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
        : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
    }


   // Perform a deep comparison to check if two objects are equal.
    function isEqual(a, b) {
        return eq(a, b);
    }

    // Returns whether an object has a given set of `key:value` pairs.
    function isMatch(object, attrs) {
        var keys = keys(attrs), length = keys.length;
        if (object == null) return !length;
        var obj = Object(object);
        for (var i = 0; i < length; i++) {
          var key = keys[i];
          if (attrs[key] !== obj[key] || !(key in obj)) return false;
        }
        return true;
    }    

    function _mixin(target, source, deep, safe) {
        for (var key in source) {
            //if (!source.hasOwnProperty(key)) {
            //    continue;
            //}
            if (safe && target[key] !== undefined) {
                continue;
            }
            if (deep && (isPlainObject(source[key]) || isArray(source[key]))) {
                if (isPlainObject(source[key]) && !isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (isArray(source[key]) && !isArray(target[key])) {
                    target[key] = [];
                }
                _mixin(target[key], source[key], deep, safe);
            } else if (source[key] !== undefined) {
                target[key] = source[key]
            }
        }
        return target;
    }

    function _parseMixinArgs(args) {
        var params = slice.call(arguments, 0),
            target = params.shift(),
            deep = false;
        if (isBoolean(params[params.length - 1])) {
            deep = params.pop();
        }

        return {
            target: target,
            sources: params,
            deep: deep
        };
    }

    function mixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, false);
        });
        return args.target;
    }

    function removeItem(items, item) {
        if (isArray(items)) {
            var idx = items.indexOf(item);
            if (idx != -1) {
                items.splice(idx, 1);
            }
        } else if (isPlainObject(items)) {
            for (var key in items) {
                if (items[key] == item) {
                    delete items[key];
                    break;
                }
            }
        }

        return this;
    }

    function result(obj, path, fallback) {
        if (!isArray(path)) {
            path = [path]
        };
        var length = path.length;
        if (!length) {
          return isFunction(fallback) ? fallback.call(obj) : fallback;
        }
        for (var i = 0; i < length; i++) {
          var prop = obj == null ? void 0 : obj[path[i]];
          if (prop === void 0) {
            prop = fallback;
            i = length; // Ensure we don't continue iterating.
          }
          obj = isFunction(prop) ? prop.call(obj) : prop;
        }

        return obj;
    }

    function safeMixin() {
        var args = _parseMixinArgs.apply(this, arguments);

        args.sources.forEach(function(source) {
            _mixin(args.target, source, args.deep, true);
        });
        return args.target;
    }

    // Retrieve the values of an object's properties.
    function values(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    }


    
    function clone( /*anything*/ src,checkCloneMethod) {
        var copy;
        if (src === undefined || src === null) {
            copy = src;
        } else if (checkCloneMethod && src.clone) {
            copy = src.clone();
        } else if (isArray(src)) {
            copy = [];
            for (var i = 0; i < src.length; i++) {
                copy.push(clone(src[i]));
            }
        } else if (isPlainObject(src)) {
            copy = {};
            for (var key in src) {
                copy[key] = clone(src[key]);
            }
        } else {
            copy = src;
        }

        return copy;

    }

    return {
        allKeys: allKeys,

        clone: clone,

        defaults : createAssigner(allKeys, true),

        each : each,

        extend : extend,

        has: has,

        isEqual: isEqual,   

        includes: includes,

        isMatch: isMatch,

        keys: keys,

        mixin: mixin,

        removeItem: removeItem,

        result : result,
        
        safeMixin: safeMixin,

        values: values
    };



});
define('skylark-langx/klass',[
    "./arrays",
    "./objects",
    "./types"
],function(arrays,objects,types){
    var uniq = arrays.uniq,
        has = objects.has,
        mixin = objects.mixin,
        isArray = types.isArray,
        isDefined = types.isDefined;

/* for reference 
 function klass(props,parent) {
    var ctor = function(){
        this._construct();
    };
    ctor.prototype = props;
    if (parent) {
        ctor._proto_ = parent;
        props.__proto__ = parent.prototype;
    }
    return ctor;
}

// Type some JavaScript code here.
let animal = klass({
  _construct(){
      this.name = this.name + ",hi";
  },
    
  name: "Animal",
  eat() {         // [[HomeObject]] == animal
    alert(`${this.name} eats.`);
  }
    
    
});


let rabbit = klass({
  name: "Rabbit",
  _construct(){
      super._construct();
  },
  eat() {         // [[HomeObject]] == rabbit
    super.eat();
  }
},animal);

let longEar = klass({
  name: "Long Ear",
  eat() {         // [[HomeObject]] == longEar
    super.eat();
  }
},rabbit);
*/
    
    function inherit(ctor, base) {
        var f = function() {};
        f.prototype = base.prototype;

        ctor.prototype = new f();
    }

    var f1 = function() {
        function extendClass(ctor, props, options) {
            // Copy the properties to the prototype of the class.
            var proto = ctor.prototype,
                _super = ctor.superclass.prototype,
                noOverrided = options && options.noOverrided,
                overrides = options && options.overrides || {};

            for (var name in props) {
                if (name === "constructor") {
                    continue;
                }

                // Check if we're overwriting an existing function
                var prop = props[name];
                if (typeof props[name] == "function") {
                    proto[name] =  !prop._constructor && !noOverrided && typeof _super[name] == "function" ?
                          (function(name, fn, superFn) {
                            return function() {
                                var tmp = this.overrided;

                                // Add a new ._super() method that is the same method
                                // but on the super-class
                                this.overrided = superFn;

                                // The method only need to be bound temporarily, so we
                                // remove it when we're done executing
                                var ret = fn.apply(this, arguments);

                                this.overrided = tmp;

                                return ret;
                            };
                        })(name, prop, _super[name]) :
                        prop;
                } else if (types.isPlainObject(prop) && prop!==null && (prop.get)) {
                    Object.defineProperty(proto,name,prop);
                } else {
                    proto[name] = prop;
                }
            }
            return ctor;
        }

        function serialMixins(ctor,mixins) {
            var result = [];

            mixins.forEach(function(mixin){
                if (has(mixin,"__mixins__")) {
                     throw new Error("nested mixins");
                }
                var clss = [];
                while (mixin) {
                    clss.unshift(mixin);
                    mixin = mixin.superclass;
                }
                result = result.concat(clss);
            });

            result = uniq(result);

            result = result.filter(function(mixin){
                var cls = ctor;
                while (cls) {
                    if (mixin === cls) {
                        return false;
                    }
                    if (has(cls,"__mixins__")) {
                        var clsMixines = cls["__mixins__"];
                        for (var i=0; i<clsMixines.length;i++) {
                            if (clsMixines[i]===mixin) {
                                return false;
                            }
                        }
                    }
                    cls = cls.superclass;
                }
                return true;
            });

            if (result.length>0) {
                return result;
            } else {
                return false;
            }
        }

        function mergeMixins(ctor,mixins) {
            var newCtor =ctor;
            for (var i=0;i<mixins.length;i++) {
                var xtor = new Function();
                xtor.prototype = Object.create(newCtor.prototype);
                xtor.__proto__ = newCtor;
                xtor.superclass = null;
                mixin(xtor.prototype,mixins[i].prototype);
                xtor.prototype.__mixin__ = mixins[i];
                newCtor = xtor;
            }

            return newCtor;
        }

        function _constructor ()  {
            if (this._construct) {
                return this._construct.apply(this, arguments);
            } else  if (this.init) {
                return this.init.apply(this, arguments);
            }
        }

        return function createClass(props, parent, mixins,options) {
            if (isArray(parent)) {
                options = mixins;
                mixins = parent;
                parent = null;
            }
            parent = parent || Object;

            if (isDefined(mixins) && !isArray(mixins)) {
                options = mixins;
                mixins = false;
            }

            var innerParent = parent;

            if (mixins) {
                mixins = serialMixins(innerParent,mixins);
            }

            if (mixins) {
                innerParent = mergeMixins(innerParent,mixins);
            }

            var klassName = props.klassName || "",
                ctor = new Function(
                    "return function " + klassName + "() {" +
                    "var inst = this," +
                    " ctor = arguments.callee;" +
                    "if (!(inst instanceof ctor)) {" +
                    "inst = Object.create(ctor.prototype);" +
                    "}" +
                    "return ctor._constructor.apply(inst, arguments) || inst;" + 
                    "}"
                )();


            // Populate our constructed prototype object
            ctor.prototype = Object.create(innerParent.prototype);

            // Enforce the constructor to be what we expect
            ctor.prototype.constructor = ctor;
            ctor.superclass = parent;

            // And make this class extendable
            ctor.__proto__ = innerParent;


            if (!ctor._constructor) {
                ctor._constructor = _constructor;
            } 

            if (mixins) {
                ctor.__mixins__ = mixins;
            }

            if (!ctor.partial) {
                ctor.partial = function(props, options) {
                    return extendClass(this, props, options);
                };
            }
            if (!ctor.inherit) {
                ctor.inherit = function(props, mixins,options) {
                    return createClass(props, this, mixins,options);
                };
            }

            ctor.partial(props, options);

            return ctor;
        };
    }

    var createClass = f1();

    return createClass;
});
define('skylark-langx/ArrayStore',[
    "./klass"
],function(klass){
    var SimpleQueryEngine = function(query, options){
        // summary:
        //      Simple query engine that matches using filter functions, named filter
        //      functions or objects by name-value on a query object hash
        //
        // description:
        //      The SimpleQueryEngine provides a way of getting a QueryResults through
        //      the use of a simple object hash as a filter.  The hash will be used to
        //      match properties on data objects with the corresponding value given. In
        //      other words, only exact matches will be returned.
        //
        //      This function can be used as a template for more complex query engines;
        //      for example, an engine can be created that accepts an object hash that
        //      contains filtering functions, or a string that gets evaluated, etc.
        //
        //      When creating a new dojo.store, simply set the store's queryEngine
        //      field as a reference to this function.
        //
        // query: Object
        //      An object hash with fields that may match fields of items in the store.
        //      Values in the hash will be compared by normal == operator, but regular expressions
        //      or any object that provides a test() method are also supported and can be
        //      used to match strings by more complex expressions
        //      (and then the regex's or object's test() method will be used to match values).
        //
        // options: dojo/store/api/Store.QueryOptions?
        //      An object that contains optional information such as sort, start, and count.
        //
        // returns: Function
        //      A function that caches the passed query under the field "matches".  See any
        //      of the "query" methods on dojo.stores.
        //
        // example:
        //      Define a store with a reference to this engine, and set up a query method.
        //
        //  |   var myStore = function(options){
        //  |       //  ...more properties here
        //  |       this.queryEngine = SimpleQueryEngine;
        //  |       //  define our query method
        //  |       this.query = function(query, options){
        //  |           return QueryResults(this.queryEngine(query, options)(this.data));
        //  |       };
        //  |   };

        // create our matching query function
        switch(typeof query){
            default:
                throw new Error("Can not query with a " + typeof query);
            case "object": case "undefined":
                var queryObject = query;
                query = function(object){
                    for(var key in queryObject){
                        var required = queryObject[key];
                        if(required && required.test){
                            // an object can provide a test method, which makes it work with regex
                            if(!required.test(object[key], object)){
                                return false;
                            }
                        }else if(required != object[key]){
                            return false;
                        }
                    }
                    return true;
                };
                break;
            case "string":
                // named query
                if(!this[query]){
                    throw new Error("No filter function " + query + " was found in store");
                }
                query = this[query];
                // fall through
            case "function":
                // fall through
        }
        
        function filter(arr, callback, thisObject){
            // summary:
            //      Returns a new Array with those items from arr that match the
            //      condition implemented by callback.
            // arr: Array
            //      the array to iterate over.
            // callback: Function|String
            //      a function that is invoked with three arguments (item,
            //      index, array). The return of this function is expected to
            //      be a boolean which determines whether the passed-in item
            //      will be included in the returned array.
            // thisObject: Object?
            //      may be used to scope the call to callback
            // returns: Array
            // description:
            //      This function corresponds to the JavaScript 1.6 Array.filter() method, with one difference: when
            //      run over sparse arrays, this implementation passes the "holes" in the sparse array to
            //      the callback function with a value of undefined. JavaScript 1.6's filter skips the holes in the sparse array.
            //      For more details, see:
            //      https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
            // example:
            //  | // returns [2, 3, 4]
            //  | array.filter([1, 2, 3, 4], function(item){ return item>1; });

            // TODO: do we need "Ctr" here like in map()?
            var i = 0, l = arr && arr.length || 0, out = [], value;
            if(l && typeof arr == "string") arr = arr.split("");
            if(typeof callback == "string") callback = cache[callback] || buildFn(callback);
            if(thisObject){
                for(; i < l; ++i){
                    value = arr[i];
                    if(callback.call(thisObject, value, i, arr)){
                        out.push(value);
                    }
                }
            }else{
                for(; i < l; ++i){
                    value = arr[i];
                    if(callback(value, i, arr)){
                        out.push(value);
                    }
                }
            }
            return out; // Array
        }

        function execute(array){
            // execute the whole query, first we filter
            var results = filter(array, query);
            // next we sort
            var sortSet = options && options.sort;
            if(sortSet){
                results.sort(typeof sortSet == "function" ? sortSet : function(a, b){
                    for(var sort, i=0; sort = sortSet[i]; i++){
                        var aValue = a[sort.attribute];
                        var bValue = b[sort.attribute];
                        // valueOf enables proper comparison of dates
                        aValue = aValue != null ? aValue.valueOf() : aValue;
                        bValue = bValue != null ? bValue.valueOf() : bValue;
                        if (aValue != bValue){
                            // modified by lwf 2016/07/09
                            //return !!sort.descending == (aValue == null || aValue > bValue) ? -1 : 1;
                            return !!sort.descending == (aValue == null || aValue > bValue) ? -1 : 1;
                        }
                    }
                    return 0;
                });
            }
            // now we paginate
            if(options && (options.start || options.count)){
                var total = results.length;
                results = results.slice(options.start || 0, (options.start || 0) + (options.count || Infinity));
                results.total = total;
            }
            return results;
        }
        execute.matches = query;
        return execute;
    };

    var QueryResults = function(results){
        // summary:
        //      A function that wraps the results of a store query with additional
        //      methods.
        // description:
        //      QueryResults is a basic wrapper that allows for array-like iteration
        //      over any kind of returned data from a query.  While the simplest store
        //      will return a plain array of data, other stores may return deferreds or
        //      promises; this wrapper makes sure that *all* results can be treated
        //      the same.
        //
        //      Additional methods include `forEach`, `filter` and `map`.
        // results: Array|dojo/promise/Promise
        //      The result set as an array, or a promise for an array.
        // returns:
        //      An array-like object that can be used for iterating over.
        // example:
        //      Query a store and iterate over the results.
        //
        //  |   store.query({ prime: true }).forEach(function(item){
        //  |       //  do something
        //  |   });

        if(!results){
            return results;
        }

        var isPromise = !!results.then;
        // if it is a promise it may be frozen
        if(isPromise){
            results = Object.delegate(results);
        }
        function addIterativeMethod(method){
            // Always add the iterative methods so a QueryResults is
            // returned whether the environment is ES3 or ES5
            results[method] = function(){
                var args = arguments;
                var result = Deferred.when(results, function(results){
                    //Array.prototype.unshift.call(args, results);
                    return QueryResults(Array.prototype[method].apply(results, args));
                });
                // forEach should only return the result of when()
                // when we're wrapping a promise
                if(method !== "forEach" || isPromise){
                    return result;
                }
            };
        }

        addIterativeMethod("forEach");
        addIterativeMethod("filter");
        addIterativeMethod("map");
        if(results.total == null){
            results.total = Deferred.when(results, function(results){
                return results.length;
            });
        }
        return results; // Object
    };

    var ArrayStore = klass({
        "klassName": "ArrayStore",

        "queryEngine": SimpleQueryEngine,
        
        "idProperty": "id",


        get: function(id){
            // summary:
            //      Retrieves an object by its identity
            // id: Number
            //      The identity to use to lookup the object
            // returns: Object
            //      The object in the store that matches the given id.
            return this.data[this.index[id]];
        },

        getIdentity: function(object){
            return object[this.idProperty];
        },

        put: function(object, options){
            var data = this.data,
                index = this.index,
                idProperty = this.idProperty;
            var id = object[idProperty] = (options && "id" in options) ? options.id : idProperty in object ? object[idProperty] : Math.random();
            if(id in index){
                // object exists
                if(options && options.overwrite === false){
                    throw new Error("Object already exists");
                }
                // replace the entry in data
                data[index[id]] = object;
            }else{
                // add the new object
                index[id] = data.push(object) - 1;
            }
            return id;
        },

        add: function(object, options){
            (options = options || {}).overwrite = false;
            // call put with overwrite being false
            return this.put(object, options);
        },

        remove: function(id){
            // summary:
            //      Deletes an object by its identity
            // id: Number
            //      The identity to use to delete the object
            // returns: Boolean
            //      Returns true if an object was removed, falsy (undefined) if no object matched the id
            var index = this.index;
            var data = this.data;
            if(id in index){
                data.splice(index[id], 1);
                // now we have to reindex
                this.setData(data);
                return true;
            }
        },
        query: function(query, options){
            // summary:
            //      Queries the store for objects.
            // query: Object
            //      The query to use for retrieving objects from the store.
            // options: dojo/store/api/Store.QueryOptions?
            //      The optional arguments to apply to the resultset.
            // returns: dojo/store/api/Store.QueryResults
            //      The results of the query, extended with iterative methods.
            //
            // example:
            //      Given the following store:
            //
            //  |   var store = new Memory({
            //  |       data: [
            //  |           {id: 1, name: "one", prime: false },
            //  |           {id: 2, name: "two", even: true, prime: true},
            //  |           {id: 3, name: "three", prime: true},
            //  |           {id: 4, name: "four", even: true, prime: false},
            //  |           {id: 5, name: "five", prime: true}
            //  |       ]
            //  |   });
            //
            //  ...find all items where "prime" is true:
            //
            //  |   var results = store.query({ prime: true });
            //
            //  ...or find all items where "even" is true:
            //
            //  |   var results = store.query({ even: true });
            return QueryResults(this.queryEngine(query, options)(this.data));
        },

        setData: function(data){
            // summary:
            //      Sets the given data as the source for this store, and indexes it
            // data: Object[]
            //      An array of objects to use as the source of data.
            if(data.items){
                // just for convenience with the data format IFRS expects
                this.idProperty = data.identifier || this.idProperty;
                data = this.data = data.items;
            }else{
                this.data = data;
            }
            this.index = {};
            for(var i = 0, l = data.length; i < l; i++){
                this.index[data[i][this.idProperty]] = i;
            }
        },

        init: function(options) {
            for(var i in options){
                this[i] = options[i];
            }
            this.setData(this.data || []);
        }

    });

	return ArrayStore;
});
define('skylark-langx/aspect',[
],function(){

  var undefined, nextId = 0;
    function advise(dispatcher, type, advice, receiveArguments){
        var previous = dispatcher[type];
        var around = type == "around";
        var signal;
        if(around){
            var advised = advice(function(){
                return previous.advice(this, arguments);
            });
            signal = {
                remove: function(){
                    if(advised){
                        advised = dispatcher = advice = null;
                    }
                },
                advice: function(target, args){
                    return advised ?
                        advised.apply(target, args) :  // called the advised function
                        previous.advice(target, args); // cancelled, skip to next one
                }
            };
        }else{
            // create the remove handler
            signal = {
                remove: function(){
                    if(signal.advice){
                        var previous = signal.previous;
                        var next = signal.next;
                        if(!next && !previous){
                            delete dispatcher[type];
                        }else{
                            if(previous){
                                previous.next = next;
                            }else{
                                dispatcher[type] = next;
                            }
                            if(next){
                                next.previous = previous;
                            }
                        }

                        // remove the advice to signal that this signal has been removed
                        dispatcher = advice = signal.advice = null;
                    }
                },
                id: nextId++,
                advice: advice,
                receiveArguments: receiveArguments
            };
        }
        if(previous && !around){
            if(type == "after"){
                // add the listener to the end of the list
                // note that we had to change this loop a little bit to workaround a bizarre IE10 JIT bug
                while(previous.next && (previous = previous.next)){}
                previous.next = signal;
                signal.previous = previous;
            }else if(type == "before"){
                // add to beginning
                dispatcher[type] = signal;
                signal.next = previous;
                previous.previous = signal;
            }
        }else{
            // around or first one just replaces
            dispatcher[type] = signal;
        }
        return signal;
    }
    function aspect(type){
        return function(target, methodName, advice, receiveArguments){
            var existing = target[methodName], dispatcher;
            if(!existing || existing.target != target){
                // no dispatcher in place
                target[methodName] = dispatcher = function(){
                    var executionId = nextId;
                    // before advice
                    var args = arguments;
                    var before = dispatcher.before;
                    while(before){
                        args = before.advice.apply(this, args) || args;
                        before = before.next;
                    }
                    // around advice
                    if(dispatcher.around){
                        var results = dispatcher.around.advice(this, args);
                    }
                    // after advice
                    var after = dispatcher.after;
                    while(after && after.id < executionId){
                        if(after.receiveArguments){
                            var newResults = after.advice.apply(this, args);
                            // change the return value only if a new value was returned
                            results = newResults === undefined ? results : newResults;
                        }else{
                            results = after.advice.call(this, results, args);
                        }
                        after = after.next;
                    }
                    return results;
                };
                if(existing){
                    dispatcher.around = {advice: function(target, args){
                        return existing.apply(target, args);
                    }};
                }
                dispatcher.target = target;
            }
            var results = advise((dispatcher || existing), type, advice, receiveArguments);
            advice = null;
            return results;
        };
    }

    return {
        after: aspect("after"),
 
        around: aspect("around"),
        
        before: aspect("before")
    };
});
define('skylark-langx/funcs',[
    "./objects",
	"./types"
],function(objects,types){
	var mixin = objects.mixin,
        slice = Array.prototype.slice,
        isFunction = types.isFunction,
        isString = types.isString;

    function defer(fn) {
        if (requestAnimationFrame) {
            requestAnimationFrame(fn);
        } else {
            setTimeoutout(fn);
        }
        return this;
    }

    function noop() {
    }

    function proxy(fn, context) {
        var args = (2 in arguments) && slice.call(arguments, 2)
        if (isFunction(fn)) {
            var proxyFn = function() {
                return fn.apply(context, args ? args.concat(slice.call(arguments)) : arguments);
            }
            return proxyFn;
        } else if (isString(context)) {
            if (args) {
                args.unshift(fn[context], fn)
                return proxy.apply(null, args)
            } else {
                return proxy(fn[context], fn);
            }
        } else {
            throw new TypeError("expected function");
        }
    }

    function debounce(fn, wait) {
        var timeout;
        return function () {
            var context = this, args = arguments;
            var later = function () {
                timeout = null;
                fn.apply(context, args);
            };
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
   
    var delegate = (function() {
        // boodman/crockford delegation w/ cornford optimization
        function TMP() {}
        return function(obj, props) {
            TMP.prototype = obj;
            var tmp = new TMP();
            TMP.prototype = null;
            if (props) {
                mixin(tmp, props);
            }
            return tmp; // Object
        };
    })();


    return {
        debounce: debounce,

        delegate: delegate,

        defer: defer,

        noop : noop,

        proxy: proxy,

        returnTrue: function() {
            return true;
        },

        returnFalse: function() {
            return false;
        }
    };
});
define('skylark-langx/Deferred',[
    "./arrays",
	"./funcs",
    "./objects"
],function(arrays,funcs,objects){
    "use strict";
    
    var  PGLISTENERS = Symbol ? Symbol() : '__pglisteners',
         PGNOTIFIES = Symbol ? Symbol() : '__pgnotifies';

    var slice = Array.prototype.slice,
        proxy = funcs.proxy,
        makeArray = arrays.makeArray,
        result = objects.result,
        mixin = objects.mixin;

    mixin(Promise.prototype,{
        always: function(handler) {
            //this.done(handler);
            //this.fail(handler);
            this.then(handler,handler);
            return this;
        },
        done : function() {
            for (var i = 0;i<arguments.length;i++) {
                this.then(arguments[i]);
            }
            return this;
        },
        fail : function(handler) { 
            //return mixin(Promise.prototype.catch.call(this,handler),added);
            //return this.then(null,handler);
            this.catch(handler);
            return this;
         }
    });


    var Deferred = function() {
        var self = this,
            p = this.promise = new Promise(function(resolve, reject) {
                self._resolve = resolve;
                self._reject = reject;
            });

        wrapPromise(p,self);

        this[PGLISTENERS] = [];
        this[PGNOTIFIES] = [];

        //this.resolve = Deferred.prototype.resolve.bind(this);
        //this.reject = Deferred.prototype.reject.bind(this);
        //this.progress = Deferred.prototype.progress.bind(this);

    };

    function wrapPromise(p,d) {
        var   added = {
                state : function() {
                    if (d.isResolved()) {
                        return 'resolved';
                    }
                    if (d.isRejected()) {
                        return 'rejected';
                    }
                    return 'pending';
                },
                then : function(onResolved,onRejected,onProgress) {
                    if (onProgress) {
                        this.progress(onProgress);
                    }
                    return wrapPromise(Promise.prototype.then.call(this,
                            onResolved && function(args) {
                                if (args && args.__ctx__ !== undefined) {
                                    return onResolved.apply(args.__ctx__,args);
                                } else {
                                    return onResolved(args);
                                }
                            },
                            onRejected && function(args){
                                if (args && args.__ctx__ !== undefined) {
                                    return onRejected.apply(args.__ctx__,args);
                                } else {
                                    return onRejected(args);
                                }
                            }));
                },
                progress : function(handler) {
                    d[PGNOTIFIES].forEach(function (value) {
                        handler(value);
                    });
                    d[PGLISTENERS].push(handler);
                    return this;
                }

            };

        added.pipe = added.then;
        return mixin(p,added);

    }

    Deferred.prototype.resolve = function(value) {
        var args = slice.call(arguments);
        return this.resolveWith(null,args);
    };

    Deferred.prototype.resolveWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._resolve(args);
        this._resolved = true;
        return this;
    };

    Deferred.prototype.notify = function(value) {
        try {
            this[PGNOTIFIES].push(value);

            return this[PGLISTENERS].forEach(function (listener) {
                return listener(value);
            });
        } catch (error) {
          this.reject(error);
        }
        return this;
    };

    Deferred.prototype.reject = function(reason) {
        var args = slice.call(arguments);
        return this.rejectWith(null,args);
    };

    Deferred.prototype.rejectWith = function(context,args) {
        args = args ? makeArray(args) : []; 
        args.__ctx__ = context;
        this._reject(args);
        this._rejected = true;
        return this;
    };

    Deferred.prototype.isResolved = function() {
        return !!this._resolved;
    };

    Deferred.prototype.isRejected = function() {
        return !!this._rejected;
    };

    Deferred.prototype.then = function(callback, errback, progback) {
        var p = result(this,"promise");
        return p.then(callback, errback, progback);
    };

    Deferred.prototype.progress = function(progback){
        var p = result(this,"promise");
        return p.progress(progback);
    };
   
    Deferred.prototype.catch = function(errback) {
        var p = result(this,"promise");
        return p.catch(errback);
    };


    Deferred.prototype.done  = function() {
        var p = result(this,"promise");
        return p.done.apply(p,arguments);
    };

    Deferred.prototype.fail = function(errback) {
        var p = result(this,"promise");
        return p.fail(errback);
    };


    Deferred.all = function(array) {
        //return wrapPromise(Promise.all(array));
        var d = new Deferred();
        Promise.all(array).then(d.resolve.bind(d),d.reject.bind(d));
        return result(d,"promise");
    };

    Deferred.first = function(array) {
        return wrapPromise(Promise.race(array));
    };


    Deferred.when = function(valueOrPromise, callback, errback, progback) {
        var receivedPromise = valueOrPromise && typeof valueOrPromise.then === "function";
        var nativePromise = receivedPromise && valueOrPromise instanceof Promise;

        if (!receivedPromise) {
            if (arguments.length > 1) {
                return callback ? callback(valueOrPromise) : valueOrPromise;
            } else {
                return new Deferred().resolve(valueOrPromise);
            }
        } else if (!nativePromise) {
            var deferred = new Deferred(valueOrPromise.cancel);
            valueOrPromise.then(proxy(deferred.resolve,deferred), proxy(deferred.reject,deferred), deferred.notify);
            valueOrPromise = deferred.promise;
        }

        if (callback || errback || progback) {
            return valueOrPromise.then(callback, errback, progback);
        }
        return valueOrPromise;
    };

    Deferred.reject = function(err) {
        var d = new Deferred();
        d.reject(err);
        return d.promise;
    };

    Deferred.resolve = function(data) {
        var d = new Deferred();
        d.resolve.apply(d,arguments);
        return d.promise;
    };

    Deferred.immediate = Deferred.resolve;

    return Deferred;
});
define('skylark-langx/async',[
    "./Deferred",
    "./objects"
],function(Deferred,objects){
    var each = objects.each;
    
    var async = {
        parallel : function(arr,args,ctx) {
            var rets = [];
            ctx = ctx || null;
            args = args || [];

            each(arr,function(i,func){
                rets.push(func.apply(ctx,args));
            });

            return Deferred.all(rets);
        },

        series : function(arr,args,ctx) {
            var rets = [],
                d = new Deferred(),
                p = d.promise;

            ctx = ctx || null;
            args = args || [];

            d.resolve();
            each(arr,function(i,func){
                p = p.then(function(){
                    return func.apply(ctx,args);
                });
                rets.push(p);
            });

            return Deferred.all(rets);
        },

        waterful : function(arr,args,ctx) {
            var d = new Deferred(),
                p = d.promise;

            ctx = ctx || null;
            args = args || [];

            d.resolveWith(ctx,args);

            each(arr,function(i,func){
                p = p.then(func);
            });
            return p;
        }
    };

	return async;	
});
define('skylark-langx/datetimes',[],function(){
     function parseMilliSeconds(str) {

        var strs = str.split(' ');
        var number = parseInt(strs[0]);

        if (isNaN(number)){
            return 0;
        }

        var min = 60000 * 60;

        switch (strs[1].trim().replace(/\./g, '')) {
            case 'minutes':
            case 'minute':
            case 'min':
            case 'mm':
            case 'm':
                return 60000 * number;
            case 'hours':
            case 'hour':
            case 'HH':
            case 'hh':
            case 'h':
            case 'H':
                return min * number;
            case 'seconds':
            case 'second':
            case 'sec':
            case 'ss':
            case 's':
                return 1000 * number;
            case 'days':
            case 'day':
            case 'DD':
            case 'dd':
            case 'd':
                return (min * 24) * number;
            case 'months':
            case 'month':
            case 'MM':
            case 'M':
                return (min * 24 * 28) * number;
            case 'weeks':
            case 'week':
            case 'W':
            case 'w':
                return (min * 24 * 7) * number;
            case 'years':
            case 'year':
            case 'yyyy':
            case 'yy':
            case 'y':
                return (min * 24 * 365) * number;
            default:
                return 0;
        }
    };
	
	return {
		parseMilliSeconds
	};
});
define('skylark-langx/Evented',[
    "./klass",
    "./arrays",
    "./objects",
	"./types"
],function(klass,arrays,objects,types){
	var slice = Array.prototype.slice,
        compact = arrays.compact,
        isDefined = types.isDefined,
        isPlainObject = types.isPlainObject,
		isFunction = types.isFunction,
		isString = types.isString,
		isEmptyObject = types.isEmptyObject,
		mixin = objects.mixin;

    var Evented = klass({
        on: function(events, selector, data, callback, ctx, /*used internally*/ one) {
            var self = this,
                _hub = this._hub || (this._hub = {});

            if (isPlainObject(events)) {
                ctx = callback;
                each(events, function(type, fn) {
                    self.on(type, selector, data, fn, ctx, one);
                });
                return this;
            }

            if (!isString(selector) && !isFunction(callback)) {
                ctx = callback;
                callback = data;
                data = selector;
                selector = undefined;
            }

            if (isFunction(data)) {
                ctx = callback;
                callback = data;
                data = null;
            }

            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(name) {
                (_hub[name] || (_hub[name] = [])).push({
                    fn: callback,
                    selector: selector,
                    data: data,
                    ctx: ctx,
                    one: one
                });
            });

            return this;
        },

        one: function(events, selector, data, callback, ctx) {
            return this.on(events, selector, data, callback, ctx, 1);
        },

        trigger: function(e /*,argument list*/ ) {
            if (!this._hub) {
                return this;
            }

            var self = this;

            if (isString(e)) {
                e = new CustomEvent(e);
            }

            Object.defineProperty(e,"target",{
                value : this
            });

            var args = slice.call(arguments, 1);
            if (isDefined(args)) {
                args = [e].concat(args);
            } else {
                args = [e];
            }
            [e.type || e.name, "all"].forEach(function(eventName) {
                var listeners = self._hub[eventName];
                if (!listeners) {
                    return;
                }

                var len = listeners.length,
                    reCompact = false;

                for (var i = 0; i < len; i++) {
                    var listener = listeners[i];
                    if (e.data) {
                        if (listener.data) {
                            e.data = mixin({}, listener.data, e.data);
                        }
                    } else {
                        e.data = listener.data || null;
                    }
                    listener.fn.apply(listener.ctx, args);
                    if (listener.one) {
                        listeners[i] = null;
                        reCompact = true;
                    }
                }

                if (reCompact) {
                    self._hub[eventName] = compact(listeners);
                }

            });
            return this;
        },

        listened: function(event) {
            var evtArr = ((this._hub || (this._events = {}))[event] || []);
            return evtArr.length > 0;
        },

        listenTo: function(obj, event, callback, /*used internally*/ one) {
            if (!obj) {
                return this;
            }

            // Bind callbacks on obj,
            if (isString(callback)) {
                callback = this[callback];
            }

            if (one) {
                obj.one(event, callback, this);
            } else {
                obj.on(event, callback, this);
            }

            //keep track of them on listening.
            var listeningTo = this._listeningTo || (this._listeningTo = []),
                listening;

            for (var i = 0; i < listeningTo.length; i++) {
                if (listeningTo[i].obj == obj) {
                    listening = listeningTo[i];
                    break;
                }
            }
            if (!listening) {
                listeningTo.push(
                    listening = {
                        obj: obj,
                        events: {}
                    }
                );
            }
            var listeningEvents = listening.events,
                listeningEvent = listeningEvents[event] = listeningEvents[event] || [];
            if (listeningEvent.indexOf(callback) == -1) {
                listeningEvent.push(callback);
            }

            return this;
        },

        listenToOnce: function(obj, event, callback) {
            return this.listenTo(obj, event, callback, 1);
        },

        off: function(events, callback) {
            var _hub = this._hub || (this._hub = {});
            if (isString(events)) {
                events = events.split(/\s/)
            }

            events.forEach(function(name) {
                var evts = _hub[name];
                var liveEvents = [];

                if (evts && callback) {
                    for (var i = 0, len = evts.length; i < len; i++) {
                        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
                            liveEvents.push(evts[i]);
                    }
                }

                if (liveEvents.length) {
                    _hub[name] = liveEvents;
                } else {
                    delete _hub[name];
                }
            });

            return this;
        },
        unlistenTo: function(obj, event, callback) {
            var listeningTo = this._listeningTo;
            if (!listeningTo) {
                return this;
            }
            for (var i = 0; i < listeningTo.length; i++) {
                var listening = listeningTo[i];

                if (obj && obj != listening.obj) {
                    continue;
                }

                var listeningEvents = listening.events;
                for (var eventName in listeningEvents) {
                    if (event && event != eventName) {
                        continue;
                    }

                    var listeningEvent = listeningEvents[eventName];

                    for (var j = 0; j < listeningEvent.length; j++) {
                        if (!callback || callback == listeningEvent[i]) {
                            listening.obj.off(eventName, listeningEvent[i], this);
                            listeningEvent[i] = null;
                        }
                    }

                    listeningEvent = listeningEvents[eventName] = compact(listeningEvent);

                    if (isEmptyObject(listeningEvent)) {
                        listeningEvents[eventName] = null;
                    }

                }

                if (isEmptyObject(listeningEvents)) {
                    listeningTo[i] = null;
                }
            }

            listeningTo = this._listeningTo = compact(listeningTo);
            if (isEmptyObject(listeningTo)) {
                this._listeningTo = null;
            }

            return this;
        }
    });

	return Evented;

});
define('skylark-langx/hoster',[
],function(){
	// The javascript host environment, brower and nodejs are supported.
	var hoster = {
		"isBrowser" : true, // default
		"isNode" : null,
		"global" : this,
		"browser" : null,
		"node" : null
	};

	if (typeof process == "object" && process.versions && process.versions.node && process.versions.v8) {
		hoster.isNode = true;
		hoster.isBrowser = false;
	}

	hoster.global = (function(){
		if (typeof global !== 'undefined' && typeof global !== 'function') {
			// global spec defines a reference to the global object called 'global'
			// https://github.com/tc39/proposal-global
			// `global` is also defined in NodeJS
			return global;
		} else if (typeof window !== 'undefined') {
			// window is defined in browsers
			return window;
		}
		else if (typeof self !== 'undefined') {
			// self is defined in WebWorkers
			return self;
		}
		return this;
	})();

	var _document = null;

	Object.defineProperty(hoster,"document",function(){
		if (!_document) {
			var w = typeof window === 'undefined' ? require('html-element') : window;
			_document = w.document;
		}

		return _document;
	});

	if (hoster.isBrowser) {
	    function uaMatch( ua ) {
		    ua = ua.toLowerCase();

		    var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
		      /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
		      /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
		      /(msie) ([\w.]+)/.exec( ua ) ||
		      ua.indexOf('compatible') < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
		      [];

		    return {
		      browser: match[ 1 ] || '',
		      version: match[ 2 ] || '0'
		    };
	  	};

	    var matched = uaMatch( navigator.userAgent );

	    var browser = hoster.browser = {};

	    if ( matched.browser ) {
	      browser[ matched.browser ] = true;
	      browser.version = matched.version;
	    }

	    // Chrome is Webkit, but Webkit is also Safari.
	    if ( browser.chrome ) {
	      browser.webkit = true;
	    } else if ( browser.webkit ) {
	      browser.safari = true;
	    }
	}

	return  hoster;
});
define('skylark-langx/strings',[
],function(){

     /*
     * Converts camel case into dashes.
     * @param {String} str
     * @return {String}
     * @exapmle marginTop -> margin-top
     */
    function dasherize(str) {
        return str.replace(/::/g, '/')
            .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
            .replace(/([a-z\d])([A-Z])/g, '$1_$2')
            .replace(/_/g, '-')
            .toLowerCase();
    }

    function deserializeValue(value) {
        try {
            return value ?
                value == "true" ||
                (value == "false" ? false :
                    value == "null" ? null :
                    +value + "" == value ? +value :
                    /^[\[\{]/.test(value) ? JSON.parse(value) :
                    value) : value;
        } catch (e) {
            return value;
        }
    }


    function trim(str) {
        return str == null ? "" : String.prototype.trim.call(str);
    }
    function substitute( /*String*/ template,
        /*Object|Array*/
        map,
        /*Function?*/
        transform,
        /*Object?*/
        thisObject) {
        // summary:
        //    Performs parameterized substitutions on a string. Throws an
        //    exception if any parameter is unmatched.
        // template:
        //    a string with expressions in the form `${key}` to be replaced or
        //    `${key:format}` which specifies a format function. keys are case-sensitive.
        // map:
        //    hash to search for substitutions
        // transform:
        //    a function to process all parameters before substitution takes


        thisObject = thisObject || window;
        transform = transform ?
            proxy(thisObject, transform) : function(v) {
                return v;
            };

        function getObject(key, map) {
            if (key.match(/\./)) {
                var retVal,
                    getValue = function(keys, obj) {
                        var _k = keys.pop();
                        if (_k) {
                            if (!obj[_k]) return null;
                            return getValue(keys, retVal = obj[_k]);
                        } else {
                            return retVal;
                        }
                    };
                return getValue(key.split(".").reverse(), map);
            } else {
                return map[key];
            }
        }

        return template.replace(/\$\{([^\s\:\}]+)(?:\:([^\s\:\}]+))?\}/g,
            function(match, key, format) {
                var value = getObject(key, map);
                if (format) {
                    value = getObject(format, thisObject).call(thisObject, value, key);
                }
                return transform(value, key).toString();
            }); // String
    }

    var idCounter = 0;
    function uniqueId (prefix) {
        var id = ++idCounter + '';
        return prefix ? prefix + id : id;
    }

	return {
        camelCase: function(str) {
            return str.replace(/-([\da-z])/g, function(a) {
                return a.toUpperCase().replace('-', '');
            });
        },

        dasherize: dasherize,

        deserializeValue: deserializeValue,

        lowerFirst: function(str) {
            return str.charAt(0).toLowerCase() + str.slice(1);
        },

        serializeValue: function(value) {
            return JSON.stringify(value)
        },


        substitute: substitute,

        trim: trim,

        uniqueId: uniqueId,

        upperFirst: function(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
	} ; 

});
define('skylark-langx/Xhr',[
    "./arrays",
    "./Deferred",
    "./Evented",
    "./objects",
    "./funcs",
    "./types"
],function(arrays,Deferred,Evented,objects,funcs,types){
    var each = objects.each,
        mixin = objects.mixin,
        noop = funcs.noop,
        isArray = types.isArray,
        isFunction = types.isFunction,
        isPlainObject = types.isPlainObject,
        type = types.type;
 
     var getAbsoluteUrl = (function() {
        var a;

        return function(url) {
            if (!a) a = document.createElement('a');
            a.href = url;

            return a.href;
        };
    })();
   
    var Xhr = (function(){
        var jsonpID = 0,
            key,
            name,
            rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
            scriptTypeRE = /^(?:text|application)\/javascript/i,
            xmlTypeRE = /^(?:text|application)\/xml/i,
            jsonType = 'application/json',
            htmlType = 'text/html',
            blankRE = /^\s*$/;

        var XhrDefaultOptions = {
            async: true,

            // Default type of request
            type: 'GET',
            // Callback that is executed before request
            beforeSend: noop,
            // Callback that is executed if the request succeeds
            success: noop,
            // Callback that is executed the the server drops error
            error: noop,
            // Callback that is executed on request complete (both: error and success)
            complete: noop,
            // The context for the callbacks
            context: null,
            // Whether to trigger "global" Ajax events
            global: true,

            // MIME types mapping
            // IIS returns Javascript as "application/x-javascript"
            accepts: {
                script: 'text/javascript, application/javascript, application/x-javascript',
                json: 'application/json',
                xml: 'application/xml, text/xml',
                html: 'text/html',
                text: 'text/plain'
            },
            // Whether the request is to another domain
            crossDomain: false,
            // Default timeout
            timeout: 0,
            // Whether data should be serialized to string
            processData: true,
            // Whether the browser should be allowed to cache GET responses
            cache: true,

            xhrFields : {
                withCredentials : true
            }
        };

        function mimeToDataType(mime) {
            if (mime) {
                mime = mime.split(';', 2)[0];
            }
            if (mime) {
                if (mime == htmlType) {
                    return "html";
                } else if (mime == jsonType) {
                    return "json";
                } else if (scriptTypeRE.test(mime)) {
                    return "script";
                } else if (xmlTypeRE.test(mime)) {
                    return "xml";
                }
            }
            return "text";
        }

        function appendQuery(url, query) {
            if (query == '') return url
            return (url + '&' + query).replace(/[&?]{1,2}/, '?')
        }

        // serialize payload and append it to the URL for GET requests
        function serializeData(options) {
            options.data = options.data || options.query;
            if (options.processData && options.data && type(options.data) != "string") {
                options.data = param(options.data, options.traditional);
            }
            if (options.data && (!options.type || options.type.toUpperCase() == 'GET')) {
                options.url = appendQuery(options.url, options.data);
                options.data = undefined;
            }
        }

        function serialize(params, obj, traditional, scope) {
            var t, array = isArray(obj),
                hash = isPlainObject(obj)
            each(obj, function(key, value) {
                t =type(value);
                if (scope) key = traditional ? scope :
                    scope + '[' + (hash || t == 'object' || t == 'array' ? key : '') + ']'
                // handle data in serializeArray() format
                if (!scope && array) params.add(value.name, value.value)
                // recurse into nested objects
                else if (t == "array" || (!traditional && t == "object"))
                    serialize(params, value, traditional, key)
                else params.add(key, value)
            })
        }

        var param = function(obj, traditional) {
            var params = []
            params.add = function(key, value) {
                if (isFunction(value)) value = value()
                if (value == null) value = ""
                this.push(escape(key) + '=' + escape(value))
            }
            serialize(params, obj, traditional)
            return params.join('&').replace(/%20/g, '+')
        };

        var Xhr = Evented.inherit({
            klassName : "Xhr",

            _request  : function(args) {
                var _ = this._,
                    self = this,
                    options = mixin({},XhrDefaultOptions,_.options,args),
                    xhr = _.xhr = new XMLHttpRequest();

                serializeData(options)

                var dataType = options.dataType || options.handleAs,
                    mime = options.mimeType || options.accepts[dataType],
                    headers = options.headers,
                    xhrFields = options.xhrFields,
                    isFormData = options.data && options.data instanceof FormData,
                    basicAuthorizationToken = options.basicAuthorizationToken,
                    type = options.type,
                    url = options.url,
                    async = options.async,
                    user = options.user , 
                    password = options.password,
                    deferred = new Deferred(),
                    contentType = isFormData ? false : 'application/x-www-form-urlencoded';

                if (xhrFields) {
                    for (name in xhrFields) {
                        xhr[name] = xhrFields[name];
                    }
                }

                if (mime && mime.indexOf(',') > -1) {
                    mime = mime.split(',', 2)[0];
                }
                if (mime && xhr.overrideMimeType) {
                    xhr.overrideMimeType(mime);
                }

                //if (dataType) {
                //    xhr.responseType = dataType;
                //}

                var finish = function() {
                    xhr.onloadend = noop;
                    xhr.onabort = noop;
                    xhr.onprogress = noop;
                    xhr.ontimeout = noop;
                    xhr = null;
                }
                var onloadend = function() {
                    var result, error = false
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && getAbsoluteUrl(url).startsWith('file:'))) {
                        dataType = dataType || mimeToDataType(options.mimeType || xhr.getResponseHeader('content-type'));

                        result = xhr.responseText;
                        try {
                            if (dataType == 'script') {
                                eval(result);
                            } else if (dataType == 'xml') {
                                result = xhr.responseXML;
                            } else if (dataType == 'json') {
                                result = blankRE.test(result) ? null : JSON.parse(result);
                            } else if (dataType == "blob") {
                                result = Blob([xhrObj.response]);
                            } else if (dataType == "arraybuffer") {
                                result = xhr.reponse;
                            }
                        } catch (e) { 
                            error = e;
                        }

                        if (error) {
                            deferred.reject(error,xhr.status,xhr);
                        } else {
                            deferred.resolve(result,xhr.status,xhr);
                        }
                    } else {
                        deferred.reject(new Error(xhr.statusText),xhr.status,xhr);
                    }
                    finish();
                };

                var onabort = function() {
                    if (deferred) {
                        deferred.reject(new Error("abort"),xhr.status,xhr);
                    }
                    finish();                 
                }
 
                var ontimeout = function() {
                    if (deferred) {
                        deferred.reject(new Error("timeout"),xhr.status,xhr);
                    }
                    finish();                 
                }

                var onprogress = function(evt) {
                    if (deferred) {
                        deferred.notify(evt,xhr.status,xhr);
                    }
                }

                xhr.onloadend = onloadend;
                xhr.onabort = onabort;
                xhr.ontimeout = ontimeout;
                xhr.onprogress = onprogress;

                xhr.open(type, url, async, user, password);
               
                if (headers) {
                    for ( var key in headers) {
                        var value = headers[key];
 
                        if(key.toLowerCase() === 'content-type'){
                            contentType = headers[hdr];
                        } else {
                           xhr.setRequestHeader(key, value);
                        }
                    }
                }   

                if  (contentType && contentType !== false){
                    xhr.setRequestHeader('Content-Type', contentType);
                }

                if(!headers || !('X-Requested-With' in headers)){
                    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                }


                //If basicAuthorizationToken is defined set its value into "Authorization" header
                if (basicAuthorizationToken) {
                    xhr.setRequestHeader("Authorization", basicAuthorizationToken);
                }

                xhr.send(options.data ? options.data : null);

                return deferred.promise;

            },

            "abort": function() {
                var _ = this._,
                    xhr = _.xhr;

                if (xhr) {
                    xhr.abort();
                }    
            },


            "request": function(args) {
                return this._request(args);
            },

            get : function(args) {
                args = args || {};
                args.type = "GET";
                return this._request(args);
            },

            post : function(args) {
                args = args || {};
                args.type = "POST";
                return this._request(args);
            },

            patch : function(args) {
                args = args || {};
                args.type = "PATCH";
                return this._request(args);
            },

            put : function(args) {
                args = args || {};
                args.type = "PUT";
                return this._request(args);
            },

            del : function(args) {
                args = args || {};
                args.type = "DELETE";
                return this._request(args);
            },

            "init": function(options) {
                this._ = {
                    options : options || {}
                };
            }
        });

        ["request","get","post","put","del","patch"].forEach(function(name){
            Xhr[name] = function(url,args) {
                var xhr = new Xhr({"url" : url});
                return xhr[name](args);
            };
        });

        Xhr.defaultOptions = XhrDefaultOptions;
        Xhr.param = param;

        return Xhr;
    })();

	return Xhr;	
});
define('skylark-langx/Restful',[
    "./Evented",
    "./objects",
    "./strings",
    "./Xhr"
],function(Evented,objects,strings,Xhr){
    var mixin = objects.mixin,
        substitute = strings.substitute;

    var Restful = Evented.inherit({
        "klassName" : "Restful",

        "idAttribute": "id",
        
        getBaseUrl : function(args) {
            //$$baseEndpoint : "/files/${fileId}/comments",
            var baseEndpoint = substitute(this.baseEndpoint,args),
                baseUrl = this.server + this.basePath + baseEndpoint;
            if (args[this.idAttribute]!==undefined) {
                baseUrl = baseUrl + "/" + args[this.idAttribute]; 
            }
            return baseUrl;
        },
        _head : function(args) {
            //get resource metadata .
            //args : id and other info for the resource ,ex
            //{
            //  "id" : 234,  // the own id, required
            //  "fileId"   : 2 // the parent resource id, option by resource
            //}
        },
        _get : function(args) {
            //get resource ,one or list .
            //args : id and other info for the resource ,ex
            //{
            //  "id" : 234,  // the own id, null if list
            //  "fileId"   : 2 // the parent resource id, option by resource
            //}
            return Xhr.get(this.getBaseUrl(args),args);
        },
        _post  : function(args,verb) {
            //create or move resource .
            //args : id and other info for the resource ,ex
            //{
            //  "id" : 234,  // the own id, required
            //  "data" : body // the own data,required
            //  "fileId"   : 2 // the parent resource id, option by resource
            //}
            //verb : the verb ,ex: copy,touch,trash,untrash,watch
            var url = this.getBaseUrl(args);
            if (verb) {
                url = url + "/" + verb;
            }
            return Xhr.post(url, args);
        },

        _put  : function(args,verb) {
            //update resource .
            //args : id and other info for the resource ,ex
            //{
            //  "id" : 234,  // the own id, required
            //  "data" : body // the own data,required
            //  "fileId"   : 2 // the parent resource id, option by resource
            //}
            //verb : the verb ,ex: copy,touch,trash,untrash,watch
            var url = this.getBaseUrl(args);
            if (verb) {
                url = url + "/" + verb;
            }
            return Xhr.put(url, args);
        },

        _delete : function(args) {
            //delete resource . 
            //args : id and other info for the resource ,ex
            //{
            //  "id" : 234,  // the own id, required
            //  "fileId"   : 2 // the parent resource id, option by resource
            //}         

            // HTTP request : DELETE http://center.utilhub.com/registry/v1/apps/{appid}
            var url = this.getBaseUrl(args);
            return Xhr.del(url);
        },

        _patch : function(args){
            //update resource metadata. 
            //args : id and other info for the resource ,ex
            //{
            //  "id" : 234,  // the own id, required
            //  "data" : body // the own data,required
            //  "fileId"   : 2 // the parent resource id, option by resource
            //}
            var url = this.getBaseUrl(args);
            return Xhr.patch(url, args);
        },
        query: function(params) {
            
            return this._post(params);
        },

        retrieve: function(params) {
            return this._get(params);
        },

        create: function(params) {
            return this._post(params);
        },

        update: function(params) {
            return this._put(params);
        },

        delete: function(params) {
            // HTTP request : DELETE http://center.utilhub.com/registry/v1/apps/{appid}
            return this._delete(params);
        },

        patch: function(params) {
           // HTTP request : PATCH http://center.utilhub.com/registry/v1/apps/{appid}
            return this._patch(params);
        },
        init: function(params) {
            mixin(this,params);
 //           this._xhr = XHRx();
       }
    });

    return Restful;
});
define('skylark-langx/Stateful',[
	"./Evented",
  "./strings",
  "./objects"
],function(Evented,strings,objects){
    var isEqual = objects.isEqual,
        mixin = objects.mixin,
        result = objects.result,
        isEmptyObject = objects.isEmptyObject,
        clone = objects.clone,
        uniqueId = strings.uniqueId;

    var Stateful = Evented.inherit({
        _construct : function(attributes, options) {
            var attrs = attributes || {};
            options || (options = {});
            this.cid = uniqueId(this.cidPrefix);
            this.attributes = {};
            if (options.collection) this.collection = options.collection;
            if (options.parse) attrs = this.parse(attrs, options) || {};
            var defaults = result(this, 'defaults');
            attrs = mixin({}, defaults, attrs);
            this.set(attrs, options);
            this.changed = {};
        },

        // A hash of attributes whose current and previous value differ.
        changed: null,

        // The value returned during the last failed validation.
        validationError: null,

        // The default name for the JSON `id` attribute is `"id"`. MongoDB and
        // CouchDB users may want to set this to `"_id"`.
        idAttribute: 'id',

        // The prefix is used to create the client id which is used to identify models locally.
        // You may want to override this if you're experiencing name clashes with model ids.
        cidPrefix: 'c',


        // Return a copy of the model's `attributes` object.
        toJSON: function(options) {
          return clone(this.attributes);
        },


        // Get the value of an attribute.
        get: function(attr) {
          return this.attributes[attr];
        },

        // Returns `true` if the attribute contains a value that is not null
        // or undefined.
        has: function(attr) {
          return this.get(attr) != null;
        },

        // Set a hash of model attributes on the object, firing `"change"`. This is
        // the core primitive operation of a model, updating the data and notifying
        // anyone who needs to know about the change in state. The heart of the beast.
        set: function(key, val, options) {
          if (key == null) return this;

          // Handle both `"key", value` and `{key: value}` -style arguments.
          var attrs;
          if (typeof key === 'object') {
            attrs = key;
            options = val;
          } else {
            (attrs = {})[key] = val;
          }

          options || (options = {});

          // Run validation.
          if (!this._validate(attrs, options)) return false;

          // Extract attributes and options.
          var unset      = options.unset;
          var silent     = options.silent;
          var changes    = [];
          var changing   = this._changing;
          this._changing = true;

          if (!changing) {
            this._previousAttributes = clone(this.attributes);
            this.changed = {};
          }

          var current = this.attributes;
          var changed = this.changed;
          var prev    = this._previousAttributes;

          // For each `set` attribute, update or delete the current value.
          for (var attr in attrs) {
            val = attrs[attr];
            if (!isEqual(current[attr], val)) changes.push(attr);
            if (!isEqual(prev[attr], val)) {
              changed[attr] = val;
            } else {
              delete changed[attr];
            }
            unset ? delete current[attr] : current[attr] = val;
          }

          // Update the `id`.
          if (this.idAttribute in attrs) this.id = this.get(this.idAttribute);

          // Trigger all relevant attribute changes.
          if (!silent) {
            if (changes.length) this._pending = options;
            for (var i = 0; i < changes.length; i++) {
              this.trigger('change:' + changes[i], this, current[changes[i]], options);
            }
          }

          // You might be wondering why there's a `while` loop here. Changes can
          // be recursively nested within `"change"` events.
          if (changing) return this;
          if (!silent) {
            while (this._pending) {
              options = this._pending;
              this._pending = false;
              this.trigger('change', this, options);
            }
          }
          this._pending = false;
          this._changing = false;
          return this;
        },

        // Remove an attribute from the model, firing `"change"`. `unset` is a noop
        // if the attribute doesn't exist.
        unset: function(attr, options) {
          return this.set(attr, void 0, mixin({}, options, {unset: true}));
        },

        // Clear all attributes on the model, firing `"change"`.
        clear: function(options) {
          var attrs = {};
          for (var key in this.attributes) attrs[key] = void 0;
          return this.set(attrs, mixin({}, options, {unset: true}));
        },

        // Determine if the model has changed since the last `"change"` event.
        // If you specify an attribute name, determine if that attribute has changed.
        hasChanged: function(attr) {
          if (attr == null) return !isEmptyObject(this.changed);
          return this.changed[attr] !== undefined;
        },

        // Return an object containing all the attributes that have changed, or
        // false if there are no changed attributes. Useful for determining what
        // parts of a view need to be updated and/or what attributes need to be
        // persisted to the server. Unset attributes will be set to undefined.
        // You can also pass an attributes object to diff against the model,
        // determining if there *would be* a change.
        changedAttributes: function(diff) {
          if (!diff) return this.hasChanged() ? clone(this.changed) : false;
          var old = this._changing ? this._previousAttributes : this.attributes;
          var changed = {};
          for (var attr in diff) {
            var val = diff[attr];
            if (isEqual(old[attr], val)) continue;
            changed[attr] = val;
          }
          return !isEmptyObject(changed) ? changed : false;
        },

        // Get the previous value of an attribute, recorded at the time the last
        // `"change"` event was fired.
        previous: function(attr) {
          if (attr == null || !this._previousAttributes) return null;
          return this._previousAttributes[attr];
        },

        // Get all of the attributes of the model at the time of the previous
        // `"change"` event.
        previousAttributes: function() {
          return clone(this._previousAttributes);
        },

        // Create a new model with identical attributes to this one.
        clone: function() {
          return new this.constructor(this.attributes);
        },

        // A model is new if it has never been saved to the server, and lacks an id.
        isNew: function() {
          return !this.has(this.idAttribute);
        },

        // Check if the model is currently in a valid state.
        isValid: function(options) {
          return this._validate({}, mixin({}, options, {validate: true}));
        },

        // Run validation against the next complete set of model attributes,
        // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
        _validate: function(attrs, options) {
          if (!options.validate || !this.validate) return true;
          attrs = mixin({}, this.attributes, attrs);
          var error = this.validationError = this.validate(attrs, options) || null;
          if (!error) return true;
          this.trigger('invalid', this, error, mixin(options, {validationError: error}));
          return false;
        }
    });

	return Stateful;
});
define('skylark-langx/langx',[
    "./skylark",
    "./arrays",
    "./ArrayStore",
    "./aspect",
    "./async",
    "./datetimes",
    "./Deferred",
    "./Evented",
    "./funcs",
    "./hoster",
    "./klass",
    "./numbers",
    "./objects",
    "./Restful",
    "./Stateful",
    "./strings",
    "./types",
    "./Xhr"
], function(skylark,arrays,ArrayStore,aspect,async,datetimes,Deferred,Evented,funcs,hoster,klass,numbers,objects,Restful,Stateful,strings,types,Xhr) {
    "use strict";
    var toString = {}.toString,
        concat = Array.prototype.concat,
        indexOf = Array.prototype.indexOf,
        slice = Array.prototype.slice,
        filter = Array.prototype.filter,
        mixin = objects.mixin,
        safeMixin = objects.safeMixin,
        isFunction = types.isFunction;


    function createEvent(type, props) {
        var e = new CustomEvent(type, props);

        return safeMixin(e, props);
    }
    

    function funcArg(context, arg, idx, payload) {
        return isFunction(arg) ? arg.call(context, idx, payload) : arg;
    }

    function getQueryParams(url) {
        var url = url || window.location.href,
            segs = url.split("?"),
            params = {};

        if (segs.length > 1) {
            segs[1].split("&").forEach(function(queryParam) {
                var nv = queryParam.split('=');
                params[nv[0]] = nv[1];
            });
        }
        return params;
    }


    function toPixel(value) {
        // style values can be floats, client code may want
        // to round for integer pixels.
        return parseFloat(value) || 0;
    }


    var _uid = 1;

    function uid(obj) {
        return obj._uid || (obj._uid = _uid++);
    }

    function langx() {
        return langx;
    }

    mixin(langx, {
        createEvent : createEvent,

        funcArg: funcArg,

        getQueryParams: getQueryParams,

        toPixel: toPixel,

        uid: uid,

        URL: typeof window !== "undefined" ? window.URL || window.webkitURL : null

    });


    mixin(langx, arrays,aspect,datetimes,funcs,numbers,objects,strings,types,{
        ArrayStore : ArrayStore,

        async : async,
        
        Deferred: Deferred,

        Evented: Evented,

        hoster : hoster,

        klass : klass,

        Restful: Restful,
        
        Stateful: Stateful,

        Xhr: Xhr

    });

    return skylark.langx = langx;
});
define('skylark-utils-math/math',[
    "skylark-langx/skylark",
    "skylark-langx/langx"
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
define('skylark-utils-math/Geometry',[
    "skylark-langx/langx",
    "./math"
],function(langx, math) {
	var Geometry  = math.Geometry = langx.klass({
		"klassName"	:	"Geometry",
	});


	return Geometry;

});

define('skylark-utils-math/Point',[
    "skylark-langx/langx",
    "./math",
    "./Geometry",
],function(langx, math, Geometry) {

    var Point = math.Point = Geometry.inherit({
        "klassName": "Point",
        "x": {
            get : function() {
                return this._.x;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y": {
            get : function() {
                return this._.y;
            }
        },
		"clone"	: function(){
			var _ = this._;
			return new Point(_.x,_.y);
		
		},
		"move"	: function(/*Number*/dx,/*Number*/dy) {
			var _ = this._;
			return new Point(_.x + dx,_.y + dy);
		},
		"notEqual"	:	function(/*Point*/p) {
			var _ = this._;
			return !p || p.x != _.x || p.y != _.y;
		},
		
		"equal"	:	function(/*Point*/p){
			return  !this.notEqual(p);
		},
		
        "init" : function(x, y) {
            var _ = this._ = {};
            _.x = x || 0;
            _.y = y || 0;
        }
	});
	
	Point.fromString = function(s) {
		var a = s.split(",");
		return new Point(parseFloat(a[0]),parseFloat(a[1]));
	};

	Point.fromPlain = function(o) {
		return new Point(o.x,o.y);
	};

	Point.fromArray = function(a) {
		return new Point(a[0],a[1]);
	};
	
	Point.Zero = new Point(0,0);

	return Point;
	
});	

define('skylark-utils-math/Arrow',[
    "skylark-langx/langx",
    "./math",
    "./Geometry",
    "./Point"
], function(langx, math, Geometry, Point) {
    var Direction = {
        "left" : 1,
        "top" : 2,
        "right" : 3, 
        "bottom" : 4
    };

    var Arrow = math.Arrow = Geometry.inherit({
        "klassName": "Arrow",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
                var 
                    _ = this._,
                    box = {
                    x: _.x,
                    y: this.y,
                    width: _.width,
                    height: _.height
                };
                return box;
            }
        },
       "x": {
            get : function() {
                return this._.x;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y": {
            get : function() {
                return this._.y;
            }
        },
        // width: Number
        //		The width of the default rectangle, value 100.
        "width": {
            get : function() {
                return this._.width;
            }
        },
        // height: Number
        //		The height of the default rectangle, value 100.
        "height": {
            get : function() {
                return this._.height;
            }
        },
        // r: Number
        //		The corner radius for the default rectangle, value 0.
        "direction": {
            get : function() {
                return this._.direction;
            }
        },
        "leftTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y);
            }
        },
        "leftBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y + _.height);
            }
        },
        "rightTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y);
            }
        },
        "rightBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y + _.height);
            }
        },
        "move": function(dx, dy) {
            var _ = this._;
            return new Arrow(_.x + dx,_.y + dy,_.width,_.height,_.direction);
        },
        "containPoint": function(x,y) {
            // support function(p)
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;

            return (x >= _.x) && (x < _.x + _.width) && (y >= _.y) && (y < _.y + _.height);
        },
        "init" : function(x, y, width, height, direction) {
            var _ = this._ = {};
            _.x = x || 0;
            _.y = y || 0;
            _.width = width || 0;
            _.height = height || 0;
            _.direction = direction || Direction.top;
        }
    });

    Arrow.Direction = Direction;

    return Arrow;
});

define('skylark-utils-math/Circle',[
    "skylark-langx/langx",
    "./math",
    "./Geometry"
], function(langx, math, Geometry) {

    var Circle = math.Circle = Geometry.inherit({
        "klassName": "Circle",

        "bounds": {
            get : function() {
                // summary:
                //      returns the bounding box
                var _ = this._,
                    box = {
                        x: _.cx - _.r,
                        y: _.cy - _.r,
                        width: 2 * _.r,
                        height: 2 * _.r
                    };
                return box;
            }
        },

        // cx: Number
        //		The X coordinate of the center of the circle, default value 0.
        "cx": {
            get : function() {
                return this._.cx;
            }
        },
        // cy: Number
        //		The Y coordinate of the center of the circle, default value 0.
        "cy": {
            get : function() {
                return this._.cy;
            }
        },
        // r: Number
        //		The radius, default value 100.
        "r": {
            get : function() {
                return this._.r;
            }
        },
        move: function(dx, dy) {
            var _ = this._;            
            return new Circle(_.cx + dx,_.cy + dy,_.r);
        },
        containPoint: function(x,y) {
            // support function(p)
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;

            var diff = (x - _.x) * (x - _.x) + (y - _.y) * (y - _.y);
            if (diff < _.r * _.r) {
                return true;
            }
            return false;
        },
        "init" : function(cx, cy, r) {
            var _ = this._ = {};
            _.cx = cx || 0;
            _.cy = cy || 0;
            _.r = r || 0;
        }

    });

    return Circle;
});

define('skylark-utils-math/Ellipse',[
    "skylark-langx/langx",
    "./math",
    "./Geometry",
], function(langx, math, Geometry) {

    var Ellipse = math.Ellipse = Geometry.inherit({
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

/**
 *
 * Copyright (c) 2013 psteam Inc.(http://www.psteam.co.jp)
 * http://www.psteam.co.jp/qface/license
 * 
 * @Author: liwenfeng
 * @Date: 2013/02/28
 */
define('skylark-utils-math/Line',[
    "skylark-langx/langx",
    "./math",
    "./Geometry",
    "./Point"
], function(langx, math, Geometry, Point) {

    var Line = math.Line = Geometry.inherit({
        "klassName": "Line",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
                var 
                    _ = this._,
                    box = {
						x:		Math.min(_.x1, _.x2),
						y:		Math.min(_.y1, _.y2),
						width:	Math.abs(_.x2 - _.x1),
						height:	Math.abs(_.y2 -_.y1)
	                };
                return box;
            }
        },
       "x1": {
            get : function() {
                return this._.x1;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y1": {
            get : function() {
                return this._.y1;
            }
        },
        "x2": {
            get : function() {
                return this._.x2;
            }
        },
        "y2": {
            get : function() {
                return this._.y2;
            }
        },

		"startPoint" :{
			get : function(){
				var _ = this._;
				return new Point(_.x1,_.y1);
			}
		},
		"endPointer" :{
			get : function(){
				var _ = this._;
				return new Point(_.x2,_.y2);
			}
		},
			
		move	: function(dx,dy) {
			var _ = this._;
			return new Line(_.x1+dx,_.y1+dy,_.x2+dx,_.y2+dy);
		},

		containPoint : function(x,y) {
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;
		
    		return Math.abs((y-_.y1)*(_.x2-_.x1) - (_.y2-_.y1)*(x-_.x1)) < 1e-6;

		},

        "init" : function(x1, y1, x2,y2) {
            var _ = this._ = {};
            _.x1 = x1 || 0;
            _.y1 = y1 || 0;
            _.x2 = x2 || 0;
            _.y2 = y2 || 0;
        }
	});
	
	
	return Line;
	
});	

define('skylark-utils-math/Polyline',[
    "skylark-langx/langx",
    "./math",
    "./Geometry"
], function(langx, math, Geometry) {

    var Polyline = math.Polyline = Geometry.inherit({
        "klassName": "Polyline",

        "bounds": {
            get : function() {
                // summary:
                //      returns the bounding box
                var _ = this._,
					p = _.points,
					l = p.length,
					t = p[0],
					bbox = {l: t.x, t: t.y, r: t.x, b: t.y};
				for(var i = 1; i < l; ++i){
					t = p[i];
					if(bbox.l > t.x) bbox.l = t.x;
					if(bbox.r < t.x) bbox.r = t.x;
					if(bbox.t > t.y) bbox.t = t.y;
					if(bbox.b < t.y) bbox.b = t.y;
				}
				var box = {
					x:		bbox.l,
					y:		bbox.t,
					width:	bbox.r - bbox.l,
					height:	bbox.b - bbox.t
				};
                return box;
            }
        },
		"points" : {
            get : function() {
                return this._.points;
            }
		},
		
		"init" : function(/*Array*/points) {
			//TODO: will be modified
			var _ = this._ = {};
			_.points = points?points:[];
		}
	});
	
	
	return Polyline;
	
});	

define('skylark-utils-math/PolyStar',[
    "skylark-langx/langx",
    "./math",
    "./Geometry",
],function(langx, math, Geometry) {

    var PolyStar = math.PolyStar = Geometry.inherit({
        "klassName": "PolyStar",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
				var _ = this._,
					p = _.points,
					l = p.length,
					t = p[0];
					bbox = {l: t.x, t: t.y, r: t.x, b: t.y};
				for(var i = 1; i < l; ++i){
					t = p[i];
					if(bbox.l > t.x) bbox.l = t.x;
					if(bbox.r < t.x) bbox.r = t.x;
					if(bbox.t > t.y) bbox.t = t.y;
					if(bbox.b < t.y) bbox.b = t.y;
				}
				var box = {
					x:		bbox.l,
					y:		bbox.t,
					width:	bbox.r - bbox.l,
					height:	bbox.b - bbox.t
				};
				return box;	
            }
        },
       "x": {
            get : function() {
                return this._.x;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y": {
            get : function() {
                return this._.y;
            }
        },
        "radius": {
            get : function() {
                return this._.radius;
            }
        },
        "sides": {
            get : function() {
                return this._.sides;
            }
        },
        "pointSize": {
            get : function() {
                return this._.pointSize;
            }
        },
        "angle": {
            get : function() {
                return this._.angle;
            }
         },
		"init"	:function(x, y, radius, sides, pointSize, angle){
			var _ = this._;
			_.x = x;
			_.y = y;
			_.radius = radius;
			_.sides = sides;
			_.pointSize = pointSize;
			_.angle = angle;
		}

	});
	
	
	return PolyStar;
	
});	

define('skylark-utils-math/Size',[
    "skylark-langx/langx",
    "./math",
    "./Geometry"
],function(langx,math,Geometry) {

    var Size = math.Size = Geometry.inherit({
        "klassName": "Size",
		// width: Number
		//		The width of the default rectangle, value 100.
		"width" : {
			get : function() {
				return this._.width;
			}
		},
		// height: Number
		//		The height of the default rectangle, value 100.
		"height" : {
			get : function() {
				return this._.height;
			}
		},

		"clone"	: function(){
			var _ = this._;
			return new Size(_.width,_.height);
		},

        "toArray" : function() {
            return [this.width,this.height];
        },

        "toPlain" : function() {
            return {
                "width"  : this.width,
                "height"  : this.height
            };
        },
        "toString": function() {
        	return this.width +"," + this.height;
        },

        "init" : function(width,height) {
        	var _ = this._ = {};
        	_.width = width || 0;
        	_.height = height || 0;
        }
	});
	
	Size.fromString = function(s) {
		var a = s.split(",");
		return new Size(parseFloat(a[0]),parseFloat(a[1]));
	};

	Size.fromPlain = function(o) {
		return new Size(o.w || o.width,o.h || o.height);
	};

	Size.fromArray = function(a) {
		return new Size(a[0],a[1]);
	};

	Size.Zero = new Size(0,0);
	
	return Size;
	
});	

define('skylark-utils-math/Rect',[
    "skylark-langx/langx",
    "./math",
    "./Geometry",
    "./Point",
	"./Size"
],function(langx, math, Geometry,Point,Size) {

    var Rect = math.Rect = Geometry.inherit({
        "klassName": "Rect",
        "bounds": {
            get : function() {
                // summary:
                //		returns the bounding box
                var 
                    _ = this._,
                    box = {
                    x: _.x,
                    y: this.y,
                    width: _.width,
                    height: _.height
                };
                return box;
            }
        },
       "x": {
            get : function() {
                return this._.x;
            }
        },
        // y: Number
        //		The Y coordinate of the default rectangle's position, value 0.
        "y": {
            get : function() {
                return this._.y;
            }
        },
        // width: Number
        //		The width of the default rectangle, value 100.
        "width": {
            get : function() {
                return this._.width;
            }
        },
        // height: Number
        //		The height of the default rectangle, value 100.
        "height": {
            get : function() {
                return this._.height;
            }
        },
        // r: Number
        //		The corner radius for the default rectangle, value 0.
        "radius": {
            get : function() {
                return this._.radius;
            }
        },
        "leftTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y);
            }
        },
        "leftBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x, _.y + _.height);
            }
        },
        "rightTop": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y);
            }
        },
        "rightBottom": {
            get: function() {
                var _ = this._;
                return new Point(_.x + _.width, _.y + _.height);
            }
        },

        "size": {
            get: function() {
                var _ = this._;
                return new Size(_.width, _.height);
            }
        },

        "move": function(dx, dy) {
            var _ = this._;
            return new Rect(_.x + dx,_.y + dy,_.width,_.height,_.radius);
        },

        "containPoint": function(x,y) {
            // support function(p)
            if (y === undefined) {
                var p = x;
                x = p.x;
                y = p.y;
            }
            var _ = this._;

            return (x >= _.x) && (x < _.x + _.width) && (y >= _.y) && (y < _.y + _.height);
        },

		"isEmpty"	:	function(){
			return this.width <=0 || this.height<=0;
		},
		
		"notEqual"	:	function(/*Rect*/r) {
			return !r || r.x != this.x || r.y != this.y || r.width != this.width || r.height != this.height || r.radius != this.radius;
		},
		
		"equal"	:	function(/*Rect*/r){
			return  !this.notEqual(r);
		},
		
		"isIntersect"	:function(/*Number*/x2,/*Number*/y2,/*Number*/width2,/*Number*/height2){
			var x1 = this.x1,y1=this.y,width1=this.width,height1=this.height;
			 
		    return (Math.min(x1 + width1, x2 + width2) - (x1 > x2 ? x1 : x2)) > 0 &&
		           (Math.min(y1 + height1, y2 + height2) - (y1 > y2 ? y1 : y2)) > 0;
		},
		
		"intersect"	:	function(/*Number*/x2,/*Number*/y2,/*Number*/width2,/*Number*/height2){
			var x1 = this.x1,y1=this.y,width1=this.width,height1=this.height;
			 
		    return (Math.min(x1 + width1, x2 + width2) - (x1 > x2 ? x1 : x2)) > 0 &&
		           (Math.min(y1 + height1, y2 + height2) - (y1 > y2 ? y1 : y2)) > 0;
		},
						
		"unite"	: function(/*Number*/x2,/*Number*/y2,/*Number*/width2,/*Number*/height2){
			var x1 = this.x1,y1=this.y,width1=this.width,height1=this.height;
			 
			var x = x1 < x2 ? x1 : x2,
				y = y1 < y2 ? y1 : y2,
				width  = Math.max(x1 + width1, x2 + width2) - x;
				height = Math.max(y1 + height1, y2 + height2) - y;
		    
		    return new Rect(x,y,width,height);
		},
		
		"clone"	: function(){
			var _ = this._;
			return new Rect(_.x,_.y,_.width,_.height,_.radius);
		},

        "init" : function(x, y, width, height, radius) {
            var _ = this._ = {};
            _.x = x || 0;
            _.y = y || 0;
            _.width = width || 0;
            _.height = height || 0;
            _.radius = radius || 0;
        }
    });


	Rect.fromString = function(s) {
		var a = s.split(",");
		return new Rect(parseFloat(a[0]),parseFloat(a[1]),parseFloat(a[2]),parseFloat(a[3]));
	};

	Rect.fromPlain = function(o) {
		return new Rect(o.x || o.l,o.y || o.t, o.w || o.width,o.h || o.height);
	};

	Rect.fromArray = function(a) {
		return new Rect(a[0],a[1],a[2],a[3]);
	};
	
	Rect.Zero = new Rect(0,0,0,0);
	
	return Rect;
	
});	

define( 'skylark-utils-math/transform/Matrix',[
    "skylark-langx/langx",
    "../math",
], function(langx,math){
	// reference easeljs/geom/Matrix2D  and dojox/gfx/matrix
	
	var DEG_TO_RAD = Math.PI/180;
	var _degToRadCache = {};
	var degToRad = function(degree){
		return _degToRadCache[degree] || (_degToRadCache[degree] = (Math.PI * degree / 180));
	};
	var radToDeg = function(radian){ return radian / Math.PI * 180; };
	

	//Represents a 3 x 3 affine transformation matrix used for transformation in 2-D space.
	//|----------|
	//|m11|m21|dx| 
	//|----------|
	//|m12|m22|dy|
	//|----------|
	//|  0|  0| 1|
	//|----------|
	
    var Matrix = math.TransformMatrix = langx.klass({
        "klassName": "TransformMatrix",

		"_multiplyPoint"	: 	function(p){
			// summary:
			//		applies the matrix to a point
			// p: Point
			//		a point
			// returns: Point
			var _ = this._,
				x = p.x * _.m11 + p.y * _.m21  + _.dx,
			    y = p.x * _.m12 +  p.y * _.m22 + _.dy;
			return new Point(x,y); // Point
		},

       "m11": {
       		//Position (0, 0) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m11;
            }
        },

       "m12": {
       		//Position (0, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m12;
            }
        },

       "m21": {
       		//Position (1, 0) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m21;
            }
        },

       "m22": {
       		//Position (1, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.m22;
            }
        },

       "dx": {
       		// Position (2, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.dx;
            }
        },

       "dy": {
       		// Position (2, 1) in a 3x3 affine transformation matrix.
            get : function() {
                return this._.dy;
            }
        },

       "alpha": {
       		// Property representing the alpha that will be applied to a display object. This is not part of matrix
       		// operations, but is used for operations like getConcatenatedMatrix to provide concatenated alpha values.
            get : function() {
                return this._.alpha;
            }
        },

       "shadow": {
       		// Property representing the shadow that will be applied to a display object. This is not part of matrix
       		// operations, but is used for operations like getConcatenatedMatrix to provide concatenated shadow values..
            get : function() {
                return this._.shadow;
            }
        },

       "compositeOperation": {
			/**
			 * Property representing the compositeOperation that will be applied to a display object. This is not part of
			 * matrix operations, but is used for operations like getConcatenatedMatrix to provide concatenated
			 * compositeOperation values. You can find a list of valid composite operations at:
			 * <a href="https://developer.mozilla.org/en/Canvas_tutorial/Compositing">https://developer.mozilla.org/en/Canvas_tutorial/Compositing</a>
			 * @property compositeOperation
			 * @type String
			 **/
            get : function() {
                return this._.compositeOperation;
            }
        },

        //Converts the specified point with Matrix and returns the result.
		multiplyPoint: /*Point*/function(/*Point */ p){
			// summary:
			//		applies the matrix to a point
			return this._multiplyPoint(p); // Point
		},
				/**
				 * 指定した矩形を Matrix で変換し、その結果を返します。
				 */
		multiplyRectangle: /*Rect*/function(/*Rect*/ rect){
			// summary:
			//		Applies the matrix to a rectangle.
			// returns: Rect
			if(this.isIdentity())
				return rect.clone(); // Rect
			var p0 = this.multiplyPoint(rect.leftTop),
				p1 = this.multiplyPoint(rect.leftBottom),
				p2 = this.multiplyPoint(rect.right),
				p3 = this.multiplyPoint(rect.rightBottom),
				minx = Math.min(p0.x, p1.x, p2.x, p3.x),
				miny = Math.min(p0.y, p1.y, p2.y, p3.y),
				maxx = Math.max(p0.x, p1.x, p2.x, p3.x),
				maxy = Math.max(p0.y, p1.y, p2.y, p3.y);
			return new Rect(minx,miny,maxx-minx,maxy-miny);  // Rect
		},
		/**
		 * Concatenates the specified matrix properties with this matrix. All parameters are required.
		 * @method prepend
		 * @param {Number} m11
		 * @param {Number} m12
		 * @param {Number} m21
		 * @param {Number} m22
		 * @param {Number} dx
		 * @param {Number} dy
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		prepend : function(m11, m12, m21, m22, dx, dy) {
			var tx1 = this.dx;
			if (m11 != 1 || m12 != 0 || m21 != 0 || m22 != 1) {
				var a1 = this.m11;
				var c1 = this.m21;
				this.m11  = a1*m11+this.m12*m21;
				this.m12  = a1*m12+this.m12*m22;
				this.m21  = c1*m11+this.m22*m21;
				this.m22  = c1*m12+this.m22*m22;
			}
			this.dx = tx1*m11+this.dy*m21+dx;
			this.dy = tx1*m12+this.dy*m22+dy;
			return this;
		},

		/**
		 * Appends the specified matrix properties with this matrix. All parameters are required.
		 * 指定した Matrixをこの Matrixに追加します。
		 * @method append
		 * @param {Number} m11
		 * @param {Number} m12
		 * @param {Number} m21
		 * @param {Number} m22
		 * @param {Number} dx
		 * @param {Number} dy
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		append : function(m11, m12, m21, m22, dx, dy) {
			var a1 = this.m11;
			var b1 = this.m12;
			var c1 = this.m21;
			var d1 = this.m22;

			this.m11  = m11*a1+m12*c1;
			this.m12  = m11*b1+m12*d1;
			this.m21  = m21*a1+m22*c1;
			this.m22  = m21*b1+m22*d1;
			this.dx = dx*a1+dy*c1+this.dx;
			this.dy = dx*b1+dy*d1+this.dy;
			return this;
		},

		/**
		 * Prepends the specified matrix with this matrix.
		 * @method prependMatrix
		 * @param {Matrix} matrix
		 **/
		prependMatrix : function(matrix) {
			this.prepend(matrix.m11, matrix.m12, matrix.m21, matrix.m22, matrix.dx, matrix.dy);
			this.prependProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
			return this;
		},

		/**
		 * Appends the specified matrix with this matrix.
		 * 指定した Matrixをこの Matrixに追加します。
		 * @method appendMatrix
		 * @param {Matrix} matrix
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		appendMatrix : function(matrix) {
			this.append(matrix.m11, matrix.m12, matrix.m21, matrix.m22, matrix.dx, matrix.dy);
			this.appendProperties(matrix.alpha, matrix.shadow,  matrix.compositeOperation);
			return this;
		},

		/**
		 * Generates matrix properties from the specified display object transform properties, and prepends them with this matrix.
		 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix();
		 * mtx.prependTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
		 * @method prependTransform
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} scaleX
		 * @param {Number} scaleY
		 * @param {Number} rotation
		 * @param {Number} skewX
		 * @param {Number} skewY
		 * @param {Number} regX Optional.
		 * @param {Number} regY Optional.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		prependTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
			if (rotation%360) {
				var r = rotation*DEG_TO_RAD;
				var cos = Math.cos(r);
				var sin = Math.sin(r);
			} else {
				cos = 1;
				sin = 0;
			}

			if (regX || regY) {
				// append the registration offset:
				this.dx -= regX; this.dy -= regY;
			}
			if (skewX || skewY) {
				// TODO: can this be combined into a single prepend operation?
				skewX *= DEG_TO_RAD;
				skewY *= DEG_TO_RAD;
				this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
				this.prepend(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
			} else {
				this.prepend(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
			}
			return this;
		},

		/**
		 * Generates matrix properties from the specified display object transform properties, and appends them with this matrix.
		 * For example, you can use this to generate a matrix from a display object: var mtx = new Matrix();
		 * mtx.appendTransform(o.x, o.y, o.scaleX, o.scaleY, o.rotation);
		 * @method appendTransform
		 * @param {Number} x
		 * @param {Number} y
		 * @param {Number} scaleX
		 * @param {Number} scaleY
		 * @param {Number} rotation
		 * @param {Number} skewX
		 * @param {Number} skewY
		 * @param {Number} regX Optional.
		 * @param {Number} regY Optional.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		appendTransform : function(x, y, scaleX, scaleY, rotation, skewX, skewY, regX, regY) {
			if (rotation%360) {
				var r = rotation*DEG_TO_RAD;
				var cos = Math.cos(r);
				var sin = Math.sin(r);
			} else {
				cos = 1;
				sin = 0;
			}

			if (skewX || skewY) {
				// TODO: can this be combined into a single append?
				skewX *= DEG_TO_RAD;
				skewY *= DEG_TO_RAD;
				this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), x, y);
				this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, 0, 0);
			} else {
				this.append(cos*scaleX, sin*scaleX, -sin*scaleY, cos*scaleY, x, y);
			}

			if (regX || regY) {
				// prepend the registration offset:
				this.dx -= regX*this.m11+regY*this.m21; 
				this.dy -= regX*this.m12+regY*this.m22;
			}
			return this;
		},

		/**
		 * Applies a rotation transformation to the matrix.
		 * この Matrix の原点を中心とする指定した角度の回転を適用します。
		 * @method rotate
		 * @param {Number} angle The angle in degrees.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		rotate : function(angle) {
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);

			var a1 = this.m11;
			var c1 = this.m21;
			var tx1 = this.dx;

			this.m11 = a1*cos-this.m12*sin;
			this.m12 = a1*sin+this.m12*cos;
			this.m21 = c1*cos-this.m22*sin;
			this.m22 = c1*sin+this.m22*cos;
			this.dx = tx1*cos-this.dy*sin;
			this.dy = tx1*sin+this.dy*cos;
			return this;
		},

		/**
		 * Applies a skew transformation to the matrix.
		 * @method skew
		 * @param {Number} skewX The amount to skew horizontally in degrees.
		 * @param {Number} skewY The amount to skew vertically in degrees.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		skew : function(skewX, skewY) {
			skewX = skewX*DEG_TO_RAD;
			skewY = skewY*DEG_TO_RAD;
			this.append(Math.cos(skewY), Math.sin(skewY), -Math.sin(skewX), Math.cos(skewX), 0, 0);
			return this;
		},

		/**
		 * Applies a scale transformation to the matrix.
		 * @method scale
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		scale : function(x, y) {
			this.m11 *= x;
			this.m22 *= y;
			this.dx *= x;
			this.dy *= y;
			return this;
		},

		/**
		 * Translates the matrix on the x and y axes.
		 * @method translate
		 * @param {Number} x
		 * @param {Number} y
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		translate : function(x, y) {
			this.dx += x;
			this.dy += y;
			return this;
		},

		/**
		 * Sets the properties of the matrix to those of an identity matrix (one that applies a null transformation).
		 * @method identity
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		identity : function() {
			this.alpha = this.m11 = this.m22 = 1;
			this.m12 = this.m21 = this.dx = this.dy = 0;
			this.shadow = this.compositeOperation = null;
			return this;
		},

		/**
		 * Inverts the matrix, causing it to perform the opposite transformation.
		 * @method invert
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		 **/
		invert : function() {
			var a1 = this.m11;
			var b1 = this.m12;
			var c1 = this.m21;
			var d1 = this.m22;
			var tx1 = this.dx;
			var n = a1*d1-b1*c1;

			this.m11 = d1/n;
			this.m12 = -b1/n;
			this.m21 = -c1/n;
			this.m22 = a1/n;
			this.dx = (c1*this.dy-d1*tx1)/n;
			this.dy = -(a1*this.dy-b1*tx1)/n;
			return this;
		},

		/**
		 * Returns true if the matrix is an identity matrix.
		 * @method isIdentity
		 * @return {Boolean}
		 **/
		isIdentity : function() {
			return this.dx == 0 && this.dy == 0 && this.m11 == 1 && this.m12 == 0 && this.m21 == 0 && this.m22 == 1;
		},

		/**
		 * Decomposes the matrix into transform properties (x, y, scaleX, scaleY, and rotation). Note that this these values
		 * may not match the transform properties you used to generate the matrix, though they will produce the same visual
		 * results.
		 * @method decompose
		 * @param {Object} target The object to apply the transform properties to. If null, then a new object will be returned.
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		decompose : function(target) {
			// TODO: it would be nice to be able to solve for whether the matrix can be decomposed into only scale/rotation
			// even when scale is negative
			if (target == null) { target = {}; }
			target.x = this.dx;
			target.y = this.dy;
			target.scaleX = Math.sqrt(this.m11 * this.m11 + this.m12 * this.m12);
			target.scaleY = Math.sqrt(this.m21 * this.m21 + this.m22 * this.m22);

			var skewX = Math.atan2(-this.m21, this.m22);
			var skewY = Math.atan2(this.m12, this.m11);

			if (skewX == skewY) {
				target.rotation = skewY/DEG_TO_RAD;
				if (this.m11 < 0 && this.m22 >= 0) {
					target.rotation += (target.rotation <= 0) ? 180 : -180;
				}
				target.skewX = target.skewY = 0;
			} else {
				target.skewX = skewX/DEG_TO_RAD;
				target.skewY = skewY/DEG_TO_RAD;
			}
			return target;
		},

		/**
		 * Reinitializes all matrix properties to those specified.
		 * @method appendProperties
		 * @param {Number} m11
		 * @param {Number} m12
		 * @param {Number} m21
		 * @param {Number} m22
		 * @param {Number} dx
		 * @param {Number} dy
		 * @param {Number} alpha desired alpha value
		 * @param {Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		reinitialize : function(m11,m12,m21,m22,dx,dy,alpha,shadow,compositeOperation) {
			this._initialize(m11,m12,m21,m22,dx,dy);
			this.alpha = alpha || 1;
			this.shadow = shadow;
			this.compositeOperation = compositeOperation;
			return this;
		},

		/**
		 * Appends the specified visual properties to the current matrix.
		 * @method appendProperties
		 * @param {Number} alpha desired alpha value
		 * @param {Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		appendProperties : function(alpha, shadow, compositeOperation) {
			this.alpha *= alpha;
			this.shadow = shadow || this.shadow;
			this.compositeOperation = compositeOperation || this.compositeOperation;
			return this;
		},

		/**
		 * Prepends the specified visual properties to the current matrix.
		 * @method prependProperties
		 * @param {Number} alpha desired alpha value
		 * @param {Shadow} shadow desired shadow value
		 * @param {String} compositeOperation desired composite operation value
		 * @return {Matrix} This matrix. Useful for chaining method calls.
		*/
		prependProperties : function(alpha, shadow, compositeOperation) {
			this.alpha *= alpha;
			this.shadow = this.shadow || shadow;
			this.compositeOperation = this.compositeOperation || compositeOperation;
			return this;
		},

		/**
		 *Multiply Matrix by another Matrix.
		 */
		multiply: function(matrix){
			// summary:
			//		combines matrices by multiplying them sequentially in the given order
			// matrix: Matrix
			//		a 2D matrix-like object,
			//		all subsequent arguments are matrix-like objects too

			// combine matrices
			var m11 = this.m11,m12 = this.m12,m21 = this.m21,m22=this.m22,dx=this.dx,dy=this.dy;
			var r = matrix;
			this.m11 = m11 * r.m11 + m21 * r.m12;
			this.m12 = m12 * r.m11 + m22 * r.m12;
			this.m21 = m11 * r.m21 + m21 * r.m22;
			this.m22 = m12 * r.m21 + m22 * r.m22;
			this.dx =  m11 * r.dx + m21 * r.dy + dx;
			this.dy =  m12 * r.dx + m22 * r.dy + dy;
			return this // Matrix
		},

		/**
		 * Returns a clone of the Matrix instance.
		 * @method clone
		 * @return {Matrix} a clone of the Matrix instance.
		 **/
		clone : function() {

			var _ = this._,
				mtx = new Matrix(_.m11, _.m12, _.m21, _.m22, _.dx, _.dy);
			mtx.shadow = this.shadow;
			mtx.alpha = this.alpha;
			mtx.compositeOperation = this.compositeOperation;
			return mtx;
		},

		/**
		 * Returns a string representation of this object.
		 * @method toString
		 * @return {String} a string representation of the instance.
		 **/
		toString : function() {
			var _ = this._;
			return "[Matrix (m11="+_.m11+" m12="+_.m12+" m21="+_.m21+" m22="+_.m22+" dx="+_.dx+" dy="+_.dy+")]";
		},
		
		"init" : function(m11, m12, m21, m22, dx, dy) {
			var _ = this._;
			_.m11 = m11 || 1;
			_.m12 = m12 || 0;
			_.m21 = m21 || 0;
			_.m22 = m22 || 1;
			_.dx = dx || 0;
			_.dy = dy || 0;
		}

	});
	
	langx.mixin(Matrix,{
		translate: function(a, b){
			// summary:
			//		forms a translation matrix
			// description:
			//		The resulting matrix is used to translate (move) points by specified offsets.
			// a: Number
			//		an x coordinate value
			// b: Number
			//		a y coordinate value
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1|   0| a|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   1| b|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|

			return new Matrix(1,0,0,1,a,b); // Matrix
		},
		scale: function(a, b){
			// summary:
			//		forms a scaling matrix
			// description:
			//		The resulting matrix is used to scale (magnify) points by specified offsets.
			// a: Number
			//		a scaling factor used for the x coordinate
			// b: Number?
			//		a scaling factor used for the y coordinate
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  a|   0| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   b| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			return new Matrix(a,0,0,b?b:a,0,0); // Matrix
		},
		rotate: function(angle){
			// summary:
			//		forms a rotating matrix
			// description:
			//		The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		an angle of rotation in radians (>0 for CW)
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |cos|-sin| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |sin| cos| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var cos = Math.cos(angle);
			var sin = Math.sin(angle);
			return new Matrix(cos,sin,-sin,cos,0,0); // Matrix
		},
		rotateg: function(degree){
			// summary:
			//		forms a rotating matrix
			// description:
			//		The resulting matrix is used to rotate points
			//		around the origin of coordinates (0, 0) by specified degree.
			//		Seerotate() for comparison.
			// degree: Number
			//		an angle of rotation in degrees (>0 for CW)
			// returns: Matrix
			return this.rotate(degToRad(degree)); // Matrix
		},
		skewX: function(angle) {
			//TODO : will be modified
			// summary:
			//		forms an x skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		a skewing angle in radians
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1| tan| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |  0|   1| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var tan = Math.tan(angle);
			return new Matrix(1,0,tan,1); // Matrix
		},
		skewXg: function(degree){
			//TODO : will be modified
			// summary:
			//		forms an x skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the x dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See dojox/gfx/matrix.skewX() for comparison.
			// degree: Number
			//		a skewing angle in degrees
			// returns: Matrix
			return this.skewX(degToRad(degree)); // dojox/gfx/matrix.Matrix
		},
		skewY: function(angle){
			//TODO : will be modified
			// summary:
			//		forms a y skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified angle.
			// angle: Number
			//		a skewing angle in radians
			// returns: Matrix
			//|----------| |-----------|
			//|m11|m21|dx| |  1|   0| 0|
			//|----------| |-----------|
			//|m12|m22|dy| |tan|   1| 0|
			//|----------| |-----------|
			//|  0|  0| 1| |  0|   0| 1|
			//|----------| |-----------|
			var tan = Math.tan(angle);

			return new Matrix(1,tan,0,1); // Matrix
		},
		skewYg: function(degree){
			//TODO : will be modified
			// summary:
			//		forms a y skewing matrix
			// description:
			//		The resulting matrix is used to skew points in the y dimension
			//		around the origin of coordinates (0, 0) by specified degree.
			//		See skewY() for comparison.
			// degree: Number
			//		a skewing angle in degrees
			// returns: Matrix
			return this.skewY(degToRad(degree)); // Matrix
		},
		reflect: function(a, b){
			// summary:
			//		forms a reflection matrix
			// description:
			//		The resulting matrix is used to reflect points around a vector,
			//		which goes through the origin.
			// a: dojox/gfx.Point|Number
			//		a point-like object, which specifies a vector of reflection, or an X value
			// b: Number?
			//		a Y value
			// returns: Matrix
			if(arguments.length == 1){
				b = a.y;
				a = a.x;
			}
			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, 
				xx=2 * a2 / n2 - 1, 
				xy = 2 * a * b / n2,
				yx = xy,
				yy = 2 * b2 / n2 - 1;
			return new Matrix(xx,yx,xy, yy); // Matrix
		},
		project: function(a, b){
			// summary:
			//		forms an orthogonal projection matrix
			// description:
			//		The resulting matrix is used to project points orthogonally on a vector,
			//		which goes through the origin.
			// a:   Number
			//		an x coordinate value
			// b: Number?
			//		a y coordinate value
			// returns: Matrix

			// make a unit vector
			var a2 = a * a, b2 = b * b, n2 = a2 + b2, 
				xx = a2 / n2,
				xy = a * b / n2
				yx = xy,
				yy = b2 / n2;
			return new Matrix(xx,yx,xy,yy); // Matrix
		},

		// common operations

		// high level operations

		_sandwich: function(matrix, x, y){
			// summary:
			//		applies a matrix at a central point
			// matrix: Matrix
			//		a 2D matrix-like object, which is applied at a central point
			// x: Number
			//		an x component of the central point
			// y: Number
			//		a y component of the central point
			return this.translate(x, y).multiply(matrix)
			                           .multiply(this.translate(-x, -y)); // Matrix
		},
		scaleAt: function(a, b, c, d){
			// summary:
			//		scales a picture using a specified point as a center of scaling
			// description:
			//		Compare with scale().
			// a: Number
			//		a scaling factor used for the x coordinate, or a uniform scaling factor used for both coordinates
			// b: Number?
			//		a scaling factor used for the y coordinate
			// c: Number|Point
			//		an x component of a central point, or a central point
			// d: Number
			//		a y component of a central point
			// returns: Matrix
			switch(arguments.length){
				case 4:
					// a and b are scale factor components, c and d are components of a point
					return this._sandwich(this.scale(a, b), c, d); // Matrix
				case 3:
					if(typeof c == "number"){
						return this._sandwich(this.scale(a), b, c); // Matrix
					}
					return this._sandwich(this.scale(a, b), c.x, c.y); // Matrix
			}
			return this._sandwich(this.scale(a), b.x, b.y); // Matrix
		},
		rotateAt: function(angle, a, b){
			// summary:
			//		rotates a picture using a specified point as a center of rotation
			// description:
			//		Compare with rotate().
			// angle: Number
			//		an angle of rotation in radians (>0 for CW)
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.rotate(angle), a, b); // Matrix
			}
			return this._sandwich(this.rotate(angle), a.x, a.y); // Matrix
		},
		rotategAt: function(degree, a, b){
			// summary:
			//		rotates a picture using a specified point as a center of rotation
			// description:
			//		Compare with rotateg().
			// degree: Number
			//		an angle of rotation in degrees (>0 for CW)
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.rotateg(degree), a, b); // Matrix
			}
			return this._sandwich(this.rotateg(degree), a.x, a.y); // Matrix
		},
		skewXAt: function(angle, a, b){
			// summary:
			//		skews a picture along the x axis using a specified point as a center of skewing
			// description:
			//		Compare with skewX().
			// angle: Number
			//		a skewing angle in radians
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewX(angle), a, b); // Matrix
			}
			return this._sandwich(this.skewX(angle), a.x, a.y); // Matrix
		},
		skewXgAt: function(degree, a, b){
			// summary:
			//		skews a picture along the x axis using a specified point as a center of skewing
			// description:
			//		Compare with skewXg().
			// degree: Number
			//		a skewing angle in degrees
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewXg(degree), a, b); // Matrix
			}
			return this._sandwich(this.skewXg(degree), a.x, a.y); // Matrix
		},
		skewYAt: function(angle, a, b){
			// summary:
			//		skews a picture along the y axis using a specified point as a center of skewing
			// description:
			//		Compare with skewY().
			// angle: Number
			//		a skewing angle in radians
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewY(angle), a, b); // Matrix
			}
			return this._sandwich(this.skewY(angle), a.x, a.y); // Matrix
		},
		skewYgAt: function(/* Number */ degree, /* Number||Point */ a, /* Number? */ b){
			// summary:
			//		skews a picture along the y axis using a specified point as a center of skewing
			// description:
			//		Compare with skewYg().
			// degree: Number
			//		a skewing angle in degrees
			// a: Number|dojox/gfx.Point
			//		an x component of a central point, or a central point
			// b: Number?
			//		a y component of a central point
			// returns: Matrix
			if(arguments.length > 2){
				return this._sandwich(this.skewYg(degree), a, b); // Matrix
			}
			return this._sandwich(this.skewYg(degree), a.x, a.y); // Matrix
		}
	
	
	});

	return Matrix;
});

define('skylark-utils-math/transform/Transform',[
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

define('skylark-utils-math/transform/MatrixTransform',[
    "skylark-langx/langx",
    "../math",
	"./Transform",
	"../Point",
	"../Rect"
],function(langx,math,Transform,Point,Rect) {

    var MatrixTransform = math.MatrixTransform = Transform.inherit({
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

define('skylark-utils-math/transform/RotateTransform',[
    "skylark-langx/langx",
    "../math",
	"./Transform",
	"./Matrix",
	"../Point",
	"../Rect"
],function(langx,math,Transform,Matrix,Point,Rect) {


    var RotateTransform = math.RotateTransform = Transform.inherit({
        "klassName": "RotateTransform",

        "value": {
            get: function() {
                return Matrix.rotateAt(this.angle, this.centerX, this.centerY);
            }
        },

        "angle": {
            get : function() {
                return this._.angle;
            }
        },
        // cy: Number
        //		The Y coordinate of the center of the circle, default value 0.
        "centerX": {
            get : function() {
                return this._.centerX;
            }
        },
        // r: Number
        //		The radius, default value 100.
        "centerY": {
            get : function() {
                return this._.centerY;
            }
        },

		clone : /*ScaleTransform*/function() {
		},
		
		transform : /*Point*/function(/*Point*/point) {
		},
		
		transformBounds : /*Rect*/function(/*Rect*/rect) {
		},
		
		"init" : function(/*Number*/angle,/*Number*/centerX,/*Number*/centerY) {
			var _ = this._ = {};
			_.angle = angle ? angle :0;
			_.centerX = centerX ? centerX :0;
			_.centerY = centerY ? centerY :0;
		}
	});

	return RotateTransform;
	
});	

define('skylark-utils-math/transform/ScaleTransform',[
    "skylark-langx/langx",
    "../math",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
], function(langx,math, Transform, Matrix, Point, Rect) {

   var ScaleTransform = math.ScaleTransform = Transform.inherit({
        "klassName": "ScaleTransform",

        "value": {
            get: function() {
                    return Matrix.scaleAt(this.scaleX, this.scaleY, this.centerX, this.centerY);
            }
        },

        "scaleX": {
            get : function() {
                return this._.scaleX;
            }
        },

        "scaleY": {
            get : function() {
                return this._.scaleY;
            }
        },

        // cy: Number
        //      The Y coordinate of the center of the circle, default value 0.
        "centerX": {
            get : function() {
                return this._.centerX;
            }
        },
        // r: Number
        //      The radius, default value 100.
        "centerY": {
            get : function() {
                return this._.centerY;
            }
        },

        clone: /*ScaleTransform*/ function() {},

        transform: /*Point*/ function( /*Point*/ point) {},

        transformBounds: /*Rect*/ function( /*Rect*/ rect) {},

        "init": function( /*Number*/ scaleX, /*Number*/ scaleY, /*Number*/ centerX, /*Number*/ centerY) {
            var _ = this._;

            _.scaleX = scaleX ? scaleX : 1;
            _.scaleY = scaleY ? scaleY : 1;
            _.centerX = centerX ? centerX : 0;
            _.centerY = centerY ? centerY : 0;
        }
    });

    return ScaleTransform;

});

define('skylark-utils-math/transform/SkewTransform',[
    "skylark-langx/langx",
    "../math",
    "./Transform",
    "./Matrix",
    "../Point",
    "../Rect"
], function(Class, Transform, Matrix, Point, Rect) {

   var SkewTransform = math.SkewTransform = Transform.inherit({
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

define('skylark-utils-math/transform/TranslateTransform',[
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

define('skylark-utils-math/main',[
    "./math",
    "./Arrow",
    "./Circle",
    "./Ellipse",
    "./Geometry",
    "./Line",
    "./Point",
    "./Polyline",
    "./PolyStar",
    "./Rect",
    "./Size",
    "./transform/Matrix",
    "./transform/MatrixTransform",
    "./transform/RotateTransform",
    "./transform/ScaleTransform",
    "./transform/SkewTransform",
    "./transform/Transform",
    "./transform/TranslateTransform"
], function(math) {

	return math;
});
define('skylark-utils-math', ['skylark-utils-math/main'], function (main) { return main; });


},this);