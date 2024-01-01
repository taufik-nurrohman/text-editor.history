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

    function History(self) {
        var $ = this,
            history = [],
            historyState = -1;
        // Get history data
        $.history = function (of) {
            if (!isSet(of)) {
                return history;
            }
            return isSet(history[of]) ? history[of] : null;
        };
        // Remove state from history
        $.loss = function (of) {
            var current;
            if (true === of) {
                history = [];
                historyState = -1;
                return [];
            }
            current = history.splice(isSet(of) ? of : historyState, 1);
            historyState = toEdge(historyState - 1, [-1]);
            return current;
        };
        // Save current state to history
        $.record = function (of) {
            var _$$$ = $.$(),
                end = _$$$.end,
                start = _$$$.start,
                current = history[historyState] || [],
                next = [self.value, start, end];
            if (next[0] === current[0] && next[1] === current[1] && next[2] === current[2]) {
                return $; // Do not save duplicate
            }
            ++historyState;
            return history[isSet(of) ? of : historyState] = next, $;
        };
        // Redo previous state
        $.redo = function () {
            var state;
            historyState = toEdge(historyState + 1, [0, toCount(history) - 1]);
            state = history[historyState];
            return $.set(state[0]).select(state[1], state[2]);
        };
        // Undo current state
        $.undo = function () {
            var state;
            historyState = toEdge(historyState - 1, [0, toCount(history) - 1]);
            state = history[historyState];
            return $.set(state[0]).select(state[1], state[2]);
        };
        return $;
    }
    return History;
}));