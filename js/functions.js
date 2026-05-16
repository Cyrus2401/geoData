/**
 * Normalise un texte : retire les accents pour la recherche de fallback
 */
function removeAccents(str) {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function getContriesName(country) {
    const encoded = encodeURIComponent(country);

    return $.ajax({ url: 'https://restcountries.com/v3.1/translation/' + encoded, method: 'GET', dataType: 'json' })
        .then(function(data) {
            if (data && data.length > 0) return data[0].name.common;
            return null;
        })
        .catch(function() {
            return $.ajax({ url: 'https://restcountries.com/v3.1/name/' + encoded, method: 'GET', dataType: 'json' })
                .then(function(data) {
                    if (data && data.length > 0) return data[0].name.common;
                    return null;
                })
                .catch(function() {
                    const normalized = removeAccents(country);
                    if (normalized === country) return null;

                    const encodedNorm = encodeURIComponent(normalized);
                    return $.ajax({ url: 'https://restcountries.com/v3.1/translation/' + encodedNorm, method: 'GET', dataType: 'json' })
                        .then(function(data) {
                            if (data && data.length > 0) return data[0].name.common;
                            return null;
                        })
                        .catch(function() {
                            return $.ajax({ url: 'https://restcountries.com/v3.1/name/' + encodedNorm, method: 'GET', dataType: 'json' })
                                .then(function(data) {
                                    if (data && data.length > 0) return data[0].name.common;
                                    return null;
                                })
                                .catch(function() { return null; });
                        });
                });
        });
}

function capitalizeFirstLetter(string) {
    if (string && typeof string === 'string') {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    return string;
}
