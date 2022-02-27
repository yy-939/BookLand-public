
/* Display time */
/* reference: https://phpcoder.tech/display-current-date-and-time-in-html-using-javascript/ */
window.onload = function displayTime(){
    const today = new Date();
    const date = 'for '+today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    document.getElementById("time").innerText = date;
}


/********** Recommendation book display **********/
const recommendedBooks = [];

class Book {
	constructor(bid, title, author, cover, link) {
        this.bookId = bid; // get it from book detail page
		this.title = title;
		this.author = author;
        this.cover = cover;
        this.link = link; // link to book detail page
    }
}

function BooksCallBack() {
    /// Get recommendaed books from server
    // code below requires server call
    // books in recommendedBooks list should be added by admin user
    recommendedBooks.push(
        new Book(0, 'Solaris', 'Stanisław Herman Lem', 
        'https://upload.wikimedia.org/wikipedia/en/d/d1/SolarisNovel.jpg',
        '../BookDetail/BookDetail-Solaris.html'));
    recommendedBooks.push(
        new Book(1, 'Tres Tristes Tigres', 'Guillermo Cabrera Infante', 
        'https://upload.wikimedia.org/wikipedia/en/0/0f/Tres_tristes_tigres_%28Guillermo_Cabrera_Infante%29.png', 
        '../BookDetail/BookDetail-Solaris.html')); // need to change
 }

const bookul = document.querySelector('#recommendation ul');
BooksCallBack()
displayRecommendations()

// clean all before display
function cleanRecommendation(){
    const lis = bookul.children;
    for (let i=0; i<4; i++){
        if (lis[i] != null){
            lis[i].remove();
        }
    }
}

function displayRecommendations(){
    cleanRecommendation();

    for (let i=0; i<4; i++){
        if (recommendedBooks[i] != null){
        let li = document.createElement('li')
        let bookName = recommendedBooks[i].title;
        let bookAuthor = recommendedBooks[i].author;
        let bookCover = recommendedBooks[i].cover;
        let bookLink = recommendedBooks[i].link;
        let bid = recommendedBooks[i].bookId;

        let h2 = document.createElement('h2')
        h2.className = 'bookTitle'
        let a = document.createElement('a')
        a.className = 'linkColor'
        a.setAttribute('href', bookLink)
        a.innerText = bookName
        h2.appendChild(a)

        let p = document.createElement('p')
        p.className = 'bookAuthor'
        p.innerText = bookAuthor
        let brid = document.createElement('br')
        let span1 = document.createElement('span')
        span1.className = 'bookId'
        span1.innerText = 'BookID: '
        let span2 = document.createElement('span')
        span2.className = 'bookId'
        span2.innerText = bid
        p.appendChild(brid)
        p.appendChild(span1) 
        p.appendChild(span2) // Book id is here

        let img = document.createElement('img')
        img.className = 'bookCover'
        img.setAttribute('src', bookCover)
        img.setAttribute('alt', 'book cover')

        li.appendChild(h2)
        li.appendChild(p)
        li.appendChild(img)
        bookul.append(li)
        }
    }
}




