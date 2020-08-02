import axios from "axios";
export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  async getRecipe() {
    try {
      const res = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = res.data.recipe.title;
      this.publisher = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredents = res.data.recipe.ingredients;
    } catch (e) {
      alert(e);
    }
  }

  calcTime() {
    const numRes = this.ingredents.length;
    const period = Math.ceil(numRes / 3);
    this.time = period * 15;
  }
  calcServings() {
    this.servings = 4;
  }

  parseIngredents() {
    const unitLong = [
      "tablespoon",
      "tablespoons",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds",
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound",
    ];
    const newIngredents = this.ingredents.map((el) => {
      //uniform unit
      let ingredent = el.toLowerCase();
      unitLong.forEach((unit, i) => {
        ingredent = ingredent.replace(unit, unitShort[i]);
      });

      //remove parenthes
      ingredent = ingredent.replace(/ *\([^)]*\) */g, " ");

      //parse ingredients into count, unit and ingredients

      const arrIng = ingredent.split(" ");
      const unitIndex = arrIng.findIndex((el2) => unitShort.includes(el2));

      let objIng;
      if (unitIndex > -1) {
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace("-", "+"));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join("+"));
        }

        objIng = {
          count: count,
          unit: arrIng[unitIndex],
          ingredent: arrIng.slice(unitIndex + 1).join(" "),
        };

        //a unit
      } else if (unitIndex === -1 && !parseInt(arrIng[0])) {
        //no unit
        objIng = {
          count: 1,
          unit: "",
          ingredent: ingredent,
        };
      } else if (parseInt(arrIng[0])) {
        //no unit but  1 el in num
        objIng = {
          count: parseInt(arrIng[0]),
          unit: "",
          ingredent: arrIng.slice(1).join(" "),
        };
      }
      return objIng;
    });
    this.ingredents = newIngredents;
  }

  updateServings(type) {
    const newServings = type == "dec" ? this.servings - 1 : this.servings + 1;
    this.ingredents.forEach((ing) => {
      ing.count = ing.count * (newServings / this.servings);
    });
    this.servings = newServings;
  }
}
