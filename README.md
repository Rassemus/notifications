# Notifications

The purpose of the project is to demonstrate how it is possible to send notifications to subscribers and how the application works offline.
The project contains two different server implementations.
- JSON
- MongoDB

### Getting started
Clone the repository
```
git clone
```
Install dependencies
```
npm install
```
Generate vapid keys
```
./node_modules/.bin/web-push generate-vapid-keys
```
Create .env file in the backend folder and add the following information.
```
PUBLIC_VAP_ID_KEY=""
PRIVETE_VAP_ID_KEY=""
JWT_SECRET= ""
PORT = ""
MAIL_TO = "mailto:<your email>"
```
> [!NOTE]
> Select the database to use
>#### JSON
>Start JSON server
>```
>json-server --watch db.json
>```
>db.js file contains test users. Everyone's password is very secure 1234.
>#### MONGO
>Connect your mongoDB using the connect string.
>- .env
>```
>MONGO_URI=""
>```
### Start the project
```
cd ./backend/
```
```
npm start server.js
```
Or if using nodemon
```
npx nodemon server.js
```
> [!IMPORTANT]
> To login a user, use Postman to get a token and user_id.
> Add the token and id manually as a cookie.
> - token: < SET THE TOKEN HERE >
> - user_id: < SET THE USER ID HERE >

> [!CAUTION]
> If the program does not work properly, try clearing the cache
