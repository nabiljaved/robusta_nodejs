const express = require('express')
//const User = require('../models/user')
const User = require('../models/user')
const router = new express.Router()

/*API WITH PROMISES*/

router.post('/users', (req, res) => {
    //console.log(req.body);
    const user = new User(req.body)

    
        user.save()
        .then((user) => {
            res.status(201).send(user)
        })
        .catch((e)=>{
            res.status(400).send(e)
        });
})

router.get('/getUsers', (req, res) =>{
    User.find({})
    .then((user)=> {
        res.status(200).send(user);
    }).catch ((e) => {
        res.status(500).send(e);
    });

})

router.get('/getUserById/:id',(req, res) =>{

    const _id = req.params.id;
    //console.log(_id);

User.findById(_id).then((user) =>{

    if (!user) {
        return res.status(404).send("user is not found")
    }

    res.send(user);
})
.catch ((e) => {
        res.status(500).send(e);
    })
})


router.patch('/users/:id',(req, res) => {
    const updates = Object.keys(req.body)
    //console.log(updates);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    //console.log(allowedUpdates.includes('abc'));
    //console.log(isValidOperation);

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    
        User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        .then ((user) =>{
            if (!user) {
                return res.status(404).send()
            
            }

            res.send(user)
        })

        .catch ((e) =>{
            res.status(400).send(e)
        }) 
              
})

router.delete('/users/:id',(req, res) =>{
    const _id = req.params.id;
         
User.findByIdAndDelete(_id)
.then((user) =>{

    if (!user) {
        return res.status(404).send("deleted failed")
    }
    
    res.send(user)  

})
.catch ((e) =>{
        
        res.status(500).send(e)
    
    })

});

module.exports = router;