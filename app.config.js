export default{
  expo: {
    name: "avipro-app",
    slug: "avipro-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#9DBAE2",
      githubUrl: "https://github.com/WilliamCallao/AviPro-Mobile-APP.git"
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
        backgroundColor: "#218DFA"
      },
      package: "com.endurancesoft.avipromobile",
    },
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
