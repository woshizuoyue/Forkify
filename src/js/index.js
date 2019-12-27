import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Like from './models/Like'
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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

         cleaerLoader();
         recipeView.renderRecipe(
            state.recipe,
            state.likes.isLike(id),
            );
      }catch(error){
         alert('error processing recipe');
      }
   }
   
};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
  * Recipe Controller
  */
 const controlList = () =>{

   // create a new list if there is none yet

   if(!state.list) state.list = new List();

   // add each ingredient to the list and UI

   state.recipe.ingredient.forEach(el=>{

      const item = state.list.addItem(el.count, el.unit, el.ingredient);

      listView.renderItem(item);
   });
}

// Handle delete and update list item events

elements.shopping.addEventListener('click',el=>{
   const id = e.target.closest('.shopping__item').dataset.itemid;

   // handle delete button

   if(e.target.matches('.shopping__delete, .shopping__delete *')){

      //delete from state

      state.list.deleteItem(id);

      //delete from UI

      listView.deleteItem(id);

      //handle count update
   }else if(e.target.matches('.shopping__count-value')){
      const val = parseFloat(e.target.value,10);
      state.list.updateCount(id, val);
   }
});

/**
  * Like Controller
  */

const controlLike = () =>{
   if(!state.likes) state.likes = new Like();
   const currentID = state.recipe.id;

   // user has not yet liked current recipe;
   if(!state.likes.isLike(currentID)){

      // add to the state

      const newLike = state.likes.addLike(

         currentID,
         state.recipe.title,
         state.recipe.author,
         state.recipe.img
      );

      // toggle the like button

      likesView.toggleLikeBtn(true);

      // add like to UI list

      likesView.renderLike(newLike);

      //user has liked current recipe;
   }else{

      // remove like from the state

      state.likes.deleteLike(currentID);
      // toggle the like button

      likesView.toggleLikeBtn(false);

      // remove like from UI list

      likesView.deleteLike(currentID);

   }

   likesView.toggleLikeMenu(state.likes.getNumLikes());
}

// restore liked recipes on page load

window.addEventListener('load', () =>{

   state.likes = new Like();
   
   // restore likes
   state.likes.readStorage();

   // toggle like menu button
   likesView.toggleLikeMenu(state.likes.getNumLikes());

   // render the existing likes 

   state.likes.likes.forEach(like => likes.likesView.renderLike(like));
});

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
   }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
      
      //add ingredient to shopping list
      controlList();
   }else if(e.target.matches('.recipe__love, .recipe__love *')){

      // like controller

      controlLike();
   }
});