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
    
    owner: "endurancesoft",

    updates: {
      url: "https://u.expo.dev/68722059-896d-4f90-9039-57984284a8d6"
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
      package: "com.endurancesoft.avipromobile",
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
        projectId: "68722059-896d-4f90-9039-57984284a8d6",
        owner: "endurancesoft",
      },
      }
  },
};
