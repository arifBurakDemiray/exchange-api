export function minuteBetween(date1,date2){
    const millis = date1 - date2;

    return Math.floor(millis / (1000*60))
}