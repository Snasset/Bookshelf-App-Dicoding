const books = [];
const SUBMIT_EVENT = "submit-book";
const submitForm = document.getElementById("inputBook");
const submitSearchForm = document.getElementById("searchBook");
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELFS";

document.addEventListener("DOMContentLoaded", function () {
  bookIsCompleteCheckBox();

  submitSearchForm.addEventListener("submit", function (event) {
    event.preventDefault();
    searchButton();
  });

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadStorage();
  }
});

function searchButton() {
  const inputSearch = document
    .getElementById("searchBookInput")
    .value.toLowerCase();
  for (const book of books) {
    const bookItem = document.getElementById(`book-${book.id}`);
    const isVisible =
      book.title.toLowerCase().includes(inputSearch) ||
      book.author.toLowerCase().includes(inputSearch) ||
      book.year.includes(inputSearch);
    bookItem.classList.toggle("hide", !isVisible);
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser yang anda pakai tidak mendukung local storage.");
    return false;
  }
  return true;
}

function saveToStorage() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(SUBMIT_EVENT));
}

function generateBookData(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function newId() {
  return +new Date();
}

function addBook() {
  const newID = newId();
  const bookTitle = document.getElementById("inputBookTitle").value;
  const authorName = document.getElementById("inputBookAuthor").value;
  const bookYear = document.getElementById("inputBookYear").value;
  const isBookComplete = document.getElementById("inputBookIsComplete").value;
  if (isBookComplete === "no") {
    const isCompleted = false;
    const newBook = generateBookData(
      newID,
      bookTitle,
      authorName,
      bookYear,
      isCompleted
    );
    books.push(newBook);
  } else {
    const isCompleted = true;
    const newBook = generateBookData(
      newID,
      bookTitle,
      authorName,
      bookYear,
      isCompleted
    );
    books.push(newBook);
  }

  document.dispatchEvent(new Event(SUBMIT_EVENT));
  saveToStorage();
}

function putBook(bookData) {
  const { id, title, author, year, isComplete } = bookData;

  const titleOfBook = document.createElement("h3");
  titleOfBook.innerText = title;

  const nameOfAuthor = document.createElement("p");
  nameOfAuthor.innerText = `Penulis : ${author}`;

  const yearOfBook = document.createElement("p");
  yearOfBook.innerText = `Tahun : ${year}`;

  const bookContainer = document.createElement("div");
  bookContainer.classList.add("action");
  bookContainer.setAttribute("id", "actions");

  const container = document.createElement("div");
  container.classList.add("book_item");
  container.append(titleOfBook, nameOfAuthor, yearOfBook, bookContainer);
  container.setAttribute("id", `book-${id}`);

  if (isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("undobtn");
    undoButton.innerText = "Belum Dibaca";
    undoButton.addEventListener("click", function () {
      undoBookFromCompletedShelf(id);
    });

    const removeButton = document.createElement("button");
    removeButton.classList.add("removebtn");

    removeButton.innerText = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBook(id);
    });
    const editButton = document.createElement("button");
    const inputFormTitle = document.getElementById("input_section_title");
    editButton.classList.add("editbtn");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editBook(id);
    });
    inputFormTitle.innerText = "Masukkan Buku Baru";

    bookContainer.append(undoButton, removeButton, editButton);

  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("checkbtn");

    checkButton.innerText = "Selesai Dibaca";
    checkButton.addEventListener("click", function () {
      addBookToCompletedShelf(id);
    });
    const removeButton = document.createElement("button");
    removeButton.classList.add("removebtn");
    removeButton.innerText = "Hapus Buku";
    removeButton.addEventListener("click", function () {
      removeBook(id);
    });
    const editButton = document.createElement("button");
    const inputFormTitle = document.getElementById("input_section_title");
    editButton.classList.add("editbtn");
    editButton.innerText = "Edit Buku";
    editButton.addEventListener("click", function () {
      editBook(id);
    });
    inputFormTitle.innerText = "Masukkan Buku Baru";

    bookContainer.append(checkButton, removeButton, editButton);
  }

  return container;
}

function bookIsCompleteCheckBox() {
  const isBookComplete = document.getElementById("inputBookIsComplete");
  const changeSubmitText = document.getElementById("submitText");

  isBookComplete.addEventListener("click", () => {
    if (isBookComplete.value === "no") {
      isBookComplete.value = "yes";
      changeSubmitText.innerText = "Selesai dibaca";
    } else if (isBookComplete.value === "yes") {
      isBookComplete.value = "no";
      changeSubmitText.innerText = "Belum selesai dibaca";
    }
  });
}

function findBook(id) {
  for (const book of books) {
    if (id == book.id) {
      return book;
    }
  }
  return null;
}

function findBookIndex(id) {
  for (const i in books) {
    if (id == books[i].id) {
      return i;
    }
  }
}

function addBookToCompletedShelf(id) {
  const foundBook = findBook(id);
  if (foundBook == null) return;

  foundBook.isComplete = true;
  document.dispatchEvent(new Event(SUBMIT_EVENT));

  saveToStorage();
}

function undoBookFromCompletedShelf(id) {
  const foundBook = findBook(id);
  if (foundBook == null) return;

  foundBook.isComplete = false;
  document.dispatchEvent(new Event(SUBMIT_EVENT));
  saveToStorage();
}

function removeBook(id) {
  const foundBook = findBookIndex(id);
  const bookTitle = findBook(id);
  const confirmation = confirm(
    `Buku "${bookTitle.title}" akan hilang selamanya setelah dihapus. Apakah anda yakin menghapusnya?`
  );
  if (confirmation) {
    books.splice(foundBook, 1);
    alert("Hapus telah berhasil");
  }
  if (foundBook === -1) return;

  document.dispatchEvent(new Event(SUBMIT_EVENT));
  saveToStorage();
}

function editBook(id) {
  const foundBook = findBook(id);
  const bookIndex = findBookIndex(id);
  const bookTitle = document.getElementById("inputBookTitle");
  const authorName = document.getElementById("inputBookAuthor");
  const bookYear = document.getElementById("inputBookYear");
  const inputFormTitle = document.getElementById("input_section_title");

  if (foundBook == null) {
    return null;
  } else {
    bookTitle.value = foundBook.title;
    authorName.value = foundBook.author;
    bookYear.value = foundBook.year;
    inputFormTitle.innerText = `Edit Buku "${foundBook.title}"`;
    books.splice(bookIndex, 1);

    if (findBookIndex === -1) return;
  }
}

document.addEventListener(SUBMIT_EVENT, function () {
  const completeBookshelfList = document.getElementById(
    "completeBookshelfList"
  );
  const incompleteBookshelfList = document.getElementById(
    "incompleteBookshelfList"
  );

  completeBookshelfList.innerHTML = "";
  incompleteBookshelfList.innerHTML = "";
  for (const book of books) {
    const bookObject = putBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookObject);
    } else {
      incompleteBookshelfList.append(bookObject);
    }
  }
});
