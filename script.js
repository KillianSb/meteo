let ville;

// Gestionnaire d'événement pour le bouton de rafraîchissement
document.getElementById("refreshButton").addEventListener("click", () => {
    location.reload(); // Rafraîchir la page
});

document.getElementById("myForm").addEventListener("submit", (event) => {
    event.preventDefault(); // Empêcher le formulaire de se soumettre normalement

    // Récupérer la valeur du champ "Name" du formulaire et l'assigner à la variable "ville"
    ville = document.getElementById('ville').value;

    console.log(ville);

    // Vérifier quelle radio est cochée
    let radios = document.getElementsByName('choix');
    let choixActif = null;

    for (let radio of radios) {
        if (radio.checked) {
            choixActif = radio.value;
            break;
        }
    }

    // Vérifier la valeur de "ville" dans la console avant de faire la requête fetch
    // Assurez-vous qu'elle contient bien la valeur saisie par l'utilisateur.

    fetch('http://api.openweathermap.org/geo/1.0/direct?q=' + ville + '&limit=1&appid=fa5e2f6483d7b3ab99154e5a550048cb')
        .then(response => response.json())
        .then(json => {
            console.log(json);
            recupDonneesVille(json,choixActif);
        })
        .catch(error => {
            console.error('Erreur lors de la requête fetch:', error);
        });
});

function recupDonneesVille(json,choixActif) {
    // Assurez-vous que cette fonction est correctement définie et qu'elle traite les données de l'API.
    // Par exemple, vous pouvez afficher les données dans la console comme suit :
    let lat = json[0].lat;
    let lon = json[0].lon;
    console.log('Données renvoyées par l\'API lat:', lat);
    console.log('Données renvoyées par l\'API long:', lon);
    console.log('lat + long:', lat, lon);

    // Afficher le message en fonction de la radio cochée
    if (choixActif === 'semaine') {
        console.log("Vous avez choisi l'option 14 jours.");
        recupDonneesMeteoSemaine(lat,lon);
    } else if (choixActif === 'jours') {
        console.log("Vous avez choisi l'option Aujourd'hui.");
        recupDonneesMeteoJour(lat,lon);
    } else {
        console.log("Aucune option n'est sélectionnée.");
    }
}

function recupDonneesMeteoSemaine(lat,lon) {
    fetch('https://api.meteo-concept.com/api/forecast/daily?token=61f6f88c5f9bf719197e27b21fceb37489875e170642015ff9b202e9c9798d45&latlng='+lat+','+lon)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            recupDonneesSemaine(json);
        })
        .catch(error => {
            console.error('Erreur lors de la requête fetch:', error);
        });
}

function recupDonneesMeteoJour(lat,lon) {
    fetch('https://api.meteo-concept.com/api/forecast/daily/0/periods?token=61f6f88c5f9bf719197e27b21fceb37489875e170642015ff9b202e9c9798d45&latlng='+lat+','+lon)
        .then(response => response.json())
        .then(json => {
            console.log(json);
            recupDonneesJour(json);
        })
        .catch(error => {
            console.error('Erreur lors de la requête fetch:', error);
        });
}

function structureHTMLHaut(json){
    let blockMeteo = document.getElementById('blockMeteo');

    let titreVille = document.getElementById('titreVille');
    titreVille.textContent = json.city.name;
}

function recupDonneesJour(json) {

    structureHTMLHaut(json);

    for (let i = 0; i < json.forecast.length; i++) {

        let blockInfos = document.createElement('blockInfos')
        blockInfos.setAttribute('id','blockInfos');
        blockMeteo.appendChild(blockInfos);

        let date = document.createElement('p');
        date.setAttribute('id','date');
        blockInfos.appendChild(date);

        switch (i) {
            case 0:
                date.textContent = "Nuit";
                break;
            case 1:
                date.textContent = "Matin";
                break;
            case 2:
                date.textContent = "Après-Midi";
                break;
            case 3:
                date.textContent = "Soir";
                break;
            default:
                console.log("Jour invalide");
        }

        let tempsTemps = document.createElement('p');
        tempsTemps.setAttribute('id','tempsTemps');
        tempsTemps.textContent = json.forecast[i].weather;
        blockInfos.appendChild(tempsTemps);

        let temps = document.createElement('img');
        temps.setAttribute('id','temps');

        let tempsId = json.forecast[i].weather;

        switch (tempsId) {
            case 0:
                temps.src = "../assets/animated/day.svg";
                break;
            case 1:
                temps.src = "../assets/animated/cloudy-day-1.svg";
                break;
            case 2:
                temps.src = "../assets/animated/cloudy-day-2.svg";
                break;
            case 3:
                temps.src = "../assets/animated/cloudy-day-3.svg";
                break;
            case 4:
            case 5:
                temps.src = "../assets/animated/cloudy.svg";
                break;
            case 6:
                temps.src = "../assets/static/svg/wi-day-fog.svg";
                break;
            case 10:
            case 40:
            case 41:
            case 43:
            case 140:
            case 210:
                temps.src = "../assets/animated/rainy-4.svg";
                break;
            case 42:
            case 45:
            case 212:
                temps.src = "../assets/animated/rainy-6.svg";
                break;
            case 44:
            case 47:
            case 211:
                temps.src = "../assets/animated/rainy-5.svg";
                break;
            default:
                console.log("Jour invalide");
        }
        blockInfos.appendChild(temps);

        let temp = document.createElement('p');
        temp.setAttribute('id','temp');
        temp.textContent = "Temperature : " + json.forecast[i].temp2m + "°C";
        blockInfos.appendChild(temp);

        if (json.forecast[i].tmax < 0) {
            temp.style.color = "blue";
        } else if (json.forecast[i].temp2m >= 0 && json.forecast[i].temp2m < 22) {
            temp.style.color = "green";
        } else if (json.forecast[i].temp2m >= 22 && json.forecast[i].temp2m < 27) {
            temp.style.color = "orange";
        } else if (json.forecast[i].temp2m >= 27) {
            temp.style.color = "red";
        }

        let vent = document.createElement('p');
        vent.setAttribute('id','wind10m');
        vent.textContent = "Vent moyen : " + json.forecast[i].wind10m + "km/h";
        blockInfos.appendChild(vent);

        let rafaleMax = document.createElement('p');
        rafaleMax.setAttribute('id','wind10m');
        rafaleMax.textContent = "Rafale de vent potentielle Max: " + json.forecast[i].gustx + "km/h";
        blockInfos.appendChild(rafaleMax);

        let probaPluit = document.createElement('p');
        probaPluit.setAttribute('id','probaPluit');
        probaPluit.textContent = "Probabilité pluit : " + json.forecast[i].probarain + "%";
        blockInfos.appendChild(probaPluit);

        let pluitMm = document.createElement('p');
        pluitMm.setAttribute('id','pluitMm');
        pluitMm.textContent = "Cumul de pluie sur la journée : " + json.forecast[i].rr10 + "mm";
        blockInfos.appendChild(pluitMm);

        let pluitMmMax = document.createElement('p');
        pluitMmMax.setAttribute('id','pluitMmMax');
        pluitMmMax.textContent = "Cumul de pluie maximal : " + json.forecast[i].rr1 + "mm";
        blockInfos.appendChild(pluitMmMax);
    }
}

function recupDonneesSemaine(json) {

    structureHTMLHaut(json);

    for (let i = 0; i < json.forecast.length; i++) {

        let blockInfos = document.createElement('blockInfos')
        blockInfos.setAttribute('id','blockInfos');
        blockMeteo.appendChild(blockInfos);

        // ----------------------------------------------------------------------
        // Farmat date
        // ----------------------------------------------------------------------

        let dateString = json.forecast[i].datetime;

        // Convertir la chaîne de caractères en objet Date JavaScript
        const dateObj = new Date(dateString);

        // Fonction pour obtenir le jour de la semaine au format 'Lundi', 'Mardi', ...
        function getDayOfWeek(date) {
            const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
            return days[date.getDay()];
        }

        // Fonction pour formater l'heure au format 'hh:mm'
/*        function formatTime(date) {
            let hours = date.getHours().toString().padStart(2, "0");
            let minutes = date.getMinutes().toString().padStart(2, "0");
            return `${hours}:${minutes}`;
        }*/

        // Fonction pour obtenir le numéro du jour du mois
        function getDayOfMonth(date) {
            return date.getDate();
        }

        // Fonction pour obtenir le numéro du mois (de 0 à 11, où 0 correspond à janvier)
        function getMonthNumber(date) {
            return date.getMonth() + 1;
        }

        // Obtenir le jour de la semaine, le numéro du jour du mois, le numéro du mois et l'heure formatée à partir de l'objet Date
        const dayOfWeek = getDayOfWeek(dateObj);
        const dayOfMonth = getDayOfMonth(dateObj);
        const monthNumber = getMonthNumber(dateObj);
        /*const formattedTime = formatTime(dateObj);*/

        // Afficher le jour de la semaine, le numéro du jour du mois, le numéro du mois et l'heure
/*        console.log(`Jour de la semaine : ${dayOfWeek}`);
        console.log(`Numéro du jour du mois : ${dayOfMonth}`);
        console.log(`Numéro du mois : ${monthNumber}`);
        console.log(`Heure : ${formattedTime}`);*/

        // ----------------------------------------------------------------------

        let date = document.createElement('p');
        date.setAttribute('id','date');
        if (i === 0) {
            date.textContent = "Aujourd'hui";
        } else {
            date.textContent = dayOfWeek + " " + dayOfMonth + "/" + monthNumber;
        }
        blockInfos.appendChild(date);

        let tempsTemps = document.createElement('p');
        tempsTemps.setAttribute('id','tempsTempsId');
        tempsTemps.textContent = json.forecast[i].weather;
        blockInfos.appendChild(tempsTemps);

        let temps = document.createElement('img');
        temps.setAttribute('id','temps');

        let tempsId = json.forecast[i].weather;

        let detailTemps = document.createElement('p');
        detailTemps.setAttribute('id','tempsTemps');
        let detailTempsText = getWeatherText(tempsId);
        detailTemps.textContent = detailTempsText;

        switch (tempsId) {
            case 0:
                temps.src = "../assets/animated/day.svg";
                break;
            case 1:
                temps.src = "../assets/animated/cloudy-day-1.svg";
                break;
            case 2:
                temps.src = "../assets/animated/cloudy-day-2.svg";
                break;
            case 3:
                temps.src = "../assets/animated/cloudy-day-3.svg";
                break;
            case 4:
            case 5:
                temps.src = "../assets/animated/cloudy.svg";
                break;
            case 6:
                temps.src = "../assets/static/svg/wi-day-fog.svg";
                break;
            case 10:
            case 40:
            case 41:
            case 43:
            case 140:
            case 210:
                temps.src = "../assets/animated/rainy-4.svg";
                break;
            case 42:
            case 45:
            case 212:
                temps.src = "../assets/animated/rainy-6.svg";
                break;
            case 44:
            case 47:
            case 211:
                temps.src = "../assets/animated/rainy-5.svg";
                break;
            default:
                console.log("Jour invalide");
        }
        blockInfos.appendChild(temps);
        blockInfos.appendChild(detailTemps);

        let tempMax = document.createElement('p');
        tempMax.setAttribute('id','tempMax');
        tempMax.textContent = "Temperature Max : " + json.forecast[i].tmax + "°C";
        blockInfos.appendChild(tempMax);

        if (json.forecast[i].tmax < 0) {
            tempMax.style.color = "blue";
        } else if (json.forecast[i].tmax >= 0 && json.forecast[i].tmin < 22) {
            tempMax.style.color = "green";
        } else if (json.forecast[i].tmax >= 22 && json.forecast[i].tmin < 27) {
                tempMax.style.color = "orange";
        } else if (json.forecast[i].tmax >= 27) {
            tempMax.style.color = "red";
        }

        let tempMin = document.createElement('p');
        tempMin.setAttribute('id','tempMin');
        tempMin.textContent = "Temperature Min : " + json.forecast[i].tmin + "°C";
        blockInfos.appendChild(tempMin);

        if (json.forecast[i].tmin < 0) {
            tempMin.style.color = "blue";
        } else if (json.forecast[i].tmin >= 0 && json.forecast[i].tmin < 22) {
            tempMin.style.color = "green";
        } else if (json.forecast[i].tmin >= 22 && json.forecast[i].tmin < 27) {
            tempMin.style.color = "orange";
        } else if (json.forecast[i].tmin >= 27) {
            tempMin.style.color = "red";
        }

        let vent = document.createElement('p');
        vent.setAttribute('id','wind10m');
        vent.textContent = "Vent moyen : " + json.forecast[i].wind10m + "km/h";
        blockInfos.appendChild(vent);

        let rafaleMax = document.createElement('p');
        rafaleMax.setAttribute('id','wind10m');
        rafaleMax.textContent = "Rafale de vent potentielle Max: " + json.forecast[i].gustx + "km/h";
        blockInfos.appendChild(rafaleMax);

        let probaPluit = document.createElement('p');
        probaPluit.setAttribute('id','probaPluit');
        probaPluit.textContent = "Probabilité pluit : " + json.forecast[i].probarain + "%";
        blockInfos.appendChild(probaPluit);

        let pluitMm = document.createElement('p');
        pluitMm.setAttribute('id','pluitMm');
        pluitMm.textContent = "Cumul de pluie sur la journée : " + json.forecast[i].rr10 + "mm";
        blockInfos.appendChild(pluitMm);

        let pluitMmMax = document.createElement('p');
        pluitMmMax.setAttribute('id','pluitMmMax');
        pluitMmMax.textContent = "Cumul de pluie maximal : " + json.forecast[i].rr1 + "mm";
        blockInfos.appendChild(pluitMmMax);

        let maxSoleil = document.createElement('p');
        maxSoleil.setAttribute('id','pluitMmMax');
        maxSoleil.textContent = "Ensoleillement : " + json.forecast[i].sun_hours + "h";
        blockInfos.appendChild(maxSoleil);
    }

    function getIconToId(tempsId) {
        switch (tempsId) {
            case 0:
                temps.src = "../assets/animated/day.svg";
                break;
            case 1:
                temps.src = "../assets/animated/cloudy-day-1.svg";
                break;
            case 2:
                temps.src = "../assets/animated/cloudy-day-2.svg";
                break;
            case 3:
                temps.src = "../assets/animated/cloudy-day-3.svg";
                break;
            case 4:
            case 5:
                temps.src = "../assets/animated/cloudy.svg";
                break;
            case 6:
                temps.src = "../assets/static/svg/wi-day-fog.svg";
                break;
            case 10:
            case 40:
            case 41:
            case 43:
            case 140:
            case 210:
                temps.src = "../assets/animated/rainy-4.svg";
                break;
            case 42:
            case 45:
            case 212:
                temps.src = "../assets/animated/rainy-6.svg";
                break;
            case 44:
            case 47:
            case 211:
                temps.src = "../assets/animated/rainy-5.svg";
                break;
            default:
                console.log("Jour invalide");
        }
    }

    function getWeatherText(tempsId) {
        const WEATHER = {
            0: "Soleil",
            1: "Peu nuageux",
            2: "Ciel voilé",
            3: "Nuageux",
            4: "Très nuageux",
            5: "Couvert",
            6: "Brouillard",
            7: "Brouillard givrant",
            10: "Pluie faible",
            11: "Pluie modérée",
            12: "Pluie forte",
            13: "Pluie faible verglaçante",
            14: "Pluie modérée verglaçante",
            15: "Pluie forte verglaçante",
            16: "Bruine",
            20: "Neige faible",
            21: "Neige modérée",
            22: "Neige forte",
            30: "Pluie et neige mêlées faibles",
            31: "Pluie et neige mêlées modérées",
            32: "Pluie et neige mêlées fortes",
            40: "Averses de pluie locales et faibles",
            41: "Averses de pluie locales",
            42: "Averses locales et fortes",
            43: "Averses de pluie faibles",
            44: "Averses de pluie",
            45: "Averses de pluie fortes",
            46: "Averses de pluie faibles et fréquentes",
            47: "Averses de pluie fréquentes",
            48: "Averses de pluie fortes et fréquentes",
            60: "Averses de neige localisées et faibles",
            61: "Averses de neige localisées",
            62: "Averses de neige localisées et fortes",
            63: "Averses de neige faibles",
            64: "Averses de neige",
            65: "Averses de neige fortes",
            66: "Averses de neige faibles et fréquentes",
            67: "Averses de neige fréquentes",
            68: "Averses de neige fortes et fréquentes",
            70: "Averses de pluie et neige mêlées localisées et faibles",
            71: "Averses de pluie et neige mêlées localisées",
            72: "Averses de pluie et neige mêlées localisées et fortes",
            73: "Averses de pluie et neige mêlées faibles",
            74: "Averses de pluie et neige mêlées",
            75: "Averses de pluie et neige mêlées fortes",
            76: "Averses de pluie et neige mêlées faibles et nombreuses",
            77: "Averses de pluie et neige mêlées fréquentes",
            78: "Averses de pluie et neige mêlées fortes et fréquentes",
            100: "Orages faibles et locaux",
            101: "Orages locaux",
            102: "Orages fort et locaux",
            103: "Orages faibles",
            104: "Orages",
            105: "Orages forts",
            106: "Orages faibles et fréquents",
            107: "Orages fréquents",
            108: "Orages forts et fréquents",
            120: "Orages faibles et locaux de neige ou grésil",
            121: "Orages locaux de neige ou grésil",
            122: "Orages locaux de neige ou grésil",
            123: "Orages faibles de neige ou grésil",
            124: "Orages de neige ou grésil",
            125: "Orages de neige ou grésil",
            126: "Orages faibles et fréquents de neige ou grésil",
            127: "Orages fréquents de neige ou grésil",
            128: "Orages fréquents de neige ou grésil",
            130: "Orages faibles et locaux de pluie et neige mêlées ou grésil",
            131: "Orages locaux",
            131: "Orages locaux de pluie et neige mêlées ou grésil",
            132: "Orages fort et locaux de pluie et neige mêlées ou grésil",
            133: "Orages faibles de pluie et neige mêlées ou grésil",
            134: "Orages de pluie et neige mêlées ou grésil",
            135: "Orages forts de pluie et neige mêlées ou grésil",
            136: "Orages faibles et fréquents de pluie et neige mêlées ou grésil",
            137: "Orages fréquents de pluie et neige mêlées ou grésil",
            138: "Orages forts et fréquents de pluie et neige mêlées ou grésil",
            140: "Pluies orageuses",
            141: "Pluie et neige mêlées à caractère orageux",
            142: "Neige à caractère orageux",
            210: "Pluie faible intermittente",
            211: "Pluie modérée intermittente",
            212: "Pluie forte intermittente",
            220: "Neige faible intermittente",
            221: "Neige modérée intermittente",
            222: "Neige forte intermittente",
            230: "Pluie et neige mêlées",
            231: "Pluie et neige mêlées",
            232: "Pluie et neige mêlées",
            235: "Averses de grêle"
        }
        return WEATHER[tempsId];
    }
}

// Meteo prévision
