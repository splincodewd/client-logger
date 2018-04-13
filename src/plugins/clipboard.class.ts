export class Clipboard {

    public copy(value: string | object | any) {

        if (typeof value !== 'string') {
            value = JSON.stringify(value, undefined, '\t');
        }

        const text = value;

        if (window['clipboardData'] && window['clipboardData'].setData) {
            window['clipboardData'].setData('Text', text);
        } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
            const textarea = document.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed';
            document.body.appendChild(textarea);
            textarea.select();

            try {
                document.execCommand('copy');
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }

        }

        return value;

    }

}
