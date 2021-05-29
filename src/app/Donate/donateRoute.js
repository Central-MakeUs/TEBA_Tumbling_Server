module.exports = function(app){
    const donate = require('./donateController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/stores/donate', donate.getDonateStores);

};