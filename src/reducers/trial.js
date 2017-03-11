import * as tape from './tape';
import * as gui from './gui';
import { EXCEED_MAX_STEP_LIMIT, DIFF_FINAL_STATE, DIFF_FINAL_TAPE } from '../constants/Messages';

import { HALT, BLANK } from '../constants/index';
import { MAX_STEP_LIMIT } from '../constants/GUISettings';

// import { UNDEFINED_RULE, EXCEED_MAX_STEP_LIMIT, DIFF_FINAL_STATE } from '../constants/Messages';


/*
const sandbox = {
	stepCount: 0,
	tapeHead: 0, 
	tapeTail: 0, 
	tapePointer: 0, 
	tapeCellsById: [], 
	tapeInternalState: null, 
}
*/

export const STATUS = ["WAITING", "PASS", "FAIL", "TIMEOUT"];
export const STATUS_CODE_WAITING = 0;
export const STATUS_CODE_PASS = 1;
export const STATUS_CODE_FAIL = 2;
export const STATUS_CODE_TIMEOUT = 3;

export const standardizeTestReportId = (id) => "REPORT-OF-" + id;

const traceSuccessTrialStep = (step) => {
	if (step > 1)
		return step + " steps";
	return step + " step";
}

const traceFailingStep = (step) => "Fail at step " + step + ".";

const isExpected = (finalSandbox, trial) => {
	let result = {
		status: STATUS_CODE_PASS,
		feedback: "",
		fullreport: "",
		finalState: finalSandbox,
	};

	if (finalSandbox.tapeInternalState !== trial.expectedFinalState) {
		result.status = STATUS_CODE_FAIL;
		result.feedback = DIFF_FINAL_STATE;
		result.fullreport = DIFF_FINAL_STATE + " Expected: " + trial.expectedFinalState +
							"; You have: " + finalSandbox.tapeInternalState; 
		return result;
	}

	for (let i = 0; i < trial.expectedFinalTape.length; i++) {
		let id = finalSandbox.tapeCellsById[i];
		if (finalSandbox[id].val !== trial.expectedFinalTape[i].toString()) {
			result.status = STATUS_CODE_FAIL;
			result.feedback = DIFF_FINAL_TAPE;
			result.fullreport = DIFF_FINAL_STATE + 
							" Expected at index " + i + " : " + trial.expectedFinalTape[i] +
							"; You have: " + finalSandbox[id].val; 
			return result;
		}
	}

	return result;
}

function createTrial(id, startState, expectedFinalState, tape=[], expectedFinalTape=[],
					tapePointer=0, sourceFile=null) {
	return {
		id: id,
		startState: startState,
		expectedFinalState: expectedFinalState,
		startTape: tape,
		expectedFinalTape: expectedFinalTape,

		tapePointer: tapePointer,
		sourceFile: sourceFile,
		testReportId: standardizeTestReportId(id),
	};
}

// function cloneTrial(trial) {
// 	return {
// 		id: trial.id,
// 		startState: trial.startState,
// 		expectedFinalState: trial.expectedFinalState,
// 		startTape: trial.tape.slice(),
// 		expectedFinalTape: trial.expectedFinalTape.slice(),

// 		tapePointer: trial.tapePointer,
// 		sourceFile: trial.sourceFile,
// 		testReportId: trial.testReportId,
// 	};
// }

function createTestReport(sourceId, sourceFile, statusCode, feedback, stepCount, fullreport, id) {
	return {
		sourceId: sourceId,
		sourceFile: sourceFile,
		status: statusCode,
		feedback: feedback,
		stepCount: stepCount,
		fullreport: fullreport,
		id: id
	}
}

function createSandbox(trial) {
	let sandbox = {
		stepCount: 0,
		anchorCell: 0,
		tapeHead: 0,
		tapeTail: 0,
		tapeCellsById: [],
		tapePointer: trial.tapePointer,
		tapeInternalState: trial.startState
	};
	for (let i = 0; i < trial.startTape.length; i++) {
		let val = trial.startTape[i];
		sandbox = tape.appendAfterTail(sandbox, { val: val });
	}

	let expandTo = trial.tapePointer;
	if (expandTo < 0) {
		sandbox = tape.expandBeforeHead(sandbox, { n: -expandTo + 5});
	} else if (expandTo > 0) {
		expandTo -= trial.startTape.length;
		if (expandTo > 0)
			sandbox = tape.expandAfterTail(sandbox, {n: expandTo + 5});
	}

	return sandbox;
}

export function deleteTrial(state, action) {
	let new_state = Object.assign({}, state, {
		testsById: state.testsById.filter(tid => tid !== action.id)
	})

	delete new_state[new_state[action.id]].testReportId;
	delete new_state[action.id];

	return new_state;
}

export function addTrial(state, action) {
	if (state[action.id] !== undefined) return state;

	let new_state = Object.assign({}, state, {
		testsById: state.testsById.slice()
	})

	new_state.testsById.push(action.id);
	let trial = createTrial(action.id, action.startState, action.expectedFinalState, 
							action.tape, action.tapePointer, 
							action.expectedTape, action.sourceFile);

	new_state[action.id] = trial;

	return new_state;
}


export function preRunTrial(state, action) {
	let new_state = Object.assign({}, state, {
		runningTrials: state.runningTrials.slice()
	});

	new_state.runningTrials.push(action.id);
	let testReportId = new_state[new_state[action.id].testReportId];
	delete new_state[testReportId];

	return new_state;
}

export function runTrial(state, action) {
	let trial = state[action.sourceId];

	let sandbox = createSandbox(trial);
	while (sandbox.tapeInternalState !== HALT) {

		if (sandbox.stepCount > MAX_STEP_LIMIT) {
			return reportTestResult(state, {
				sourceId: action.sourceId,
				sourceFile: trial.sourceFile,
				status: STATUS_CODE_TIMEOUT,
				feedback: EXCEED_MAX_STEP_LIMIT,
				fullreport: EXCEED_MAX_STEP_LIMIT + " " + traceFailingStep(sandbox.stepCount),
				stepCount: sandbox.stepCount,
			});
		}

		let keyS = sandbox.tapeInternalState, keyV = tape.read(sandbox);
		let ruleId = null;
		for (var i = 0; i < state.rowsById.length; i++) {
			let row = state[state.rowsById[i]];
			if (row.in_state === keyS && row.read === keyV) {
				ruleId = state.rowsById[i];
				break;
			}
		}

		if (ruleId === null) {
			// return reportTestResult(state, {
			// 	sourceId: action.sourceId,
			// 	sourceFile: trial.sourceFile,
			// 	status: STATUS_CODE_FAIL,
			// 	feedback: UNDEFINED_RULE + " " + traceFailingStep(sandbox.stepCount),
			// 	stepCount: sandbox.stepCount,
			// });
			break;
		}

		let rule = state[ruleId];
		sandbox = tape.writeIntoTape(sandbox, {val: rule.write});
		sandbox.tapeInternalState = rule.new_state;
		if (rule.isLeft){
			sandbox = tape.moveLeft(sandbox);
		} else {
			sandbox = tape.moveRight(sandbox);
		}
		sandbox.stepCount++;

	}

	let result = isExpected(sandbox, trial);
	return reportTestResult(state, {
		sourceId: action.sourceId,
		sourceFile: trial.sourceFile,
		status: result.status,
		feedback: (result.status === STATUS_CODE_PASS) ? traceSuccessTrialStep(sandbox.stepCount) : result.feedback,
		stepCount: sandbox.stepCount,
		fullreport: result.fullreport
	});
}


export function reportTestResult(state, action) {
	let new_state = Object.assign({}, state, {
		runningTrials: state.runningTrials.filter(tid => tid !== action.sourceId),
		// isRunningTrial: false,
	});

	let id = standardizeTestReportId(action.sourceId);
	new_state[id] = createTestReport(
		action.sourceId, action.sourceFile,
		action.status, action.feedback,
		action.stepCount, action.fullreport, id
	);
	return new_state;
}

export function loadTrial(state, action) {
	let trial = state[action.id];

	let new_state = tape.initializeTape(state, {});
	new_state = tape.setInternalState(new_state, {state: trial.startState});

	let offset = trial.tapePointer - new_state.tapePointer;
	let moveLeft;
	if (offset < 0) {
		offset = -offset;
		moveLeft = true; 
	} else if (offset > 0) {
		moveLeft = false;
	}

	while (offset--) {
		new_state = gui.moveHead(new_state, {moveLeft: moveLeft});
	}
	let anchorCell = new_state.anchorCell;
	let highlightedCellOrder = new_state.highlightedCellOrder;

	new_state.tapePointer = 0;
	new_state.anchorCell = 0;
	for (let i = 0; i < trial.startTape.length; i++) {
		let val = trial.startTape[i].toString();
		if (val === BLANK)
			val = "";
		new_state = tape.writeIntoTape(new_state, { val: val});
		new_state = tape.moveRight(new_state);
	}
	new_state.tapePointer = trial.tapePointer;
	new_state.anchorCell = anchorCell;
	new_state.highlightedCellOrder = highlightedCellOrder;

	return new_state;
}

export function toggleIsRunningTrial(state, action) {
	let flag = (action.flag !== undefined) ? action.flag : !state.flag;

	return Object.assign({}, state, {
		isRunningTrial: flag
	});
}


export function clearTestResults(state, action) {
	let new_state = Object.assign({}, state);
	for (let i = 0; i < new_state.testsById.length; i++) {
		let testReportId = new_state[new_state.testsById[i]].testReportId;

		delete new_state[testReportId];
	}

	return new_state;
}