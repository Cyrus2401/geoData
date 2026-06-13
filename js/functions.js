function loadCountriesData() {
    return Promise.resolve(typeof countriesDataStore !== 'undefined' ? countriesDataStore : []);
}

/**
 * Normalise un texte : retire les accents pour la recherche de fallback
 */
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getContriesName(country) {
    return loadCountriesData()
        .then(function(data) {
            if (!data || !Array.isArray(data)) return null;

            const query = country.trim().toLowerCase();
            const queryNorm = removeAccents(query);

            // Helper to check if a name matches
            function matches(nameObj) {
                if (!nameObj) return false;
                if (nameObj.common && removeAccents(nameObj.common.toLowerCase()) === queryNorm) return true;
                if (nameObj.official && removeAccents(nameObj.official.toLowerCase()) === queryNorm) return true;
                return false;
            }

            // 1. Search in translations
            for (let c of data) {
                if (c.translations) {
                    for (let lang in c.translations) {
                        if (matches(c.translations[lang])) {
                            return c.name.common;
                        }
                    }
                }
            }

            // 2. Search in common/official names and native names
            for (let c of data) {
                if (matches(c.name)) {
                    return c.name.common;
                }
                if (c.name.native) {
                    for (let lang in c.name.native) {
                        if (matches(c.name.native[lang])) {
                            return c.name.common;
                        }
                    }
                }
            }

            // 3. Search in altSpellings
            for (let c of data) {
                if (c.altSpellings) {
                    for (let alt of c.altSpellings) {
                        if (removeAccents(alt.toLowerCase()) === queryNorm) {
                            return c.name.common;
                        }
                    }
                }
            }

            return null;
        })
        .catch(function(err) {
            console.error("Error loading or processing countries database:", err);
            return null;
        });
}


function capitalizeFirstLetter(string) {
    if (string && typeof string === 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
}
