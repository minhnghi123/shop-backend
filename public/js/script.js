const notifications = document.querySelector("[alert-message]");
if (notifications) {
  setTimeout(() => {
    notifications.style.display = "none";
  }, 2500);
}

const cartTable = document.querySelector("[cart-table]");
// console.log(cartTable);
if (cartTable) {
  const listInput = cartTable.querySelectorAll("input[name='quantity']");
  listInput.forEach((item) => {
    item.addEventListener("change", () => {
      const productId = item.getAttribute("item-id");
      const quantity = item.value;
      fetch("/cart/update", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify({
          productId: productId,
          quantity: quantity,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.code == "success") {
            location.reload();
          }
        });
    });
  });
}
