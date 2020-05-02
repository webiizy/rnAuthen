
/* eslint-disable */
import { diacriticsRemovalMap } from "./data";
String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.digits = function () {
    return this.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

};
// Loai bo dau `?~. va ky tu dat biet
String.prototype.removeDiacritics = function () {
    let str = this
    for (var i = 0; i < diacriticsRemovalMap.length; i++) {
        str = str.replace(diacriticsRemovalMap[i].letters, diacriticsRemovalMap[i].base);
    }
    return str
        .replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>�\{\}\[\]\\\/]/gi, "")
        .trim()
        .replace(/ /g, "")
        .toLowerCase();
};