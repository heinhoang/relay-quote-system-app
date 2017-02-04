const express = require('express');
const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const {graphql} = require('graphql');
const {introspectionQuery} =require('graphql/utilities');
const graphqlHTTP = require('express-graphql');
const {MongoClient} = require('mongodb');
const assert = require('assert');
const webpackConfig = require("./webpack.config");

const app = express();
const compiler = webpack(webpackConfig);

app.use(express.static('public'));
// make sure you can work with webpack HRM
app.use(webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath
}));
// use webpack-hot-middleware instead of webpack-dev-server to reload server
app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log,
    path: '/__webpack_hmr',
    heartbeat: 10 * 1000
}));

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

    // cache 'mySchema' into a file
    graphql(mySchema, introspectionQuery)
    .then(result => {
        fs.writeFileSync(
            path.join(__dirname, 'cache/schema.json'),
            JSON.stringify(result, null, 2)
        );
        console.log('Generated cached schema.json file');
    })
    .catch(console.error);

    app.listen(3000, () => {
        console.log('server running on port 3000');
    });
});