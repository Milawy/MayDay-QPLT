var form = document.querySelector("form");
// Gestion de la soumission du formulaire
form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Récupération des champs du formulaire dans l'objet FormData
    var data = new FormData(form);
	document.getElementById("succes").innerHTML = "Félicitation votre compte a été crée avec succès, veuillez retourner sur la page d'accueil pour vous connecter";
	ajaxPost("http://tests/testVlille2/js/monPHP.php", data, function () {});
});

/*
	var prenom = document.getElementById("input_prenom").value;
	var nom = document.getElementById("input_nom").value;
	var commune = document.getElementById("input_commune").value;
	var codePostal = document.getElementById("input_CP").value;
	var date_naissance = document.getElementById("input_date_naissance").value;
	var OK = true;

	//On vérifie que l'utilisateur a rempli tout le formulaire
	if(prenom == ""){
		document.getElementById("erreur1").innerHTML = "Veuillez entrer votre prénom";
		OK = false;
	}
	if(nom == ""){
		document.getElementById("erreur2").innerHTML = "Veuillez entrer votre nom";
		OK = false;
	}
	if(commune == ""){
		document.getElementById("erreur3").innerHTML = "Veuillez entrer un code postal";
		OK = false;
	}
	if(codePostal == ""){
		document.getElementById("erreur4").innerHTML = "Veuillez entrer un code postal";
		OK = false;
	}
	if(date_naissance == ""){
		document.getElementById("erreur5").innerHTML = "Veuillez entrer une date de naissance";
		OK = false;
	}
	//On vérifie que les valeurs rentrées par l'utilisateur sont correctes
	for (var i=0; i<prenom.length;i++){
		if ((prenom.charCodeAt(i) > 122 || prenom.charCodeAt(i) < 65 || (prenom.charCodeAt(i) < 97 && prenom.charCodeAt(i) > 90 ) ) && prenom.charCodeAt(i) != 45){
			document.getElementById("erreur1").innerHTML = "Pour votre prénom, veuillez-entrer uniquement des lettres (ou tirets)";
			OK = false;
		}
	}
	for (var i=0; i<nom.length; i++){
		if ((nom.charCodeAt(i) > 122 || nom.charCodeAt(i) < 65 || (nom.charCodeAt(i) < 97 && nom.charCodeAt(i) > 90 ) ) && nom.charCodeAt(i) != 45){
			document.getElementById("erreur2").innerHTML = "Pour votre nom, veuillez-entrer uniquement des lettres (ou tirets)";
			OK = false;
		}
	}
	for (var i=0; i<commune.length; i++){
		if ((commune.charCodeAt(i) > 122 || commune.charCodeAt(i) < 65 || (commune.charCodeAt(i) < 97 && commune.charCodeAt(i) > 90 ) ) && commune.charCodeAt(i) != 45){
			document.getElementById("erreur3").innerHTML = "Pour votre commune, veuillez-entrer uniquement des lettres (ou tirets)";
			OK = false;
		}
	}
	for (var i=0; i<codePostal.length; i++){
		if (codePostal.length != 5 || codePostal.charCodeAt(i) < 48 || codePostal.charCodeAt(i) > 57){
			document.getElementById("erreur4").innerHTML = "Erreur lors de l'entrée de votre code postal";
			OK = false;
		}
	}
	if (OK == true){
		document.getElementById("succes").innerHTML = "Félicitation votre compte a été crée avec succès, veuillez retourner sur la page d'accueil pour vous connecter";
		ajaxPost("http://tests/testVlille2/js/monPHP.php", data, function () {});
	}
*/
