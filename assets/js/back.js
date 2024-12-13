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
    addProduct();
  } else {
    prodList();
    const title = document.querySelector("h1");
    title.innerText = "Modifica il tuo prodotto";
    btnAdd.innerText = "Modifica";
    btnAdd.className = "btn btn-warning";
    printForm();
    deleteContainer.innerHTML =
      '<button type="button" class="btn btn-danger" id="dltBtn">Cancella</button>';
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
    printForm();
    //console.log (product)
  } catch (error) {
    container.innerText = `Errore nel recupero di dati: ${error}`;
  }
}

async function addProduct() {
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
      console.log("Product updated successfully:", updatedProductResponse);
      window.history.replaceState(null, null, window.location.pathname);
      btnAdd.innerText = "Aggiungi";
      btnAdd.className = "btn btn-success";

      reset();
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