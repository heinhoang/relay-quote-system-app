const express = require('express');
const {graphql} = require('graphql');
const graphqlHTTP = require('express-graphql');
const {MongoClient} = require('mongodb');
const assert = require('assert');

const app = express();

const mySchema = require('./schema/main.js');

const MONGO_URL = 'mongodb://localhost:27017/test';
// Connect to mongodb
MongoClient.connect(MONGO_URL, (err, db) => {
    assert.equal(null, err);
    console.log('connected to Mongodb server');
    // client request
    app.use('/graphql', graphqlHTTP({
        schema: mySchema,
        context: {db},
        graphiql: true
    }));
    app.listen(3000, () => {
        console.log('server running on port 3000');
    });
});