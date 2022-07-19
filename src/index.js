import React from 'react';
import {useEffect, useRef} from 'react';
import ReactDOM from 'react-dom/client';
import { nanoid } from 'nanoid'
import './index.css';
import folder from './img/folder.jpg'
import Notebook from './components/Notebook'
import Note from './components/Note'
import { indexOf, update } from 'lodash';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentlySelectedNotebookId: this.props.localNotebooks[0].id,
      currentlySelectedNote: null,
      notebooks: this.props.localNotebooks
    }

    this.handleInput = this.handleInput.bind(this);
    this.addNotebook = this.addNotebook.bind(this);
    this.deleteNotebook = this.deleteNotebook.bind(this);
    this.openNotebook = this.openNotebook.bind(this);
    this.updateNotebook = this.updateNotebook.bind(this);
    this.addNote = this.addNote.bind(this);
    this.openNote = this.openNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
    this.closeNote = this.closeNote.bind(this);
  }

  handleInput(e) {
    let updatedNote = this.state.currentlySelectedNote;
    if(e.target.name === 'noteAreaTitle') {
      updatedNote.title = e.target.value;
    } else {
      updatedNote.body = e.target.value;
    }

    let updatedNotebooks = this.state.notebooks.map((notebook) => {
      if(notebook.id === updatedNote.notebook) {
        let updatedNotebook = notebook;
        let updatedNotes = notebook.notes.map((note) => {
          if(note.id === updatedNote.id) {
            return updatedNote
          } else {
            return note
          }
        });
        updatedNotebook.notes = updatedNotes;
        return updatedNotebook
      } else {
        return notebook
      }
    })

    this.setState((prevState) => ({
      ...prevState,
      notebooks: updatedNotebooks,
      currentlySelectedNote: updatedNote
    }), () => {
      localStorage.setItem('notebooks', JSON.stringify(this.state.notebooks));
    });


  }

// --- NOTEBOOK FUNCTIONS --- --- NOTEBOOK FUNCTIONS --- --- NOTEBOOK FUNCTIONS --- --- NOTEBOOK FUNCTIONS --- 
  addNotebook(){
    let newNotebook = {
      id: nanoid(16),
      title: null,
      notes: []
    }

    this.setState((prevState) => ({
      ...prevState,
      notebooks: [...prevState.notebooks, newNotebook],
      currentlySelectedNotebookId: newNotebook.id
    }), () => {
      localStorage.setItem('notebooks', JSON.stringify(this.state.notebooks));
    })

  }

  deleteNotebook(e) {
    e.stopPropagation();
    if(this.state.notebooks.length != 1) {
      let object = JSON.parse(e.target.dataset.object);
      let updatedNotebooks = this.state.notebooks.map(notebook => notebook);
      let index = 0;
      let indexOf;

      updatedNotebooks.forEach((notebook) => {
        if(notebook.id === object.id) {
          indexOf = index;
        }
        index++;
      });

      updatedNotebooks.splice(indexOf, 1);

      let notebookIsSelected = object.id === this.state.currentlySelectedNotebookId ? true : false;

      this.setState((prevState) => {
        return {
          ...prevState,
          notebooks: updatedNotebooks,
          currentlySelectedNotebookId: notebookIsSelected ? prevState.notebooks[0].id : prevState.currentlySelectedNotebookId
        }
      }, () => {
        localStorage.setItem('notebooks', JSON.stringify(updatedNotebooks));
      });
    } else {
      alert('You cannot delete the last notebook. Add one with the name you want then delete this one.');
    }
  }

  openNotebook(e) {
    let notebook = JSON.parse(e.target.dataset.object);

    this.setState((prevState) => ({
      ...prevState,
      currentlySelectedNotebookId: notebook.id
    }));
  }

  updateNotebook(prevNotebook) {
    let updatedNotebooks = this.state.notebooks.map((notebook) => {
      if(notebook.id === prevNotebook.id) {
        return prevNotebook
      } else {
        return notebook
      }
    })
    this.setState((prevState) => ({...prevState, notebooks: updatedNotebooks}), () => {
      localStorage.setItem('notebooks', JSON.stringify(this.state.notebooks));
    });
  }



// --- NOTE FUNCTIONS --- --- NOTE FUNCTIONS --- --- NOTE FUNCTIONS --- --- NOTE FUNCTIONS --- --- NOTE FUNCTIONS --- 

  addNote() {
    let currentNotebook = this.state.currentlySelectedNotebookId
    let currentDate = new Date();
    let newNote = {
      id: nanoid(16),
      title: "New note",
      body: '',
      dateCreated: currentDate.toLocaleString('en-US'),
      dateModified: currentDate.toLocaleString('en-US'),
      dateMY: currentDate.toLocaleString('default', {month: 'long'}) + ' ' + currentDate.getFullYear(),
      dateDay: currentDate.getDate(),
      notebook: currentNotebook
    }

    let updatedNotebooks = this.state.notebooks.map((notebook) => {
      if(notebook.id === currentNotebook) {
        notebook.notes.push(newNote)
        return notebook
      } else {
        return notebook
      }
    });

    this.setState((prevState) => ({
      ...prevState,
      currentlySelectedNote: newNote,
      notebooks: updatedNotebooks
    }), () => {localStorage.setItem('notebooks', JSON.stringify(updatedNotebooks))});
  }

  openNote(e) {
    let note = JSON.parse(e.currentTarget.dataset.object);

    this.setState((prevState) => ({
      ...prevState,
      currentlySelectedNote: note,
    }))
  }

  deleteNote() {
    let note = this.state.currentlySelectedNote;
    let index = 0;
    let indexOf;

    let updatedNotebooks = this.state.notebooks.map((notebook) => {
      if(notebook.id === note.notebook) {
        let updatedNotebook = notebook;

        updatedNotebook.notes.forEach((noat) => {
          if(noat.id === note.id) {
            indexOf = index;
          }
          index++;
        });

        updatedNotebook.notes.splice(indexOf, 1);

        return updatedNotebook;
      } else {
        return notebook;
      }
    });

    let noteIsSelected = note.id === this.state.currentlySelectedNote.id ? true : false;

    this.setState((prevState) => {
      return {
        ...prevState,
        notebooks: updatedNotebooks,
        currentlySelectedNote: noteIsSelected ? null : prevState.currentlySelectedNote
      }
    }, () => {
      localStorage.setItem('notebooks', JSON.stringify(updatedNotebooks));
    });
  }

  closeNote() {
    this.setState((prevState) => ({
      ...prevState,
      currentlySelectedNote: null
    }));
  }

  render() {
    let notebookElements = this.state.notebooks.map((notebook) => {
      return <Notebook key={notebook.id}
                       object={notebook}
                       isSelected={this.state.currentlySelectedNotebookId === notebook.id ? true : false}
                       deleteNotebook={this.deleteNotebook}
                       openNotebook={this.openNotebook}
                       updateNotebook={this.updateNotebook}
            />
    });

    let currentNotebook = this.state.notebooks.find(notebook => notebook.id === this.state.currentlySelectedNotebookId);
    let noteElements = currentNotebook.notes.map((note) => {
      return <Note openNote={this.openNote} key={note.id} object={note}/>
    });

    return (
      <div className='viewport'>
        <header>
          <div className='header-logo-div'>
            <img src={folder} className='header-logo' alt='logo'/>
          </div>
          <h1 className='header-title'>Notes App</h1>
          <div className='media-links'>
            <span className='media-symbol' role="img" aria-label='boop'>📬</span>
            <span className='media-symbol' role="img" aria-label='boop'>📚</span>
            <span className='media-symbol' role="img" aria-label='boop'>🪟</span>
          </div>
        </header>
        <div className='notebook-bar'>
          {notebookElements}
          <button onClick={this.addNotebook} className='add-notebook-btn'>+</button>
        </div>
        <div className='notes-panel'>
          {noteElements}
          <button onClick={this.addNote} className='add-note-btn'>+</button>
        </div>
        <div className='note-area'>
          {this.state.currentlySelectedNote != null && <div className='na-title'>
              <div className='nat-date-div'>
                <p className='natd-created'>Created: {this.state.currentlySelectedNote.dateCreated}</p>
                <p className='natd-modified'>Modified: {this.state.currentlySelectedNote.dateModified}</p>
              </div>
              <input 
                id='noteTitleInput'
                name='noteAreaTitle'
                type='text'
                className='nat-title'
                value={this.state.currentlySelectedNote.title}
                onChange={this.handleInput}
              />
              <div className='nat-controls-div'>
                <button onClick={this.deleteNote} className='nat-controls'>🗑</button>
                <button onClick={this.closeNote} className='nat-controls'>🗵</button>
              </div>
          </div> }

          {this.state.currentlySelectedNote != null && <div className='na-body-div'>
            <textarea 
              id='noteBodyTextArea'
              name='noteAreaBody'
              value={this.state.currentlySelectedNote.body}
              className='na-body'
              onChange={this.handleInput}>
            </textarea>
          </div> }
        </div>
      </div>
    )
  }
}



if(localStorage.getItem('notebooks') === null) {
  let initNotebooks = [{id: nanoid(16), title:'init', notes: []}];
  localStorage.setItem('notebooks', JSON.stringify(initNotebooks))
}

let notebooks = JSON.parse(localStorage.getItem('notebooks'));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App localNotebooks={notebooks} />
  </React.StrictMode>
);