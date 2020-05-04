npm install @react-navigation/native
npm install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view

npm install @react-navigation/stack
npm install @react-navigation/bottom-tabs
npm i @react-navigation/material-bottom-tabs
npm i react-native-paper

#-------

npm install galio-framework
npm i react-native-vector-icons

# install firebase

npm i @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore

npm i @react-native-community/google-signin react-native-fbsdk

# tao keystore cho build app

keytool -list -v -alias androiddebugkey -keystore ./android/app/debug.keystore -storepass android -keypass android
keytool -list -v -alias myrelease -keystore ./android/app/myrelease.keystore -storepass 123456 -keypass 123456

keytool -genkey -v -keystore myrelease.keystore -alias myrelease -keyalg RSA -keysize 2048 -validity 10000

password 123456

## Login facebook

- Lay facebook APP ID va secrect , enable authentication bang facebook, dien app id , va key
- copy link oauth redirect , past vao facebook app, URI chuyển hướng OAuth hợp lệ: https://authentication-45b90.firebaseapp.com/__/auth/handler
- Lay key add vao sample

# Lay key cho login facbook

'''ssh
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64

=> YqUsfQRPQj5oOxOXQJwVnN75Pjk=

keytool -exportcert -alias myrelease -keystore ~/.android/myrelease.keystore | openssl sha1 -binary | openssl base64
=> GMpAMZgYO6tdw2BZZh13e+kdfu8=

keytool -exportcert -alias myrelease -keystore ./android/app/myrelease.keystore -storepass 123456 -keypass 123456 | openssl sha1 -binary | openssl base64

vao link https://developers.facebook.com/settings/developer/sample-app/

# trouble shoot

./gradlew --stacktrace
./gradlew --warning-mode all
cd android && ./gradlew clean && ./gradlew :app:bundleRelease

# Link tai lieu

https://firebase.google.com/docs/android/setup/?gclid=Cj0KCQjwtLT1BRD9ARIsAMH3BtXja9AQunHxPcjcc98AvNlgeKDkqaaHTvGfJCGiinTVtccqpnSYdzAaAgsvEALw_wcB

# Login Facbook tai lieu

https://developers.facebook.com/docs/facebook-login/web
https://firebase.google.com/docs/auth/web/facebook-login?authuser=0

https://rnfirebase.io/auth/social-auth
https://developers.facebook.com/apps/478371012580531/fb-login/settings/
