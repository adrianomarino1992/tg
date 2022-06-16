
var url = require('url');

const db = require("../DataBase/postgres");

db.start();

module.exports.run = async (req, res) => {
  var q = url.parse(req.url, true).query;

  var consulta = q.query;

  if (consulta.indexOf("mapa") != -1) {
    consulta = `select *, ST_asText(st_transform(mapa,4326)) as "geometry" from (${consulta}) as a`;
  } else {
    if (
      consulta.toLocaleLowerCase().indexOf("delete") != -1 ||
      consulta.toLocaleLowerCase().indexOf("update") != -1 ||
      consulta.toLocaleLowerCase().indexOf("truncate") != -1 ||
      consulta.toLocaleLowerCase().indexOf("create") != -1 ||
      consulta.toLocaleLowerCase().indexOf("drop") != -1 ||
      consulta.toLocaleLowerCase().indexOf("insert") != -1 ||
      consulta.toLocaleLowerCase().indexOf("alter") != -1
    ) {
      consulta = `Select 'Comandos DDL ou DML ' as "Permissão negada "`;
    }
  }

  try {
    let r = await db.query(consulta);

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(r));

  } catch (exception) {

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ erro: exception.toString() }));
  }
};



module.exports.changeDB = async (req, res) => {
  var c = req.body;

  try {
    let r = await db.change(c);

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(r));

  } catch (exception) {

    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ erro: exception.toString() }));
  }
};
