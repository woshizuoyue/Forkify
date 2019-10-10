// api key: 582bc5bce9cf9db59d3c89a0bfe19bf7
// search query: https://www.food2fork.com/api/search

import Search from './models/Search';

const search = new Search('cookies');

console.log(search);

search.getResult();