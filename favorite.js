const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";

const movies = JSON.parse(localStorage.getItem("favoriteMovies"));
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

function renderMovieList(data) {
  let rawHtml = "";
  data.forEach((item) => {
    rawHtml += `
    <div class="col-sm-3">
      <div class="mb-2">
        <div class="card">
          <img
            src="${POSTER_URL + item.image}"
            class="card-img-top" alt="Movie Poster">
          <div class="card-body">
            <h5 class="card-title">${item.title}</h5>
          </div>
          <div class="card-footer text-muted">
            <button class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
              data-bs-target="#movie-modal" data-id=${item.id}>More</button>
            <button class="btn btn-danger btn-remove-favorite" data-id=${item.id
      }>X</button>
          </div>
        </div>
      </div>
    </div>
  `;
  });
  dataPanel.innerHTML = rawHtml;
}

function showMovieModal(id) {
  const movieTitle = document.querySelector("#movie-modal-title");
  const movieImage = document.querySelector("#movie-modal-image");
  const movieDate = document.querySelector("#movie-modal-date");
  const movieDescription = document.querySelector("#movie-modal-description");

  axios.get(INDEX_URL + id).then((response) => {
    //response.data.results
    const data = response.data.results;
    movieTitle.innerText = data.title;
    movieDate.innerText = "Release date:" + data.release_date;
    movieDescription.innerText = data.description;
    movieImage.innerHTML = `<img src="${POSTER_URL + data.image
      }" alt="movie-poster" class="img-fuid">`;
  });
}

function removeFromFavorite(id) {
  if (!movies) return
  //透過id找到要刪除電影的index
  const movieIndex = movies.findIndex((movie) => movie.id === id); //return index
  if (movieIndex === -1) return
  //刪除該電影
  movies.splice(movieIndex, 1)
  //存回localStorage
  localStorage.setItem("favoriteMovies", JSON.stringify(movies));
  //更新頁面
  renderMovieList(movies)
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(event.target.dataset);
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-remove-favorite")) {
    removeFromFavorite(Number(event.target.dataset.id));
  }
});

renderMovieList(movies)