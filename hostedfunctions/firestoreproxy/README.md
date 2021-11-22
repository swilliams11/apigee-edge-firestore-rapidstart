# Mediate between Edge and Firestore with Node.js

### Sample use case

Deploy a Node.js target app on Apigee Edge that performs CRUD operations in a Firestore database.

### About

This sample illustrates how to use a Node.js target app deployed to Edge that communicates with a back-end data store.

For overview information and a detailed discussion of this application, see
the Apigee Edge cookbook topic:

[http://apigee.com/docs/api-services/content/overview-nodejs-apigee-edge](http://apigee.com/docs/api-services/content/overview-nodejs-apigee-edge)


### Set up, deploy, invoke

Use the following command to deploy the Node.js app to Apigee Edge.
```
apigeetool deploynodeapp -u user@domain.com -o APIGEE_ORG -e test -n 'firestore' -d . -b /firestore -v default,secure
```

#### Additional configurations
You should already have completed the instructions in the parent [README](../README.md).  

You need to do a few simple configs to get things set up on Firestore:

* Edit the `serviceAccountFile` in the `./apiproxy/resources/node/config.js` file, so that it references the private key in the JSON file that you downloaded when you created the Firestore service account.  For example:

  ```
  var serviceAccountFile = require("./serviceaccount/apigee-developer-labs-4eb377b71885.json");
  config.serviceAccount = serviceAccount;

  module.exports = {
    db                 : '(default)',
    serviceAccount     : serviceAccountFile
  };
  ```

After you deploy the proxy you can run the sample requests in the Firestore Postman script.

# Node.js Runtime Error
As of 1-29-2018, the Firestore Node.js API does not run in Edge free cloud orgs.  Here is the error message

This is the error that is returned when I send a GET /firestore/products requests to Apigee Edge.
The same Node.js app runs successfully on my local machine.
```
{"fault":{"faultstring":"Script node executed prematurely: ReferenceError: \"Promise\" is not defined.\nReferenceError: \"Promise\" is not defined.\n    at FirebaseNamespace (\/organization\/environment\/api\/node_modules\/firebase-admin\/lib\/firebase-namespace.js:270)\n    at \/organization\/environment\/api\/node_modules\/firebase-admin\/lib\/default-namespace.js:19\n    at module.js:456\n    at module.js:474\n    at module.js:356\n    at module.js:312\n    at module.js:364\n    at require (m.....
```


### Ask the community

[![alt text](../../images/apigee-community.png "Apigee Community is a great place to ask questions and find answers about developing API proxies. ")](https://community.apigee.com?via=github)

---
