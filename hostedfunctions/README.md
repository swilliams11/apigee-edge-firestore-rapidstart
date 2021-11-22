# Hosted Functions Firestore

## Usage
### Prerequisites
- You need an Apigee Edge developer account. See [docs](http://docs.apigee.com/api-services/content/creating-apigee-edge-account) for more details on how to setup your account.
- You'll need [Node.js](https://nodejs.org/en/download/) installed on your local machine. This will also install node's package manager [npm](https://www.npmjs.com/).

### Download Service Account key
- Create and download your Service Account key for your Firestore db (see [docs](https://firebase.google.com/docs/admin/setup#add_firebase_to_your_app)).  
- Save the Service Account key into the `/firestore/apiproxy/resources/hosted/serviceaccount` folder.  

### Update config.js
Edit `config.js` under `/firestore/apiproxy/resources/hosted` to reference your Firestore service account key.

```
var serviceAccountFile = require("./serviceaccount/YOUR-Service-Account.json");

module.exports = {
  db                 : '(default)',
  serviceAccount     : serviceAccountFile
};

```

### Install apigeetool

The easiest way to deploy a hosted install
```
npm install -g git://github.com/apigee/apigeetool-node.git#hosted-functions
```


### Deploy nodejs-app

```
cd nodejs-app
apigeetool deployhostedfunction -u <username> -o <org> -e <env> -n <proxy-name> -V
```

### Deploy firestoreproxy




## Summary of Results

Everything builds successfully and is deployed to Apigee.
