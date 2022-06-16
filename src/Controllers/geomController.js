const db = require("../DataBase/postgres");

db.start();

module.exports.getShp = (req, res) =>
{
    var shapefile = require("shapefile");
    var shp2Json = [];
    shapefile.open("C:/Users/USER/Desktop/shps/jacarei.shp")
        .then(source => source.read()
            .then(function log(result) {
                if (result.done) return;
                
                shp2Json.push(result.value);
                return source.read().then(log);
            }))
        .then(() => res.json(shp2Json))
        .catch(error => console.error(error.stack));
}

module.exports.buffer = (req, resp) => 
{

    var geomWKT = req.body.geom;
    var buffer = req.body.buffer;

    pool.query(`select ST_asText(ST_Buffer(ST_geomFromText('${geomWKT}',4326),${buffer})) as "geom"`, (err, resp) => {

        if (resp) {

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            
        } else {

            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));
            
        }

    })

}