// URL de l'API RestCountries
const apiUrl = 'https://restcountries.com/v3.1/all';

function getContriesName(country) {
    return $.ajax({
        url: apiUrl,
        method: 'GET',
        dataType: 'json'
    }).then(function (countriesDatas) {
        const countries = [];

        // Parcourt les données reçues
        $.each(countriesDatas, function (_, data) {
            const countryEnglishName = data.name.common; 
            const countryFrenchName = data.translations?.fra?.common || 'Nom français indisponible'; 
            
            // Ajoute les noms anglais et français à la liste
            countries.push({ [countryEnglishName]: countryFrenchName });
        });

        console.log(countries);

        let result = null;

        // Recherche si le pays existe dans les données
        $.each(countries, function (_, entry) {
            const [key, value] = Object.entries(entry)[0];

            if (key === country) {
                result = key;
                return false; // Stoppe la boucle
            }

            if (value === country) {
                result = key;
                return false; // Stoppe la boucle
            }
        });

        return result;

    }).catch(function (error) {
        console.error('Erreur lors de l\'obtention des noms des pays :', error);
        throw error;
    });
}


function capitalizeFirstLetter(string) {
    if (string && typeof string === 'string') {

        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();

    }
    return string; 
}
