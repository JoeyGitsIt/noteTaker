const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const saveNote = require("./db/db.json");

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// returns notes.html
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

// returns index.html
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/index.html"))
);

// reads the db.json file and return all saved notes as JSON
app.get("/api/notes", (req, res) => res.json(saveNote));

// posts the new note to the json object
app.post("/api/notes", (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const id = uuidv4();
  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      id,
      title,
      text,
    };

    // Obtain existing reviews
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert the string into a json object
        const noteParse = JSON.parse(data);

        // Adds note to the notes object
        noteParse.push(newNote);

        // Write updated note into the json file
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(noteParse, null, 2),
          (checkErr) =>
            checkErr
              ? console.error(checkErr)
              : console.info("Successfully updated notes")
        );
      }
    });

    const response = {
      status: "success",
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in saving note");
  }
});

// deletes the note by id from the json object
app.delete("/api/notes/:id", (req, res) => {
  console.log(req.path);
  // Destructuring assignment for the items in req.body
  const path = req.path;
  console.log(path);

  if (path) {
    // Obtain existing reviews
    fs.readFile("./db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert the string into a json object
        const noteParse = JSON.parse(data);
        console.log(noteParse);
        // checks through all objects and deletes if id matches
        for (let i = 0; i < noteParse.length; i++) {
          if ("/api/notes/" + noteParse[i].id == path) {
            noteParse.splice(i, 1);
          }
        }

        // Store json object without the deleted note
        fs.writeFile(
          "./db/db.json",
          JSON.stringify(noteParse, null, 2),
          (checkErr) =>
            checkErr
              ? console.error(checkErr)
              : console.info("Successfully updated notes")
        );
      }
    });

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json("Error in saving note");
  }
});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
