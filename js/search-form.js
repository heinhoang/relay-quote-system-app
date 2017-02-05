import React from 'react';

class SearchForm extends React.Component {
    static propTypes = {
        searchAction: React.PropTypes.func.isRequired
    }

    handleChange = event => {
        // get `event.target.value` and deligate to `this.props.searchAction` which parents will implement it
        this.props.searchAction(event.target.value);
    };

    render() {
        return (
            <form className="navbar-form" role="search">
                <input type="text" className="form-control"
                    placeholder="Search..."
                    onChange={this.handleChange} />
            </form>
        );
    }
}

export default SearchForm;