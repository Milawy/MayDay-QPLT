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
//var formidable = require('formidable');
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
app.use('/Accueil_User', function(erreur, request, response,next){
    console.log(erreur);
    //l'utilisateur doit être connecté ! Redirection à Connexion
    request.redirect('/login');
});
app.use(fileUpload());
app.use(express.static(__dirname + "/public"));

var Users = [];

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

app.get('/Accueil_User', verifSignIn, (request,response) => {

    var signe = "";
    var ville = "";
    var imageBinaire;
    var messageVlille = "";
    var stationFav = "";
    var majHoroscope = false;
    var majMeteo = false;
    var majNouvelles = false;
    var horoscope_data = "";
    var meteo_data = "";
    var nouvelles_data = "";
    var ajouterMeteo = false;
    var ajoutMeteo = false;
    //Horoscope
    var astro = "";
    var texteAstro = "";
    //Meteo
    var temperature = "";
    var vitesse_vent = "";
    var precipitation = "";
    var humidite = "";
    var couverture_nuageuse = "";
    var ressenti = "";
    var index_UV = "";
    var visibilite = "";
    var infos_date = "";
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
                    checkUpdateMeteo(db, function() {
                        resultatCheckMeteo(db, function() {
                            findDataMeteo(db,function() {
                                checkUpdateNouvelles(db, function() {
                                    resultatCheckNouvelles(db, function() {
                                        findDataNouvelles(db, function() {
                                            client.close();
                                            response.render('pages/Accueil_User', {id: request.session.user.id, astro: astro, texteAstro: texteAstro, ville: ville,
                                             temperature: temperature, vitesse_vent: vitesse_vent, precipitation: precipitation, humidite: humidite, couverture_nuageuse: couverture_nuageuse,
                                              ressenti: ressenti, index_UV: index_UV, visibilite: visibilite, infos_date: infos_date,
                                               titre0: titre0, titre1: titre1, titre2: titre2, titre3: titre3, titre4 : titre4,
                                                description0: description0, description1: description1, description2: description2, description3: description3, description4: description4,
                                                 auteur0: auteur0, auteur1: auteur1, auteur2: auteur2, auteur3: auteur3, auteur4: auteur4,
                                                  URL0: URL0, URL1: URL1, URL2: URL2, URL3: URL3, URL4: URL4, img: imageBinaire, message: messageVlille, stationFav: stationFav});
                                        });
                                    });
                                });
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
            console.log(docs[0].astrologie);
            console.log(docs[0].localisation.Ville)
            signe = docs[0].astrologie
            ville = docs[0].localisation.Ville
            if (typeof(docs[0].photo_profil) != 'undefined'){
                imageBinaire = new Buffer(docs[0].photo_profil.file.buffer).toString('base64');
                console.log(docs[0].photo_profil.file);
            }
            if (typeof(docs[0].station_fav) == 'undefined'){
                messageVlille = "Pas_de_station_fav";
            }
            else{
                messageVlille = "station_fav_OK";
                stationFav = docs[0].station_fav;
            }

            callback(signe);

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
                    console.log("Inserted 1 documents into the collection");
                    ajoutMeteo = true;
                    callback(result);
                });
            });
        });
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
            //response.render('pages/Accueil_User', {id: request.session.user.id, astro: docs[0].signe, texteAstro: docs[0].texte});
        });
    };
});

app.get('/modifier_compte', verifSignIn, (request, response) => {

        response.render('pages/modifier_compte');

});

app.get('/deconnexion', (request,response) => {

    request.session.destroy(function(){

        console.log("Utilisateur déconnecté");
        console.log(Users);

    });

    response.redirect('/login');

});

//Nos Post
app.post('/sign-up', (request,response) => {

    response.redirect('/sign-up');

});

app.post('/connexion', (request,response) => {

    response.redirect('/login');

});

app.post('/sign-up', (request, response) => {

    let astro;
    Users.filter(function(user) {

        if (user.id === request.body.input_id){

            response.render('pages/sign-up', {message: "Cette identifiant existe déjà ! Connectez-vous ou choisissez un autre identifiant."});

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
        {"nom":request.body.input_nom, "prenom":request.body.input_prenom, "id":request.body.input_id, "mdp":request.body.input_mdp, "localisation" : {"Ville":request.body.input_commune,"CP":request.body.input_CP},"Date_Naissance":new Date(request.body.input_date_naissance)}], function(err, result) {
        assert.equal(err, null);
        assert.equal(1, result.result.n);
        assert.equal(1, result.ops.length);
        console.log("Inserted 1 documents into the collection");
        callback(result);
      });
    }

    //Prenom en charge tout de suite son signe astrologique
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
    if (date_tronquee.localeCompare("12-21") === 1 && date_tronquee.localeCompare("01-20") === -1) {
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

    //response.render('pages/sign-up', {succes: 'Félicitation votre compte a été crée avec succès, vous allez être rediriger vers votre page d\'accueil'});
    console.log(Users);
    response.redirect('/Accueil_User');

});

app.post('/connexion1', (request, response) => {

    console.log(Users);
    let trouver = false;
    Users.filter(function(user) {

        if (user.id === request.body.input_id && user.mdp === request.body.input_mdp){

            request.session.user = user;
            trouver =true;
            response.redirect('/Accueil_User');

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
                        response.redirect('/Accueil_User');

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

app.post('/modifier_compte', (request, response, next) => {

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
})

app.post('/nomStation', (request, response) => {

    var user_actuel = "";

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
            , { $set: { station_fav : request.body.input_nomStation.toUpperCase() } }, function(err, result) {
            assert.equal(err, null);
            assert.equal(1, result.result.n);
            console.log("Station favorite mise à jour");
            callback(result);
            response.render('pages/modifier_compte', {result2: "Votre station favorite a bien été mise à jour"});
        });
    }

})

app.post('/', (request,response1) => {

    var input_nomStation = request.body.input_nomStation;
    input_nomStation = input_nomStation.toUpperCase ();
    console.log(input_nomStation);

    if (input_nomStation === ' '){

        response.render('pages/index', {erreur_nomStation: 'Veuillez entrer un nom de station'});

    }
    else {

        https.get("https://opendata.lillemetropole.fr/api/records/1.0/search/?dataset=vlille-realtime&q=&rows=108&facet=libelle&facet=nom&facet=commune&facet=etat&refine.commune=LILLE", (response2) => {

            let vLille_data = '';
            // A chunk of data has been received.
                response2.on('data', (chunk) => {
                    vLille_data += chunk;
                });

                // The whole response has been received. Print out the result.
                response2.on('end',() => {

                    vLille_data = JSON.parse(vLille_data)
                    for (var i=0; i<vLille_data.parameters.rows; i++) {
                        if (vLille_data.records[i].fields.nom === input_nomStation)	{
                    	    response1.render('pages/index', {nomStation: vLille_data.records[i].fields.nom.toLowerCase(), etatStation: vLille_data.records[i].fields.etat.toLowerCase(), nbVeloDispo: vLille_data.records[i].fields.nbvelosdispo, nbPlaceDispo: vLille_data.records[i].fields.nbplacesdispo });
                    	}
                    }

                });

            }).on("error", (err) => {
                console.log("Error: " + err.message);
            });

    }

});

function verifSignIn(request,response,next) {

    if(request.session.user){ next(); }         //Si la session existe on change la page
    else {
        var erreur = new Error("Vous n'êtes pas connecté");
        console.log(request.session.user);
        next(erreur);                           //Sinon, on met une erreur, accès non autorisé
    }
}

app.listen(8080)