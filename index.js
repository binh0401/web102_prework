/*****************************************************************************
 * Challenge 2: Review the provided code. The provided code includes:
 * -> Statements that import data from games.js
 * -> A function that deletes all child elements from a parent element in the DOM
*/

// import the JSON data about the crowd funded games from the games.js file
import GAMES_DATA from './games.js';

// create a list of objects to store the data about the games using JSON.parse
const GAMES_JSON = JSON.parse(GAMES_DATA)

// remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/*****************************************************************************
 * Challenge 3: Add data about each game as a card to the games-container
 * Skills used: DOM manipulation, for loops, template literals, functions
*/

// grab the element with the id games-container
const gamesContainer = document.getElementById("games-container");
const modal = document.getElementById('modal')
const closeBtn = document.querySelector('.close')

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none'
    while(modal.children.length >= 2){
        modal.removeChild(modal.children[1])
    }
})

window.addEventListener('click', (event) => {
    if(event.target === modal){
        modal.style.display = 'none'
        while(modal.children.length >= 2){
            modal.removeChild(modal.children[1])
        }
    }
})

// create a function that adds all data from the games array to the page
function addGamesToPage(games) {

    // loop over each item in the data
    for (let i=0;i<games.length;i++){
        
        // create a new div element, which will become the game card
        let gameCard = document.createElement('div')

        // add the class game-card to the list
        gameCard.classList.add('game-card')

        // set the inner HTML using a template literal to display some info 
        // about each game
        // TIP: if your images are not displaying, make sure there is space
        // between the end of the src attribute and the end of the tag ("/>")
        gameCard.innerHTML = `
            <img src='${games[i].img}' class="game-img"/>
            <h3>${games[i].name}</h3>
            <p>${games[i].description}</p>
            <p>Backers: ${games[i].backers}</p>
        `
        gameCard.addEventListener('click', () => {
            modal.style.display = 'block'
            const modalContent = document.createElement('div')
            modalContent.classList.add('modal-content')
            modalContent.innerHTML = `
            <img src='${games[i].img}' class="game-img"/>
            <h3>${games[i].name}</h3>
            <p>${games[i].description}</p>
            <p>Backers: ${games[i].backers}</p>
            <p>Goals: ${games[i].goal}</p>
            <p>Pledge: ${games[i].pledged}</p>
        `
            if(modal.children.length===1) modal.appendChild(modalContent)
        })
        // append the game to the games-container
        gamesContainer.appendChild(gameCard)
    }
}

// call the function we just defined using the correct variable
// later, we'll call this function using a different list of games
addGamesToPage(GAMES_JSON)

/*************************************************************************************
 * Challenge 4: Create the summary statistics at the top of the page displaying the
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: arrow functions, reduce, template literals
*/

// grab the contributions card element
const contributionsCard = document.getElementById("num-contributions");

// use reduce() to count the number of total contributions by summing the backers
const totalContributions = GAMES_JSON.reduce((acc, game) => {
    return acc + game.backers
}, 0)

// set the inner HTML using a template literal and toLocaleString to get a number with commas
contributionsCard.innerHTML = `
    ${totalContributions.toLocaleString('en-US')}
`

// grab the amount raised card, then use reduce() to find the total amount raised
const raisedCard = document.getElementById("total-raised");

// set inner HTML using template literal
const totalRaised = GAMES_JSON.reduce((acc, game) => {
    return acc + game.pledged
},0)
raisedCard.innerHTML = `$${totalRaised.toLocaleString('en-US')}`

// grab number of games card and set its inner HTML
const gamesCard = document.getElementById("num-games");
gamesCard.innerHTML = `${GAMES_JSON.length}`

/*************************************************************************************
 * Challenge 5: Add functions to filter the funded and unfunded games
 * total number of contributions, amount donated, and number of games on the site.
 * Skills used: functions, filter
*/

// show only games that do not yet have enough funding
function filterUnfundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have not yet met their goal
    const unFundedGames = GAMES_JSON.filter(game => {
        return game.pledged < game.goal
    })

    // use the function we previously created to add the unfunded games to the DOM
    addGamesToPage(unFundedGames)
}

// show only games that are fully funded
function filterFundedOnly() {
    deleteChildElements(gamesContainer);

    // use filter() to get a list of games that have met or exceeded their goal
    const fundedGames = GAMES_JSON.filter(game => {
        return game.pledged > game.goal
    })

    // use the function we previously created to add unfunded games to the DOM
    addGamesToPage(fundedGames)
}

// show all games
function showAllGames() {
    deleteChildElements(gamesContainer);

    // add all games from the JSON data to the DOM
    addGamesToPage(GAMES_JSON)
}

// select each button in the "Our Games" section
const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

// add event listeners with the correct functions to each button
unfundedBtn.addEventListener('click', () => {
    unfundedBtn.classList.add('btn-selected')
    if(fundedBtn.classList.contains('btn-selected')) fundedBtn.classList.remove('btn-selected')
    if(allBtn.classList.contains('btn-selected')) allBtn.classList.remove('btn-selected')
    filterUnfundedOnly()
    gamesContainer.scrollIntoView({behavior: 'smooth'})
})

fundedBtn.addEventListener('click', () => {
    fundedBtn.classList.add('btn-selected')
    if(unfundedBtn.classList.contains('btn-selected')) unfundedBtn.classList.remove('btn-selected')
    if(allBtn.classList.contains('btn-selected')) allBtn.classList.remove('btn-selected')
    filterFundedOnly()
    gamesContainer.scrollIntoView({behavior: 'smooth'})
})

allBtn.addEventListener('click', () => {
    allBtn.classList.add('btn-selected')
    if(fundedBtn.classList.contains('btn-selected')) fundedBtn.classList.remove('btn-selected')
    if(unfundedBtn.classList.contains('btn-selected')) unfundedBtn.classList.remove('btn-selected')
    showAllGames()
    gamesContainer.scrollIntoView({behavior: 'smooth'})
})

/*************************************************************************************
 * Challenge 6: Add more information at the top of the page about the company.
 * Skills used: template literals, ternary operator
*/

// grab the description container
const descriptionContainer = document.getElementById("description-container");

// use filter or reduce to count the number of unfunded games
const totalUnfundedGames = GAMES_JSON.reduce((acc, game) => {
    if(game.pledged < game.goal){
        acc += 1
    }
    return acc
}, 0)

// create a string that explains the number of unfunded games using the ternary operator
const displayStr = totalUnfundedGames > 0 ? `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length - totalUnfundedGames} games. Currently, ${totalUnfundedGames} remains unfunded. We need your help to fund these amazing games!` : 
                                            `A total of $${totalRaised.toLocaleString('en-US')} has been raised for ${GAMES_JSON.length} games.`
// create a new DOM element containing the template string and append it to the description container
const fundingInfoElement = document.createElement('p')
fundingInfoElement.innerHTML = displayStr
descriptionContainer.appendChild(fundingInfoElement)

/************************************************************************************
 * Challenge 7: Select & display the top 2 games
 * Skills used: spread operator, destructuring, template literals, sort 
 */

const firstGameContainer = document.getElementById("first-game");
const secondGameContainer = document.getElementById("second-game");

const sortedGames =  GAMES_JSON.sort( (item1, item2) => {
    return item2.pledged - item1.pledged;
});

// use destructuring and the spread operator to grab the first and second games
const [firstGame, secondGame, ...others] = sortedGames

// create a new element to hold the name of the top pledge game, then append it to the correct element
const firstGameElement = document.createElement('div')
firstGameElement.innerHTML = `
    <img src='${firstGame.img}' class='game-img'/>
    <h2>${firstGame.name}</h2>
    <p>${firstGame.description}</p>
    <h3>$${firstGame.pledged.toLocaleString('en-US')}</h3>
`
firstGameContainer.appendChild(firstGameElement)

const secondGameElement = document.createElement('div')
secondGameElement.innerHTML = `
    <img src='${secondGame.img}' class='game-img' />
    <h2>${secondGame.name}</h2>
    <p>${secondGame.description}</p>
    <h3>$${secondGame.pledged.toLocaleString('en-US')}</h3>
`
secondGameContainer.appendChild(secondGameElement)
// do the same for the runner up item



//Customization 1: Buttons become sticky so user can change the filter while scrolling


//Customization 2: Auto scroll into games-container when click button filter

//Customization 3: Display detailed Info when click into game card

//Customization 4: Search bar that updates on key stroke

const searchBar = document.querySelector('.search-bar')

searchBar.addEventListener('input', () =>{
    const query = searchBar.value.toLowerCase()
    let filterResults = null
    if(fundedBtn.classList.contains('btn-selected')){
        const fundedGames = GAMES_JSON.filter(game => {
            return game.pledged > game.goal
        })

        filterResults = fundedGames.filter(game => {
            return game && game.name.toLowerCase().includes(query)
        })
    }else if(unfundedBtn.classList.contains('btn-selected')){
        const unFundedGames = GAMES_JSON.filter(game => {
            return game.pledged < game.goal
        })

        filterResults = unFundedGames.filter(game => {
            return game && game.name.toLowerCase().includes(query)
        })
    }else{
        filterResults = GAMES_JSON.filter(game => {
            return game && game.name.toLowerCase().includes(query)
        })
    }

    deleteChildElements(gamesContainer)
    addGamesToPage(filterResults)

    
})


