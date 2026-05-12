const quoteElement = document.getElementById("quote");

const authorElement = document.getElementById("author");

const newQuoteBtn = document.getElementById("newQuoteBtn");

const copyBtn = document.getElementById("copyBtn");

const favoriteBtn = document.getElementById("favoriteBtn");

const tweetBtn = document.getElementById("tweetBtn");

const favoritesList = document.getElementById("favoritesList");

const categoryButtons = document.querySelectorAll(".category-btn");

const moodBadge = document.getElementById("moodBadge");

const clearFavoritesBtn =
    document.getElementById("clearFavoritesBtn");

const themeToggleBtn =
    document.getElementById("themeToggleBtn");


let currentQuote = {};


async function fetchQuote(category = ""){

    try{

        const response = await fetch(
    		"https://dummyjson.com/quotes/random"
		);

        const data = await response.json();



        currentQuote = {

            text: data.quote,
			
			author: data.author,

            category: category || "general"

        };

        displayQuote();

        saveToHistory();

		updateMood(currentQuote.category);

    }

    catch(error){

        quoteElement.innerText =
            "Failed to load quote.";

        authorElement.innerText = "";

    }

}



function displayQuote(){

    quoteElement.style.opacity = "0";

    authorElement.style.opacity = "0";



    setTimeout(() => {

        quoteElement.innerText =
            `"${currentQuote.text}"`;

        authorElement.innerText =
            `— ${currentQuote.author}`;



        quoteElement.style.opacity = "1";

        authorElement.style.opacity = "1";

    }, 250);

}



newQuoteBtn.addEventListener("click", () => {

    fetchQuote();

});



categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const category = button.dataset.category;

        fetchQuote(category);

    });

});



copyBtn.addEventListener("click", async () => {

    const text =
        `${currentQuote.text} — ${currentQuote.author}`;

    await navigator.clipboard.writeText(text);



    copyBtn.innerText = "Copied!";



    setTimeout(() => {

        copyBtn.innerText = "Copy";

    }, 1500);

});



tweetBtn.addEventListener("click", () => {

    const tweetText =
        `${currentQuote.text} — ${currentQuote.author}`;

    const twitterURL =
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

    window.open(twitterURL, "_blank");

});



function saveFavorite(){

    let favorites = JSON.parse(
        localStorage.getItem("favoriteQuotes")
    ) || [];


	//to prevent duplicates in favorites list
    const alreadyExists = favorites.some(
    (quote) => quote.text === currentQuote.text
	);

	if(!alreadyExists){
    favorites.push(currentQuote);
	}



    localStorage.setItem(
        "favoriteQuotes",
        JSON.stringify(favorites)
    );



    renderFavorites();

}



favoriteBtn.addEventListener("click", saveFavorite);



function renderFavorites(){

    const favorites = JSON.parse(
        localStorage.getItem("favoriteQuotes")
    ) || [];



    favoritesList.innerHTML = "";



    favorites.forEach((quote) => {

        const li = document.createElement("li");



        li.innerHTML = `
            "${quote.text}"
            <br>
            <strong>— ${quote.author}</strong>
        `;



        favoritesList.appendChild(li);

    });

}



function saveToHistory(){

    let history = JSON.parse(
        localStorage.getItem("quoteHistory")
    ) || [];



    history.unshift(currentQuote);



    history = history.slice(0, 5);



    localStorage.setItem(
        "quoteHistory",
        JSON.stringify(history)
    );

}

fetchQuote();

renderFavorites();

function updateMood(category){

    const moods = {

        motivational: "Mood: Motivated 🚀",

        success: "Mood: Focused 🎯",

        love: "Mood: Romantic ❤️",

        life: "Mood: Thoughtful 🌙",

        general: "Mood: Inspired ✨"

    };



    moodBadge.innerText =
        moods[category] || moods.general;
}

function toggleTheme(){

    document.body.classList.toggle("light-theme");



    if(document.body.classList.contains("light-theme")){

        themeToggleBtn.innerText =
            "🌙 Dark Mode";

    }

    else{

        themeToggleBtn.innerText =
            "☀️ Light Mode";

    }

}

themeToggleBtn.addEventListener(
    "click",
    toggleTheme
);

clearFavoritesBtn.addEventListener("click", () => {

    localStorage.removeItem("favoriteQuotes");

    renderFavorites();

});