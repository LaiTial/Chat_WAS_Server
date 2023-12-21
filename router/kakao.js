const express = require("express");
const router = express.Router();
const passport = require('../passport/kakaoStrategy'); // 카카오서버로 로그인할때

// 카카오 로그인 Page로
router.get('/', passport.authenticate('kakao', {
   failureRedirect: 'http://localhost:3000',
 })
);

// ID/PW를 쳐서 로그인이 결과 callback
// passport 로그인 전략에 의해 kakaoStrategy로 가서 카카오계정 정보와 DB를 비교해서 회원가입시키거나 로그인 처리하게 한다.
router.get('/callback', passport.authenticate('kakao', {
      failureRedirect: '/', // kakaoStrategy에서 실패한다면 실행
   }),
   // kakaoStrategy에서 성공한다면 콜백 실행
   (req, res) => {
      res.redirect(`http://localhost:3000/chat/${req.user.id}`);
   },
);

module.exports=router;
