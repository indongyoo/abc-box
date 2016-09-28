// ABC project
//  - https://github.com/marpple/abc-functional-javascript
//  - https://github.com/marpple/abc-box
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Byeongjin Kim, Joeun Ha, Hoonil Kim

// abc.js, abc.box.js
// (c) 2015-2016 Marpple. MIT Licensed.

//-------------------- abc.box.js -----------------------
!function (root, cLambda, makeConstructorBox) {
  root.Box = makeConstructorBox(root, cLambda);
}(typeof global == 'object' && global.global == global && (global.G = global) || window, function (C) {
  /* C.lambda forked raganwald/string-lambdas */
  return C.lambda = function (str) {
    if (typeof str !== 'string') return str;
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
  };
}(C), function makeBox(root, cLambda) {
  var Box = function Box(key, value) {
    var cache = {};
    var is_string = root.C.isString(key), k;
    var data = {};
    if (is_string && arguments.length == 2) data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) data[k] = key[k];
    this._ = function () { return data; }; // 괜찮은 이름 추천해주세요~
    this.__cache__ = function () { return cache; };
  };

  Box.prototype.find = function (el, is_init_cache) {
    if (!el || root.C.isArrayLike(el) && !el.length) return ;
    var str = (root.C.isString(el) ? el : (root.C.isArrayLike(el) ? el[0] : el).getAttribute('box_selector'));
    var _data = root.C.reduce(str.split(/\s*->\s*/), this._(), function (mem, key) {
      return !key.match(/([a-z]+)?\((.+)\)/) ? mem[key] : C[RegExp.$1 || 'find'](mem, cLambda(RegExp.$2));
    });
    var cache = this.__cache__(), _cache_val = cache[str];
    return (is_init_cache || !_cache_val) ? (cache[str] = _data) : _cache_val;
  };

  Box.prototype.set = function (key, value) {
    var is_string = root.C.isString(key), k;
    if (is_string && arguments.length == 2) this._()[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) this._()[k] = key[k];
    return this;
  };

  Box.prototype.unset = function(selector, key) {
    if (!key && arguments.length == 1) return root.C.unset(this._(), selector);
    else if (root.C.isString(key)) return root.C.unset(this.find(selector, true), key);
  };

  Box.prototype.remove = function(selector) {
    var _arr = selector.split(/\s*->\s*/);
    return root.C.remove(this.find(_arr.slice(0, _arr.length - 1).join('->'), true), this.find(selector, true));
  };

  return Box;
});