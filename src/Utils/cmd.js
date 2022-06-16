const { exec } = require("child_process");

module.exports.exec = cmmd => {

    return new Promise((r, err) => {

        exec(cmmd, (error, stdout, stderr) => {
            if (error) {
                err(error);
            }
            if (stderr) {
                
               err(stderr);
            }           
            r(stdout);
        });

    })
    
}
