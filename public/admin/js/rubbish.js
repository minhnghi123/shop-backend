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

//form-search
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
// auto-checked when clicking
function toggleCheckbox(row) {
  const checkbox = row.querySelector('input[type="checkbox"]');
  checkbox.checked = !checkbox.checked;
}
//restore-all

const restoreAllButton = document.querySelector("[restore-all]");
// console.log(restoreAllButton);
if (restoreAllButton) {
  //
  restoreAllButton.addEventListener("click", () => {
    const isConfirm = confirm("Bạn có chắc muốn restore những bản ghi này?");
    if (!isConfirm) {
      return;
    }
    const checkbox = document.querySelectorAll('input[type="checkbox"]');
    checkbox.forEach((product) => {
      product.checked = !product.checked;
    });
    const link = restoreAllButton.getAttribute("link");
    const dataInfo = {
      restoreAll: true,
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
        if (data.response === "200") {
          location.reload();
          //   console.log(data.message);
        }
      });
  });
}
//delete permanent
const deletePermanentButtons = document.querySelectorAll("[delete-permanent]");
deletePermanentButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const isConfirm = confirm("Bạn có chắc muốn xóa những bản ghi này?");
    if (!isConfirm) {
      return;
    }
    const idProduct = button.getAttribute("id-Product");
    // console.log(idProduct);
    // const dataInfo = { idProduct };
    const link = button.getAttribute("link");
    // console.log(link);
    fetch(link, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "DELETE",
      body: JSON.stringify({
        id: idProduct,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == "200") {
          location.reload();
        }
      });
  });
});
