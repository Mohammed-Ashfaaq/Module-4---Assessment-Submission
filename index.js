document.getElementById("search-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById("search-input").value.trim();
    if (searchTerm) {
        searchMovies(searchTerm);
    }
});

function searchMovies(searchTerm) {
    const url = `https://www.omdbapi.com/?s=${searchTerm}&apikey=trilogy`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const movies = data.Search;
            document.getElementById("results").innerHTML = "";
            if (movies) {
                addElements(movies);
            } else {
                document.getElementById("results").innerHTML = "<p>No films found.</p>";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("results").innerHTML = "<p>Something went wrong. Please try again.</p>";
        })
}

function addElements(movies) {
    movies.forEach(movie => {
        const card = document.createElement("div");
        card.classList.add("movie-card");
            card.innerHTML = `
                <h2>${movie.Title}</h2>
                <p>Type: ${movie.Type}</p>
                <p>Year: ${movie.Year}</p>
                <img src="${movie.Poster}" alt="${movie.Title} Poster">
                <button onclick="fetchMovieDetails('${movie.imdbID}')">View Details</button>
            `;
            document.getElementById("results").appendChild(card);
        })
    }

function fetchMovieDetails(imdbID){
    console.log("fetchMovieDetails called with:", imdbID);
    const url = `https://www.omdbapi.com/?i=${imdbID}&apikey=trilogy`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "False") {
            document.getElementById("movie-details").innerHTML = "<p>No details found for this film.</p>";
            return;
            }
            document.getElementById("results").style.display = "none";
            document.querySelector(".search-section").style.display = "none";
            document.getElementById("trending-section-container").style.display = "none";
            document.querySelector(".results-section").style.display = "none";
            document.getElementById("detail-section").style.display = "block";
            document.getElementById("signup-section").classList.add("hidden");
            document.getElementById("review-section").classList.add("hidden");
            document.getElementById("movie-details").innerHTML = `
                <p><Strong>Title:</Strong> ${data.Title}</p>
                <p><Strong>Year:</Strong> ${data.Year}</p>
                <p><Strong>Plot:</Strong> ${data.Plot}</p>
                <p><Strong>Director:</Strong> ${data.Director}</p>
                <p><Strong>Actors:</Strong> ${data.Actors}</p>
                <p><Strong>Genre:</Strong> ${data.Genre}</p>
                <p><Strong>Rating:</Strong> ${data.imdbRating}</p>
                <img src="${data.Poster}" alt="${data.Title} Poster">
                <button onclick="goBack()">Go Back</button>
                
            `;
        })
        .catch(error => {
            console.error("Error fetching movie details:", error);
            document.getElementById("results").innerHTML = "<p>Something went wrong. Please try again.</p>";
        });
    }
function goBack() {
    // Clear movie details
    document.getElementById("movie-details").innerHTML = "";
    
    // Show all sections
    document.querySelector(".search-section").style.display = "block";
    document.getElementById("trending-section-container").style.display = "block";
    document.querySelector(".results-section").style.display = "block";
    
    // Hide search header
    document.getElementById("search-header").style.display = "none";
    
    // Reload trending films
    displayTrendingMovies();
} 

function displayTrendingMovies() {
    const movies2024 = ["Dune Part Two", "Deadpool & Wolverine", "Inside Out 2", "Alien Romulus", "Twisters", "Moana 2","Kung Fu Panda 4", "Mufasa: The Lion King", "Sonic The Hedgehog 3"]
    const movies2025 = ["Mickey 17", "Sinners","Thunderbolts", "28 Years Later", "A Minecraft Movie", "Superman", "Zootopia 2", "Wicked: For Good", "Jurassic World: Rebirth"]
    const movies2026 = ["Spider-Man: Brand New Day", "The Odyssey", "Toy Story 5", "Project Hail Mary", "The Super Mario Galaxy Movie"]
    const choice = document.getElementById("year-select").value;
        let selectedList
        if (choice === "2024") selectedList = movies2024;
        else if (choice === "2025") selectedList = movies2025;
        else if (choice === "2026") selectedList = movies2026;
        else selectedList = [...movies2024, ...movies2025, ...movies2026];

    selectedList.sort(() => Math.random() - 0.5);
    const selectedMovies = selectedList.slice(0, 5);
    document.getElementById("trending-movies").innerHTML = "";
    selectedMovies.forEach(title => {
        const url = `https://www.omdbapi.com/?t=${title}&apikey=trilogy`;
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const card = document.createElement("div");
                card.classList.add("movie-card");
                card.innerHTML = `
                    <h2>${data.Title}</h2>
                    <p><strong>Year:</strong> ${data.Year}</p>
                    <img src="${data.Poster}" alt="${data.Title} Poster">
                    <button onclick="fetchMovieDetails('${data.imdbID}')">View Details</button>
                `;
                document.getElementById("trending-movies").appendChild(card);
            })
            .catch(error => {
                console.error("Error fetching trending movie data:", error);
            });
    });
}

window.onload = function() {
    displayTrendingMovies();
    document.getElementById("year-select").addEventListener("change", displayTrendingMovies);
    document.getElementById("search-input").addEventListener("focus", function() {
        document.getElementById("trending-section-container").style.display = "none";
        document.getElementById("movie-details").innerHTML = "";
        document.getElementById("results").style.display = "grid";
        document.getElementById("signup-section").classList.add("hidden");
        document.getElementById("review-section").classList.add("hidden");
        
    });
}

// Sign up form validation and submission
document.getElementById("signup-form").addEventListener("submit", function(event) {
    event.preventDefault();
    // Show success message
    document.getElementById("signup-section").innerHTML = `
        <h2>Welcome to CineSearch! 🎬</h2>
        <p>Thank you for signing up!</p>
        <button onclick="showHome(event)">Back to Home</button>
    `;
});

// Review form validation and submission
document.getElementById("review-form").addEventListener("submit", function(event) {
    event.preventDefault();
    document.getElementById("review-section").innerHTML = "<h2>Thank you for your review! ⭐</h2><p>Your review has been submitted successfully.</p>";
});

function showHome(event) {
    event.preventDefault();
    document.querySelector(".search-section").style.display = "block";
    document.getElementById("trending-section-container").style.display = "block";
    document.querySelector(".results-section").style.display = "block";
    document.getElementById("signup-section").classList.add("hidden");
    document.getElementById("review-section").classList.add("hidden");
    // Clear search results and details
    document.getElementById("results").innerHTML = "";
    document.getElementById("movie-details").innerHTML = "";
    document.getElementById("search-input").value = "";
}

function showSignUp(event) {
    event.preventDefault();
    document.querySelector(".search-section").style.display = "none";
    document.getElementById("trending-section-container").style.display = "none";
    document.querySelector(".results-section").style.display = "none";
    document.getElementById("detail-section").style.display = "none";
    document.getElementById("signup-section").classList.remove("hidden");
    document.getElementById("review-section").classList.add("hidden");
}

function showReview(event) {
event.preventDefault();
    document.querySelector(".search-section").style.display = "none";
    document.getElementById("trending-section-container").style.display = "none";
    document.querySelector(".results-section").style.display = "none";
    document.getElementById("detail-section").style.display = "none";
    document.getElementById("signup-section").classList.add("hidden");
    document.getElementById("review-section").classList.remove("hidden");
}

document.getElementById("terms").required = true
