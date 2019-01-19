
module.exports.list = (event, context, cb) => {
    const response = {
        statusCode: 200,
        body: JSON.stringify({
            message: "lala"
        })
    }
    cb(null, response)
}