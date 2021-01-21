var express = require("express"),
app = express(),
axios = require('axios');
bodyParser = require("body-parser"),
cors = require('cors'),
port = process.env.PORT || 3000;
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(cors()); 

app.get('/',async function(req,res){
    var temp = await axios.get('http://localhost:4002/posts').catch(function(err){
        res.render('show',{posts:{}});
    });
    res.render('show',{posts:temp.data});
})

app.listen(port,function(){
    console.log('ok');
})