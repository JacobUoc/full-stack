// Selecciona todos los formularios en la página
const forms = document.querySelectorAll("form");

// Agrega un controlador de eventos submit para cada formulario
for (const form of forms) {
  form.addEventListener("submit", async (e) => {
    // Previene la acción predeterminada del formulario (enviar datos al servidor)
    e.preventDefault();

    // Crea un nuevo objeto FormData a partir del formulario que se está enviando
    const formData = new FormData(form);
    let isValid = true;

    // Valida el correo electrónico
    const email = formData.get("email");
    if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      alert("Por favor ingrese una dirección de correo electrónico válida.");
    }

    // Valida la contraseña
    const password = formData.get("password");
    if (password.length < 8) {
      isValid = false;
      alert("La contraseña debe tener al menos 8 caracteres.");
    }

    // Solo envía la solicitud al servidor si el formulario es válido
    if (isValid) {
      let body = {};

      // Determina si se trata de un formulario de registro o inicio de sesión
      if (form.id === "register-form") {
        // Si es un formulario de registro, agrega el avatar a la solicitud
        const avatar = formData.get("avatar");
        body = { email, password, avatar };
      } else if (form.id === "login-form") {
        // Si es un formulario de inicio de sesión, no incluye el avatar en la solicitud
        body = { email, password };
      }

      // Envía la solicitud POST al servidor
      const res = await fetch(form.action, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Obtiene la respuesta del servidor en formato JSON
      const data = await res.json();

      // Si el servidor responde con "status": "success", guarda los datos del usuario en el almacenamiento local
      if (data.status === "success") {
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/game.html";
      } else {
        // Si el servidor responde con "status": "error", muestra un mensaje de error
        alert(data.message);
      }
    }
  });
}

// Selecciona el contenedor del juego
const gameContainer = document.querySelector(".game-container");

// Selecciona la lista de salas
const roomsList = document.querySelector(".rooms-list");

// Función para cargar las salas
async function loadRooms() {
const res = await fetch("/rooms");
const data = await res.json();

// Crea un elemento de lista para cada sala
for (const room of data) {
const roomItem = document.createElement("li");
roomItem.innerText = room.name;
roomsList.appendChild(roomItem);
}
}

// Llamar a la función para cargar las salas
loadRooms();

// Agregar evento "dragover" al contenedor del juego
gameContainer.addEventListener("dragover", (e) => {
e.preventDefault();
});

// Agregar evento "drop" al contenedor del juego
gameContainer.addEventListener("drop", (e) => {
e.preventDefault();

// Recuperar la información del usuario desde el almacenamiento local
const user = JSON.parse(localStorage.getItem("user"));

// Actualizar el contenido del contenedor del juego con un mensaje de bienvenida al usuario y su avatar
gameContainer.innerHTML = <><h1>Welcome to the game, ${user.email}</h1><img src="${user.avatar}" alt="${user.email}" /></> ;
});
