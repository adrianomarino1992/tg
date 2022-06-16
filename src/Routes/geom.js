const geomController = require('../Controllers/geomController');


module.exports.add = app =>
{
    app.get('/return/shp', geomController.getShp);
    app.post('/buffer', geomController.buffer);
}