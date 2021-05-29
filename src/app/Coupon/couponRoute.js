module.exports = function(app){
    const coupon = require('./couponController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 쿠폰 개수 조회
    app.get('/coupons', jwtMiddleware, coupon.getCoupons)

    // 쿠폰 적립
    app.post('/coupons', coupon.postCoupons)


};