const qController = require('../Controllers/queryController');


module.exports.add = app => 
{
    app.get('/executa/query', qController.run);

    app.post('/owbanco', qController.changeDB);

} 