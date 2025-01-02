function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
    
    displayBooks(tabName);
    if (tabName === 'quotes') {
        displayQuotes();
    }
}

function addBook(tabName) {
    const bookTitle = prompt('Введіть назву книги:');
    if (bookTitle) {
        const book = { title: bookTitle };

        let bookList = JSON.parse(localStorage.getItem(tabName)) || [];
        
        bookList.push(book);
        
        localStorage.setItem(tabName, JSON.stringify(bookList));
        
        displayBooks(tabName);
    }
}

function deleteBook(tabName, index) {
    const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
    
    bookList.splice(index, 1);
    
    localStorage.setItem(tabName, JSON.stringify(bookList));
    
    displayBooks(tabName);
}

function moveBook(fromTab, toTab, index) {
    const fromList = JSON.parse(localStorage.getItem(fromTab)) || [];
    const toList = JSON.parse(localStorage.getItem(toTab)) || [];

    const book = fromList.splice(index, 1)[0]; 
    toList.push(book); 

    localStorage.setItem(fromTab, JSON.stringify(fromList));
    localStorage.setItem(toTab, JSON.stringify(toList));

    displayBooks(fromTab);
    displayBooks(toTab);
}

function updatePage(tabName, index) {
    const page = prompt('Введіть номер сторінки:');
    if (page) {
        const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
        bookList[index].page = page; 

        localStorage.setItem(tabName, JSON.stringify(bookList));
        
        displayBooks(tabName);
    }
}

function addReview(tabName, index) {
    const review = prompt('Напишіть відгук:');
    const rating = prompt('Встановіть оцінку від 1 до 10:');
    
    if (rating < 1 || rating > 10 || isNaN(rating)) {
        alert('Оцінка має бути числом від 1 до 10.');
        return;
    }
    
    if (review) {
        const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
        
        bookList[index].review = review;
        bookList[index].rating = rating;
        
        localStorage.setItem(tabName, JSON.stringify(bookList));
        
        displayBooks(tabName);
    }
}

function displayBooks(tabName) {
    const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
    const listElement = document.getElementById(`${tabName}-list`);

    listElement.innerHTML = ''; 

    bookList.forEach((book, index) => {
        const li = document.createElement('li');
        
        let pageField = '';
        if (tabName === 'inProgress' && book.page) {
            pageField = `, сторінка: ${book.page} <button onclick="updatePage('${tabName}', ${index})">Оновити сторінку</button>`;
        } else if (tabName === 'inProgress') {
            pageField = `<button onclick="updatePage('${tabName}', ${index})">Введіть сторінку</button>`;
        }

        let reviewField = '';
        if (tabName === 'completed') {
            if (book.review) {
                reviewField = `<div class="review-container"><p class="review-text">Відгук: ${book.review}</p><p>Оцінка: ${book.rating}/10</p></div>`;
            } else {
                reviewField = `<button onclick="addReview('${tabName}', ${index})">Написати відгук</button>`;
            }

            const heartButton = book.favorite ? 
                `<button onclick="toggleFavorite('${tabName}', ${index})" class="favorite-button active">❤️</button>` :
                `<button onclick="toggleFavorite('${tabName}', ${index})" class="favorite-button">🤍</button>`;
            reviewField += heartButton;
        }

        let buttons = '';
        if (tabName !== 'wishlist') {
            buttons += `<button onclick="moveBook('${tabName}', 'wishlist', ${index})">В бажані</button>`;
        }
        if (tabName !== 'inProgress') {
            buttons += `<button onclick="moveBook('${tabName}', 'inProgress', ${index})">В процесі</button>`;
        }
        if (tabName !== 'completed') {
            buttons += `<button onclick="moveBook('${tabName}', 'completed', ${index})">Завершити</button>`;
        }
        
        buttons += `<button onclick="deleteBook('${tabName}', ${index})">Видалити</button>`;

        li.innerHTML = `<span class="book-title">${book.title}</span> ${pageField} ${reviewField} ${buttons}`;
        listElement.appendChild(li);
    });
}

function openQuoteModal() {
    const modal = document.getElementById('quoteModal');
    const bookSelect = document.getElementById('bookSelect');

    bookSelect.innerHTML = '';

    ['inProgress', 'completed'].forEach(tabName => {
        const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
        bookList.forEach(book => {
            const option = document.createElement('option');
            option.value = book.title;
            option.textContent = book.title;
            bookSelect.appendChild(option);
        });
    });

    modal.style.display = "block";
}

function closeQuoteModal() {
    const modal = document.getElementById('quoteModal');
    modal.style.display = "none";
}

function addQuote() {
    const bookTitle = document.getElementById('bookSelect').value;
    const quoteText = document.getElementById('quoteText').value;

    if (bookTitle && quoteText) {
        const quote = { bookTitle, quoteText };

        let quotesList = JSON.parse(localStorage.getItem('quotes')) || [];
        quotesList.push(quote);

        localStorage.setItem('quotes', JSON.stringify(quotesList));

        displayQuotes();

        closeQuoteModal();
    } else {
        alert('Будь ласка, виберіть книгу та введіть цитату.');
    }
}

function displayQuotes() {
    const quotesList = JSON.parse(localStorage.getItem('quotes')) || [];
    const listElement = document.getElementById('quotes-list');
    const groupedQuotes = {};

    quotesList.forEach((quote) => {
        if (!groupedQuotes[quote.bookTitle]) {
            groupedQuotes[quote.bookTitle] = [];
        }
        groupedQuotes[quote.bookTitle].push(quote);
    });

    listElement.innerHTML = '';  

    for (const bookTitle in groupedQuotes) {
        const bookQuotes = groupedQuotes[bookTitle];
        
        const bookTitleElement = document.createElement('h3');
        bookTitleElement.textContent = bookTitle;
        listElement.appendChild(bookTitleElement);

        const bookQuotesList = document.createElement('ul');
        
        bookQuotes.forEach((quote, index) => {
            const li = document.createElement('li');
            li.innerHTML = `"<strong>${quote.quoteText}</strong>" 
                <button onclick="deleteQuote(${index})">Видалити</button>`;
            bookQuotesList.appendChild(li);
        });

        listElement.appendChild(bookQuotesList);
    }
}


function deleteQuote(index) {
    const quotesList = JSON.parse(localStorage.getItem('quotes')) || [];
    
    quotesList.splice(index, 1);
    
    localStorage.setItem('quotes', JSON.stringify(quotesList));
    
    displayQuotes();
}

function exportToJSON() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    const inProgress = JSON.parse(localStorage.getItem('inProgress')) || [];
    const completed = JSON.parse(localStorage.getItem('completed')) || [];
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];

    const data = {
        wishlist: wishlist,
        inProgress: inProgress,
        completed: completed,
        quotes: quotes
    };

    const jsonData = JSON.stringify(data, null, 2);

    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'books_and_quotes.json'; 
    a.click();

    URL.revokeObjectURL(url);
}

function importFromJSON(event) {
    const file = event.target.files[0]; 
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (data.wishlist) localStorage.setItem('wishlist', JSON.stringify(data.wishlist));
            if (data.inProgress) localStorage.setItem('inProgress', JSON.stringify(data.inProgress));
            if (data.completed) localStorage.setItem('completed', JSON.stringify(data.completed));
            if (data.quotes) localStorage.setItem('quotes', JSON.stringify(data.quotes));

            ['wishlist', 'inProgress', 'completed', 'quotes'].forEach(tabName => {
                displayBooks(tabName);
            });

            alert('Імпорт успішно завершено!');
        } catch (error) {
            alert('Помилка при імпорті файлу. Перевірте формат JSON.');
        }
    };

    reader.readAsText(file); 
}

function searchBooks(tabName) {
    const searchTerm = document.getElementById(`${tabName}-search`).value.toLowerCase();
    const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
    const listElement = document.getElementById(`${tabName}-list`);

    listElement.innerHTML = '';

    bookList
        .filter(book => book.title.toLowerCase().includes(searchTerm))
        .forEach((book, index) => {
            const li = document.createElement('li');

            let pageField = '';
            if (tabName === 'inProgress' && book.page) {
                pageField = `, сторінка: ${book.page} <button onclick="updatePage('${tabName}', ${index})">Оновити сторінку</button>`;
            } else if (tabName === 'inProgress') {
                pageField = `<button onclick="updatePage('${tabName}', ${index})">Введіть сторінку</button>`;
            }

            let reviewField = '';
            if (tabName === 'completed') {
                if (book.review) {
                    reviewField = `<div class="review-container"><p class="review-text">Відгук: ${book.review}</p><p>Оцінка: ${book.rating}/10</p></div>`;
                } else {
                    reviewField = `<button onclick="addReview('${tabName}', ${index})">Написати відгук</button>`;
                }
            }

            let buttons = '';
            if (tabName !== 'wishlist') {
                buttons += `<button onclick="moveBook('${tabName}', 'wishlist', ${index})">В бажані</button>`;
            }
            if (tabName !== 'inProgress') {
                buttons += `<button onclick="moveBook('${tabName}', 'inProgress', ${index})">В процесі</button>`;
            }
            if (tabName !== 'completed') {
                buttons += `<button onclick="moveBook('${tabName}', 'completed', ${index})">Завершити</button>`;
            }

            buttons += `<button onclick="deleteBook('${tabName}', ${index})">Видалити</button>`;

            li.innerHTML = `<span class="book-title">${book.title}</span> ${pageField} ${reviewField} ${buttons}`;
            listElement.appendChild(li);
        });
}

function toggleFavorite(tabName, index) {
    const bookList = JSON.parse(localStorage.getItem(tabName)) || [];
    const book = bookList[index];

    book.favorite = !book.favorite;

    localStorage.setItem(tabName, JSON.stringify(bookList));

    displayBooks(tabName);
}

function filterFavorites() {
    const showFavorites = document.getElementById('favorite-filter').checked;
    const bookList = JSON.parse(localStorage.getItem('completed')) || [];
    const listElement = document.getElementById('completed-list');
    
    listElement.innerHTML = '';  

    bookList
        .filter(book => !showFavorites || book.favorite)  
        .forEach((book, index) => {
            const li = document.createElement('li');

            let reviewField = '';
            if (book.review) {
                reviewField = `<div class="review-container"><p class="review-text">Відгук: ${book.review}</p><p>Оцінка: ${book.rating}/10</p></div>`;
            } else {
                reviewField = `<button onclick="addReview('completed', ${index})">Написати відгук</button>`;
            }

            const heartButton = book.favorite ? 
                `<button onclick="toggleFavorite('completed', ${index})" class="favorite-button active">❤️</button>` :
                `<button onclick="toggleFavorite('completed', ${index})" class="favorite-button">🤍</button>`;
            reviewField += heartButton;

            let buttons = `<button onclick="moveBook('completed', 'wishlist', ${index})">В бажані</button>`;
            buttons += `<button onclick="moveBook('completed', 'inProgress', ${index})">В процесі</button>`;
            buttons += `<button onclick="deleteBook('completed', ${index})">Видалити</button>`;

            li.innerHTML = `<span class="book-title">${book.title}</span> ${reviewField} ${buttons}`;
            listElement.appendChild(li);
        });
}

window.onload = function() {
    showTab('wishlist');
    ['wishlist', 'inProgress', 'completed'].forEach(tabName => {
        displayBooks(tabName);
    });
    filterFavorites();
};