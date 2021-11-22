# Mediate between Edge and Firestore with Java Callout

### Sample use case

Deploy a proxy that mediates requests between Edge and Firestore with the Firestore Java API. This Java callout has minimal features and was only used quick test to see how to use the Firestore Java API and determine which libraries are required.  

### About
For overview information and a detailed discussion of this application, see
the Apigee Edge cookbook topic:

[https://docs.apigee.com/api-reference/content/how-create-java-callout](https://docs.apigee.com/api-reference/content/how-create-java-callout)


### Set up, deploy, invoke

```
mvn clean install -Ptest -Dorg={youOrg} -Dusername={edge_user} -Dpassword={edge_password}
```



#### Additional configurations
You should already have completed the instructions in the parent [README](../README.md).  

You need to do a few simple configs to get things set up on Firestore:

* It appear that your service account key is not required for the Java callout to work successfully.  The Java code only requires your project ID.  

* If necessary you can add your `serviceAccountFile` in the `./firestore-javacallout/src/main/resources/` directory and then rebuild the Java jar file. You will also need to reference the your service account file from the Java code.

After you deploy the proxy you can run the sample requests in the Firestore Postman script.


### Ask the community

[![alt text](../../images/apigee-community.png "Apigee Community is a great place to ask questions and find answers about developing API proxies. ")](https://community.apigee.com?via=github)

---
