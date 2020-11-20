async function register() {
    let data = {
        name: document.getElementById('name').value,
        password: document.getElementById('password').value,
        email: document.getElementById('mail').value,
        phone: document.getElementById('number').value
    }

    fetch('http://localhost:3000/register', {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            'content-Type': "application/json"
        }
    }).then(res => {
        if (res.status == 200) {
            alert("Registration successful");
            document.getElementById('signupForm').reset();


        } else {
            alert("Registration Failed");

        }
    })
        .catch(err => console.log(err))

    setTimeout(() => {
        sendLink(data)
    }, 1000);
}



async function sendLink(data) {


    try {
        let email = await fetch("http://localhost:3000/sendLink", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'Content-Type': "application/json"
            }
        })
        if (email.status === 200) {
            alert("Mail Sent!!");
        } else if (email.status === 402) {
            alert("User doesn't exist");

        } else if (email.status === 401) {
            alert("Error occured while sending email");

        } else {
            alert("Couldn't send mail!!");

        }
    } catch (err) {
        console.log("mail function  :", err);
    }
}





