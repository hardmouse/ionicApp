!/bin/bash
#build RCM

#compile
cd /Users/jiangtaohu/Desktop/Cosmin/RCM;
npm i;
ionic build;
npx jetify;
ionic capacitor sync;
ionic capacitor build android --no-open;
ionic capacitor build ios --no-open;

#build and deploy to Google Play Store
cd /Users/jiangtaohu/Desktop/Cosmin/RCM/android;
#./gradlew assemblerelease
fastlane android beta;

#build and deploy to Apple Store
cd /Users/jiangtaohu/Desktop/Cosmin/RCM/ios/App;
fastlane ios beta;


exit;

