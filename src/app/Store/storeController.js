const jwtMiddleware = require("../../../config/jwtMiddleware");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const { pool } = require("../../../config/database");
const { connect } = require("http2");
const {emit} = require("nodemon");
const storeDao = require("./storeDao");
const { logger } = require("../../../config/winston");

/**
 * API No. 2
 * API Name : 가게 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/stores
 */
exports.getStores = async function (req, res) {

    /**
     * Query String: latitude, longitude, distance
     */
    const {latitude, longitude} = req.query;
    const distance = req.query.distance;


    //TODO:validation
    if(!distance)
    distance = 1;

    try {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeResult = await storeDao.selectStore(
    connection,
    latitude, longitude, distance
    );
    connection.release();
    return res.send(response(baseResponse.SUCCESS, storeResult))
    }
    catch (err) {
        logger.error(`App - getstore error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
      }
};

exports.getStoreById = async function (req, res) {

    /**
     * Path variable : storeIdx
     */

    const storeIdx = req.params.storeIdx;

    //TODO:validation

    try {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeResult = await storeDao.selectStoreById(
    connection,
    storeIdx
    );
    connection.release();
    return res.send(response(baseResponse.SUCCESS, storeResult[0]))
    }
    catch (err) {
        logger.error(`App - getstore error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
      }
};

/**
 * API No. 16
 * API Name : 가게 키워드 검색 API
 * [GET] /search
 */
exports.searchStores = async function(req, res){
    const {keyword} = req.query;
    
    if(!keyword){
        return res.send(response(baseResponse.SEARCH_KEYWORD_EMPTY));
    }

    //try {
        const connection = await pool.getConnection(async (conn) => conn);
        const param = [keyword]
        const storeResult = await storeDao.searchStores(connection, param);
        connection.release();
        return res.send(response(baseResponse.SUCCESS, storeResult));
    //}
    //catch (err) {
    //    logger.error(`App - getstore error\n: ${err.message}`);
    //    return errResponse(baseResponse.DB_ERROR);
    //}

}