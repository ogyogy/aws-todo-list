'use strict';

var aws = require('aws-sdk');
var querystring = require('querystring');

var docClient = new aws.DynamoDB.DocumentClient({ region: "ap-northeast-1" });
var tablename = "todolist";

exports.handler = async (event) => {
    var params = querystring.parse(event.body);
    var items = {
        TableName: tablename,
        Key: {
            "task": params.task
        }
    };
    try {
        await docClient.delete(items).promise();
        return {
            statusCode: 200,
            body: JSON.stringify({}),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify(err),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};
