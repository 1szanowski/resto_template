import { menuArray } from "./data.js";

//getting obj from DOM
const feed = document.getElementById("items");
const totalOrder = document.getElementById("total-global");
//bin for products
let bin = [];
let total;
const close_btn = document.getElementById("close-btn");
const pay_btn = document.getElementById("pay-btn");

//click handling for adding products
document.addEventListener("click", function (e) {
  if (e.target.dataset.add) {
    handleClickAdd(e.target.dataset.add);
  } else if (e.target.dataset.remove) {
    handleRemove(e.target.dataset.remove);
  } else if (e.target.id == "complete_order") {
    handleComplete();
  }
});
// funtions for handling clicks
function handleClickAdd(id) {
  for (let product of menuArray) {
    if (product.id == id) {
      bin.push(product);
      countTotal();
      renderGlobal.renderTotal();
      renderGlobal.render();
    }
  }
}
function handleRemove(id) {
  let finded = false;
  let filtered = bin.filter((el) => {
    if (el.id == id && finded === false) {
      finded = true;
      return false;
    }
    return true;
  });
  bin = filtered;
  renderGlobal.renderTotal();
  renderGlobal.render();
  countTotal();
  if (bin.length < 1) {
    totalOrder.innerHTML = "";
    renderGlobal.render();
  }
}
function countTotal() {
  let total = bin.reduce((acc, el) => acc + el.price, 0);
  console.log(total);
}

function handleComplete() {
  let modal = document.getElementById("modal");

  modal.style.display == "none"
    ? (modal.style.display = "inline")
    : (modal.style.display = "none");
}
function handlePay() {
  let nameField = document.getElementById("username");
  let cardField = document.getElementById("card-num");
  let cvv = document.getElementById("cvv");
  if (
    nameField.value.length !== 0 &&
    !isNaN(parseInt(cardField.value)) &&
    !isNaN(parseInt(cvv.value))
  ) {
    let summary = document.getElementById("total-global");
    handleComplete();
    summary.innerText = `Thanks, ${nameField.value}! Your order is on its way!`;
  } else [console.log("error!")];
}
close_btn.addEventListener("click", handleComplete);
pay_btn.addEventListener("click", handlePay);

// global render object
const renderGlobal = {
  getItems: function getItems() {
    let items = menuArray.map(
      (el) => `
    <section class='item-section' id='${el.id}'>
    <p class="image">"${el.emoji}"</p>
        
    <div class="item-section-middle">
        <strong class="header-section">${el.name}</strong>
        <p class="descriptrion">${el.ingredients.join(", ")}</p>
        <p class="price">$${el.price}</p>
    </div>
    <button id="add-btn" data-add=${el.id}>+</button>
   
  </section>
  <div class="line"></div>
    `
    );
    return items.join("");
  },

  render: function render() {
    if (bin.length === 0) {
      feed.innerHTML = renderGlobal.getItems();
      totalOrder.innerHTML = ""; // Empty the totalOrder section if bin is empty
    } else {
      feed.innerHTML = renderGlobal.getItems();
      totalOrder.innerHTML = `
        <p class="total-head"><strong>Your Order</strong></p>
        <div id="order-summary">
          ${renderGlobal.renderTotal()}
        </div>
      `;
    }
  },
  groupElementsByID: function groupElementsByID(arr) {
    const groups = {};
    arr.forEach((el) => {
      if (groups[el.id]) {
        groups[el.id].push(el);
      } else {
        groups[el.id] = [el];
      }
    });
    return Object.values(groups);
  },
  renderTotal: function renderTotal() {
    if (bin.length > 0) {
      const groupedItems = renderGlobal.groupElementsByID(bin);

      let total = groupedItems.map((group) => {
        const totalPrice = group.reduce((acc, el) => acc + el.price, 0);
        return `
          <div class="order-part">
            <div class="order_inner">
              <p class="price-item">${group[0].name}</p>
              <button class="remove-btn" id="remove-btn" data-remove=${group[0].id}>Remove</button>
              <p class="price-total">$${totalPrice}</p>
            </div>
          </div>
        `;
      });

      let totalPrice = bin.reduce((acc, el) => acc + el.price, 0);

      if (totalPrice > 0) {
        total.push(`<div class=final_order>
        <div class="line"></div>
        <p class="total-order-price">Total order price is: $${totalPrice}</p>
        <button id="complete_order" class="complete_btn">Complete Order</button></div>`);
      }

      return total.join("");
    }
  },
};
renderGlobal.render();
