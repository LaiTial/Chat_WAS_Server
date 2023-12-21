const passport = require('passport');
const NaverStrategy = require('passport-naver').Strategy;
const connection = require("../db/dbconn");
const dotenv = require("dotenv");
dotenv.config(); // 환경설정 사용

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

passport.use(
  new NaverStrategy(
    {
      clientID: process.env.NAVER_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:4200/auth/naver/callback',
      svcType: 0,
      authType: 'reauthenticate'  // 사용자 재인증
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const nickname = profile.displayName;
        const provider = "naver";

        // DB 존재 여부 확인
        const findDB = `SELECT id FROM chat_db.user_box WHERE email='${email}' AND provider="${provider}";`;
        const key = await query(findDB);

        let userId;

        if (key.length !== 0) {
          const updateDB = `UPDATE chat_db.user_box SET email='${email}', name="${nickname}", provider="${provider}" WHERE id=${key[0].id}`;
          connection.query(updateDB, (error, rows) => {
            if (error) {
              console.error("로그인 중 에러:", error);
              return done(error, false); // 에러를 done으로 전달
            }

            connection.commit();

            userId = key[0].id;
            return done(null, { id: userId });
          });
        } else {
          const insertDB = `INSERT INTO chat_db.user_box (email, name, provider) VALUES ('${email}', "${nickname}", "${provider}")`;
          connection.query(insertDB, (error, rows) => {
            if (error) {
              console.error("로그인 중 에러:", error);
              return done(error, false); // 에러를 done으로 전달
            }

            connection.commit();

            userId = rows.insertId;
            return done(null, { id: userId });
          });
        }
      } catch (error) {
        console.error("로그인 중 에러:", error);
        return done(error, false); // 에러를 done으로 전달
      }
    }
  )
);

module.exports = passport;

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