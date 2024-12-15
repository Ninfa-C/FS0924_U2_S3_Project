const btnAdd = document.getElementById("add");
const btnReset = document.getElementById("reset");
const deleteContainer = document.getElementById("delete");

//form
const form = document.getElementById("prodForm");
const nameInput = document.getElementById("name");
const descriptionInput = document.getElementById("description");
const brandInput = document.getElementById("brand");
const imageInput = document.getElementById("image");
const priceInput = document.getElementById("price");

//API
const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjY3ZmQyMjA3MTAwMTVkZTJmM2IiLCJpYXQiOjE3MzQwODAxMjcsImV4cCI6MTczNTI4OTcyN30.YkXm1ywkbuaTh3AuWmyCWDqxSoam552Fu96H1oYvzpo";
const url = "https://striveschool-api.herokuapp.com/api/product/";

//API urlParam per gestire la pagina quando arrivo con l'id di un prodotto
const param = new URLSearchParams(window.location.search).get("prodID");
//console.log(url + param);

//mio array per i prodotti
let product = [];
let newProd;

class Product {
  constructor(_name, _description, _brand, _imageUrl, _price) {
    this.name = _name;
    this.description = _description;
    this.brand = _brand;
    this.imageUrl = _imageUrl;
    this.price = _price;
  }
}

document.addEventListener("load", init());

function init() {
  if (!param) {
    btnAdd.innerText = "Aggiungi";
  } else {
    prodList();
    const title = document.querySelector("h1");
    title.innerText = "Modifica il tuo prodotto";
    btnAdd.innerText = "Modifica";
    btnAdd.className = "btn btn-warning";
    printForm();
    deleteContainer.innerHTML =
      '<button type="button" class="btn btn-danger" id="dltBtn" onclick = delProd()>Cancella</button>';
  }
}

async function prodList() {
  try {
    const read = await fetch(url + param, {
      method: "GET",
      headers: {
        Authorization: apiKey,
      },
    });
    if (read.ok) {
      let data = await read.json();
      product = data;
      printForm();
      newRandom();
    }
  } catch (error) {
    console.log(`Errore nel recupero di dati: ${error}`);
  }
}

function validityCheck() {
  const value = priceInput.value;
  const isInteger = /^-?\d+$/.test(value);
  if (
    !nameInput.value.trim() ||
    !descriptionInput.value.trim() ||
    !brandInput.value.trim() ||
    !imageInput.value.trim() ||
    !priceInput.value.trim()
  ) {
    alert("Tutti i campi devono essere compilati!");
    return false;
  }
  if (!isInteger) {
    alert("Inserire solo numeri interi.");
    return false;
  }
  return true;
}

//console.log(validityCheck());

async function addProduct() {
  if (!validityCheck()) {
    return; // Interrompe l'esecuzione se la validazione fallisce
  }

  let newProd = new Product(
    nameInput.value,
    descriptionInput.value,
    brandInput.value,
    imageInput.value,
    Number(priceInput.value)
  );
  //console.log(newProd);
  try {
    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newProd),
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const createdProduct = await response.json();
    }
  } catch (error) {
    console.error(`Errore nel recupero di dati: ${error}`);
  }
}

function reset() {
  nameInput.value = "";
  brandInput.value = "";
  priceInput.value = "";
  imageInput.value = "";
  descriptionInput.value = "";
}

btnAdd.addEventListener("click", function (e) {
  e.preventDefault();
  if (!param) {
    addProduct();
    reset();
  } else {
    editProd();
  }
});

async function editProd() {
  if (!param) return;
  let updatedProduct = new Product(
    String(nameInput.value),
    String(descriptionInput.value),
    String(brandInput.value),
    String(imageInput.value),
    Number(priceInput.value)
  );
  console.log(updatedProduct);

  try {
    const response = await fetch(url + param, {
      method: "PUT",
      body: JSON.stringify(updatedProduct),
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const updatedProductResponse = await response.json();
      alert("Prodotto modificato con successo");
      let cartInfo = JSON.parse(localStorage.getItem("cart")) || [];
      cartInfo = cartInfo.map((item) => {
        if (item._id === updatedProductResponse._id) {
          // Modifica i valori di prodotto nel carrello
          item.name = updatedProductResponse.name;
          item.description = updatedProductResponse.description;
          item.brand = updatedProductResponse.brand;
          item.image = updatedProductResponse.image;
          item.price = updatedProductResponse.price; // Aggiungi anche il nuovo prezzo
        }
        return item;
      });
      localStorage.setItem("cart", JSON.stringify(cartInfo));

      window.history.replaceState(null, null, window.location.pathname);
      location.reload();
    } else {
      const errorResponse = await response.json();
      console.error(
        `Failed to update product. Status: ${response.status}`,
        errorResponse
      );
    }
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function printForm() {
  nameInput.value = product.name;
  descriptionInput.value = product.description;
  brandInput.value = product.brand;
  imageInput.value = product.imageUrl;
  priceInput.value = product.price;
}

btnReset.addEventListener("click", function (e) {
  e.preventDefault();
  reset();
});

async function delProd() {
  try {
    const response = await fetch(url + param, {
      method: "DELETE",
      headers: {
        Authorization: apiKey,
      },
    });
    if (response.ok) {
      alert("Prodotto rimosso con successo");

      //eliminalo anche dal local storage
      let cartInfo = JSON.parse(localStorage.getItem("cart")) || [];
      console.log("ProductId:", param); // Cambia con il nome corretto della variabile
      cartInfo = cartInfo.filter((item) => item._id !== param);
      console.log("CartInfo dopo il filtro:", cartInfo);
      localStorage.setItem("cart", JSON.stringify(cartInfo));
      
      //ricarica la pagina senza il param
      window.history.replaceState(null, null, window.location.pathname);
      location.reload();
    } else {
      console.error("Errore durante la cancellazione:", await response.json());
    }
  } catch (error) {
    console.log("Errore:", error);
  }
}

const randomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
/*
function generateForID(id) {
  let productId = id.name;
  let random = getNumber(productId);
  if (!random) {
    const x = randomNumber(5000, 50);
    const y = randomNumber(250, 30);
    random = {
      comment: x,
      sales: y,
    };
    saveNumber(productId, random);
  }
  console.log(`Numero casuale per il prodotto ${productId}:`, random);
  return random;
}
*/

function newRandom() {
  let randomNumbersArray =
    JSON.parse(localStorage.getItem("randomNumbersArray")) || [];

  if (Array.isArray(product)) {
    product.forEach((product) => {
      const randomNumbers = {
        productId: product._id,
        comment: randomNumber(5000, 50),
        sales: randomNumber(250, 30),
      };
      const existingIndex = randomNumbersArray.findIndex(
        (item) => item.productId === prod._id
      );
      if (existingIndex === -1) {
        randomNumbersArray.push(randomNumbers);
      }
    });
  } else if (product && product._id) {
    const randomNumbers = {
      productId: product._id,
      comment: randomNumber(5000, 50),
      sales: randomNumber(250, 30),
    };
    const existingIndex = randomNumbersArray.findIndex(
      (item) => item.productId === product._id
    );
    if (existingIndex === -1) {
      randomNumbersArray.push(randomNumbers);
    }
  } else {
    return;
  }
  localStorage.setItem(
    "randomNumbersArray",
    JSON.stringify(randomNumbersArray)
  );
  console.log(randomNumbersArray);
  return randomNumbersArray;
}
