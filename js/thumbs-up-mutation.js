import Relay from 'react-relay';

class ThumbsUpMutation extends Relay.Mutation {

    // define GraphQL fragment to get quote ID to include in 'quote.js'
    static fragments ={
        quote: () => Relay.QL `
            fragment on Quote {
                id
                likesCount
            }
        `
    };

    // which mutation you want to use
    getMutation() {
        return Relay.QL `
            mutation {
                thumbsUp
            }
        `;
    }

    // What your input value
    getVariables() {
        return {
            // this.props will be from `Relay.Store.commitUpdate({props})`
            quoteId: this.props.quote.id
        };
    }

    // what output of changes
    // will provide with sth like this `props.quote.likesCount` via Relay.Store.commitUpdate
    getFatQuery() {
        return Relay.QL `
            fragment on ThumbsUpMutationPayload {
                quote {
                    likesCount
                }
            }
        `;
    }

    // what to do with the response of the mutation request
    // here, we want to change the quote object identified by the ID
    getConfigs() {
        return [
            {
                type: 'FIELDS_CHANGE',
                fieldIDs: {
                    quote: this.props.quote.id
                }
            }
        ];
    }

    getOptimisticResponse() {
        return {
            quote: {
                id: this.props.quote.id,
                likesCount: this.props.quote.likesCount + 1
            }
        };
    }

}

export default ThumbsUpMutation;