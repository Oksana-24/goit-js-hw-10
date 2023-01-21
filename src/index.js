import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';;

const DEBOUNCE_DELAY = 300;


const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {

    countryList.innerHTML = '';

    const nameCountry = input.value.trim();

    if (!nameCountry) {
    countryList.innerHTML = ' ';
    return;
  }


    fetchCountries(nameCountry) 
        .then(data => {
            if (data.status === 404) {
                Notify.failure('Oops, there is no country with that name');
                return
            }
            if (data.length > 10) {
                Notify.warning('Too many matches found. Please enter a more specific name.');
                return
            }
            createMarkup(data);
        })
        .catch(error => Notify.warning('Too many matches found. Please enter a more specific name.'))
}

function createMarkup(data) {
    console.log(data)
    if (data.length === 1) {
        const markup = data.map(({
            name: { official: nameCountry },
            flags: { svg },
            capital,
            population,
            languages }) =>
            `<li>
        <h2>Country: ${nameCountry}</h2>
        <img src="${svg}" alt="${nameCountry} width ="300" />
        <h2>Capital: ${capital}</h2>
        <p>Population: ${population}</p>
        <p>Languages: ${languages}</p>
        </li>`
        ).join('');


        countryList.innerHTML = markup;
    }
    if (data.length > 1 && data.length <= 10) {
        const markup = data.map(({
            name: { official: nameCountry },
            flags: { svg } }) =>
            `<h2>Country: ${nameCountry}</h2>
            <img src="${svg}" alt="${nameCountry}" width ="200">`).join('');
        
        countryInfo.innerHTML = markup;
    }
}