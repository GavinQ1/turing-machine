/* Actions for Head */
export const WRITE_AND_MOVE = 'WRITE_AND_MOVE';
export const SHIFT_TAPE_POINTER_LEFT = 'SHIFT_TAPE_POINTER_LEFT';
export const SHIFT_TAPE_POINTER_RIGHT = 'SHIFT_TAPE_POINTER_RIGHT';
export const SET_INTERNAL_STATE = 'SET_STATE';
/* Actions for Head */

/* Actions for Tape */
export const WRITE_INTO_TAPE = 'WRITE_INTO_TAPE';
export const INITIALIZAE_TAPE = 'INITIALIZAE_TAPE'; 
export const INSERT_CELL_BEFORE_HEAD = 'INSERT_CELL_BEFORE_HEAD';
export const APPEND_CELL_AFTER_TAIL = 'APPEND_CELL_AFTER_TAIL';
export const EXPAND_CELLS_BEFORE_HEAD = 'EXPAND_CELLS_BEFORE_HEAD';
export const EXPAND_CELLS_AFTER_TAIL = 'EXPAND_CELLS_AFTER_TAIL';
/* Actions for Tape */

/* Actions for Transition Graph */
export const ADD_RULE = 'ADD_RULE';
export const SET_RULE = 'SET_RULE';
export const DELETE_RULE = 'DELETE_RULE';
/* Actions for Transition Graph */

/* Actions for Turing Machine */
export const INITIALIZAE_MACHINE = 'INITIALIZAE_MACHINE';
export const STEP_FORWARD = 'STEP_FORWARD';
/* Actions for Turing Machine */