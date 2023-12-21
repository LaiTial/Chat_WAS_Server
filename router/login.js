const express = require("express");
const router = express.Router();
const connection = require("../db/dbconn");

// 로그인
router.put('/', async (req, res, next) => {

    let email = req.query["email"]; // 이메일
    let nickname = req.query["nickname"]; // 사용자 닉네임
    let provider = req.query["provider"] // 제공자

    // DB 존재 여부 확인
    const findDB = `select id from chat_db.user_box where email='${email}' and provider="${provider}";`
    key = await query(findDB);

    if(key.length !== 0) var updateDB = `UPDATE chat_db.user_box SET email='${email}', name="${nickname}", provider="${provider}" where id=${key[0].id}`; 
    else var updateDB = `insert chat_db.user_box (email, name, provider) values ('${email}', "${nickname}", "${provider}")`; 

    try {
        connection.query(updateDB, (error, rows) => {
            if (error) {
            console.error("로그인 중 에러:", error);
            return next(error); // 에러를 전역 에러 미들웨어로 전달
            }

            connection.commit()

            if(key.length === 0) key = rows.insertID 
            else key = key[0].id

            res.json({ id: key });
        });
    } catch (error) {
      console.error("로그인 중 에러:", error);
      next(error); // 에러를 전역 에러 미들웨어로 전달
    }
});

// 쿼리를 실행하고 결과를 반환하는 비동기 함수 정의
function query(sql) {
    return new Promise((resolve, reject) => {
      connection.query(sql, (error, rows) => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }

// 전역 에러 미들웨어
router.use((err, req, res, next) => {
    res.json({error:"서버 에러"});
  });

module.exports=router;