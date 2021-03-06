const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const assert = require('assert');
const https = require ('https');
const http = require ('http');
const MongoDBStore = require('connect-mongodb-session')(session);
const moment = require('moment');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const NewsAPI = require('newsapi');
const newsapi = new NewsAPI('1e4c14aa89f5460ea47f55fa7f8ebfe9');

var app = express();
var store = new MongoDBStore({
    uri: 'mongodb://localhost:27017/QPLT',
    collection: 'mesSessions'
});
const binary = mongodb.Binary;

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'QPLT';

//Attraper les erreurs lors du stockage
store.on('error', function(error) {
    console.log(error);
});

//Nos middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret : 'Secret Key',
    cookie: { secure: false },
    store: store,
    resave: true,
    saveUninitialized: true
}));
app.use('/home', function(erreur, request, response,next){
    console.log(erreur);
    //l'utilisateur doit être connecté ! Redirection à Connexion
    request.redirect('/login');
});
app.use(fileUpload());
app.use(express.static(__dirname + "/public"));

const Users = [];

//Nos routes
//Nos Get
app.get('/', (request,response) => {

    response.render('pages/login');

});

app.get('/login', (request,response) => {

    response.render("pages/login");

});

app.get('/sign-up', (request,response) => {

    response.render('pages/sign-up');

});

app.get('/home', verifSignIn, (request,response) => {

    var imageBinaire;
    var signe = "";
    var messageVlille = "";
    var stationFav = "";
    var majHoroscope = false;
    var majNouvelles = false;
    var horoscope_data = "";
    var nouvelles_data = "";
    //Horoscope
    var astro = "";
    var texteAstro = "";
    //Nouvelles
    var titre0 = "";
    var titre1 = "";
    var titre2 = "";
    var titre3 = "";
    var titre4 = "";
    var description0 = "";
    var description1 = "";
    var description2 = "";
    var description3 = "";
    var description4 = "";
    var auteur0 = "";
    var auteur1 = "";
    var auteur2 = "";
    var auteur3 = "";
    var auteur4 ="";
    var URL0 = "";
    var URL1 = "";
    var URL2 = "";
    var URL3 = "";
    var URL4 = "";

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findVar(db, function() {
            checkUpdateHoroscope(db, function() {
                resultatCheckHoroscope(db, function() {
                    findDataHoroscope(db, function() {
                        checkUpdateNouvelles(db, function() {
                            resultatCheckNouvelles(db, function() {
                                findDataNouvelles(db, function() {
                                    client.close();
                                    response.render('pages/home', {id: request.session.user.id, img: imageBinaire,
                                        astro: astro, texteAstro: texteAstro, message: messageVlille, stationFav: stationFav,
                                        titre0: titre0, titre1: titre1, titre2: titre2, titre3: titre3, titre4 : titre4,
                                        description0: description0, description1: description1, description2: description2, description3: description3, description4: description4,
                                        auteur0: auteur0, auteur1: auteur1, auteur2: auteur2, auteur3: auteur3, auteur4: auteur4,
                                        URL0: URL0, URL1: URL1, URL2: URL2, URL3: URL3, URL4: URL4});
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    const findVar = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            signe = docs[0].astrologie;
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            callback();
        });
    };

    const checkUpdateHoroscope = function(db, callback) {
        console.log("Je suis dans checkUpdateHoroscope");
        const collection = db.collection('horoscope');
        collection.find({signe : signe}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found the following records for horoscope");
            console.log(docs[0]);
            var dateAjd = moment().format('YYYY-MM-DD');
            var date_a_comparer = docs[0].date_mise_a_jour;
            console.log(dateAjd);
            console.log(date_a_comparer);
            if (dateAjd.localeCompare(date_a_comparer) === 1) {
                majHoroscope = true;
                console.log("Je suis dans la boucle if");
                callback(majHoroscope);
            }
            else{
                console.log("Je suis dans la boucle else");
                majHoroscope = false;
                callback(majHoroscope);
            }
        })
    };

    const resultatCheckHoroscope = function(db,callback) {
        console.log(majHoroscope + " Je suis dans resultatCheckHoroscope");
        if (majHoroscope === true) {
            console.log("Je suis dans le if de resultatCheckHoroscope");
            updateHoroscope(db,function() {
                callback(majHoroscope);
            });
        }
        else {
            callback(majHoroscope);
        }
    }

    const updateHoroscope = function(db, callback) {
        console.log("Je suis dans updateHoroscope");
        http.get("http://horoscope-api.herokuapp.com/horoscope/today/" + signe, (response2) => {
            console.log("Je suis dans le httpget horoscope");
            // A chunk of data has been received.
            response2.on('data', (chunk) => {
                horoscope_data += chunk;
            });

            // The whole response has been received. Print out the result.
            response2.on('end',() => {
                console.log("J'ai reçu la réponse, plus qu'a la print");
                horoscope_data = JSON.parse(horoscope_data);
                console.log(horoscope_data);

                const collection = db.collection('horoscope');
                // Mettre à jour l'horoscope pour me signe concerné
                collection.updateOne({ signe : signe }
                , { $set: { "texte" : horoscope_data.horoscope, "date_mise_a_jour": horoscope_data.date} }, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    console.log("Document horoscope mis à jour");
                    callback(result);
                });
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    const findDataHoroscope = function(db,callback) {
        const collection = db.collection('horoscope');
        // Find some documents
        collection.find({signe : signe}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Voici les informations trouvées par findDataHoroscope");
            console.log(docs[0]);
            astro = docs[0].signe;
            texteAstro = docs[0].texte;
            callback(docs);
        });
    };

    const checkUpdateNouvelles = function(db, callback) {
        console.log("Je suis dans checkUpdateNouvelles");
        const collection = db.collection('nouvelles');
        collection.find({}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found the following records for checkUpdateNouvelles");
            //console.log(docs[0]);
            var dateAjd = new Date();
            var date_a_comparer = docs[0].date_mise_a_jour;
            console.log(dateAjd);
            console.log(date_a_comparer);
            if ( dateAjd - date_a_comparer > 1000 * 60 * 60 * 2) {    //2 heures
                console.log("Je suis dans la boucle if");
                majNouvelles = true;
                callback(majNouvelles);
            }
            else{
                console.log("Je suis dans la boucle else");
                majNouvelles = false;
                callback(majNouvelles);
            }
        })
    };

    const resultatCheckNouvelles = function(db,callback) {
        console.log(majNouvelles + " Je suis dans resultatCheckNouvelles");
        if (majNouvelles === true) {
            console.log("Je suis dans le if de resultatCheckNouvelles");
            updateNouvelles(db,function() {
                callback(majNouvelles);
            });
        }
        else {
            callback(majNouvelles);
        }
    };

    const updateNouvelles = function(db, callback) {
        console.log("Je suis dans updateNouvelles");
        newsapi.v2.topHeadlines({
            language: 'fr',
            country: 'fr'
        }).then(response2 => {
            //console.log(response2);
            const collection = db.collection('nouvelles');
            // Mettre à jour les nouvelles
            collection.updateOne({}
                , { $set: { "status" : response2.status, "totalResults": response2.totalResults, "date_mise_a_jour": new Date(), "articles": response2.articles}}, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    console.log("Document nouvelles mis à jour");
                    callback(result);
                });
        });
    };

    const findDataNouvelles = function(db,callback) {
        const collection = db.collection('nouvelles');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Voici les informations trouvées par findDataNouvelles");
            console.log(docs[0]);
            titre0 = docs[0].articles[0].title;
            titre1 = docs[0].articles[1].title;
            titre2 = docs[0].articles[2].title;
            titre3 = docs[0].articles[3].title;
            titre4 = docs[0].articles[4].title;
            description0 = docs[0].articles[0].description;
            description1 = docs[0].articles[1].description;
            description2 = docs[0].articles[2].description;
            description3 = docs[0].articles[3].description;
            description4 = docs[0].articles[4].description;
            auteur0 = docs[0].articles[0].author;
            auteur1 = docs[0].articles[1].author;
            auteur2 = docs[0].articles[2].author;
            auteur3 = docs[0].articles[3].author;
            auteur4 = docs[0].articles[4].author;
            URL0 = docs[0].articles[0].url;
            URL1 = docs[0].articles[1].url;
            URL2 = docs[0].articles[2].url;
            URL3 = docs[0].articles[3].url;
            URL4 = docs[0].articles[4].url;
            callback(docs);
        });
    };

});

app.get('/weather', verifSignIn, (request, response) => {
    let imageBinaire;
    let ville;
    let majMeteo = false;
    let meteo_data = "";
    let ajouterMeteo = false;
    let ajoutMeteo = false;
    let temperature;
    let vitesse_vent;
    let precipitation;
    let humidite;
    let couverture_nuageuse;
    let ressenti;
    let index_UV;
    let visibilite;
    let infos_date;

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        findVar(db, function() {
            checkUpdateMeteo(db, function() {
                resultatCheckMeteo(db, function() {
                    findDataMeteo(db,function() {
                        client.close();
                        response.render('pages/weather', {id: request.session.user.id, img: imageBinaire, ville:ville,
                            temperature: temperature, vitesse_vent: vitesse_vent, precipitation: precipitation,
                            humidite: humidite, couverture_nuageuse: couverture_nuageuse, ressenti: ressenti,
                            index_UV: index_UV, visibilite: visibilite, infos_date: infos_date})
                    });
                });
            });
        });
    });

    const findVar = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            console.log(docs[0].localisation.Ville)
            ville = docs[0].localisation.Ville
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            callback();
        });
    };

    const checkUpdateMeteo = function(db, callback) {
        console.log("Je suis dans checkUpdateMeteo");
        const collection = db.collection('meteo');
        collection.find({ville : ville}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found the following records for checkUpdateMeteo");
            console.log(docs[0]);
            if (typeof(docs[0]) == 'undefined'){
                console.log("Je suis dans le if docs undefined du checkUpdateMeteo");
                ajouterMeteo = true;
                callback(ajouterMeteo);
            }
            else{
                var dateAjd = new Date();
                var date_a_comparer = docs[0].date_mise_a_jour;
                console.log(dateAjd);
                console.log(date_a_comparer);
                if ( dateAjd - date_a_comparer > 10 * 60000) {      //10 minutes
                    console.log("Je suis dans la boucle if");
                    majMeteo = true;
                    callback(majMeteo);
                }
                else{
                    console.log("Je suis dans la boucle else");
                    majMeteo = false;
                    callback(majMeteo);
                }
            }
        })

    };

    const resultatCheckMeteo = function(db,callback) {
        console.log("Je suis dans resultatCheckMeteo");
        if (ajouterMeteo === true){
            insertMeteo(db,function() {
                callback(ajouterMeteo);
            });
        }
        else {
            if (majMeteo === true){
                console.log("Je suis dans le if de resultatCheckMeteo");
                updateMeteo(db, function() {
                    callback(majMeteo);
                });
            }
            else{
                callback(majMeteo);
            }
        }

    }

    const insertMeteo = function(db, callback) {
        http.get("http://api.weatherstack.com/current?access_key=7a60fdfed3e1fc836ae34126a0a89fc9&query=" + ville, (response2) => {
            console.log("Je suis dans le httpget météo pour l'ajout d'un document");
            // A chunk of data has been received.
            response2.on('data', (chunk) => {
                meteo_data += chunk;
            });

            // The whole response has been received. Print out the result.
            response2.on('end',() => {
                console.log("J'ai reçu la réponse, plus qu'a la print");
                meteo_data = JSON.parse(meteo_data);
                console.log(meteo_data);

                const collection = db.collection('meteo');
                collection.insertMany([
                    {"ville": meteo_data.location.name, "pays": meteo_data.location.country, "temperature":meteo_data.current.temperature, "icone": meteo_data.current.weather_icons, "vitesse_vent": meteo_data.current.wind_speed, "precipitation": meteo_data.current.precip, "humidite": meteo_data.current.humidity, "couverture_nuageuse": meteo_data.current.cloudcover, "ressenti": meteo_data.current.feelslike, "index_UV": meteo_data.current.uv_index, "visibilite": meteo_data.current.visibility, "infos_date": meteo_data.location.localtime, "date_mise_a_jour": new Date()}], function(err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    temperature = meteo_data.current.temperature;
                    vitesse_vent = meteo_data.current.wind_speed;
                    precipitation = meteo_data.current.precip;
                    humidite = meteo_data.current.humidity;
                    couverture_nuageuse = meteo_data.current.cloudcover;
                    ressenti = meteo_data.current.feelslike;
                    index_UV = meteo_data.current.uv_index;
                    visibilite = meteo_data.current.visibility;
                    infos_date = meteo_data.location.localtime;
                    console.log("Inserted 1 document into the collection");
                    ajoutMeteo = true;
                    callback(result);
                });
            });
        });
    }

    const updateMeteo = function(db, callback) {
        console.log("Je suis dans updateMeteo");
        http.get("http://api.weatherstack.com/current?access_key=7a60fdfed3e1fc836ae34126a0a89fc9&query=" + ville, (response2) => {
            console.log("Je suis dans le httpget météo pour l'update");
            // A chunk of data has been received.
            response2.on('data', (chunk) => {
                meteo_data += chunk;
            });

            // The whole response has been received. Print out the result.
            response2.on('end',() => {
                console.log("J'ai reçu la réponse, plus qu'a la print");
                meteo_data = JSON.parse(meteo_data);
                console.log(meteo_data);

                const collection = db.collection('meteo');
                // Mettre à jour la meteo pour la ville concernée
                collection.updateOne({ ville : ville }
                    , { $set: { "temperature": meteo_data.current.temperature, "icone": meteo_data.current.weather_icons, "vitesse_vent": meteo_data.current.wind_speed, "precipitation": meteo_data.current.precip, "humidite": meteo_data.current.humidity, "couverture_nuageuse": meteo_data.current.cloudcover, "ressenti": meteo_data.current.feelslike, "index_UV": meteo_data.current.uv_index, "visibilite": meteo_data.current.visibility, "infos_date": meteo_data.location.localtime, "date_mise_a_jour": new Date()} }, function(err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        console.log("Document météo mis à jour");
                        callback(result);
                    });
            });

        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    const findDataMeteo = function(db,callback) {
        if(ajoutMeteo === true){
            callback();
        }
        else{
            const collection = db.collection('meteo');
            collection.find({ville : ville}).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log("Voici les informations trouvées par findDataMeteo");
                console.log(docs[0]);
                temperature = docs[0].temperature;
                vitesse_vent = docs[0].vitesse_vent;
                precipitation = docs[0].precipitation;
                humidite = docs[0].humidite;
                couverture_nuageuse = docs[0].couverture_nuageuse;
                ressenti = docs[0].ressenti;
                index_UV = docs[0].index_UV;
                visibilite = docs[0].visibilite;
                infos_date = docs[0].infos_date;
                callback(docs);
            });
        }
    }
});

//var user_country="france";

app.get('/covid', verifSignIn,(request,response) => {

    var covid_data='';
    var imageBinaire;
    ajouterCovid = false;
    majCovid = false;
    ajoutCovid = false;
    let country = "";
    let cases = "";
    let deaths = "";
    let recovered ="";
    let active = "";
    let j_1_cases= "";
    let j_1_deaths= "";
    let j_1_recovered= "";
    let j_2_cases= "";
    let j_2_deaths= "";
    let j_2_recovered= "";
    let j_3_cases= "";
    let j_3_deaths= "";
    let j_3_recovered= "";
    let j_4_cases= "";
    let j_4_deaths= "";
    let j_4_recovered= "";
    let j_5_cases= "";
    let j_5_deaths= "";
    let j_5_recovered= "";

    MongoClient.connect(url, function(err, client) {

        console.log("Bien connecté au serveur");
        const db = client.db(dbName);
        findVar(db, function() {
            checkUpdateCovid(db, function() {
                resultatCheckCovid(db, function() {
                    findDataCovid(db, function() {
                        client.close();
                        response.render('pages/covid',{ id: request.session.user.id, img: imageBinaire,
                            country:country, cases:cases, deaths:deaths,
                            recovered:recovered, active:active,
                            j_1_cases:j_1_cases, j_1_deaths:j_1_deaths, j_1_recovered:j_1_recovered,
                            j_2_cases:j_2_cases, j_2_deaths:j_2_deaths, j_2_recovered:j_2_recovered,
                            j_3_cases:j_3_cases, j_3_deaths:j_3_deaths, j_3_recovered:j_3_recovered,
                            j_4_cases:j_4_cases, j_4_deaths:j_4_deaths, j_4_recovered:j_4_recovered,
                            j_5_cases:j_5_cases, j_5_deaths:j_5_deaths, j_5_recovered:j_5_recovered});

                    });
                });
            });
        });
    });

    const findVar = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            console.log(docs[0].localisation.Ville)
            country = docs[0].localisation.Pays;
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            callback();
        });
    };

     const checkUpdateCovid = function(db, callback) {
        const collection = db.collection('covid');
        collection.find({country : country}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found the following records for checkUpdateCovid");
            console.log(docs[0]);
            if (typeof(docs[0]) == 'undefined'){
                ajouterCovid = true;
                callback(ajouterCovid);
            }
            else{
                var dateAjd = new Date();
                var date_a_comparer = docs[0].date_mise_a_jour;
                console.log(dateAjd);
                console.log(date_a_comparer);
                if ( dateAjd - date_a_comparer > 1000 * 60 * 60 * 12) {      //12 heures
                    majCovid = true;
                    callback(majCovid);
                }
                else{
                    majCovid = false;
                    callback(majCovid);
                }
            }
        })

     };

     const resultatCheckCovid = function(db,callback) {
         if (ajouterCovid === true){
             insertCovid(db,function() {
                 callback(ajouterCovid);
             });
         }
         else {
             if (majCovid === true){
                 updateCovid(db, function() {
                     callback(majCovid);
                 });
             }
             else{
                 callback(majCovid);
             }
         }

     }

     const insertCovid = function(db, callback) {
         https.get("https://api.covid19api.com/total/dayone/country/"+ country, (response2) => {

             // A chunk of data has been received.
             response2.on('data', (chunk) => {
                 covid_data += chunk;
             });

             // The whole response has been received. Print out the result.
             response2.on('end',() => {

                 covid_data = JSON.parse(covid_data)
                 var len = covid_data.length;
                 const collection = db.collection('covid');
                 collection.insertMany([
                     {"country": country,
                     "j_5":{
                       "cases":parseInt(covid_data[len-5].Confirmed,10)-parseInt(covid_data[len-6].Confirmed,10),
                       "deaths":parseInt(covid_data[len-5].Deaths,10)-parseInt(covid_data[len-6].Deaths,10),
                       "recovered":parseInt(covid_data[len-5].Recovered,10)-parseInt(covid_data[len-6].Recovered,10)
                     },
                     "j_4":{
                       "cases":parseInt(covid_data[len-4].Confirmed,10)-parseInt(covid_data[len-5].Confirmed,10),
                       "deaths":parseInt(covid_data[len-4].Deaths,10)-parseInt(covid_data[len-5].Deaths,10),
                       "recovered":parseInt(covid_data[len-4].Recovered,10)-parseInt(covid_data[len-5].Recovered,10)
                     },
                     "j_3":{
                       "cases":parseInt(covid_data[len-3].Confirmed,10)-parseInt(covid_data[len-4].Confirmed,10),
                       "deaths":parseInt(covid_data[len-3].Deaths,10)-parseInt(covid_data[len-4].Deaths,10),
                       "recovered":parseInt(covid_data[len-3].Recovered,10)-parseInt(covid_data[len-4].Recovered,10)
                     },
                     "j_2":{
                       "cases":parseInt(covid_data[len-2].Confirmed,10)-parseInt(covid_data[len-3].Confirmed,10),
                       "deaths":parseInt(covid_data[len-2].Deaths,10)-parseInt(covid_data[len-3].Deaths,10),
                       "recovered":parseInt(covid_data[len-2].Recovered,10)-parseInt(covid_data[len-3].Recovered,10)
                     },
                     "j_1":{
                       "cases":parseInt(covid_data[len-1].Confirmed,10)-parseInt(covid_data[len-2].Confirmed,10),
                       "deaths":parseInt(covid_data[len-1].Deaths,10)-parseInt(covid_data[len-2].Deaths,10),
                       "recovered":parseInt(covid_data[len-1].Recovered,10)-parseInt(covid_data[len-2].Recovered,10)
                     },
                     "current":{
                       "cases":parseInt(covid_data[len-1].Confirmed,10),
                       "deaths":parseInt(covid_data[len-1].Deaths,10),
                       "recovered":parseInt(covid_data[len-1].Recovered,10),
                       "active":parseInt(covid_data[len-1].Active,10),
                       "date":parseInt(covid_data[len-1].Date[0]+covid_data[len-1].Date[1]+covid_data[len-1].Date[2]+covid_data[len-1].Date[3]
                       +covid_data[len-1].Date[5]+covid_data[len-1].Date[6]+covid_data[len-1].Date[8]+covid_data[len-1].Date[9],10)
                     },
                     "date_mise_a_jour": new Date()}], function(err, result) {
                     assert.equal(err, null);
                     assert.equal(1, result.result.n);
                     assert.equal(1, result.ops.length);
                     cases = parseInt(covid_data[len-1].Confirmed,10);
                     deaths = parseInt(covid_data[len-1].Deaths,10);
                     recovered = parseInt(covid_data[len-1].Recovered,10);
                     active = parseInt(covid_data[len-1].Active,10);
                     j_1_cases= parseInt(covid_data[len-1].Confirmed,10)-parseInt(covid_data[len-2].Confirmed,10);
                     j_1_deaths= parseInt(covid_data[len-1].Deaths,10)-parseInt(covid_data[len-2].Deaths,10);
                     j_1_recovered= parseInt(covid_data[len-1].Recovered,10)-parseInt(covid_data[len-2].Recovered,10);
                     j_2_cases= parseInt(covid_data[len-2].Confirmed,10)-parseInt(covid_data[len-3].Confirmed,10);
                     j_2_deaths= parseInt(covid_data[len-2].Deaths,10)-parseInt(covid_data[len-3].Deaths,10);
                     j_2_recovered= parseInt(covid_data[len-2].Recovered,10)-parseInt(covid_data[len-3].Recovered,10);
                     j_3_cases= parseInt(covid_data[len-3].Confirmed,10)-parseInt(covid_data[len-4].Confirmed,10);
                     j_3_deaths= parseInt(covid_data[len-3].Deaths,10)-parseInt(covid_data[len-4].Deaths,10);
                     j_3_recovered= parseInt(covid_data[len-3].Recovered,10)-parseInt(covid_data[len-4].Recovered,10);
                     j_4_cases= parseInt(covid_data[len-4].Confirmed,10)-parseInt(covid_data[len-5].Confirmed,10);
                     j_4_deaths= parseInt(covid_data[len-4].Deaths,10)-parseInt(covid_data[len-5].Deaths,10);
                     j_4_recovered= parseInt(covid_data[len-4].Recovered,10)-parseInt(covid_data[len-5].Recovered,10);
                     j_5_cases= parseInt(covid_data[len-5].Confirmed,10)-parseInt(covid_data[len-6].Confirmed,10);
                     j_5_deaths= parseInt(covid_data[len-5].Deaths,10)-parseInt(covid_data[len-6].Deaths,10);
                     j_5_recovered= parseInt(covid_data[len-5].Recovered,10)-parseInt(covid_data[len-6].Recovered,10);
                     console.log("Inserted 1 document into the collection");
                     ajoutCovid = true;
                     callback(result);
                 });

             });

         });
     }

     const updateCovid = function(db, callback) {
         https.get("https://api.covid19api.com/total/dayone/country/"+ country, (response2) => {

                      // A chunk of data has been received.
                      response2.on('data', (chunk) => {
                          covid_data += chunk;
                      });

                      // The whole response has been received. Print out the result.
                      response2.on('end',() => {

                          covid_data = JSON.parse(covid_data)

                          const collection = db.collection('covid');
                          collection.updateOne({ country : country }
                             , { $set: {
                                            "j_5":{
                                              "cases":parseInt(covid_data[len-5].Confirmed,10)-parseInt(covid_data[len-6].Confirmed,10),
                                              "deaths":parseInt(covid_data[len-5].Deaths,10)-parseInt(covid_data[len-6].Deaths,10),
                                              "recovered":parseInt(covid_data[len-5].Recovered,10)-parseInt(covid_data[len-6].Recovered,10)
                                            },
                                            "j_4":{
                                              "cases":parseInt(covid_data[len-4].Confirmed,10)-parseInt(covid_data[len-5].Confirmed,10),
                                              "deaths":parseInt(covid_data[len-4].Deaths,10)-parseInt(covid_data[len-5].Deaths,10),
                                              "recovered":parseInt(covid_data[len-4].Recovered,10)-parseInt(covid_data[len-5].Recovered,10)
                                            },
                                            "j_3":{
                                              "cases":parseInt(covid_data[len-3].Confirmed,10)-parseInt(covid_data[len-4].Confirmed,10),
                                              "deaths":parseInt(covid_data[len-3].Deaths,10)-parseInt(covid_data[len-4].Deaths,10),
                                              "recovered":parseInt(covid_data[len-3].Recovered,10)-parseInt(covid_data[len-4].Recovered,10)
                                            },
                                            "j_2":{
                                              "cases":parseInt(covid_data[len-2].Confirmed,10)-parseInt(covid_data[len-3].Confirmed,10),
                                              "deaths":parseInt(covid_data[len-2].Deaths,10)-parseInt(covid_data[len-3].Deaths,10),
                                              "recovered":parseInt(covid_data[len-2].Recovered,10)-parseInt(covid_data[len-3].Recovered,10)
                                            },
                                            "j_1":{
                                              "cases":parseInt(covid_data[len-1].Confirmed,10)-parseInt(covid_data[len-2].Confirmed,10),
                                              "deaths":parseInt(covid_data[len-1].Deaths,10)-parseInt(covid_data[len-2].Deaths,10),
                                              "recovered":parseInt(covid_data[len-1].Recovered,10)-parseInt(covid_data[len-2].Recovered,10)
                                            },
                                            "current":{
                                              "cases":parseInt(covid_data[len-1].Confirmed,10),
                                              "deaths":parseInt(covid_data[len-1].Deaths,10),
                                              "recovered":parseInt(covid_data[len-1].Recovered,10),
                                              "active":parseInt(covid_data[len-1].Active,10),
                                              "date":parseInt(covid_data[len-1].Date[0]+covid_data[len-1].Date[1]+covid_data[len-1].Date[2]+covid_data[len-1].Date[3]
                                              +covid_data[len-1].Date[5]+covid_data[len-1].Date[6]+covid_data[len-1].Date[8]+covid_data[len-1].Date[9],10)
                                            },
                                            "date_mise_a_jour": new Date()} }, function(err, result) {
                                assert.equal(err, null);
                                assert.equal(1, result.result.n);
                                console.log("Document covid mis à jour");
                                callback(result);
                          })


                      });

         }).on("error", (err) => {
            console.log("Error: " + err.message);
         });
     }

    const findDataCovid = function(db,callback) {
        if(ajoutCovid === true){
            callback();
        }
        else{
            const collection = db.collection('covid');
            collection.find({country : country}).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log("Voici les informations trouvées par findDataCovid");
                console.log(docs[0]);
                country = docs[0].country;
                cases = docs[0].current.cases;
                console.log(cases);
                deaths = docs[0].current.deaths;
                recovered = docs[0].current.recovered;
                active = docs[0].current.active;
                j_1_cases= docs[0].j_1.cases;
                j_1_deaths= docs[0].j_1.deaths ;
                j_1_recovered= docs[0].j_1.recovered;
                j_2_cases= docs[0].j_2.cases;
                j_2_deaths= docs[0].j_2.deaths;
                j_2_recovered= docs[0].j_2.recovered;
                j_3_cases= docs[0].j_3.cases ;
                j_3_deaths= docs[0].j_3.deaths;
                j_3_recovered= docs[0].j_3.recovered;
                j_4_cases= docs[0].j_4.cases  ;
                j_4_deaths= docs[0].j_4.deaths;
                j_4_recovered= docs[0].j_4.recovered;
                j_5_cases= docs[0].j_5.cases ;
                j_5_deaths= docs[0].j_5.deaths;
                j_5_recovered= docs[0].j_5.recovered ;
                callback(docs);
            });
        }
    }

});

app.get('/trends', verifSignIn, (request, response) => {

    var imageBinaire;
    var titre0 = "";
    var titre1 = "";
    var titre2 = "";
    var titre3 = "";
    var titre4 = "";
    var description0 = "";
    var description1 = "";
    var description2 = "";
    var description3 = "";
    var description4 = "";
    var auteur0 = "";
    var auteur1 = "";
    var auteur2 = "";
    var auteur3 = "";
    var auteur4 ="";
    var URL0 = "";
    var URL1 = "";
    var URL2 = "";
    var URL3 = "";
    var URL4 = "";

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findVar(db, function() {
            checkUpdateNouvelles(db, function() {
                resultatCheckNouvelles(db, function() {
                    findDataNouvelles(db, function() {
                        client.close();
                        response.render('pages/trends', {id: request.session.user.id, img: imageBinaire,
                            titre0: titre0, titre1: titre1, titre2: titre2, titre3: titre3, titre4 : titre4,
                            description0: description0, description1: description1, description2: description2, description3: description3, description4: description4,
                            auteur0: auteur0, auteur1: auteur1, auteur2: auteur2, auteur3: auteur3, auteur4: auteur4,
                            URL0: URL0, URL1: URL1, URL2: URL2, URL3: URL3, URL4: URL4});
                    });
                });
            });
        });
    });

    const findVar = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            console.log(docs[0].localisation.Ville)
            ville = docs[0].localisation.Ville
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            callback();
        });
    };

    const checkUpdateNouvelles = function(db, callback) {
        console.log("Je suis dans checkUpdateNouvelles");
        const collection = db.collection('nouvelles');
        collection.find({}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found the following records for checkUpdateNouvelles");
            //console.log(docs[0]);
            var dateAjd = new Date();
            var date_a_comparer = docs[0].date_mise_a_jour;
            console.log(dateAjd);
            console.log(date_a_comparer);
            if ( dateAjd - date_a_comparer > 1000 * 60 * 60 * 2) {    //2 heures
                console.log("Je suis dans la boucle if");
                majNouvelles = true;
                callback(majNouvelles);
            }
            else{
                console.log("Je suis dans la boucle else");
                majNouvelles = false;
                callback(majNouvelles);
            }
        })
    };

    const resultatCheckNouvelles = function(db,callback) {
        console.log(majNouvelles + " Je suis dans resultatCheckNouvelles");
        if (majNouvelles === true) {
            console.log("Je suis dans le if de resultatCheckNouvelles");
            updateNouvelles(db,function() {
                callback(majNouvelles);
            });
        }
        else {
            callback(majNouvelles);
        }
    };

    const updateNouvelles = function(db, callback) {
        console.log("Je suis dans updateNouvelles");
        newsapi.v2.topHeadlines({
            language: 'fr',
            country: 'fr'
        }).then(response2 => {
            //console.log(response2);
            const collection = db.collection('nouvelles');
            // Mettre à jour les nouvelles
            collection.updateOne({}
                , { $set: { "status" : response2.status, "totalResults": response2.totalResults, "date_mise_a_jour": new Date(), "articles": response2.articles}}, function(err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    console.log("Document nouvelles mis à jour");
                    callback(result);
                });
        });
    };

    const findDataNouvelles = function(db,callback) {
        const collection = db.collection('nouvelles');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Voici les informations trouvées par findDataNouvelles");
            console.log(docs[0]);
            titre0 = docs[0].articles[0].title;
            titre1 = docs[0].articles[1].title;
            titre2 = docs[0].articles[2].title;
            titre3 = docs[0].articles[3].title;
            titre4 = docs[0].articles[4].title;
            description0 = docs[0].articles[0].description;
            description1 = docs[0].articles[1].description;
            description2 = docs[0].articles[2].description;
            description3 = docs[0].articles[3].description;
            description4 = docs[0].articles[4].description;
            auteur0 = docs[0].articles[0].author;
            auteur1 = docs[0].articles[1].author;
            auteur2 = docs[0].articles[2].author;
            auteur3 = docs[0].articles[3].author;
            auteur4 = docs[0].articles[4].author;
            URL0 = docs[0].articles[0].url;
            URL1 = docs[0].articles[1].url;
            URL2 = docs[0].articles[2].url;
            URL3 = docs[0].articles[3].url;
            URL4 = docs[0].articles[4].url;
            callback(docs);
        });
    };
});

let stationFav = "";
let etatStationFav = "";
let nbVeloDispoFav = "";
let nbPlaceDispoFav = "";

app.get('/transport', verifSignIn, (request, response) => {
    let imageBinaire;
    let VLilleData = "";
    let ajouterVLille = false;
    let majVLille = false;
    let ajoutVLille = false;

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findUserInfoVLille(db, function() {
            checkUpdateVLille(db, function() {
                resultatCheckVLille(db, function() {
                    findDataVLille(db, function() {
                        client.close();
                        response.render('pages/transport',
                            {id: request.session.user.id, img: imageBinaire,
                            stationFav:stationFav,
                            etatStationFav:etatStationFav,
                            nbVeloDispoFav: nbVeloDispoFav,
                            nbPlaceDispoFav: nbPlaceDispoFav});
                    })
                })
            })
        });

    });

    const findUserInfoVLille = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Trouve les informations VLille de l'utilisateur");
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            stationFav = docs[0].station_fav
            callback();
        });
    };

    const checkUpdateVLille = function(db, callback) {
        const collection = db.collection('VLille');
        collection.find({nomStation : stationFav}).toArray(function(err,docs) {
            assert.equal(err,null);
            console.log("Found the following records for checkUpdateVLille");
            console.log(docs[0]);
            if (typeof(docs[0]) == 'undefined'){
                ajouterVLille = true;
                callback(ajouterVLille);
            }
            else{
                var dateAjd = new Date();
                var date_a_comparer = docs[0].date_mise_a_jour;
                console.log(dateAjd);
                console.log(date_a_comparer);
                if ( dateAjd - date_a_comparer > 3 * 60000) {      //3 minutes
                    majVLille = true;
                    callback(majVLille);
                }
                else{
                    majVLille = false;
                    callback(majVLille);
                }
            }
        })
    };

    const resultatCheckVLille = function(db,callback) {
        if (ajouterVLille === true){
            insertVLille(db,function() {
                callback(ajouterVLille);
            });
        }
        else {
            if (majVLille === true){
                updateVLille(db, function() {
                    callback(majVLille);
                });
            }
            else{
                callback(majVLille);
            }
        }
    }

    const insertVLille= function(db, callback) {

        https.get("https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&q=&rows=249&facet=libelle&facet=nom&facet=commune&facet=etat&facet=etatconnexion", (response2) => {
            // A chunk of data has been received.
            response2.on('data', (chunk) => {
                VLilleData += chunk;
            });

            // The whole response has been received. Print out the result.
            response2.on('end',() => {
                console.log("J'ai reçu la réponse, plus qu'a la print");
                VLilleData = JSON.parse(VLilleData);
                for (var i = 0; i < VLilleData.parameters.rows; i++) {
                    if (VLilleData.records[i].fields.nom === stationFav)	{
                        etatStationFav = VLilleData.records[i].fields.etat.toLowerCase()
                        nbVeloDispoFav = VLilleData.records[i].fields.nbvelosdispo
                        nbPlaceDispoFav = VLilleData.records[i].fields.nbplacesdispo
                    }
                }

                const collection = db.collection('VLille');
                collection.insertMany([
                    {"nomStation": stationFav, "etat": etatStationFav, "nbVeloDispo": nbVeloDispoFav, "nbPlaceDispo": nbPlaceDispoFav, "date_mise_a_jour": new Date()}], function(err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);
                    console.log("Inserted 1 document into the collection VLille");
                    ajoutVLille = true;
                    callback(result);
                });
            });
        }).on("error", (err) => {
            console.log("Error: " + err.message);
        });
    }

    const updateVLille = function(db, callback) {
        https.get("https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&q=&rows=249&facet=libelle&facet=nom&facet=commune&facet=etat&facet=etatconnexion", (response2) => {
            // A chunk of data has been received.
            response2.on('data', (chunk) => {
                VLilleData += chunk;
            });

            // The whole response has been received. Print out the result.
            response2.on('end',() => {
                console.log("J'ai reçu la réponse, plus qu'a la print");
                VLilleData = JSON.parse(VLilleData);
                //console.log(VLilleData);
                for (var i = 0; i < VLilleData.parameters.rows; i++) {
                    if (VLilleData.records[i].fields.nom === stationFav)	{
                        etatStationFav = VLilleData.records[i].fields.etat.toLowerCase()
                        nbVeloDispoFav = VLilleData.records[i].fields.nbvelosdispo
                        nbPlaceDispoFav = VLilleData.records[i].fields.nbplacesdispo
                        //response1.render('pages/index', {nomStation: vLille_data.records[i].fields.nom.toLowerCase(), etatStation: vLille_data.records[i].fields.etat.toLowerCase(), nbVeloDispo: vLille_data.records[i].fields.nbvelosdispo, nbPlaceDispo: vLille_data.records[i].fields.nbplacesdispo });
                    }
                }

                const collection = db.collection('VLille');
                // Mettre à jour les  informations des VLilles pour la station concernée
                collection.updateOne({ nomStation : stationFav }
                    , { $set: {"nomStation": stationFav, "etat": etatStationFav, "nbVeloDispo": nbVeloDispoFav, "nbPlaceDispo": nbPlaceDispoFav, "date_mise_a_jour": new Date() } }, function(err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        console.log("Document VLille mis à jour");
                        callback(result);
                    });
            });

        }).on("error", (err) => {
            console.log("Error : " + err.message);
        });
    }

    const findDataVLille = function(db,callback) {
        if(ajoutVLille === true){
            callback();
        }
        else{
            const collection = db.collection('VLille');
            collection.find({nomStation : stationFav}).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log(docs[0]);
                etatStationFav = docs[0].etat;
                nbVeloDispoFav = docs[0].nbVeloDispo;
                nbPlaceDispoFav = docs[0].nbPlaceDispo
                callback(docs);
            });
        }
    }
});

app.get('/profile', verifSignIn, (request, response) => {

    let imageBinaire;
    let lastname;
    let firstname;
    let city;
    let birthday;
    let country;

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findVar(db, function() {
            findUserInfo(db, function() {
                client.close();
                response.render('pages/profile', {id: request.session.user.id, img: imageBinaire,
                lastName: lastname, firstName: firstname, birthday: birthday, city: city, country: country});
            });
        });
    });

    const findVar = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            console.log(docs[0].localisation.Ville)
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            callback();
        });
    };

    const findUserInfo = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Trouve les informations de l'utilisateur");
            lastname = docs[0].nom;
            firstname = docs[0].prenom;
            birthday = docs[0].Date_Naissance;
            city = docs[0].localisation.Ville;
            country = docs[0].localisation.Pays;
            callback();
        });
    };

});

app.get('/modifier_compte', verifSignIn, (request, response) => {

    response.render('pages/modifier_compte');

});

app.get('/modifier_image', verifSignIn, (request, response) => {

    response.render('pages/modifier_compte');

});

app.get('/deconnexion', (request,response) => {

    request.session.destroy(function(){

        console.log("Utilisateur déconnecté");
        console.log(Users);

    });

    response.redirect('/login');

});

app.get('/forget-password', (request, response) => {

    response.render('pages/forget-password');

});

//Nos Post
app.post('/connexion', (request,response) => {

    response.redirect('/login');

});

app.post('/sign-up', (request, response) => {
    let astro;

    Users.filter(function(user) {
        if (user.id === request.body.input_id){
            response.render('pages/sign-up', {
                message: "Cette identifiant existe déjà ! Connectez-vous ou choisissez un autre identifiant"
            });
        }
    });

    var newUser = {id: request.body.input_id, mdp: request.body.input_mdp};
    Users.push(newUser);
    request.session.user = newUser;

    // Use connect method to connect to the server
    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");
        const db = client.db(dbName);

        insertDocuments(db, function() {
            updateDocument(db,function() {
                client.close();
            });
        });
    });

    //On insère le document du nouvel utilisateur
    const insertDocuments = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('Utilisateurs');
      collection.insertMany([
          {"nom": request.body.input_nom,
              "prenom": request.body.input_prenom,
              "id": request.body.input_id,
              "mdp": request.body.input_mdp,
              "localisation":
                  {"Pays": request.body.input_pays,
                      "Ville": request.body.input_commune,
                      "CP": request.body.input_CP},
              "Date_Naissance": new Date(request.body.input_date_naissance),
              "email":request.body.email}],
          function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            assert.equal(1, result.ops.length);
            console.log("Inserted 1 user into the collection");
            callback(result);
      });
    }

    //Prenons en charge tout de suite son signe astrologique
    const date_tronquee = request.body.input_date_naissance.substring(5, 9);

    if (date_tronquee.localeCompare("01-19") === 1 && date_tronquee.localeCompare("02-19") === -1) {
        astro = "Aquarius";
    }
    if (date_tronquee.localeCompare("02-18") === 1 && date_tronquee.localeCompare("03-21") === -1) {
        astro = "Pisces";
    }
    if (date_tronquee.localeCompare("03-20") === 1 && date_tronquee.localeCompare("04-20") === -1) {
        astro = "Aries";
    }
    if (date_tronquee.localeCompare("04-19") === 1 && date_tronquee.localeCompare("05-21") === -1) {
        astro = "Taurus";
    }
    if (date_tronquee.localeCompare("05-20") === 1 && date_tronquee.localeCompare("06-22") === -1) {
        astro = "Gemini";
    }
    if (date_tronquee.localeCompare("06-21") === 1 && date_tronquee.localeCompare("07-23") === -1) {
        astro = "Cancer";
    }
    if (date_tronquee.localeCompare("07-22") === 1 && date_tronquee.localeCompare("08-23") === -1) {
        astro = "Leo";
    }
    if (date_tronquee.localeCompare("08-22") === 1 && date_tronquee.localeCompare("09-23") === -1) {
        astro = "Virgo";
    }
    if (date_tronquee.localeCompare("09-22") === 1 && date_tronquee.localeCompare("10-24") === -1) {
        astro = "Libra";
    }
    if (date_tronquee.localeCompare("10-23") === 1 && date_tronquee.localeCompare("11-22") === -1) {
        astro = "Scorpio";
    }
    if (date_tronquee.localeCompare("11-21") === 1 && date_tronquee.localeCompare("12-22") === -1) {
        astro = "Sagittarius";
    }
    if (typeof(astro) === 'undefined'){
        astro = "Capricorn";
    }

    const updateDocument = function(db, callback) {
      // Get the documents collection
      const collection = db.collection('Utilisateurs');
      // Ajoute le signe astrologique de l'utilisateur
      collection.updateOne({ id : request.body.input_id }
        , { $set: { "astrologie" : astro } }, function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        console.log("Ajout du signe astrologique avec succès");
        callback(result);
      });
    }

    console.log(Users);
    response.redirect('/login');

});

app.post('/connexion1', (request, response) => {

    console.log(Users);
    let trouver = false;
    Users.filter(function(user) {

        if (user.id === request.body.input_id && user.mdp === request.body.input_mdp){

            request.session.user = user;
            trouver = true;
            response.redirect('/home');

        }
    });

    if (trouver === false){

         MongoClient.connect(url, function(err, client) {
            assert.equal(null, err);
            console.log("Connected successfully to server");

            const db = client.db(dbName);

            findDocuments(db, function() {
                client.close();
            });
         });

         //Trouver des documents
         const findDocuments = function(db, callback) {
            // Get the documents collection
            const collection = db.collection('Utilisateurs');
            // Find some documents
            collection.find({id : request.body.input_id}).toArray(function(err, docs) {
                assert.equal(err, null);
                console.log("Found the following records for connexion Utilisateurs");
                callback(docs[0]);
                console.log(docs[0]);
                if (docs[0]){
                    if (docs[0].mdp === request.body.input_mdp){

                        var User = {id: request.body.input_id, mdp: request.body.input_mdp};
                        Users.push(User);
                        request.session.user = User;
                        response.redirect('/home');

                    }
                    else {
                        response.render('pages/login', {erreur: "Identifiant ou mot de passe incorrect"});
                    }
                }
                else {
                    response.render('pages/login', {erreur: "Identifiant ou mot de passe incorrect"});
                }
            });
         };
    }
});

// Modification du profil
app.post('/modifier_compte', (request, response, next) => {

    let nom;
    let prenom;
    let pseudo;
    let mdp;
    let ville;
    let codePostal;
    let pays;
    let email;
    let stationFavorite;

    let change_nom;
    let change_prenom;
    let change_pseudo;
    let change_email;
    let change_mdp;
    let change_pays;
    let change_ville;
    let change_CP;
    let change_station

    let ilFautSeReconnecterLa = false;

    const Cherche = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            nom = docs[0].nom;
            prenom = docs[0].prenom;
            pseudo = docs[0].id;
            mdp = docs[0].mdp;
            ville = docs[0].localisation.Ville;
            codePostal = docs[0].localisation.CP;
            pays = docs[0].localisation.Pays;
            email = docs[0].email;
            stationFavorite = docs[0].station_fav;
            callback();
        });
    };

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);
        Cherche(db, function() {
            updateDocument(db,function(){
                client.close();
                if (ilFautSeReconnecterLa == true){
                    response.render('pages/login');
                }
                else{
                    response.render('pages/modifier_compte', {result2 : "Votre compte a bien été modifié"})
                }
            });
        });
    });

    let user_actuel = "";
    Users.filter(function(user) {
        user_actuel = user.id;
    });

    //Modifier un document
    const updateDocument = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Modifie le compte de l'utilisateur

        if (request.body.input_nom === ""){
            change_nom = nom;
        }
        else {
            change_nom = request.body.input_nom;
        }
        if (request.body.input_prenom === ""){
            change_prenom = prenom;
        }
        else{
            change_prenom= request.body.input_prenom;
        }
        if (request.body.input_id === ""){
            change_pseudo = pseudo;
        }
        else{
            change_pseudo = request.body.input_id;
            ilFautSeReconnecterLa = true;
        }
        if (request.body.email === ""){
            change_email = email;
        }
        else{
            change_email = request.body.email;
        }
        if (request.body.input_mdp === ""){
            change_mdp = mdp;
        }
        else{
            change_mdp = request.body.input_mdp;
            ilFautSeReconnecterLa = true;
        }
        if (request.body.input_pays === ""){
            change_pays = pays;
        }
        else{
            change_pays = request.body.input_pays;
        }
        if (request.body.input_commune === ""){
            change_ville = ville;
        }
        else{
            change_ville = request.body.input_commune;
        }
        if (request.body.input_CP === ""){
            change_CP = codePostal;
        }
        else{
            change_CP = request.body.input_CP;
        }
        if (request.body.input_nomStation === ""){
            change_station = stationFavorite;
        }
        else {
            change_station = request.body.input_nomStation;
        }

        collection.updateOne({ id : user_actuel }
            , { $set: {
                    "nom" : change_nom,
                    "prenom" : change_prenom,
                    "id" : change_pseudo,
                    "mdp" : change_mdp,
                    "email" : change_email,
                    "localisation.Ville" : change_ville,
                    "localisation.Pays" : change_pays,
                    "localisation.CP" : change_CP,
                    "station_fav" : change_station }
            }, function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("profil mis à jour");
                callback(result);
            });
    }
});

//Photo
app.post('/modifier_image', (request, response, next) => {

    var user_actuel = "";
    let file = {file: binary(request.files.fichier.data)};

    Users.filter(function(user) {
        user_actuel = user.id;
    });

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        updateDocument(db, function() {
            client.close();
        });
    });

    //Modifier un document
    const updateDocument = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Modifie le compte de l'utilisateur
        collection.updateOne({ id : user_actuel }
            , { $set: { photo_profil : file } }, function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("Photo mise à jour");
                callback(result);
                response.render('pages/modifier_compte', {result1: "Votre photo de profil a bien été mise à jour"});
                if (err) {
                    response.render('pages/modifier_compte', {result1: "Erreur lors de l'insertion de votre image"});
                }
            });
    }
});

//Forget password
app.post('/forget-password',(request, response, next) => {

    var user_actuel = "";
    let pseudo;

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        Cherche(db,function() {
            updateDocument(db,function(){
                client.close();
            });
        });
    });

    const Cherche = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.body.input_id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            console.log(docs[0]);
            pseudo = docs[0].id;
            callback(docs[0]);

            if(docs[0]){
                if(docs[0].id === request.body.input_id){
                    var User = {id: request.body.input_id};
                    Users.push(User);
                    request.session.user = User;
                }
            }
        });
    };

    //Modifier un document
    const updateDocument = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Modifie le compte de l'utilisateur
        collection.updateOne({ id : pseudo }
            , { $set: { "mdp" : request.body.new_mdp } },
            function(err, result) {
                assert.equal(err, null);
                assert.equal(1, result.result.n);
                console.log("mdp mise à jour");
                callback(result);
                response.render('pages/login', {result1: "Votre mdp a bien été mise à jour"});
            });
    }
})

app.post('/transport', (request,response) => {
    let imageBinaire;
    VLilleData = "";
    let inputNomStation = request.body.input_nomStation;
    inputNomStation = inputNomStation.toUpperCase();
    console.log(inputNomStation);

    MongoClient.connect(url, function(err, client) {
        assert.equal(null, err);
        console.log("Connected successfully to server");

        const db = client.db(dbName);

        findVar(db, function() {
            client.close();
        });
    });

    const findVar = function(db, callback) {
        // Get the documents collection
        const collection = db.collection('Utilisateurs');
        // Find some documents
        collection.find({id : request.session.user.id}).toArray(function(err, docs) {
            assert.equal(err, null);
            console.log("Found the following records for findVar Utilisateurs");
            console.log(docs[0].localisation.Ville)
            ville = docs[0].localisation.Ville
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            callback();
        });
    };

    if (inputNomStation === ' '){
        response.render('pages/transport',
            {stationFav:stationFav,
                etatStationFav:etatStationFav,
                nbVeloDispoFav: nbVeloDispoFav,
                nbPlaceDispoFav: nbPlaceDispoFav,
                erreurNomStation: 'Veuillez entrer un nom de station'});
    }
    else {
        https.get("https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&q=&rows=249&facet=libelle&facet=nom&facet=commune&facet=etat&facet=etatconnexion", (response2) => {

            let VLilleData = '';
            // A chunk of data has been received.
            response2.on('data', (chunk) => {
                VLilleData += chunk;
            });

            // The whole response has been received. Print out the result.
            response2.on('end',() => {

                VLilleData = JSON.parse(VLilleData)
                for (let i=0; i<VLilleData.parameters.rows; i++) {
                    if (VLilleData.records[i].fields.nom === inputNomStation)	{
                        response.render('pages/transport',
                            {id: request.session.user.id, img: imageBinaire, nomStation: VLilleData.records[i].fields.nom.toUpperCase(),
                                etatStation: VLilleData.records[i].fields.etat.toLowerCase(),
                                nbVeloDispo: VLilleData.records[i].fields.nbvelosdispo,
                                nbPlaceDispo: VLilleData.records[i].fields.nbplacesdispo,
                                stationFav:stationFav,
                                etatStationFav:etatStationFav,
                                nbVeloDispoFav: nbVeloDispoFav,
                                nbPlaceDispoFav: nbPlaceDispoFav});
                    }
                }
            });

        }).on("error", (err) => {
            console.log("Error : " + err.message);
        });
    }
});

function verifSignIn(request,response,next) {

    if(request.session.user){ next(); }         //Si la session existe on change la page
    else {
        console.log("Vous n'êtes pas connecté");
        response.redirect("/login");            //Sinon, on met une erreur, accès non autorisé
    }
}

app.listen(8080)