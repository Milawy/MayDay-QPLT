
const findVar = function (db) {
  // On renvoie une promesse qui prend en paramettre une fonction
  // avec 2 paramètres, le callback de succès et d'erreur
  return new Promise(function (resolve, reject) {
    // Le reste du code ressemble à la méthode précédente
    const collection = db.collection('Utilisateurs');
    // Find some documents
    collection.find({id : request.session.user.id}).toArray(function(err, docs) {
        assert.equal(err, null);
        console.log("Found the following records for findVar Utilisateurs");
        console.log(docs[0].astrologie);
        console.log(docs[0].localisation.Ville)
        signe = docs[0].astrologie
        ville = docs[0].localisation.Ville
        resolve();
    });
  });
}

const checkUpdateHoroscope = function(db) {
    return new Promise(function(resolve, reject) {
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
            if (dateAjd.localeCompare(date_a_comparer) == 1) {
                console.log("Je suis dans la boucle if");
                majHoroscope = true;
                resolve()
            }
            else{
                console.log("Je suis dans la boucle else");
                majHoroscope = false;
                resolve();
            }
        })
    });
}

const resultatCheckHoroscope = function(db) {
    return new Promise(function(resolve, reject) {
        console.log(majHoroscope + " Je suis dans resultatCheckHoroscope");
        if (majHoroscope == true) {
            console.log("Je suis dans le if de resultatCheckHoroscope");
            updateHoroscope(db,function() {
                resolve();
            });
        }
        else {
            resolve();
        }
    });
}


findVar(db).then(function (response){
    return Promise.all([

    ])
})