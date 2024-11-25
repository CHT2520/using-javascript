# Intro to JavaScript

- Download this repository and unzip the folder.
- Open the folder in VS Code.
- Although JavaScript runs in a web browser. Some features of JavaScript will only work if the web page is on a server. The easiest way to do this VS Code is to install the 'Live Server' extension.
  - In VS Code, on the right-hand side menu click on extensions (it looks like some blocks with one separated from the others)
  - Search for 'live server' and install it.
  - Once it's installed, in the bottom right of VS Code click on 'Go Live' to launch the server. This will tell you a port number e.g. 5500
  - In a web browser enter localhost and the port number e.g. http://localhost:5500/ to view your page.
- The app should have some basic functionality.
  - The user can select a decade and the list of films from that decade are displayed.

## Making Sense of the Code

Here are some key points about how the app is working

- At the moment the data for the app is stored in two arrays `filmsFrom2000s` and `filmsFrom2010s` .
  - Inside _app.js_, have a good look at the structure of these arrays, note that each film is stored as a JavaScript object.

- Look at the bottom of *app.js*. The final line of code will call the function `init()`.
```javascript
function init(){
  // get hold of the HTML elements that have a class of decade-link
  const decadeLinks = document.querySelectorAll(".decade-link");
  // loop over these <a> elements
  decadeLinks.forEach(function(link){
      //when the user clicks on a link run the function changeDecade()
      link.addEventListener("click",changeDecade,false);
  })
}
```
- The function `init()` gets hold of the decade links and adds an event listener.
  - When the user clicks on one of these links the function `changeDecade()` will be executed. 
  - Look in the HTML, make sure you can see how these links have been selected. 

- Have a look in _app.js_ for the function `changeDecade()`.

```javascript
function changeDecade(event){
    // stop the default link action
    event.preventDefault()
    // get the text inside the selected <a> element
    const decade = event.target.innerHTML;
    updateFilmsHeading(decade);
    if(decade === "2000"){
        updateFilmList(filmsFrom2000s);
    }else if(decade === "2010"){
        updateFilmList(filmsFrom2010s);
    }
}
```
Every time an event happens e.g. the user clicks on an element. An `event` object is generated that can tell us information about the event e.g. the type of event and the element that was clicked (the `target` property). 
- This example uses the `target` property to get hold of the hyperlink that generated the event
- `innerHTML` is used to look inside this element for the content of the element. This gives us the name of the decade that was selected. 
- An `if` statement uses this value to call further functions `updateFilmsHeading()` and `updateFilmList()`

`updateFilmsHeading()` simply gets hold of the _H1_ element from the page and changes its content to show which decade has been selected.

```javascript
function updateFilmsHeading(decade) {
    // get hold of the HTML element with an id of filmsHeading
    const filmsHeading = document.querySelector("#filmsHeading");
    //change the content of this element e.g. <h1>2010s</h1>
    filmsHeading.innerHTML = "Films from the " + decade + "s";
}
```

The `updateFilmList()` function is similar, however changing the content of the element is a bit more complex.
- Instead of simply changing the text we need to insert a hyperlink for each film in an array.
- Have a good look through this function. The comments explain what each line is doing.
- In a browser 'right-click' on the page and select 'inspect'. View the HTML that has been generated by the `forEach` loop.

### Test your understanding

- How can you expand this example so that it also shows films from the 1990s
  - You will need to add a new array for films from the 1990s, just add a couple of films.
  - You will need to add a new button to the HTML page that the user can click on to display the films.
- It would be nice if the year of the film was displayed next to the title of the film e.g. _Winter's Bone (2010)_.
  - How can you modify the code in `updateFilmList()` to do this.

## Externalising the data and using the Fetch API
We don't want to hard code the date into the app, instead we want to load the data into the app. 
- First comment out the arrays at the top of _app.js_. We aren't going to need these anymore.
- Have a look in the data folder in VS Code.

  - Note that it contains a number of JSON files.
  - Open one of these files, note the structure of the JSON data.
    - See how the JSON data is slightly different to the plain JavaScripts arrays we have used so far.

- Add the following function in _app.js_
  - This function will load a JSON file.

```javascript
async function getFilms(decade) {
  const url = "./data/" + decade + ".json";
  try {
    const response = await fetch(url);
    const films = await response.json();
    console.log(films);
  } catch (error) {
    console.error(error.message);
  }
}
```
- Modify the `changeDecade()` function so that it calls `getFilms()` instead of `updateFilmList()`
  - Because we aren't having to switch between different arrays, we can also get rid of the `if` statement.

```javascript
function changeDecade(event){
    // stop the default link action
    event.preventDefault()
    // get the text inside the selected <a> element
    const decade = event.target.innerHTML;
    updateFilmsHeading(decade);
    getFilms(decade);
}
```
- Test the page in a browser.
- In a browser 'right-click' on the page, select 'inspect', and select the 'console' tab.
  - We can use the console to display messages for debugging.
  - In the `getFilms()` function find the line of code that outputs to the console:
    ```javascript
    console.log(films);
    ```
  - In the console, you should be able to view this array of films that has been loaded from a JSON file.
- Click on the buttons and see how the results change in the console (the 1990 button won't work).
- Still in the browser, use the network tab to see the requests being made for the JSON data.

Finally, instead of showing the results in the console, we want them to appear in the page

- In `getFilms()` change the line

```javascript
console.log(films);
```

To

```javascript
updateFilmList(films);
```

- Test this in a browser. The app should work as it did before, however, now the data is being loaded from the JSON files.

### Test your understanding

- Create another JSON file, for storing data about films from the 1990s.
- Check this works.

## Integrating with a Laravel Back-End

- We don't want to write our own JSON data, instead we'd like to get the data from a back-end i.e. a database.
- We'll use the basic film app that we crated back in Week 5.
  - If you don't have your own copy of this work you can get a copy from https://github.com/CHT2520/intro-to-laravel-code.

First we'll make some changes to the Laravel app, and then we'll integrate the JavaScript.

### Making Changes to the Laravel App

- Open _FilmController.php_
- Modify the `index()` method in the _FilmController_ to look like the following:
  - The model doesn't currently have a method called `byDecade()`, we'll add this next using a query scope.

```php
  function index()
  {
      $films = Film::byDecade(2000)->get();
      return view('films.index', ['films' => $films]);
  }
```

- Open the model and add a `scopeByDecade()` method.
  - This uses a 'query scope' that allows us to customise queries on a model
    - In this case it will run an SQL query that retrieves all the films that have a year value within the specified range.
    - You can read more about query scopes here: https://laravel.com/docs/11.x/eloquent#query-scopes

```php
namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Film extends Model
{
    public function scopeByDecade(Builder $query, int $year): void
    {
        $query
            ->where('year', '>=', $year)
            ->where('year', '<', ($year + 10));
    }
}
```

- Finally, we need to modify the view
- Open the _index.blade.php_ view and change it to the following
  - it simply adds the hyperlinks for selecting the decade.

```html
  <x-layout title="List the films">
    <div class="main-content">
      <div id="decadeNavHolder">
            <a href="/films" class="decade-link">2000</a>
            <a href="/films" class="decade-link">2010</a>
        </div>
      <h1 id="filmsHeading">Films from the 2000s</h1>
      <div id="filmListHolder">
        @foreach ($films as $film)
        <p>
          <a href="/films/{{$film->id}}"> {{$film->title}} </a>
        </p>
        @endforeach
      </div>
    </div>
  </x-layout>
```

- Check this works, the homepage of the app should only show films from the 2000s.

## Integrating JavaScript

- In the _public_ folder add a new folder, call it _js_
- Copy the _app.js_ file from the earlier example and put it in this folder.
- Modify the URL used for the `fetch`. Change the URL so we call a Laravel route instead of a JSON file. To do this change

```javascript
const url = "./data/films/" + decade + ".json";
```

to

```javascript
const url = "json/films/" + decade;
```

- Next, we need to add a route for this URI. In _web.php_ add the following route

```php
Route::get('/json/films/{decade}', [FilmController::class, 'listByDecade']);
```

- Add a `listByDecade()` method in FilmController.
  - Note this method doesn't return a view, it returns JSON data

```php
    function listByDecade($decade = 2000)
    {
        $films = Film::byDecade($decade)->get();
        return response()->json($films);
    }
```

- Test this in a browser i.e. enter the URL http://localhost/json/films/2010
  - You should see the returned JSON data
- Finally, we need to link to *app.js* in *index.blade.php*
  - Add the following at the end of this file before the closing ` </x-layout>` tag.

```html
  <script src="{{asset('js/app.js')}}"></script>
```
- Test this works. 
- Use the network tab in the browser to see the app loading the JSON files from the Laravel back-end. 
## Limitations

This is a very simple example. Here are some ways it could be improved.
- If the user doesn't have JavaScript enabled in their browser, they won't be able to view the different decades. We could use the principle of 'progressive enhancement' make the app work without the use of JavaScript. We could then use the JavaScript to provide an enhanced experience for users that do have it enabled. 
  - This isn't as tricky as it sounds. We would have to pass the decade as a route parameter e.g.
  ```php
  Route::get('/films/decade/{decade}', [FilmController::class, 'index']);
  ```
  And then use this decade value in the FilmController to only show films from the decade.
  ```php
  function index($decade = 2000)
  {
      $films = Film::byDecade($decade)->get();
      return view('films.index', ['films' => $films, 'decade'=>$decade]);
  }
  ```
  - If we change the links in *index.blade.php* to use the new route, the app would work without the user of JavaScript. 
- The decade links are hard-coded into the HTML. Really these should be dynamically generated e.g. by querying the database to get a list of all possible decades, and then dynamically generating the decade buttons in *index.blade.php*.
- Add some error checking e.g. if there aren't any films in the database from the selected decade we should display a suitable message to the user. 


