const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task') // to remove task when user is deleted during log-in we have to require task
const Book = require('../models/book-schema')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a postive number')
            }
        }
    }, 
    tokens : [{
        token : {
            type : String,
            required : true
        }
    }],
    
    // setting the avatar while using uploading image scenario
    avatar : {
        type : Buffer
    }
},{
    timestamps : true // shows created add and updated account by a user
})



// auth token

userSchema.methods.generateAuthToken = async function (){

    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET)   // secret code in this line
    user.tokens = user.tokens.concat({token})

    await user.save();

    return token
}
// abstract password and tokens objects from response
userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.statics.findByCredentials = async (email, password) =>{

    const user = await User.findOne({email})

    if(!user){
        throw new Error('unable to find a user by email');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){

        throw new Error('password does not match');
    }

    return user;

}
// make relation with task 
userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'owner'
})

userSchema.virtual('books', {
    ref : 'Book-schema',
    localField : '_id',
    foreignField : 'owner'
})

             // middleware 
             
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})


// Delete user tasks when user is removed
userSchema.pre('remove', async function (next) {
    const user = this
    await Task.deleteMany({ owner: user._id })
    await Book.deleteMany({ owner: user._id })

    next()
})


const User = mongoose.model('User-schema', userSchema)

module.exports = User