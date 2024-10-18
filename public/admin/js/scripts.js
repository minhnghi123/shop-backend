let boxFilter = document.querySelector("[box-filter]");

if (boxFilter) {
  let url = new URL(location.href);
  boxFilter.addEventListener("change", () => {
    const value = boxFilter.value;
    if (value) {
      url.searchParams.set("status", value);
    } else {
      url.searchParams.delete("status");
    }
    location.href = url.href;
  });
  const currentStatus = url.searchParams.get("status");
  if (currentStatus) boxFilter.value = currentStatus;
}

let sortSelect = document.querySelector("[sort-select]");

if (sortSelect) {
  let url = new URL(location.href);
  sortSelect.addEventListener("change", () => {
    const value = sortSelect.value;
    if (value) {
      // console.log(value);
      const [keyName, keyValue] = value.split("-");
      url.searchParams.set("keyName", keyName);
      url.searchParams.set("keyValue", keyValue);
    } else {
      url.searchParams.delete("keyName");
      url.searchParams.delete("keyValue");
    }
    location.href = url.href;
  });
  const keyName = url.searchParams.get("keyName");
  const keyValue = url.searchParams.get("keyValue");
  if (keyName && keyValue) {
    sortSelect.value = `${keyName}-${keyValue}`;
  }
}

const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  let url = new URL(location.href);
  formSearch.addEventListener("submit", (event) => {
    event.preventDefault(); //prevent the transition to the api page->load again web -> u can not get the value in the inputText
    // console.log(formSearch.inputValue.value); //inputValue that is a name of the inputText and you wanna get value , you have to use term inputValue.value/

    //formSearch.inputValue ->get the form by its name
    //formSearch.inputValue.value->get the value in the form
    const inputValue = formSearch.inputValue.value;
    if (inputValue) {
      url.searchParams.set("inputValue", inputValue);
    } else {
      url.searchParams.delete("inputValue");
    }
    location.href = url.href; // load again web , simultaneously load again file js
  });
  const currentFinding = url.searchParams.get("inputValue");
  if (currentFinding) formSearch.inputValue.value = currentFinding;
}
//pagination
const paginationButton = document.querySelectorAll(".page-link");

if (paginationButton.length > 0) {
  let url = new URL(location.href);
  paginationButton.forEach((button) => {
    button.addEventListener("click", () => {
      // console.log(button.getAttribute("button-pagination"));
      const buttonPagination = button.getAttribute("button-pagination");
      if (buttonPagination > 1) {
        url.searchParams.set("page", buttonPagination);
      } else url.searchParams.delete("page");
      location.href = url.href;
    });
  });
  const currentPage = url.searchParams.get("page") || 1;
  if (currentPage) {
    const currentButton = document.querySelector(
      `[button-pagination="${currentPage}"]`
    );
    currentButton.parentNode.classList.add("active");
  }
}
//end pagination

//change-status by click button
const buttonChange = document.querySelectorAll("[button-change]");
if (buttonChange.length > 0) {
  buttonChange.forEach((button) => {
    button.addEventListener("click", () => {
      // console.log(button.getAttribute("id-Product"));
      const idProduct = button.getAttribute("id-Product");
      const stateChange = button.getAttribute("button-change");
      const infoChange = {
        idProduct,
        stateChange,
      };
      const link = button.getAttribute("link");
      // console.log(link);
      // console.log(infoChange);
      fetch(link, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(infoChange),
      })
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          // console.log(data);
          if (data.success === "200") {
            location.reload();
          }
        });
    });
  });
}

// auto-checked when clicking
function toggleCheckbox(row) {
  const checkbox = row.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
  const checkedProducts = document.querySelectorAll(
    "[checked-products]:checked"
  );
  // console.log(checkedProducts);
  const deleteButton = document.querySelector("[button-delete-multi]");
  if (checkedProducts.length > 0) {
    deleteButton.classList.add("btn-danger");
  } else {
    deleteButton.classList.remove("btn-danger");
  }
}

//change-multi-status
const formMulti = document.querySelector("[form-search-change-multi]");
if (formMulti) {
  formMulti.addEventListener("submit", (event) => {
    event.preventDefault();
    const statusValue = document.querySelector(
      "[box-filter-change-multi]"
    ).value;
    const link = formMulti.getAttribute("link");
    // console.log(statusValue.value);
    const checkedProducts = document.querySelectorAll(
      "[checked-products]:checked"
    ); //->object
    // console.log(checkedProducts);
    let arrID = [];
    checkedProducts.forEach((product) => {
      const productId = product.getAttribute("id-checked");
      // console.log(productId);
      arrID.push(productId);
    });
    // console.log(arrID);
    const dataInfo = {
      statusValue,
      arrID,
    };
    // console.log(dataInfo);
    fetch(link, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        {
          if (data.success === "200") {
            console.log(data);
            location.reload();
          }
        }
      });
  });
}
//delete
const buttonDeleteMulti = document.querySelector("[button-delete-multi]");
// console.log(buttonDeleteMulti);
if (buttonDeleteMulti) {
  buttonDeleteMulti.addEventListener("click", () => {
    const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
    if (!isConfirm) {
      return;
    }
    const checkedProducts = document.querySelectorAll(
      "[checked-products]:checked"
    );
    const link = buttonDeleteMulti.getAttribute("link");
    let arrID = [];
    checkedProducts.forEach((product) => {
      const productId = product.getAttribute("id-checked");
      // console.log(productId);
      arrID.push(productId);
    });
    const dataInfo = {
      arrID,
    };
    fetch(link, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        {
          if (data.success === "200") {
            // console.log(data);
            location.reload();
          }
        }
      });
  });
}
//delete perProduct
const deleteButtons = document.querySelectorAll(".btn-delete");
// console.log(deleteButtons);
deleteButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
    if (!isConfirm) {
      return;
    }
    const idProduct = button.getAttribute("id-Product");
    // console.log(idProduct);
    const dataInfo = { idProduct };
    const link = button.getAttribute("link");
    fetch(link, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        {
          if (data.success === "200") {
            // console.log(data);
            location.reload();
          }
        }
      });
  });
});
//change-position
const positionButton = document.querySelectorAll("[input-position]");
// console.log(positionButton);
if (positionButton.length > 0) {
  positionButton.forEach((button) => {
    button.addEventListener("change", () => {
      const newPosition = button.value;
      const link = button.getAttribute("link");
      const idProduct = button.getAttribute("item-id");
      const dataInfo = { newPosition, idProduct };
      fetch(link, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PATCH",
        body: JSON.stringify(dataInfo),
      })
        .then((res) => res.json())
        .then((data) => {
          {
            if (data.success === "200") {
              console.log(data);
              location.reload();
            }
          }
        });
    });
  });
}
//show notifications during 3seconds
const notifications = document.querySelector("[alert-message]");
if (notifications) {
  setTimeout(() => {
    notifications.style.display = "none";
  }, 2500);
}

//preview image when uploading
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector(
    "[upload-image-preview]"
  );
  uploadImageInput.addEventListener("change", () => {
    const file = uploadImageInput.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}

// Phân quyền
const tablePermissions = document.querySelector("[table-permissions]");
console.log(tablePermissions);
if (tablePermissions) {
  const buttonSubmit = document.querySelector("[button-submit]");
  buttonSubmit.addEventListener("click", () => {
    const dataFinal = [];
    const listElementRoleId = document.querySelectorAll("[role-id]");
    listElementRoleId.forEach((elementRoleId) => {
      const roleId = elementRoleId.getAttribute("role-id");
      const permissions = [];
      const listInputChecked = document.querySelectorAll(
        `input[data-id="${roleId}"]:checked`
      );
      listInputChecked.forEach((input) => {
        const tr = input.closest(`tr[data-name]`);
        const name = tr.getAttribute("data-name");
        permissions.push(name);
      });
      dataFinal.push({
        id: roleId,
        permissions: permissions,
      });
    });
    const path = buttonSubmit.getAttribute("data-path");
    fetch(path, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PATCH",
      body: JSON.stringify(dataFinal),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code == "success") {
          location.reload();
        }
      });
  });
  // Hiển thị mặc định
  let dataPermissions = tablePermissions.getAttribute("table-permissions");
  dataPermissions = JSON.parse(dataPermissions);
  dataPermissions.forEach((item) => {
    item.permissions.forEach((permission) => {
      const input = document.querySelector(
        `tr[data-name="${permission}"] input[data-id="${item._id}"]`
      );
      input.checked = true;
    });
  });
}
// Hết Phân quyền
//filter by price
