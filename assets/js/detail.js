//API
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjY3ZmQyMjA3MTAwMTVkZTJmM2IiLCJpYXQiOjE3MzQwODAxMjcsImV4cCI6MTczNTI4OTcyN30.YkXm1ywkbuaTh3AuWmyCWDqxSoam552Fu96H1oYvzpo";
const url = "https://striveschool-api.herokuapp.com/api/product/";

//API urlParam per gestire la pagina quando arrivo con l'id di un prodotto
const param = new URLSearchParams(window.location.search).get("prodID");
//console.log(url + param);

let product = [];

document.addEventListener("load", init());

function init() {
  if (!param) {
    window.location.href = "index.html";
  } else {
    prodList();
  }
}

async function prodList() {
  try {
    let read = await fetch(url + param, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });
    let data = await read.json();
    product = data;
    printDetails()
    console.log(product);
  } catch (error) {
    container.innerText = `Errore nel recupero di dati: ${error}`;
  }
}

function printDetails() {
  const container = document.getElementById("product-Container");

  const percorso = document.createElement("p");
  percorso.innerText = "ciao";
  container.appendChild(percorso);


  //Div container
  const div = document.createElement("div");
  div.className = "container row detailImg";
  container.appendChild(div);

//img container
const divimg = document.createElement("div");
divimg.className = "col-4";
divimg.setAttribute("id", 'imgCont');
div.appendChild(divimg);

  //img container
  const img = document.createElement("img");
  img.className = "mx-3";
  img.setAttribute("src", product.imageUrl);
  divimg.appendChild(img);
  
//info Container
const divInfo = document.createElement("div");
divInfo.className = "col-8";
divInfo.setAttribute("id", '');
div.appendChild(divInfo);

  //titolo
  const title = document.createElement("h1");
  title.className = "title mb-3";
  title.innerText = product.name;
  divInfo.appendChild(title);

  //badge con il prezzo
  const badge = document.createElement("span");
  badge.className = "badge bg-dark mb-3";
  badge.textContent = `€ ${product.price}`;
  divInfo.appendChild(badge);

//descrizione
const info = document.createElement('p')
info.className = "fw-light";
info.innerText= product.description;
divInfo.appendChild(info)

}
