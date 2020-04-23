// require dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
// const databasePath = path.join(__dirname, "/db/db.json");
// uuid generates random ids
const uuid = require('uuid/v4');
const database = "./db/db.json";
// set up express app
const app = express();
const PORT = 3001;
// express middleware
app.use(express.urlencoded({ extended: true }));
//body parsing
app.use(express.json());
app.use(express.static("public"));
// // notes.html
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
  });
// return all saved notes in database as JSON
app.get("/api/notes", function(req, res) {
  fs.readFile(database, "utf8" ,function (err,data){
    if (err) {
      console.log(err);
    }
   let notes = JSON.parse(data)
   res.json(notes);
  })
  });

  app.post("/api/notes", function(req, res) {
    let newNotes = req.body;
    newNotes.id = uuid();
    fs.readFile("./db/db.json",function (err,data){
      
      
      //parse data
      let postNote = JSON.parse(data);
      console.log(typeof postNote);
      //store notes
      postNote.push(newNotes);
      //stringify data
      let setNote = JSON.stringify(postNote);
      

      console.log (newNotes.id);

      //write file  
      console.log(newNotes);
      fs.writeFile("./db/db.json",setNote, function (err,data){
        if(err){
          throw err;
        }
      })
      res.json(newNotes);
      
    })
  });
  

  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });