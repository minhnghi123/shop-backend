const notifications = document.querySelector("[alert-message]");
if (notifications) {
  setTimeout(() => {
    notifications.style.display = "none";
  }, 2500);
}

// const cartTable = document.querySelector("[cart-table]");
// if (cartTable) {
//   const buttonTmp = cartTable.querySelectorAll("input-group-btn");
//   const buttonMain = buttonTmp.querySelectorAll(button);
//   buttonMain.forEach((item) => {
//     item.addEventListener("click", () => {
//       const productId = item.getAttribute("productId");
//       const input = cartTable.querySelector(`[item-id = ${productId}]`);
//       const quantity = input.value;
//       fetch("/cart/update", {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         method: "PATCH",
//         body: JSON.stringify({
//           productId: productId,
//           quantity: quantity,
//         }),
//       })
//         .then((res) => res.json())
//         .then((data) => {
//           if (data.code == "success") {
//             location.reload();
//           }
//         });
//     });
//   });
// }
