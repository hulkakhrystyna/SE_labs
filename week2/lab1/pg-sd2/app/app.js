// Import express.js
const express = require("express");

// Create express app
var app = express();

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Add static files location
app.use(express.static("static"));

// Get the functions in the db.js file to use
const db = require('./services/db');

/* Create a route for root
app.get("/", function(req, res) {
    res.render("index");
}); */

/* Create a route for root - /
app.get("/", function(req, res) {
    res.render("index", {'title':'My index page', 'heading':'My heading', 'paragraph':'Paragraph xxxxxxx', 'link':'Click'});
}); */

// Create a route for root - /
app.get("/", function(req, res) {
    // Set up an array of data
    var test_data = ['one', 'two', 'three', 'four'];
    // Send the array through to the template as a variable called data
    res.render("index", {'title':'My index page', 'heading':'My heading', 'data':test_data});
});

// Create a route for root - /
app.get("/", function(req, res) {
    res.send("Hello, Khrystyna");
});

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

app.get("/all_students", function(req,res) {
    sql = 'select * from Students';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results)
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

app.get("/student-single/:id", function(req, res) {
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
})

// Create a route for testing the db
app.get("/db_test", function(req, res) {
    // Assumes a table called test_table exists in your database
    sql = 'select * from test_table';
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

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});