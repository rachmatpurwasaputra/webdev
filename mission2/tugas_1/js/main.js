let shop = document.getElementById("catalogue-container");
let shoppingCart = document.getElementById("my-cart-item-list");
let shoppingTotalPricing = document.getElementById("my-cart-final-pricing");
let invoiceItemList = document.getElementById("invoice-item-lists")
let invoiceTotalPricing = document.getElementById("invoice-final-pricing");

let shopItemsData = [{
    itemID: "64f1d7d2d701a6cc9000f9a3",
    itemName: "Bedak Marcks'",
    itemPrice: 30000,
    itemImg: "./img/bedak.jpg",
    itemImgAltText: "bedak"
}, {
    itemID: "64f1d7d2d701a6cc9000f9a6",
    itemName: "Buku Tulis Binder B5",
    itemPrice: 45000,
    itemImg: "./img/buku-tulis.jpg",
    itemImgAltText: "buku tulis"
}, {
    itemID: "64f1d7d2d701a6cc9000f9ab",
    itemName: "Jam Dinding Romawi",
    itemPrice: 20000,
    itemImg: "./img/jam-dinding.jpg",
    itemImgAltText: "jam dinding"
}, {
    itemID: "64f1d7d2d701a6cc9000f9b1",
    itemName: "Kaos Kaki Nike 3 pasang 1 set semata kaki",
    itemPrice: 100000,
    itemImg: "./img/kaos-kaki.jpg",
    itemImgAltText: "kaos kaki"
}, {
    itemID: "64f1d7d2d701a6cc9000f9b4",
    itemName: "Pulpen Sarasa All variant",
    itemPrice: 55000,
    itemImg: "./img/sarasa.jpg",
    itemImgAltText: "pulpen sarasa"
}, {
    itemID: "64f1d7d2d701a6cc9000f9b9",
    itemName: "Sepeda ontel hiasan meja jadul",
    itemPrice: 125500,
    itemImg: "./img/sepeda.jpg",
    itemImgAltText: "sepeda"
}, {
    itemID: "64f1d7d2d701a6cc9000f9bd",
    itemName: "Sepatu warna khaki bahan kulit (barang impor)",
    itemPrice: 175000,
    itemImg: "./img/shoes.jpg",
    itemImgAltText: "sepatu" 
}, {
    itemID: "64f1d7d2d701a6cc9000f9c2",
    itemName: "TV LCD 24\"",
    itemPrice: 5000,
    itemImg: "./img/televisi.jpg",
    itemImgAltText: "televisi"
}];

let cart = JSON.parse(localStorage.getItem("data")) || [];

let generateItemCards = () => {
    return (shop.innerHTML = shopItemsData
        .map((x) => {
            let searchSavedItemQtyInCart = cart.find((y) => y.id === x.itemID) || []; 
            // 

            return `
            <div id="product-${x.itemID}" class="catalogue-card">
                <div class="catalogue-img">
                    <img src="${x.itemImg}" alt="${x.itemImgAltText}">
                </div>
                <div class="catalogue-detail">
                    <p class="item-title">${x.itemName}</p>
                </div>
                <div class="catalogue-price">
                    <p class="item-price">Rp${x.itemPrice.toLocaleString("id")}</p>
                </div>
                <div class="catalogue-qty-change-btn">
                    <button onclick="decrement('${x.itemID}')" class="qty-change-btn" title="decrease-qty">-</button>
                    <input type="number" id="${x.itemID}" value="0">
                    <button onclick="increment('${x.itemID}')" class="qty-change-btn" title="increase-qty">+</button>
                </div>
                <div class="catalogue-add-item-btn">
                    <button type="submit" onclick="generateCartItems(); countTotalAmount(shoppingTotalPricing); window.location.reload(true)">Tambah Barang</button>
                </div>
            </div>
            `;
        }).join("")
    );
};

let generateCartItems = () => {
    if(cart.length !== 0) {
        return (shoppingCart.innerHTML = cart.
            map((x) => {
                let { id, itemQty } = x;
                let searchItems = shopItemsData.find((y) => y.itemID === id) || [];

                // keep track of the number of item entered to the cart
                if (x.itemQty !== 0) {
                    document.getElementById(x.id).value = x.itemQty;
                }

                return `
                <div class="my-cart-item-card">
                    <div class="my-cart-img">
                        <img src="${searchItems.itemImg}" alt="${searchItems.itemImgAltText}">
                    </div>
                    <div class="my-cart-detail">
                        <div class="my-cart-item-name">
                            <p class="item-title">${searchItems.itemName}</p>
                        </div>
                        <div class="my-cart-multiply-price">
                            <p class="item-price">Rp${searchItems.itemPrice.toLocaleString("id")} x ${x.itemQty}</p>
                        </div>
                        <div class="my-cart-subtotal-item">
                            <p>Rp${(searchItems.itemPrice * x.itemQty).toLocaleString("id")}</p>
                        </div>
                    </div>
                </div>
                `;
            }).join(""));
    }
    else {
        shoppingCart.innerHTML = `
            <div id="empty-card-text">Belum ada barang di keranjang.</div>
        `;
    }
};

let generateInvoiceItemLists = () => {
    if(cart.length !== 0) {
        return (invoiceItemList.innerHTML = cart.
            map((x) => {
                let { id, itemQty } = x;
                let searchItems = shopItemsData.find((y) => y.itemID === id) || [];
                return `
                <div class="invoice-item-card">
                    <div class="my-cart-detail" style="padding-right: 8px;">
                        <div class="my-cart-item-name">
                            <p class="item-title">${searchItems.itemName}</p>
                        </div>
                        <div class="my-cart-multiply-price">
                            <p class="item-price">Rp${searchItems.itemPrice.toLocaleString("id")} x ${x.itemQty}</p>
                        </div>
                        <div class="my-cart-subtotal-item">
                            <p>Rp${(searchItems.itemPrice * x.itemQty).toLocaleString("id")}</p>
                        </div>
                    </div>
                </div>
                `;
            }).join(""));
    }
    else {
        invoiceItemList.innerHTML = `
            <div id="empty-card-text">Belum ada barang di keranjang.</div>
        `;
    }
};

let countTotalAmount = (HTMLElem) => {
    let _elemtype = "";
    if (HTMLElem === shoppingTotalPricing) {
        _elemtype = "my-cart"
    } else if (HTMLElem === invoiceTotalPricing) {
        _elemtype = "invoice"
    }

    let tax = 0;
    let amount = 0;

    if (cart.length !== 0) {
        amount = cart.map((x) => {
            let { id, itemQty } = x;
            let searchItems = shopItemsData.find((y) => y.itemID === id) || [];
            return itemQty * searchItems.itemPrice;
        }).reduce((x, y) => x+y, 0);

        tax = amount * 0.11;
    }

    return (HTMLElem.innerHTML = 
            `
                <div id="${_elemtype}-final-pricing-name">
                    <p>Total Pembelian</p>
                    <p>Pajak (11%)</p>
                    <p>Total Bayar</p>
                </div>
                <div id="${_elemtype}-final-pricing-value">
                    <p>Rp${amount.toLocaleString("id")}</p>
                    <p>Rp${tax.toLocaleString("id")}</p>
                    <p>Rp${(amount + tax).toLocaleString("id")}</p>
                </div>
                <div id="pay-btn">
                    <button class="btn btn-open" type="submit" id="pay-now-btn">Bayar sekarang</button>
                </div>
            `
     );
};

let generateInvoiceModal = () => {
    generateInvoiceItemLists();
    countTotalAmount(invoiceTotalPricing);
};

generateItemCards(); // for the item catalogue section

generateCartItems(); // for the my cart section
countTotalAmount(shoppingTotalPricing);

generateInvoiceModal() // for the invoice bill section

let increment = (itemID) => {
    let searchedItem = cart.find((x) => x.id === itemID);

    if (searchedItem === undefined){
        cart.push({
            id: itemID,
            itemQty: 1
        });
    } else {
        searchedItem.itemQty += 1;
    }
    
    update(itemID);
    // generateCartItems();
    // countTotalAmount(shoppingTotalPricing);
    localStorage.setItem("data", JSON.stringify(cart));
};

let decrement = (itemID) => { 
    let searchedItem = cart.find((x) => x.id === itemID);

    // if item founded
    if (searchedItem !== undefined) {
        //if item qty has reached 0
        if (searchedItem.itemQty === 0) return;
        //if there's still item qty on founded item
        else {
            searchedItem.itemQty -= 1;
        }
    }
    // if item not founded
    else {
        return;
    }

    update(itemID);

    cart = cart.filter((x) => x.itemQty !== 0);
    // generateCartItems();
    // countTotalAmount(shoppingTotalPricing);
    localStorage.setItem("data", JSON.stringify(cart));
};

let update = (itemID) => {
    let searchedItem = cart.find((x) => x.id === itemID);
    document.getElementById(itemID).value = searchedItem.itemQty;
};


/**
 * This code snippet below was being copied to this source code from:
 *  
 * https://www.freecodecamp.org/news/how-to-build-a-modal-with-javascript/
 */

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const openModalBtn = document.querySelector(".btn-open");
const closeModalBtn = document.querySelector(".btn-close");

// close modal function
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// open modal function
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};

// open modal event
openModalBtn.addEventListener("click", openModal);