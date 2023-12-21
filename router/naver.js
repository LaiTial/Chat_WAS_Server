const express = require("express");
const router = express.Router();
const passport = require('../passport/naverStrategy') // 네이버서버로 로그인할때

// 네이버 로그인 Page로
router.get('/', passport.authenticate('naver', {
   failureRedirect: 'http://localhost:3000',
 }));

// ID/PW를 쳐서 로그인이 결과 callback
// passport 로그인 전략에 의해 NaverStrategy로 가서 계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
router.get('/callback', passport.authenticate('naver', {
      failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
   }),
   // kakaoStrategy에서 성공한다면 콜백 실행
   (req, res) => {
      res.redirect(`http://localhost:3000/chat/${req.user.id}`);
   });

module.exports=router;
