module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/stores/search', store.searchStores);

    // 주변 가게 조회
    app.get('/stores', store.getStores)

    //가게 정보 조회
    app.get('/stores/:storeIdx', store.getStoreById)


};