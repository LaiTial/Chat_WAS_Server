const express = require("express");
const router = express.Router();
const connection = require('../db/dbconn');

// 유저 이름 Read
router.get('/', (req, res) => {
  try {
    let id = req.query["id"]; // 사용자 번호

    // 전체 목록 Read
    sql = `SELECT name from chat_db.user_box Where id="${id}"`; // 기본 sql

    connection.query(sql, (error, rows) => {
      if (error) {
        console.log("사용자 이름 조회 중 에러:", error)
        return next(error)
      }
      res.json(rows); // json 형태로 변환해서 응답
    });
  } catch (error) {
    console.log("사용자 이름 조회 중 에러:", error)
    next(error)
  }
});

// 전역 에러 미들웨어
router.use((err, req, res, next) => {
  res.json({error:"서버 에러"});
});

module.exports = router;