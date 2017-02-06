const {ObjectID} = require('mongodb');

const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

const {
    // helpers to implement the Node Interface on our server
    globalIdField,
    fromGlobalId,
    nodeDefinitions,
    // helper functions to define pagination
    connectionDefinitions,
    connectionArgs,
    connectionFromArray,
    connectionFromPromisedArray
} = require('graphql-relay');

// define nodeInterface so that we can implement
// and nodeField (will be in Root level) allows us to request node which implemented from nodeInterface
const globalIdFetcher = (globalId, {db}) => {
    // change to local id so that we can work with current schema
    const {type, id} = fromGlobalId(globalId);
    switch (type) {
        case 'QuotesLibrary':
            return quotesLibrary;
        case 'Quote':
            return db.collection('graphql_quotes').findOne(ObjectID(id));
        default:
            return null;
    }
};

const globalTypeResolver = obj => obj.type || QuoteType;

const {nodeInterface, nodeField} = nodeDefinitions(
    globalIdFetcher,
    globalTypeResolver
);

// this type for querying single quote
const QuoteType = new GraphQLObjectType({
    name: 'Quote',
    interfaces: [nodeInterface],
    fields: () => (
        {
            // convert Quote ID in MongoDB to Relay global ID
            id: globalIdField('Quote', obj => obj._id),
            text: {
                type: GraphQLString
            },
            author: {
                type: GraphQLString
            },
            likesCount: {
                type: GraphQLInt,
                resolve: () => Math.floor(10 * Math.random())
            }
        }
    )
});

// define a pagination type named `QuotesConnectionType` which is a collection of {Quote, QuoteType}
const {connectionType: QuotesConnectionType} =
    connectionDefinitions({
        name: 'Quote',
        nodeType: QuoteType
    });

// add searchTerm to connectionArgs for implementing search feature
let connectionArgsWithSearch = connectionArgs;
connectionArgsWithSearch.searchTerm = { type: GraphQLString };

// this type for querying library of quotes
const QuotesLibraryType = new GraphQLObjectType({
    name: 'QuotesLibrary',
    interfaces: [nodeInterface],
    fields: () => (
        {
            // define a uniqe global field ID
            id: globalIdField('QuotesLibrary'),
            // define a pagination `QuotesConnection` has type of `QuotesConnectionType` and
            // arguments `args` which we will pass later such as `quotesConnection(first: 100)`
            quotesConnection: {
                type: QuotesConnectionType,
                discription: 'A pagination of the quotes in the database',
                args: connectionArgsWithSearch,
                // change from promise array to connection to work with relay
                resolve: (_, args, {db}) => {
                    let findParams = {};
                    if (args.searchTerm) {
                        findParams.text = new RegExp(args.searchTerm, 'i');
                    }
                    return connectionFromPromisedArray(
                        db.collection('graphql_quotes').find(findParams).toArray(),
                        args
                    )
                }
            }
        }
    )
});

// entry point of query
// make sure the quotesLibrary object has a type property so that it works for the globalTypeResolver function
const quotesLibrary = { type: QuotesLibraryType };
// because we fetched all quotes in `QuotesLibraryType`, now we just return resolve function to a nearly empty object
const queryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: () => (
        {
            node: nodeField,
            quotesLibrary: {
                type: QuotesLibraryType,
                description: 'The Quotes Library',
                resolve: () => quotesLibrary
            }
        }
    )
});

const mySchema = new GraphQLSchema({
    query: queryType
});

module.exports = mySchema;