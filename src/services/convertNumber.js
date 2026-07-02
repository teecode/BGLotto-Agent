export function convertNumber(item) {
    if(item === '' || item === null || item === undefined){
        return null;
    } else {
        const num = Number(item);
        if (isNaN(num)) return item;
        return num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
}