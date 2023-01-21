import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';;

const DEBOUNCE_DELAY = 300;


const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
// const countryInfo = document.querySelector('.country-info');

input.addEventListener('input', debounce(onSearchCountry, DEBOUNCE_DELAY));

function onSearchCountry(event) {
    const nameCountry = input.value.trim();

    if (!nameCountry) {
        countryList.innerHTML = '';
        return
    }

        fetchCountries(nameCountry)
        .then(data => {
            if (data.length > 10) {
                Notify.warning('Too many matches found. Please enter a more specific name.');
                return
            }
            createMarkup(data);
        })
        .catch(error => {
            if (error.name === 'Error') {
                Notify.failure('Oops, there is no country with that name');
                return
            }
            })
    
}

function createMarkup(data) {
    console.log("DATA",data)
    if (data.length === 1) {
        const markup = data.map(({
            name: { official: nameCountry },
            flags: { svg },
            capital,
            population,
            languages }) => {
            const language = Object.values(languages);
            console.log(language)
            return `<li>
        <div class="country-box">
        <img class="country-img" src="${svg}" alt="${nameCountry} width="150" height="150" />
        <h2 class="country-box__title unique">${nameCountry}</h2>
        </div>
        <h2>Capital: ${capital}</h2>
        <p>Population: ${population}</p>
        <p>Languages: ${language}</p>
        </li>`
        } ).join('');


        countryList.innerHTML = markup;
    }
    if (data.length > 1 && data.length <= 10) {
        const markup = data.map(({
            name: { official: nameCountry },
            flags: { svg } }) =>
            `<div class="country-box">
            <img class="country-box__img"src="${svg}" alt="${nameCountry}" width ="150"  >
            <h2 class="country-box__title"> ${nameCountry}</h2>
            </div>`).join('');

        countryList.innerHTML = markup;
    }
}