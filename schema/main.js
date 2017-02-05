const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

// helper functions to define pagination
const {
    connectionDefinitions,
    connectionArgs,
    connectionFromArray,
    connectionFromPromisedArray
} = require('graphql-relay');

// this type for querying single quote
const QuoteType = new GraphQLObjectType({
    name: 'Quote',
    fields: {
        id: {
            type: GraphQLString,
            resolve: obj => obj._id
        },
        text: {
            type: GraphQLString
        },
        author: {
            type: GraphQLString
        }
    }
});

// define a pagination type named `QuotesConnectionType` which is a collection of {Quote, QuoteType}
const {connectionType: QuotesConnectionType} = 
connectionDefinitions({
    name: 'Quote',
    nodeType: QuoteType
});

// add searchTerm to connectionArgs for implementing search feature
let connectionArgsWithSearch = connectionArgs;
connectionArgsWithSearch.searchTerm = {type: GraphQLString};

// this type for querying library of quotes
const QuotesLibraryType = new GraphQLObjectType({
    name: 'QuotesLibrary',
    fields: {
        // define a pagination `QuotesConnection` has type of `QuotesConnectionType` and
        // arguments `args` which we will pass later such as `quotesConnection(first: 100)`
        quotesConnection: {
            type: QuotesConnectionType,
            discription: 'A pagination of the quotes in the database',
            args: connectionArgsWithSearch,
            // change from promise array to connection to work with relay
            resolve: (_, args, {db}) => {
                let findParams = {};
                if(args.searchTerm) {
                    findParams.text = new RegExp(args.searchTerm, 'i');
                }
                return connectionFromPromisedArray(
                    db.collection('graphql_quotes').find(findParams).toArray(),
                    args
                )
            }
        }
    }
});

// entry point of query
const QuotesLibrary = {};
// because we fetched all quotes in `QuotesLibraryType`, now we just return resolve function to empty object
const queryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        quotesLibrary: {
            type: QuotesLibraryType,
            description: 'The Quotes Library',
            resolve: () => QuotesLibrary
        }
    }
});

const mySchema = new GraphQLSchema({
    query: queryType
});

module.exports = mySchema;