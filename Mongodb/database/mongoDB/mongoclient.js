// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID } = require('mongodb')


const connectionURL = "mongodb://127.0.0.1:27017";
const databaseName = "task-manager";

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {

    if (error) {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    //insert one document 

    // db.collection('users').insertOne({
    //     name : 'ahmed',
    //     age : 27,

    // }, (error, result) =>{

    //     if(error){
    //         return console.log('unable to insert a user')
    //     }

    //     console.log(result.ops);
    // });


//insert many document 

db.collection('users').insertMany([

    {
        name : 'asim',
        age : 22,
    
    },
    {
        name : 'raza',
        age : 32,
    
    }

], (error, result) =>{

    if(error){
        return console.log('unable to insert a user')
    }

    console.log(result.ops);
});


        // READ OPERATION FIND ONE 

        //  db.collection('users').findOne({_id : new ObjectID("5ea877207908151cec11b00e")} , (error, user) =>{

        //         if(error){
        //             return console.log('unable to insert a user')
        //         }

        //         console.log(user);

        //  });

        // READ OPERATION FIND MANY
        
        
        //  db.collection('users').find({age : 22}).toArray((error, user) =>{

        //         if(error){
        //             return console.log('unable to insert a user')
        //         }

        //         console.log(user);

        //  });

        // UPDATE ONE 

                    
            // db.collection('users').updateOne({_id: new ObjectID("5ea877207908151cec11b00e")}, 
            // {
            //         $set: {
            //             age: 50
            //         }
            // }).then((result) => {
            //         console.log(result)
            // }).catch((error) => {
            //         console.log(error)
            // })

        //UPDATE MANY

    // db.collection('users').updateMany({
    //     _id : new ObjectID("5ea8784d555a841458baed0b"),
    //     _id : new ObjectID("5ea8792649eb0318f014483d")
        
    // }, {
    //     $set: {
    //         age: 122
    //     }
    // }).then((result) => {
    //     console.log(result.modifiedCount)
    // }).catch((error) => {
    //     console.log(error)
    // })

    //DELETE MANY

    db.collection('users').deleteMany({
        age : 122
        
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    //DELETE ONE

    
    db.collection('users').deleteOne({
        
        _id : new ObjectID("5ea8798eb9b0334bb0b009b5")

    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


});