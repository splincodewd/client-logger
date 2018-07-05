declare var require: any;
let exportedAPI;
try {
  exportedAPI = require('./../../../../lib/index.js');
} catch (e) {
  console.info('Module is dev');
}

export default exportedAPI;
