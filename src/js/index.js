import * as base from "./views/base";
import list from "./models/list";
import Search from "./models/Search";
import Recipe from "./models/Recipe";
import Likes from "./models/Likes";
import * as listView from "./views/listView";
import * as searchView from "./views/searchView";
import * as reipeView from "./views/recipeView";
import * as likesView from "./views/likesView";

//global state of app
const state = {};

const controlSearch = async () => {
   //1.get query from view
   const query = searchView.getInput();

   if (query) {
      //2.find the recipe in api
      state.search = new Search(query);

      //3.clear the u.i

      searchView.clearInput();

      searchView.clearResults();

      base.renderLoader(base.elements.searchRes);

      //4.get the recipes from api

      await state.search.getResult();

      //5.show the result
      base.clearLoader();

      searchView.renderResults(state.search.result);
   }
};

base.elements.searchForm.addEventListener("click", (e) => {
   e.preventDefault();
   controlSearch();
});

base.elements.searchresPages.addEventListener("click", (e) => {
   const btn = e.target.closest(".btn-inline");
   if (btn) {
      searchView.clearResults();
      const gotoPage = parseInt(btn.dataset.goto);
      searchView.renderResults(state.search.result, gotoPage);
   }
});

const controlRecipe = async () => {
   const id = window.location.hash.replace("#", "");

   if (id) {
      base.renderLoader(base.elements.recipe);

      if (state.search) {
         searchView.linkHighlght(id);
      }

      state.recipe = new Recipe(id);

      reipeView.clearRecipe();

      try {
         await state.recipe.getRecipe();

         state.recipe.calcServings();

         state.recipe.calcTime();

         state.recipe.parseIngredents();

         base.clearLoader();

         reipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
      } catch (e) {
         alert("error loading recipe");
      }
   }
};

const controlList = () => {
   base.elements.shopping.innerHTML = "";
   if (!state.list) {
      state.list = new list();
   }
   state.recipe.ingredents.forEach((el) => {
      const item = state.list.addItem(el.count, el.unit, el.ingredent);
      listView.renderItem(item);
   });
};

base.elements.shopping.addEventListener("click", (e) => {
   const id = e.target.closest(".shopping__item").dataset.itemid;

   if (e.target.matches(".shopping__delete,.shopping__delete *")) {
      state.list.deleteItem(id);

      listView.deleteItem(id);
   }
});

const controlLike = () => {
   if (!state.likes) state.likes = new Likes();
   const currentID = state.recipe.id;

   if (!state.likes.isLiked(currentID)) {
      const newLike = state.likes.addLike(
         currentID,
         state.recipe.title,
         state.recipe.publisher,
         state.recipe.img
      );

      likesView.toggleLikeBtn(true);

      likesView.renderLike(newLike);
   } else {
      state.likes.deleteLike(currentID);

      likesView.toggleLikeBtn(false);

      likesView.deleteLike(currentID);
   }
   likesView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener("load", () => {
   state.likes = new Likes();

   // Restore likes
   state.likes.readStorage();

   // Toggle like menu button
   likesView.toggleLikeMenu(state.likes.getNumLikes());

   // Render the existing likes
   state.likes.likes.forEach((like) => likesView.renderLike(like));
});

window.addEventListener("hashchange", controlRecipe);
window.addEventListener("load", controlRecipe);

base.elements.recipe.addEventListener("click", (e) => {
   if (e.target.matches(".btn-dec, .btn-dec *")) {
      if (state.recipe.servings > 2) {
         state.recipe.updateServings("dec");
         reipeView.clearRecipe();
         reipeView.renderRecipe(state.recipe);
      }
   } else if (e.target.matches(".btn-inc, .btn-inc *")) {
      if (state.recipe.servings < 20) {
         state.recipe.updateServings("inc");
         reipeView.clearRecipe();
         reipeView.renderRecipe(state.recipe);
      }
   } else if (e.target.matches(".ingredents__add, .ingredents__add *")) {
      controlList();
   } else if (e.target.matches(".recipe__love, .recipe__love *")) {
      controlLike();
      console.log(state.likes);
   }
});
