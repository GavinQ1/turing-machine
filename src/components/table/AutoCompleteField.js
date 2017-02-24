import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AutoCompleteField extends React.Component {
	render() {
		return (
			<MuiThemeProvider>
				<AutoComplete dataSource={this.props.dataSource} 
							  filter={this.props.filter}
							  searchText={this.props.searchText}
                              onUpdateInput={this.props.onUpdateInput}
                              textFieldStyle={this.props.styles}
                           	  errorText={this.props.errorText}
                              id={this.props.id}
                              maxLength={this.props.maxLength}
                              openOnFocus={this.props.openOnFocus}
            	/>
            </MuiThemeProvider>
		)
	}
}

AutoCompleteField.PropTypes = {
	parent: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	fieldType: PropTypes.string.isRequired,
	filter: PropTypes.func.isRequired,
	onUpdateInput: PropTypes.func.isRequired,
	styles: PropTypes.object.isRequired,
	maxLength: PropTypes.number.isRequired,
	openOnFocus: PropTypes.bool.isRequired,
}

export default AutoCompleteField;