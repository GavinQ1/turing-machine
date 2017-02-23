import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class SwitchDirectionButton extends React.Component {
	render() {
    return (
    	<MuiThemeProvider>
          <FlatButton value={this.props.value}
                      onTouchTap={this.props.switchDirection}
                      id={this.props.id}
                      label={(this.props.value)?"LEFT":"RIGHT"} 
                      />
      </MuiThemeProvider>
        )
	  }
}

SwitchDirectionButton.PropTypes = {
	switchDirection: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired
}

export default SwitchDirectionButton;