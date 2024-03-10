/*!
 *
 * The MIT License (MIT)
 *
 * Copyright © 2024 Taufik Nurrohman <https://github.com/taufik-nurrohman>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the “Software”), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */
(function (g, f) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = f() : typeof define === 'function' && define.amd ? define(f) : (g = typeof globalThis !== 'undefined' ? globalThis : g || self, (g.TextEditor = g.TextEditor || {}, g.TextEditor.History = f()));
})(this, (function () {
    'use strict';
    var isDefined = function isDefined(x) {
        return 'undefined' !== typeof x;
    };
    var isFunction = function isFunction(x) {
        return 'function' === typeof x;
    };
    var isNull = function isNull(x) {
        return null === x;
    };
    var isSet = function isSet(x) {
        return isDefined(x) && !isNull(x);
    };
    var toCount = function toCount(x) {
        return x.length;
    };
    var toEdge = function toEdge(x, edges) {
        if (isSet(edges[0]) && x < edges[0]) {
            return edges[0];
        }
        if (isSet(edges[1]) && x > edges[1]) {
            return edges[1];
        }
        return x;
    };

    function History() {
        var $ = this;
        var $$ = $.constructor.prototype;
        $._history = [];
        $._historyState = -1;
        !isFunction($$.history) && ($$.history = function (of) {
            var $ = this,
                _active = $._active,
                _history = $._history;
            if (!_active) {
                return false;
            }
            if (!isSet(of)) {
                return _history;
            }
            return isSet(_history[of]) ? _history[of] : null;
        });
        !isFunction($$.loss) && ($$.loss = function (of) {
            var $ = this,
                current,
                _active = $._active;
            $._history;
            var _historyState = $._historyState;
            if (!_active) {
                return false;
            }
            if (true === of) {
                $._history = [];
                $._historyState = -1;
                return null;
            }
            current = $._history.splice(isSet(of) ? of : _historyState, 1);
            $._historyState = toEdge(_historyState - 1, [-1]);
            return current;
        });
        !isFunction($$.record) && ($$.record = function (of) {
            var $ = this,
                current,
                next,
                _$$$ = $.$(),
                end = _$$$.end,
                start = _$$$.start,
                _active = $._active,
                _history = $._history,
                _historyState = $._historyState;
            if (!_active) {
                return $;
            }
            current = _history[_historyState] || [];
            next = [$.get(), [start, end], Date.now()];
            if (next[0] === current[0] && next[1][0] === current[1][0] && next[1][1] === current[1][1]) {
                return $; // Do not save duplicate
            }
            ++_historyState;
            $._history[isSet(of) ? of : _historyState] = next;
            $._historyState = _historyState;
            return $;
        });
        !isFunction($$.redo) && ($$.redo = function () {
            var $ = this,
                state,
                _active = $._active,
                _history = $._history,
                _historyState = $._historyState;
            if (!_active) {
                return $;
            }
            state = _history[$._historyState = toEdge(_historyState + 1, [0, toCount(_history) - 1])];
            return state ? $.set(state[0]).select(state[1][0], state[1][1]) : $;
        });
        !isFunction($$.undo) && ($$.undo = function () {
            var $ = this,
                state,
                _active = $._active,
                _history = $._history,
                _historyState = $._historyState;
            if (!_active) {
                return $;
            }
            state = _history[$._historyState = toEdge(_historyState - 1, [0, toCount(_history) - 1])];
            return state ? $.set(state[0]).select(state[1][0], state[1][1]) : $;
        });
    }
    return History;
}));