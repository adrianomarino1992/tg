// autor: Adriano Marino Balera 
// email: adriano.marino1992@gmail.com
// trabalho de conclusão do curso de Geoprocessamento , FATEC - Jacareí 


const express = require('express');
const fs = require('fs');

(() => {
process["configurations"] = JSON.parse(fs.readFileSync(`${__dirname}\\config.json`));
process["dirRoot"] = __dirname;
})();

const serveStatic = require('serve-static');
const bodyParser = require('body-parser');

const app = express();

app.use(serveStatic(__dirname + "/src/Static"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

const seed = require('./src/Utils/dbStart');

require('./src/Routes/geom').add(app);
require('./src/Routes/querys').add(app);


if(process.argv.indexOf('--create-database') > 0)
{
    console.log("Iniciando processo de criação de banco de dados");
    seed.restore(`${__dirname}/src/Backup/backup.sql`);
}

app.listen(process.env.PORT || process.configurations.server.port , () =>  {
    console.log(`Servidor rodando na porta ${process.env.PORT || process.configurations.server.port }`);
});
