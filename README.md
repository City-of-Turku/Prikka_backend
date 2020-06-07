## Backend Setup

-   Clone this repo
-   `cd TurkuMemories`
-   `npm install`
-   `npm start`  
    Make sure you have nodemon installed `npm install nodemon -g`

## Changelog:

-   20/03/2020:

### Memory model updated to match database column

-   'content' field replaced with 'description'

### (GET) /categories API moved to correct route

-   (GET) /categories should not be in memories API tree
-   Moved from routes/memory.js to routes/category.js
    Don't call with '/memory-management/categories' but '/category-management/categories'

### Removed 'alter' argument from db.sync() call

-   2020-06-07: https://github.com/sequelize/sequelize/issues/9653
    Changed to db.sync({alter : true}) , check in category.js how indexes should be created in order
	to not get the duplicate error.
-   db.sync({alter : true}) created duplicate key at each nodemon restart
-   Changed to db.sync(), please use mock-data.sql script in teams to import schema and mock data


*   12/01/2020 :

    -   Added folder 'my_turku_memories_nodejs'

        -   NodeJS/Express server countaining all the following APIs:
        -   -> SignUp
        -   -> Login
        -   -> Logout
        -   -> Forgot Password
        -   -> Add memories
        -   -> Remove Memories
        -   -> Add/Remove favorite

    -   Used with mongoDB for Dev.

    -   Go in the folders to see respective README.md.

*   10/01/2020 :

    -   AntiiRae First commit
    -   Added folder 'TurkuMemoriesBackend'
