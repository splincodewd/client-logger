export class JsonParse {

    private static objectHash: RegExp = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g;

    public static stringify(json: object | string | any): string[] {
        if (typeof json !== 'string') {
            json = JSON.stringify(json, null, '\t');
        }

        const arr: string[] = [];
        const _string = 'color:green';
        const _number = 'color:darkorange';
        const _boolean = 'color:blue';
        const _null = 'color:magenta';
        const _key = 'color:red';

        json = json.replace(this.objectHash, function (match: any) {

            let style = _number;
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    style = _key;
                } else {
                    style = _string;
                }
            } else if (/true|false/.test(match)) {
                style = _boolean;
            } else if (/null/.test(match)) {
                style = _null;
            }

            arr.push(style);
            arr.push('');

            return '%c' + match + '%c';
        });

        arr.unshift(json);

        return arr;
    }

}
