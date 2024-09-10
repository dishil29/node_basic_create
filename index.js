const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { error } = require('console');


const app = express();
dotenv.config();

const port = process.env.PORT || 3000; 

const db_username = process.env.MONGODB_USERNAME;
const password = process.env.MONGODB_PASSWORD;

mongoose.connect(`mongodb+srv://${db_username}:${password}@cluster0.0kqte.mongodb.net/registrationFormDB`, { 
  useNewUrlParser : true,
  useUnifiedTopology: true,
})

const registrationSchema = new mongoose.Schema({
  name: String,
  email: String,
  phoneNumber: Number,
  password:String
});

const Registration = mongoose.model("Registration",registrationSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/",(req,res)=>{
  res.sendFile(__dirname+"/pages/register.html");
})

app.post("/register",async (req,res ) =>{
  try{
    const {name,email,phno,password} = req.body;
    // console.log(String(name));
    // console.log(email);
    // console.log(phno);
    const existing = await Registration.findOne({email: email});
    console.log(existing);
    if(!existing) {
      const regisrationData = new Registration({
        name,email,phoneNumber : phno,password
      });
      await regisrationData.save();
      res.redirect("/home");
    }
    else{
      res.send("user already exist");
    }
  }catch (error) {
    console.log("Error in Registration please try again  Error: " + String(error));
    res.redirect('/');
  }
})

app.get("/home", (req,res)=>{
  res.sendFile(__dirname+"/pages/home.html");
})

app.listen(port, ()=>{
  console.log(`server is running on port ${port}`);
})