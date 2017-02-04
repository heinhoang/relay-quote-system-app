const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

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

// this type for querying library of quotes
const QuotesLibraryType = new GraphQLObjectType({
    name: 'QuotesLibrary',
    fields: {
        allQuotes: {
            type: new GraphQLList(QuoteType),
            discription: 'A list of the quotes in the database',
            resolve: (_, args, {db}) => 
            db.collection('graphql_quotes').find().toArray()
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