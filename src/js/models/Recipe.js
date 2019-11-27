import axios from 'axios';
import {key} from '../config';

export default class Recipe{

    constructor(id){
        this.id = id;
    }

    async getRecipe(){

        try{

            const res = await axios(`https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);

            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients;

        }catch(error){
            console.log(error);
            alert('something is wrong');
        }
    }

    calcTime(){
        // Assuming that we need 15 min for each 3 ingredients;

        const numImg = this.ingredients.length;
        const periods = Math.ceil(numImg / 3);
        this.time = periods * 15;
    }

    calcServings(){
        this.servings = 4;
    }

    parseIngredients(){

        const unitLong = ['tablespoon','tablespoons','ounce','ounces','teaspoon','teaspoons','cups','pounds'];
        const unitShort = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound'];

        const newIngredients = this.ingredients.map(el => {

            //1. uniform unit;

            let ingredient = el.toLowerCase();

            unitLong.forEach((unit, i) => {

                ingredient = ingredient.replace(unit, unitShort[i]);
            });
            //2. remove parenthese;

            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            //3. parse ingredient into count, unit and ingredient;

            return ingredient;
        });

        this.ingredients = newIngredients;
    }
}