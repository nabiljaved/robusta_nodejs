require('../connection/mongoose')
const User = require('../models/user')

User.findByIdAndUpdate('5ea9c3b89428722a08005cde', { age: 28 })
.then((user) => {
    console.log(user)
    return User.countDocuments({ age: 28 })
}).then((result) => {
    console.log(result)
}).catch((e) => {
    console.log(e)
})
