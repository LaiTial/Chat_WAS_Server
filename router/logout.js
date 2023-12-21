const express = require("express");
const router = express.Router();

// 로그아웃 라우트
router.get('/', (req, res) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      // 세션 및 쿠키 제거
      req.session.destroy(()=>{
        res.clearCookie(); //쿠키 제거
        res.json({ res: 'OK' });
      }); // 세션 종료
    });
  });

module.exports=router;