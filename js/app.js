
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

function init(){
    const decadeLinks = document.querySelectorAll("#decadeNavHolder a");
    decadeLinks.forEach(function(link){
        link.addEventListener("click",changeDecade,false);
    })
    changeDecade(2000);
}

async function getFilms(decade) {
  const url = "./data/films/" + decade + ".json";
  try {
    const response = await fetch(url);
    const films = await response.json();
    // console.log(films);
    updateFilmList(films);
  } catch (error) {
    console.error(error.message);
  }
}
  

// function changeDecade(decade){
//     if(decade === 2000){
//         updateFilmsHeading(decade);
//         updateFilmList(filmsFrom2000s);
//     }else if(decade === 2010){
//         updateFilmsHeading(decade);
//         updateFilmList(filmsFrom2010s);
//     }
// }

function changeDecade(event){
    event.preventDefault()
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
    const filmListHolder = document.querySelector("#filmListHolder");
    filmListHolder.innerHTML="";
    films.forEach((film) => {
        //create a new <a></a> element
        const filmLink = document.createElement("a");
        //change the content of this element e.g. <a>Winter's Bone</a>
        filmLink.innerHTML = film.title;
        //set the href attribute on this element e.g. <a href="#">Winter's Bone</a>
        filmLink.setAttribute("href", "/films/"+film.id);
        //create a new <div></div> element
        const filmLinkPara = document.createElement("p");
        //put the <a> inside the <p> e.g. <p><a href="#">Winter's Bone</a></p>
        filmLinkPara.appendChild(filmLink);
        //put the <p> inside the parent <div> e.g. <div id="filmListHolder"><p><a href="#">Winter's Bone</a></p></div>
        filmListHolder.appendChild(filmLinkPara);
      });
}

//this call changeDecade() when the page loads

init();

// // const decades = [1990,2000,2010,2020];
// console.log(decades);
// // let currentDecade = 1990
// const decadeNavHolder = document.querySelector("#decadeNavHolder");
// const filmListHolder = document.querySelector("#filmListHolder");

// // function updateDecadeNavBar(){
// //     // decadeNavButtons = document.querySelector("#decadeNavHolder").childNodes;
// //     decadeNavButtons = document.querySelectorAll("#decadeNavHolder > button");
// //     console.log(decadeNavButtons);
// //     decadeNavButtons.forEach((navButton)=>{
// //         if(navButton.innerHTML == currentDecade){
// //             navButton.classList.add("selected");
// //         }else{
// //             navButton.classList.remove("selected");
// //         }
// //     })
// // }

// function updateFilmList(chosenDecade, films){
//     filmListHolder.innerHTML="";
//     if(films.length > 0){
//         filmListHolder.textContent=chosenDecade;
//         films.forEach((film)=>{
//             const filmLink = document.createElement("a");
//             filmLink.innerHTML = film.title;
//             filmLink.setAttribute("href","films/"+film.id)
//             const filmLinkDiv = document.createElement("div");
//             filmLinkDiv.appendChild(filmLink);
//             filmListHolder.appendChild(filmLinkDiv);
//         })
//     }else{
//         filmListHolder.textContent = "No films for the "+currentDecade+"s";
//     }

// }

// async function loadFilmData(chosenDecade){
//     const response = await fetch('./test/'+chosenDecade);
//     // const response = await fetch('./data/films/'+chosenDecade+'.json');
//     const films = await response.json();
//     updateFilmList(chosenDecade, films);
//     // updateDecadeNavBar();
// }


// function changeDecade(evnt){
//     chosenDecade = evnt.target.textContent;
//     loadFilmData(chosenDecade);
// }

// decades.forEach((decade)=>{
//     const decadeButton = document.createElement("button");
//     decadeButton.innerHTML = decade;
//     decadeButton.addEventListener("click",(evnt)=>{changeDecade(evnt)})
//     decadeNavHolder.appendChild(decadeButton);
// })


// loadFilmData(decades[0]);