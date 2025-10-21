const form = document.getElementById("form");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id_user = document.getElementById("id_user").value.trim();
    const name = document.getElementById("name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const role_type = document.getElementById("role_type").value;
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const res = await fetch("https://saturday-wrzv.onrender.com/api/users/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id_user, name, last_name, role_type, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            alert(data.message);
            window.location.href = "/login/login.html";
        } else {
            alert(data.message || "Error al registrar usuario");
        }
    } catch (error) {
        console.error("Error en registro:", error);
        alert("Error de conexión con el servidor");
    }
});