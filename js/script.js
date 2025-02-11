const global = {
    currentPage:window.location.pathname,
    search:{
      term:'',
      type:'',
      page:1,
      totalPages:1,
      totalResults:0
    },
    api:{
      apiKey:'05f9ba1abf9bae21998deeb8642c82a0',
      apiUrl:'https://api.themoviedb.org/3/'
    }
}

// fetch data from TMDB API
async function fethcAPIData(endpoint){
    const API_KEY= global.api.apiKey;
    const API_URL = global.api.apiUrl;
    showSpinner();
    const response = await fetch(`${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`);
    const data = await response.json();
    hideSpinner();
    return data;
}
async function displayMovieDetails() {
   const movieId = window.location.search.split('=')[1];
   const movie = await fethcAPIData(`movie/${movieId}`);
   //overlay for background image
   displayBackGroundImage('movie',movie.backdrop_path);
   const div = document.createElement('div');
   div.innerHTML = `
    <div class="details-top">
          <div>
            ${movie.poster_path ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />` : `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="Movie Title"
            />`}
          </div>
          <div>
            <h2>${movie.title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${movie.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${movie.release_date}</p>
            <p>
              ${movie.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${movie.genres.map((genre)=>`<li>${genre.name}</li>`)}
            </ul>
            <a href="#" target="_blank" class="btn">Visit Movie Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Movie Info</h2>
          <ul>
            <li><span class="text-secondary">Budget:</span> $${addCommas(movie.budget)}</li>
            <li><span class="text-secondary">Revenue:</span> $${addCommas(movie.revenue)}</li>
            <li><span class="text-secondary">Runtime:</span> ${movie.runtime} minutes</li>
            <li><span class="text-secondary">Status:</span> ${movie.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">${movie.production_companies.map((company)=>`<span>${company.name}</span>`)}</div>
        </div>
   
   
   `
            document.querySelector('#movie-details').appendChild(div);
}

// display shows details
async function displayShowDetails() {
    const showId = window.location.search.split('=')[1];
    const show = await fethcAPIData(`tv/${showId}`);
  console.log(show);
    const div = document.createElement('div');

    displayBackGroundImage('tv',show.backdrop_path);
    div.innerHTML =`
    <div class="details-top">
          <div>
           ${show.poster_path ? ` <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />` : ` <img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`}
          </div>
          <div>
            <h2>${show.name}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>
              ${show.vote_average.toFixed(1)} / 10
            </p>
            <p class="text-muted">Release Date: ${show.last_air_date}</p>
            <p>
              ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group">
              ${show.genres.map((genre)=>`<li>${genre.name}</li>`).join('')}
            </ul>
            <a href="${show.homepage}" target="_blank" class="btn">Visit Show Homepage</a>
          </div>
        </div>
        <div class="details-bottom">
          <h2>Show Info</h2>
          <ul>
            <li><span class="text-secondary">Number Of Episodes:</span> ${show.number_of_episodes}</li>
            <li>
              <span class="text-secondary">Last Episode To Air:</span> ${show.last_episode_to_air.air_date}
            </li>
            <li><span class="text-secondary">Status:</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group">
          ${show.production_companies.map((company)=>`<span>${company.name}</span>`)}
          </div>
        </div>
    `
            document.getElementById('show-details').appendChild(div);
    
}

//display background drop on details page
function displayBackGroundImage(type,backgroundPath){
    const overlayDiv = document.createElement('div');
    overlayDiv.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
    overlayDiv.style.backgroundSize='cover';
    overlayDiv.style.backgroundPosition='center';
    overlayDiv.style.backgroundRepeat='no-repet';
    overlayDiv.style.height='100vh';
    overlayDiv.style.width='100vw';
    overlayDiv.style.position='absolute';
    overlayDiv.style.top='0';
    overlayDiv.style.left='0';
    overlayDiv.style.zIndex='-1';
    overlayDiv.style.opacity='0.1';
    if(type==='movie'){
        document.querySelector('#movie-details').appendChild(overlayDiv);
    }else{
        document.querySelector('#show-details').appendChild(overlayDiv);
    }
}

//display slider movies
async function displaySlider(){

  const {results} =await fethcAPIData('movie/now_playing');
  results.forEach((movie)=>{
    const div = document.createElement('div');
    div.classList.add('swiper-slide');
    div.innerHTML = `
    
            <a href="movie-details.html?id=${movie.id}">
              <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
            </a>
            <h4 class="swiper-rating">
              <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
            </h4>
         
    `;
    document.querySelector('.swiper-wrapper').appendChild(div);
    initSwiper();
  });
}
function initSwiper(){
  const swiper = new Swiper('.swiper',{
    slidesPerView:1,
    spaceBetween:30,
    freeMode:true,
    loop:true,
    autoplay:{
      delay:4000,
      disableOnInteraction:false
    },
    breakpoints:{
      500:{
        slidesPerView:2
      },
      700:{
        slidesPerView:3
      },
      1200:{
        slidesPerView:4
      }
    }
  })
}

//add commas 
function addCommas(number) {
    let str = number.toString();
    let [integer, decimal] = str.split('.');
    integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return decimal ? integer + '.' + decimal : integer;
  }
// active links
function highLightActiveLink(){
    const links = document.querySelectorAll('.nav-link');
    links.forEach((link)=>{
        link.classList.add('active');
    });
}

// display popular movie
async function displayPopularMovies(){
    const {results} = await fethcAPIData('movie/popular');
    console.log(results);
    results.forEach((movie)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        
             <a href="movie-details.html?id=${movie.id}"> ${movie.poster_path ? `<img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />`:`<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${movie.title}"
            />`} 
            
          </a>
          <div class="card-body">
            <h5 class="card-title">${movie.title}</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${movie.release_date}</small>
            </p>
          </div>
        
        `;
        document.querySelector('#popular-movies').appendChild(div);
    });
}

async function displayPopularShows() {
    const {results} = await fethcAPIData('tv/popular');
    console.log(results);
    results.forEach((show)=>{
        const div = document.createElement('div');
        div.classList.add('card');
        div.innerHTML = `
        
        <a href="tv-details.html?id=${show.id}"> ${show.poster_path ?  `<img
            src="https://image.tmdb.org/t/p/w500${show.poster_path}"
            class="card-img-top"
            alt="${show.name}"
          />`: `<img
              src="images/no-image.jpg"
              class="card-img-top"
              alt="${show.name}"
            />`} 
        
            
          </a>
          <div class="card-body">
            <h5 class="card-title">${show.name}</h5>
            <p class="card-text">
              <small class="text-muted">Aired: ${show.first_air_date}</small>
            </p>
        
        `
            document.getElementById('popular-shows').appendChild(div);
    });
}


//search API fetch
async function searchAPIData(){

  const API_URL = global.api.apiUrl;
  const API_KEY = global.api.apiKey;
  showSpinner();
  const response = await fetch(`${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`);
  const data = await response.json();
  hideSpinner();
  return data;

}
// search function
async function search(){

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  global.search.type = urlParams.get('type');
  global.search.term = urlParams.get('search-term');
  if(global.search.term !== '' && global.search.term !== null){
    const {results,total_pages,page,total_results} = await searchAPIData();
    global.search.page=page;
    global.search.totalPages=total_pages;
    global.search.totalResults=total_results;
    if(results.length === 0){
      showErrorAlert('No results found..');
      return;
    }
    displaySearchResults(results);
    document.querySelector('#search-term').value='';
    
  }else{
    showErrorAlert('Please enter a search term','error');
    return;

  }

}


function displaySearchResults(results){
//Clear previous resulsts
document.querySelector('#search-results').innerHTML = '';
document.querySelector('#search-results-heading').innerHTML = '';
document.querySelector('#pagination').innerHTML = '';
  results.forEach((result)=>{
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
    
         <a href="${global.search.type}-details.html?id=${result.id}"> ${result.poster_path ? `<img
          src="https://image.tmdb.org/t/p/w500${result.poster_path}"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />`:`<img
          src="images/no-image.jpg"
          class="card-img-top"
          alt="${global.search.type === 'movie' ? result.title : result.name}"
        />`} 
        
      </a>
      <div class="card-body">
        <h5 class="card-title">${global.search.type === 'movie' ? result.title : result.name}</h5>
        <p class="card-text">
          <small class="text-muted">Release: ${global.search.type === 'movie' ? result.release_date : result.first_air_date}</small>
        </p>
      </div>
    
    `;
    document.querySelector('#search-results-heading').innerHTML = `
    <h2>${results.length} of ${global.search.totalResults} Results for ${global.search.term}</h2>
    `;
    document.getElementById('search-results').appendChild(div);
    
  });
  displayPagination();
}
//create and display pagination for search
function displayPagination(){
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
          <button class="btn btn-primary" id="next">Next</button>
          <div class="page-counter">Page ${global.search.page} of ${global.search.totalPages}</div>
        </div>
  `;

  document.querySelector('#pagination').appendChild(div);

  //disable prev button if it first page
  if(global.search.page === 1){
    document.querySelector('#prev').disabled=true;
  }
  //disable next button if on the last page
  if(global.search.page === global.search.totalPages){
    document.querySelector('#next').disabled=true;
  }

  //NEXT page
  document.querySelector('#next').addEventListener('click',async ()=>{
    global.search.page++;
    const {results,total_pages} = await searchAPIData();
    displaySearchResults(results);
  });
  //PREV page
  document.querySelector('#prev').addEventListener('click',async ()=>{
    global.search.page--;
    const {results,total_pages} = await searchAPIData();
    displaySearchResults(results);
  });


}

function showErrorAlert(message,className='error'){
  const alertEl = document.createElement('div');
  alertEl.classList.add('alert',className);
  alertEl.appendChild(document.createTextNode(message));
  document.querySelector('#alert').appendChild(alertEl);
  setTimeout(()=>alertEl.remove(),3000);
}



function showSpinner(){
    document.querySelector('.spinner').classList.add('show');
}
function hideSpinner(){
    document.querySelector('.spinner').classList.remove('show');
}

function init(){
    switch(global.currentPage){
        case '/':
            case '/index.html':
              displaySlider();
               displayPopularMovies();
                break;
        case '/shows.html':
            displayPopularShows();
            break;
        case '/movie-details.html':
            displayMovieDetails();
            break;
        
        case '/tv-details.html':
            displayShowDetails();
            break;
        case '/search.html':
            search();
            break;

    }
   highLightActiveLink();

}

init();
