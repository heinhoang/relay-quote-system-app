import React from 'react';
import Relay from 'react-relay';
import 'whatwg-fetch';

import Quote from './quote';

class QuotesLibrary extends React.Component {
    state = { allQuotes: [] };

    componentDidMount() {
        fetch(`/graphql?query={
            allQuotes {
                id,
                text,
                author
            }
        }`)
            .then(res => res.json())
            .then(json => this.setState(json.data))
            .catch(err => console.error(err));
    }

    render() {
        return (
            <div className="quotes-list">
                {this.state.allQuotes.map(quote =>
                    <Quote key={quote.id} quote={quote} />
                )}
            </div>
        );
    }
}

// make react component work with Relay
QuotesLibrary = Relay.createContainer(QuotesLibrary, {
    fragments: {}
});

export default QuotesLibrary;