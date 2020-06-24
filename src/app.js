const path = require('path')
const express = require('express')
const router = require('../robusta/routes')
const routerV1 = require('../Mongodb/database/API/version1')
const routerV2 = require('../Mongodb/database/API/version2')
const taskRouter = require('../Mongodb/database/API//task-api')
const mainIndex = require('../robusta/mainroutes');
require('../Mongodb/database/connection/mongoose');

//make a express app
const app = express();


// app.use((req, res, next) => {
//     //res.status(503).send('Site is currently down. Check back soon!')
// })

//parse json data
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

//environment PORT
//const PORT = process.env.PORT || 3000;
const port = process.env.PORT         // setting new port (3001) so this code has been included here

//access to public assets 
const publicDirectoryPath = path.join(__dirname, '../public')
//you can set your own path for view folder or rename you views folder to another and set its path
const viewPath = path.join(__dirname, '../templates/views');
//const partialsPath= path.join(__dirname, '../templates/partials');


//  important const bootstrap = path.join(__dirname, '../node_modules')
app.use('/jq', express.static(path.join(__dirname , '../node_modules/jquery/dist')));
app.use('/js', express.static(path.join(__dirname , '../node_modules/bootstrap/dist/js')));
app.use('/bootstrap', express.static(path.join(__dirname , '../node_modules/bootstrap/dist/css')));
app.use(express.static(publicDirectoryPath));
app.use('/robusta/global', router);
app.use('/task-manager-api-v1', routerV1);
app.use('/task-manager-api-v2', routerV2);
app.use('/task-api-v1', taskRouter);
app.use('/', mainIndex);


//console.log(path.join(__dirname , '../node_modules/jquery/dist'));

//set up view path and engine
app.set('view engine', 'ejs');
app.set('views', viewPath);




//make a server  after setting an environment of port
app.listen(port, () => {
    console.log('Server is up on port ' + port)
    //console.log(process.env.SECRET)
})

module.exports = app

