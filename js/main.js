let books = [];
let booksWrapper = $(".books__wrapper"),
  inputSearch = $(".input-search"),
  resultNumber = $("#resultNumber"),
  searchInput = $("#search-input"),
  darkButton = $("#dark-mode"),
  aside = $("aside"),
  main = $("main"),
  navItem = $(".nav-item"),
  mainSection = $("#main"),
  bookmarkWrapper = $("#bookmark"),
  toggleWrapper = $(".menu-wrapper"),
  closeBtn = $("#close-menu"),
  parentMenu = $("#parent-menu"),
  bookTitle = $(".booktitle")

let baseUrl = "https://www.googleapis.com/books/v1";

// ------------------- Response Data -------------------
async function responseData(url) {
  booksWrapper.innerHTML = `<span class="loader"></span>`;
  let response = await fetch(url + "/volumes?q=a&maxResults=40");
  let result = await response.json();
  renderData(result.items);
}
responseData(baseUrl);

// ------------------  Render Data ------------------

let classCard = "bg-white py-[20px] px-[12px] rounded-[5px] shadow-md";

function renderData(arr) {
  booksWrapper.innerHTML = "";
  resultNumber.textContent = `Showing ${arr.length} Result(s)`;
  arr.forEach((item) => {
    let card = createElement(
      "div",
      `${classCard}`,
      `
     <div class="py-[14px] bg-[#F8FAFD] rounded-[5px] px-[20px]">
            <img src="${
              item.volumeInfo.imageLinks.smallThumbnail
            }" alt="book" class="w-[201px] h-[202px] rounded-[5px]">
     </div>
         <p class="font-medium text-[18px] pt-[13px] mb-1">${
           item.volumeInfo.title.length > 25
             ? item.volumeInfo.title.slice(0, 22) + "..."
             : item.volumeInfo.title
         }</p>
        <p class="font-medium text-[13px] text-[#757881]">${
          item.volumeInfo.authors && item.volumeInfo.authors.length > 0
            ? item.volumeInfo.authors[0].substring(0, 25)
            : ""
        }</p>

        <p class="font-medium text-[13px] text-[#757881] mb-[10px]">${
          item.volumeInfo.publishedDate
        }</p>
        <div class="flex justify-between mb-[15px]">
            <button data-id="${
              item.id
            }" class="bookmark bg-[#FFD80D] py-[10px] px-[20px] font-medium rounded-[4px]">Bookmark</button>
            <button class="read-more text-[#0D75FF] py-[10px] px-[20px] font-medium rounded-[4px] bg-[#0D75FF0D]">More Info</button>
        </div>
       <button class="w-[200px]">
       <a href="${
         item.volumeInfo.previewLink
       }" target="_blank" class="bg-[#75828A] font-medium text-white py-[10px] px-[103px] rounded-[4px]">Read</a>
       </button>
            `
    );
    booksWrapper.appendChild(card);
  });
}

searchInput.addEventListener("keyup", (e) => {
  if (e.keyCode == 13 && e.target.value.trim().length) {
    let bookName = e.target.value;
    globalSearch(bookName);
  }
});

// ------------------ GLOBAL SEARCH ------------------

async function globalSearch(bookName) {
  booksWrapper.innerHTML = `<span class="loader"></span>`;
  let response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${bookName}&startIndex=0&maxResults=30`
  );
  let result = await response.json();
  renderData(result.items);
}
//

// ----------------- Log Out ----------------------

(function () {
  let token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "../pages/login.html";
  }
})();

function logOut() {
  localStorage.removeItem("token");
  window.location.href = "../pages/login.html";
}

//--------------- Dark Mode-------------
darkButton.addEventListener("click", () => {
  darkButton.classList.toggle("darkMode");
  if (darkButton.classList.contains("darkMode")) {
    darkButton.innerHTML = `<i class="bi bi-brightness-low-fill text-[#FFCE31] text-3xl"></i>`;
    document.body.style.backgroundColor = `rgb(2, 2, 39)`;
    document.body.style.color = `#FFF`;
    inputSearch.style.color = `#FFF`;
    aside.style.backgroundColor = `rgb(2, 2, 39)`;
    aside.style.color = `#FFF`;
    main.style.backgroundColor = `rgb(2, 2, 39)`;
    main.style.color = `#FFF`;
    navItem.style.backgroundColor = `rgb(66, 66, 72)`;
    navItem.style.color = `#FFF`;
    mainSection.style.backgroundColor = `rgb(2, 2, 39)`;
    mainSection.style.color = `#FFF`;
  } else {
    darkButton.innerHTML = `<i class="bi bi-moon-stars-fill text-[#FFCE31] text-2xl"></i>`;
    document.body.style.backgroundColor = `#FFF`;
    document.body.style.color = `#000`;
    aside.style.backgroundColor = `#FFF`;
    aside.style.color = `#000`;
    inputSearch.style.color = `rgba(0,0,0,0.24)`;
    main.style.backgroundColor = `#FFF`;
    main.style.color = `#000`;
    navItem.style.backgroundColor = `#F8FAFD`;
    navItem.style.color = `#000`;
    mainSection.style.backgroundColor = `#F8FAFD`;
    mainSection.style.color = `#000`;
  }
});


// ---------------------Add to bookmark------------------------
booksWrapper.addEventListener("click", (e) => {
  if (e.target.classList.contains("bookmark")) {
    bookmarkWrapper.innerHTML = ""
    let id = e.target.dataset.id;

    searchBookById(id)
    renderBookmark(bookMarkList)
  }
});

let bookMarkList = JSON.parse(localStorage.getItem("bookmark")) || [];

// ----------------------Search book by Id -------------------------

async function searchBookById(id) {
  try {
    const response = await fetch(`${baseUrl}/volumes/${id}`);
    const result = await response.json()

    if(bookMarkList.length){
      let duplicate = bookMarkList.map((el)=> el.id)

      if(!duplicate.includes(id)){
        bookMarkList.push(result)
        localStorage.setItem("bookmark", JSON.stringify(bookMarkList))
        //notify
      }else{
        // notify
      }
    }else{
      bookMarkList.push(result);
      localStorage.setItem("bookmark", JSON.stringify(bookMarkList));
      // notify
    }

  } catch (e) {
    console.log(e.message);
  }
}


let listItemClassName = "nav-item flex items-center justify-between bg-[#F8FAFD] py-[15px] px-[10px] rounded-[4px] mb-[15px]";

// ------------------------ Render Bookmark List---------------------
function renderBookmark(data){
  if(data.length){
    data.forEach((el)=>{
      const list = createElement(
        "li",
        listItemClassName,
        `
      <span>
         <p class="rubik-font text-[13px] font-medium">${el.volumeInfo?.title.substring(
           0,
           20
         )}</p>
         <p class="font-[Noto Sans, sans-serif] text-[#757881] text-[10px]">${
           el.volumeInfo?.authors
         }</p>
     </span>
     <span class="flex gap-[6px]">
         <a href="${el.volumeInfo.previewLink}" target="_blank">
              <i class="bi bi-book text-[#75828A] text-xl"></i>
         </a>
         <button class="del-btn" data-del="${el.id}">
              <i class="bi bi-x-square del-btn text-[#FF6231] text-xl" data-del="${el.id}"></i>
         </button>
     </span>
      
      `
      );

      bookmarkWrapper.appendChild(list)
    })
  }
}

renderBookmark(bookMarkList);


// ----------------delete book items-----------------

bookmarkWrapper.addEventListener("click", (e)=>{
  let deleteID = e.target.dataset.del

  if(e.target.classList.contains("del-btn")){
    const filterList = bookMarkList.filter((el)=> el.id != deleteID)

    localStorage.setItem("bookmark", JSON.stringify(filterList))

    window.location.reload()
  }
})



// ------------- Read more--------------------


booksWrapper.addEventListener("click", (e)=>{
  if(e.target.classList.contains("read-more")){
    let id = e.target.dataset.id
    searchBook(id)

    toggleWrapper.classList.toggle("hide-toggle-menu")
  }
})



async function searchBook(id) {
  try {
    const response = await fetch(`${baseUrl}/volumes/${id}`);
    const result = await response.json();
    renderContent(result)
    
  } catch (e) {
    console.log(e.message);
  }
}


closeBtn.addEventListener("click", ()=>{
    toggleWrapper.classList.toggle("hide-toggle-menu");
})


function renderContent(data){
  const {
    volumeInfo: {
      title,
      description,
      authors,
      publishedDate,
      publisher,
      categories,
      pageCount,
      previewLink,
      imageLinks: { thumbnail },
    },
  } = data;

  bookTitle.textContent = `${title}`

  const content = createElement(
    "div",
    "",
    `
  <img src="${thumbnail}" alt="books" class="border block mx-auto max-w-[210px] mb-[40px]">
                    
         <p class="text-gray-500 text-left px-[40px] mb-[40px]">${description}</p>
                    
          <div class="px-[40px]">
                    
        <div class="flex gap-[10px] items-center mb-[14px]">
            <p class="text-[#222531] font-medium">Authors: </p>
            <div class="flex gap-[6px]">
                <p class="text-[#0D75FF] bg-[#0D75FF17] py-[5px] px-[18px] rounded-[30px] cursor-pointer">${authors}</p>
                <p class="text-[#0D75FF] bg-[#0D75FF17] py-[5px] px-[18px] rounded-[30px] cursor-pointer">
                    Author 2</p>
            </div>
        </div>
                    
          <div class="flex gap-[10px] items-center mb-[14px]">
              <p class="text-[#222531] font-medium">Published: </p>
              <p class="text-[#0D75FF] bg-[#0D75FF17] py-[5px] px-[18px] rounded-[30px] cursor-pointer">${publishedDate}</p>
          </div>
                    
          <div class="flex gap-[10px] items-center mb-[14px]">
              <p class="text-[#222531] font-medium">Publisher: </p>
              <p class="text-[#0D75FF] bg-[#0D75FF17] py-[5px] px-[18px] rounded-[30px] cursor-pointer">${publisher}</p>
          </div>
                    
          <div class="flex gap-[10px] items-center mb-[14px]">
              <p class="text-[#222531] font-medium">Categories: </p>
              <p class="text-[#0D75FF] bg-[#0D75FF17] py-[5px] px-[18px] rounded-[30px] cursor-pointer">${categories}</p>
          </div>
                    
          <div class="flex gap-[10px] items-center mb-[14px]">
              <p class="text-[#222531] font-medium">Pages Count: </p>
              <p class="text-[#0D75FF] bg-[#0D75FF17] py-[5px] px-[18px] rounded-[30px] cursor-pointer">${pageCount}</p>
          </div>
                    
       </div>
                    
      <div class="p-[22px] bg-[#F8FAFD] flex justify-end">
          <a href="${previewLink}" target="_blank" id="close-menu"
              class="px-[39px] py-[9px] cursor-pointer hover:bg-gray-500 bg-[#75828A] rounded-[4px] font-medium text-white">
              Read
          </a>
      </div>

  `
  );

  parentMenu.appendChild(content)
}