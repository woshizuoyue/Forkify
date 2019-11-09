import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import {elements, renderLoader, clearLoader} from './views/base';


/**
 * Global state of the app
 * - search object
 * - current recipe object
 * - shopping list object
 * - Liked recipes
 */

 const state = {};

 /**Search Controller */
 const controlSearch = async () =>{
     // 1. get the query form view
     const query = searchView.getInput();

     if(query){

        // 2. new search object and add to state;

        state.search = new Search(query);

        // 3. prepare UI for results

        searchView.clearInput();

        searchView.clearResults();

        renderLoader(elements.searchRes);
        // 4. search for recipes

        try{
        await state.search.getResult();

        // 5. render results on UI

        clearLoader();

        searchView.renderResults(state.search.result);
        }catch(error){

            alert('something went wrong searching');
            clearLoader();
        }
        
     }
 }

 elements.searchForm.addEventListener('submit', e => {
     
    e.preventDefault();
    controlSearch();
 });

 elements.searchResPages.addEventListener('click', e =>{

   const btn = e.target.closest('.btn-inline');

   if(btn){
      const goToPage = parseInt(btn.dataset.goto, 10);
      searchView.clearResults();
      searchView.renderResults(state.search.result, goToPage);
   }
   
 });
 
 /**
  * Recipe Controller
  */


const controlRecipe = async () =>{

   const id = window.location.hash.replace('#', '');
   console.log(id);

   if(id){

      // Prepare UI for change;

      // Create new Recipe objects;

      state.recipe = new Recipe(id);

      // Get recipe data

      try{
         await state.recipe.getRecipe();
         // Calculate serving and time

         state.recipe.calcTime();
         state.recipe.calcServings();

         // Render recipe

         console.log(state.recipe);
      }catch(error){
         alert('error processing recipe');
      }
   }
   
};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));