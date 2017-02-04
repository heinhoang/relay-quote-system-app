import React from 'react';
import Relay from 'react-relay';
import 'whatwg-fetch';

import Quote from './quote';

class QuotesLibrary extends React.Component {

    render() {
        return (
            <div className="quotes-list">
                {this.props.library.allQuotes.map(quote => 
                    <Quote key={quote.id} quote={quote} />
                )}
            </div>
        );
    }
}

// make react component work with Relay
QuotesLibrary = Relay.createContainer(QuotesLibrary, {
    fragments: {
        // function below fetch result based on GraphgQL fragment and assign to `library`
        // Relay will make `library` available in `this.props` of `QuotesLibrary`
        library: () => Relay.QL `
            fragment AllQuotes on QuotesLibrary {
                allQuotes {
                    id
                    ${Quote.getFragment('quote')}
                }
            }
        `
    }
});

export default QuotesLibrary;