//API e3e195b6fee7e78b7518c1f3cea1dbd7 
//API 2 - e1e924b4deeeded3cfe4a94482df79bc 
// All search requests should be made to the search API URL.
// https://www.food2fork.com/api/search
// All recipe requests should be made to the recipe details API URL.
// https://www.food2fork.com/api/get 

import axios from 'axios';



export default class Search{
constructor(query){
    this.query=query;
}

async getResults(query){
    const proxy ='https://cors-anywhere.herokuapp.com/';
    const key =`e1e924b4deeeded3cfe4a94482df79bc`;
    try{
        const res = await axios (`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result =res.data.recipes;
       
       
    } catch(err){
        console.log(err);
    }

}

}
