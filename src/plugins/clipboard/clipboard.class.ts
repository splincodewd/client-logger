declare global {
    interface Window {
        clipboardData: any;
    }
}

export interface ClipboardPasteImpl {
    exec: boolean;
    clipboardCopy: string;
    memoryCopy: string;
}

export class Clipboard {

    private copyPasteResult: ClipboardPasteImpl;

    public copy(value: any, context = window, dom = document): string {
        const clipboardData = context.clipboardData;

        if (typeof value !== 'string') {
            value = JSON.stringify(value, undefined, '\t');
        }

        const text = value;
        let exec = false;

        if (clipboardData && clipboardData.setData) {
            clipboardData.setData('Text', text);
        } else if (dom.queryCommandSupported && dom.queryCommandSupported('copy')) {
            const textarea = dom.createElement('textarea');
            textarea.textContent = text;
            textarea.style.position = 'fixed';
            dom.body.appendChild(textarea);
            textarea.select();

            try {
                exec = dom.execCommand('copy');
            } catch (ex) {
                console.warn('Copy to clipboard failed.', ex);
            } finally {
                dom.body.removeChild(textarea);
            }

        }

        this.copyPasteResult = {
            exec,
            clipboardCopy: exec ? value : '',
            memoryCopy: value
        };

        return value;
    }

    public paste(): ClipboardPasteImpl {
        return this.copyPasteResult;
    }

}
