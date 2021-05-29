const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { connect } = require("http2");
const {emit} = require("nodemon");
const couponDao = require("./couponDao");
const storeDao = require("../Store/storeDao");
const { logger } = require("../../../config/winston");
const jwt = require('jsonwebtoken');
const secret_config = require("../../../config/secret");

/**
 * API Name : 쿠폰 조회 API 
 * [GET] /coupons
 */
exports.getCoupons = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    try {
    const connection = await pool.getConnection(async (conn) => conn);
    const couponResult = await couponDao.selectCoupon(
    connection,
    userIdx
    );
    connection.release();
    return res.send(response(baseResponse.SUCCESS, couponResult[0]))
    }
    catch (err) {
        logger.error(`App - getcoupon error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
      }
};

exports.postCoupons = async function (req, res) {

    /**
     * Body : userJwt, storeNumber
     */

    const {userJwt, storeCode} = req.body;

    //토큰 확인
    var userIdFromJWT;
    if (userJwt) {
        jwt.verify(userJwt, secret_config.jwtsecret, (err, verifiedToken) => {
          if (verifiedToken) {
            userIdFromJWT = verifiedToken.userIdx;
          }
        });
        if (!userIdFromJWT) {
          return res.send(errResponse(baseResponse.TOKEN_VERIFICATION_FAILURE));
        }
      }

    try {
    //가게 번호 확인
    const connection = await pool.getConnection(async (conn) => conn);

    const storeResult = await storeDao.selectStoreByCode(
        connection,
        storeCode
    );

    if(!storeResult)
        return res.send(errResponse(baseResponse.STORE_CODE_NOT_MATCH));

    //적립
    const couponResult = await couponDao.insertCoupon(
    connection,
    userIdFromJWT, storeResult[0].idx
    );
    connection.release();

    return res.send(response(baseResponse.SUCCESS, {couponIdx: couponResult.insertId}))
    }
    catch (err) {
        logger.error(`App - postcoupon error\n: ${err.message}`);
        return res.send(errResponse(baseResponse.DB_ERROR));
    }
};

exports.patchCoupons = async function (req, res) {

    const userIdx = req.verifiedToken.userIdx;

    try {
    //쿠폰 사용
    const connection = await pool.getConnection(async (conn) => conn);

    //적립
    const couponUseResult = await couponDao.useCoupon(
    connection,
    userIdx
    );

    const couponResult = await couponDao.selectCoupon(
        connection,
        userIdx
        );
    connection.release();
    return res.send(response(baseResponse.SUCCESS, couponResult[0]))
    }
    catch (err) {
        logger.error(`App - usercoupon error\n: ${err.message}`);
        return res.send(errResponse(baseResponse.DB_ERROR));
    }
};

//쿠폰 적립 페이지(관리자용)
exports.getCouponPage = (req, res, next) => {
  res.sendFile(
    "/statics/coupon/coupon.html",
    {
      root: "./",
    }
  );
};



