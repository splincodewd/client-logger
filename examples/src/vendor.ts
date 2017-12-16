// Application Dependencies
declare const require: any;
import "./css/simple-grid.min.css";
import "./css/custom.css";
import "lodash";

let devtools = require("devtools-detect");
if (!devtools.open) {
    elementChangeClass("console-dis-activate", "no-display", "");
}

window.addEventListener('devtoolschange', function (e) {
    const devtoolsIsOpen = e['detail']['open'];
    if (devtoolsIsOpen) {
        elementChangeClass("console-activate", "no-display", "");
        elementChangeClass("console-dis-activate", "", "no-display");
    } else {
        elementChangeClass("console-dis-activate", "no-display", "");
        elementChangeClass("console-activate", "", "no-display");
    }
});

function elementChangeClass(idElement: string, removeClass: string, addClass: string) {
    removeClass ? document.getElementById(idElement).classList.remove(removeClass) : null;
    addClass ? document.getElementById(idElement).classList.add(addClass) : null;
}

window.onload = function() {
    document.getElementById('app').classList.add("load");
};