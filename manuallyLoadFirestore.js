/*
Temp file to manually load the data into Firestore. This file loads the data correctly into Firestore.  
*/
var fs = require('fs');
var async = require('async');
var request = require('request');
var lineReader = require('line-reader');
var config = require('./config.js');
const admin = require('firebase-admin');
var dataLoc = './data/'
admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount)
});

var db = admin.firestore();

function saveDocumentOld(collectionName, docId, doc){
  var docRef = db.collection(collectionName).doc(docId);
  var setDoc = docRef.set(doc);
  return setDoc;
}

function saveDocument(collectionName, doc){
  console.log(JSON.stringify(doc));
  var setDoc = db.collection(collectionName)
    .add(doc)
    .then(ref => {
    console.log('Added document with ID: ', ref.id);
  });
  return setDoc;
}

/**
Updates the document provided in the collection.
*/
function updateDocument(collectionName, queryField, queryCondition, queryValue, skuId){
  var collectionRef = db.collection(collectionName);
  var query = collectionRef.where(queryField, queryCondition, queryValue).get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            //payload += doc.data();
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
}


function getDocument(collectionName, queryField, queryCondition, queryValue){
  var collectionRef = db.collection(collectionName);
  var results = collectionRef.where(queryField, queryCondition, queryValue).get();
  return results;
}

function saveToFirestore(collectionName, data){
  //console.log(JSON.stringify(data));
  data = JSON.parse(data);
  for(i = 0; i < data.length; i++){
    saveDocument(collectionName, data[i]);
  }
}

function loadFile(fileName){
    fs.readFile('./data/' + fileName + '.json','utf8', (err, data) => {
      if (err) throw err;
      //console.log(data);
      console.log('collectionName=' + fileName);
      saveToFirestore(fileName, data);
    });
}

function uploadData(files){
  for(i = 0; i < files.length; i++){
    loadFile(files[i]);
  }
}

/**
read the products.json file and update each product with the sku id.
This function does not update the products document because it does not find the
Product with (name == productid).
*/
function joinProductsAndSkus(){
  lineReader.eachLine(dataLoc + 'post.query', function (line, last) {
    var element = line.split('/');
    var productId = String(element[1]);
    var skuId = String(element[4]);
    console.log('query: name == ' + productId + '; skuId = ' + skuId);
    updateDocument('products', 'name', '==', productId, skuId);
  });
}

/*
Updates each product with the sku.
*/
function updateProductsWithSku(){
  var productsRef = db.collection('products');
  var allProducts = productsRef.get()
      .then(snapshot => {
          snapshot.forEach(doc => {
              //console.log(doc.id, '=>', doc.data());
              var docRef = db.collection('products').doc(doc.id);
              console.log(doc);
              console.log(doc.get('name'));
              docRef.update({sku: 'S' + doc.get('name')});
              //doc.update({sku: 'S' + doc.name});
          });
      })
      .catch(err => {
          console.log('Error getting documents', err);
      });
}

var files = ['users','stores', 'skus', 'products','categories'];
uploadData(files);
//joinProductsAndSkus();
updateProductsWithSku();

/**
this code is a test to fetch the data and format the results.
We need async here because the get() function is execute asynchronously.
*/
/*
var payload;
var productsRef = db.collection('products');
var allproducts = productsRef.get()
    .then(snapshot => {
        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            payload += doc.data();
        });
    })
    .catch(err => {
        console.log('Error getting documents', err);
    });
*/

/*
This section is a test to search for a record and print the result.
*/
/*
var collectionRef = db.collection('products');
collectionRef.where('name', '==', '210204').get()
.then(snapshot => {
      snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          //var docRef = db.collection('cities').doc(doc.id);
          //docRef.update({skus:'1234'});
      });
  })
  .catch(err => {
      console.log('Error getting documents', err);
  });
  */
