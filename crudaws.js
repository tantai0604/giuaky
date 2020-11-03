const AWS = require("aws-sdk")

AWS.config.update({
    region: 'ap-southeast-1',
    accessKeyId: 'AKIAXD2VACFN3NQATXGK',
    secretAccessKey: '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',
});

const dynamoDB = new AWS.DynamoDB()
const docClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'sanpham'



const params = {
    TableName: tableName,
    KeySchema: [
        { AttributeName: "masp", KeyType: "HASH" }  //Partition key
    ],
    AttributeDefinitions: [
        { AttributeName: "masp", AttributeType: "S" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 10,
        WriteCapacityUnits: 10
    }
}

dynamoDB.createTable(params, (err, data) => {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 3));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 3));
    }
});

const tablePromise = dynamoDB.listTables()
    .promise()
    .then((data) => {
        const exists = data.TableNames
            .filter(name => {
                return name === tableName;
            })
            .length > 0
        if (exists) {
            return Promise.reject('Table exists');
        }
        else {
            return dynamoDB.createTable(params).promise();
        }
    })

tablePromise.then((data) => {
    console.log(data)
}).catch((e) => {
    console.log(e)
})

const scanTable = async (tableName) => {
    const params = {
        TableName: tableName,
    };
    let scanResults = [];
    let items;
    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return scanResults;
}

scanTable('sanpham').then((result) => {
    console.log(result)
})
module.exports = {
    dynamoDB,
    tableName,
    docClient
}





