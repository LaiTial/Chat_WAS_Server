const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const cors = require("cors");

const helemt = require("helmet") // application 보안 모듈
const compression = require("compression") // 지정한 포맷으로 압축
const session = require("express-session")
const kakaoPassport = require('../passport/kakaoStrategy') // 카카오서버로 로그인할때
const NaverPassport = require('../passport/naverStrategy') // 네이버서버로 로그인할때

dotenv.config(); // 환경설정 사용
const app = express();

app.use(helemt()) // 보안 설정
app.use(cors()); // 모든 접근 허용
app.set("port", process.env.PORT);

app.use(express.json()); //버전 4.16 이후부터 사용가능, json요청을 제대로 받을 수 있다.
app.use(express.urlencoded({ extended: false })); // node.js 기본으로 내장된 query string 모듈 사용하도록
app.use(compression()) // 응답을 지정한 포맷으로 압축

// 세션 설정
app.use(session({
  secret:process.env.COOKIE_SECRET,
  resave:false,
  saveUninitialized:true,
}))

// Passport 초기화 및 세션 사용
app.use(kakaoPassport.initialize());
app.use(NaverPassport.initialize());
app.use(kakaoPassport.session());
app.use(NaverPassport.session());

const chatRouter = require("../router/chat"); //    ../router/chat.js
const roomRouter = require("../router/room"); //  ../router/room.js
const folderRouter = require("../router/folder"); //  ../router/folder.js
const userRouter = require("../router/user"); //  ../router/user.js
const kakaoRouter = require('../router/kakao'); //  ../router/kakao.js
const naverRouter = require('../router/naver'); //  ../router/naver.js
const logoutRouter = require('../router/logout') //  ../router/logout.js

app.use("/room", roomRouter); // room로 요청이 오면 roomRouter로
app.use('/auth/kakao', kakaoRouter);    // auth/kakao로 요청이 오면 kakaoRouter로
app.use('/auth/naver', naverRouter);    // auth/naver로 요청이 오면 naverRouter로
app.use("/folder", folderRouter); // folder로 요청이 오면 folderRouter 로
app.use("/user", userRouter); // user로 요청이 오면 userRouter 로
app.use("/chat", chatRouter); // chat로 요청이 오면 chatRouter 로
app.use('/logout', logoutRouter);    // logout로 요청이 오면 logoutRouter로

app.use((req, res, next) => {
  // 그 외 url 로 요청이 오면 404. 'Not Found'
  res.status(404).send("Not Found");
});
app.use((err, req, res, next) => {
  // error 가 발생했을 때
  console.error(err);
  res.status(500).send(err.message);
});

// port 연결
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
