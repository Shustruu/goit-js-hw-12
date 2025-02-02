import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '47526493-0201b9f5d9dd403f56de0598a';

export async function serviceImages(question, page = 1, perPage = 15) {
  const { data } = await axios(`${BASE_URL}`, {
    params: {
      key: API_KEY,
      q: question,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: perPage,
    },
  });
  return data;
}
