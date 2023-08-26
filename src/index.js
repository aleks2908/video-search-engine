// API_KEY = 'AIzaSyBF00erAC4EdZ8w00kV_XCoZCYOi9BN1Zw';
const API_KEY = 'AIzaSyAPrqYl6jMLpAcQWaKeT598TAGW05L0-RY';
const BASE_URL = 'https://www.googleapis.com';

CX = '8581c232ea3c1415f';
// CX = '66691a38336e849bd';  мій
import noPoster from './images/noposter.png';

import axios from 'axios';

const headerForm = document.querySelector('.search-form');
headerForm.addEventListener('submit', fetchVideo);

const paginator = document.querySelector('.paginator');
const bottomBlock = document.querySelector('.bottom-block');
const searchResults = document.querySelector('.search-results');
const googleSearch = document.querySelector('.google-search-form-input');
const onGoogleSearchFormSubmit = document.querySelector('.google-search-form');
// const videoList = document.querySelector('.video-list');
// videoList.addEventListener('click', onVideoListClick);

onGoogleSearchFormSubmit.addEventListener('submit', onGoogleFormSubmit);

function onGoogleFormSubmit(evt) {
  evt.preventDefault();
  googleSearch.value = "I didn't finish here.";
}

const startIndex = 1;

// GET https://www.googleapis.com/customsearch/v1?key=INSERT_YOUR_API_KEY&cx=017576662512468239146:omuauf_lfve&q=lectures

async function fetchVideo(evt) {
  evt.preventDefault();

  searchResults.innerHTML = '';
  bottomBlock.style.display = 'none';
  const keyWord = evt.currentTarget.keyword.value;

  if (!keyWord.trim()) {
    return;
  }

  headerForm.reset();
  localStorage.setItem('keyWord', JSON.stringify(keyWord));
  //   console.log('keyWord: ', keyWord);

  await apiService(1);
}

async function apiService(startIndex) {
  try {
    const keyword = JSON.parse(localStorage.getItem('keyWord'));

    googleSearch.value = `Search ${keyword} on Google`;

    // &sort=interactioncount   videoobject

    const URL = `${BASE_URL}/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${keyword}&start=${startIndex}`;
    // &sort=number-videoobject[0].interactioncount
    const response = await axios.get(URL);

    const items = response.data.items;

    if (!items) {
      searchResults.innerHTML =
        '<b>Nothing was found according to your request.</b>';
      return;
    }

    const previousPage =
      response.data.queries.previousPage?.[0].startIndex || null;

    const nextPage = response.data.queries.nextPage?.[0].startIndex || null;

    if (startIndex === 1 && nextPage) {
      bottomBlock.style.display = 'block';
      paginator.innerHTML = '<button class="nextPage">Next &#129146;</button>';
      const nextPage = document.querySelector('.nextPage');
      nextPage.addEventListener('click', () => apiService(11));
    }

    if (startIndex > 1 && nextPage) {
      paginator.innerHTML = `<button type="button" class="prevPage">&#129144; Prev</button><p class="pageNumber">${
        (startIndex - 1) / 10 + 1
      }</p><button type="button" class="nextPage">Next &#129146;</button>`;

      const prevPageLink = document.querySelector('.prevPage');
      prevPageLink.addEventListener('click', () => apiService(previousPage));

      const nextPageLink = document.querySelector('.nextPage');
      nextPageLink.addEventListener('click', () => apiService(nextPage));
    }

    if (startIndex > 1 && nextPage === null) {
      paginator.innerHTML = `<button type="button" class="prevPage">&#129144; Prev</button>`;
      const prevPageLink = document.querySelector('.prevPage');
      prevPageLink.addEventListener('click', () => apiService(previousPage));
    }

    const markup = items
      // .sort(
      //   (b, a) =>
      //     Number(b.pagemap.videoobject?.[0]?.interactioncount) - Number(a.pagemap.videoobject?.[0]?.interactioncount))
      .map(item => {
        let interactioncount =
          Number(item.pagemap.videoobject?.[0]?.interactioncount) || '';

        if (interactioncount) {
          if (interactioncount > 1000000) {
            interactioncount = `${Number.parseInt(
              interactioncount / 1000000
            )}m views`;
          } else if (interactioncount > 1000) {
            interactioncount = `${Number.parseInt(
              interactioncount / 1000
            )}k views`;
          } else if (interactioncount < 1000) {
            interactioncount += ' views';
          } else {
            interactioncount = 'no data';
          }
        }

        const imgUrl = item.pagemap.cse_image?.[0]?.src || noPoster;

        const resourceLink = item.displayLink;

        const title =
          item.title.length > 45 ? item.title.slice(0, 42) + '...' : item.title;

        const homePage = item.pagemap.person?.[0]?.name || '';

        let time = item.pagemap.videoobject?.[0]?.duration || '';

        let timeToShow = 'block';

        if (!time) {
          timeToShow = 'none';
        }

        if (time) {
          time = item.pagemap.videoobject?.[0]?.duration
            .split('PT')
            .join('')
            .split('S')
            .join('')
            .split('M');

          time = `${time[0]}:${time[1].padStart(2, 0)}`;
        }

        const videoLink = item.pagemap.videoobject?.[0]?.embedurl || item.link;

        return `<li class="card" data-modal-open data-video="${videoLink}">
              <div class="img-wrapper">
              <img class="card_img" loading="lazy" src="${imgUrl}" alt="${title}">
              <p class="clip-time" style="display: ${timeToShow}">${time}</p>
              </div>
              <div class="meta-wrapper">
              <h3 class="card_title">${title}</h3>

              <p class="homePage">${homePage}</p>
              
              <div class="media-wrapper">
              <p class="card_resourceLink">${resourceLink}</p>
              <p class="card_resourceLink interactioncount">${interactioncount}</p>
              </div>

              </div>
              </li>`;
      })
      .join('');

    searchResults.innerHTML = `<ul class="video-list" >${markup}</ul>`;
  } catch (error) {
    console.log(error.message);
  }
}
