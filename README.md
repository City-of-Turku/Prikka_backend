
# Prikka application
The Prikka application is used for gathering memories, events and stories about the City of Turku. The application consists of prikka_backend and prikka_ui.  

This project was started and mainly done as a Capstone-project at Turun AMK. The first version of the Prikka application does only work in browsers in a good-size monitor.
(första versionen av Prikka programmet är inte gjort för att användas på telefoner eller paddor) 

## Backend

Express js is used with sequelize to handle database interactions, which consists of storing and fetching memories and userdata.   
User authentication is done with auth0, but will be transferred to Turku tunnistamo in the future. 

### Setup 
Setting up a development environment.

1. Clone repo
   
2. Make sure you have installed node v10 (or newer).  
   Install node dependencies.

   ```
   cd backend
   npm install
   ```
3. You will also need a .env file   
   Example .env file, for local development
    ```
    AUTH0_DOMAIN=
    AUTH0_CLIENT_ID=
    AUTH0_CLIENT_SECRET=
    AUTH0_CALLBACK_URL=http://localhost:4500/api/auth-management/callback
    LOGIN_REDIRECT=/api/auth-management/login
    FRONTEND_LOCATION=http://localhost:3000/
    PORT=4500
    SESSION_SECRET=fafafafafafafafafa
    ```

4. A database is needed before starting. Docker is recommended to use, but use anything you want to host your local DB.  
Example of docker-compose.yml for a mysql database setup for this project.

   ```
   version: '3'
   services:
     mysql:
       image: mariadb
       container_name: myturkumemories_db
       ports:
         - 3306:3306
       environment:
         MYSQL_DATABASE: 'myturkumemories_db'
         MYSQL_ROOT_PASSWORD: password
       volumes:
         - ./db-data/mysql-datadir:/var/lib/mysql
   
   ```
- Database settings is configured in config/config.json
 
5. Make sure you have nodemon installed  
   
   ```
   npm install nodemon -g
   ```
   
6. Start it
    ```
   npm start
   ```

