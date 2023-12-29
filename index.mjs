import {isArray, isSet} from '@taufik-nurrohman/is';
import {toCount, toEdge} from '@taufik-nurrohman/to';

export default function History(self) {
    let $ = this;
    $._history = [];
    $._historyState = -1;
    // Get history data
    $.history = function (index) {
        if (!isSet(index)) {
            return $._history;
        }
        return isSet($._history[index]) ? $._history[index] : null;
    };
    // Remove state from history
    $.loss = function (index) {
        let current;
        if (true === index) {
            $._history = [];
            $._historyState = -1;
            return [];
        }
        current = $._history.splice(isSet(index) ? index : $._historyState, 1);
        $._historyState = toEdge($._historyState - 1, [-1]);
        return current;
    };
    // Save current state to history
    $.record = function (index) {
            let {end, start} = $.$(),
            current = $._history[$._historyState] || [],
            next = [self.value, start, end];
        if (
            next[0] === current[0] &&
            next[1] === current[1] &&
            next[2] === current[2]
        ) {
            return $; // Do not save duplicate
        }
        ++$._historyState;
        return ($._history[isSet(index) ? index : $._historyState] = next), $;
    };
    // Redo previous state
    $.redo = function () {
        let state;
        $._historyState = toEdge($._historyState + 1, [0, toCount($._history) - 1]);
        state = $._history[$._historyState];
        return $.set(state[0]).select(state[1], state[2]);
    };
    // Undo current state
    $.undo = function () {
        let state;
        $._historyState = toEdge($._historyState - 1, [0, toCount($._history) - 1]);
        state = $._history[$._historyState];
        return $.set(state[0]).select(state[1], state[2]);
    };
    return $;
}