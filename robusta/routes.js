const express = require('express');
const router = express.Router();
const auth = require('../Mongodb/database/middleware/auth')
const Book = require('../Mongodb/database/models/book-schema')
var ObjectId = require('mongoose').Types.ObjectId; 


//main page
router.get('',  (req, res)=>{
    res.render('index')
});

// router.get('*', (req, res)=>{
//     res.render('404.ejs', {title : '404 Page Not Found'});
// });

//about
router.get('/weather', (req, res)=>{
    res.render('weather');
});

//services
router.get('/bookstore', (req, res)=>{
    res.render('books.ejs', {title : 'welcome to json web token'});
});

//books
router.post('/bookstore', auth, async(req, res) => {
    const book = new Book({...req.body, owner:req.user._id})
    try {
        await book.save()
        res.status(201).json({book : book})
    } catch (e) {
        res.status(400).send(e)
    }
});

//get books by owner id
router.get('/getBooks', auth, async(req, res) => {
   
    const match = {}
    const sort = {}
    if(req.query.author)
    {
        match.author = req.query.author
    }

    if(req.query.sortBy){
        const str = req.query.sortBy.split(':')
        sort[str[0]] = str[1] === 'desc' ? -1 : 1 
    }
    
    try {
        //const books = await Book.find({owner: new ObjectId(req.user._id)})
        await req.user.populate({
            path : 'books',
            match,
            options: {
                limit: parseInt(req.query.limit), // adding limit and skip to process pagination
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).json({book : req.user.books})
    } catch (e) {
        res.status(400).send({error : e.message})
        
    }
})

router.delete('/books/:id', auth, async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id)
        

        if (!book) {
            res.status(205).send({error : "no record exist!"})
        }

        res.status(200).json({response : "book has been removed"})
    } catch (e) {
        res.status(500).send({error : e})
    }
})

router.patch('/updatebooks/:id', auth, async(req, res) => {
    //updates = Object.keys(req.body)
    
    const {title, author, isbn} = req.body

    if(title === '' || author === '' || isbn === ''){
        res.status(400).send({error : 'one of your fields are empty !!'})
    }else{

        const book = await Book.findById(req.params.id)
        //console.log(book)

        try {

        book.title = title
        book.author = author
        book.isbn = isbn
         //console.log('working') 
         req.params.id = ''  
         await book.save()
        
        if (!book) {
            res.status(400).send({error : "failed to save a record!"})
        }

        res.status(200).json({book : book})

        } catch (e) { 
            res.status(400).send({error : e})            
        }
        
    }


})

module.exports = router;