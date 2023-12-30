import {isArray, isSet} from '@taufik-nurrohman/is';
import {toCount, toEdge} from '@taufik-nurrohman/to';

export default function History(self) {
    let $ = this,
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
        let current;
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
            let {end, start} = $.$(),
            current = history[historyState] || [],
            next = [self.value, start, end];
        if (
            next[0] === current[0] &&
            next[1] === current[1] &&
            next[2] === current[2]
        ) {
            return $; // Do not save duplicate
        }
        ++historyState;
        return (history[isSet(of) ? of : historyState] = next), $;
    };
    // Redo previous state
    $.redo = function () {
        let state;
        historyState = toEdge(historyState + 1, [0, toCount(history) - 1]);
        state = history[historyState];
        return $.set(state[0]).select(state[1], state[2]);
    };
    // Undo current state
    $.undo = function () {
        let state;
        historyState = toEdge(historyState - 1, [0, toCount(history) - 1]);
        state = history[historyState];
        return $.set(state[0]).select(state[1], state[2]);
    };
    return $;
}