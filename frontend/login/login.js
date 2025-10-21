   const form = document.getElementById("form");

        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!email || !password) {
                alert("Por favor llena todos los campos");
                return;
            }
            if (!emailRegex.test(email)) {
                alert("Ingresa un correo válido");
                return;
            }
            if (password.length < 8) {
                alert("La contraseña debe tener al menos 8 caracteres");
                return;
            }
            try {
                const res = await fetch("https://saturday-wrzv.onrender.com/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include", // mantener sesión
                    body: JSON.stringify({ email, password })
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Sesión iniciada correctamente");

                    const role = Number(data.user?.role_type);

                    if (role === 3) {
                        // Tablero T2
                        window.location.href = "/frontend/panelTareas/panelTareasT2.html";
                    } else {
                        // Admin (1) y T1 (2) van a T1 por defecto
                        window.location.href = "/frontend/panelTareas/panel.html";
                    }
                } else {
                    alert(data.message || "Error en las credenciales");
                }

            } catch (error) {
                console.error("Error en login:", error);
                alert("Error de conexión con el servidor");
            }
        });