import {isSet} from '@taufik-nurrohman/is';
import {toCount, toEdge} from '@taufik-nurrohman/to';

export let _history = [];
export let _historyState = -1;

// Get history data
export const history = function(index) {
    let t = this;
    if (!isSet(index)) {
        return t._history;
    }
    return isSet(t._history[index]) ? t._history[index] : null;
};

// Remove state from history
export const loss = function(index) {
    let t = this,
        current;
    if (true === index) {
        t._history = [];
        t._historyState = -1;
        return [];
    }
    current = t._history.splice(isSet(index) ? index : t._historyState, 1);
    t._historyState = toEdge(t._historyState - 1, [-1]);
    return current;
};

// Save current state to history
export const record = function(index) {
    let t = this,
        {end, start} = t.$(),
        current = t._history[t._historyState] || [],
        next = [t.self.value, start, end];
    if (
        next[0] === current[0] &&
        next[1] === current[1] &&
        next[2] === current[2]
    ) {
        return t; // Do not save duplicate
    }
    ++t._historyState;
    return (t._history[isSet(index) ? index : t._historyState] = next), t;
};

// Redo previous state
export const redo = function() {
    let t = this,
        state;
    t._historyState = toEdge(t._historyState + 1, [0, toCount(t._history) - 1]);
    state = t._history[t._historyState];
    return t.set(state[0]).select(state[1], state[2]);
};

// Undo current state
export const undo = function() {
    let t = this,
        state;
    t._historyState = toEdge(t._historyState - 1, [0, toCount(t._history) - 1]);
    state = t._history[t._historyState];
    return t.set(state[0]).select(state[1], state[2]);
};
