import axios from 'axios';

export default class Search{

    constructor(query){
        this.query = query;
    }

    async getResult(){

        const key = '582bc5bce9cf9db59d3c89a0bfe19bf7';
    
        try{
    
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
    
            this.result = res.data.recipes;
    
            //console.log(this.result);
    
        }catch(error){
    
            alert(error);
        }
        
    }
    
}