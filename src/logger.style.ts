export class CssParser {

    public static generatePropName(propName: string): string {
        return propName.split(/(?=[A-Z])/g).map(function (value: string) {
            return value.charAt(0).toLowerCase() + value.substring(1);
        }).join('-');
    }

    public static toString(obj: object): string {
        let result = '';
        const keys = Object.keys(obj);
        if (!keys.length) {
            return result;
        }
        const len = keys.length;

        for (let i = 0; i < len; i++) {
            const key = keys[i];
            const val = obj[key];
            result += `${CssParser.generatePropName(key)}:${val};`;
        }

        return result;
    }

}
