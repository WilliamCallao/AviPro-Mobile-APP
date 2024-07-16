
# Avi-Pro-Mobile

Avi Pro Mobile is an app designed to facilitate the tracking of collectors within a poultry company that previously utilizes the Avi Pro+ management system. A mobile solution tailored to streamline collector management processes.

![Group 377](https://github.com/user-attachments/assets/d51452c5-b560-452c-b61e-0c87693ad04d)

## Description

Avi Pro Mobile is an extension of Avi Pro+, a desktop system used for accounting and management of poultry companies. The mobile application is designed to digitize the management of outstanding invoice collections from clients, providing an efficient tool that is connected with its desktop version.

This project is part of an integrated solution divided into three repositories:
1. **AviPro-Mobile-APP**: Mobile application.
2. **AviPro-Mobile-API**: Dedicated backend, implemented with Express and Docker.
3. **AviPro-Dashboard**: A web dashboard project for managing licenses and synchronization between the desktop and mobile systems.

## Installation and Execution

To run the mobile application with Expo, follow these steps:

### Prerequisites
1. Install Node.js: [Node.js](https://nodejs.org/)
2. Install Expo CLI: Open your terminal and run:
    ```bash
    npm install -g expo-cli
    ```

### Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/WilliamCallao/AviPro-Mobile-APP.git
cd AviPro-Mobile-APP
```

### Install Dependencies
Install the necessary dependencies:
```bash
npm install
```

### Configuration
Before running the application, make sure to configure the `config.js` file with the backend domain:
```javascript
// config.js
export const API_URL = "http://your-backend-domain.com";
```

### Run the Application
Start the application with Expo:
```bash
npx expo start
```

This will open a browser window where you can scan a QR code with the Expo Go app on your mobile device to see the application in action.

## License

This project is licensed under the MIT License. For more details, see the [LICENSE](LICENSE) file.
