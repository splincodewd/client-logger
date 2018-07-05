const Benchmark = require('benchmark/benchmark');
const suite = new Benchmark.Suite;

const LoggerAPI = require('../../lib/index');
const {ClientLogger} = LoggerAPI;

console.debug = () => {
};
console.info = () => {
};
console.warn = () => {
};

// add tests
suite.add('ClientLogger#API', function () {
    const clientLogger = new ClientLogger({consoleInstance: console});
    clientLogger.debug('1');
    clientLogger.info('2');
    clientLogger.warn('3');
})
    .add('console#API', function () {
        console.debug('1');
        console.info('2');
        console.warn('3');
    })
    // add listeners
    .on('cycle', function (event) {
        console.log(String(event.target));
    })
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'));
    })
    // run async
    .run({'async': false});

