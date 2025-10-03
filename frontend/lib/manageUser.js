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




