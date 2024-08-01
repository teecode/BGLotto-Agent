export function convertNumber(item) {
    if(item === ''){
        return null
    } else {
        return item?.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    }
   
}