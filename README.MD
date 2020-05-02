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

# tao keystore

keytool -list -v -alias androiddebugkey -keystore ./android/app/debug.keystore -storepass android -keypass android
keytool -list -v -alias myrelease -keystore ./android/app/myrelease.keystore -storepass 123456 -keypass 123456

keytool -genkey -v -keystore myrelease.keystore -alias myrelease -keyalg RSA -keysize 2048 -validity 10000

password 123456

# trouble shoot

./gradlew --stacktrace
./gradlew --warning-mode all
cd android && ./gradlew clean && ./gradlew :app:bundleRelease
