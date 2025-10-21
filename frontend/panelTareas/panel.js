let estados = [];
let usuarios = [];

//  Cargar estados desde backend
async function cargarEstados() {
    try {
        const res = await fetch("https://saturday-wrzv.onrender.com/api/status", { credentials: "include" });
        estados = await res.json();
    } catch (error) {
        console.error(" Error cargando estados:", error);
    }
}

//  Cargar usuarios desde backend
async function cargarUsuarios() {
    try {
        const res = await fetch("https://saturday-wrzv.onrender.com/api/users", { credentials: "include" });
        usuarios = await res.json();
    } catch (error) {
        console.error(" Error cargando usuarios:", error);
    }
}

//  Cargar tareas desde backend
async function cargarTareas() {
    try {
        const USER = await getProfile();
        if (!USER || !USER.user) {
            alert("No estás autenticado.");
            window.location.replace("/frontend/login/login.html");
            return;
        }

        // const ROLE = Number(USER.user.role_type);

        // detectar tablero actual
        const filename = window.location.pathname.split("/").pop().toLowerCase();
        const isT1Page = filename === "panel.html";
        const isT2Page = filename === "paneltareast2.html";

        //  Elegir el rol que se va a pedir al backend
        let roleParam = isT2Page ? 3 : 2;
        // if (ROLE === 1) {
        //     // si es admin pedimos según el tablero actual
        //     roleParam = isT2Page ? 3 : 2;
        // }

        const res = await fetch(`https://saturday-wrzv.onrender.com/api/tasks?id_rol=${roleParam}`, {
            method: "GET",
            credentials: "include"
        });

        if (res.status === 401) {
            alert("Sesión expirada. Inicia sesión de nuevo.");
            window.location.replace("/frontend/login/login.html");
            return;
        }
        if (res.status === 403) {
            alert("No tienes permisos para ver este tablero.");
            return;
        }

        const tareas = await res.json();

        if (!Array.isArray(tareas)) {
            console.error("La respuesta de /tasks no es un array:", tareas);
            return;
        }

        // limpiar tablas (solo las que existan en la página actual)
        if (document.getElementById("bodyTareasCompromiso")) document.getElementById("bodyTareasCompromiso").innerHTML = "";
        if (document.getElementById("bodyTareasImplementacion")) document.getElementById("bodyTareasImplementacion").innerHTML = "";
        if (document.getElementById("bodyTareasProduccion")) document.getElementById("bodyTareasProduccion").innerHTML = "";

        tareas.forEach((tarea) => {
            // opciones de estados
            const estadoOptions = estados.map(
                (estado) => `
        <option value="${estado.id_status}" 
          ${parseInt(tarea.task_status) === parseInt(estado.id_status) ? "selected" : ""}>
          ${estado.status_name}
        </option>
      `
            ).join("");

            // opciones de responsables
            const responsableOptions = `
      <option value="">Sin asignar</option>
      ${usuarios.map(
                (u) => `
          <option value="${u.id_user}" 
            ${tarea.task_responsible == u.id_user ? "selected" : ""}>
            ${u.name} ${u.last_name}
          </option>
        `
            ).join("")}`;
            const row = document.createElement("tr");
            row.innerHTML = `
            
            <td>${tarea.id_task}</td>
      <td>${tarea.task_name}</td>
      <td>
        <select class="estado-select" data-id="${tarea.id_task}">
          ${estadoOptions}
        </select>
      </td>
      <td>
        <select class="responsable-select" data-id="${tarea.id_task}">
          ${responsableOptions}
        </select>
      </td>
      <td>${tarea.task_description || "-"}</td>
      <td>${tarea.role?.user_rol || "-"}</td>
      <td>${tarea.task_start_date ? new Date(tarea.task_start_date).toLocaleDateString() : "-"}</td>
      <td>${tarea.task_end_date ? new Date(tarea.task_end_date).toLocaleDateString() : "-"}</td>
    `;

            if (parseInt(tarea.task_status) === 1) {
                document.getElementById("bodyTareasCompromiso").appendChild(row);
            } else if (parseInt(tarea.task_status) === 2) {
                document.getElementById("bodyTareasImplementacion").appendChild(row);
            } else if (parseInt(tarea.task_status) === 3) {
                document.getElementById("bodyTareasProduccion").appendChild(row);
            }
        });

        // eventos de actualización estado
        document.querySelectorAll(".estado-select").forEach(select => {
            select.addEventListener("change", async (e) => {
                const idTarea = e.target.dataset.id;
                const nuevoEstado = e.target.value;
                try {
                    await fetch(`https://saturday-wrzv.onrender.com/api/tasks/${idTarea}/status`, {
                        method: "PUT",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ task_status: nuevoEstado }),
                    });
                    cargarTareas(); // refrescar
                } catch (error) {
                    console.error(" Error al actualizar estado:", error);
                }
            });
        });

        // eventos de actualización responsable
        document.querySelectorAll(".responsable-select").forEach(select => {
            select.addEventListener("change", async (e) => {
                const idTarea = e.target.dataset.id;
                const nuevoResponsable = e.target.value || null;
                try {
                    await fetch(`https://saturday-wrzv.onrender.com/api/tasks/${idTarea}`, {
                        method: "PUT",
                        credentials: "include",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ task_responsible: nuevoResponsable }),
                    });
                    cargarTareas();
                } catch (error) {
                    console.error(" Error al actualizar responsable:", error);
                }
            });
        });

    } catch (error) {
        console.error(" Error al cargar tareas:", error);
    }
}


document.addEventListener("DOMContentLoaded", async () => {
    try {
        const profile = await getProfile();
        if (!profile || !profile.user) {
            alert("No estás autenticado.");
            window.location.replace("/frontend/login/login.html");
            return;
        }

        const ROLE = Number(profile.user.role_type);

        // detectar tablero actual
        const filename = window.location.pathname.split("/").pop().toLowerCase();
        const isT1Page = filename === "panel.html";
        const isT2Page = filename === "paneltareast2.html";

        // interceptar clicks en los enlaces del menú lateral
        document.querySelectorAll(".list-boards a").forEach(link => {
            link.addEventListener("click", (e) => {
                const destino = link.getAttribute("href").toLowerCase();

                if (ROLE === 2 && destino.includes("paneltareast2.html")) {
                    e.preventDefault();
                    alert("No tienes permisos para acceder al tablero T2.");
                }
                if (ROLE === 3 && destino.includes("panel.html")) {
                    e.preventDefault();
                    alert("No tienes permisos para acceder al tablero T1.");
                }
            });
        });

        // validación de acceso directo por URL
        if (ROLE === 2 && !isT1Page) {
            alert("No tienes permisos para este tablero. Te dejamos en T1.");
            window.location.replace("/frontend/panelTareas/panel.html");
            return;
        }

        if (ROLE === 3 && !isT2Page) {
            alert("No tienes permisos para este tablero. Te dejamos en T2.");
            window.location.replace("/frontend/panelTareas/panelTareasT2.html");
            return;
        }

        // cargar datos
        await cargarEstados();
        await cargarUsuarios();
        await cargarTareas();

    } catch (err) {
        console.error("Error validando sesión/rol:", err);
        window.location.replace("/frontend/login/login.html");
    }
});


// Filtrar tareas

function filtrarTareas(value) {
    /* const filtro = document.getElementById("buscadorTareas").value.toLowerCase(); */
    let filtro = value.toLowerCase().trim();
    // Buscar en las 3 tablas
    ["bodyTareasCompromiso", "bodyTareasImplementacion", "bodyTareasProduccion"].forEach(idTabla => {
        const filas = document.getElementById(idTabla).getElementsByTagName("tr");

        for (let fila of filas) {
            const textoFila = fila.innerText.toLowerCase();
            if (textoFila.includes(filtro)) {
                fila.style.display = "";
            } else {
                fila.style.display = "none";
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const inputBuscador = document.getElementById("buscadorTareas");
    if (inputBuscador) {
        inputBuscador.addEventListener("keyup", (event) => {
            filtrarTareas(event.target.value)
        });
    }
});


// Cambiar tema claro/oscuro
const modoClaro = document.querySelector('.modo-claro');
const modoOscuro = document.querySelector('.modo-oscuro');
const temas = document.querySelectorAll('.tema');
const configModoClaro = document.querySelector('.btn-modo-claro-oscuro');

temas.forEach(t => {
    t.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        configModoClaro.style.display =
            configModoClaro.style.display === 'block' ? 'none' : 'block';
    });
});

modoClaro.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.remove('oscuro');
    document.body.classList.add('claro');
    localStorage.setItem('tema', 'claro');
});

modoOscuro.addEventListener('click', (e) => {
    e.preventDefault();
    document.body.classList.remove('claro');
    document.body.classList.add('oscuro');
    localStorage.setItem('tema', 'oscuro');
});

const temaGuardado = localStorage.getItem('tema');
if (temaGuardado) {
    document.body.classList.remove('claro', 'oscuro');
    document.body.classList.add(temaGuardado);
}


// Abrir/cerrar menú lateral y configuración
const icon = document.querySelector('.icon-open');
const aside = document.querySelector('.container-aside');
icon.addEventListener('click', (e) => {
    e.preventDefault();
    aside.classList.toggle('active');
});

const iconConfig = document.querySelector('.icon-config');
const configContent = document.querySelector('.config-content');
iconConfig.addEventListener('click', (e) => {
    e.preventDefault();
    configContent.classList.toggle('active');
});