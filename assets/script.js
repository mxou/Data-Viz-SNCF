// const { elements } = require("chart.js");

window.addEventListener('DOMContentLoaded', function () {

    // Keys 
    const voyageursURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/trafic-de-voyageurs-et-marchandises-depuis-1841/records?select=annee%2C%20voyageurs&where=annee>%3D2000&order_by=annee&limit=30`;
    const heuresURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/temps-de-travail-annuel-depuis-1851/records?select=date%2C%20temps_annuel_de_travail_sncf&where=date%20>%201918&order_by=date&limit=100`;
    const accidentURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/accidents-passagers/records?select=annee%2C%20nombre_accident&order_by=annee&limit=100`;
    const carteURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/menus-des-bars-tgv/records?select=produit%2C%20prix_au_produit%2C%20kcal_pour_100_ml_ou_100g%2C%20type&order_by=type&limit=99`;
    const anomaliesURL = 'https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/proprete-en-gare/records?select=mois%2C%20nom_gare%2C%20taux_de_conformite%2C%20nombre_d_observations%2C%20nombre_de_non_conformites&where=nom_gare%20%3D%20"Poitiers"%20OR%20"Angoulême"%20OR%20"Bordeaux%20Saint-Jean"&order_by=mois&limit=100&offset=0'; 
    const anomaliesP2URL = 'https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/proprete-en-gare/records?select=mois%2C%20nom_gare%2C%20taux_de_conformite%2C%20nombre_d_observations%2C%20nombre_de_non_conformites&where=nom_gare%20%3D%20"Poitiers"%20OR%20"Angoulême"%20OR%20"Bordeaux%20Saint-Jean"&order_by=mois&limit=100&offset=100';
    const sexeURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/enquetes-gares-connexions-repartition-homme-femme/records?select=sexe%2C%20pourcentage&limit=100`; 
    const handicapURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/agents-situation-handicap/records?select=date%2C%20total%2C%20total_epics&order_by=date&limit=100`; 
    const salaireURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/montant-remunerations-agents/records?select=remuneration_moyenne&limit=100`;
    const cameraURL = `https://ressources.data.sncf.com/api/explore/v2.1/catalog/datasets/equipement-surete/records?select=date%2C%20nombre_cameras_gare&order_by=date&limit=20`;
   
    // Keys 


    fetch(voyageursURL)
        .then(response => response.json())
        .then(voyageursDATA => {
            // console.log(voyageursDATA);

            // MOYENNE DU NOMBRE DE VOYAGEURS DE 2000 A 2019 
            let moyVoyageurs = 0;
            for (i = 0; i < voyageursDATA.results.length; i++) {
                moyVoyageurs += voyageursDATA.results[i].voyageurs;
            }
            // console.log(moyVoyageurs/voyageursDATA.results.length);
            document.querySelector('.indic1').innerHTML ="De 2000 a 2019, la moyenne du nombre de voyageurs en a été de <span>" + Math.round(moyVoyageurs/voyageursDATA.results.length) + " millions de voyageurs" + "</span>";
            // MOYENNE DU NOMBRE DE VOYAGEURS DE 2000 A 2019 




            fetch(heuresURL)
                .then(response => response.json())
                .then(heuresDATA => {
                    // EFFECTIF HORAIRE 
                    let heuresHTML = '';
                    let heuresTravaillees = [];
                    for (h = 0; h < heuresDATA.results.length; h++) {
                        heuresHTML += heuresDATA.results[h].temps_annuel_de_travail_sncf + '<br>';
                        heuresTravaillees.push(parseInt(heuresDATA.results[h].temps_annuel_de_travail_sncf));
                      

                    }

                    const moyenne = heuresTravaillees.reduce((acc, heure) => acc + heure, 0) / heuresTravaillees.length;
                    const ecarts = heuresTravaillees.map(heure => heure - moyenne);
                    const ecartsCarres = ecarts.map(ecart => Math.pow(ecart, 2));
                    const moyenneEcartsCarres = ecartsCarres.reduce((acc, ecartCarre) => acc + ecartCarre, 0) / ecartsCarres.length;
                    const ecartType = Math.sqrt(moyenneEcartsCarres);

                    // console.log("L'écart type du nombre d'heures travaillées est :", ecartType);
                    document.querySelector('.indic2').innerHTML ="L'écart type du nombre d'heures travaillées entre 1919 et 2018 est de <span>" + Math.round(ecartType) + " heures" + "</span>";

                });




            fetch(accidentURL)
                .then(response => response.json())
                .then(accidentsDATA => {
                    let accidentsHTML = '';
                    let accidents = [];
                    for (c = 0; c < accidentsDATA.results.length; c++) {
                        accidentsHTML += accidentsDATA.results[c].nombre_accident + '<br>';
                                            accidents.push(parseInt(accidentsDATA.results[c].nombre_accident));

                    }
                        const accidentsTries = accidents.slice().sort((a, b) => a - b);

                        let mediane;

                        if (accidentsTries.length % 2 === 0) {
                        const midIndex1 = accidentsTries.length / 2 - 1;
                          const midIndex2 = accidentsTries.length / 2;
                          mediane = (accidentsTries[midIndex1] + accidentsTries[midIndex2]) / 2
                        } else {
                          const midIndex = Math.floor(accidentsTries.length / 2);
                          mediane = accidentsTries[midIndex];
                        }

                        // console.log("La médiane du nombre d'accidents est :", mediane);

                    document.querySelector('.indic3').innerHTML = "La médiane du nombre d'accidents entre 2008 et 2022 est de <span>" + mediane + "</span>";



                });

        })


// Fonction pour tronquer dynamiquement le texte en fonction de l'espace disponible
// function truncateText(text, maxCharsToShow) {
//     return text.length > maxCharsToShow ? text.substring(0, maxCharsToShow) + "..." : text;
// }

// Définir la largeur maximale du conteneur
// const maxContainerWidth = Math.floor(window.innerWidth * 0.9);

fetch(carteURL)
    .then(response => response.json())
    .then(carteDATA => {
        console.log(carteDATA);

        const carteContainer = document.querySelector('.carteSlider');

        for (let i = 0; i < carteDATA.results.length; i++) {
            const produit = carteDATA.results[i];

            // Calculer la longueur maximale en fonction de la largeur du conteneur
            // const fontWidth = 10; // Ajustez en fonction de la police utilisée
            // const maxCharsToShow = Math.floor(maxContainerWidth / fontWidth);

            // Tronquer dynamiquement le nom du produit
            // const truncatedProductName = truncateText(produit.produit, maxCharsToShow);

            const produitDiv = document.createElement('div');
            produitDiv.classList.add('produit');
             produit.kcal_pour_100_ml_ou_100g = (produit.kcal_pour_100_ml_ou_100g === null) ? 0 : produit.kcal_pour_100_ml_ou_100g;

            produitDiv.innerHTML = `
                <p>${produit.produit}</p> <br>
                <p>Prix: ${produit.prix_au_produit} €</p>
                <p>Kcal pour 100ml/g: ${produit.kcal_pour_100_ml_ou_100g}</p>
            `;

            carteContainer.appendChild(produitDiv);
        }
    })
    .catch(error => {
        console.error('Error fetching carte:', error);
    });





const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
};



Promise.all([fetchData(anomaliesURL), fetchData(anomaliesP2URL)])
    .then(([anomaliesDataPage1, anomaliesDataPage2]) => {
        // Fusionner les données de deux pages
        const anomaliesData = anomaliesDataPage1.concat(anomaliesDataPage2);
                console.log("AAAAAAAAAAAAAAAAAAAAA",anomaliesData);
        

        let bordeauxArray = [];
        let poitiersArray = [];
        let angoulemeArray = [];
        let anneesArray = [];
        let nbrObservations = [];
        const moyTaux = [];

        // Remplir les tableaux avec les données correspondantes
        for (let i = 0; i < anomaliesData.length; i++) {
            const ville = anomaliesData[i].nom_gare;
            const nombreAnomalies = parseInt(anomaliesData[i].taux_de_conformite);
            const annee = parseInt(anomaliesData[i].mois);
            const taux = 100 - parseInt(anomaliesData[i].taux_de_conformite);
            nbrObservations.push(parseInt(anomaliesData[i].nombre_d_observations));
            moyTaux.push(parseInt(nombreAnomalies));

            if (!anneesArray.includes(annee)) {
                anneesArray.push(annee);
            }

            switch (ville) {
                case 'Bordeaux Saint-Jean':
                    bordeauxArray.push(taux);
                    break;
                case 'Poitiers':
                    poitiersArray.push(taux);
                    break;
                case 'Angoulême':
                    angoulemeArray.push(taux);
                    break;
                // Ajoutez d'autres villes au besoin
            }
        }
        function somme(array) {
            return array.reduce((acc, val) => acc + val, 0);
        }
        document.querySelector('.indic6').innerHTML = "De 2019 a 2023, un total de <span>" + somme(nbrObservations) + "</span> d'observations a été fait pour les gares de Bordeaux, Angoulême et Poitiers";
        document.querySelector('.indic7').innerHTML = "En moyenne, les gares de Bordeaux, Angoulême et Poiters ont un taux de confirmité de <span>" + Math.round(somme(moyTaux)/anomaliesData.length) + "%</span>";
        

        // Configuration du graphique
        const ctx = document.querySelector('#appChart');
        const datas = {
            labels: anneesArray,
            datasets: [
                {
                    label: 'Bordeaux',
                    data: bordeauxArray,
                    backgroundColor: '#D7BE59',
                    barThickness: 10, // Largeur des barres
                    group: 'group1' // Groupe pour placer les barres côte à côte
                },
                {
                    label: 'Poitiers',
                    data: poitiersArray,
                    backgroundColor: '#D68184',
                    barThickness: 10,
                    group: 'group1'
                },
                {
                    label: 'Angoulême',
                    data: angoulemeArray,
                    backgroundColor: '#F7C1A3',
                    barThickness: 10,
                    group: 'group1'
                }
            ]
        };
        const options = {
            plugins: {
                legend: true, // Afficher la légende
                title: {
                    display: true,
                    text: 'Nombre d\'anomalies par année et par ville',
                    color: 'white',
                }
            },
            scales: {
                x: {
                    stacked: false, // Ne pas empiler les barres horizontalement
                },
                y: {
                    beginAtZero: true,
                    stacked: false, // Ne pas empiler les barres verticalement
                }
            }
        };
        const config = {
            type: 'bar',
            data: datas,
            options: options
        };

        // Créer le graphique
        new Chart(ctx, config);
    })

      .catch(error => {
        console.error('Error fetching anomalies:', error);
    });


  


    fetch(sexeURL)
    .then(response => response.json())
    .then(sexeDATA => {
        // console.log(sexeDATA);
        let hommeArray = [];
        let femmeArray = [];

        for (let i=0; i<sexeDATA.results.length; i++) {
            // console.log(sexeDATA.results[i]);

            if (sexeDATA.results[i].sexe == "H"){
                 hommeArray.push(parseInt(sexeDATA.results[i].pourcentage));            
        } else {
            femmeArray.push(parseInt(sexeDATA.results[i].pourcentage));
        }
        
    }
    const calculerMoyenne = (array) => {
    if (array.length === 0) {
        return 0; // Retourner 0 si le tableau est vide pour éviter une division par zéro
    }
    const somme = array.reduce((acc, val) => acc + val, 0);
    return somme / array.length;
};

// Exemple d'utilisation avec les tableaux hommeArray et femmeArray
const moyenneHomme = calculerMoyenne(hommeArray);
const moyenneFemme = calculerMoyenne(femmeArray);

// console.log("Moyenne Homme:", moyenneHomme);
// console.log("Moyenne Femme:", moyenneFemme);


const appChartSexe = document.querySelector('#appChartSexe');
const datasSexe = {
    labels: ['Hommes', 'Femmes'],
    datasets: [
        {
            data: [somme(hommeArray), somme(femmeArray)],
            backgroundColor: ['#2DA3A2', '#D68184'],
        }
    ]
};
const options = {
    plugins: {
        legend: true,
        title: {
            display: true,
            text: 'Répartition Hommes/Femmes',
            color: '#31233F',
        }
    }
};
const config = {
    type: 'pie',
    data: datasSexe,
    options: options
};

// Créer le graphique
new Chart(appChartSexe, config);

// Fonction pour calculer la somme d'un tableau
function somme(array) {
    return array.reduce((acc, val) => acc + val, 0);
}



})


fetch(handicapURL)
.then(response => response.json())
.then(handicapDATA => {
    console.log(handicapDATA);

    let totalHandicapArray = [];
    let handicapAnneeArray = [];


    for (let i=0; i<handicapDATA.results.length; i++) {

        if (handicapDATA.results[i].total_epics === null) {
            totalHandicapArray.push(parseInt(handicapDATA.results[i].total));
    } else if (handicapDATA.results[i].total === null) {
        totalHandicapArray.push(parseInt(handicapDATA.results[i].total_epics));
    } else if (handicapDATA.results[i].total_epics || handicapDATA.results[i].total != null) {
         totalHandicapArray.push(parseInt(handicapDATA.results[i].total_epics));
    };

    handicapAnneeArray.push(handicapDATA.results[i].date);
 }

    console.log(totalHandicapArray, handicapAnneeArray);
    
 const appChartHandicap = document.querySelector('#appChartHandicap');
        const datasHandicap = {
            labels: handicapAnneeArray,
            datasets: [
                {
                    label: 'Total des agents en situation de handicap au sein de la SNCF de 2010 a 2021',
                    data: totalHandicapArray,
                    backgroundColor: '#2DA3A2',
                    barThickness: 15, // Largeur des barres
                    group: 'group1' // Groupe pour placer les barres côte à côte
                }
            ]
        };
        const options = {
            plugins: {
                legend: true, // Afficher la légende
                title: {
                    display: true,
                    text: "Nombre d'agents en situation de handicap",
                    color: '#31233F',
                }
            },
            scales: {
                x: {
                    stacked: false, // Ne pas empiler les barres horizontalement
                },
                y: {
                    beginAtZero: true,
                    stacked: false, // Ne pas empiler les barres verticalement
                }
            }
        };
        const config = {
            type: 'bar',
            data: datasHandicap,
            options: options
        };

        // Créer le graphique
        new Chart(appChartHandicap, config);
   
})


  fetch(salaireURL)
  .then(response => response.json())
  .then(salaireDATA => {
    
    let salaireArray = [];
    for (let i=0; i<salaireDATA.results.length; i++) {
        salaireArray.push(salaireDATA.results[i].remuneration_moyenne)
    }
    console.log(salaireArray);
    const moyenne = salaireArray.reduce((acc, val) => acc + val, 0) / salaireArray.length;
    document.querySelector('.indic4').innerHTML = 'La rémunération moyenne des agents de la sncf est de : <span>' + moyenne + '€.</span>';
  })


 fetch(cameraURL)
  .then(response => response.json())
  .then(cameraDATA => {
    let nbrCamerasArray = [];
    for (let i=0; i<cameraDATA.results.length; i++) {
        nbrCamerasArray.push(cameraDATA.results[i].nombre_cameras_gare);
    }

    const premier = nbrCamerasArray[0];
    const dernier = nbrCamerasArray[nbrCamerasArray.length - 1];

    // Calcul du pourcentage d'augmentation
    const pourcentageAugmentation = ((dernier - premier) / premier) * 100;

    document.querySelector('.indic5').innerHTML = 'Depuis 2010, le nombre de caméras en gare a augmenté de <span>' + Math.round(pourcentageAugmentation) + '%</span>, passant de <span>' + nbrCamerasArray[0] + '</span> à <span>' + nbrCamerasArray[nbrCamerasArray.length -1] + ' caméras.</span>';

    console.log(pourcentageAugmentation);
    console.log(nbrCamerasArray);
  })
  .catch(error => {
    console.error('Error fetching camera data:', error);
  });



  });






                //   if (produit.produit.length >85) {
            //     continue;
                
            // };
            
            // // Calculer la moitié de la longueur du texte
            // const moitieLongueur = Math.floor(produit.produit.length / 2);

            // // Insérer la balise <br> à la moitié de la longueur du texte
            // const texteAvecBR = produit.produit.substring(0, moitieLongueur) + "<br>" + produit.produit.substring(moitieLongueur);


            

// fetch(anomaliesURL)
//     .then(response => response.json())
//     .then(anomaliesDATA => {
//         // Créer des tableaux pour stocker les données par ville
//         console.log(anomaliesDATA);
//         let bordeauxArray = [];
//         let poitiersArray = [];
//         let angoulemeArray = [];
//         let anneesArray = [];

//         // Remplir les tableaux avec les données correspondantes
//         for (let i = 0; i < anomaliesDATA.results.length; i++) {
//             const ville = anomaliesDATA.results[i].nom_gare;
//             const nombreAnomalies = parseInt(anomaliesDATA.results[i].nombre_d_observations);
//             const annee = parseInt(anomaliesDATA.results[i].mois);

//             if (!anneesArray.includes(annee)) {
//                 anneesArray.push(annee);
//             }

//             switch (ville) {
//                 case 'Bordeaux Saint-Jean':
//                     bordeauxArray.push(nombreAnomalies);
//                     break;
//                 case 'Poitiers':
//                     poitiersArray.push(nombreAnomalies);
//                     break;
//                 case 'Angoulême':
//                     angoulemeArray.push(nombreAnomalies);
//                     break;
//                 // Ajoutez d'autres villes au besoin
//             }
//         }

//         // Configuration du graphique
//         const ctx = document.querySelector('#appChart');
//         const datas = {
//             labels: anneesArray,
//             datasets: [
//                 {
//                     label: 'Bordeaux',
//                     data: bordeauxArray,
//                     backgroundColor: 'blue',
//                     barThickness: 30, // Largeur des barres
//                     group: 'group1' // Groupe pour placer les barres côte à côte
//                 },
//                 {
//                     label: 'Poitiers',
//                     data: poitiersArray,
//                     backgroundColor: 'green',
//                     barThickness: 30,
//                     group: 'group1'
//                 },
//                 {
//                     label: 'Angoulême',
//                     data: angoulemeArray,
//                     backgroundColor: 'orange',
//                     barThickness: 30,
//                     group: 'group1'
//                 }
//             ]
//         };
//         const options = {
//             plugins: {
//                 legend: true, // Afficher la légende
//                 title: {
//                     display: true,
//                     text: 'Nombre d\'anomalies par année et par ville'
//                 }
//             },
//             scales: {
//                 x: {
//                     stacked: false, // Ne pas empiler les barres horizontalement
//                 },
//                 y: {
//                     beginAtZero: true,
//                     stacked: false, // Ne pas empiler les barres verticalement
//                 }
//             }
//         };
//         const config = {
//             type: 'bar',
//             data: datas,
//             options: options
//         };

//         // Créer le graphique
//         new Chart(ctx, config);
//     })
//     .catch(error => {
//         console.error('Error fetching anomalies:', error);
//     });



        