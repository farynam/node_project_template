const {exec} = require('child_process');
const readline = require('readline');


module.exports.ex = ex;

function ex(cmd) {
    return new Promise((resolve, reject) => {
        const run = exec(cmd, {maxBuffer: 1024 * 1024}, (error, stdout, stderr) => {

            if (error) {
                console.log(error);
                reject(error);
            } else {
                resolve(stdout);
            }
        });

        run.stdout.setEncoding('utf8');
        run.stdout.on('data', console.log);
        run.stderr.setEncoding('utf8');
        run.stderr.on('data', console.log);
    });
}

module.exports.readLine = function (promptMessage) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let pr = new Promise((resolve, reject) => {
        rl.question(promptMessage, (answer) => {
            resolve(answer);
        });
    });

    pr.then(function(value){
        rl.close();
    });

    return pr;
};


module.exports.exssh = function (cmd, options) {
    const ssh_cmd = `ssh -p ${options.remote_port} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=ERROR -o IdentitiesOnly=yes -i ${options.ssh_private_key}`;
    return ex(`${ssh_cmd} ${options.remote_user}@${options.remote_addr} 'bash -l -c "cd ${options.remote_path};${cmd}"'`);
};

module.exports.rsyncToLocal = function(options) {
    const ssh_cmd = `ssh -p ${options.remote_port} -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -o LogLevel=ERROR -o IdentitiesOnly=yes -i ${options.ssh_private_key}`;
    return ex(`rsync -rav -e "${ssh_cmd}" ${options.remote_user}@${options.remote_addr}:${options.remote_path} ${options.local_path}`);
};
