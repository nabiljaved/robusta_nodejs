const express = require('express')
const User = require('../models/user-schema')
const router = new express.Router()
const auth = require('../middleware/auth') // setting the middleware 
const multer = require('multer') // this middleware is used to process uploading files so we have to require here
const sharp = require('sharp') // to crop the image file we will use this package
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

/*API WITH ASYNC-AWAIT*/

router.post('/users',  async (req, res) => {
    const {name, email, password, password2, age} = req.body
    //console.log(req.body)
    let array = [];
 
  if (!name || !email || !password || !password2 || !age) {
    array.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    array.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 7) {
    array.push({ msg: 'Password must be at least 7 characters' });
  }

  if (age < 0) {
    array.push({ msg: 'age must be a positive number' });
  }

  if (array.length > 0) {
    return res.status(400).json({array})
  }

    const userExist = await User.findOne({email : email})
    if(userExist) {
        array.push({msg : "User already exist!"})
        return res.status(400).json({array})
    }
    
    const user = new User(req.body)
    //sendWelcomeEmail(user.email, user.name)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        
        return res.status(201).json({user, token})
    } catch (errors) {
        array.push({msg : errors.message})
        return res.status(400).json({array, name, email, password, password2, age})
    }
    
})

        // generate token by router.post

        router.post('/users/login', async (req, res) => {

            try {                
                const user = await User.findByCredentials(req.body.email, req.body.password)
                const token = await user.generateAuthToken()
                res.send({user, token})
        
            } catch (error) {
                res.status(400).send(error);
            }
        })

router.get('/getUsers', auth, async (req, res) =>{

    try {
        const user = await User.find({});
        res.status(200).send(user);
    } catch (e) {
        res.status(500).send(e);
    }

})

// router.get('/getUserById/:id', async(req, res) =>{

//     const _id = req.params.id;
//     //console.log(_id);

//     try {

//        const user = await User.findById(_id);

//         if (!user) {
//             return res.status(404).send("user is not found")
//         }
    
//         res.send(user);

//     } catch (e) {
//         res.status(500).send(e);
//     }
// })


// router.patch('/users/:id', async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowedUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
//     console.log(allowedUpdates.includes('abc'));

//     if (!isValidOperation) {
//         return res.status(400).send({ error: 'Invalid updates!' })
//     }

//     try {

//         //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

//         const user = await User.findById(req.params.id)

//         updates.forEach((update) => user[update] = req.body[update])

//         await user.save()

//         if (!user) {
//             return res.status(404).send()
//         }

//         res.send(user)
//     } catch (e) {
//         res.status(400).send(e)
//     }
// })

// router.delete('/users/:id', async (req, res) =>{
//     const _id = req.params.id;
    
//     try {

//     const user = await User.findByIdAndDelete(_id);

//     if (!user) {
//         return res.status(404).send("deleted failed")
//     }
    
//     res.send(user)

//     } catch (e) {
        
//         res.status(500).send(e)
    
//     }

// });
           
    

//my profile
router.get('/users/myProfile', auth, async (req, res)=>{
    res.status(200).send(req.user)
})

//single logout 
router.post('/user/logout', auth , async (req, res) => {

// get previous logged in tokens then remove this fresh token which was saved after log in and the database will be override
    try {
        
        req.user.tokens = req.user.tokens.filter(tokens => tokens.token != req.token) 
        await req.user.save()
        res.status(200).json({username : req.user.name, logout : 'successfully logout'})
    } catch (e) {
        res.status(500).send()
    }

})

// logout from all devices

router.post('/user/logoutAll', auth, async(req, res) =>{

    try {
        req.user.tokens = []
        await req.user.save()
        res.status(200).json({username : req.user.name, logout : 'successfully logout from all devices'})
    } catch (e) {
        res.status(500).send()
    }

})

//update my profile

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// //delete my profile
// router.delete('/user/me', auth , async (req, res) => {

//     try {

//         await req.user.remove()
//         res.status(200).json({message : 'profile deleted successfully'})
        
//     } catch (e) {
//         res.status(500).send(e)
//     }

// })


router.delete('/users/me', auth, async (req, res) => {
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

// setting destination of avatars in root of this project otherwise it will not be shown in public/images folder
var upload = multer(
    {
         //dest: 'avatars', 
         limits: {
            fileSize: 1000000
        },
        fileFilter(req, file, cb) {
            // if (!file.originalname.match(/\.(doc|docx)$/)) {
            //     return cb(new Error('Please upload a Word document'))     // validations of docs and jpg etc files
            // }

            if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
                return cb(new Error('Please upload an image'))
            }
    
            cb(undefined, true)
        }
    }
)

//upload a profile picture to local folder
// router.post('/users/me/avatar', auth, upload.single('avatar'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })


// to upload an image in server side of user's profile
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    
    //req.user.avatar = req.file.buffer

    // for resizing the image we will use this line of code by setting the size and extension 
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send({response : 'image uploaded successfully'})
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})



// to delete an image file from user's profile
router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({response : 'image deleted successfully'})
})


// to get image by user's id 
router.get('/users/:id/image', async (req, res, cb) =>{

    try {
        
        const user = await User.findById(req.params.id)
        

        if(!user || !user.avatar){
            return cb(new Error('no image or user exist'))   // using callback to show this error line when no image found in profile
        }

        res.set('Content-Type', 'image/jpg')
        res.status(200).send(user.avatar)                // it shows the status code with the result of image file u can check in the browser 
                                                        // to view an image 
    } catch (e) {
        res.status(404).send(e)
    }

    //res.send('working')

}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })       // this error line is necessary to catch the callback and then show final error
                                                            // we cant ignore this error code in this scenario
})









module.exports = router;