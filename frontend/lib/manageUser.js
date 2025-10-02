async function logout(event) {
    event.preventDefault();
   const res =  await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        credentials: "include"
    });
    console.log(res);
    localStorage.removeItem("user");
    window.location.href = "/frontend/login/login.html";
}

async function getProfile(redirectLogin = true) {
    const res = await fetch("http://localhost:3001/api/users/profile", {
        method: "GET",
        credentials: "include"
    });
    if (res.ok) {
        const data = await res.json();
        return data;
    }   
    if (redirectLogin) window.location.href = "/frontend/login/login.html";
    return null;
}

// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const filename = window.location.pathname.split("/").pop().toLowerCase();

//     // ❌ Evitar correr en login.html
//     if (filename === "login.html") return;

//     const profile = await getProfile(); 
//     if (!profile || !profile.user) {
//       alert("No estás autenticado.");
//       window.location.replace("/frontend/login/login.html");
//       return;
//     }

//     const ROLE = Number(profile.user.role_type);
//     const isT1Page = filename === "panel.html";
//     const isT2Page = filename === "paneltareast2.html";

//     if (ROLE === 1) {
//       // Admin: permitido
//     } else if (ROLE === 2) {
//       if (!isT1Page) {
//         alert("❌ No tienes permisos para acceder a este tablero. Te llevamos a T1.");
//         window.location.replace("/frontend/panelTareas/panel.html");
//         return;
//       }
//     } else if (ROLE === 3) {
//       if (!isT2Page) {
//         alert("❌ No tienes permisos para acceder a este tablero. Te llevamos a T2.");
//         window.location.replace("/frontend/panelTareas/panelTareasT2.html");
//         return;
//       }
//     } else {
//       alert("❌ Rol no válido. Redirigiendo a login.");
//       window.location.replace("/frontend/login/login.html");
//       return;
//     }

//     // Si pasa validación, carga datos
//     await cargarEstados();
//     await cargarUsuarios();
//     await cargarTareas();

//   } catch (err) {
//     console.error("Error en comprobación de sesión / rol:", err);
//     window.location.replace("/frontend/login/login.html");
//   }
// });

