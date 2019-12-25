import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
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

      recipeView.clearRecipe();

      renderLoader(elements.recipe);

      //Highlight selected search item

      searchView.highlightSelected(id);

      // Create new Recipe objects;

      state.recipe = new Recipe(id);

      // Get recipe data and parse ingredients

      try{
         await state.recipe.getRecipe();
         // Calculate serving and time

         state.recipe.parseIngredients();

         state.recipe.calcTime();
         state.recipe.calcServings();

         // Render recipe

         console.log(state.recipe);

         cleaerLoader();
         recipeView.renderRecipe(state.recipe);
      }catch(error){
         alert('error processing recipe');
      }
   }
   
};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));


// Handling recipe button clicks

elements.recipe.addEventListener('click', e=>{

   if(e.target.matches('.btn-decrease, .btn-decrease *')){

      // decrease button clicked

      if(state.recipe.servings > 1){
         state.recipe.updateServings('dec');
         recipeView.updateServingsIngredients(state.recipe);
      }

   }else if(e.target.matches('.btn-increase, .btn-increase *')){
      // increase button clicked

      state.recipe.updateServings('inc');

      recipeView.updateServingsIngredients(state.recipe);
   }
});