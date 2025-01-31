/*
    This removed the cookies from the old `/Flappy-Bird` location
*/
const cookies = ["colors", "maxScore", "coinAmount"];
    
cookies.forEach((cookieName) => {
    document.cookie =     document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/Flappy-Bird";
});

/*
    Generalised cookie functions
*/

const getCookieData = (cookieName = "") => {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for(let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];

        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }

    }

    return "";
}

// Never call this function outside of normal checks
// Please write checks for cookies if you wanna use this, you could overwrite stuff you dont want
function setCookie(cookieValue, cookieName = "", daysUntillExpire = 1000) {
    const date = new Date();
    date.setTime(date.getTime() + (daysUntillExpire*24*60*60*1000));
    const expires = "expires="+ date.toUTCString();

    const cookie = cookieName + "=" + cookieValue + ";" + expires.slice(0, -3) + "UTC;path=/";
    document.cookie = cookie;
}

// This still needs to be used somewhere but for now it is unused code
function deleteCookie(cookieName = "") {
    document.cookie = cookieName + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
}

/*
    Cookies for the personal best
*/

// This checks if a cookie for max score needs to be set
function checkMaxScoreCookie(cookieValue = 0) {
    let cookie = getCookieData("maxScore");

    checkCoins(cookieValue);

    if (cookie == "" || Number(cookie) < cookieValue) {
        setCookie(cookieValue, "maxScore");
        console.log("set new max score", cookieValue, "Was:", cookie);
        return;
    }

    console.log("Did not update score", cookieValue, "Was:", cookie);

}

/* 
    Cookies for the coins
*/

function checkCoins(cookieValue = 0) {
    const cookieName = "coinAmount";
    const cookie = getCookieData(cookieName);

    if (cookie == "") {
        setCookie(cookieValue, cookieName);
        console.log("Set initial cookie for coins:", cookieValue);
        return;
    }

    cookieValue += Number(cookie);

    setCookie(cookieValue, cookieName);
    console.log("Updated cookie for coins:", cookieValue, "Was:", cookie);
}

// This returns an array of a boolean if it has worked and a string of why it has failed or that is has passed
const spendCoins = (cookieValue = 0) => {
    const cookieName = "coinAmount";
    const cookie = getCookieData(cookieName);

    if (cookie == "") return [false, "Cookie not set! Fix this cause it auto sets it!"];

    const newValue = Number(cookie) - cookieValue;
    if (newValue < 0) return [false, "Not enough coins!"];

    setCookie(newValue, cookieName);
    return [true, "Coins spend and saved!"];
}

/*  
    Cookies for shop
*/

const toArray = (string = "") => {
    const returnedValue = string.split(",");
    return returnedValue;
}

// Values that needs to be added to array as value passed
function checkColors(cookieValue = "Yellow") {
    const cookieName = "colors";
    const cookie = getCookieData(cookieName);

    if (cookie == "") {
        setCookie(cookieValue, cookieName);
        console.log("set initial colors:", cookieValue)
        return;
    }

    let array = toArray(cookie);

    if (array.includes(cookieValue)) {
        console.log("Color already in cookie");
        return;
    }

    array.push(cookieValue);
    let valueForCookie = array.toString();

    if (valueForCookie.substring(0, 1) === ",") {
        valueForCookie = valueForCookie.slice(1)
    }

    setCookie(valueForCookie, cookieName);
    console.log("set new colors cookie", valueForCookie);
}

checkMaxScoreCookie(0);
checkColors("Yellow");

const getColors = () => { return toArray(getCookieData("colors")); }
