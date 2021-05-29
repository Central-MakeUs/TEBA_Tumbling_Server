const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { connect } = require("http2");
const {emit} = require("nodemon");
const userDao = require("./userDao");
const donateDao = require("../Donate/donateDao");
const axios = require("axios");
const { logger } = require("../../../config/winston");
const jwt = require("jsonwebtoken");
const secret_config = require("../../../config/secret");

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
var id, email, profile, nickname, userIdx;

if(!accessToken)
    return res.send(errResponse(baseResponse.USER_TOKEN_EMPTY))

//id, email, profile, nickname
      try {
        axios({
            url: api_url,
            method: 'get',
            headers: {
                Authorization: 'Bearer ' + accessToken,
              }
          }).then(async function (response) {
        id = response.data.id;
        email = response.data.kakao_account.email;
        if(!email) email = null;
        profile = response.data.kakao_account.profile.profile_image_url;
        nickname = response.data.kakao_account.profile.nickname;

        //이미 존재하는 유저인지 확인
        const connection = await pool.getConnection(async (conn) => conn);
        const userIdResult = await userDao.selectUserId(
        connection,
        id
        );
        connection.release();

        if(userIdResult[0].length<1){
            //회원가입
            const connection = await pool.getConnection(async (conn) => conn);
            const signupResult = await userDao.signup(
            connection,
            id, email, profile, nickname
            );
            connection.release();
            userIdx = signupResult.insertId;
        }
        else
            userIdx=userIdResult[0][0].idx;
        
        
        //로그인
        let token = await jwt.sign(
            {
              userIdx: userIdx,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
              expiresIn: "365d",
              subject: "userIdx",
            } // 유효 기간 365일
          );
          
          return res.send({
            isSuccess: true,
            userIdx: userIdx,
            jwt: token,
          });
        }).catch(function (error) {
            return res.send({
                isSuccess: false,
                userIdx: null,
                jwt: null,
              });
          });
        }
        catch (err) {
            logger.error(`App - login error\n: ${err.message}`);
            return res.send({
                isSuccess: false,
                userIdx: null,
                jwt: null,
              });
        }
};
exports.autoLogin = async function (req, res) {
    const userIdResult = req.verifiedToken.userIdx;
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};

/**
 * API No. 6
 * API Name : 기부 예약 목록 조회
 * [POST] /users/donates
 */
exports.getDonateReservation = async function(req, res){
    const userIdx = req.verifiedToken.userIdx;

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const param = [userIdx]
            const rows = await donateDao.getdonateReservation(connection, param);
            connection.release();
            return res.send(response(baseResponse.SUCCESS, rows));
        } catch (err) {
            logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}