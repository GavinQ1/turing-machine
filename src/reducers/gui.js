import {
	INIT_HEAD_WIDTH,
	INIT_HEAD_LEFT_OFFSET,
	ANIMATION_SPEED,
	head_move_interval,
  	HEAD_LEFT_BOUNDARY,
  	head_right_boundary,
} from '../constants/GUISettings';

import { moveLeft, moveRight } from './tape';

export const adjustHeadWidth = (state, action) => {
	let textLength = (action.text) ? action.text.length : 0;
	let newWidth, newLeftOffset;
	let defaultTextLength = INIT_HEAD_WIDTH / 10;

	if (textLength <= defaultTextLength) {
		newWidth = INIT_HEAD_WIDTH;
		newLeftOffset = INIT_HEAD_LEFT_OFFSET;
	} else {
		let diff = textLength - defaultTextLength;
		newWidth = INIT_HEAD_WIDTH + 10 * diff;
		newLeftOffset = INIT_HEAD_LEFT_OFFSET - 5 * diff;
	}

	return Object.assign({}, state, {
		headWidth: newWidth,
		headLeftOffset: newLeftOffset
	});
}

/* SIDE EFFECT HERE!*/
export const setPlayState = (state, action) => {
	if (!action.flag && state.interval)
		clearInterval(state.interval);
	return Object.assign({}, state, {
		isRunning: action.flag
	});
}

export const setAnimationSpeed = (state, action) => {
	return Object.assign({}, state, {
		animationSpeedFactor: action.percentage,
		animationSpeed: ANIMATION_SPEED / action.percentage
	});
}

export const moveHead = (state, action) => {
	let new_head_x, new_state;
	if (action.moveLeft) {
		new_head_x = state.headX - head_move_interval();
		new_state = moveLeft(state);
	} else {
		new_head_x = state.headX + head_move_interval();
		new_state = moveRight(state);
	}

	return Object.assign({}, new_state, {
		headX: (new_head_x <= head_right_boundary() && 
				new_head_x >= HEAD_LEFT_BOUNDARY) ? new_head_x : state.headX
	});
}