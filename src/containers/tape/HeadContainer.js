import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction, setInternalStateAction } from '../../actions/tapeActions';
import { moveHeadAction } from '../../actions/guiActions';
import { adjustHeadWidthAction } from '../../actions/guiActions';
import { N_CELLS } from '../../constants/GUISettings';
import Head from '../../components/tape/Head';
import { standardizeTapeCellId } from '../../components/tape/Square';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';
import { getAllStates } from '../table/AutoCompleteFieldContainer';

let OLD_X = 499; 

const calcPosition = () => ((OLD_X - 9) / 49);

const focusOnCorresCell = () => {
    document.getElementById(standardizeTapeCellId(calcPosition())).focus();
}

const blurOnCorresCell = () => {
    document.getElementById(standardizeTapeCellId(calcPosition())).blur();
}

const setOldX = (ui) => {
    if ((ui.x >= 9) && (ui.x <= 989) && ((ui.x - 9) % 49 === 0)) 
        OLD_X = ui.x;
}

const headOnStart = (e, ui, dispatch) => {
    setOldX(ui);
}

const headOnStop = (e, ui, dispatch) => {
    blurOnCorresCell();
}

const headOnDrag = (e, ui, dispatch) => {
    if (ui.x < OLD_X && ui.x >= -40 && ui.x <= 989) { // Left
        dispatch(moveLeftAction());
        dispatch(moveHeadAction(true)); // left
        if (calcPosition() === 0)
            rollTapeToRight(dispatch, true);
        setOldX(ui);
        focusOnCorresCell();
    } else if (ui.x > OLD_X && ui.x <= 1038 && ui.x >= 9) {
        dispatch(moveRightAction());
        dispatch(moveHeadAction(false))
        if (calcPosition() === N_CELLS - 1)
            rollTapeToLeft(dispatch, true); // right
        setOldX(ui);
        focusOnCorresCell();
    }
}

const onUpdateInput = (searchText, dispatch) => {
    dispatch(adjustHeadWidthAction(searchText));
    dispatch(setInternalStateAction(searchText));
}

const mapStateToProps = (state, ownProps) => {
    let filter = (searchText, key) => (searchText === "" || key.startsWith(searchText));
    let dataSource = getAllStates(state);
    delete dataSource[null];

    return {
	   internalState: state.tapeInternalState,
       head_position: state.headX, 
       dataSource: Object.keys(dataSource),
       filter: filter,
       hair_styles: {
        width: state.headWidth,
        left: state.headLeftOffset,
       },
       head_styles: {
        height: state.headHeight,
        width: state.headWidth,
        left: state.headLeftOffset,
       }
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleStart: (e, ui) => { headOnStart(e, ui, dispatch) },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) },
    handleStop: (e, ui) => { headOnStop(e, ui, dispatch) },
    onUpdateInput: (searchText) => { onUpdateInput(searchText, dispatch) }
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
