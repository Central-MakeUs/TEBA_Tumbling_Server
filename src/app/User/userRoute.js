module.exports = function(app){
    const user = require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 카카오 로그인/회원가입
    app.post('/kakao-login', user.kakaoLogin)

     // 자동 로그인
     app.get('/auto-login', jwtMiddleware, user.autoLogin)

};