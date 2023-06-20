(() => {
  var __commonJS = (callback, module) => () => {
    if (!module) {
      module = {exports: {}};
      callback(module.exports, module);
    }
    return module.exports;
  };

  // _build/default/app/lib/lib.js
  var require_lib = __commonJS((exports) => {
    "use strict";
    var name = "Ricardo!!";
    exports.name = name;
  });

  // _build/default/app/app.js
  "use strict";
  var Lib = require_lib();
  console.log(Lib.name);
})();
