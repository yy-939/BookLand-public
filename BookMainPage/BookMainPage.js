// global variables
var BooksNum = 0; 
var BooksList = [] 

class Book {
	constructor(name, author, year, coverURL, description) {
		this.name = name;
		this.author = author;
		this.year = year;
		this.coverURL = coverURL; 
        this.description = description;
        this.postCollection = [] // collection of post ids associated with the book
		this.bookID = BooksNum;
		BooksNum++;
	}
}

const bookTable = document.querySelector('#bookTable')

// Load default book data
BooksList.push(new Book('Solaris', 'Stanisław Herman Lem', 1970, 
'https://upload.wikimedia.org/wikipedia/en/d/d1/SolarisNovel.jpg', 
'It follows a crew of scientists on a research station as they attempt to understand an extraterrestrial intelligence, which takes the form of a vast ocean on the titular alien planet.'))

BooksList.push(new Book('Tres Tristes Tigres', 'Guillermo Cabrera Infante', 1971,
'https://upload.wikimedia.org/wikipedia/en/0/0f/Tres_tristes_tigres_%28Guillermo_Cabrera_Infante%29.png',
'It is a highly experimental, Joycean novel, playful and rich in literary allusions.'))

BooksList.push(new Book('The Story of the Lost Child', 'Elena Ferrante', 2014,
'https://www.irishtimes.com/polopoly_fs/1.2348652.1441974000!/image/image.jpg',
'The fourth of Elena Ferrante\'s celebrated Neapolitan novels, has a lot to deliver on.'))

BooksList.push(new Book('War and Peace', 'Leo Tolstoy', 1869,
'https://images-na.ssl-images-amazon.com/images/I/A1aDb5U5myL.jpg',
'The novel chronicles the French invasion of Russia and the impact of the Napoleonic era on Tsarist society through the stories of five Russian aristocratic families.'))

BooksList.push(new Book('Song of Solomon', 'Toni Morrison', 1977,
'https://images-na.ssl-images-amazon.com/images/I/61EKxawb6xL.jpg',
'It tells the story of Macon "Milkman" Dead, a young man alienated from himself and estranged from his family, his community, and his historical and cultural roots.'))

/************** temp for search bar ******************/

// temp booklist data
var BooklistsNum = 0; 
var BooklistsList = []  
class Booklist {
	constructor(listName, listDescription, creator, bookCollection) {
		this.listName = listName;
        if (listDescription.length === 0){
            this.listDescription = '__The creator hasn\'t add description yet...__'
        } else {
            this.listDescription = listDescription
        }
		this.creator = creator // username, temp
        this.books = bookCollection; // list of Book object
		this.booklistID = BooklistsNum;
		BooklistsNum++;
        this.likes = 0;
        this.collect = 0;
        const date = new Date() 
        this.createTime = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
	}
}
BooklistsList.push(new Booklist('novels', 'All novels liked.', 'Admin',[BooksList[0],BooksList[1]]))
BooklistsList.push(new Booklist('All spanish', 'All Spanish novels.', 'Admin',[BooksList[1]]))
BooklistsList.push(new Booklist('Before 20th', '', 'User',[BooksList[1], BooksList[3], BooksList[4],BooksList[0]]))
// temp booklist data [END]

function displaySearchbox(){
    const searchbookArea = document.querySelector('.search-book')
    const t = searchbookArea.children[0]
    for (let i=0; i<BooksNum; i++){
        if (BooksList[i] != null){
            const id = BooksList[i].bookID
            const name = BooksList[i].name
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
            const name = "[" + BooklistsList[i].listName + "] -- " + BooklistsList[i].creator
            const option = document.createElement('option')
            option.value = id
            option.innerText = name
            column.appendChild(option)
        }
    }
}

/********** Search Book **********/
const searchArea1 = document.querySelector('#search-button1')
searchArea1.addEventListener('click', searchBook)
function searchBook(e){
    e.preventDefault();
    if (e.target.id == 'search-button1'){
        const select = document.getElementById('search-book');
        if (select.selectedIndex!=0 ){
            const value = select.options[select.selectedIndex].value;
            const link = '../BookDetail/'+value+'/BookDetail-'+value+'.html'
            window.location.href = (link)
        }
    }  
}

/********** Search List **********/
const searchArea2 = document.querySelector('#search-button2')
searchArea2.addEventListener('click', searchList)
function searchList(e){
    e.preventDefault();
    if (e.target.id == 'search-button2'){
        const select = document.getElementById('search-list');
        if (select.selectedIndex!=0 ){
            const value = select.options[select.selectedIndex].value;
            const user = getUserID()
            let link = "../BooklistDetail/BooklistDetail.html?booklistID=" + value
            if (!isNaN(user)){
                link += ("&userID="+user)
            }
            window.location.href = (link)
        }
    }  
}
/************** temp for search bar [END] ******************/


// Display all books in the book main page
function displayAllBooks(BooksList, userID) {
    const userType = checkUserType(userID)
    if (userType === 'Admin' | userType === 'User'){
        // change navi bar username
        const userName = getUserName(userID)
        document.querySelector('#userLoginInfo').innerText = userName

        // set navi bar link
        document.querySelector('#home').href = "../HomeAndLogin/index.html?userID="+userID
        document.querySelector('#bookmain').href = "./BookMainPage.html?userID="+userID
        document.querySelector('#booklistmain').href = "../BooklistMainPage/BooklistMainPage.html?userID="+userID
        document.querySelector('#userLoginInfo').href = "../user/user.html?userID="+userID // need check
        if(userType === 'Admin'){
            document.querySelector('#tableResult').addEventListener('click', deleteBook)
            document.querySelector('#addButton').addEventListener('click', addNewBook)
            document.getElementById('coverButton').addEventListener('change', uploadPicture)
        } else {
            document.querySelector('#adminActionsWrap').parentElement.removeChild(document.querySelector('#adminActionsWrap'))
        }
    } else {
        document.querySelector('#adminActionsWrap').parentElement.removeChild(document.querySelector('#adminActionsWrap'))
        document.querySelector('.quit').parentElement.removeChild(document.querySelector('.quit'))
    }
    const tableResultTBODY = document.querySelector('#tableResultTBODY')
	for(let i = 0; i < BooksNum; i++) {
        const tr = document.createElement('tr')
		const div = document.createElement('div')
        div.className = 'book'

        if (userType === 'Admin'){// admin only: admin delete button
        const div1 = document.createElement('div')
        div1.className = 'delete'
        const button = document.createElement('button')
        button.className = "deleteButton, btn btn-danger" 
        button.setAttribute('data-toggle','model')
        button.setAttribute('data-target','#exampleModalCenter')

        button.appendChild(document.createTextNode("Delete the book"))
        div1.appendChild(button)
        div.appendChild(div1)
        }
        
        // book name 
        const p1 = document.createElement('p')
        const strong1 = document.createElement('strong')
        const name = document.createTextNode("Book Name: ")
        strong1.appendChild(name)
        p1.appendChild(strong1)

        const span1 = document.createElement('span')
        span1.className="bookTitle"
        const a = document.createElement('a')
        a.className = "linkColor"
        a.href = "../BookDetail/"+BooksList[i].bookID +"/BookDetail-" + BooksList[i].bookID + ".html"
        if (userType === 'Admin'){
            a.href = "../BookDetail/" + BooksList[i].bookID +"/"+ BooksList[i].bookID+"_admin_after.html" // need new link
        } else if (userType === 'User'){
            a.href = "../BookDetail/" + BooksList[i].bookID +"/"+ BooksList[i].bookID+"_end_after.html" // need new link
        } else {
            a.href = "../BookDetail/"+ BooksList[i].bookID+"/BookDetail-" + BooksList[i].bookID + ".html"
        }
        a.onclick = function open(e){e.preventDefault(); window.location.href = (a.href)}
        const nameContent = document.createTextNode(BooksList[i].name)
        a.appendChild(nameContent)
        span1.appendChild(a)
        p1.appendChild(span1)
        div.appendChild(p1)

        // cover img
        const img = document.createElement('img')
        img.className = "cover"
        img.src = BooksList[i].coverURL
        img.alt = "cover"
        div.appendChild(img)

        // description
        const p2 = document.createElement('p')
        p2.className = "descriptionsBox"
        const strong2 = document.createElement('strong')
        const descri = document.createTextNode("Descriptions: ")
        strong2.appendChild(descri)
        p2.appendChild(strong2)

        const span2 = document.createElement('span')
        const descriContent = document.createTextNode(BooksList[i].description)
        span2.appendChild(descriContent)
        p2.appendChild(span2)
        div.appendChild(p2)

        // info table
        const table = document.createElement('table')
        table.className = "bookinfo"
        const tbody = document.createElement('tbody')
        const tr1 = document.createElement('tr')
	    const ID = document.createElement('th')
        ID.innerText = 'Book ID'
        ID.className = 'th'
        const author = document.createElement('th')
	    author.innerText = 'Author'
        author.className = 'th'
        const year = document.createElement('th')
	    year.innerText = 'Publish year'
        year.className = 'th'
        tr1.appendChild(ID)
        tr1.appendChild(author)
        tr1.appendChild(year)
        tbody.appendChild(tr1)

        const tr2 = document.createElement('tr')
        const IDcontent = document.createElement('td')
        IDcontent.innerText = BooksList[i].bookID
        IDcontent.className = 'td'
        const authorContent = document.createElement('td')
        authorContent.innerText = BooksList[i].author
        authorContent.className = 'td'
        const yearContent = document.createElement('td')
	    yearContent.innerText = BooksList[i].year
        yearContent.className = 'td'
        tr2.appendChild(IDcontent)
        tr2.appendChild(authorContent)
        tr2.appendChild(yearContent)
        tbody.appendChild(tr2)
        table.appendChild(tbody)
        div.appendChild(table)

        tr.appendChild(div)
        tableResultTBODY.appendChild(tr)
	}
}

function filpPage(pageNo, pageLimit) {
    const allBooks = document.getElementById("tableResultTBODY")
    const totalSize = allBooks.rows.length
    let totalPage = 0
    const pageSize = pageLimit
    
    // calculate the page num and set up every page:
    if (totalSize / pageSize > parseInt(totalSize / pageSize)) {
        totalPage = parseInt(totalSize / pageSize) + 1;
    } else {
        totalPage = parseInt(totalSize / pageSize);
    }

    // build every page label and assign onclick function
    const curr = pageNo
    const startRow = (curr - 1) * pageSize + 1
    let endRow = curr * pageSize
    endRow = (endRow > totalSize) ? totalSize : endRow;
    let strHolder = ""
    let previousStr = "Previous"
    let nextStr = "Next"
    let setupStr = "<li class=\"page-item\"><a class=\"page-link\" href=\"#\" onClick=\"filpPage("
    let disabled = "<li class=\"page-item disabled\"> <span class=\"page-link\">" 
    // single page is enough
    if (totalPage <= 1){
        strHolder = disabled + previousStr + "</span></li>"+
        setupStr + totalPage + "," + pageLimit + ")\">" + "1" + "</a></li>" + disabled + nextStr + "</span></li>"
    } else { //multipages
        if (curr > 1) {
            strHolder += setupStr + (curr - 1) + "," + pageLimit + ")\">"+previousStr+"</a></li>"
            for (let j = 1; j <= totalPage; j++) {
                strHolder += setupStr+ j + "," + pageLimit + ")\">" + j + "</a></li>"
            }
        } else {
            strHolder += disabled + previousStr + "</span></li>"
            for (let j = 1; j <= totalPage; j++) {
                strHolder += setupStr+ j + "," + pageLimit + ")\">" + j +"</a></li>"
            }
        }
        if (curr < totalPage) {
            strHolder += setupStr + (curr + 1) + "," + pageLimit + ")\">"+nextStr+"</a></li>"
            
        } else { strHolder += disabled + nextStr + "</span></li>"}
    }


    //separate different display style for different tr element
    for (let i = 1; i < (totalSize + 1); i++) {
        const each = allBooks.rows[i - 1];
        if (i >= startRow && i <= endRow) {
            each.className="normalTR"
        } else {
            each.className="endTR"
        }
    }
    document.querySelector("#pageFliperUL").innerHTML = strHolder;

    // set up current page 
    const allPageButton = document.querySelectorAll(".page-item")
    for (each of allPageButton){
        if (each.children[0].innerText == pageNo){
            each.className = "page-item active"
            each.ariaCurrent = "page"
        }
    }
}

// update display
function renewBooklist(){
    const nowBooks = document.querySelector('#tableResultTBODY')
    const allBook = document.querySelectorAll('.book')
    for (each of allBook){
        nowBooks.removeChild(each.parentElement)
    }
    displayAllBooks(BooksList,getUserID())
    filpPage(1,3)
}

// admin only: add book
function addNewBook(e){
    e.preventDefault();
    if (e.target.className == 'addSubmit, btn btn-primary'){
        const bookname = document.getElementById('bookNameInput').value
        const author = document.getElementById('bookAuthorInput').value
        const year = parseInt(document.getElementById('publishYearInput').value)
        const description = document.getElementById('descriptionInput').value
        // cover is not required
        try {cover=URL.createObjectURL(document.getElementById("coverInput").files[0])
        } catch {
            cover = 'https://www.freeiconspng.com/uploads/violet-book-icon--somebooks-icons--softiconsm-11.png'
        }

        //check validation
        const all = Array(bookname, author, year, description)
        const required = all.filter((each) => each.length === 0)
        if (required.length > 0 ){
            document.querySelector('#reflect').innerText=('Missing required input, please re-enter information.')
            document.querySelector('#reflect').className = 'fail'
        } else {
            BooksList.push(new Book(bookname,author,year,cover,description))
            //clear input boxes:
            document.getElementById('bookNameInput').value = ""
            document.getElementById('bookAuthorInput').value = ""
            document.getElementById('publishYearInput').value = null
            document.getElementById('descriptionInput').value = ""
            document.getElementById('coverInput').value = ""
            document.querySelector('#reflect').innerText=("Added successfully.")
            document.querySelector('#reflect').className = 'success'
            setTimeout(()=>{
                document.querySelector('#reflect').innerText=""
            }, 2 * 1000)
            renewBooklist()
        }
    }
}

// admin only: delete book
function deleteBook(e){
    e.preventDefault();
    if (e.target.className == 'deleteButton, btn btn-danger'){
        const bookElement = e.target.parentElement.parentElement.parentElement
        const ID = parseInt(bookElement.children[0].children[4].children[0].children[1].children[0].innerText)
        const form = document.getElementById("myForm")
        form.children[0].children[0].innerText="Confirm to delete the book ID: " + ID
        form.style.display="block"
    }
}

// admin only action: remove book---form for confirming delete
function addFormForDelete(){
    //// dialog modal
    const wrapper = document.createElement('div')
    wrapper.id ='myForm'
    wrapper.className='form-popup'

    const form = document.createElement('form')
    form.className='form-container'

    const h5 = document.createElement('h5')
    h5.innerText= 'Confirm to delete the book?'
    form.appendChild(h5)

    const submit = document.createElement('button')
    submit.type = "submit"
    submit.className='addSubmit, btn'
    submit.id = 'submit'
    submit.innerText='Confirm'
    submit.onclick = function confirmDelete(e){
        e.preventDefault();
        if (e.target.id == 'submit'){
            const ID = parseInt(document.getElementById("myForm").children[0].children[0].innerText.split(': ')[1]);
            for (let i=0; i<BooksNum; i++){
                if (BooksList[i].bookID == ID){
                    BooksList.splice(i, 1);
                    BooksNum--;
                }
            }
            renewBooklist();
            document.getElementById("myForm").style.display="none";
        }
    }
    form.appendChild(submit)

    const cancel = document.createElement('button')
    cancel.type = "button"
    cancel.className='btn cancel'
    cancel.id = "cancel"
    cancel.onclick = function cancelDelete(e){e.preventDefault; document.getElementById("myForm").style.display='none'}
    cancel.innerText='Cancel'
    form.appendChild(cancel)
    wrapper.appendChild(form)
    document.querySelector('body').appendChild(wrapper)
    ///
}

// helper: get user id
function getUserID(){
    try{
        return parseInt(window.location.href.split('?')[1].split('userID=')[1])
    } catch{
        return 'guest'
    }
}

// helper: check the user type, return 'User' or 'Admin'?
function checkUserType(userID){
    // need more dynamic way to search user database, check type
    // phase 2 task

    if (userID === 0){ 
        return('User')
    } else if (userID === 1) {
        return('Admin')
    } else {
        return ('guest')
    }
}

//helper: get user name by user id
function getUserName(userID){
    // need more dynamic way to search user database, check type
    if (userID === 0){ 
        return('User')
    } else if (userID === 1) {
        return('Admin')
    } 
}

// helper: upload img
function uploadPicture(e){
    e.preventDefault
    if (e.target.id == 'coverInput'){
        let x = document.getElementById('coverInput')
        let txt = "";
        if ('files' in x) {
          if (x.files.length == 0) {
            txt = "Select one or more files.";
          } else {
            for (let i = 0; i < x.files.length; i++) {
              txt += "<br><strong>" + (i+1) + ". file</strong><br>";
              let file = x.files[i];
              if ('name' in file) {
                txt += "name: " + file.name + "<br>";
              }
              if ('size' in file) {
                txt += "size: " + file.size + " bytes <br>";
              }
            }
          }
        } 
        else {
          if (x.value == "") {
            txt += "Select one or more files.";
          } else {
            txt += "The files property is not supported by your browser!";
            txt  += "<br>The path of the selected file: " + x.value;
          }
        }
        document.getElementById("coverUploaded").innerHTML = txt;
    }
  }


  
displaySearchbox()//for search bar function
if(checkUserType(getUserID()) == 'Admin'){
    addFormForDelete()
}
displayAllBooks(BooksList,getUserID())
window.onload = filpPage(1,3)