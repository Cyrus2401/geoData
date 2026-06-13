$('#current-year').text(new Date().getFullYear());

$('#country').on('click', function(){
    $('#home').fadeOut();
    $('#getInfoPart').fadeIn()
    $('#searchTitle').text("Rechercher un pays")
    $('#searchSubtitle').text("Entrez le nom en français ou en anglais")
    $('#validate').data('searchType', 'country');
    $('#inputValue').attr("placeholder", "Ex : Bénin, Belgique, Chine...");
    $('#countryInfoDiv').hide();
    $('#townInfoDiv').hide();
    $('#notFound').hide();
    $('#inputValue').val("");
})

$('#town').on('click', function(){
    $('#home').fadeOut();
    $('#getInfoPart').fadeIn()
    $('#searchTitle').text("Rechercher une ville")
    $('#searchSubtitle').text("Entrez le nom de la ville")
    $('#validate').data('searchType', 'town');
    $('#inputValue').attr("placeholder", "Ex : Paris, Cotonou, Tokyo...");
    $('#countryInfoDiv').hide();
    $('#townInfoDiv').hide();
    $('#notFound').hide();
    $('#inputValue').val("");
}) 

$('#comeBack').on('click', function(){
    $('#home').fadeIn();
    $('#getInfoPart').fadeOut()
}) 

// Lancer la recherche avec la touche Entrée
$('#inputValue').on('keypress', function(e){
    if (e.which === 13) {
        $('#validate').trigger('click')
    }
})

$('#validate').on('click', function(){

    let valueEntered = $('#inputValue').val().trim()
    let valueIsEmpty = false
    let country = ""

    if (valueEntered == null || valueEntered == "") {
        valueIsEmpty = true
        $('#inputValue').css('outline', '2px solid red')
    } else {
        $('#inputValue').css('outline', 'none')
    }

    // ======================= INFO PAYS =======================
    if ($('#validate').data('searchType') === "country") {

        if (!valueIsEmpty) {

            $('#loadDiv').show().css('display', 'flex')
            $('#notFound').hide().css('display', 'none')
            $('#countryInfoDiv').hide()

            getContriesName(capitalizeFirstLetter(valueEntered))
                .then(function(result) {
                    country = result
                    console.log('Pays trouvé:', country)

                    if (!country) {
                        $('#loadDiv').hide()
                        $('#inputValue').val("")
                        $('#notFound').show().css('display', 'flex')
                        $('.typeValue').text("le pays")
                        return
                    }

                    return loadCountriesData().then(function(dataList) {
                        const countryObj = dataList.find(c => c.name.common === country);
                        if (!countryObj) {
                            $('#loadDiv').hide()
                            $('#inputValue').val("")
                            $('#notFound').show().css('display', 'flex')
                            $('.typeValue').text("le pays")
                            return;
                        }

                        const data = [countryObj];
                        console.log(data)

                        $('#loadDiv').hide()
                        $('#notFound').hide().css('display', 'none')
                        $('#countryInfoDiv').show()

                        // --- Variables ---
                        let flagLink = "", flagDesc = "";
                        let countryName = "", capital = "", continent = "", subRegion = "";
                        let population = "", residents = "", language = "", money = "";
                        let neighboringCountries = "", coatOfArmsUrl = "";
                        let googleMapsLink = "", osmLink = "";
                        let area = "", telCode = "", tld = "", timezone = "";
                        let carSide = "", independentStatus = "", unMemberStatus = "";
                        let landlockedStatus = "", startOfWeek = "";
                        let gpsCoords = "", fifaCode = "", giniIndex = "", altSpellings = "";
                        let cca2 = "", cca3 = "";
                        let capitalCoords = "", postalCode = "", density = "";

                        $.each(data, function(k, value) {

                            // Identification
                            flagLink          = value.flags?.svg || value.flags?.png || (value.cca2 ? `https://flagcdn.com/${value.cca2.toLowerCase()}.svg` : '');
                            flagDesc          = value.flags?.alt || (value.cca2 ? `Drapeau de ${value.translations?.fra?.common || value.name?.common || ''}` : '');
                            countryName       = value.translations?.fra?.common || value.name?.common || 'N/A';
                            cca2              = value.cca2 || 'N/A';
                            cca3              = value.cca3 || 'N/A';
                            fifaCode          = value.fifa || 'N/A';
                            independentStatus = value.independent ? 'Oui' : 'Non';
                            unMemberStatus    = value.unMember ? 'Oui' : 'Non';
                            tld               = (value.tld && value.tld.length > 0) ? value.tld.join(', ') : 'N/A';
                            altSpellings      = (value.altSpellings && value.altSpellings.length > 0) ? value.altSpellings.join(', ') : 'N/A';

                            // Géographie
                            $.each(value.continents, function(k, val) {
                                const map = { Africa: 'Afrique', Americas: 'Amériques', Asia: 'Asie', Europe: 'Europe', Oceania: 'Océanie' };
                                continent += (map[val] || 'Antarctique') + ', ';
                            });
                            continent        = continent.replace(/,\s*$/, '') || 'N/A';
                            subRegion        = value.subregion || 'N/A';
                            capital          = (value.capital && value.capital.length > 0) ? value.capital.join(', ') : 'N/A';
                            area             = value.area ? value.area.toLocaleString('fr-FR') + ' km²' : 'N/A';
                            landlockedStatus = value.landlocked ? 'Non (sans accès à la mer)' : 'Oui (accès à la mer)';
                            $.each(value.borders, function(k, val) { neighboringCountries += val + ', '; });
                            neighboringCountries = neighboringCountries.replace(/,\s*$/, '') || 'Aucun';
                            gpsCoords        = value.latlng ? value.latlng[0] + '°, ' + value.latlng[1] + '°' : 'N/A';
                            capitalCoords    = value.capitalInfo?.latlng ? value.capitalInfo.latlng[0] + '°, ' + value.capitalInfo.latlng[1] + '°' : 'N/A';
                            timezone         = (value.timezones && value.timezones.length > 0) ? value.timezones.join(', ') : 'N/A';

                            // Population & Société
                            population = value.population ? value.population.toLocaleString('fr-FR') + ' habitants' : 'N/A';
                            density    = (value.population && value.area) ? (value.population / value.area).toFixed(1) + ' hab/km²' : 'N/A';
                            residents  = (value.demonyms?.fra?.m && value.demonyms?.fra?.f) ? value.demonyms.fra.m + ' / ' + value.demonyms.fra.f : 'N/A';
                            $.each(value.languages, function(k, val) { language += val + ', '; });
                            language = language.replace(/,\s*$/, '') || 'N/A';

                            switch (value.startOfWeek) {
                                case 'monday':    startOfWeek = 'Lundi'; break;
                                case 'tuesday':   startOfWeek = 'Mardi'; break;
                                case 'wednesday': startOfWeek = 'Mercredi'; break;
                                case 'thursday':  startOfWeek = 'Jeudi'; break;
                                case 'friday':    startOfWeek = 'Vendredi'; break;
                                case 'saturday':  startOfWeek = 'Samedi'; break;
                                case 'sunday':    startOfWeek = 'Dimanche'; break;
                                default:          startOfWeek = value.startOfWeek || 'N/A';
                            }

                            // Économie
                            $.each(value.currencies, function(code, val) {
                                money += val.name + (val.symbol ? ' (' + val.symbol + ')' : '') + ', ';
                            });
                            money = money.replace(/,\s*$/, '') || 'N/A';

                            if (value.gini && Object.keys(value.gini).length > 0) {
                                const year = Object.keys(value.gini)[0];
                                giniIndex = value.gini[year] + ' / 100 (relevé en ' + year + ')';
                            } else {
                                giniIndex = 'N/A';
                            }

                            // Infrastructures
                            carSide    = value.car?.side === 'right' ? 'Droite' : (value.car?.side === 'left' ? 'Gauche' : 'N/A');
                            postalCode = value.postalCode?.format ? value.postalCode.format : 'N/A';

                            // Liens & médias
                            coatOfArmsUrl  = value.coatOfArms?.svg || value.coatOfArms?.png || '';
                            googleMapsLink = value.maps?.googleMaps || '#';
                            osmLink        = value.maps?.openStreetMaps || '#';

                            // Téléphonique
                            if (value.idd?.root) {
                                if (value.idd.suffixes && value.idd.suffixes.length > 0) {
                                    $.each(value.idd.suffixes, function(k, d) { telCode += value.idd.root + d + ', '; });
                                    telCode = telCode.replace(/,\s*$/, '');
                                } else {
                                    telCode = value.idd.root;
                                }
                            } else {
                                telCode = 'N/A';
                            }
                        });

                        // Drapeau
                        $('#countryFlag').attr('src', flagLink).attr('alt', flagDesc);

                        // Armoirie
                        if (coatOfArmsUrl) {
                            $('#coatOfArms').attr('src', coatOfArmsUrl).show();
                        } else {
                            $('#coatOfArms').closest('.info-item').hide();
                        }

                        // Identification
                        $('#countryName').text(countryName);
                        $('#cca2').text(cca2);
                        $('#cca3').text(cca3);
                        $('#fifaCode').text(fifaCode);
                        $('#tld').text(tld);
                        $('#altSpellings').text(altSpellings);
                        $('#independentStatus').text(independentStatus);
                        $('#unMemberStatus').text(unMemberStatus);

                        // Géographie
                        $('#continent').text(continent);
                        $('#subRegion').text(subRegion);
                        $('#capital').text(capital);
                        $('#area').text(area);
                        $('#landlockedStatus').text(landlockedStatus);
                        $('#neighboringCountries').text(neighboringCountries);
                        $('#gpsCoords').text(gpsCoords);
                        $('#capitalCoords').text(capitalCoords);
                        $('#timezone').text(timezone);

                        // Population
                        $('#population').text(population);
                        $('#density').text(density);
                        $('#residents').text(residents);
                        $('#language').text(language);
                        $('#startOfWeek').text(startOfWeek);

                        // Économie
                        $('#money').text(money);
                        $('#giniIndex').text(giniIndex);

                        // Infrastructures
                        $('#carSide').text(carSide);
                        $('#postalCode').text(postalCode);

                        // Relations internationales
                        $('#telCode').text(telCode);
                        $('#googleMapsLink').attr('href', googleMapsLink).text(countryName + " sur Google Maps");
                        $('#osmLink').attr('href', osmLink).text(countryName + ' sur Open Street Maps');

                        // Lancer Wikidata en arrière-plan (non bloquant)
                        loadWikidataInfo(cca2, countryName);
                    });
                })
                .catch(function(error) {
                    console.error('Erreur:', error);
                    $('#loadDiv').hide();
                    $('#inputValue').val("");
                    $('#notFound').show().css('display', 'flex');
                    $('.typeValue').text("le service distant (vérifiez votre connexion ou réessayez)");
                });
        }
    }

    // ======================= INFO VILLE =======================
    if ($('#validate').data('searchType') === "town") {  

        if (!valueIsEmpty) {
            $('#loadDiv').show().css('display', 'flex');
            $('#notFound').hide().css('display', 'none');
            $('#countryInfoDiv').hide();
            $('#townInfoDiv').hide();

            // 1. Appel Geocoding (Open-Meteo) pour les coordonnées
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(valueEntered)}&count=1&language=fr&format=json`)
                .then(response => {
                    if (!response.ok) throw new Error("Erreur réseau");
                    return response.json();
                })
                .then(geoData => {
                    if (!geoData || !geoData.results || geoData.results.length === 0) {
                        $('#loadDiv').hide();
                        $('#inputValue').val("");
                        $('#notFound').show().css('display', 'flex');
                        $('.typeValue').text("la ville");
                        return;
                    }

                    const town = geoData.results[0];
                    const lat = town.latitude;
                    const lon = town.longitude;
                    const townName = town.name;
                    const country = town.country || 'N/A';
                    const state = town.admin1 || town.admin2 || 'N/A';
                    
                    // Remplir Identification
                    $('#townName').text(townName);
                    $('#townCountry').text(country);
                    $('#townState').text(state);
                    $('#townCoords').text(parseFloat(lat).toFixed(4) + '°, ' + parseFloat(lon).toFixed(4) + '°');
                    $('#townOsmLink').attr('href', `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lon}#map=12/${lat}/${lon}`);
                    
                    // Reset sections progressives
                    $('#townDescription').text('').addClass('wiki-loading').removeClass('wiki-loaded');
                    $('#townPopulation').text('').addClass('wiki-loading').removeClass('wiki-loaded');
                    $('#townElevation').text('').addClass('wiki-loading').removeClass('wiki-loaded');
                    $('#townTimezone').text('Chargement...');
                    $('#townLocalTime').text('Chargement...');
                    $('#townWikiLinkContainer').hide();
                    $('#townTemp, #townWeather, #townHumidity, #townWind').text('Chargement...');

                    $('#loadDiv').hide();
                    $('#townInfoDiv').show();

                    // 2. Appel Météo (Open-Meteo)
                    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`)
                        .then(res => res.json())
                        .then(weatherData => {
                            if (weatherData && weatherData.current) {
                                const current = weatherData.current;
                                const codes = {
                                    0: "Ciel clair ☀️", 1: "Principalement clair 🌤️", 2: "Partiellement nuageux ⛅", 3: "Couvert ☁️",
                                    45: "Brouillard 🌫️", 48: "Brouillard givrant 🌫️",
                                    51: "Bruine légère 🌧️", 53: "Bruine modérée 🌧️", 55: "Bruine dense 🌧️",
                                    61: "Pluie légère 🌧️", 63: "Pluie modérée 🌧️", 65: "Pluie forte 🌧️",
                                    71: "Neige légère ❄️", 73: "Neige modérée ❄️", 75: "Neige forte ❄️",
                                    95: "Orage ⛈️", 96: "Orage avec grêle ⛈️", 99: "Orage violent ⛈️"
                                };
                                $('#townTemp').text(current.temperature_2m + ' °C');
                                $('#townHumidity').text(current.relative_humidity_2m + ' %');
                                $('#townWind').text(current.wind_speed_10m + ' km/h');
                                $('#townWeather').text(codes[current.weather_code] || 'Inconnu');
                                
                                if (weatherData.timezone) {
                                    try {
                                        const localTime = new Intl.DateTimeFormat('fr-FR', {
                                            timeZone: weatherData.timezone,
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }).format(new Date());
                                        $('#townTimezone').text(weatherData.timezone.replace('_', ' '));
                                        $('#townLocalTime').text(localTime);
                                    } catch(e) {
                                        $('#townTimezone').text(weatherData.timezone.replace('_', ' '));
                                        $('#townLocalTime').text('N/A');
                                    }
                                } else {
                                    $('#townTimezone').text('N/A');
                                    $('#townLocalTime').text('N/A');
                                }
                            }
                        })
                        .catch(() => {
                            $('#townTemp, #townWeather, #townHumidity, #townWind, #townTimezone, #townLocalTime').text('Indisponible');
                        });

                    // 3. Appel Wikipedia pour description et image
                    fetch(`https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(townName)}`)
                        .then(res => res.json())
                        .then(wikiData => {
                            if (wikiData.extract) {
                                $('#townDescription').removeClass('wiki-loading').addClass('wiki-loaded').text(wikiData.extract);
                            } else {
                                $('#townDescription').removeClass('wiki-loading').addClass('wiki-loaded').text("Aucune description disponible.");
                            }
                            
                            if (wikiData.content_urls?.desktop?.page) {
                                $('#townWikiLink').attr('href', wikiData.content_urls.desktop.page);
                                $('#townWikiLinkContainer').show();
                            }
                        })
                        .catch(() => {
                            $('#townDescription').removeClass('wiki-loading').addClass('wiki-loaded').text("Aucune description trouvée sur Wikipedia.");
                        });

                    // 4. Lancer la recherche Wikidata 
                    loadTownWikidata(townName);

                })
                .catch(error => {
                    console.error("Erreur Geocoding:", error);
                    $('#loadDiv').hide();
                    $('#inputValue').val("");
                    $('#notFound').show().css('display', 'flex');
                    $('.typeValue').text("la ville");
                });
        }
    }
}) 


function loadWikidataInfo(cca2, countryNameFr) {

    if (!cca2 || cca2 === 'N/A') return;

    // Réinitialiser & afficher la section avec skeletons
    $('#wikiSection').show();
    $('#wikiAnthemPlayer').hide();
    $('#wikiGovt, #wikiHead, #wikiGov, #wikiReligion, #wikiIndependence, #wikiAnthem')
        .text('').removeClass('wiki-loaded').addClass('wiki-loading');

    const sparql = `
SELECT ?govtLabel ?headLabel ?govLabel ?religionLabel ?anthemLabel ?audio ?independence WHERE {
  ?country wdt:P297 "${cca2}" .
  OPTIONAL { ?country wdt:P122 ?govt }
  OPTIONAL { ?country wdt:P35 ?head }
  OPTIONAL { ?country wdt:P6 ?gov }
  OPTIONAL { ?country wdt:P140 ?religion }
  OPTIONAL {
    ?country wdt:P85 ?anthem .
    OPTIONAL { ?anthem wdt:P51 ?audio }
  }
  OPTIONAL { ?country wdt:P571 ?independence }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "fr,en" }
}
LIMIT 10`;

    $.ajax({
        url: 'https://query.wikidata.org/sparql',
        data: { query: sparql },
        headers: { 'Accept': 'application/sparql-results+json' },
        method: 'GET',
        timeout: 9000
    }).done(function(result) {

        const rows = result.results.bindings;
        if (!rows || rows.length === 0) { $('#wikiSection').hide(); return; }

        // Collecter les valeurs uniques
        const govts   = [...new Set(rows.map(r => r.govtLabel?.value).filter(Boolean))];
        const heads   = [...new Set(rows.map(r => r.headLabel?.value).filter(Boolean))];
        const govs    = [...new Set(rows.map(r => r.govLabel?.value).filter(Boolean))];
        const religs  = [...new Set(rows.map(r => r.religionLabel?.value).filter(Boolean))];
        const anthemRow = rows.find(r => r.anthemLabel?.value);
        const audioRow  = rows.find(r => r.audio?.value);
        const indRow    = rows.find(r => r.independence?.value);

        // Helper : appliquer le texte avec animation
        function wikiSet(id, text) {
            $('#' + id).removeClass('wiki-loading').addClass('wiki-loaded').text(text || 'N/A');
        }

        wikiSet('wikiGovt',       govts.join(' · '));
        wikiSet('wikiHead',       heads.join(', '));
        wikiSet('wikiGov',        govs.join(', '));
        wikiSet('wikiReligion',   religs.join(', '));
        wikiSet('wikiAnthem',     anthemRow?.anthemLabel?.value);

        // Date d'indépendance
        if (indRow?.independence?.value) {
            try {
                const d = new Date(indRow.independence.value);
                const formatted = d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
                wikiSet('wikiIndependence', formatted);
            } catch(e) {
                wikiSet('wikiIndependence', indRow.independence.value.substring(0, 10));
            }
        } else {
            wikiSet('wikiIndependence', 'N/A');
        }

        // Lecteur audio de l'hymne
        if (audioRow?.audio?.value) {
            let audioUrl = audioRow.audio.value;
            // Wikimedia Commons → HTTPS direct
            audioUrl = audioUrl.replace('http://', 'https://');
            $('#wikiAnthemAudio').attr('src', audioUrl);
            $('#wikiAnthemPlayer').show();
        }

    }).fail(function() {
        // Timeout ou erreur → masquer silencieusement la section
        $('#wikiSection').hide();
    });
}

/**
 * Charge la population et l'altitude d'une ville depuis Wikidata
 */
function loadTownWikidata(townName) {
    if (!townName) return;

    const sparql = `
SELECT ?population ?elevation WHERE {
  ?city wdt:P31/wdt:P279* wd:Q515 .
  ?city rdfs:label "${townName}"@fr .
  OPTIONAL { ?city wdt:P1082 ?population }
  OPTIONAL { ?city wdt:P2044 ?elevation }
}
LIMIT 1`;

    $.ajax({
        url: 'https://query.wikidata.org/sparql',
        data: { query: sparql },
        headers: { 'Accept': 'application/sparql-results+json' },
        method: 'GET',
        timeout: 9000
    }).done(function(result) {
        const rows = result.results.bindings;
        if (rows && rows.length > 0 && (rows[0].population || rows[0].elevation)) {
            const pop = rows[0].population?.value;
            const ele = rows[0].elevation?.value;
            
            if (pop) {
                $('#townPopulation').removeClass('wiki-loading').addClass('wiki-loaded').text(parseInt(pop).toLocaleString('fr-FR') + ' habitants');
            } else {
                $('#townPopulation').removeClass('wiki-loading').addClass('wiki-loaded').text('N/A');
            }
            
            if (ele) {
                $('#townElevation').removeClass('wiki-loading').addClass('wiki-loaded').text(ele + ' mètres');
            } else {
                $('#townElevation').removeClass('wiki-loading').addClass('wiki-loaded').text('N/A');
            }
        } else {
            $('#townPopulation, #townElevation').removeClass('wiki-loading').addClass('wiki-loaded').text('N/A');
        }
    }).fail(function() {
        $('#townPopulation, #townElevation').removeClass('wiki-loading').addClass('wiki-loaded').text('N/A');
    });
}
