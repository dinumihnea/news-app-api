A real world REST full API for a news app built with express framework.
API has public for read requests and private for data changing request. 
Private routes are secured based on json web token generated when user authenticates.

## Requirements
* `node.js 10.15.0 +`
* `mongodb server`
* `npm-run-all` for development mode

## How to run
1. clone the repository
2. run `npm install`
3. run `npm run build`
4. start your mongodb server
5. run the app `npm start`

Now your app is running on [http://localhost:8080](http://localhost:8080) (by default)

## Available Scripts

In the project directory, you can run:

### `npm dev`

Runs the app in the development mode on [http://localhost:8080](http://localhost:8080)

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>

### `npm run build` 
Builds TypeScript to JavaScript for production to the `build` folder.<br>

## Available endpoints
##### * All endpoints that gives a list can paginate the result by using `limit` & `offset` query params
##### * All endpoints are prefixed with current api version eg: [http://localhost:8080/api/v1/news](http://localhost:8080/api/v1/news)

##### Registration
* `GET /auth` returns an authentication token based on given `email` and `password`. 
This token must be provided as header with key `x-auth-token` for routes which require authorization. 

##### Users
* `GET /users` requires authorization: returns a list of users 
* `GET /users/:id` requires authorization: returns user model which match given `id` which can be also an email address
* `POST /users` creates a new user
* `PUT /users`  requires authorization updates a list of users 
* `DELETE /users/:id` requires admin role: removes user from the database by given `id`

##### Current user
* `GET /me` requires authorization: returns details about the current user

##### Bookmarks
* `GET /me/bookmarks` requires authorization: returns a list of bookmarks as news models of current user
* `POST /me/bookmarks` requires authorization: adds given news id as bookmark for current user
* `DELETE /me/bookmarks` requires authorization: removes given news id from bookmarks of current user

##### News
* `GET /news/search` returns a list of news which match given `q` query param 
* `GET /news` returns a list of news sorted by `creationDate` 
* `GET /news:/id` returns details about the news with given `id`
* `GET /tags/:tag` gives a list of news which match given tag
* `GET /categories/:category` gives a list of news with given category
* `POST /news` requires moderator or admin role: saves the given news
* `PUT /news` requires moderator or admin role: updates the given news
* `DELETE /news/:id` requires moderator or admin role: removes news from database by given `id`

##### Categories
* `GET /categories` returns a list of all categories
* `GET /categories/:key` returns a category model which match the given key
* `POST /categories` requires moderator or admin role: saves the given category
* `PUT /categories` requires moderator or admin role: updates the given category
* `DELETE /categories/:id` requires moderator or admin role: removes category from database by given `id`

##### Tags
* `GET /tags` returns a list of all tags
* `GET /tags/:id` returns a tag model which match the `id` or `key`
* `POST /tags` requires moderator or admin role: saves the given tag
* `PUT /tags` ignored - use delete and post instead
* `DELETE /tags/:key` requires moderator or admin role: removes tags from database by given `key` which can be an id as well.

## To do
* i18n results based on `language` header param
* integration tests
* more user details fields, including avatar, country, etc
