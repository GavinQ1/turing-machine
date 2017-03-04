
/* GUI info */
export const ADJUST_HEAD_WIDTH = 'ADJUST_HEAD_WIDTH';
export const SET_PLAY_STATE = "SET_PLAY_STATE";
export const SET_ANIMATION_SPEED = 'SET_ANIMATION_SPEED';
export const MOVE_HEAD = 'MOVE_HEAD';
/* GUI info */

/* Actions for Head */
export const SWITCH_HEAD_MODE = 'SWITCH_HEAD_MODE';
export const WRITE_AND_MOVE = 'WRITE_AND_MOVE';
export const SHIFT_TAPE_POINTER_LEFT = 'SHIFT_TAPE_POINTER_LEFT';
export const SHIFT_TAPE_POINTER_RIGHT = 'SHIFT_TAPE_POINTER_RIGHT';
export const SET_INTERNAL_STATE = 'SET_STATE';
export const SET_CORRES_CELL_HEIGHT = 'SET_CORRES_CELL_HEIGHT';
/* Actions for Head */

/* Actions for Tape */
export const SET_ANCHOR_CELL = 'SET_ANCHOR_CELL';
export const MOVE_TAPE_LEFT = 'MOVE_TAPE_LEFT';
export const MOVE_TAPE_RIGHT = 'MOVE_TAPE_RIGHT';
export const FILL_TAPE = 'FILL_TAPE';
export const WRITE_INTO_TAPE = 'WRITE_INTO_TAPE';
export const INITIALIZAE_TAPE = 'INITIALIZAE_TAPE'; 
export const INSERT_CELL_BEFORE_HEAD = 'INSERT_CELL_BEFORE_HEAD';
export const APPEND_CELL_AFTER_TAIL = 'APPEND_CELL_AFTER_TAIL';
export const EXPAND_CELLS_BEFORE_HEAD = 'EXPAND_CELLS_BEFORE_HEAD';
export const EXPAND_CELLS_AFTER_TAIL = 'EXPAND_CELLS_AFTER_TAIL';
/* Actions for Tape */

/* Actions for Transition Table */
export const ADD_ROW = 'ADD_ROW';
export const DELETE_ROW = 'DELETE_ROW';
export const SET_ROW = 'SET_ROW';
export const SET_ROW_IN_STATE = 'SET_ROW_IN_STATE';
export const SET_ROW_NEW_STATE = 'SET_ROW_NEW_STATE';
export const SET_ROW_READ = 'SET_ROW_READ';
export const SET_ROW_WRITE = 'SET_ROW_WRITE';
export const SWITCH_ROW_DIRECTION = 'SWITCH_ROW_DIRECTION';
/* Actions for Transition Graph */

/* Actions for Turing Machine */
export const INITIALIZAE_MACHINE = 'INITIALIZAE_MACHINE';
export const STEP_FORWARD = 'STEP_FORWARD';
export const RECORD_INTERVAL = "RECORD_INTERVAL";
export const CLEAR_INTERVAL = 'CLEAR_INTERVAL'
/* Actions for Turing Machine */
