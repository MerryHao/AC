const BASE_URL = "https://movie-list.alphacamp.io";
const INDEX_URL = BASE_URL + "/api/v1/movies/";
const POSTER_URL = BASE_URL + "/posters/";
const MOVIES_PER_PAGE = 12

const movies = [];
let filteredMovies = [];

const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const paginator = document.querySelector("#paginator")

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
            <button class="btn btn-info btn-add-favorite" data-id=${item.id
      }>+</button>
          </div>
        </div>
      </div>
    </div>
  `;
  });
  dataPanel.innerHTML = rawHtml;
}



//當輸入一個page的時候，會回傳該頁的電影資料
function getMovieByPage(page) {
  //page 1 -> movies 0 - 11
  //page 2 -> movies 12 - 23
  //page 3 -> movies 24 - 35
  //...
  //movies有兩種意思
  //第一種是80部電影完整的電影清單
  //第二種是filteredMovies

  //如果filterMovies是有東西的，那就給我filteredMovies，但如果filteredMovies是空的，就給我movies
  const data = filteredMovies.length ? filteredMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE

  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)

}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHtml = ''

  for (let page = 1; page <= numberOfPages; page++) {
    rawHtml += `
    <li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>
    `
  }
  paginator.innerHTML = rawHtml
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem("favoriteMovies")) || [];
  const movie = movies.find((movie) => movie.id === id);
  if (list.some((movie) => movie.id === id)) {
    return alert("此電影已經在收藏清單中");
  }
  list.push(movie);
  //const jsonString = JSON.stringify(list);
  //console.log("json string: ", jsonString);
  //console.log("json object: ", JSON.parse(jsonString));
  //console.log(list);
  localStorage.setItem("favoriteMovies", JSON.stringify(list));
}

dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-movie")) {
    console.log(event.target.dataset);
    showMovieModal(Number(event.target.dataset.id));
  } else if (event.target.matches(".btn-add-favorite")) {
    addToFavorite(Number(event.target.dataset.id));
  }
});

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== "A") return //<a></a>
  //console.log(event.target.dataset.page)
  const page = Number(event.target.dataset.page)
  renderMovieList(getMovieByPage(page))
})

searchForm.addEventListener("submit", function onSearchFormSubmitted(event) {
  event.preventDefault();
  const keyword = searchInput.value.trim().toLowerCase();
  //console.log(keyword);

 

  // if (!keyword.length) {
  //   alert("xx");
  // }

  //Method 1: for-of
  // for (const movie of movies) {
  //   if (movie.title.toLowerCase().includes(keyword)) {
  //     filteredMovies.push(movie);
  //   }
  // }

  //Method 2: filter()
  filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
  );

  //map, filter, reduce 陣列操作三寶

  if (filteredMovies.length === 0) {
    return alert("Cannot find movie with keyword: " + keyword);
  }
  renderPaginator(filteredMovies.length)
  renderMovieList(getMovieByPage(1));
});

axios
  .get(INDEX_URL)
  .then((response) => {
    //array(80)
    // //將array放進movies法ㄧ
    // for (const movie of response.data.results) {
    //   movies.push(movie)
    // }

    //將array放進movies法二
    movies.push(...response.data.results);
    renderPaginator(movies.length)
    renderMovieList(getMovieByPage(1));
  })
  .catch((err) => console.log(err));