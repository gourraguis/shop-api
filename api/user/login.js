const jwt = require('jsonwebtoken')
const AWS = require('aws-sdk')
const bcrypt = require('bcryptjs')
const middy = require('middy')
const { cors } = require('middy/middlewares')

AWS.config.setPromisesDependency(require('bluebird'))
const dynamoDb = new AWS.DynamoDB.DocumentClient()
const JWT_EXPIRATION_TIME = '999 days'

const findUser = async (email, password) => {
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

const login = async (event, context, cb) => {
    const requestBody = JSON.parse(event.body)
    const { email, password } = requestBody

    try {
        const user = await findUser(email, password)

        const token = jwt.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: JWT_EXPIRATION_TIME
        })
        cb(null, {
            statusCode: 200,
            body: JSON.stringify({
                user,
                token
            })
        })
    }
    catch (e) {
        cb(null, {
            statusCode: 401,
            body: JSON.stringify({error: e.message})
        })
    }
}

const handler = middy(login).use(cors())

module.exports = {
    handler
}
