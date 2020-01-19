const chokidar = require('chokidar');
const chalk = require('chalk');

// Initialize watcher.
const watcher = chokidar.watch('.', {
    ignored: [/node_modules/, /.git/],
    persistent: true,
});

// Something to use when events are received.
const log = console.log.bind(console);

// Add event listeners.
watcher
    .on('add', path => log(chalk.green.bold('A'), path))
    .on('change', path => log(chalk.blue.bold('U'), path))
    .on('unlink', path => log(chalk.red.bold('D'), path))
//     .on('addDir', path => log(`Directory ${path} has been added`))
//     .on('unlinkDir', path => log(`Directory ${path} has been removed`))
    .on('error', error => log(`Watcher error: ${error}`))
//     .on('ready', () => log('Initial scan complete. Ready for changes'))
//     .on('raw', (event, path, details) => {
//         // internal
//         log('Raw event info:', event, path, details);
//     });

// watcher
//     .on('raw', (event, path) => {
//         // internal
//         console.log(chalk.blue.bold(event), chalk.yellow(path));
//     });
