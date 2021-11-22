# Firestore Java Callout

This directory contains the Java source code and Java jars required to
compile a Java callout for Apigee Edge that uses the Firestore Java library.

## Summary
This Java callout does not include all the Firestore operations. It was built to quickly test the query feature.  

### Flow Variables Created by this Callout

#### On Success
If the policy executes successfully, then the following flow variables are set.

1. `flw.apigee.status` - Either success or unsuccessful.

#### On Failure
If an error occurs, the an error is raised and the flow is sent to the error flow. Also, the following items are set:
1. `x-Exception-Class` - a header with the Exception class name. (i.e `java.lang.IllegalStateException`)
2. `flw.apigee.status` - unsuccessful.


### Configuring the Callout Policy:

See example below:

```xml
<JavaCallout name='Java.Regex'>
  <Properties>
    <!-- JS injection patterns -->
    <Property name="name">value</Property>
  </Properties>
  <ClassName>JavaCallout</ClassName>
  <ResourceURL>java://firestore-callout.jar</ResourceURL>
</JavaCallout>
```

## Using the Jar

You do not need to build the JAR in order to use it. The jar is located in
`apiproxy/resources/java` directory.
To use it:

1. Include the Java callout policy in your
   apiproxy/policies directory. The configuration should look like
   this:
    ```xml
  <JavaCallout name='Java-Firestore'>
      <Properties>
        ...
      </Properties>
      <ClassName>JavaCallout</ClassName>
      <ResourceURL>java://firestore-callout.jar</ResourceURL>
</JavaCallout>
   ```

2. Deploy your API Proxy

For some examples of how to configure the callout, see the related api proxy bundle.


## How do I get the dependencies?
You must have the required dependencies in your local maven repository.

 - Apigee Edge expressions v1.0
 - Apigee Edge message-flow v1.0

Follow the instructions in the [Dependencies section.](https://github.com/swilliams11/apigee-javacallout-testng#dependencies)

## Building the Jar

To build the binary JAR yourself, follow
these instructions.

1. cd to the `firestore-javacallout` directory.

2. Build the binary with [Apache maven](https://maven.apache.org/). You need to first install it, and then you can execute the following line in your terminal:  
   ```
   mvn clean package
   ```

3. Maven will copy all the required jar files to the `apiproxy/resources/java` directory.
   The `firebase-callout.jar` file will also be located in the `callout/src/target/` directory.


## Skip Tests
If you don't want to execute the tests then execute the following line. However,
if you change the source code you should execute the tests to make you didn't
break the existing functionality.
```
mvn clean package -DskipTests
```

## Execute TestNG tests
```
mvn test
```
