//The data for the application
// const filmsFrom2000s = [
//     {id:4, title: 'The Incredibles', year:2004},
//     {id:7, title:'Spirited Away', year:2001},
//     {id:13, title: 'Mean Girls', year:2004}
// ];

// const filmsFrom2010s = [
//     {id:3, title:"Winter's Bone", year:2010},
//     {id:10, title:'Gravity',year:2013},
//     {id:11, title:'Arrival',year:2016},
//     {id:12, title:'Wonder Woman',year:2017},
//     {id:16, title:'Get Out',year:2017}
// ];

function changeDecade(event){
    // stop the default link action
    event.preventDefault()
    // get the text inside the selected <a> element
    const decade = event.target.innerHTML;
    updateFilmsHeading(decade);
    getFilms(decade);
}
function updateFilmsHeading(decade) {
    // get hold of the HTML element with an id of filmsHeading
    const filmsHeading = document.querySelector("#filmsHeading");
    //change the content of this element e.g. <h1>2010s</h1>
    filmsHeading.innerHTML = "Films from the " + decade + "s";
}
function updateFilmList(films){
    // get hold of <div id="filmListHolder">
    const filmListHolder = document.querySelector("#filmListHolder");
    // clear out the contents of the this div
    filmListHolder.innerHTML="";
    //loop over the array of films
    films.forEach((film) => {
        //create a new <a></a> element
        const filmLink = document.createElement("a");
        //change the content of this element e.g. <a>Winter's Bone</a>
        filmLink.innerHTML = film.title;
        //set the href attribute on this element e.g. <a href="/films/3">Winter's Bone</a>
        filmLink.setAttribute("href", "/films/"+film.id);
        //create a new <p></p> element
        const filmLinkPara = document.createElement("p");
        //put the <a> inside the <p> e.g. <p><a href="#">Winter's Bone</a></p>
        filmLinkPara.appendChild(filmLink);
        //put the <p> inside the parent <div> e.g. <div id="filmListHolder"><p><a href="#">Winter's Bone</a></p></div>
        filmListHolder.appendChild(filmLinkPara);
      });
}

function init(){
  // get hold of the HTML elements that have a class of decade-link
  const decadeLinks = document.querySelectorAll(".decade-link");
  // loop over these <a> elements
  decadeLinks.forEach(function(link){
      //when the user clicks on a link run the function changeDecade()
      link.addEventListener("click",changeDecade,false);
  })
}
async function getFilms(decade) {
    const url = "./data/" + decade + ".json";
    try {
      const response = await fetch(url);
      const films = await response.json();
      updateFilmList(films);
    } catch (error) {
      console.error(error.message);
    }
  }

//call the function init() when the page loads
init();
