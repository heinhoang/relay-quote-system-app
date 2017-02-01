const {graphql} = require('graphql');
const readline = require('readline');
const {MongoClient} = require('mongodb');
const assert = require('assert');

const mySchema = require('./schema/main.js');

const MONGO_URL = 'mongodb://localhost:27017/test';
// Connect to mongodb
MongoClient.connect(MONGO_URL, (err, db) => {
    assert.equal(null, err);
    console.log('connected to Mongodb server');
    // client request
    const rli = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rli.question('client question:', inputQuery => {
        // add contextValue db
        graphql(mySchema, inputQuery, {}, {db}).then(result => {
            console.log('Server answer:', result.data);
            db.close(() => rli.close());
        });
    });
});