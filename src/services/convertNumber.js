export function convertNumber(item) {
    return item.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}