import React, { useState, useEffect } from 'react'
import './App.css'
import Note from './Components/Note'
import noteService from './services/notes'
import Notification from './Components/Notification'
import Footer from './Components/Footer'
import axios from 'axios'

const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/notes')
      .then(res => {
        setNotes(res.data)
      })
  }, [])

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      date: new Date().toISOString(),
      important: Math.random() > 0.5
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  console.log('render', notes.length, 'notes')

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true)

  const notesList = notesToShow.map((note) => (
    <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
  ))

  const handleNoteChange = (event) => {
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const toggleImportanceOf = (id) => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }


    noteService
    .update(id, changedNote).then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      console.log(error)
      setErrorMessage(
        `Error: The note '${note.content}' was already removed from server`
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

  

  return (
    <div>
      <h1 className="appName">Notepad</h1>
      <Notification message={errorMessage} />
      <div>
        <button id="showImportantButton" onClick={() => setShowAll(!showAll)}>
          Show {showAll ? 'starred' : 'all'}
        </button>
      </div>
      <ul className="noteList">{notesList}</ul>
      <form className="inputNoteForm" onSubmit={addNote}>
        <input placeholder="Enter some text..." value={newNote} onChange={handleNoteChange} />
        <button type='submit'>Save</button>
      </form>
      <Footer />
    </div>
  )
}

export default App
