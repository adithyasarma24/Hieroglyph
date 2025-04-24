import axios from 'axios';

axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'https://hieroglyph-ai.onrender.com';

export default axios;
