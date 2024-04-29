export function currencyFormat(num) {
    if(!num) {
        return '';
    } else {
        const parsedNum = parseFloat(num);
        return parsedNum.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
export function isValidEmail(email) {
    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
export function isValidMobileNo(mobileNo) {
    var zeroPattern = /^0\d{10}$/; // 11 digits starting with 0
    var plus63Pattern = /^\+63\d{10}$/; // 13 digits starting with +63
    return zeroPattern.test(mobileNo) || plus63Pattern.test(mobileNo);
}
export function lpad(str, length) {
    str = str.toString(); 
    while (str.length < length) {
        str = '0' + str;
    }
    return str;
}
export const endpoint = () => {
    return 'http://192.168.0.254:8080/online-payment/api/v1';
    //return 'http://localhost:8080/api/v1';
}
export function goBack() {
    window.history.back();
}
export const getCurrentDateTime = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
}