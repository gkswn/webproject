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
}
server.use(express.json());
server.use(express.urlencoded({
    extended: false,
}));
var sessionStore = new MySQLStore(options)

server.use(session({
    secret:'my key',
    resave:false,
    saveUninitialized:true,
    store: sessionStore
}))

server.use(express.static(__dirname));

server.set('view engine','ejs');
server.set('views','./views');
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
    res.render("index.ejs")
})
server.get('/notice_list', function(req, res)  {
    connection.query(`SELECT * FROM board`,function(err,rows){
        if(err){throw err;}
        console.log(rows)
        res.render("notice_list.ejs",{'data':rows},function(err3,html){
            if(err3){throw err3;}
                res.end(html)
            })
        })
})

server.get('/notice_view/:i', function(req, res)  {
    var page = req.params.i;
   connection.query(`SELECT * FROM board`,function(err,rows){
        if(err){throw err;}
        res.render("notice_view.ejs",{'data':rows[page]},function(err3,html){
        if(err3){
            throw err3;
            }
            res.end(html)
        })
    })
})
server.get('/program', function(req, res)  {
    res.render("program.ejs")
})
server.get('/login', function(req, res)  {
    res.render("login.ejs")
})
server.get('/signup', function(req, res)  {
    res.render("signup.ejs")
})
server.get('/mypage',function(req,res){
    connection.query(`SELECT * FROM user`,function(err,rows){
        if(err){throw err;}
        connection.query('SELECT * FROM user WHERE id=?',[req.session.uname],function(err2,rows){
            if(err2){throw err2;}
            res.render("mypage.ejs",{'data':rows[0]},function(err3,html){
                if(err3){
                    if(err3){throw err3;}
                }
                res.end(html)
            })
        })
    })
    
})
server.get('/logined_program',function(req,res){
    res.render("logined_program.ejs")
})
server.get('/write_form',function(req,res){
    res.render("write_form.ejs")
})
server.get('/log_mypage',function(req,res){
    res.render("log_mypage.ejs")
})
server.get('/logined_notice_list',function(req,res){
    connection.query(`SELECT * FROM board`,function(err,rows){
        if(err){throw err;}
        console.log(rows)
        res.render("logined_notice_list.ejs",{'data':rows},function(err3,html){
            if(err3){throw err3;}
                res.end(html)
            })
        })
    //res.render("logined_notice_list.ejs")
})
server.get('/logined_notice_view/:i',function(req,res){
    var page = req.params.i;
   connection.query(`SELECT * FROM board`,function(err,rows){
        if(err){throw err;}
        res.render("logined_notice_view.ejs",{'data':rows[page]},function(err3,html){
        if(err3){
            throw err3;
            }
            res.end(html)
        })
        })
})
server.get('/logined_index/:writer',function(req,res){
    var [writer,title] = req.params.writer.split(',')
    if(writer === req.session.uname){
        connection.query('DELETE FROM board WHERE title = ?',title,function(err,rows){
            if(err){throw err;}
            res.redirect("/logined_index")
        })
    }
    else{
        res.redirect("/logined_index")
    }
})
server.get('/logined_index',function(req,res){
    res.render("logined_index.ejs")
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
    const paramUser = req.session.uname;
    const paramContent = req.body.contents;
    const paramTitle = req.body.content_title;
    const params = [paramTitle,paramContent,paramUser];
    var sql = 'INSERT INTO board (title,content,user_id) VALUES(?,?,?)';
    
    connection.query(sql,params,function(err,rows,fields){
        if(err) console.log(err);
        res.redirect('/logined_notice_list')
    })
})


server.post('/checked',function(req,res){
    const id = req.body.id
    const pw = req.body.pw
    var sql_insert = {id:id,pw:pw}
    connection.query('select * from user where id=?',[id],function(err,rows){
        if(rows.length){
            if(rows[0].id === id){
                connection.query('select * from user where pw=?',[pw],function(err,rows){
                    if(err){
                        throw err
                    }
                    if(rows.length){
                        req.session.uname = id
                        req.session.upw = pw
                        req.session.isLogined = true;
                        logined_id = req.session.uname
                        req.session.save(function(){

                            res.redirect('/logined_index')
                        })
                    }
                    else{
                        res.render('index.ejs')
                    }
                })
            }
        }
        else{
            res.render('index.ejs')
        }
    })
})
server.get('/logout',function(req,res){
    console.log('로그아웃 성공');
    console.log(req.session)
    req.session.destroy(function(){
      res.redirect('/')
    });
});
server.post('/myupdate',function(req,res){
    const email = req.body.email
    const pw = req.body.pw
    const number = req.body.number
    const sex = req.body.gender
    const address = req.body.address
    const params = [email,pw,number,sex,address,req.session.uname];
    var sql= 'UPDATE user SET email=?, pw=?, number=?, sex=?, address=? WHERE id=? ';
    connection.query(sql,params,function(err,result,fields){
        if(err){
            console.log(err)
        }else{
            res.redirect('/logined_index')
        }
    })
})
