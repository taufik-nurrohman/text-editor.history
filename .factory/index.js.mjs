import {isArray, isFunction, isSet} from '@taufik-nurrohman/is';
import {toCount, toEdge} from '@taufik-nurrohman/to';

export default function History() {
    const $ = this;
    const $$ = $.constructor.prototype;
    $._history = [];
    $._historyState = -1;
    !isFunction($$.history) && ($$.history = function (of) {
        let $ = this,
            {_active, _history} = $;
        if (!_active) {
            return false;
        }
        if (!isSet(of)) {
            return _history;
        }
        return isSet(_history[of]) ? _history[of] : null;
    });
    !isFunction($$.loss) && ($$.loss = function (of) {
        let $ = this, current,
            {_active, _history, _historyState} = $;
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
        let $ = this, current, next,
            {end, start} = $.$(),
            {_active, _history, _historyState} = $;
        if (!_active) {
            return $;
        }
        current = _history[_historyState] || [];
        next = [$.get(), [start, end], Date.now()];
        if (
            next[0] === current[0] &&
            next[1][0] === current[1][0] &&
            next[1][1] === current[1][1]
        ) {
            return $; // Do not save duplicate
        }
        ++_historyState;
        $._history[isSet(of) ? of : _historyState] = next;
        $._historyState = _historyState;
        return $;
    });
    !isFunction($$.redo) && ($$.redo = function () {
        let $ = this, state,
            {_active, _history, _historyState} = $;
        if (!_active) {
            return $;
        }
        state = _history[$._historyState = toEdge(_historyState + 1, [0, toCount(_history) - 1])];
        return state ? $.set(state[0]).select(state[1][0], state[1][1]) : $;
    });
    !isFunction($$.undo) && ($$.undo = function () {
        let $ = this, state,
            {_active, _history, _historyState} = $;
        if (!_active) {
            return $;
        }
        state = _history[$._historyState = toEdge(_historyState - 1, [0, toCount(_history) - 1])];
        return state ? $.set(state[0]).select(state[1][0], state[1][1]) : $;
    });
    return $;
}

Object.defineProperty(History.prototype.constructor, 'name', {
    value: 'TextEditor.History'
});