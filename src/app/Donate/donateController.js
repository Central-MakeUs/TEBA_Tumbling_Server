const {pool} = require('../../../config/database');
const {logger} = require('../../../config/winston');
const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const dondateDao = require("./donateDao")

/**
 * API No. 2
 * API Name : 기부 가능한 가게 조회 API
 * [GET] /stroes/donate
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
            const rows = await dondateDao.getDonateStores(connection, param);
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
