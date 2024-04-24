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
// const e = require("express");

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
  const isAuthenticated = req.session.isAuthenticated;
  res.render("pages/discover", { isAuthenticated });
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

// Display password change form
app.get("/user/password", auth, (req, res) => {
  if (req.session.isAuthenticated) {
    res.render("pages/change-password");
  } else {
    res.redirect("/login")
  }
});

// Handle password change form submission
app.post("/user/password", auth, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  console.log(oldPassword, newPassword, confirmPassword, "password")
  // Add logic to verify old password, match new and confirm passwords,
  // hash the new password, and update it in the database
 // const oldHashPassword = await bcrypt.hash(oldPassword, 10);
  const newHashPassword = await bcrypt.hash(newPassword, 10);
  const query = "SELECT * FROM users WHERE username = $1";
  const username = req.session.user.username
  const userDetails = await db.oneOrNone(query, username)
  console.log("PASSWORD", req.body)
  if (userDetails.username === username) {
    const validPassword = bcrypt.compareSync(oldPassword,userDetails.password)
    console.log(validPassword, "Password match")
    if (validPassword) {
      try {
        // Insert username and hashed password into the 'users' table
        await db.none("UPDATE users SET PASSWORD =$2 WHERE USERNAME = $1", [
          username,
          newHashPassword,
        ]);
        console.log("UPATE")
        res.status(400).render("pages/profile", {
          user: req.session.user,
          message: "You have successfully changed password",
          cpstatus: true,
          isAuthenticated: req.session.isAuthenticated
        })
      } catch (err) {
        console.log(err)
        console.log("pass", oldHashPassword, newHashPassword)
        res.status(500).render("pages/change-password",
          {
            message: "Internal error...unable to change password",
            user: req.session.user,
            cpstatus: false,
            isAuthenticated: req.session.isAuthenticated
          })
        // res.redirect("/profile"); // Redirect to profile page after password change
      }
    }else{
      res.status(500).render("pages/change-password",
      {
        message: "Old password entered is incorrect...unable to change password",
        user: req.session.user,
        cpstatus: false,
        isAuthenticated: req.session.isAuthenticated
      })
    }
  } else {
    console.log("ELSE", userDetails, oldHashPassword, newHashPassword)
    res.redirect("/profile")
  }




});

// Login
app.get("/login", (req, res) => {
  res.render("pages/login");
});
// Profile
app.get("/profile", async (req, res) => {
  console.log("currently within profile")
  if (req.session.user) {
    const options = {
      method: 'GET',
      url: 'https://a-randomizer-data-api.p.rapidapi.com/api/random/quotes',
      params: {
        count: '1',
        includeAuthor: 'true'
      },
      headers: {
        'X-RapidAPI-Key': '21730664e5msh7738f1c599723fcp1f8e2ejsn046d700905e3',
        'X-RapidAPI-Host': 'a-randomizer-data-api.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      res.render("pages/profile", 
      { isAuthenticated: req.session.isAuthenticated,
         user: req.session.user,quote:response.data })
    } catch (error) {
      console.error(error);
    }


  } else {
    res.redirect("/login")
  }
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
    console.log("User", user)
    req.session.user = user;
    req.session.isAuthenticated = true
    req.session.save();
    res.redirect("/discover");
  } else {
    res.render("pages/login", { message: "Incorrect password" });
  }
});
// *****************************************************
// <!-- Section 6 : Start Server-->
// *****************************************************
// starting the server and keeping the connection open to listen for more requests

app.listen(3000);
console.log("Server is listening on port 3000");
