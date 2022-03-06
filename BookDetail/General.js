
/****************************** Admin USER index-books js ******************************/
topMenuLink()

function topMenuLink(){
    const quit = document.querySelector('#topMenu .quit')
    const a = quit.children[0]
    a.onclick = function open(e){
        e.preventDefault();
        window.location.href = (a.href)
    }
}

/*************** Books & Booklists Data ********************/

const allBooks = [];

class Bookopt {
	constructor(bid, title, author, cover, description, link) {
        this.bookId = bid; // get it from book detail page
		this.title = title;
		this.author = author;
        this.cover = cover;
        this.description = description;
        this.link = link; // link to book detail page
    }
}

let BooklistsNum = 0; 
let BooklistsList = [] 

class DataBooklist {
	constructor(listName, creator, bookCollection) {
		this.listName = listName
		this.creator = creator; 
        this.books = bookCollection; // list of DataBook here, list of Book object in BooklistMain
		this.booklistID = BooklistsNum;
		BooklistsNum++;
	}
}

BooksCallBack()
BookListsCallBack()
displaySearchbox()

function BooksCallBack(){
    // Get all books in database
    allBooks.push(new Bookopt(0, 'Solaris', 'Stanisław Herman Lem', 
        'https://upload.wikimedia.org/wikipedia/en/d/d1/SolarisNovel.jpg',
        'It follows a crew of scientists on a research station as they attempt to understand an extraterrestrial intelligence, which takes the form of a vast ocean on the titular alien planet.',
        )); // currently link is empty
    allBooks.push(
        new Bookopt(1, 'Tres Tristes Tigres', 'Guillermo Cabrera Infante', 
        'https://upload.wikimedia.org/wikipedia/en/0/0f/Tres_tristes_tigres_%28Guillermo_Cabrera_Infante%29.png', 
        'It is a highly experimental, Joycean novel, playful and rich in literary allusions.',
        ));
    allBooks.push(
        new Bookopt(2, 'The Story of the Lost Child', 'Elena Ferrante', 
        'https://www.irishtimes.com/polopoly_fs/1.2348652.1441974000!/image/image.jpg', 
        "The fourth of Elena Ferrante’s celebrated Neapolitan novels, has a lot to deliver on.",
        ));    
    allBooks.push(
            new Bookopt(3, 'War and Peace', 'Leo Tolstoy', 
            'https://images-na.ssl-images-amazon.com/images/I/A1aDb5U5myL.jpg', 
            'The novel chronicles the French invasion of Russia and the impact of the Napoleonic era on Tsarist society through the stories of five Russian aristocratic families.',
            )); 
    allBooks.push(
            new Bookopt(4, 'Song of Solomon', 'Toni Morrison', 
            'https://images-na.ssl-images-amazon.com/images/I/61EKxawb6xL.jpg', 
            'It tells the story of Macon "Milkman" Dead, a young man alienated from himself and estranged from his family, his community, and his historical and cultural roots.',
            ));                   
}

function BookListsCallBack(){
    // Load default booklist data
    BooklistsList.push(new DataBooklist('novels', 'Admin',[allBooks[0],allBooks[1]]))
    BooklistsList.push(new DataBooklist('All spanish', 'Admin',[allBooks[1]]))
    BooklistsList.push(new DataBooklist('Before 20th', 'User',[allBooks[1], allBooks[3], allBooks[4],allBooks[0]]))
}


function displaySearchbox(){
    const searchbookArea = document.querySelector('.search-book')
    const t = searchbookArea.children[0]
    for (let i=0; i<allBooks.length; i++){
        if (allBooks[i] != null){
            const id = allBooks[i].bookId
            const name = allBooks[i].title
            const option = document.createElement('option')
            option.value = id
            option.innerText = name
            t.appendChild(option)
        }
    }
    

    const searchlistArea = document.querySelector('.search-list')
    const column = searchlistArea.children[0]
    for (let i=0; i<BooklistsNum; i++){
        if (BooklistsList[i] != null){
            const id = BooklistsList[i].booklistID
            const name = "[" + BooklistsList[i].listName + "] -- " +BooklistsList[i].creator
            const option = document.createElement('option')
            option.value = id
            option.innerText = name
            column.appendChild(option)
        }
    }
}

// Search Book 
const searchArea1 = document.querySelector('#search-button1')
searchArea1.addEventListener('click', searchBook)
function searchBook(e){
    e.preventDefault();
    if (e.target.id == 'search-button1'){
        console.log("here")
        const select = document.getElementById('search-book');
        // new
        if (select.selectedIndex!=0){
            const value = select.options[select.selectedIndex].value;
            const link = '../BookDetail/'+value+'/'+value+'_admin_after.html'
            window.location.href = (link)
        }
    }  
}

// Search List 
const searchArea2 = document.querySelector('#search-button2')
searchArea2.addEventListener('click', searchList)
function searchList(e){
    e.preventDefault();
    if (e.target.id == 'search-button2'){
        console.log("here")
        const select = document.getElementById('search-list');
        // new
        if (select.selectedIndex!=0){
            const value = select.options[select.selectedIndex].value;
            const link = '../BooklistDetail/BooklistDetail.html?booklistID='+value+'&userID=1.html' // admin userID: 1
            window.location.href = (link)
        }
    }  
}


/* If 'Edit' is clicked, display edition page.
   If 'Submit' is clicked, display confirmed information */
   function profileButtonsOnClick(e) {
    let userInfo = e.target.parentElement;
    let profileButton = document.getElementById('DesButton');
    if (e.target.innerHTML == 'Edit Description') {
        userInfo.removeChild(document.getElementById('bookDescription'));
        let sigForm = document.createElement('input');
        sigForm.type = 'text';
        sigForm.id = 'sigForm';
        userInfo.insertBefore(sigForm, profileButton);
        profileButton.innerHTML = 'Submit';
    }
    else if (e.target.innerHTML == 'Submit') {
        let signature = document.getElementById('sigForm').value;
        userInfo.removeChild(document.getElementById('sigForm'));
        let newSignature = document.createElement('div');
        newSignature.id = 'bookDescription';
        newSignature.className = 'bookDescription';
        newSignature.innerHTML = signature;
        userInfo.insertBefore(newSignature, profileButton);
        profileButton.innerHTML = 'Edit Description';
    }
}

const desButton = document.querySelector('#DesButton');
desButton.addEventListener('click', profileButtonsOnClick);


// display the book information like book cover, author...
window.onload = function displayAllBooks() {
    const bookInfo = document.querySelector('#bookInfo');

    const coverContainer = document.createElement('div');

    coverContainer.className = 'coverContainer';
    const bookCover = document.createElement('img');
    bookCover.className = 'cover';
    bookCover.src = BooksList[0].coverURL;
    coverContainer.appendChild(bookCover);
    bookInfo.appendChild(coverContainer);

    const bookIntro = document.createElement('div');
    bookIntro.className = 'bookIntro';

    const bookAuthor = document.createElement('span');
    bookAuthor.className = "bookAuthor";
    bookAuthor.innerText = 'Author: ' + BooksList[0].author;
    const bookId = document.createElement('span');
    bookId.className = "bookId";
    bookId.innerText = 'bookID: ' + BooksList[0].bookID; 
    const publish = document.createElement('span');
    publish.className = "publish" ;
    publish.innerText = "publish: " + BooksList[0].year;

    bookIntro.appendChild(bookAuthor);
    bookIntro.appendChild(document.createElement('br'));
    bookIntro.appendChild(bookId);
    bookIntro.appendChild(document.createElement('br'));
    bookIntro.appendChild(publish);
    bookInfo.appendChild(bookIntro);

    const bookDescription = document.querySelector('#bookDescription');

    const descriContent = document.createTextNode(BooksList[0].description)
    bookDescription.appendChild(descriContent)
}