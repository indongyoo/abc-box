/**
 * Created by piljung on 2016. 9. 26..
 */
!function (root, cLambda, makeConstructorBox) {
  root.Box = makeConstructorBox(root, cLambda);
}(typeof global == 'object' && global.global == global && (global.G = global) || window, function (C) {
  var __slice = Array.prototype.slice;

  // ## Functionalizing
  //
  // The utility functions operate on other functions. They can also operate on string
  // abbreviations for functions by calling `functionalize(...)` on their inputs.

  // SHIM
  if ('ab'.split(/a*/).length < 2) {
    if (typeof console !== "undefined" && console !== null) {
      console.log("Warning: IE6 split is not ECMAScript-compliant.  This breaks '->1'");
    }
  }

  function to_function(str) {
    var expr, leftSection, params, rightSection, sections, v, vars, _i, _len;
    params = [];
    expr = str;
    sections = expr.split(/\s*->\s*/m);
    var is_ = false;
    if (sections.length > 1) {
      while (sections.length) {
        expr = sections.pop();
        params = sections.pop().split(/\s*,\s*|\s+/m);
        sections.length && sections.push('(function(' + params + '){return (' + expr + ')})');
      }
    } else if (expr.match(/\b_\b/)) {
      is_ = true;
      params = '_';
    } else {
      leftSection = expr.match(/^\s*(?:[+*\/%&|\^\.=<>]|!=)/m);
      rightSection = expr.match(/[+\-*\/%&|\^\.=<>!]\s*$/m);
      if (leftSection || rightSection) {
        if (leftSection) {
          params.push('$1');
          expr = '$1' + expr;
        }
        if (rightSection) {
          params.push('$2');
          expr = expr + '$2';
        }
      } else {
        vars = str.replace(/(?:\b[A-Z]|\.[a-zA-Z_$])[a-zA-Z_$\d]*|[a-zA-Z_$][a-zA-Z_$\d]*\s*:|this|arguments|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, '').match(/([a-z_$][a-z_$\d]*)/gi) || [];
        for (_i = 0, _len = vars.length; _i < _len; _i++) {
          v = vars[_i];
          params.indexOf(v) >= 0 || params.push(v);
        }
      }
    }
    var f = new Function(params, 'return (' + expr + ')');
    return is_ ? f : f();
  }

  function functionalize(fn) {
    if (typeof fn === 'function') {
      return fn;
    } else if (typeof fn === 'string' && /^[_a-zA-Z]\w*$/.test(fn)) {
      return function () {
        var args, receiver, _ref;
        receiver = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
        return (_ref = receiver[fn]).call.apply(_ref, [receiver].concat(__slice.call(args)));
      };
    } else if (typeof fn.lambda === 'function') {
      return fn.lambda();
    } else if (typeof fn.toFunction === 'function') {
      return fn.toFunction();
    } else if (typeof fn === 'string') {
      return to_function(fn);
    }
  }

  return C.lambda = functionalize;
}(C), function makeBox(root, cLambda) {
  var Box = function Box(key, value) {
    var cache = {};
    var is_string = root.C.isString(key), k;
    var data = {};
    if (is_string && arguments.length == 2) data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) data[k] = key[k];
    this.__data__ = function () { return data; };
    this.__cache__ = function () { return cache; };
    this._ = data;
  };

  Box.prototype.find = function (el, is_init_cache) {
    if (!el || root.C.isArrayLike(el) && !el.length) return ;
    var str = (root.C.isString(el) ? el : (root.C.isArrayLike(el) ? el[0] : el).getAttribute('box_selector'))
      , cache = this.__cache__(), _data = finder(str, this.__data__()), _cache_val = cache[str];
    return (is_init_cache || !_cache_val) ? (cache[str] = _data) : _cache_val;
  };

  Box.prototype.set = function (key, value) {
    var is_string = root.C.isString(key), k;
    if (is_string && arguments.length == 2) this.__data__()[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) this.__data__()[k] = key[k];
    return this;
  };

  Box.prototype.unset = function(selector, key) {
    if (!key && arguments.length == 1) return root.C.unset(this.__data__(), selector);
    else if (root.C.isString(key)) return root.C.unset(this.find(selector, true), key);
  };

  Box.prototype.remove = function(selector) {
    var _arr = selector.split(/\s*->\s*/);
    return root.C.remove(this.find(_arr.slice(0, _arr.length - 1).join('->'), true), this.find(selector, true));
  };

  function finder(str, box_data) {
    return root.C.reduce(str.split(/\s*->\s*/), box_data, function (mem, key) {
      if (!key.match(/([a-z]+)?\((.+)\)/)) return mem[key];
      return C[RegExp.$1 || 'find'](mem, cLambda(RegExp.$2));
    });
  }

  return Box;

  //Box.prototype.get = function(key) {
  //    if (root.C.isString(key) && arguments.length ==1) return this.__data__()[key];
  //    else if (root.C.isArray(key)) return function(box_data, keys, obj) {
  //        for (var i = 0, len = keys.length; i < len; i++) !function(key, obj) {
  //            obj[key] = box_data[key]
  //        }(keys[i], obj);
  //        return obj;
  //    }(this.__data__(), key, {});
  //};

});