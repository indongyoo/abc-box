// ABC project
//  - https://github.com/marpple/abc-functional-javascript
//  - https://github.com/marpple/abc-box
// Project Lead - Indong Yoo
// Maintainers - Piljung Park, Hanah Choi
// Contributors - Byeongjin Kim, Joeun Ha, Hoonil Kim

// abc.js, abc.box.js
// (c) 2015-2016 Marpple. MIT Licensed.

//-------------------- abc.box.js -----------------------
!function (root, makeConstructorBox) {
  root.Box = makeConstructorBox(root);
}(typeof global == 'object' && global.global == global && (global.G = global) || window, function makeBox(root) {
  var Box = function Box(key, value) {
    var data = {}, cache = {};
    var is_string = root.C.isString(key), k;
    if (is_string && arguments.length == 2) data[key] = value;
    else if (!is_string && arguments.length == 1) for (k in key) data[k] = key[k];
    this._ = function () { return data; }; // 괜찮은 이름 추천해주세요~
    this.__cache__ = function () { return cache; };
  };

  function make_selector(el) {
    return root.C.isString(el) ? el : (root.C.isArrayLike(el) ? el[0] : el).getAttribute('box_selector');
  }

  Box.prototype.select = Box.prototype.sel = function (el, is_init_cache) {
    if (!el || root.C.isArrayLike(el) && !el.length) return ;
    var selector = make_selector(el);
    var _data = root.C.select(this._(), selector);
    var cache = this.__cache__(), _cache_val = cache[selector];
    return (is_init_cache || !_cache_val) ? (cache[selector] = _data) : _cache_val;
  };

  Box.prototype.set = function (el, value) {
    if (arguments.length == 1 &&  root.C.isObject(el)) return root.C.extend(this._(), el) && this;
    var selector = make_selector(el);
    return this.__cache__()[selector] = root.C.sel.set(this._(), selector, value);
  };

  Box.prototype.unset = function(el) {
    var selector = make_selector(el);
    return this.__cache__()[selector] = root.C.sel.unset(this._(), selector);
  };

  Box.prototype.remove = function(el) {
    var selector = make_selector(el);
    return this.__cache__()[selector] = root.C.sel.remove(this._(), selector);
  };

  Box.prototype.extend = function(el) {
    var selector = make_selector(el);
    return this.__cache__()[selector] = root.C.sel.extend.apply(null, [this._(), selector].concat(root.C.toArray(arguments).slice(1, arguments.length)));
  };

  Box.prototype.defaults = function(el) {
    var selector = make_selector(el);
    return this.__cache__()[selector] = root.C.sel.defaults.apply(null, [this._(), selector].concat(root.C.toArray(arguments).slice(1, arguments.length)));
  };

  Box.prototype.pop = function(el) {
    var selector = make_selector(el);
    return root.C.sel.pop(this._(), selector);
  };

  Box.prototype.push = function(el, item) {
    var selector = make_selector(el);
    return root.C.sel.push(this._(), selector, item);
  };

  Box.prototype.shift = function(el) {
    var selector = make_selector(el);
    return root.C.sel.shift(this._(), selector);
  };

  Box.prototype.unshift = function(el, item) {
    var selector = make_selector(el);
    return root.C.sel.unshift(this._(), selector, item);
  };

  return Box;
});