# NodeJS REST API

This project is an example of implentation of REST API in NodeJS framework with Express library, MongoDB and Mongoose ODM.

Project currently implements these REST concepts:

- proper HTTP status code in responses
- proper error message
- RESTful routing

Project uses:

- ES6
- eslint
- prettier
- nodemon, as development server
- JSON validation of DTO
- MVC with added layer of services to access database
- JWT for authentication / authorization

Features in development / still not implemented

- quering data through URL (filtering and sorting)
- insure user or client cannot be made inactive if currently has assigned note(s)
- quering users and clients through URL by name when assigning a new note
- unit tests as system verification

## Short description

- User can can have roles [Admin, Manager, Employee]
- User with roles admin and manager can register new users
- User can be active or inactive
- Client can be active or inactive
- User with any role can make a new note
- User with any role can update a note
- User with admin or manager role can delete a note
- User with admin or manager role can create, update or delete a client
- User or client that has notes assigned cannot be deleted
- User with any role can read a client
- Every note has to have a user and a client assigned to them
- Note can't be deleted if it's not completed

## Installation instruction

```npm
npm install
```

## Run instruction

```npm
npm run dev
```

## Credits

Djordje Tepavcevic <djordje.tepa@gmail.com>