const uuid = require('uuid')
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')
const middy = require('middy')
const { cors } = require('middy/middlewares')

AWS.config.setPromisesDependency(require('bluebird'))
const dynamoDb = new AWS.DynamoDB.DocumentClient()

const submitUser = user => {
    const userInfo = {
        TableName: process.env.USER_TABLE,
        Item: user
    }
    return dynamoDb.put(userInfo).promise()
        .then(() => user)
}

const signup = async (event, context, cb) => {
    const requestBody = JSON.parse(event.body)
    const { email, password } = requestBody
    if (typeof email !== 'string' || typeof password !== 'string') {
        cb(null, {
            statusCode: 400,
            body: JSON.stringify({
                message: `Missing email or password in body`
            })
        })
        return
    }
    const hash = bcrypt.hashSync(password, 10)
    try {
        const user = await submitUser({
            id: uuid.v1(),
            email,
            hash,
            like: [],
            dislike: []
        })
        cb(null, {
            statusCode: 200,
            body: JSON.stringify({
                message: `Successfully added user with email ${email}`,
                user
            })
        })
    }
    catch (e) {
        cb(null, {
            statusCode: 500,
            body: JSON.stringify({
                message: `Unable to create user for email ${email}`,
                error: e.message
            })
        })
    }
}

const handler = middy(signup).use(cors())

module.exports = {
    handler
}