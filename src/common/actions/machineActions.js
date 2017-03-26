import * as actionTypes from '../constants/ActionTypes';
import { setAnimationSpeedAction } from './guiActions';

export function initMachineAction() {
	return {
		type: actionTypes.INITIALIZAE_MACHINE,
	};
} 

export function loadMachineAction(preloadedState) {
	return {
		type: actionTypes.LOAD_MACHINE,
		preloadedState: preloadedState
	};
} 

export function preStepAction(singleStep) {
	return {
		type: actionTypes.PRE_STEP_FORWARD,
		singleStep: singleStep
	};
}

export function stepAction(silent=false) {
	return {
		type: actionTypes.STEP_FORWARD,
		silent: silent
	};
}

export function silentRunAction() {
	return {
		type: actionTypes.SILENT_RUN,
	};
}

export function recordIntervalAction(interval) {
	return {
		type:actionTypes.RECORD_INTERVAL,
		interval: interval
	};
}

export function runMachineThunkActionCreator() {
	return (dispatch, getState) => {
		dispatch(preStepAction());
		if (getState().animationOn) {
			let interval = setInterval(() => {
				if (getState().isRunning) {
					dispatch(stepAction());
				}
			}, getState().animationSpeed);
			dispatch(recordIntervalAction(interval));
		} else {
			setTimeout(() => {
				dispatch(silentRunAction());
			}, 800);
		}
	};
}

export function setMachineSpeedThunkActionCreator(newValue) {
	return (dispatch, getState) => {
		dispatch(setAnimationSpeedAction(newValue));
		if (getState().isRunning) {
			clearInterval(getState().interval);
			dispatch(runMachineThunkActionCreator());
		}
	};
}

export function stopAction(message="", flag=false) {
	return {
		type: actionTypes.STOP,
		message: message,
		flag: flag, //show error message
	};
}

export function clearReportedErrorAction() {
	return {
		type: actionTypes.CLEAR_REPORTED_ERROR
	};
}

export function stepBackAction() {
	return {
		type: actionTypes.STEP_BACK
	};
}

export function restoreAction() {
	return {
		type: actionTypes.RESTORE
	};
}

export function redoAction() {
	return {
		type: actionTypes.REDO
	};
}

export function undoAction() {
	return {
		type: actionTypes.UNDO
	};
}

export function saveMachineAction() {
	// return {
	// 	type: actionTypes.SAVE_MACHINE
	// };

	return (dispatch, getState) => {
		var post = {
			headers: {"content-type": "application/json"},
			method: 'POST',
			body: JSON.stringify(getState())
		}
		fetch('/', post).then(function(response) {
			return response.json();
		}).then(function(body) {
			history.pushState(null, null, '/saves/' + body.id);
		});
	}
}