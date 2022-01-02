# Setup

    ## npm i
    ## enviroments
    	- files
    		- .env
    		- test.env
    	- variables
    		- DB_URL => for MongoDB
    		-	JWT_SECRET => for jsonwebtoken

# Routes

    ## user
    	- /users/register
    	- /users/login
    	- /users/logout
    ## task
    	- /tasks => for create a task (Body => {decsription: string})
    	- /tasks/stop => for stop traking
    	-	/tasks/summary => to get file and json summary in response
