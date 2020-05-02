/* eslint-disable */
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-community/google-signin';
import {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import Config from '../config';
import {profile} from '../services';
import moment from 'moment';
var unsubscribe = null;
class Firebase {
  constructor() {
    this.auth = auth();
    this.db = firestore();
  }
  onAuthStateChanged(setUser, setOrders) {
    return this.auth.onAuthStateChanged(currentUser => {
      global.setSpinner(false);
      console.log('currentUser', currentUser);
      if (currentUser && !currentUser.isAnonymous)
        this.getUserInfo(currentUser, setUser, setOrders);
      else {
        unsubscribe && unsubscribe();
        setUser(profile);
      }
    });
  }
  getCredential(email, password) {
    return auth.EmailAuthProvider.credential(email, password);
  }
  handleOrders(querySnapshot) {
    let orders = {status: '', data: {}};
    querySnapshot &&
      querySnapshot.forEach(function(item) {
        if (item.data()) {
          orders.data[item.id] = {
            orderId: item.id,
            action: item.data().action,
            created_at: item.data().created_at,
            merchantname: item.data().merchantname,
            merchantcode: item.data().merchantcode,
            billdescription: item.data().billdescription,
            product: item.data().product,
            requestId: item.data().requestId,
            amount: item.data().amount,
            // response: item.data().response
          };
          if (item.data().response) {
            orders.data[item.id].response = {
              at: item.data().response.at,
              phonenumber: item.data().response.phonenumber,
              amount: item.data().response.amount,
              message: item.data().response.message,
              status: item.data().response.status,
              giftIds: item.data().response.giftIds,
              fee: item.data().response.fee,
              extra: item.data().response.extra,
            };
          }
        }
      });
    // console.log('handleOrders', orders)
    return orders;
  }
  getOrders(where, handleChange) {
    try {
      return this.db
        .collection('orders')
        .where('owner', '==', this.getUid())
        .where(...where)
        .onSnapshot(handleChange, function(error) {
          if (error) console.log('get orders error', error);
          handleChange(null);
        });
    } catch (error) {
      if (error) console.log('get orders error', error);
      handleChange(null);
    }
  }
  getUserInfo(currentUser, setUser) {
    try {
      this.getDocument('users', this.getUid(), doc => {
        if (doc && doc.exists) {
          unsubscribe = this.getOrders(
            ['action', 'in', ['getToken', 'getRespone']],
            querySnapshot => {
              const orders = this.handleOrders(querySnapshot);
              if (orders && orders.data && Object.keys(orders.data).length)
                orders.status = `Có ${
                  Object.keys(orders.data).length
                } hóa đơn chờ thanh toán!`;
              setUser({...currentUser._user, ...doc._data, orders});
            },
          );
        } else {
          setUser(profile);
        }
      });
    } catch (error) {
      console.log('getUserInfo', error);
    }
  }
  updateSMember(user, data, callback) {
    try {
      let smember = user.smember || {};
      smember.active = 1; // đã kích hoạt
      if (smember.expertDate) smember.expertDate = smember.expertDate.toDate();
      if (data.dayBuy)
        smember.expertDate = new Date(
          moment(smember.expertDate)
            .add(data.dayBuy, 'days')
            .format('YYYY/MM/DD HH:mm:mm'),
        );
      this.updateDocument('users', {id: this.getUid(), smember}, error => {
        if (error) {
          callback && callback(error);
        }
      });
    } catch (error) {
      console.log('getUserInfo', error);
    }
  }
  async loginWithFaceBook(callback) {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      result => {
        if (result.isCancelled) {
          callback('Login cancelled');
        } else {
          new GraphRequestManager()
            .addRequest(
              new GraphRequest('/me?fields=email', null, (error, res) => {
                if (error) callback(error);
                else {
                  this.auth
                    .fetchSignInMethodsForEmail(res.email)
                    .then(providers => {
                      console.log('providers', providers);
                      if (!(providers && providers.length)) {
                        AccessToken.getCurrentAccessToken().then(data => {
                          const facebookCredential = auth.FacebookAuthProvider.credential(
                            data.accessToken,
                          );
                          // let exmaple_facebook = {
                          //     "additionalUserInfo": {
                          //         "isNewUser": false, "profile":
                          //             { "email": "lananhnguyen021209@gmail.com", "first_name": "Nguyen", "id": "263358944672135", "last_name": "Lan Anh", "name": "Lan Anh Nguyen", "picture": [Object] }, "providerId": "facebook.com"
                          //     },
                          //     "user": {
                          //         "displayName": "Lan Anh Nguyen", "email": "lananhnguyen021209@gmail.com",
                          //         "emailVerified": false, "isAnonymous": false, "metadata": [Object], "phoneNumber": null,
                          //         "photoURL": "https://graph.facebook.com/263358944672135/picture", "providerData": [Array], "providerId": "firebase",
                          //         "uid": "PrAmLKyxqkP9OZYztvhRY4HUORr1"
                          //     }
                          // }
                          // console.log("data", data)
                          // console.log("facebookCredential", facebookCredential)
                          this.signInWithCredential(
                            facebookCredential,
                            'facebook',
                            callback,
                          );
                        });
                      } else if (providers && providers[0] === 'google.com') {
                        this.loginWithGoogle(callback);
                      } else {
                        callback({
                          code: 'auth/account-exists-with-different-credential',
                          email: res.email,
                          provider: providers[0],
                        });
                      }
                    });
                }
              }),
            )
            .start();
        }
      },
      error => {
        callback(error);
      },
    );
  }
  async loginWithGoogle(callback) {
    // Get the users ID token
    await GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId: Config._env.webClientId, // From Firebase Console Settings,
      // forceCodeForRefreshToken: true,
      offlineAccess: false,
    });
    const data = await GoogleSignin.signIn();

    // Create a Google credential with the token
    const googleCredential = auth.GoogleAuthProvider.credential(
      data.idToken,
      data.accessToken,
    );
    // let exmaple_google = {
    //     "additionalUserInfo": {
    //         "isNewUser": false, "profile": {
    //             "aud": "481147921191-9vjqjcsb3q4bjitompmqatfmca4ff2o1.apps.googleusercontent.com", "azp": "481147921191-v4lt5khj1gn287ne7iq39v91ln6s7r1u.apps.googleusercontent.com", "email": "candyzumy@gmail.com", "email_verified": true, "exp": 1586754367, "family_name": "Nguyen", "given_name": "TiNa", "iat": 1586750767, "iss": "https://accounts.google.com", "locale": "en", "name": "TiNa Nguyen", "picture": "https://lh3.googleusercontent.com/a-/AOh14GgetmBLGaHSkKCbBk9jvcEmDL4q2mZuysZS2ppO=s96-c", "sub": "107436299695673983007"
    //         }, "providerId": "google.com"
    //     }, "user": {
    //         "displayName": "TiNa Nguyen", "email": "candyzumy@gmail.com", "emailVerified": true, "isAnonymous": false,
    //         "metadata": [Object], "phoneNumber": null, "photoURL": "https://lh3.googleusercontent.com/a-/AOh14GgetmBLGaHSkKCbBk9jvcEmDL4q2mZuysZS2ppO=s96-c", "providerData": [Array], "providerId": "firebase", "uid": "7As6Lqm5XOSUeheoEQgwPKdrWrI2"
    //     }
    // }
    // console.log("data", data)
    // console.log("googleCredential", googleCredential)
    this.signInWithCredential(googleCredential, 'google', callback);
  }
  signInWithCredential(credential, provider, callback) {
    this.auth
      .signInWithCredential(credential)
      .then(async data => {
        try {
          const id = this.getUid(data.user);
          var currentDoc = await this.db
            .collection('users')
            .doc(id)
            .get();
          if (currentDoc && currentDoc.exists) {
            callback(null, data.user);
          } else {
            this.db
              .collection('users')
              .doc(id)
              .set({
                name: data.user.displayName,
                role: {customer: true},
                email: data.user.email,
                provider,
                created_at: new Date(),
              })
              .then(() => {
                callback(null, data.user);
              });
          }
        } catch (error) {
          console.log('getDocument', error);
          callback(error);
        }
      })
      .catch(error => {
        callback(error);
      });
  }
  getDocument(collection, id, handleChange) {
    try {
      const api = this.db.collection(collection).doc(id);
      api.onSnapshot(function(doc) {
        handleChange && handleChange(doc);
      });
      return api.get();
    } catch (error) {
      handleChange && handleChange(null, error);
      console.log('getDocument', error);
    }
  }
  getUid = user => {
    !user && (user = this.auth.currentUser);
    return (
      user &&
      // user.email && user.email.removeDiacritics() ||
      user.uid
    );
  };
  async addDocument(collection, id, doc, callback) {
    try {
      var currentDoc = await this.db
        .collection(collection)
        .doc(id)
        .get();
      if (currentDoc && currentDoc.exists) {
        callback({exists: true});
      } else {
        this.db
          .collection(collection)
          .doc(id)
          .set({
            ...doc,
            id,
            owner: this.getUid(),
            created_at: new Date(),
          })
          .then(() => {
            callback();
          });
      }
    } catch (error) {
      callback(error);
    }
  }
  async setDocument(collection, doc, callback) {
    try {
      !doc.id && (doc.id = new Date().getTime().toString());
      this.db
        .collection(collection)
        .doc(doc.id)
        .set({editor: this.getUid(), updated_at: new Date(), ...doc})
        .then(function(docRef) {
          callback && callback();
        })
        .catch(function(error) {
          console.log(error);
          callback && callback(error);
        });
    } catch (error) {
      console.log(error);
    }
  }
  async updateDocument(collection, doc, callback) {
    try {
      var currentDoc = await this.db.doc(`${collection}/${doc.id}`).get();
      if (currentDoc && currentDoc.exists) {
        this.db
          .collection(collection)
          .doc(doc.id)
          .update({editor: this.getUid(), updated_at: new Date(), ...doc})
          .then(function(docRef) {
            callback && callback();
          })
          .catch(function(error) {
            // console.log(error);
            callback && callback(error);
          });
      } else {
        callback && callback('Không tìm thấy dữ liệu');
      }
    } catch (error) {
      console.log(error);
      callback && callback(error);
    }
  }
  async removeDocument(collection, id, callback) {
    try {
      var currentDoc = await this.db.doc(`${collection}/${id}`).get();
      if (currentDoc && currentDoc.exists) {
        this.db
          .collection(collection)
          .doc(id)
          .delete()
          .then(function(docRef) {
            callback && callback();
          })
          .catch(function(error) {
            // console.log(error);
            callback && callback(error);
          });
      } else {
        callback && callback('Không tìm thấy dữ liệu');
      }
    } catch (error) {
      callback && callback(error);
    }
  }
}
export default new Firebase();
