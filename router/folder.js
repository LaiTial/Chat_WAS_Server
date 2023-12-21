const express = require("express");
const router = express.Router();
const connection = require("../db/dbconn");

// 폴더 목록 Read
router.get("/", (req, res, next) => {
  let id = req.query["id"]; // 폴더 키

  // 전체 목록 Read
  const sql = `SELECT FolderID, Foldername, ParentFolderID from chat_db.folder Where userID="${id}" and ParentFolderID IS NULL`; // 부모 폴더가 없을때

  try {
        connection.query(sql, (error, rows) => {
          if (error) {
            console.error("폴더 목록 조회 중 오류:", error);
            return next(error); // 에러를 전역 에러 미들웨어로 전달
          }
      
          res.json({ now: [], inside: rows }); // json 형태로 변환해서 응답
        });
  }
  catch (error) {
      console.error("폴더 목록 조회 중 오류:", error);
      next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 현재 폴더, 폴더 내부 목록들 가져오기
router.get("/inside", async (req, res, next) => {
  let parent = req.query["parent"];

  try {
    const now = `SELECT FolderID, Foldername, ParentFolderID FROM chat_db.folder WHERE FolderID=${parent};`;
    const inside = `SELECT FolderID, Foldername, ParentFolderID FROM chat_db.folder WHERE ParentFolderID=${parent} ORDER BY ParentFolderID ASC;`;

    // DB 요청
    const nowData = await query(now); // 현재 폴더 정보 반환
    const insideData = await query(inside); // 현재 폴더 내부 목록 반환

    // 두 개의 결과를 따로 따로 반환
    res.json({ now: nowData, inside: insideData });
  } catch (error) {
    console.error("폴더 정보 및 목록 조회 중 오류:", error);
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

// 새로운 폴더 추가
router.put("/", (req, res, next) => {
  // put
  data = req.body; // data 가져오기

  const sql =
    "INSERT INTO chat_db.folder (userID, ParentFolderID) VALUES (?)"; //sql문 생성
  const sql_data = [data.userID, data.parentFolderID]; //sql에 보낼 data

  try {
    // DB에 data 보내기
    connection.query(sql, [sql_data], (error, rows) => {
      if (error) {
        console.error("폴더 추가 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      connection.commit();
      res.json({ id: rows.insertId });
    });
  } catch (error) {
    console.error("폴더 추가 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 폴더 이름 변경 POST 요청
router.post("/", (req, res, next) => {
  // post
  let id = req.query["id"]; // 폴더 키
  let name = req.query["name"]; // 새로운 폴더 명

  // 이름 변경 SQL 문
  const sql = `UPDATE chat_db.folder SET Foldername='${name}' WHERE FolderID=${id}`; //sql문 생성

  try {
    // DB에 data 보내기
    connection.query(sql, (error) => {
      if (error) {
        console.error("폴더 이름 변경 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }

      connection.commit();
      res.status(200).send({ res : "OK"});
    });
  } catch (error) {
    console.error("폴더 이름 변경 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 폴더 삭제 DELETE 요청
router.delete("/", (req, res, next) => {
  
  // 삭제할 폴더 키
  let id = req.query["id"];

  const sql = `DELETE FROM chat_db.folder WHERE FolderID=${id}`; //sql문 생성

  try {
    connection.query(sql, (error) => {
      if (error) {
        console.error("폴더 삭제 중 오류:", error);
        return next(error); // 에러를 전역 에러 미들웨어로 전달
      }
  
      res.status(200).send({ res : "OK"});
    });
  } catch (error) {
    console.error("폴더 삭제 중 오류:", error);
    next(error); // 에러를 전역 에러 미들웨어로 전달
  }
});

// 전역 에러 미들웨어
router.use((err, req, res, next) => {
  res.json({error:"서버 에러"});
});

module.exports = router;