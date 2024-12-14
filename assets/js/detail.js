//API
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjY3ZmQyMjA3MTAwMTVkZTJmM2IiLCJpYXQiOjE3MzQwODAxMjcsImV4cCI6MTczNTI4OTcyN30.YkXm1ywkbuaTh3AuWmyCWDqxSoam552Fu96H1oYvzpo";
const url = "https://striveschool-api.herokuapp.com/api/product/";

//API urlParam per gestire la pagina quando arrivo con l'id di un prodotto
const param = new URLSearchParams(window.location.search).get("prodID");
//console.log(url + param);
const cartIcon = document.getElementById("cartIcon");
const cartNumber = document.getElementById("cartNumber");

let product = [];

document.addEventListener("load", init());

function init() {
  if (!param) {
    window.location.href = "index.html";
  } else {
    prodList();
    refreshCartInfo();
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
    //console.log(product);
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
  const id = product._id;
  //console.log(id)
  const storage = JSON.parse(localStorage.getItem("randomNumbersArray")) || [];
  //console.log(storage)
  const savedData = storage.find((item) => item.productId === product._id);
  //console.log(savedData);

  //commenti ricevuti
  const number = document.getElementById("rndNumber");
  number.innerText = `${savedData.comment}`;
  //prodotti venduti
  const sales = document.getElementById("sales");
  sales.innerText = `+${savedData.sales} vendute questo mese`;

  //badge con il prezzo in descrizione e mella terza colonna
  const badge = document.querySelectorAll(".price");
  badge.forEach((badge) => {
    badge.innerText = `${product.price}`;
  });

  //centesimi
  const cents = document.querySelectorAll(".cents");
  //console.log(cents)
  cents.forEach((cent) => {
    cent.innerText = `${savedData.centesimi}€`;
  });

  //descrizione
  const info = document.getElementById("info");
  info.innerText = product.description;

  //data

  const date = document.getElementById("date");
  date.innerText = dateTomorrow();

  const reso = document.getElementById("resoDate");
  reso.innerText = dateInFiveDays();

  //attivazione del bottone per aggiungere i prodotti al carrello. questa è collegata con la funziona SOTTO per aggiungre i prodotti
  const buyBtn = document.getElementById("addToCart");
  buyBtn.addEventListener("click", () => addToCart(product));
}

//data e costanti fisse per le prossime due funzioni
const days = [
  "domenica",
  "lunedì",
  "martedì",
  "mercoledì",
  "giovedì",
  "venerdì",
  "sabato",
];
const months = [
  "gennaio",
  "febbraio",
  "marzo",
  "aprile",
  "maggio",
  "giugno",
  "luglio",
  "agosto",
  "settembre",
  "ottobre",
  "novembre",
  "dicembre",
];
const today = new Date();

const dateTomorrow = () => {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayOfWeek = days[tomorrow.getDay()];
  const dayOfMonth = tomorrow.getDate();
  const month = months[tomorrow.getMonth()];
  return `${dayOfWeek}, ${dayOfMonth} ${month}`;
};

const dateInFiveDays = () => {
  const inFiveDays = new Date(today);
  inFiveDays.setDate(today.getDate() + 5);
  const dayOfWeek = days[inFiveDays.getDay()];
  const dayOfMonth = inFiveDays.getDate();
  const month = months[inFiveDays.getMonth()];
  const year = inFiveDays.getFullYear();
  return `${dayOfWeek} ${dayOfMonth} ${month} ${year}`;
};

//CARRELLO
/*Anzichè aggiungere nell'array lo stesso prodotto x numero di volte,
SE l'id non è presente nel local storage: pusha product + una proprietà che ho quamato qt
SE l'id invece è presente, modificare il numero in qt.
ovviamente, sommo +=1 in addTocart e -= in rimuovi.
In più, se lo rimuovo io non voglio che il numero scenda sotto lo zero ma che rimuova
l'oggetto dall'array, quindi c'è un if all'interno dell'if che richiama lo stesso indice
*/


//aggiungere al local storage che ho chiamato CartInfo
function addToCart(item) {
  let cartInfo = JSON.parse(localStorage.getItem("cart")) || [];
  const cartProd = cartInfo.find((item) => item._id === product._id);
  if (cartProd) {
    cartProd.qt += 1;
  } else {
    let newObj = { ...item, qt: 1 };
    cartInfo.push(newObj);
  }
  localStorage.setItem("cart", JSON.stringify(cartInfo));
  if (cartNumber) {
    refreshCartInfo();
  }
 // console.log(cartInfo);
}

const discarBtn = document.getElementById("discard");
discarBtn.addEventListener("click", () => remove(product));

//rimuovere: prima recuperare dal LS CartInfo, poi trovare l'indice del prodotto e fare uno splice
//su quell'indice. Salavare il nuovo array senza quell'indece nel local così da aggiornarlo e rendere le modifiche persistenti
function remove(item) {
  let cartInfo = JSON.parse(localStorage.getItem("cart")) || [];
  const cartProd = cartInfo.find((item) => item._id === product._id);
  //console.log(product)
  //console.log(cartInfo)
  //console.log(cartProd)
  if (cartProd) {
    cartProd.qt -= 1;
    if (cartProd.qt <= 0) {
      cartInfo = cartInfo.filter((item) => item._id !== product._id);
    }
    localStorage.setItem("cart", JSON.stringify(cartInfo));
    if (cartNumber) {
      refreshCartInfo();
    }

    //console.log(cartInfo);
    return;
  } else {
    console.log("Prodotto non presente nel carrello");
    return;
  }
}

//fuonzione messsa per far aggiornare il numero nel carrello anche dopo un refresh, questa viene richiamata dall'aggiunta al carreno
//e soprattutto all'init! ma non in rimuovi
function refreshCartInfo() {
  let cartInfo = JSON.parse(localStorage.getItem("cart")) || [];
  const total = cartInfo.reduce((sum, item) => sum + item.qt, 0);
  if (cartNumber) {
    cartNumber.innerText = total;
  }
}
