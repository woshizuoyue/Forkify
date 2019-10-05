// api key: 582bc5bce9cf9db59d3c89a0bfe19bf7
// search query: https://www.food2fork.com/api/search

import axios from 'axios';

async function getResult(query){

    const key = '582bc5bce9cf9db59d3c89a0bfe19bf7';

    try{

        const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${query}`);

        const recipes = res.data.recipes;

        console.log(recipes);

    }catch(error){

        alert(error);
    }
    
}

getResult('cookies');