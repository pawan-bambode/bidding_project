function checkNUE(elem) {
    if (elem !== undefined && elem !== null && elem.trim() !== '') {
        return false;
    } else {
        return true;
    }
    
}



module.exports = {checkNUE}