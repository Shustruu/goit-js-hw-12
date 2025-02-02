import iziToast from 'izitoast'; // Описаний у документації
import 'izitoast/dist/css/iziToast.min.css'; // Додатковий імпорт стилів
import SimpleLightbox from 'simplelightbox'; // Описаний в документації
import 'simplelightbox/dist/simple-lightbox.min.css'; // Додатковий імпорт стилів

import { serviceImages } from './js/pixabay-api';
import { creatGallery } from './js/render-functions';

const form = document.querySelector('.group-form');
const gallery = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const btnLM = document.querySelector('.load-more');

loader.style.display = 'none';
btnLM.style.display = 'none';

let question = '';
let page = 1;
const perPage = 15;

// для ініціалізації модального вікна
const galleryModal = new SimpleLightbox('.gallery a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

// ==============================================

form.addEventListener('submit', handlerSearch);
btnLM.addEventListener('click', onLoadMore);

// ==================================================

function handlerSearch(event) {
  event.preventDefault();

  question = event.target.elements.query.value.trim(); // input world

  gallery.innerHTML = ' ';

  if (!question) {
    iziToast.show({
      backgroundColor: '#EF4040',
      message: `Enter the data for the search!`,
      messageColor: '#FFFFFF',
      position: 'topRight',
    });
    return;
  }

  loader.style.display = 'inline-block';

  serviceImages(question) //promise
    .then(data => {
      if (data.hits.length === 0) {
        iziToast.show({
          title: '',
          backgroundColor: '#EF4040',
          messageColor: '#FFFFFF',
          message: `Sorry, there are no images matching your search query. Please try again!`,
          position: 'topCenter',
        });
      }

      page = 1;

      gallery.insertAdjacentHTML('beforeend', creatGallery(data.hits));
      galleryModal.refresh();
      loader.style.display = 'none';

      if (page * perPage < data.totalHits) {
        btnLM.style.display = 'inline-block';
      }
    })

    .catch(error => {
      console.log(error.message);
    })
    .finally(() => event.target.reset());
}

async function onLoadMore() {
  page += 1;
  btnLM.disabled = true;

  btnLM.style.display = 'none';
  loader.style.display = 'inline-block';

  try {
    const data = await serviceImages(question, page);

    gallery.insertAdjacentHTML('beforeend', creatGallery(data.hits));
    galleryModal.refresh();
    loader.style.display = 'none';

    if (page * perPage >= data.totalHits) {
      btnLM.style.display = 'none';
      iziToast.info({
        message: "We're sorry, but you've reached the end of search results.",
        position: 'bottomCenter',
        timeout: 10000,
      });
    } else {
      btnLM.style.display = 'inline-block';
    }

    // Scroll
    const cardHeight = document
      .querySelector('.gallery-item')
      .getBoundingClientRect().height;
    window.scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });
  } catch (error) {
    alert(error.message);
  } finally {
    btnLM.disabled = false;
  }
}
