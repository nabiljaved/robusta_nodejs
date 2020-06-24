const jwt = require('jsonwebtoken')
const User = require('../models/user-schema')

const auth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        //console.log(token)
        const decoded = jwt.verify(token, process.env.SECRET) // securing secret key
        //console.log(decoded)
        const user = await User.findOne({_id: decoded._id, 'tokens.token' : token})

        if (!user) {
            throw new Error()
        }

        req.user = user
        req.token = token  // for log out token
        next()

    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' })
    }

}

module.exports = auth

