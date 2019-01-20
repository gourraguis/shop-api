const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')

AWS.config.setPromisesDependency(require('bluebird'))
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const JWT_EXPIRATION_TIME = '999 days'

const findUser = async (email, password) => {
    // return user or null
    const params = {
        Key: {
            "email": email
        },
        TableName: process.env.USER_TABLE
    }
    const user = await dynamoDb.get(params).promise()
    if (!user.Item) {
        throw new Error("Email is not assigned to any existing user")
    }
    if (bcrypt.compareSync(password, user.Item.hash)) {
        return user.Item
    } else {
        throw new Error("Password does not match")
    }
}

module.exports.handler = async (event, context, cb) => {
    const { email, password } = JSON.parse(event.body)

    try {
        const user = await findUser(email, password)

        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: JWT_EXPIRATION_TIME
        })
        cb(null, {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({user, token})
        })
    }
    catch (e) {
        cb(null, {
            statusCode: 401,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({error: e.message})
        })
    }
}
