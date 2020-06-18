var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var https = require ('https');
var MongoDBStore = require('connect-mongodb-session')(session);

var app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (request,response) => {

    response.render('pages/index');			//Nom de la page qui sera affiché

});

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'QPLT';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);

  client.close();
});

const insertDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('covid');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

const findDocuments = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('covid');
  // Find some documents
  collection.find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    callback(docs);
  });
}


const updateDocument = function(db, callback) {
  // Get the documents collection
  const collection = db.collection('covid');
  // Update document where a is 2, set b equal to 1
  collection.updateOne({ a : 2 }
    , { $set: { b : 1 } }, function(err, result) {
    assert.equal(err, null);
    assert.equal(1, result.result.n);
    console.log("Updated the document with the field a equal to 2");
    callback(result);
  });
}

MongoClient.connect(url, function(err, db) {
https.get("https://api.covid19api.com/total/dayone/country/france", (response2) => {
var covid_data='';


    // A chunk of data has been received.
    response2.on('data', (chunk) => {
        covid_data += chunk;
    });

    // The whole response has been received. Print out the result.
    response2.on('end',() => {

        covid_data = JSON.parse(covid_data)
        //affichage des résultats dans la console :
        /*for (var i=covid_data.length-5; i<covid_data.length; i++) {
            //afficher sur la page du début les résultats
            console.log('Nom pays : '+covid_data[i].Country);
            console.log('Nouveaux cas : '+(parseInt(covid_data[i].Confirmed,10)-parseInt(covid_data[i-1].Confirmed,10)));
            console.log('Nouveaux décès : '+(parseInt(covid_data[i].Deaths,10)-parseInt(covid_data[i-1].Deaths,10)));
            console.log('Nouveaux rétablissement : '+(parseInt(covid_data[i].Recovered,10)-parseInt(covid_data[i-1].Recovered,10)));
            console.log('Date : '+covid_data[i].Date);
            console.log();
            //response1.render('pages/index', {nomPays: covid_data[i].Country, nmbreCas: covid_data[i].Cases, status: covid_data[i].Status, date: covid_data[i].Date });

        }
        console.log('Etat actuel : ');
        console.log('Nombre de cas actif : '+covid_data[covid_data.length-1].Active);
        console.log('Nombre de cas confirmés : '+covid_data[covid_data.length-1].Confirmed);
        console.log('Nombre de morts : '+covid_data[covid_data.length-1].Deaths);
        console.log('Nombre de rémissions : '+covid_data[covid_data.length-1].Recovered);*/
        if (err) throw err;
          var len = covid_data.length;
          var dbo = db.db('QPLT');
          var myquery = { type: 'covid'};
          var newvalues = { $set: {country:"France",
          j_5:{
            cases:parseInt(covid_data[len-5].Confirmed,10)-parseInt(covid_data[len-6].Confirmed,10),
            deaths:parseInt(covid_data[len-5].Deaths,10)-parseInt(covid_data[len-6].Deaths,10),
            recovered:parseInt(covid_data[len-5].Recovered,10)-parseInt(covid_data[len-6].Recovered,10)
          },
          j_4:{
            cases:parseInt(covid_data[len-4].Confirmed,10)-parseInt(covid_data[len-5].Confirmed,10),
            deaths:parseInt(covid_data[len-4].Deaths,10)-parseInt(covid_data[len-5].Deaths,10),
            recovered:parseInt(covid_data[len-4].Recovered,10)-parseInt(covid_data[len-5].Recovered,10)
          },
          j_3:{
            cases:parseInt(covid_data[len-3].Confirmed,10)-parseInt(covid_data[len-4].Confirmed,10),
            deaths:parseInt(covid_data[len-3].Deaths,10)-parseInt(covid_data[len-4].Deaths,10),
            recovered:parseInt(covid_data[len-3].Recovered,10)-parseInt(covid_data[len-4].Recovered,10)
          },
          j_2:{
            cases:parseInt(covid_data[len-2].Confirmed,10)-parseInt(covid_data[len-3].Confirmed,10),
            deaths:parseInt(covid_data[len-2].Deaths,10)-parseInt(covid_data[len-3].Deaths,10),
            recovered:parseInt(covid_data[len-2].Recovered,10)-parseInt(covid_data[len-3].Recovered,10)
          },
          j_1:{
            cases:parseInt(covid_data[len-1].Confirmed,10)-parseInt(covid_data[len-2].Confirmed,10),
            deaths:parseInt(covid_data[len-1].Deaths,10)-parseInt(covid_data[len-2].Deaths,10),
            recovered:parseInt(covid_data[len-1].Recovered,10)-parseInt(covid_data[len-2].Recovered,10)
          },
          curent:{
            cases:parseInt(covid_data[len-1].Confirmed,10),
            deaths:parseInt(covid_data[len-1].Deaths,10),
            recovered:parseInt(covid_data[len-1].Recovered,10),
            active:parseInt(covid_data[len-1].Active,10),
            date:parseInt(covid_data[len-1].Date[0]+covid_data[len-1].Date[1]+covid_data[len-1].Date[2]+covid_data[len-1].Date[3]
            +covid_data[len-1].Date[5]+covid_data[len-1].Date[6]+covid_data[len-1].Date[8]+covid_data[len-1].Date[9],10)
          },
          last_update:parseInt(covid_data[len-1].Date[0]+covid_data[len-1].Date[1]+covid_data[len-1].Date[2]+covid_data[len-1].Date[3]
          +covid_data[len-1].Date[5]+covid_data[len-1].Date[6]+covid_data[len-1].Date[8]+covid_data[len-1].Date[9],10)+1
          }};
          dbo.collection('covid').updateOne(myquery, newvalues,function(err, res) {
              if (err) throw err;
              console.log("1 document updated");
              db.close();
          });
    });

});

});

// Use connect method to connect to the server
/*MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected correctly to server");

  const db = client.db(dbName);


  findDocuments(db, function() {
      client.close();
  });
})*/





