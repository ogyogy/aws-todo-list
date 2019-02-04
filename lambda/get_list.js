'use strict';

var aws = require('aws-sdk');
var querystring = require('querystring');

var docClient = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
var tablename = "todolist";

exports.handler = async (event) => {
    var params = querystring.parse(event.body);
    console.log(params.task);
    var items = {
        TableName: tablename,
        Item: {
            "task": params.task
        },
        ConditionExpression: 'attribute_not_exists(task)'
    };
    try {
        await docClient.put(items).promise();
        const response = {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: {},
        };
        return response;
    } catch (err) {
        const response = {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: err.message,
        };
        return response;
    }
};
