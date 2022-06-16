const cmd = require('./cmd');
const fs = require('fs');
const { throws } = require('assert');

module.exports.restore = async file => 
{
    if(!fs.existsSync(`${process.dirRoot}/pg_bin/psql.exe`))
    {
        console.error("O executavel psql.exe não foi econtrado");
    }

    let f = process.configurations.postgres;
    
    console.log("Tentando criar o banco de dados");
    try{

        r = await cmd.exec
        (
            `psql -c "CREATE DATABASE ${f.database};" "postgresql://${f.user}:${f.pass}@${f.host}:${f.port}/postgres"`
        );

        console.log(r);

    }catch(exception)
    {
        console.error(exception);
        
    }

    console.log("Tentando restaurar os dados o banco de dados");

    try{

        r = await cmd.exec
        (
            `psql -f ${file} "postgresql://${f.user}:${f.pass}@${f.host}:${f.port}/${f.database}"`
        );

        console.log(r);

    }catch(exception)
    {
        console.error(exception);       
        
    }

    console.log("Processo finalizado");

   
}