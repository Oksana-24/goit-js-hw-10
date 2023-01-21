
function fetchCountries(name) {
    return response= fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages`)
        .then(response => {
            if (!response.status) {
                throw new Error(response.statusText);
            }
            return response.json();
    })
    
}

export {
    fetchCountries
}