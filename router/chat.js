const express = require("express");
const router = express.Router();
const axios = require("axios");

const connection = require("../db/dbconn");

// 채팅 내역 요청
router.get("/", (req, res, next) => {

  let id = req.query["room"]; // 채팅방 번호

  try {
    // Room ID를 받아 채팅 내역 Read
    connection.query(
      `SELECT * from chat_db.chatbot where chatRoom=${id} order by id asc`,
      (error, rows, fields) => {
        if (error) {
          console.error("채팅 내역 조회 중 오류:", error);
          return next(error); // 에러를 전역 에러 미들웨어로 전달
        }
        res.json(rows); // json 형태로 변환해서 응답
      }
    );
  } catch (error) {
      console.error("채팅 내역 조회 중 오류:", error);
      next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 새 채팅 전송
router.put("/", async (req, res, next) => {
  // put

  const data = req.body; // data 가져오기
  let answer;
  const flaskServerUrl = "http://127.0.0.1:5000/chat";

  // 채팅방이 없을 시 새 채팅방 생성
  if (data.chatRoom == null) {
    const sql = `INSERT INTO chat_db.room (userID, FolderID) VALUES ('${data.users}', null)`; // sql문 생성
    try {
      const rows = await query(sql); // 비동기 함수를 기다려 결과를 받아옵니다.
      data.chatRoom = rows.insertId;
    } catch (error) {
      console.error("채팅방 생성 중 오류:", error);
      return next(error); // 에러를 전역 에러 미들웨어로 전달
    }
  }

  // flask 서버에 요청해 답변 얻기
  try {
    // Flask 서버에 GET 요청
    answer = await sendFlask(flaskServerUrl, data.texts);
  } catch (error) {
    console.error("Flask 서버 요청 중 오류:", error);
    return next(error); // 에러를 전역 에러 미들웨어로 전달
  }

  // 새 채팅 insert
  const QSql = `INSERT INTO chat_db.chatbot (chatRoom, texts, roles) VALUES (${
    data.chatRoom
  },"${data.texts}",${1})`; // sql문 생성

  const ASql = `INSERT INTO chat_db.chatbot (chatRoom, texts, roles) VALUES (${
    data.chatRoom
  },"${answer.chat}",${0})`; // sql문 생성

  // DB에 data 보내기
  try {
    await query(QSql);
    await query(ASql);
    connection.commit();
    res.json({ id: data.chatRoom });
  } catch (error) {
    console.error("DB 쿼리 중 오류:", error);
    return next(error); // 에러를 전역 에러 미들웨어로 전달
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

// Flask 서버로 GET 요청
async function sendFlask(flaskServerUrl, texts) {
  try {
    const response = await axios.get(`${flaskServerUrl}?Q=${texts}`);
    console.log("Flask 서버 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("Flask 서버 요청 중 오류:", error);
    return next(error); // 에러를 전역 에러 미들웨어로 전달
  }
}

// 전역 에러 미들웨어
router.use((err, req, res, next) => {
  res.json({error:"서버 에러"});
});

module.exports = router;