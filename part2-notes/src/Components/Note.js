import React from 'react'
import yellow_star from './../images/star_filled.png'
import empty_star from './../images/star_empty.png'

const Note = ({ note, toggleImportance }) => {
  const label = note.important ? yellow_star : empty_star

  //       <button onClick={toggleImportance}>{label}</button>

  return (
    <li className='note'>
      {note.content}
      <img id="importantIcon" onClick={toggleImportance} src={label} />
    </li>
  )
}

export default Note
