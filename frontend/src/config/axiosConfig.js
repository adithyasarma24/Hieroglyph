import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://hieroglyph-api.onrender.com';

export default axios;
