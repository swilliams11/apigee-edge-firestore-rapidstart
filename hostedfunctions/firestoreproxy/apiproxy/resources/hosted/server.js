var express = require('express');
var config = require('./config.js');
const admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert(config.serviceAccount)
});

// Set up Express environment and enable it to read and write JavaScript
var app = express();
app.use(express.bodyParser());

var db = admin.firestore();

/*
Get all products from the collection.
*/
function getAllDocumentsFromCollection(collectionName, callback){
    var payload = [];
    var collectionRef = db.collection(collectionName);
    var allproducts = collectionRef.get()
        .then(function(snapshot) {
            snapshot.forEach(function(doc) {
                //console.log(doc.id, '=>', doc.data());
                payload.push(doc.data());
            });
            callback(null, payload);
            ///res.jsonp(payload);
        })
        .catch(function(err) {
            console.log('Error getting documents', err);
            callback(error(res, err));
        });
}

app.get('/productstest', function(req, res){
    //console.log("productstest called");
    var callback = function(err, results){
      if (err) console.log('Error: ' + err);
      console.log("Finished upload script.");
      res.jsonp(results);
    };
    getAllDocumentsFromCollection('products', callback);
});

/*
 GET /products
 */
app.get('/products', function(req, res) {
                getProducts(req, res);
});

/*
get all the products from the collection.
*/
function getProducts(req, res) {
  var payload = [];
  var productsRef = db.collection('products');
  var allproducts = productsRef.get()
      .then(function(snapshot) {
          snapshot.forEach(function(doc) {
              //console.log(doc.id, '=>', doc.data());
              payload.push(doc.data());
          });
          res.jsonp(payload);
      })
      .catch(function(err) {
          console.log('Error getting documents', err);
          error(res, err);
      });
}

/*
 GET /products/{id}
 */
app.get('/products/:id', function(req, res) {
                getProduct(req, res);
});

/*
Get a product document from the products collection
*/
function getProduct(req, res) {

  var collectionRef = db.collection('products');
  collectionRef.where('name', '==', req.params.id).get()
  .then(function(snapshot) {
        snapshot.forEach(function (doc) {
            //console.log(doc.id, '=>', doc.data());
            res.jsonp(doc.data());
        });
    })
    .catch(function(err) {
        console.log('Error getting documents', err);
        error(res, err);
    });
}

/*
Send an error back to the client.
*/
function error(res, err){
  res.jsonp(500, {
          'error' : JSON.stringify(err)
  });
}

function errorSummary(error, response, body) {
    return "code=" + response && response.statusCode + "&error=" + error + "&body=" + body;
}

function logError(fnName, error, response, body) {
	console.log("Error while calling " + fnName);
  console.log('statusCode:', response && response.statusCode);
  console.log('error:', error);
  console.log('body:', body);
}

function saveDocument(collectionName, docId, doc){
  var docRef = db.collection(collectionName).doc(docId);
  var setDoc = docRef.set(doc);
  return setDoc;
}

// Listen for requests until the server is stopped
var port = process.env.PORT || 9000;
app.listen(port, function(){
  console.log('The server is listening on port %d', port);
});
