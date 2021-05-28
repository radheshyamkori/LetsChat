const express = require('express');
//const bodyParser = require('body-parser'); not req as now depricated from express 4.16+
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

app.use(express.static(__dirname));
//app.use(bodyParser.json());
app.use(express.json());  // bodyParser depricated for express 4.16+
//app.use(bodyParser.urlencoded({extended:false}));
app.use(express.urlencoded({extended:false}));
/**let messages = [
    {name:"Radhe", message: "Hello Everybody"},
    {name:"Sikha", message: "Hi"},
    {name:"Dharam", message: "Welcome"},
    {name:"Jasmine", message: "Nice to see you all"},
];  **/
const MONGODB_URI = "mongodb+srv://node-chat-app-admin:nodechatappadmin@node-chat-app.j7uke.mongodb.net/node-chat-app?retryWrites=true&w=majority";

let Message = mongoose.model('Message', {
    name : String,
    message : String
});

let messages = [];
app.get('/messages',(req,res) => {
    //res.send('Hello World');
    Message.find({}, (err, messages) => {
        res.send(messages);
    })
   
});

app.post('/messages',(req,res) => {
    const message = new Message(req.body);
    message.save((err) => {
        if(err){
            res.sendStatus(500);
        }
       // messages.push(req.body);
        io.emit('message',req.body);
        res.sendStatus(200);
    });
    
});
io.on('connection',(socket) => {
    console.log('User Connected!');
});

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!');
});

/** mongoose.connection.on('error', err => {
    logError(err);
  });   **/
//const server = app.listen(3010, () => {
//const server = http.listen(3010, () => {   // for localhost
const server = http.listen(port, () => {   // for deploying on cloud heroku server
    //console.log('server is listening on port',server.address().port);  // for localhost
    console.log('server is listening on port %d', port);  // for cloud deployment on heroku
});

