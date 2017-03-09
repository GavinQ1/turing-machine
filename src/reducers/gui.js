import {
	MAX_CELL_NUM,
	BREAK_POINT,
	INIT_HEAD_WIDTH,
	INIT_HEAD_LEFT_OFFSET,
	ANIMATION_SPEED,
	HEAD_MOVE_INTERVAL,
  	HEAD_LEFT_BOUNDARY,
} from '../constants/GUISettings';
import { moveLeft, moveRight } from './tape';


export function adjustHeadWidth(state, action) {
	let text = (action.text) ? action.text : state.tapeInternalState.toString();
	let textLength = text.length + 2;
	let newWidth, newLeftOffset;
	let defaultTextLength = INIT_HEAD_WIDTH / 10;

	if (textLength <= defaultTextLength - 2) {
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
/* IF THE MACHINE IS RUNNING AND WANTED TO BE STOPPED,
	clearInterval WILL BE CALLED	
*/
export function setPlayState(state, action) {
	if (!action.flag && state.interval) {
		clearInterval(state.interval); 
	}

	return Object.assign({}, state, {
		isRunning: action.flag
	});
}

/*
	Handles speed changes
*/
export function setAnimationSpeed(state, action) {
	return Object.assign({}, state, {
		animationSpeedFactor: action.percentage,
		animationSpeed: ANIMATION_SPEED / action.percentage 
	});
}

/*
	WRAPPER FUNCTION:
	Handles model changes and view changes for Head
*/
export function moveHead(state, action) {
	let new_head_x, new_state;

	// model changes
	if (action.moveLeft) {
		new_head_x = state.headX - HEAD_MOVE_INTERVAL;
		new_state = moveLeft(state);
	} else {
		new_head_x = state.headX + HEAD_MOVE_INTERVAL;
		new_state = moveRight(state);
	}

	// view changes
	return Object.assign({}, new_state, {
		headX: (new_head_x <= new_state.rightBoundary && 
				new_head_x >= HEAD_LEFT_BOUNDARY) ? new_head_x : state.headX
	});
}

export function resizeScreenAndTape(state, action) {
	let newScreenSize = action.screenWidth;
	let newTapeSpace = newScreenSize * 0.9 - 96;
	let newCellNum;
	let new_state = state;
	if (newTapeSpace < BREAK_POINT) {
		let diff = Math.ceil((BREAK_POINT-newTapeSpace)/HEAD_MOVE_INTERVAL)
		newCellNum = MAX_CELL_NUM - diff;
	} else {
		newCellNum = MAX_CELL_NUM;
	}

	let midPoint = Math.floor(newCellNum/2);
	new_state = Object.assign({}, new_state, {
		screenSize: newScreenSize,
		cellNum: newCellNum,
		headX: HEAD_LEFT_BOUNDARY + midPoint * HEAD_MOVE_INTERVAL,
		tapePointer: new_state.anchorCell + midPoint,
		rightBoundary: HEAD_LEFT_BOUNDARY + (newCellNum-1) * HEAD_MOVE_INTERVAL,
	});

	console.log("Cell Num: " + newCellNum + " Anchor: " + new_state.anchorCell + " Pointer: " + new_state.tapePointer);

	return new_state;
}