const enterBtn = document.getElementById("enterBtn");
const clearBtn = document.getElementById("clearBtn");
const movieInput = document.getElementById("movieInput");
const movieList = document.getElementById("movieList");
const watchedMoviesList = document.getElementById("watchedMoviesList");

let movies = [];

enterBtn.addEventListener("click", () => {
  const input = movieInput.value.trim();

  if (input === "") {
    movieInput.placeholder = "Enter a movie title";
    return;
  }

  const movieData = {
    title: input,
    watched: false,
  };

  movies.push(movieData);

  const movie = document.createElement("li");
  const deleteBtn = document.createElement("button");
  const watchedBox = document.createElement("input");
  const watchedLabel = document.createElement("label");

  watchedBox.type = "checkbox";
  watchedLabel.textContent = "Unwatched";
  deleteBtn.textContent = "Delete";
  movie.textContent = input;

  movie.append(deleteBtn, watchedLabel, watchedBox);
  movieList.append(movie);

  let watchedRow = null;

  // Keep the checkbox and label in sync.
  function resetWatched() {
    movieData.watched = false;
    watchedBox.checked = false;
    watchedLabel.textContent = "Unwatched";
    watchedLabel.classList.remove("watched");
    watchedRow = null;
  }

  watchedBox.addEventListener("change", () => {
    movieData.watched = watchedBox.checked;

    if (watchedBox.checked) {
      watchedLabel.textContent = "Watched";
      watchedLabel.classList.add("watched");

      watchedRow = renderMovie(movieData, resetWatched);
    } else {
      watchedRow?.remove();
      resetWatched();
    }

    saveMovies();
  });

  deleteBtn.addEventListener("click", () => {
    movie.remove();
    watchedRow?.remove();

    movies = movies.filter((item) => item !== movieData);
    saveMovies();
  });

  saveMovies();
  movieInput.value = "";
});

function saveMovies() {
  localStorage.setItem(
    "movies",
    JSON.stringify(movies.filter((item) => item.watched)),
  );
}

function loadMovies() {
  const savedMovies = localStorage.getItem("movies");

  if (savedMovies) {
    movies = JSON.parse(savedMovies);
  }
}

function renderMovie(movieData, onDelete) {
  const renderedMovie = document.createElement("li");
  const movieTitle = document.createElement("span");
  const deleteBtn = document.createElement("button");

  movieTitle.classList.add("movieTitle");
  movieTitle.textContent = movieData.title;

  deleteBtn.classList.add("deleteRenederedBtn");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    renderedMovie.remove();
    movieData.watched = false;

    // New movies also have a checkbox to reset.
    if (onDelete) {
      onDelete();
    } else {
      // Loaded movies only have a watched-list row.
      movies = movies.filter((item) => item !== movieData);
    }

    saveMovies();
  });

  renderedMovie.append(movieTitle, deleteBtn);
  watchedMoviesList.append(renderedMovie);

  return renderedMovie;
}

clearBtn.addEventListener("click", () => {
  movieInput.value = "";
});

loadMovies();
movies.forEach((item) => renderMovie(item));
