// node_modules 에 있는 express 관련 파일을 가져온다.
const express = require('express');
const server = express();
const mysql = require('mysql2');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const fs = require('fs');

var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
var options = {
    host:'localhost',
    user: 'root',
    password: 'sk7332590',
    database: 'tour',
    port:'3306'
}
server.use(express.json());
server.use(express.urlencoded({
    extended: false,
  }));
  
server.use(express.static(__dirname));

server.set('view engine','ejs')
// express 는 함수이므로, 반환값을 변수에 저장한다.
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'sk7332590',
    database: 'tour',
    port: '3306',
  });

// 3000 포트로 서버 오픈
server.listen(3000, () => {
    console.log('Server is running port 3000!');
    // 데이터베이스 연결
    connection.connect();
  });
  

server.get('/', function(req, res)  {
    res.sendFile(__dirname + "/index.html")
})
server.get('/notice_list.html', function(req, res)  {
    res.sendFile(__dirname + "/board/notice_list.html")
})
server.get('/notice_view.html', function(req, res)  {
    res.sendFile(__dirname + "/board/notice_view.html")
})
server.get('/program.html', function(req, res)  {
    res.sendFile(__dirname + "/board/program.html")
})
server.get('/login.html', function(req, res)  {
    res.sendFile(__dirname + "/member/login.html")
})
server.get('/signup.html', function(req, res)  {
    res.sendFile(__dirname + "/member/signup.html")
})
server.get('/login.ejs', function(req, res)  {
    res.sendFile(__dirname + "/views/login.ejs")
})
server.post('/register', function(req,res){
    const paramUser = req.body.name;
    const paramPw = req.body.pw;
    const paramUser2 = req.body.name;
    const paramGender = req.body.gender;
    const paramNumber = req.body.number;
    const paramEmail = req.body.email;
    const paramBorn = 1234;
    const paramAddress = "home";
    const params = [paramUser,paramPw,paramUser2,paramBorn,paramGender,paramAddress,paramNumber,paramEmail];
    var sql = 'INSERT INTO user (id,pw,_id,born,sex,address,number,email) VALUES(?,?,?,?,?,?,?,?)';
    //var params = [req.body.name,req.body.pw,req,body.name,req.body.gender,req.body.number,req.body.email];
    connection.query(sql,params,function(err,rows,fields){
        if(err) console.log(err);
        console.log("success");
    })
})

server.post('/content', function(req,res){
    const paramUser = "hanju";
    const paramContent = req.body.contents;
    const paramTitle = req.body.content_title;
    const params = [paramTitle,paramContent,paramUser];
    var sql = 'INSERT INTO board (title,content,user_id) VALUES(?,?,?)';
    //var params = [req.body.name,req.body.pw,req,body.name,req.body.gender,req.body.number,req.body.email];
    connection.query(sql,params,function(err,rows,fields){
        if(err) console.log(err);
        console.log("success");
    })
})

var sessionStore = new MySQLStore(options)

server.use(session({
    secret:'my key',
    resave:false,
    saveUninitialized:true,
    store: sessionStore
}))

server.post('/checked',function(req,res){
    const id = req.body.id
    const pw = req.body.pw
    var sql_insert = {id:id,pw:pw}
    connection.query('select * from user where id=?',id,function(err,rows){
        if(rows.length){
            if(rows[0].id === id){
                connection.query('select * from user where pw=?',pw,function(err,rows){
                    if(err){
                        throw err
                    }
                    if(rows.length){
                        req.session.uname = rows[0].id
                        req.session.upw = rows[0].pw
                        req.session.isLogined = true;
                        req.session.save(function(){
                            res.sendFile(__dirname + "/index.html")
                            console.log('login success')
                        })
                    }
                    else{
                        console.log('login fail')
                    }
                })
            }
        }
        else{
            console.log('login fail2')
        }
    })
})
function logincheck(req,res,next){
    if(req.session.isLogined)
        next()
    else{
        res.render('login.html')
    }
}