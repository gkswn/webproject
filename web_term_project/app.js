// node_modules 에 있는 express 관련 파일을 가져온다.
const express = require('express');
const server = express();

server.use(express.static(__dirname))
server.set('view engine','ejs')
// express 는 함수이므로, 반환값을 변수에 저장한다.


// 3000 포트로 서버 오픈
server.listen(3000, function() {
    console.log("start! express server on port 3000")
})
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
