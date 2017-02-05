import React from 'react';
import Relay from 'react-relay';
import 'whatwg-fetch';
import {debounce} from 'lodash';

import Quote from './quote';
import SearchForm from './search-form';

class QuotesLibrary extends React.Component {

    constructor(props) {
        super(props);
        this.search = debounce(this.search.bind(this), 300);
    }

    search(searchTerm) {
        // `setVariables` is a relay function, 
        // it receives the `searchTerm` from the SearchForm component
        // and set it as GraphgQL variable `$searchTerm` as fragment query below
        this.props.relay.setVariables({searchTerm});
    }

    render() {
        return (
            <div className="quotes-library">
                <SearchForm searchAction={ this.search } />
                <div className="quotes-list">
                    {this.props.library.quotesConnection.edges.map(edge => 
                        <Quote key={edge.node.id} quote={edge.node} />
                    )}
                </div>
            </div>
        );
    }
}

// make react component work with Relay
QuotesLibrary = Relay.createContainer(QuotesLibrary, {
    initialVariables: {
        searchTerm: ''
    },
    fragments: {
        // function below fetch result based on GraphgQL fragment and assign to `library`
        // Relay will make `library` available in `this.props` of `QuotesLibrary`
        library: () => Relay.QL `
            fragment on QuotesLibrary {
                quotesConnection(first: 100, searchTerm: $searchTerm) {
                    edges {
                        node {
                            id
                            ${Quote.getFragment('quote')}
                        }
                    }
                }
            }
        `
    }
});

export default QuotesLibrary;