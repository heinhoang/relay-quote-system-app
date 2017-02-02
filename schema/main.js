const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList
} = require('graphql');

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

const queryType = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        allQuotes: {
            type: new GraphQLList(QuoteType),
            discription: 'A list of the quotes in the database',
            resolve: (_, args, {db}) => 
            db.collection('graphql_quotes').find().toArray()
        }
    }
});

const mySchema = new GraphQLSchema({
    query: queryType
});

module.exports = mySchema;