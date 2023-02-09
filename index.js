const express = require("express");
const cors = require("cors");
const app = express();
const mongodb = require("mongodb");
const mongoclient = mongodb.MongoClient;
const dotenv = require("dotenv").config();
const URL = process.env.DB;
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const nodemailer = require("nodemailer");


app.use(
  cors({
    orgin:"https://willowy-boba-d08696.netlify.app/" 
  })
);

app.use(express.json());

let account = [];



app.post("/user/register", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("password_rest_flow");

    //hash
    var salt = await bcrypt.genSalt(10); 
    var hash = await bcrypt.hash(req.body.password, salt); 
    // console.log(hash);

    req.body.password = hash;

    const user = await db.collection("users").insertOne(req.body);
    await connection.close();
    res.json({ message: "user created" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const connection = await mongoclient.connect(URL);
    const db = connection.db("password_rest_flow");

    const user = await db
      .collection("users")
      .findOne({ email: req.body.email });
      await connection.close();
    if (user) {
      const compare = await bcrypt.compare(req.body.password, user.password);
      if (compare) {
        const token = jwt.sign({_id:user._id},JWT_SECRET,{expiresIn:"2m"})
        res.json({ message: "Success"});
      } else {
        res.json({ message: "username or password incorrect" });
      }
    }else{
      res.json({ message: "username or password incorrect" });
    }
  } catch (error) {
    res.status(400).json({ message: "Something went wrong" });
  }
});

// app.post("/forgot", async (req, res) => {
//   try {
//     const connection = await mongoclient.connect(URL);
//     const db = connection.db("password_rest_flow");

//     const user = await db
//       .collection("users")
//       .findOne({ email: req.body.email });
//       await connection.close();
//     if (user) {
   

//      var composemail = {
//       from : 'ramk072897@gmail.com',
//       to: "ramkumareee28@gmail.com",
//       subject:'send mail using node.js',
//       text:"www.google.com"
// }

// sender.sendMail(composemail,function(error,info){
//   if(error)
//   {
//     console.log("Error"+error);
//   }else{
//     console.log("mail sent successfully" + info.response);
//   }
// })

//     }else{
//       res.json({ message: "username or password incorrect" });
//     }
//   } catch (error) {
//     res.status(400).json({ message: "Something went wrong" });
//   }
// });

app.listen(process.env.PORT || 3003);