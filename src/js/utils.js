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
export const numInputOnly = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '').toUpperCase();
};
export const textInputOnly = (e) => {
    e.target.value = e.target.value.replace(/[^a-zA-Z]/g, '').toUpperCase();
};
export const numAndTextInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9a-zA-Z()-]/g, '').toUpperCase();
};
export const addressInput = (e) => {
    e.target.value = e.target.value.replace(/[^0-9a-zA-Z.\-&\s]/g, '').toUpperCase();
};
export const endpoint = () => {
    if (process.env.NODE_ENV === 'production') {
        if (window.location.hostname === 'payment.mercantile.ph') {
            console.log('LIVE');
            return import.meta.env.VITE_LIVE_API_URL;
        } else {
            console.log('UAT');
            return import.meta.env.VITE_UAT_API_URL;
        }
    } else {
        console.log('LOCALHOST');
        return import.meta.env.VITE_LOCAL_API_URL;
    }      
}
export const isLive = () => {
    var isLive = false;
    if (process.env.NODE_ENV === 'production') {
        if (window.location.hostname === 'payment.mercantile.ph') {
            isLive = true;
        }
    }  
    return isLive; 
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
export const bpiLogo = () => {
    return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhpo9TovofK2uSZKEaAQ_CXQ5KY-qUIQD1OYKOMfS2QSjBEIMF9wQ4qHjBZvNoAxf9Ia_H-GDgQYuLDylnXAXbTKR2UTi0s1tzfsVWzhTCXt8RkHv-1cl9hbbsqWeedMWjI6z6oeAPifXafH1XjBBUFqKesIIOpCxBuK1L8KDMQcnZF74yL8WX-nIQOipvH/s1600/bpilogo%20-%20Copy.png';
}
export const cbcLogo = () => {
    return 'https://test.dragonpay.ph/Bank/images/cbclogo.jpg';
}
export const rcbcLogo = () => {
    return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibI-2Utl2OnVw6OAIuKGv7hlCW6bNyj94pbuv8rT6NocpEKxZuvesKYLumvISweAm7EKLU3cXNi27YeGX2Rm8_7rAD91qpUQZ7MJi6TXgT20WJTe5qGLCm7i-7o9XPsPMOCJbVdZjYL03HB7yF1fDX7TIQAG4BJ0rGPvoOabneaJd_-X0Qaxgosw43Q29K/s1600/rcbclogo.png';
}
export const ubpLogo = () => {
    return 'https://test.dragonpay.ph/Bank/images/ubplogo.jpg';
}
export const gcashLogo = () => {
    return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjwM-N5wCHW8YlixsTjJ-npFHRQ2z__aSlVFesbHZewNQlujh2PS9ARoYzux3kCd1D2DA5d0Qoea9wL2efnCRQtqYjf2by842wtX8KvqPa5xevAFZZPvTZyeJ4HUzaarHUTQUvSKvgaeBerGgnhZLj3e8-JlgcteA6ndvOud2WfSgf0mWgVznHB4Uw35tX0/s1600/gcashlogo.png';
}
export const mayaLogo = () => {
    return 'https://test.dragonpay.ph/Bank/images/paymayalogo.jpg';
}
export const ccLogo = () => {
    return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhH-VPt7lqPOA5ZB3_TYlh2LN19zTscvf_4sv50NgbdaIWPqXLhpDozV5AEGCDb_YDb_gx6QpW8LRdIzisaYBCgufYBt06Kh5Fo9eHgJJ4A7a4NkP3dFKvP-Y8jRbeZOWWbP_t8Ct4sXKfYawKkwKBaWw8UvXhKNG47Haa_Xc_67hcohyphenhyphenK5-kGJu3zUmIKd/s1600/credit_card_icon.png';
}
export const bogusLogo = () => {
    return 'https://test.dragonpay.ph/Bank/images/boguslogo.jpg';
}
export const miciLogo = () => {
    return 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhbrY98YwwhSY6TEouZBQb9szl97AVXU4yEZfhFo-4dfX3fr-Inu0poYWn5N-I3W_b58N21Mi_UjXKOtgPfVclLhGMPBekbk9ftEaTUhafn7WE5wKjJhOnPU2mlK_Ie1p-xlLeYTV994PsxwMEBoPYLeN1WzSdyY7pPT8_lBNTEt1tVwnQvKFDDMNyntVe/s1600/mici_logo_s.png';
}