export default{
  expo: {
    name: "avi-pro-mobile",
    slug: "avi-pro-mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
      githubUrl: ""
    },
    
    owner: "williamcallao",

    updates: {
      url: "https://u.expo.dev/b3ea0140-e392-4aeb-a282-05f169bc71c6"
    },
    runtimeVersion: {
      policy: "appVersion"
    },
    
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.williamcallao.avipromobile",
      googleServicesFile: "./google-services.json",
    },
    plugins: [
      "@react-native-firebase/app",
      "@react-native-firebase/auth",
    ],
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      eas: {
        projectId: "b3ea0140-e392-4aeb-a282-05f169bc71c6",
        owner: "williamcallao",
      },
      }
  },
};