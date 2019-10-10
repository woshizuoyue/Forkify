// api key: 582bc5bce9cf9db59d3c89a0bfe19bf7
// search query: https://www.food2fork.com/api/search

import Search from './models/Search';

/**
 * Global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - Liked recipes
 */

 const state = {};

 const controlSearch = async () =>{
     // 1. get the query form view
     const query = 'cookies' // todo

     if(query){

        // 2. new search object and add to state;

        state.search = new Search(query);

        // 3. prepare UI for results


        // 4. search for recipes

        await state.search.getResult();

        // 5. render results on UI

        console.log(state.search.result);

     }
 }

 document.querySelector('.search').addEventListener('submit', e => {
     
    e.preventDefault();
    controlSearch();
 });