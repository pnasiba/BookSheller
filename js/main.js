let books = [];
let booksWrapper = $(".books__wrapper");
let inputSearch = $(".input-search");
let resultNumber = $("#resultNumber");


// ------------------- Fetch Render -------------------

function fetchRender() {
  fetch("https://www.googleapis.com/books/v1/volumes?q=a&maxResults=40")
    .then((res) => res.json())
    .then((data) => {
      books = data.items;
      renderUi(books);
      resultNumber.textContent = `Showing ${data.totalItems} Result(s)`;
    });
}

fetchRender();

// ------------------  RENDER FUNCTION ------------------

function renderUi(arr) {
  booksWrapper.innerHTML = "";

  arr.forEach((item) => {
    let card = createElement(
      "div",
      "bg-white py-[20px] px-[12px] rounded-[5px] shadow-md",
      `
     <div class="py-[14px] bg-[#F8FAFD] rounded-[5px] px-[20px]">
            <img src="${
              item.volumeInfo.imageLinks
                ? item.volumeInfo.imageLinks.thumbnail
                : "https://picsum.photos/200/300"
            }" alt="book" class="w-[201px] h-[202px] rounded-[5px]">
     </div>
         <p class="font-medium text-[18px] pt-[13px] mb-1">${item.volumeInfo.title.slice(
           0,
           20
         )}...</p>
        <p class="font-medium text-[13px] text-[#757881]">${
          item.volumeInfo.authors && item.volumeInfo.authors[0].slice(0, 30)}...</p>
        <p class="font-medium text-[13px] text-[#757881] mb-[10px]">${
          item.volumeInfo.publishedDate
        }</p>
        <div class="flex justify-between mb-[15px]">
            <button class="bg-[#FFD80D] py-[10px] px-[20px] font-medium rounded-[4px]">Bookmark</button>
            <button class="text-[#0D75FF] py-[10px] px-[20px] font-medium rounded-[4px] bg-[#0D75FF0D]">More Info</button>
        </div>
       <button class="w-[200px]">
       <a href="${
         item.volumeInfo.previewLink
       }" target="blank" class="bg-[#75828A] font-medium text-white py-[10px] px-[103px] rounded-[4px]">Read</a>
       </button>
            `
    );
    booksWrapper.append(card);
  });
}



// ------------------ GLOBAL SEARCH ------------------

function globalSearch() {
  inputSearch.addEventListener("keyup", function (element) {
    let title = element.target.value;

    if (title.length >= 1) {
      fetch(`https://www.googleapis.com/books/v1/volumes?q=${title}`)
        .then((res) => res.json())
        .then((data) => {
          books = data.items;
          renderUi(books);
          if(resultNumber){
            resultNumber.textContent = `Showing ${data.totalItems} Result(s)`;
          } else{
            console.log(Error);
          }
        });
    } else {
      fetchRender();
    }
  });
}

globalSearch();

// ----------------- Log Out ----------------------

(function () {
  let token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../index.html";
  }
})();

function logOut() {
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}
