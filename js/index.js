$('#country').on('click', function(){
    $('#home').fadeOut();
    $('#getInfoPart').fadeIn()
    $('#searchDiv h1').text("Entrer le pays")
    $('#validate').attr('value', 'country')
    $('#countryInfoDiv').hide()
    $('#inputValue').val("")
})

$('#town').on('click', function(){
    $('#home').fadeOut();
    $('#getInfoPart').fadeIn()
    $('#searchDiv h1').text("Entrer la ville")
    $('#validate').attr('value', 'town')
    $('#countryInfoDiv').hide()
    $('#countryInfoDiv').hide()
    $('#inputValue').val("")
}) 

$('#comeBack').on('click', function(){
    $('#home').fadeIn();
    $('#getInfoPart').fadeOut()
}) 


$('#validate').on('click', function(){

    let valueEntered = $('#inputValue').val()
    let valueIsEmpty = false
    let country = ""

    if(valueEntered == null || valueEntered == ""){
        valueIsEmpty = true
        $('#inputValue').css('border', '2px red solid')
    }

    if($(this).val() == "country"){

        if(!valueIsEmpty){

            getContriesName(capitalizeFirstLetter(valueEntered))
                .then(function(result) {
                    country = result
                    console.log(country);
                })
                .catch(function(error) {
                    console.error('Erreur:', error);
                });

            $('#loadDiv').show()
            $('#notFound').hide()
            $('#notFound').css('display', 'none')
            $('#inputValue').css('border', '1px #fff solid')
            $('#countryInfoDiv').hide()
        
            $.ajax({
                type:"GET",
                dataType: "json",
                url:"https://countryapi.io/api/all?apikey=2GyKFzfqhASxOHAnTwmSB7CkQwJ34kxhMSeQcywK",
                success:function(datas)
                {
                    // console.log(datas)
    
                    $.ajax({
                        type:"GET",
                        dataType: "json",
                        url:"https://restcountries.com/v3.1/name/" + country + "?fullText=true",
                        success:function(data)
                        {
                            console.log(data);

                            $('#countryInfoDiv').show()

                            $('#loadDiv').hide()
                            $('#notFound').hide()
                            $('#notFound').css('display', 'none')

                            let flagLink = "";
                            let flagDesc = "";
                            let countryName = "";
                            let capital = "";
                            let continent = "";
                            let subRegion = "";
                            let population = "";
                            let residents = "";
                            let language = "";
                            let money = "";
                            let neighboringCountries = "";
                            let coatOfArms = "";
                            let googleMapsLink = "";
                            let osmLink = "";
                            let area = "";
                            let telCode = "";
                            let tld = "";
                            let timezone = "";

                            $.each(data, function(k, value) {

                                flagLink = value.flags.svg;
                                flagDesc = value.flags.alt;
                                countryName = value.translations?.fra?.common
                                capital = value.capital
                                
                                subRegion = value.subregion
                                population = value.population
                                residents = value.demonyms.fra.f + "/" + value.demonyms.fra.m

                                $.each(value.continents, function(k, value) {

                                    switch (value) {
                                        case 'Africa':
                                            continent += "Afrique, "
                                            break;
    
                                        case 'Americas':
                                            continent += "Amériques, "
                                            break;
    
                                        case 'Asia':
                                            continent += "Asie, "
                                            break;
    
                                        case 'Europe':
                                            continent += "Europe, "
                                            break;
                                        
                                        case 'Oceania':
                                            continent += "Océanie, "
                                            break;
    
                                        default:
                                            continent += "Antarctique, " 
                                    }

                                })

                                $.each(value.languages, function(k, value) {
                                    language += value + ", ";
                                })

                                $.each(value.currencies, function(k, value) {
                                    money += value.name + ", ";
                                })

                                $.each(value.borders, function(k, value) {
                                    neighboringCountries += value + ", ";
                                })

                                $.each(value.idd.suffixes, function(k, d) {
                                    telCode += value.idd.root + d + ", ";
                                })
                                
                                coatOfArms = value.coatOfArms.svg
                                googleMapsLink = value.maps.googleMaps
                                osmLink = value.maps.openStreetMaps
                                area = value.area
                                tld = value.tld
                                timezone = value.timezones

                            });


                            $('#countryFlag').attr('src', flagLink)
                            $('#countryFlag').attr('alt', flagDesc)
                            $('#countryName').text(countryName)
                            $('#capital').text(capital)  
                            $('#continent').text(continent)                        
                            $('#subRegion').text(subRegion)                        
                            $('#population').text("environ " + population + " habitants")                        
                            $('#residents').text(residents)   
                            $('#language').text(language)   
                            $('#money').text(money)   
                            $('#neighboringCountries').text(neighboringCountries)                        
                            $('#coatOfArms').attr('src', coatOfArms)
                            $('#googleMapsLink').attr('href', googleMapsLink)
                            $('#osmLink').attr('href', osmLink)

                            $('#googleMapsLink').text(countryName + " sur google maps")
                            $('#osmLink').text(countryName + ' sur open street maps')
                            $('#area').text("environ " + area + " km2")
                            $('#telCode').text(telCode)   
                            $('#tld').text(tld)                        
                            $('#timezone').text(timezone)                        

                                                
                        },
                        error:function(data)
                        {
                            console.log(data)

                            $('#loadDiv').hide()
                            $('#inputValue').val("")
                            $('#notFound').show()
                            $('#notFound').css('display', 'flex')
                        }
                    });
                },
            });            

        }

    }


    if($(this).val() == "town"){  
    
        if(!valueIsEmpty){

            alert(valueEntered)

        }

    }

}) 

