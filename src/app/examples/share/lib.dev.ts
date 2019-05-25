declare var require: any;
let exportedAPI;
try {
  exportedAPI = require('./../../../../../lib/index');
} catch (e) {
  console.log('Module is dev');
}

export default exportedAPI;
