/* eslint-disable */
import { Image } from 'react-native';
import _ from "lodash";
import moment from "moment";
import { Images } from "../constants/";
import { Asset } from 'expo-asset';

export const profile = {
  avatar: Images.Profile,
  name: "Guest",
  // type: "Seller",
  plan: "VIP",
  rating: 4.8,
  isAnonymous: true
};

export const getParams = (param, key) => {
  return param && new URLSearchParams(param.replace(/\+/gi, "%2B")).get(key);
};

export const rand = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const getParentPath = pathname => {
  return pathname
    .split("/", 3)
    .toString()
    .replace(/,/gi, "/");
};
export const checkPermission = (acceptRole, userRole) => {
  return acceptRole.indexOf(userRole) !== -1;
};
export const checkAuth = (user, pathname) => {
  // pathname = getParentPath(pathname);
  // const acceptRole = _.find(routes, { path: pathname }) && _.find(routes, { path: pathname }).role;
  // // return acceptRole === user.role || (user.child_roles && user.child_roles.indexOf(acceptRole) !== -1);
  // return acceptRole.indexOf(user.role) !== -1;
};
export function getDateFomat(input, type) {
  var date;
  if (type === undefined || type === null) {
    date = moment(input).format("YYYY-MM-DD HH:mm:ss");
  } else if (type === 1) {
    date = moment(input).format("YYYY-MM-DD");
  } else if (type === 2) {
    date = moment(input).format("YYYY-MM-DD") + " 23:59:59";
  }
  else if (type === 'M') {
    date = moment(input).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") ? 'Today' : moment(input).format('MMMM');
  }
  return date;
}
export const getDateTitle = ({ created_at, index, pre }) => {
  const curentDate = moment(created_at)
  let dateTitle = null
  if (!index) {
    if (curentDate.isSame(new Date(), "day"))
      dateTitle = "Hôm nay"
    else
      dateTitle = curentDate.format('MMMM Do, YYYY')
  }
  else {
    const preDate = moment(pre)
    if (!preDate.isSame(curentDate, "day")) {
      dateTitle = preDate.format('MMMM Do, YYYY')
    }
  }
  return dateTitle
}
export const getSreach = (doc, key) => {
  var sreach = [],
    haveChar = false,
    i = 0;
  if (key.split(",").length > 1) {
    key.split(",").forEach(element => {
      if (doc[element])
        sreach = [...doc[element].replace(/ /g, ",").split(","), ...doc[element], ...sreach];
    });
  } else if (doc[key])
    sreach = [...doc[key].replace(/ /g, ",").split(","), ...doc[key]];
  do {
    haveChar = false;
    i++;
    sreach = sreach.reduce(function (acc, val) {
      if (val && acc.indexOf(val) === -1) {
        val = val.removeDiacritics()
        acc = [...acc, val];
      }
      if (val.length >= 3) {
        const last = val.slice(1);
        const frist = val.slice(0, -1);
        if ((last.length >= 3 && sreach.indexOf(last) === -1) || (frist.length >= 3 && sreach.indexOf(frist) === -1)) {
          haveChar = true;
        }
        if (acc.indexOf(last) === -1) acc = [...acc, last];
        if (acc.indexOf(frist) === -1) acc = [...acc, frist];
        //log.debug(i, haveChar, "getSreach:", JSON.stringify(acc), val, sreach.indexOf(last), last, sreach.indexOf(frist), frist)
      }
      return acc;
    }, []);
  } while (haveChar && i < 100);
  sreach = sreach.reduce(function (acc, val) {
    // console.log("val",acc.indexOf( val))
    if (val && !acc[val] && val !== "") return { ...acc, [val]: true };
    else return acc;
  }, {});

  //log.debug("getSreach:", JSON.stringify(sreach))
  return sreach;
};

export function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).ag();
    }
  });
}