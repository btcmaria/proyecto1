async function getProducts(){
    try {
        const dato = await fetch(
            "https://ecommercebackend.fundamentos-29.repl.co/"
            );
        const res = await dato.json();

        window.localStorage.setItem("products", JSON.stringify(res));

            return res;
    } catch (error) {
        console.log(error);  
    }
}

function printProducts(baseDatos) {
    const productsHTML = document.querySelector(".products");

    let html = "";

    for (const product of baseDatos.products) {
    const appBotton = product.quantity 
    ? `<i class="bx bx-plus" id="${product.id}"></i>`
    : "<span class='agotado'>Agotado</span>"
        html += 
        `<div class="product">
    <div class="product__img">
        <img src="${product.image}" alt="imagen">
    </div>
    
    <div class="product__info">
        <h4>${product.name} | <span>Stock <b>:${product.quantity}</b></span></h4>
        <h5>
            $${product.price}
            ${appBotton}
        </h5>
    </div>
    </div>
    `;
    }

    /*console.log(html);*/

    productsHTML.innerHTML = html;
}

function showCart() {
    const bxcartHTML = document.querySelector(".bx-cart");
    const cartHTML = document.querySelector(".cart");

    bxcartHTML.addEventListener("click", function(){
        cartHTML.classList.toggle("cart__seen");
    });
}
function addToCartProducts(baseDatos) {
    const productsHTML = document.querySelector(".products");

    
    productsHTML.addEventListener("click", function(a){
        if(a.target.classList.contains("bx-plus")) {
            const id = Number(a.target.id);


            const productsPurchased = baseDatos.products.find(
                (product) => product.id === id
                );

                if(baseDatos.cart[productsPurchased.id]){
                    if(productsPurchased.quantity === baseDatos.cart[productsPurchased.id].amount) 
                        return alert("No tenemos más de este producto");


                        baseDatos.cart[productsPurchased.id].amount++;
                } else {
                    baseDatos.cart[productsPurchased.id] = {...productsPurchased, amount: 1};
                }

                window.localStorage.setItem("cart", JSON.stringify(baseDatos.cart));
                printProductsInCart(baseDatos);
                printTotal(baseDatos);
                cantidadProducts(baseDatos);
        }
    });
}

function printProductsInCart(baseDatos){
    const cartProducts = document.querySelector(".cart_products");

    let html = "";
    for (const product in  baseDatos.cart) {
        const {quantity, price, name, image, id, amount} = baseDatos.cart[product];

        
        html += 
        `
<div class="cart_product">
    <div class="cart_product-img">
        <img src="${image}" alt="imagen" />
    </div>
    <div class="cart_product-body">
        <h4>${name} | $${price}</h4>
        <p>Stock: ${quantity}</p>

        <div class="cart_product-body--ip" id="${id}">
        <i class='bx bx-minus'></i>
            <span>${amount} unit</span>
            <i class='bx bx-plus'></i>
            <i class='bx bx-trash'></i>
        </div>
    </div>
</div>

`;
    }

    cartProducts.innerHTML = html;
}
    
function handleProductsCart(baseDatos){
    const cartProducts = document.querySelector(".cart_products");

    cartProducts.addEventListener("click", function(a){
        if(a.target.classList.contains("bx-plus")) {
            const id = Number(a.target.parentElement.id);

            const productsPurchased = baseDatos.products.find(
                (product) => product.id === id
                );

                
                    if(productsPurchased.quantity === baseDatos.cart[productsPurchased.id].amount) 
                        return alert("No tenemos más de este producto");


                        baseDatos.cart[id].amount++;
                

            
        }

        if(a.target.classList.contains("bx-minus")) {
            const id = Number(a.target.parentElement.id);
            if(baseDatos.cart[id].amount === 1){
                const pregunta = confirm(
                    "Estas seguro de eliminar este producto?"
                    );
                if(!pregunta) return ;
                delete baseDatos.cart[id];
            } else{
                baseDatos.cart[id].amount--;
            }
        }

        if(a.target.classList.contains("bx-trash")) {
            const id = Number(a.target.parentElement.id);
            const pregunta = confirm(
                "Estas seguro de eliminar este producto?"
                );
            if(!pregunta) return ;
            delete baseDatos.cart[id];
        }

        window.localStorage.setItem("cart",  JSON.stringify(baseDatos.cart));
        printProductsInCart(baseDatos);
        printTotal(baseDatos);
        cantidadProducts(baseDatos);
    });
}

function printTotal(baseDatos){
    const infoTotal = document.querySelector(".info__total");
    const infoCantidad = document.querySelector(".info__cantidad");

    let productsTotal = 0;
    let productAmount = 0;

    for (const product in baseDatos.cart) {
        const {amount, price} = baseDatos.cart[product];
        productsTotal += price * amount;
        productAmount += amount;
    }

    infoCantidad.textContent = productAmount + "units";
    infoTotal.textContent = "$" +productsTotal + ".00";
}

function handlingOfEverything(baseDatos) {
    const btcTotal = document.querySelector(".btc__total");

    btcTotal.addEventListener("click", function(){
        if(!Object.values(baseDatos.cart).length) return alert("Tienes que comprar productos");

        const pregunta = confirm("Estas seguro de querer comprar este producto?");
        if(!pregunta) return;

        const  curretProducts = [];

        for (const product of baseDatos.products) {
            const productCart = baseDatos.cart[product.id];
            if(product.id === productCart?.id){
                curretProducts.push({
                    ...product,
                    quantity: product.quantity -productCart.amount,
                });
            } else{
                curretProducts.push(product);
            }
        }

        baseDatos.products = curretProducts;
        baseDatos.cart = {};

        window.localStorage.setItem("products",JSON.stringify(baseDatos.products));
        window.localStorage.setItem("cart", JSON.stringify(baseDatos.cart));

        printTotal(baseDatos);
        printProductsInCart(baseDatos);
        printProducts(baseDatos);
        cantidadProducts(baseDatos);
    });
}

function cantidadProducts(baseDatos) {
    const quantityProducts = document.querySelector(".quantityProducts");

    let amount = 0;

    for (const product in  baseDatos.cart) {

        amount += baseDatos.cart[product].amount;
    }

    quantityProducts.textContent = amount;

    
}

async function principal ()  {
    const baseDatos = {
        products :
            JSON.parse(window.localStorage.getItem("products")) ||  
            (await getProducts()),
        cart : JSON.parse(window.localStorage.getItem("cart")) || {},
    };
    
    printProducts(baseDatos);
    showCart();
    addToCartProducts(baseDatos);
    printProductsInCart(baseDatos);
    handleProductsCart(baseDatos);
    printTotal(baseDatos);
    handlingOfEverything(baseDatos);
    cantidadProducts(baseDatos);


}

principal(); 

const darkModeToggle = document.querySelector('#dark-mode-toggle');
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        darkModeToggle.classList.toggle('bx-sun');
        darkModeToggle.classList.toggle('bx-moon');
    });