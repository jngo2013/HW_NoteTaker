// require dependencies
const express = require('express');
const fs = require('fs');
const path = require('path');
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
  fs.readFile(database, "utf8" ,function (err, data){
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
    fs.readFile("./db/db.json",function (err, data){
      
      
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
      });
      res.json(newNotes);
    });

    app.delete("/api/notes/:id", function(req, res) {
      console.log(req.params);
      let deleteNotes =req.params.id;
      console.log(deleteNotes);
      console.log("hi")
      // read json file
      fs.readFile("./db/db.json","utf8",function (err, data) {
        if (err) throw err;
        
        //parse note data
        const dataNote = JSON.parse(data);
        console.log(dataNote);
            //create variable to find the index of an object inside an array
            let index = dataNote.findIndex(x => x.id == deleteNotes);
            //splice object with matching id
            dataNote.splice(index, 1);
        
          //rewrite json with updated notes
          fs.writeFile("./db/db.json",JSON.stringify(dataNote), function (err) {
            if(err){
              return console.log(err);
              
            }
            console.log("bye");
          })
          //respond to user with new notes
        console.log(dataNote);
        res.json(data);
      }
      )
    })
    
  });
  

  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  })