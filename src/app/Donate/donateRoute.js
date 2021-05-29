module.exports = function(app){
    const donate = require('./donateController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    app.get('/donates', donate.getDonateStores);
    app.post('/donates', jwtMiddleware, donate.donateAction);
    app.patch('/donates', donate.donateComplete);
};