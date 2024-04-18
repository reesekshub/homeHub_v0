// *****************************************************
// <!-- Section 1 : Import Dependencies -->
// *****************************************************

const express = require("express"); // To build an application server or API
const app = express();
const handlebars = require("express-handlebars");
const Handlebars = require("handlebars");
const path = require("path");
const pgp = require("pg-promise")(); // To connect to the Postgres DB from the node server
const bodyParser = require("body-parser");
const session = require("express-session"); // To set the session object. To store or access session data, use the `req.session`, which is (generally) serialized as JSON by the store.
const bcrypt = require("bcrypt"); //  To hash passwords
const axios = require("axios"); // To make HTTP requests from our server. We'll learn more about it in Part C.
const e = require("express");

// *****************************************************
// <!-- Section 2 : Connect to DB -->
// *****************************************************

// create `ExpressHandlebars` instance and configure the layouts and partials dir.
const hbs = handlebars.create({
  extname: "hbs",
  layoutsDir: __dirname + "/views/layouts",
  partialsDir: __dirname + "/views/partials",
});

// database configuration
const dbConfig = {
  host: "db", // the database server
  port: 5432, // the database port
  database: process.env.POSTGRES_DB, // the database name
  user: process.env.POSTGRES_USER, // the user account to connect with
  password: process.env.POSTGRES_PASSWORD, // the password of the user account
};

const db = pgp(dbConfig);

// test your database
db.connect()
  .then((obj) => {
    console.log("Database connection successful"); // you can view this message in the docker compose logs
    obj.done(); // success, release the connection;
  })
  .catch((error) => {
    console.log("ERROR:", error.message || error);
  });

// *****************************************************
// <!-- Section 3 : App Settings -->
// *****************************************************

// Register `hbs` as our view engine using its bound `engine()` function.
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use("/resources", express.static("resources"));
app.use(bodyParser.json()); // specify the usage of JSON for parsing request body.

// initialize session variables
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// *****************************************************
// <!-- Section 4 : APIs--> Put APIs HERE!!!!
// *****************************************************

const auth = (req, res, next) => {
  if (!req.session.user) {
    // Default to login page.
    return res.redirect("/login");
  }
  next();
};

app.get("/", (req, res) => {
  res.redirect("/login"); //this will call the /anotherRoute route in the API
});

app.get("/discover", (req, res) => {
  res.render("pages/discover", { title: "Discover" });
});

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log("Error destroying session:", err);
      res.send("Error logging out");
    } else {
      res.render("pages/logout");
    }
  });
});

app.get("/register", (req, res) => {
  res.render("pages/register");
});

// Register
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is empty
  if (!username || !password) {
    return res.status(400).send("Username and password are required");
  }

  try {
    // Hash the password using bcrypt library
    const hash = await bcrypt.hash(password, 10);

    // Insert username and hashed password into the 'users' table
    await db.none("INSERT INTO users(username, password) VALUES($1, $2)", [
      username,
      hash,
    ]);
    res.redirect("/login");
  } catch (error) {
    res.status(500).send("Error creating user");
  }
});

// Login
app.get("/login", (req, res) => {
  res.render("pages/login");
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  let user;
  let match;
  let userExists;
  const query = "SELECT * FROM users WHERE username = $1";

  user = await db.oneOrNone(query, username);
  if (user === null) {
    res.render("pages/register", {
      message: "User does not exist, Please Register",
    });
  } else {
    match = await bcrypt.compare(password, user.password);
    userExists = true;
  }

  if (match === true) {
    req.session.user = user;
    req.session.save();
    res.redirect("/discover");
  } else {
    res.render("pages/login", { message: "Incorrect password" });
  }

  //valid user:
  //user: tester1
  //pass: test1
});


// ********************* HEALTH APIS START********************************



// ********************* HEALTH APIS END********************************

//local weather!!!!!!here
// let city = "";
// let apiKey = "your_api_key";

// let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=zh_cn`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);

//     let cityName = data.name;
//     let temperature = Math.round(data.main.temp - 273.15);
//     let description = data.weather[0].description;
//     let iconCode = data.weather[0].icon;

//     document.querySelector(".city").textContent = cityName;
//     document.querySelector(".temp").textContent = `${temperature}°C`;
//     document.querySelector(".description").textContent = description;
//     document.querySelector(".icon").setAttribute("src", `http://openweathermap.org/img/w/${iconCode}.png`);
//   })
//   .catch(err => {
//     console.log(err);
//   });

// *****************************************************
// <!-- Section 5 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests

app.listen(3000);
console.log("Server is listening on port 3000");
