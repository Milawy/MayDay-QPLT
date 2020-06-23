# MayDay-QPLT
My day project has began in may and it's Que Pour Le Travail

Notre projet c'est pas encore hébergé en ligne, pour le lancer et l'utiliser il vous faudra suivre ces instructions :

1) Télécharger "MongoDBCompassCommunity"
2) Créer le connexion "mongodb://localhost:27017" puis créer la BDD "QPLT"
3) Creer les collections suivantes dans la BDD (bien respecter l'orthographe et la casse) :
  
  -> Utilisateurs
  -> VLille
  -> covid
  -> horoscope
  -> mesSessions
  -> meteo
  -> nouvelles
  
4) Importer les collections du fichier mesCollections.rar dans votre BDD dans le collections associées en utilisant "import file".
    Choisir "JSON" et ne pas cocher la case "ignore empty strings"

Voilà, vous avez bien configurer la base de donnée.

Pour utiliser le serveur : 

prendre les fichiers du Github, dans votre IDE (nous utilisons IntelliJ) et rentrer les commande suivante dans la console de votre IDE : 

1) npm install
2) npm install --save nodemon
3) npm run start

Et voilà :) ouvrez votre navigateur préféré et entrez l'adresse suivante : "localhost:8080" ;-)

Bonne journée !
