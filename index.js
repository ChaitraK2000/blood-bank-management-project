const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
var user = require("./models/info");
var mongo = require("mongodb").MongoClient;
var assert = require("assert");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const admin = require("./models/info2");
var nodemailer = require("nodemailer");
var path = require("path");
var check = 0;
var global_id;
app.use(bodyparser({ urlencoded: true }));
var publicDir = require("path").join(__dirname, "/public");
app.use(express.static(publicDir));

var url = mongoose.connect("mongodb://localhost/Donate");

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
//app.get('/stock',(req,res)=>{
// res.render('stock')
// })
app.get("/index", (req, res) => {
  res.render("index");
});
app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/contact", (req, res) => {
  res.render("contact");
});
app.get("/patient", (req, res) => {
  // res.render('patient',{blood});
  //   console.log(req);
  res.render("patient");
});
app.get("/donate", (req, res) => {
  res.render("donate");
});

app.get("/admin", (req, res) => {
  res.render("admin");
});
app.get("/info", (req, res) => {
  res.render("info");
});
app.get("/web", (req, res) => {
  res.render("web");
});
/*app.get("/profile", (req, res) => {
  res.render("profile");
});*/

app.post("/web", (req, res) => {
  const option = req.body.options;

  if (option == 1) {
    var resultArray = [];
    mongo.connect(url, function (err, db) {
      // assert.equal(null,err);
      var cursor = user.find().then((cursor) => {
        // console.log(cursor)
        // cursor.forEach(function(doc,err){
        //     // assert.equal(null,err);
        //     resultArray.push(doc);
        // },function(){
        //     db.close();
        res.render("stock", { items: cursor });
        // });
      });
    });
  }
});

app.get("/register", (req, res) => {
  const Username = req.body.user;
  console.log(Username);

  res.render("register");
});

/*app.post("/profile", (req, res, next) => {
  // res.render('admin')
  var resultArray = [];
  mongo.connect(url, function (err, db) {
    // assert.equal(null,err);
    var cursor = user.find().then((cursor) => {
      // console.log(cursor)
      // cursor.forEach(function(doc,err){
      //     // assert.equal(null,err);
      //     resultArray.push(doc);
      // },function(){
      //     db.close();
      res.render("profile", { items: cursor });
      // });
    });
  });
});*/

app.post("/stock", (req, res) => {
  // res.render('admin')
  console.log(req.params.blood);
  var resultArray = [];

  mongo.connect(url, function (err, db) {
    var cursor = user.find().then((cursor) => {
      res.render("stock", { items: cursor });
    });
  });
});

app.post("/patient", (req, res) => {
  //const Username = req.body.user;
  // const Password1 = req.body.pass;
  const blood = req.body.blood;
  console.log(blood);
  // console.log(Password1)
  user.find({ blood: blood }, function (err, founduser) {
    if (err) {
      console.log(err);
    } else {
      if (founduser.length != 0) {
        console.log(founduser);
        res.render("stock", { items: founduser });
      } else {
        res.render("not");
      }
    }
  });
});

app.post("/admin", (req, res) => {
  const Email = req.body.email;
  const Password = req.body.password;

  admin.findOne({ Email: Email, Password: Password }, function (
    err,
    founduser
  ) {
    if (err) {
      res.send(err);
    } else {
      if (founduser) {
        console.log(founduser);
        res.redirect("/web");
      } else {
        console.log("invalid credentials");
        res.redirect("/admin");
      }
    }
  });
});

app.post("/register", (req, res) => {
  const FirstName = req.body.name1;
  const LastName = req.body.name2;
  const age = req.body.age;
  const city = req.body.city;
  const email = req.body.email;
  const phone = req.body.phone;
  const address = req.body.address;
  const Username = req.body.user;
  const Password1 = req.body.pass;
  const Password2 = req.body.rpass;
  const gender = req.body.gender;
  const blood = req.body.blood;

  user.findOne({ email: email }, function (err, founduser) {
    if (err) {
      res.send(err);
    } else {
      if (founduser) {
        console.log("already registered");
        console.log(founduser);
        res.redirect("/login");
      } else {
        if (Password1 === Password2) {
          console.log(founduser);
          console.log("thank you for new account");

          const newUser = user({
            FirstName,
            LastName,
            age,
            city,
            email,
            phone,
            address,
            Username,
            Password1,
            Password2,
            gender,
            blood,
          });

          newUser.save((err) => {
            if (err) console.log(err);
            else {
              var transporter = nodemailer.createTransport({
                service: "gmail",
                auth: { user: "globinchain@gmail.com", pass: "ckbsgk123" },
              });

              var mailOptions = {
                from: "globinchain@gmail.com",
                to: email,
                subject: "Registration Sucessful ",
                text:
                  "Thank you for registering" +
                  " " +
                  "your username is" +
                  " " +
                  Username +
                  " " +
                  "your password is" +
                  " " +
                  Password1 +
                  " ",
              };

              transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                  console.log(error);
                } else {
                  console.log("Email sent successfully: " + info.response);
                }
              });
            }
          });
        }

        res.redirect("/thank");
      }
    }
  });
});

app.get("/thank", (req, res) => {
  res.render("Thank");
});
app.get("/upd", (req, res) => {
  res.render("upd");
});

app.post("/upd", (req, res) => {
  const age = req.body.age;
  const address = req.body.add;
  const contact = req.body.cont;
  const city = req.body.city;

  console.log("data assas");
  console.log(age);
  console.log(address);
  console.log(contact);
  console.log(city);

  const password = req.body.pass;
  if (age) {
    user.findOneAndUpdate(
      { Username: global_id },
      { $set: { age: age } },
      function (err, abc) {
        if (err) {
          console.log(err);
        } else {
          console.log("data assas");
          console.log(age);
          console.log(address);
          console.log(contact);
          console.log(city);

          console.log(abc);
          //res.render("login");
        }
      }
    );
  }
  if (address) {
    user.findOneAndUpdate(
      { Username: global_id },
      { $set: { address: address } },
      function (err, abc) {
        if (err) {
          console.log(err);
        } else {
          console.log("data assas");
          console.log(age);
          console.log(address);
          console.log(contact);
          console.log(city);
          console.log(abc);
          //res.render("login");
        }
      }
    );
  }

  if (city) {
    user.findOneAndUpdate(
      { Username: global_id },
      { $set: { city: city } },
      function (err, abc) {
        if (err) {
          console.log(err);
        } else {
          console.log(abc);
          //res.render("login");
        }
      }
    );
  }
  if (contact) {
    user.findOneAndUpdate(
      { Username: global_id },
      { $set: { phone: contact } },
      function (err, abc) {
        if (err) {
          console.log(err);
        } else {
          console.log(abc);
          // res.render("login");
        }
      }
    );
  }
  if (password) {
    user.findOneAndUpdate(
      { Username: global_id },
      { $set: { Password1: password } },
      function (err, abc) {
        if (err) {
          console.log(err);
        } else {
          console.log(abc);
          //res.render("login");
        }
      }
    );
  }
  res.render("login");
});

/*
const addrs =rreq.body.addrss;

if(address!= ' ')
{
  user .fim
}
*/

app.post("/login", (req, res) => {
  const Username = req.body.user;
  const Password1 = req.body.pass;
  global_id = Username;
  console.log(Username);
  console.log(Password1);
  user.find({ Username: Username, Password1: Password1 }, function (
    err,
    found
  ) {
    if (err) {
      console.log(err);
    } else if (found == 0) {
      console.log("user not found");
      res.redirect("/register");
    } else {
      {
        console.log(found);
        res.render("profile", { items: found });

        //if (option == update) {
        //res.render("upd");
        // }
      }
    }
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
