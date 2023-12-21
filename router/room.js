const express = require("express");
const router = express.Router();
const connection = require("../db/dbconn");

// 초기 채팅창 목록 Read
router.get("/", async (req, res, next) => {
  try {
    let id = req.query["id"]; // 채팅창 키

    // 전체 목록 Read
    const sql = `SELECT RoomID, Roomname, folderID from chat_db.room Where userID="${id}" and folderID IS NULL`; // 부모 폴더가 없을때

    connection.query(sql, (error, rows) => {
      if (error) {
        console.error("채팅창 목록 조회 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      res.json(rows); // JSON 형태로 변환해서 응답
    });
  } catch (error) {
    console.error("채팅창 목록 조회 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 폴더 내부 채팅창 목록 Read
router.get("/inside", (req, res, next) => {
  try {
    let parent = req.query["parent"]; // 폴더 키

    // 전체 목록 Read
    const sql = `SELECT RoomID, Roomname, folderID from chat_db.room Where folderID=${parent}`; // 부모 폴더가 있을때

    connection.query(sql, (error, rows) => {
      if (error) {
        console.error("폴더 내부 채팅창 목록 조회 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      res.json(rows); // JSON 형태로 변환해서 응답
    });
  } catch (error) {
    console.error("폴더 내부 채팅창 목록 조회 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 새로운 채팅창 추가
router.put("/", (req, res, next) => {
  try {
    // put
    const data = req.body; // data 가져오기

    const sql = "INSERT INTO chat_db.room (userID, FolderID) VALUES (?)"; // sql문 생성
    const sql_data = [data.userID, data.folderID]; // sql에 보낼 data

    connection.query(sql, [sql_data], (error, rows) => {
      if (error) {
        console.error("채팅창 추가 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      connection.commit();
      res.json({ id: rows.insertId });
    });
  } catch (error) {
    console.error("채팅창 추가 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 채팅방 이름 변경 POST 요청
router.post("/", (req, res, next) => {
  try {
    // post
    let id = req.query["room"]; // 채팅창 키
    let name = req.query["name"]; // 새로운 채팅창 이름

    // 이름 변경 SQL 문
    const sql = `UPDATE chat_db.room SET Roomname='${name}' WHERE RoomID=${id}`; // sql문 생성

    connection.query(sql, (error) => {
      if (error) {
        console.error("채팅방 이름 변경 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      connection.commit();
      res.status(200).send({ res: "OK" });
    });
  } catch (error) {
    console.error("채팅방 이름 변경 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 채팅방 삭제 DELETE 요청
router.delete("/", (req, res, next) => {
  try {
    // 삭제할 채팅창 키
    let id = req.query["id"];

    const sql = `DELETE FROM chat_db.room WHERE RoomID=${id}`; // sql문 생성

    connection.query(sql, (error) => {
      if (error) {
        console.error("채팅방 삭제 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      res.status(200).send({ res: "OK" });
    });
  } catch (error) {
    console.error("채팅방 삭제 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 전역 에러 미들웨어
router.use((err, req, res, next) => {
  res.json({error:"서버 에러"});
});

module.exports = router;