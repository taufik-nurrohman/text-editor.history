import {isArray, isSet} from '@taufik-nurrohman/is';
import {toCount, toEdge} from '@taufik-nurrohman/to';



export default function History() {
    let $ = this,
        history = [],
        historyState = -1;
    // Get history data
    $.history = of => {
        if (!isSet(of)) {
            return history;
        }
        return isSet(history[of]) ? history[of] : null;
    };
    // Remove state from history
    $.loss = of => {
        let current;
        if (true === of) {
            history = [];
            historyState = -1;
            return null;
        }
        current = history.splice(isSet(of) ? of : historyState, 1);
        historyState = toEdge(historyState - 1, [-1]);
        return current;
    };
    // Save current state to history
    $.record = of => {
            let {end, start} = $.$(),
            current = history[historyState] || [],
            next = [$.get(), [start, end], Date.now()];
        if (
            next[0] === current[0] &&
            next[1][0] === current[1][0] &&
            next[1][1] === current[1][1]
        ) {
            return $; // Do not save duplicate
        }
        ++historyState;
        return (history[isSet(of) ? of : historyState] = next), $;
    };
    // Redo previous state
    $.redo = () => {
        let state = history[historyState = toEdge(historyState + 1, [0, toCount(history) - 1])];
        return state ? $.set(state[0]).select(state[1][0], state[1][1]) : $;
    };
    // Undo current state
    $.undo = () => {
        let state = history[historyState = toEdge(historyState - 1, [0, toCount(history) - 1])];
        return state ? $.set(state[0]).select(state[1][0], state[1][1]) : $;
    };
    return $;
}