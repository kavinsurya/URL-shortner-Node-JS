async function login() {
    let data = {
        email: document.getElementById('loginName').value,
        password: document.getElementById('loginPassword').value
    }
    fetch('http://localhost:3000/login', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'content-Type': "application/json"
        }
    }).then(res => {
        if (res.status == 200) {
            alert("Logged in Successfully");
            window.location.href = "/assets/welcome/urlshortner.html";

        } else if (res.status == 400 || res.status == 401) {
            alert("Invalid Credentials");

        }
    })
        .catch(err => console.log(err))

}