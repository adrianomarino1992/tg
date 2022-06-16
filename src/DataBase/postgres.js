const { Pool } = require('pg');
var pool;

module.exports.start = () =>
{
    pool = new Pool({
        user: process.configurations.postgres.user,
        host: process.configurations.postgres.host,
        database: process.configurations.postgres.database,
        password: process.configurations.postgres.pass,
        port: process.configurations.postgres.port
    })
    
}


module.exports.query = query => 
{
    return new Promise((resolve, reject)=>{

        
        pool.query(query, (err, result)=>{

            if(err)
            {
                reject(err);
                
            }else{

                resolve(result.rows);
            }

        });

    })
} 

module.exports.change = c =>
{


    return new Promise((resolve, rejetc) =>{


        var newPool = new Pool({
            user: c.usuario,
            host: c.host,
            database: c.banco,
            password: c.senha,
            port: c.porta
        })


        newPool.connect((err) => {
            if (err) {
                rejetc(new Error("Falha na conexão"));
            } else {    
                pool = newPool;
                pool.query("SELECT tablename FROM pg_catalog.pg_tables where schemaname = 'public' and tablename != 'spatial_ref_sys'", (err, resp) => {
                    if (resp) {                        
                        resolve(resp.rows);
                    } else {                        
                        rejetc(new Error(err.message));                        
                    }    
                })
            }
        })

    });
    
}
