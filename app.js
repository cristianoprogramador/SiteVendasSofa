// variables

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');
//cart
let cart = [];
//buttons
let buttonsDOM = [];

//getting the products
class Products {
    async getProducts() {
        try {
            let result = await fetch('products.json')
            let data = await result.json();

            let products = Array.from(data.items);
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image }
            })
            return products
        } catch (error) {
            console.log(error)
        }
    }
}
// display products
class UI {
    displayProducts(products) {
        let result = '';
        products.forEach(product => {
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img 
                    src=${product.image}
                    alt="product"
                     class="product-img"
                     />
                    <button class="bag-btn" data-id=${product.id}>
                        <i class="fas fa-shopping-cart"></i>
                        adicionar ao carrinho
                    </button>
                </div>
                <h3>${product.title}</h3>
                <h4>$${product.price}</h4>
            </article>
            <!-- end of single product -->
            `;
        });
        productsDOM.innerHTML = result;
    }
    getBagButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')]
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
           let inCart = cart.find(item => item.id === id);
           if(inCart){
            button.innerText = 'No Carrinho';
            button.disable = true
           }
           else {
            button.addEventListener('click', (event) => {
                event.target.innerText = 'No Carrinho';
                event.target.disable = true
                // get product from products
                let cartItem = {...Storage.getProduct(id), amount:1};
                // add product to the cart 
                cart = [...cart, cartItem];
                console.log(cart)
                // save cart in local storage
                // set cart values
                // display cart item
                // show the cart
            })
           }
        })
    }
}
//local storage
class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products()

    // get all products
    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.saveProducts(products)
    }).then(() => {
        ui.getBagButtons();
    });
})

