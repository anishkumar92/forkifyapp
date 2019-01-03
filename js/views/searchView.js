import { elements } from './base';

export const getInput = ()=> elements.searchInput.value;

export const clearInput = ()=> elements.searchInput.value='';

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

export const clearResults = () => {
    elements.resultsField.innerHTML="";
    elements.resPages.innerHTML="";
}
export const limitTitle = (title,limit=17) =>{
    const newtitle =[];
    if(title.length>limit){
        title.split(' ').reduce((acc,cur)=>{
            if(acc + cur.length <=limit){
                newtitle.push(cur);
            }
            return acc + cur.length;
        },0);

        return `${newtitle.join(' ')} ...`;
    }
    return title;
};


 const getRecipe = recipe =>{
     const markup=`
        <li>
            <a class="results__link"href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src=${recipe.image_url} alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name maxlength="1">${limitTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
                `
    elements.resultsField.insertAdjacentHTML("beforeend",markup);

};

const createButton = (page,type) =>`
        <button class="btn-inline results__btn--${type}" data-goto =${type=== 'prev' ? page - 1 : page + 1}>
        
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type=== 'prev' ? 'left' : 'right'}"></use>
        </svg>
        <span>Page ${type=== 'prev' ? page-1 : page+1}</span>
        </button>
`;

const renderButton =(page,numResult,resPerpage)=>{
    const pages = Math.ceil(numResult/resPerpage);
        let button;
        if (page===1 && pages>1){
            button=createButton(page,'next');
        }else if(page<pages){
            button=`${createButton(page,'next')}
                ${createButton(page,'prev')}`;
        }else if(page===pages && pages>1){
            button=createButton(page,'prev');
        }

    elements.resPages.insertAdjacentHTML('afterbegin',button);    
};



export const getResult = (recipes,page=1, resPerpage=10) => {
    const start = (page-1) *resPerpage;
    const end = page*resPerpage;
    recipes.slice(start,end).forEach(getRecipe);
    renderButton(page,recipes.length,resPerpage);
};              