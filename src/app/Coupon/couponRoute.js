module.exports = function(app){
    const coupon = require('./couponController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 쿠폰 개수 조회
    app.get('/coupons', jwtMiddleware, coupon.getCoupons)

    //가게 정보 조회
    //app.get('/coupons/:couponIdx', coupon.getCouponById)


};