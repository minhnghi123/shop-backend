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
const selectFilter = document.querySelector("[select-filter]");
// console.log(selectFilter);
if (selectFilter) {
  let url = new URL(location.href);
  selectFilter.addEventListener("change", () => {
    const value = selectFilter.value;
    const [keyName, keyValue] = value.split("-");
    // console.log(keyName, keyValue);
    if (keyName && keyValue) {
      url.searchParams.set("keyName", keyName);
      url.searchParams.set("keyValue", keyValue);
    } else {
      url.searchParams.delete("keyName");
      url.searchParams.delete("keyValue");
    }
    location.href = url;
  });
  const keyName = url.searchParams.get("keyName");
  const keyValue = url.searchParams.get("keyValue");
  if (keyName && keyValue) {
    selectFilter.value = `${keyName}-${keyValue}`;
  }
}
const selectLimit = document.querySelector("[select-limit]");
// console.log(selectFilter);
if (selectLimit) {
  let url = new URL(location.href);
  selectLimit.addEventListener("change", () => {
    const value = selectLimit.value;

    if (value) {
      url.searchParams.set("limit", value);
    } else {
      url.searchParams.delete("limit");
    }
    location.href = url;
  });
  const limit = url.searchParams.get("limit");
  if (limit) {
    selectLimit.value = `${limit}`;
  }
}
