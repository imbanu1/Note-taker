console.log('Current directory:', __dirname);

const express = require ('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT =   process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const dbFilePath = path.join(__dirname, 'db.json');

function generateId() {
    return Date.now().toString();
  }

//Html routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//API routes
app.get('/api/notes', (req, res) => {
    const notes = getNotes();
    res.json(notes);
  });
  
  app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = generateId();

    const notes = getNotes();
    notes.push(newNote);
    saveNotes(notes);
    res.json(newNote);
  });
  
  app.delete('/api/notes/:id', (req, res) => {
    const noteId = parseInt(req.params.id);
    const notes = getNotes().filter((note) => note.id !== noteId);
    saveNotes(notes);
    res.json({ msg: 'Note deleted' });
  });

  //functions
  function getNotes() {
    try {
      const data = fs.readFileSync(dbFilePath, 'utf8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error reading notes:', error.message);
      return [];
    }
  }
  
  function saveNotes(notes) {
    try {
      fs.writeFileSync(dbFilePath, JSON.stringify(notes, null, 2));
    } catch (error) {
      console.error('Error saving notes:', error.message);
    }
  }
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });