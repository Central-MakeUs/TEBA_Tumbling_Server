const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const donateDao = require("./donateDao")
const couponDao = require("../Coupon/couponDao");
const storeDao = require("../Store/storeDao");
/**
 * API No. 2
 * API Name : 기부 가능한 가게 조회 API
 * [POST] /donates
 */
exports.getDonateStores = async function (req, res) {

    const latitude = req.query.latitude;
    const longitude = req.query.longitude;

    // latitude, longtitude 미 입력
    if(!latitude || !longitude){
        return res.send(errResponse(baseResponse.USER_LOCATION_EMPTY))
    }

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const param = [latitude, longitude, latitude];
            const rows = await donateDao.getDonateStores(connection, param);
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
};

/**
 * API No. 4
 * API Name : 기부 예약하기
 * [POST] /donates
 */
exports.donateAction = async function (req, res) {
    const {storeIdx, tumblerCount} = req.body;
    const userIdx = req.verifiedToken.userIdx;

    if(!storeIdx || !tumblerCount){
        return res.send(errResponse(baseResponse.USER_DONATEINFO_EMPTY))
    }

    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
            const param = [storeIdx, userIdx, tumblerCount];
            const [donationIdx] = await donateDao.donateAction(connection, param);
            connection.release();
            return res.send(response(baseResponse.SUCCESS, donationIdx[0]));
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

/**
 * API No. 5
 * API Name : 기부 완료
 * [PATCH] /donates
 */
exports.donateComplete = async function(req, res){

    const {donateIdx, storeCode} = req.body;
    
    if(!donateIdx){
        return res.send(errResponse(baseResponse.USER_DONATEINFO_EMPTY))
    }
    try {
        const connection = await pool.getConnection(async conn => conn);
        try {
           
       //가게 번호 확인
       const storeResult = await storeDao.selectStoreByCode(
           connection,
           storeCode
       );
       if(!storeResult || storeResult.length<1)
           return res.send(errResponse(baseResponse.STORE_CODE_NOT_MATCH));
           
           //예약번호 확인
           const donationResult = await donateDao.selectDonateById(
            connection,
            donateIdx
        );
		console.log(storeResult);
		console.log(donationResult)
if(!donationResult || donationResult.length<1)
            return res.send(errResponse(baseResponse.DONATE_IDX_NOT_MATCH));
           //적립
        const couponResult = await couponDao.insertCoupon(
        connection,
        donationResult[0].userIdx, storeResult[0].idx,  donationResult[0].quantity
        );
       console.log("hi")
            const param = [donateIdx]
            const row = await donateDao.donateComplete(connection, param);
            connection.release();
           
            return res.send(response(baseResponse.SUCCESS));
        } catch (err) {
        logger.error(`App - createRestaurant Service error\n: ${err.message}`);    
	logger.error(`example non transaction Query error\n: ${JSON.stringify(err)}`);
            connection.release();
            return false;
        }
    } catch (err) {
        logger.error(`example non transaction DB Connection error\n: ${JSON.stringify(err)}`);
        return false;
    }
}




