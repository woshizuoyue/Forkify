import axios from 'axios';
import {key} from '../config';

export default class Recipe{

    constructor(id){
        this.id = id;
    }

    async getRecipe(){

        try{

            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);

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
        const unit = [...unitShort, 'kg','g'];

        const newIngredients = this.ingredients.map(el => {

            //1. uniform unit;

            let ingredient = el.toLowerCase();

            unitLong.forEach((unit, i) => {

                ingredient = ingredient.replace(unit, unitShort[i]);
            });
            //2. remove parenthese;

            ingredient = ingredient.replace(/ *\([^)]*\) */g, '');

            //3. parse ingredient into count, unit and ingredient;

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unit.includes(el2));

            let objIng;

            if(unitIndex > -1){

                // there is an unit;

                // ex. 4 1/2 cups, arrCount is [4, 1/2] ---> eval["4 + 1/2"] ---> 4.5
                // ex. 4 cups, arrCount is [4]

                const arrCount = arrIng.slice(0, unitIndex);

                let count;

                if(arrCount === 1){

                    count = eval(arrIng[0].replace('-','+'));

                }else{

                    count = eval(arrIng.slice(0, unitIndex).join('+')); 

                }

                objIng = {

                    count,
                    unit : arrIng[unitIndex],
                    ingredient : arrIng.slice(unitIndex + 1).join(' ')
                }

            }else if(parseInt(arrIng[0], 10)){

                // there is no unit but 1st is a number

                objIng = {

                    count : parseInt(arrIng[0], 10),

                    unit : '',

                    ingredient : arrIng.slice(1).join(' ')

                }

            }else if(unitIndex === -1){

                // there is no unit and no number in 1st position

                objIng = {

                    count : 1,

                    unit : '',

                    ingredient
                }
            }

            return objIng;
        });

        this.ingredients = newIngredients;
    }

    updateServings(type){

        // servings

        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        // ingredients

        this.ingredients.forEach(ing =>{
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}