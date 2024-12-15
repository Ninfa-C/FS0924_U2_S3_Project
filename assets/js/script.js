const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjY3ZmQyMjA3MTAwMTVkZTJmM2IiLCJpYXQiOjE3MzQwODAxMjcsImV4cCI6MTczNTI4OTcyN30.YkXm1ywkbuaTh3AuWmyCWDqxSoam552Fu96H1oYvzpo";
const url = "https://striveschool-api.herokuapp.com/api/product/";

const container = document.getElementById("product-Container");
const cartInfo = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("load", init());

function init() {
  prodList();
  refreshCartInfo();
}

let product = [];

async function prodList() {
  try {
    let read = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });
    let data = await read.json();
    product = data;
    if (product.length > 0) {
      // console.log(product);
      printProd(product);
      newRandom(product);
      printCart();
    } else {
      console.log("Non sono presenti prodotti");
    }
  } catch (error) {
    container.innerText = `Errore nel recupero di dati: ${error}`;
  }
}

const randomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function newRandom(product) {
  let randomNumbersArray =
    JSON.parse(localStorage.getItem("randomNumbersArray")) || [];
  product.forEach((element) => {
    const randomNumbers = {
      productId: element._id,
      comment: randomNumber(5000, 50),
      sales: randomNumber(250, 30),
      centesimi: randomNumber(99, 25),
    };
    const index = randomNumbersArray.findIndex(
      (item) => item.productId === element._id
    );
    if (index === -1) {
      randomNumbersArray.push(randomNumbers);
    }
  });
  localStorage.setItem(
    "randomNumbersArray",
    JSON.stringify(randomNumbersArray)
  );
  //console.log(randomNumbersArray);
  return randomNumbersArray;
}

function printProd(product) {
  container.innerHTML = "";
  product.forEach((element) => {
    container.appendChild(createCard(element));
  });
}

function createCard(item) {
  // Card container
  const col = document.createElement("div");
  col.className = "col";

  const card = document.createElement("div");
  card.className = "card  mb-3";
  col.appendChild(card);
  //img container

  const imgContainer = document.createElement("div");
  imgContainer.className = "img-container";
  card.appendChild(imgContainer);

  // Image
  const img = document.createElement("img");
  img.className = "card-img-top";
  img.setAttribute("src", item.imageUrl);
  img.setAttribute("alt", item.title);
  imgContainer.appendChild(img);

  // Card body
  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  card.appendChild(cardBody);

  // Title
  const title = document.createElement("h5");
  title.className = "card-title";
  title.textContent = item.name;
  cardBody.appendChild(title);

  // Price
  const price = document.createElement("p");
  price.className = "card-text mt-3";
  price.textContent = `${item.description}`;
  cardBody.appendChild(price);

  // Buttons container
  const buttonContainer = document.createElement("div");
  buttonContainer.className =
    " d-grid gap-3 d-lg-flex justify-content-center mb-2";
  cardBody.appendChild(buttonContainer);

  // Compra ora button
  const editBtn = document.createElement("a");
  editBtn.className = "btn btn-warning btn-sm";
  editBtn.innerHTML = '<i class="bi bi-pencil-square" id="add"> Modifica</i>';
  editBtn.setAttribute("href", `./back.html?prodID=${item._id}`);

  buttonContainer.appendChild(editBtn);

  // Scarta button
  const discardButton = document.createElement("a");
  discardButton.className = "btn btn-info btn-sm";
  discardButton.textContent = "Scopri di più";
  discardButton.setAttribute("href", `./detail.html?prodID=${item._id}`);
  buttonContainer.appendChild(discardButton);

  return col;
}

//carrello

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
