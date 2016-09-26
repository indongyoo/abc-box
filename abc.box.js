/**
 * Created by piljung on 2016. 9. 26..
 */
!function(root) {
    var unique_id = 0;
    var boxes_datas = [];
    function Box(data) {
        this.cache = {};
        boxes_datas[this.box_id = ++unique_id] = (data = data || {});
    }

    Box.prototype.find = function(el) {
        if (!el || C.isArrayLike(el) && !el.length) return null;
        if (C.isString(el)) return finder(boxes_datas[this.box_id], el);
        el = C.isArrayLike(el) ? el[0] : el;
        return finder(boxes_datas[this.box_id], el.getAttribute('box_selector'));
    };

    function finder(box_data, str) {
        return C.reduce(str.split('->'), box_data, function(mem, key) {
            return function(mem, key) {
                if (!key.match(/([a-z]+)?\((.+)\)/)) return mem[key];
                return C[RegExp.$1 || 'find'](mem, C.lambda(RegExp.$2));
            }(mem, key.trim());
        });
    }

    root.Box = Box;
}(typeof global == 'object' && global.global == global && (global.G = global) || window, function(C) {
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

    function to_function (str) {
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

    function functionalize (fn) {
        if (typeof fn === 'function') {
            return fn;
        } else if (typeof fn === 'string' && /^[_a-zA-Z]\w*$/.test(fn)) {
            return function() {
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

    C.lambda = functionalize;
}(C));