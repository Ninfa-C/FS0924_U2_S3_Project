//API
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjY3ZmQyMjA3MTAwMTVkZTJmM2IiLCJpYXQiOjE3MzQwODAxMjcsImV4cCI6MTczNTI4OTcyN30.YkXm1ywkbuaTh3AuWmyCWDqxSoam552Fu96H1oYvzpo";
const url = "https://striveschool-api.herokuapp.com/api/product/";

//API urlParam per gestire la pagina quando arrivo con l'id di un prodotto
const param = new URLSearchParams(window.location.search).get("prodID");
//console.log(url + param);
const cartIcon = document.getElementById("cartIcon");
const cartNumber = document.getElementById("cartNumber");
let cartInfo = JSON.parse(localStorage.getItem("cart")) || [];
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
    printCart()
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
const discarBtn = document.getElementById("discard");
discarBtn.addEventListener("click", () => remove(product));


function addToCart(item) {
  const cartProd = cartInfo.find((item) => item._id === product._id);
  if (cartProd) {
    if (cartProd.qt >= 8) {
      alert("Hai raggiunto la soglia massima di acquisto");
      return; // Blocca ulteriori incrementi
    }
    cartProd.qt += 1;
  } else {
    let newObj = { ...item, qt: 1 };
    cartInfo.push(newObj);
    discarBtn.removeAttribute('disabled')
  }
  localStorage.setItem("cart", JSON.stringify(cartInfo));
  if (cartNumber) {
    refreshCartInfo();
  }
  // console.log(cartInfo);
}



//rimuovere: prima recuperare dal LS CartInfo, poi trovare l'indice del prodotto e fare uno splice
//su quell'indice. Salavare il nuovo array senza quell'indece nel local così da aggiornarlo e rendere le modifiche persistenti
function remove(item) {
  const cartProd = cartInfo.find((itemcart) => itemcart._id === item._id);
  //console.log(product)
  //console.log(cartInfo)
  console.log(cartProd);
  console.log(cartProd.qt);
  if (cartProd) {
    cartProd.qt -= 1;
    if (cartProd.qt <= 0) {
      cartInfo = cartInfo.filter((cartItem) => cartItem._id !== item._id);
    discarBtn.setAttribute('disabled', true)
    }
    localStorage.setItem("cart", JSON.stringify(cartInfo));
    if (cartNumber) {
      refreshCartInfo();
      return;
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
  const total = cartInfo.reduce((sum, item) => sum + item.qt, 0);
  if (cartNumber) {
    cartNumber.innerText = total;
  }
}


//implementazione delle funziona della pagina script riguardanti la stampa del carrello

function refreshCartInfo() {
  const total = cartInfo.reduce((sum, item) => sum + item.qt, 0);
  if (cartNumber) {
    cartNumber.innerText = total;
  }
}

//stampa carrello

//inizio con una condizionale.
function printCart() {
  const summaryCart = document.getElementById("summary");
  //doppio controllo su carrelo minore o uduale a 0 o se non esiste per essere sicuri
  if (cartInfo.length <= 0 || !cartInfo) {
    summaryCart.className = "d-none";
  } else {
    subtotal()
    const prodContainer = document.getElementById("prodContainer");
    prodContainer.innerHTML = "";
    cartInfo.forEach((element) => {
      prodContainer.appendChild(prodCart(element));
    });
  }
}




function prodCart(item) {
  //contenitroe della carta
  const container = document.createElement("div");
  container.setAttribute(
    "class",
    " py-2 mb-2 border-bottom border-secondary-subtle"
  );

  const a = document.createElement("a");
  a.setAttribute("href", `./detail.html?prodID=${item._id}`);
  container.appendChild(a);

  //card img
  const imgCont = document.createElement("img");
  imgCont.setAttribute("src", item.imageUrl);
  imgCont.setAttribute("id", "prodCartImg");
  imgCont.className = "card-img-top";
  a.appendChild(imgCont);

  //body
  const cardBody = document.createElement("div");
  cardBody.className = "card-body d-flex flex-column align-items-center";
  container.appendChild(cardBody);

  //h5-price che prende price e centesimi
  const price = document.createElement("h5");
  price.className = "card-title";
  //recupero i dati dal local storage e poi ne stampo i valori in base all'id presente
  const storage = JSON.parse(localStorage.getItem("randomNumbersArray")) || [];
  // console.log(storage)
  const cartProd = storage.find((itemcart) => itemcart.productId === item._id);
  price.innerText = `${item.price},${cartProd.centesimi} €`;
  cardBody.appendChild(price);

  //select per modifcare la quantità
  cardBody.appendChild(formSelect(item, cartInfo));

  return container;
}

//funzione per gestire il CAMBIAMENTO del value del form con conoseguente cambio anche nel local storage

function formSelect(item, cartInfo) {
  const formSelect = document.createElement("select");
  formSelect.className = "form-select form-select-sm fs-custom w-75";

  // Opzioni per il select
  const options = [
    { value: "0", text: "0 (rimuovi)" },
    { value: "1", text: "1" },
    { value: "2", text: "2" },
    { value: "3", text: "3" },
    { value: "4", text: "4" },
    { value: "5", text: "5" },
    { value: "6", text: "6" },
    { value: "7", text: "7" },
    { value: "8", text: "8" },
  ];
  options.forEach((optionData) => {
    const option = document.createElement("option");
    option.value = optionData.value;
    option.innerText = optionData.text;
    formSelect.appendChild(option);
  });

  const cartProd = cartInfo.find((itemcart) => itemcart._id === item._id);
  if (cartProd) {
    formSelect.value = cartProd.qt.toString();
  }
  //fuzione per gestire il cambiamento ANCHE nel local storage
  formSelect.addEventListener("change", (event) => {
    const selectedValue = parseInt(event.target.value, 10);
    const index = cartInfo.findIndex((itemcart) => itemcart._id === item._id);

    if (index !== -1) {
      cartInfo[index].qt = selectedValue; 
      
      // Rimuovi dal carrello se qt è 0
      if (selectedValue === 0) {
        cartInfo.splice(index, 1);
        printCart()
      }
      localStorage.setItem("cart", JSON.stringify(cartInfo));
     subtotal()
      refreshCartInfo();
      
    }
  });
  
  return formSelect;
}

//const formSelect = document.getElementById('formSelect')

//funzione somma : API + arrray

function subtotal(){
  const cartSum = document.getElementById("cartSum");
    cartSum.innerText = "";
    
const total = cartInfo.reduce((sum, item) => {
  const numberArrray =
    JSON.parse(localStorage.getItem("randomNumbersArray")) || [];
  const producCent = numberArrray.find(
    (product) => product.productId === item._id
  );
  //console.log(producCent.centesimi);
  const cents = producCent ? producCent.centesimi : 0;
  return sum + (item.price + cents / 100) * item.qt;
}, 0);
const formattedTotal = parseFloat(total.toFixed(2));
cartSum.innerText = `${formattedTotal}€`;
}



//console.log(formattedTotal);
