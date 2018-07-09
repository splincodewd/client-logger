declare const require: any;
import { LoggerInjector } from '../../utils/spec-helpers/converter';
import { ClientLogger } from '../../../index';
import { expect } from 'chai';
import 'mocha';

const Window = require('window');
const window = new Window();
const { document } = new Window();

const myConsoleStream: Console = LoggerInjector.patch();

describe('[TEST]: Check clipboard', () => {

    const clientLogger = new ClientLogger({

        // Since we are emulating the console
        // and do not want the data to be output
        // during testing, we make the monkey patching
        consoleInstance: myConsoleStream

    });

    it(`Copy is security and save data local memory`, () => {

        const JsonValue = { a: 1, b: [1, 2, 3] };
        clientLogger.clipboard.copy(JsonValue, window, document);
        const options = clientLogger.clipboard.paste();

        expect(options.exec).to.equal(false);
        expect(options.clipboardCopy).to.equal('');
        expect(options.memoryCopy).to.equal(JSON.stringify(JsonValue, null, '\t'));

    });

});
