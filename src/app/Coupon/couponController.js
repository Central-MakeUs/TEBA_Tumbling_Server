const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { connect } = require("http2");
const {emit} = require("nodemon");
const couponDao = require("./couponDao");
const { logger } = require("../../../config/winston");

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

exports.getCouponById = async function (req, res) {

    /**
     * Path variable : couponIdx
     */

    const couponIdx = req.params.couponIdx;

    //TODO:validation

    try {
    const connection = await pool.getConnection(async (conn) => conn);
    const couponResult = await couponDao.selectCouponById(
    connection,
    couponIdx
    );
    connection.release();
    return res.send(response(baseResponse.SUCCESS, couponResult[0]))
    }
    catch (err) {
        logger.error(`App - getcoupon error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
      }
};
