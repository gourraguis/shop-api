const jwt = require('jsonwebtoken')
const middy = require('middy')
const { cors } = require('middy/middlewares')

const buildIAMPolicy = (userId, effect, resource, context) => {
    return {
        principalId: userId,
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        },
        context,
    }
}

const authorize = (event, context, callback) => {
    const token = event.authorizationToken

    try {
        const { user } = jwt.verify(token, process.env.JWT_SECRET)

        const userId = user.email
        const authorizerContext = { user: JSON.stringify(user) }
        const policyDocument = buildIAMPolicy(userId, 'Allow', event.methodArn, authorizerContext)

        callback(null, policyDocument)
    } catch (e) {
        callback('Unauthorized')
    }
}

const handler = middy(authorize).use(cors())

module.exports = {
    handler
}