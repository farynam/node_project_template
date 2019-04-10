const ex = require('./util.js').ex;


process.on('SIGINT', function(code) {
    ex(`vagrant halt`);
    return console.log(`About to exit with code ${code}`);
});

ex(`vagrant up`);
ex(`vagrant gatling-rsync-auto`);

