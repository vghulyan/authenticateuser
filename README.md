# authenticateuser
README

HOW TO RUN:
INSTALL NECESSARY PLUGINS:
e.g.: 
npm install mongoose cookie-parser express-session express passport passport-local body-parser --save


STEP 1: run MongoDB;
STEP 2: When running first time: uncomment lines: 40-49. This will save user, manager, admin, developer, tester to authenticatedusermodels mongo schema.
STEP 3: Comment lines: 40-49 and restart e.g. node server.js
STEP 4: Go to browser and type: http://localhost:3000 and enter login credentials e.g. admin:password

MONGODB queries:
db.authenticatedusermodels.find().pretty() -- list existing objects
db.authenticateduserhistories.find().pretty() -- lists login histories

TODO:
Retrieve list of histories from : db.authenticateduserhistories.find() and display on UI
