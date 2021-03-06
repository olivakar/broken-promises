const { openSync, closeSync } = require('fs');

let leakedFd = false;

function DoSomething() {
  let fd = 0;
  return new Promise(async (resolve) => {
    fd = openSync(__filename, 'r+');
    leakedFd = true;
    functionThatDoesNotExist();
  }).catch(() => {
    closeSync(fd);
    leakedFd = false;
  });
}

DoSomething();

process.on('exit', () => {
  console.log('File descriptor leaked?', leakedFd);
});
