// Import express.js
const express = require("express");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

app.use(express.urlencoded({ extended: true }));

// Get the functions in the db.js file to use
const db = require('./services/db');

// Set the sessions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Get the models
const { Student } = require("./models/student");

const { User } = require("./models/user");

// Create a route for root - /
app.get("/", function(req, res) {
    res.render("index");
});

/* Create a route for root - /
app.get("/", function(req, res) {
    res.render("index", {'title':'My index page', 'heading':'My heading', 'paragraph':'Paragraph xxxxxxx', 'link':'Click'});
}); */

/* Create a route for root - /
app.get("/", function(req, res) {
    // Set up an array of data
    var test_data = ['one', 'two', 'three', 'four'];
    // Send the array through to the template as a variable called data
    res.render("index", {'title':'My index page', 'heading':'My heading', 'data':test_data});
}); */


// Create a route for roehampton with some logic processing the request string
app.get("/roehampton", function(req, res) {
    console.log(req.url)
    let path = req.url;
    res.send(path.substring(0,3))
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name/:id", function(req, res) {
    const name = req.params.name;
    const id = req.params.id;

    const html = `
        <html>
            <head>
                <title>Hello</title>
            </head>
            <body>
                <h2>User Details</h2>
                <table border="1" cellpadding="5">
                    <tr>
                        <th>Name</th>
                        <th>ID</th>
                    </tr>
                    <tr>
                        <td>${name}</td>
                        <td>${id}</td>
                    </tr>
                </table>
            </body>
        </html>
    `;

    res.send(html);
});

// Task 1 JSON formatted listing of students
app.get("/all_students", function(req,res) {
    var sql = 'select * from Students';
     // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results)
    });
})

/*app.get("/all_students_formatted", function(req,res) {
    sql = 'select * from Students';
    var output = '<table border = "1px">';
    db.query(sql).then(results => {
        for (var row of results) {
            output += '<tr>';
            output += '<td>' + row.id + '</td>';
            output += '<td>' + '<a href="./single_student/' + row.id + '">' + row.name + '</a>' + '</td>';
            output += '</tr>';
        }
        output += '</table>';
        res.send(output);
    });
})*/

// Task 2 display a formatted list of students
app.get("/all-students-formatted", function(req, res) {
    var sql = 'select * from Students';
    db.query(sql).then(results => {
    	    // Send the results rows to the all-students template
    	    // The rows will be in a variable called data
        res.render('all-students', {data: results});
    });
});

/* app.get("/student-single/:id", function(req, res) {
    var stId = req.params.id;
    console.log(stId);
    var stSql = "select s.name as student, ps.name as programme, \
    ps.id as pcode from Students s \
    join Student_Programme sp on sp.id = s.id \
    join Programmes ps on ps.id = sp.programme \
    where s.id = ?";
    var modSql = "select * from Programme_Modules pm \
    join Modules m on m.code = pm.module \
    where programme = ?";
    db.query(stSql, [stId]).then(results => {
        console.log(results);
        var pCode = results[0].pcode;
        output = '';
        output += '<div><b>Student: </b>' + results[0].student + '</div>';
        output += '<div><b>Programme: </b>' + results[0].programme + '</div>';
        db.query(modSql, [pCode]).then(results => {
            output += '<table border="1px">';
            for (var row of results) {
                output += '<tr>';
                output += '<td>' + row.module + '</td>';
                output += '<td>' + row.name + '">' + row.name + '</a>' + '</td>';
                output += '</tr>';
            }
            output += '</table>';
            res.send(output);
        })
    })
}) */

/* Single student page.  Show the students name, course and modules
app.get("/student-single/:id", async function (req, res) {
    var stId = req.params.id;
    console.log(stId);
    // Query to get the required results from the students table.  
    // We need this to get the programme code for this student.
    var stSql = "SELECT s.name as student, ps.name as programme, \
    ps.id as pcode from Students s \
    JOIN Student_Programme sp on sp.id = s.id \
    JOIN Programmes ps on ps.id = sp.programme \
    WHERE s.id = ?";

    var stResult = await db.query(stSql, [stId]);
    console.log(stResult);
    var pCode = stResult[0]['pcode'];
    
    // Get the modules for this student using the programme code from 
    // the query above
    var modSql = "SELECT * FROM Programme_Modules pm \
    JOIN Modules m on m.code = pm.module \
    WHERE programme = ?";

    var modResult = await db.query(modSql, [pCode]);
    console.log(modResult);

    // Send directly to the browser for now as a simple concatenation of strings
    res.send(JSON.stringify(stResult) + JSON.stringify(modResult));
    }); */

// Task 3 single student page
app.get("/student-single/:id", async function (req, res) {
    var stId = req.params.id;
    // Create a student class with the ID passed
    var student = new Student(stId);
    await student.getStudentDetails();
    await student.getStudentProgramme();
    await student.getStudentModules();
    console.log(student);
    res.render('student', {student:student});
});

// JSON output of all programmes
app.get("/all-programmes", function(req, res) {
    var sql = 'select * from Programmes';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.json(results);
    });

});

// Single programme page (no formatting or template)
app.get("/programme-single/:id", async function (req, res) {
    var pCode = req.params.id;

    var pSql = "SELECT * FROM Programmes WHERE id = ?";
    var results = await db.query(pSql, [pCode]);

    var modSql = `
        SELECT *
        FROM Programme_Modules pm
        JOIN Modules m ON m.code = pm.module
        WHERE pm.programme = ?
    `;
    var modResults = await db.query(modSql, [pCode]);

    res.send(JSON.stringify(results) + JSON.stringify(modResults));
});

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
    // As we are not inside an async function we cannot use await
    // So we use .then syntax to ensure that we wait until the 
    // promise returned by the async function is resolved before we proceed
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Create a route for testing the db
app.get("/db_test/:id", function(req, res) {
    const id = req.params.id;
    // Assumes a table called test_table exists in your database
    sql = 'select name from test_table where id = ?';
    db.query(sql, [id]).then(results => {
        console.log(results);
        res.send(results)
    });
});

// Register
app.get('/register', function (req, res) {
    res.render('register');
});

// Login
app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password and redirect to the users single-student page
            await user.setUserPassword(params.password);
            console.log(req.session.id);
            res.send('Password set successfully');
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.email);
            res.send('Perhaps a page where a new user sets a programme would be good here');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            match = await user.authenticate(params.password);
            if (match) {
                req.session.uid = uId;
                req.session.loggedIn = true;
                console.log(req.session.id);
                res.redirect('/student-single/' + uId);
            }
            else {
                // TODO improve the user journey here
                res.send('invalid password');
            }
        }
        else {
            res.send('invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Create a route for /goodbye
// Responds to a 'GET' request
app.get("/goodbye", function(req, res) {
    res.send("Goodbye world!");
});

// Create a dynamic route for /hello/<name>, where name is any value provided by user
// At the end of the URL
// Responds to a 'GET' request
app.get("/hello/:name", function(req, res) {
    // req.params contains any parameters in the request
    // We can examine it in the console for debugging purposes
    console.log(req.params);
    //  Retrieve the 'name' parameter and use it in a dynamically generated page
    res.send("Hello " + req.params.name);
});

app.post('/add-note', async function (req, res) {
    params = req.body;
    // Adding a try/catch block which will be useful later when we add to the database
    var student = new Student(params.id);
    try {
         await student.addStudentNote(params.note);
         res.redirect('/student-single/' + params.id);
        }
     catch (err) {
         console.error(`Error while adding note `, err.message);
     }
     // Just a little output for now
     res.redirect('/student-single/' + params.id);

});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});