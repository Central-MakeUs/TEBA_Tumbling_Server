const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { connect } = require("http2");
const {emit} = require("nodemon");
const userDao = require("./userDao");
const axios = require("axios");
const { logger } = require("../../../config/winston");

/**
 * API No. 
 * API Name : 카카오 로그인
 * [POST] /app/users
 */
exports.kakaoLogin = async function (req, res) {

/**
 * * Body: accessToken
*/

const accessToken = req.body.accessToken;
const api_url = "https://kapi.kakao.com/v2/user/me";

//id, email, profile, nickname
      try {
        axios({
            url: api_url,
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + accessToken,
              }
          }).then(function (response) {
            console.log(response.data);
          });
        const id = response.data.id;

        //이미 존재하는 유저인지 확인
        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.selectUserId(
        connection,
        id
        );
        connection.release();
        console.log(userIdResult);
        
        if(!userIdResult){
            //회원가입
            const connection = await pool.getConnection(async (conn) => conn);
            const signupResult = await userDao.signup(
            connection,
            id, email, profile, nickname
            );
            connection.release();
            return res.send(response(baseResponse.SUCCESS, signupResult[0]))
        }
        //로그인
        let token = await jwt.sign(
            {
              userIdx: userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
              expiresIn: "365d",
              subject: "userInfo",
            } // 유효 기간 365일
          );
          return response(baseResponse.SUCCESS, {
            userIdx: userIdx,
            jwt: token,
          });
        }
        catch (err) {
            logger.error(`App - login error\n: ${err.message}`);
            return errResponse(baseResponse.DB_ERROR);
        }
};
