async function shortner() {
  

    let data = {
        url: document.getElementById('userUrl').value,

    }

   
    try {
        await fetch('http://localhost:3000/urlShortner', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                'content-Type': "application/json"
            }
           
        })
    } catch (error) {
        console.log(error);
    }
    urlData();
}

async function urlData() {
    try {
        let data = await fetch("http://localhost:3000/getUrl");
        urldata = await data.json();
     
        let div = document.getElementById('url');
        let a = document.createElement('a');
        let h3 =document.createElement('h3')
        h3.innerText="Shorten Url link is :"
        a.target="_blank";
        urldata.forEach((val) => {
            a.href = val;
            a.innerText=val;
        })
        div.append(h3,a);

    } catch (error) {
        console.log(error);
    }

}
