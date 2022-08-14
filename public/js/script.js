const form = document.querySelector('#reg-form');
const loginButton = document.querySelector('#form-button-login');
const main = document.querySelector('.main');
const todo = document.querySelector('.todo');
const infoButton = document.querySelector('.infoButton');
const changePasswordButton = document.querySelector('.changePasswordButton');
const deleteProfileButton = document.querySelector('.deleteProfileButton');
const getNotesButton = document.querySelector('.getNotesButton');
const notes = document.querySelector('.notes');
const addNoteButton = document.querySelector('.addNoteButton');
const getNoteButton = document.querySelector('.getNoteButton');

let token = '';

async function registerUser(event) {
  event.preventDefault();
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  (async () => {
    const rawResponse = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const content = await rawResponse.json();

    console.log(content);
    alert(content.message);
  })();
}

form.addEventListener('submit', registerUser);

async function showInfo() {
  (async () => {
    const rawResponse = await fetch('/api/users/me', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    alert(`        username: ${content.user.username}
        id: ${content.user._id}
        createdDate: ${content.user.createdDate}`);
  })();
}

infoButton.addEventListener('click', showInfo);

async function changePassword() {
  const oldPassword = prompt('Enter your old password');
  const newPassword = prompt('Enter your new password');
  (async () => {
    const rawResponse = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    });
    const content = await rawResponse.json();
    alert(content.message);
  })();
}

changePasswordButton.addEventListener('click', changePassword);

async function deleteUser() {
  (async () => {
    const rawResponse = await fetch('/api/users/me', {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    alert(content.message);
    document.location.reload();
  })();
}

deleteProfileButton.addEventListener('click', deleteUser);

async function check() {
  const id = this.classList[1];
  (async () => {
    const rawResponse = await fetch(`/api/notes/${id}`, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    if (content.note.completed) {
      this.classList.add('checked');
    } else {
      this.classList.remove('checked');
    }
  })();
}

async function getNotes() {
  (async () => {
    const rawResponse = await fetch('/api/notes', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    while (notes.childNodes.length > 2) {
      notes.removeChild(notes.lastChild);
    }
    content.notes.map((el) => {
      const row = document.createElement('div');
      row.classList.add('note-row');
      row.classList.add(`${el._id}`);
      const paragraph = document.createElement('p');
      paragraph.innerText = el.text;
      const circle = document.createElement('div');
      circle.classList.add('circle');
      circle.classList.add(`${el._id}`);
      circle.addEventListener('click', check);
      const editIcon = document.createElement('div');
      editIcon.classList.add('edit-icon');
      editIcon.classList.add(`${el._id}`);
      editIcon.addEventListener('click', function editTask() {
        const id = this.classList[1];
        const editText = prompt("Enter note's text");
        if (!editText) {
          alert('Field cant be empty');
          return;
        }
        (async () => {
          const editRawResponse = await fetch(`/api/notes/${id}`, {
            method: 'PUT',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ text: editText }),
          });
          const editContent = await editRawResponse.json();

          alert(editContent.message);
          getNotes();
        })();
      });
      const deleteIcon = document.createElement('div');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.classList.add(`${el._id}`);
      deleteIcon.addEventListener('click', function deleteTask() {
        const id = this.classList[1];
        (async () => {
          const deleteRawResponse = await fetch(`/api/notes/${id}`, {
            method: 'DELETE',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          const deleteContent = await deleteRawResponse.json();
          getNotes();
          alert(deleteContent.message);
        })();
      });
      row.appendChild(circle);
      row.appendChild(paragraph);
      row.appendChild(editIcon);
      row.appendChild(deleteIcon);
      notes.appendChild(row);
      if (el.completed) {
        return circle.classList.add('checked');
      }
      return circle.classList.remove('checked');
    });
  })();
}

getNotesButton.addEventListener('click', getNotes);

async function loginUser() {
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  (async () => {
    const rawResponse = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    const content = await rawResponse.json();

    if (content.message === 'Success') {
      main.style.display = 'none';
      alert(content.message);
      console.log(content);
      token = content.jwt_token;
      todo.style.display = 'flex';
      getNotes();
    } else {
      alert(content.message);
    }
  })();
}

loginButton.addEventListener('click', loginUser);

async function addNote() {
  const noteText = prompt("Enter note's text");
  if (!noteText) {
    alert('Field cant be empty');
    return;
  }
  (async () => {
    const rawResponse = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: noteText }),
    });
    await rawResponse.json();
    getNotes();
  })();
}

addNoteButton.addEventListener('click', addNote);

async function getNote() {
  const noteId = prompt("Enter note's id");
  if (!noteId) {
    alert('Field cant be empty');
    return;
  }
  (async () => {
    const rawResponse = await fetch(`/api/notes/${noteId}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    const content = await rawResponse.json();
    if (content.message === 'Error') {
      alert(content.message);
    } else {
      alert(`text: ${content.note.text}`);
    }
  })();
}

getNoteButton.addEventListener('click', getNote);
