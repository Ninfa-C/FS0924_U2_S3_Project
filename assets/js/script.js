const apiKey =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NzViZjY3ZmQyMjA3MTAwMTVkZTJmM2IiLCJpYXQiOjE3MzQwODAxMjcsImV4cCI6MTczNTI4OTcyN30.YkXm1ywkbuaTh3AuWmyCWDqxSoam552Fu96H1oYvzpo";
const url = "https://striveschool-api.herokuapp.com/api/product/";

const container = document.getElementById("product-Container");

document.addEventListener("load", init());

function init() {
  prodList();
}

let product= []


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
        console.log(product);
        printProd(product)
      } else {
        console.log("Non sono presenti prodotti");
      }
    } catch (error) {
      container.innerText = `Errore nel recupero di dati: ${error}`;
    }
  }


function printProd(product){
    container.innerHTML='';
    product.forEach(element => {
        container.appendChild(createCard(element))
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

const imgContainer = document.createElement('div')
imgContainer.className= "img-container"
card.appendChild(imgContainer)

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
  buttonContainer.className = " d-grid gap-3 d-lg-flex justify-content-center mb-2";
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