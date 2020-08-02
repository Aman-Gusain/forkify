import { elements } from "./base";

export const getInput = () => elements.searchInput.value;

export const clearInput = () => {
  elements.searchInput.value = "";
};

export const clearResults = () => {
  elements.searchResultlist.innerHTML = "";
  elements.searchresPages.innerHTML = "";
};

export const reduceName = (title, max_length = 17) => {
  const new_title = [];
  if (title.length > max_length) {
    title.split(" ").reduce((acc, curr) => {
      if (acc + curr.length < 17) {
        new_title.push(curr);
      }
      return acc + curr.length;
    }, 0);
    return `${new_title.join(" ")}...)`;
  }
  return title;
};

const createButton = (page, type) =>
  `
        <button class="btn-inline results__btn--${type}" data-goto=${
    type == "prev" ? page - 1 : page + 1
  }>
        <span> page ${type == "prev" ? page - 1 : page + 1}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${
                  type == "prev" ? "left" : "right"
                }"></use>
            </svg>
        </button>
    `;

const changePage = (page, totalRecipe, resperPage) => {
  const totalPage = Math.ceil(totalRecipe / resperPage);
  let button;
  if (page == 1 && totalPage > 1) {
    button = createButton(page, "next");
  } else if (page == totalPage && totalPage > 1) {
    button = createButton(page, "prev");
  } else {
    button = `${createButton(page, "prev")}
            ${createButton(page, "next")}`;
  }
  elements.searchresPages.insertAdjacentHTML("afterbegin", button);
};

export const linkHighlght = (id) => {
  const resultsArr = Array.from(document.querySelectorAll(".results__link"));
  resultsArr.forEach((el) => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

const renderRecipe = (recipe) => {
  const new_title = reduceName(recipe.title);
  const markup = `
            <li>
                <a class="results__link" href="#${recipe.recipe_id}">
                    <figure class="results__fig">
                        <img src="${recipe.image_url}" alt="${recipe.title}">
                    </figure>
                    <div class="results__data">
                        <h4 class="results__name">${new_title}</h4>                            
                        <p class="results__author">${recipe.publisher}</p>
                    </div>
                </a>
            </li>
        `;
  elements.searchResultlist.insertAdjacentHTML("beforeend", markup);
};

export const renderResults = (recipe, page = 1, resperPage = 10) => {
  const start = (page - 1) * 10;
  const end = page * 10;

  recipe.slice(start, end).forEach(renderRecipe);
  changePage(page, recipe.length, resperPage);
};
