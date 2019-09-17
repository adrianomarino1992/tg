var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
var serveStatic = require('serve-static');
const bodyParser = require('body-parser');
const sql = require("mssql");
var url = require('url');
var nodemailer = require('nodemailer');
const { Pool, Client } = require('pg');
var formidable = require('formidable');





var app = express();
app.use(serveStatic(__dirname + "/acess"))




app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));

var d = new Date();
var pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'bd_sma',
    password: 'b2btisenha123',
    port: 5432
})


// var shp2Json = [];
// var shapefile = require("shapefile");
// shapefile.open("C:/Users/USER/Desktop/shps/microregios.shp")
// .then(source => source.read()
//   .then(function log(result) {
//     if (result.done) return;
//     //console.log(result.value);
//     shp2Json.push(result.value);                 
//     return source.read().then(log);
//   }))
//   .then(log => console.log(shp2Json))  
// .catch(error => console.error(error.stack));

app.get('/return/shp', function (req, res) {
    var shapefile = require("shapefile");
    var shp2Json = [];
    shapefile.open("C:/Users/USER/Desktop/shps/jacarei.shp")
        .then(source => source.read()
            .then(function log(result) {
                if (result.done) return;
                // console.log(result.value);
                shp2Json.push(result.value);
                return source.read().then(log);
            }))
        .then(() => res.json(shp2Json))
        .catch(error => console.error(error.stack));

})







app.post('/inserir/alunos', function (request, response) {
    inserir_a_m(request, response);
});

function inserir_a_m(req, resp) {

    var dados = req.body;

    var InsertAluno = `INSERT INTO aluno VALUES `;
    var InsertMateria = `INSERT INTO materia VALUES `;

    for (var a of dados.aluno) {
        InsertAluno += `('${a.nome}',${a.idade},${a.nota},'${a.rg}'),`;
    }

    InsertAluno = InsertAluno.substring(0, InsertAluno.length - 1);
    InsertAluno += `;`;

    for (var m of dados.materia) {
        InsertMateria += `('${m.materia}','${m.rg}'),`;
    }

    InsertMateria = InsertMateria.substring(0, InsertMateria.length - 1);
    InsertMateria += `;`;


    pool.query(InsertAluno, (error, result) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Alunos inseridos com sucesso ...');
            console.log('Inserindo materias ...');
            pool.query(InsertMateria, (error, result) => {

                if (error) {
                    console.error(error);
                } else {
                    console.log('Sucesso');
                }
            })
        }
    })
}







app.post('/buffer', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);


    var geomWKT = req.body.geom;
    var buffer = req.body.buffer;

    pool.query(`select ST_asText(ST_Buffer(ST_geomFromText('${geomWKT}',4326),${buffer})) as "geom"`, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            //console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));
            //   console.log({ erro: error.toString() });
        }

    })

});




app.get('/openScript', function (req, res) {
    var js;
    js = fs.readFileSync('js/script.js', 'utf8');
    res.json({ script: js });
})



// app.post('/inserir/alunos', inserir_a_m(request, response));

// function inserir_a_m(req, resp) {

//     var dados = req.body;

//     var InsertAluno = `INSERT INTO aluno VALUES `;
//     var InsertMateria = `INSERT INTO materia VALUES `;


//     for (var a of dados.aluno) {
//         InsertAluno += `('${a.nome}',${a.idade},${a.nota},'${a.rg}'),`;
//     }

//     InsertAluno = InsertAluno.substring(0, InsertAluno.length - 1);
//     InsertAluno += `;`;


//     for (var m of dados.materia) {
//         InsertMateria += `('${m.materia}','${m.rg}'),`;
//     }

//     InsertMateria = InsertAluno.substring(0, InsertAluno.length - 1);
//     InsertMateria += `;`;

//     pool.query(InsertAluno, (result, error) => {
//         if (error) {
//             console.error(error);
//         } else {
//             console.log('Alunos inseridos com sucesso ...');
//             console.log('Inserindo materias ...');
//             pool.query(InsertMateria, (result, error) => {
//                 if (error) {
//                     console.error(error);
//                 } else {
//                     console.log('Sucesso');
//                 }
//             })
//         }
//     })


// }





// /*
// Função que cria uma rota e chama uma função (executar).
// */
// app.get('/executa/consulta', executar(request, Response));



// /*
// Função que faz o procedimento de validar e consultar.
// */
// function executar(req, res) {
//     var q = url.parse(req.url, true).query;
//     var consulta = q.query;

//     consulta = validar(consulta);

//     consultar(consulta, (resultado) => {
//         res.setHeader('Content-Type', 'application/json');
//         res.send(resultado);
//     })
// }


// /*
// Função que consulta o banco e devolve a resposta.
// */
// function consultar(consulta, callback) {
//     pool.query(consulta, (err, resp) => {
//         if (resp) {
//             return callback(JSON.stringify(resp.rows));
//         } else {
//             return callback(JSON.stringify({ err: err.toString() }));

//         }

//     })
// }


// /*
// Função para evitar comandos DDL
// */
// function validar(consulta) {
//     if (consulta.toLocaleLowerCase().indexOf("delete") != -1 || consulta.toLocaleLowerCase().indexOf("update") != -1 ||
//         consulta.toLocaleLowerCase().indexOf("truncate") != -1 || consulta.toLocaleLowerCase().indexOf("create") != -1 ||
//         consulta.toLocaleLowerCase().indexOf("drop") != -1) {
//         return `Select 'Comandos DDL ou DML ' as "Permissão negada "`;
//     }else{
//         return consulta;
//     }
// }



app.get('/executa/query', function (req, res) {
    var q = url.parse(req.url, true).query;
    var consulta = q.query;

    if (consulta.indexOf("mapa") != -1) {
        consulta = `select *, ST_asText(st_transform(mapa,4326)) as "geometry" from (${consulta}) as a`;

    } else {
        if (consulta.toLocaleLowerCase().indexOf("delete") != -1 || consulta.toLocaleLowerCase().indexOf("update") != -1 ||
            consulta.toLocaleLowerCase().indexOf("truncate") != -1 || consulta.toLocaleLowerCase().indexOf("create") != -1 ||
            consulta.toLocaleLowerCase().indexOf("drop") != -1) {
            consulta = `Select 'Comandos DDL ou DML ' as "Permissão negada "`;
        }
    }


    pool.query(consulta, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            //  console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            //  console.log({ erro: error.toString() });
        }

    })

})



app.get('/terminal/query/postgres', function (req, res) {
    console.log(`O ip: ${req.ip} realizou uma operação em : ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`);
    var q = url.parse(req.url, true).query;
    var linha = q.linha;
    pool.query(linha, (err, resp) => {
        if (resp) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(resp.rows));
            //  console.log(JSON.stringify(resp.rows));
        } else {
            res.setHeader('Content-Type', 'application/json');
            var error = err;
            res.send(JSON.stringify({ erro: error.toString() }));

            //  console.log({ erro: error.toString() });
        }

    })

})






app.get('/download', function (req, res) {
    var q = url.parse(req.url, true).query;
    var pasta = q.pasta;
    var diretorio = q.diretorio;
    var file = __dirname + `/acess/public/${pasta}/${diretorio}`;
    res.download(file); // Set disposition and send it.
});


app.post('/owbanco', (req, res) => {
    var c = req.body;

    var This_pool = new Pool({
        user: c.usuario,
        host: c.host,
        database: c.banco,
        password: c.senha,
        port: c.porta
    })


    This_pool.connect((err) => {
        if (err) {
            res.json({ erro: "Falha na conexão" });
        } else {

            pool = This_pool;
            pool.query("SELECT tablename FROM pg_catalog.pg_tables where schemaname = 'public' and tablename != 'spatial_ref_sys'", (err, resp) => {
                if (resp) {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify(resp.rows));
                    //  console.log(JSON.stringify(resp.rows));
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    var error = err;
                    res.send(JSON.stringify({ erro: error.toString() }));

                    //  console.log({ erro: error.toString() });
                }

            })
        }
    })


})




app.listen(process.env.PORT || 80, function () {
    console.log('Servidor rodando na porta 80 !');
});
