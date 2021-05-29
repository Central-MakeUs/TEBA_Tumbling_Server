module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 카카오 로그인/회원가입
    app.post('/kakao-login', user.kakaoLogin)

};