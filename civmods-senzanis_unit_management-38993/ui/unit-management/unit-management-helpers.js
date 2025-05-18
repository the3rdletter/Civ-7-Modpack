export function sortMultiple(){
    var props = arguments;
    return function (obj1, obj2) {
        var i = 0;
        var result = 0;
        var numberOfProps = props.length;

        while (result === 0 && i < numberOfProps) {
            result = sortAttribute(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

export const sortAttribute = (property) => {
    var sortOrder = 1;
    if (property[0] === '-') {
        sortOrder = -1;
        property = property.substr(1);
    }

    return function (a, b) {
        var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
        return result * sortOrder;
    }
}

