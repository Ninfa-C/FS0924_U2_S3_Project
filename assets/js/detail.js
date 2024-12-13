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
    printDetails();
    console.log(product);
  } catch (error) {
    console.log(`Errore nel recupero di dati: ${error}`);
  }
}

function printDetails() {
  const container = document.getElementById("product-Container");
  //breadcrumb
  const percorso = document.getElementById("dataPage");
  percorso.innerText = product.name;
  //img
  const img = document.getElementById("prodImg");
  img.setAttribute("src", product.imageUrl);

  //titolo
  const title = document.getElementById("title");
  title.innerText = product.name;

//recupero i dati dal local storage e poi ne stampo i valori in base all'id presente
const id= product._id
//console.log(id)
const storage = JSON.parse(localStorage.getItem("randomNumbersArray")) || [];
//console.log(storage)
const savedData = storage.find((item)=>item.productId ===product._id)
console.log(savedData)

  //prodotti venduti
  const number = document.getElementById("rndNumber");
    number.innerText = `${savedData.comment}`;

  const sales = document.getElementById("sales");
  sales.innerText = `+${savedData.sales} vendute questo mese`;


  //badge con il prezzo
  const badge = document.getElementById("price");
  badge.textContent = `€ ${product.price}`;

  //descrizione
  const info = document.createElement("p");
  info.className = "fw-light";
  info.innerText = product.description;
  
}
