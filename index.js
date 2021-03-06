// tomar los elementos del html
const formNote = document.getElementById('formNote');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const notesUl = document.getElementById('notesList');
const notesTable = document.getElementById('notesTable');
// edicion
const contentModalInput = document.getElementById('contentModal');
const titleModalInput = document.getElementById('titleModal');
const formEdit = document.getElementById('formEdit');
let editNoteId = '';
//busqueda
const search = document.getElementById('search');
const searchForm = document.getElementById('searchForm');
//funcion para generar ID
const generateId = function () {
    return '_' + Math.random().toString(36).substr(2, 9);
};

formNote.onsubmit = (e) => {
    // Al evento submit del formulario de registro le asignamos esta función,
    // que agrega un usuario, con los datos ingresados.

    e.preventDefault();
    // Traer la lista de usuarios de localStorage.
    // Sino existe la clave 'users', devuelve un arreglo vacío.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Guardar en variables los valores ingresados por el usuario.
    const title = titleInput.value;
    const content = contentInput.value;

    // Agregar un objeto usuario al arreglo.
    notes.push({
        title: title,
        content: content,
        id: generateId(),
        createdAt: Date.now()
    })
    // Guardar lista de usuarios en localStorage.
    const notesJson = JSON.stringify(notes);
    localStorage.setItem('notes', notesJson);

    // Limpiar todos los campos del formulario con reset().
    formNote.reset();
    // Actualizar la tabla en el html llamando a la función displayAllNotes(). 
    console.log("Se registró exitosamente una nota.");
    displayAllNotes();
}

const getModal = (note) => {
    // Esta función devuelve el código del modal con todos los datos del usuario.

    const createdAt = new Date(note.createdAt);
    return `
    <!-- Button trigger modal -->
    <button type="button" class="btn btn-outline-light" data-toggle="modal" data-target="#modal${note.id}">
        Visualizar
    </button>
    
    <!-- Modal Visualizar-->
    <div class="modal fade" id="modal${note.id}" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${note.title}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    
                    <p>Contenido: ${note.content}</p>
                    
                </div>
                <div class="modal-footer">
                    <div style="width: 100%;">
                        <p>Fecha de registro: ${createdAt.toLocaleString()}</p>
                    </div>                    
                    <button type="button" class="btn btn-secondary" style="position: absolute;" data-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
    </div>
    `
}

const loadForm = (noteId) => {
    // Esta función carga los datos del usuario seleccionado,
    // en los campos del formulario del documento HTML.

    // Traer la lista de usuarios de localStorage,
    // sino existe la clave 'users', devuelve un arreglo vacío.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Buscar el usuario en el array usando el método find(),
    // comparando el id que recibe por parámetro la función hasta encontrar el usuario que coincide.
    const note = notes.find((n) => n.id === noteId);
    contentModalInput.value = note.content;
    titleModalInput.value = note.title;

    // Actualizar el valor de la variable global editUserId,
    // para guardar el id del usuario a editar.
    editNoteId = noteId;
}

function displayNotes(notes) {
    // La función ahora recibe por parámetros el array de usuarios que debe insertar en el documento HTML.

    const rows = [];
    for (let i = 0; i < notes.length; i++) {
        // Guardamos los datos de usuario en user.
        const note = notes[i];
        // Creamos en un string una fila para la tabla,
        // con los datos del usuario separados en cada celda.
        const tr = `
        <tr>
            <td>${note.title}</td>
           
            
            
            <td>
                ${getModal(note)}

                <!-- Button trigger modal edit -->
                <button type="button" class="btn btn-outline-light text-white" data-toggle="modal" data-target="#editModal" onclick="loadForm('${note.id}')"><i class="far fa-edit"></i></button>

                <button onclick="deleteNote('${note.id}')" class="btn btn-outline-light"><i class="fas fa-trash-alt"></i></button>
            </td>
        </tr>
        `;
        // Agregamos el string de la fila al array rows.
        rows.push(tr);
    }
    // Unimos todas las filas en un solo string con join(),
    // y lo insertamos en el contenido de la tabla.
    notesTable.innerHTML = rows.join('');
}

function displayAllNotes() {
    // Esta función muestra la lista completa de usuarios en la tabla.

    // Traer la lista de usuarios de localStorage,
    // sino existe la clave 'users', devuelve un arreglo vacío.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Llamar a la función displayUsers, pasando por parámetros la lista completa de usuarios.
    displayNotes(notes);
    console.log("Se cargó la lista completa de notas en la tabla. 👩‍👩‍👧‍👧");
}

function deleteNote(noteId) {
    // Traer la lista de usuarios de localStorage.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Eliminar un usuario, usando filter() para filtrar el usuario
    // que coincide con el id recibido por parámetros.
    const filteredNotes = notes.filter((note) => note.id !== noteId);
    // Guardar lista de usuarios en localStorage.
    const notesJson = JSON.stringify(filteredNotes);
    localStorage.setItem('notes', notesJson);
    // Actualizar la tabla en el html llamando a la función displayAllUsers().
    displayAllNotes();
}

formEdit.onsubmit = (e) => {
    // Al evento submit del formulario de edición le asignamos esta función,
    // que actualiza al usuario seleccionado, con los datos ingresados.

    e.preventDefault()
    // Traer la lista de usuarios de localStorage,
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Guardar en variables los valores ingresados por el usuario.
    const content = contentModalInput.value;
    const title = titleModalInput.value;

    // Incluimos una variable nueva que guarda la fecha de modificación,
    // para agregarla al objeto del usuario modificado.
    const updatedAt = Date.now();

    // Actualizar un usuario del array, usando map().
    const updatedNotes = notes.map((n) => {
        // Usamos el id de usuario guardado en editUserId,
        // para modificar solo al usuario que coincida con este.
        if (n.id === editNoteId) {
            // Usar spread syntax para copiar las propiedades de un objeto a otro.
            const note = {
                ...n,
                content,
                title,
                updatedAt
            }
            return note;
        } else {
            // Retornar el usuario sin modificar en los casos que no coincida el id.
            return e;
        }
    });

    // Guardar lista de usuarios en localStorage.
    const notesJson = JSON.stringify(updatedNotes);
    localStorage.setItem('notes', notesJson);
    formEdit.reset();
    console.log("Se modificó exitosamente la nota. 🤪");
    displayAllNotes();
    // Ocultar el modal con las funciones incluidas en jQuery.
    $('#editModal').modal('hide');
}

searchForm.onsubmit = (e) => {
    // Al evento submit de la barra de búsqueda le asignamos esta función,
    // que filtra y muestra los usuarios que coinciden con la búsqueda.

    e.preventDefault();
    // Guardar en una variable la lista completa de usuarios.
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    // Transformar en minúsculas la palabra buscada y guardarla en una variable.
    const term = search.value.toLowerCase();
    console.log("term", term);
    // Guardar el array resultante de aplicar el método filter sobre el array de usuarios,
    // filtrando para obtener solo los que incluyen la palabra buscada.
    const filteredNotes = notes.filter((n) => (
        // Usar el método toLowerCase() para transformar el nombre y apellido a minúscula,
        // y el método includes() que evalúa si se incluye o no la palabra buscada.
        n.title.toLowerCase().includes(term) || n.content.toLowerCase().includes(term)
    ))
    // Llamar a la función displayUsers, pasando por parámetros la lista filtrada de usuarios.
    displayNotes(filteredNotes);
    console.log(`Se cargó la lista filtrada de notas en la tabla. ${filteredNotes.length} resultados encontrados. 🧐`);
}

displayAllNotes();

