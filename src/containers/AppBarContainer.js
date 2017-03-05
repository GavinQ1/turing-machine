import { connect } from 'react-redux';
import AppToolBar from '../components/AppBar';
import { setPlayStateAction, setAnimationSpeedAction } from '../actions/guiActions';
import { highlightCorrespondingCellAction, initializeTapeAction } from '../actions/tapeActions';
import {
	stepAction, 
	stopAction,
	runMachineThunkActionCreator,
	stepBackAction,
	restoreAction,
	undoAction,
	redoAction
} from '../actions/index';
import { N_CELLS } from '../constants/GUISettings';

const standardizeAnimationSpeedLabel = (speed) => ("x " + parseFloat(speed).toFixed(1));


function handleRun(dispatch) {
	dispatch(setPlayStateAction(true));
	dispatch(highlightCorrespondingCellAction(true));
	dispatch(runMachineThunkActionCreator());
}

const handlePause = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleLast = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(stepBackAction());
}

const handleNext = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(stepAction());
}

const handleRestore = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(restoreAction());
}

const handleRedo = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(redoAction());
}

const handleUndo = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(undoAction());
}

const handleTest = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleSave = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleClearTape = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(initializeTapeAction(N_CELLS));
}

const handleSpeedChange = (newValue, dispatch, ownProps) => {
	dispatch(function(dispatch, getState){
		dispatch(setAnimationSpeedAction(newValue));
		if (getState().isRunning) {
			dispatch(stopAction());
			handleRun(dispatch, ownProps);
		}
	})
}

const mapStateToProps = (state, ownProps) => {
    return {
    	isRunning: state.isRunning,
    	animationSpeedFactor: state.animationSpeedFactor,
    	animationSpeedLabel: standardizeAnimationSpeedLabel(state.animationSpeedFactor),
    	redoAble: state.redoEditHistory.length > 0,
    	undoAble: state.undoEditHistory.length > 0
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleRun: () => { handleRun(dispatch, ownProps) },
	handlePause: () => { handlePause(dispatch, ownProps) },
	handleLast: () => { handleLast(dispatch, ownProps) },
	handleNext: () => { handleNext(dispatch, ownProps) },
	handleRestore: () => { handleRestore(dispatch, ownProps) },
	handleUndo: () => { handleUndo(dispatch, ownProps) },
	handleRedo: () => { handleRedo(dispatch, ownProps) },
	handleTest: () => { handleTest(dispatch, ownProps) },
	handleSave: () => { handleSave(dispatch, ownProps) },
	handleClearTape: () => { handleClearTape(dispatch, ownProps) },
	handleSpeedChange: (e, newValue) => { handleSpeedChange(newValue, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppToolBar);