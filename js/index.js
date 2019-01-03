// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import { elements,renderLoader,clearLoader } from './views/base';
import * as SearchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';

/**
 * Search controller 
 */
const state ={};

const controlSearch = async () =>{

    // 1. get query from the view 
       const query =SearchView.getInput();
       
        //2.create search object 
    if(query){
        state.search = new Search(query);

        try{
                    //3.prepare ui for results 
            
            SearchView.clearInput();
            SearchView.clearResults();
            renderLoader(elements.searchRes);

            //4. search for result 
            await state.search.getResults();

            //5.render outputt to ui
            clearLoader();
            SearchView.getResult(state.search.result);
        } catch(err) {
            alert('some error in search module' + err);
            clearLoader();
        }
    
   
    }

}

elements.searchButton.addEventListener('submit',e =>{
    e.preventDefault();
    controlSearch();
});


elements.resPages.addEventListener('click',e=>{
    const btn = e.target.closest(`.btn-inline`);
    if(btn){
        const goToPage=parseInt(btn.dataset.goto,10);
        console.log(goToPage);
        SearchView.clearResults();
        SearchView.getResult(state.search.result,goToPage);
    }
})

/**
 * Recipe controller 
 */

 const controlRecipe = async () =>{
     const id = window.location.hash.replace('#','');
       
     if(id){
         // prep ui for changes 
         recipeView.clearRecipe();
         renderLoader(elements.recipe);

        // Highlight selected search item
        if (state.search) SearchView.highlightSelected(id);

         //create new recipe 
        state.recipe = new Recipe(id);
        try{
            //get new recipe 
                await state.recipe.getRecipe();
                state.recipe.parseIngredients();

                //calc servings and time 
                state.recipe.calcTime();
                state.recipe.calServings();
            
                //render recipe 
                clearLoader();
                 recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
            );
        } 
        catch(err){
            alert(`error in recipe` +err);
        }

     }
 }
 
 
 
 
 ['hashchange','load'].forEach(element =>window.addEventListener(element,controlRecipe));

/** 
 * LIST CONTROLLER
 */
const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}

// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }
});



/** 
 * LIKE CONTROLLER
 */
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

 // Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});
