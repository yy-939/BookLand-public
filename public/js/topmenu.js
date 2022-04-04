let t_user;
let t_usertype;
let t_username;
const t_allBooks = [];
let t_booklistsList = [];

class TBook {
	constructor(bid, title, author, cover, description) {
        this.bookId = bid; // get it from book detail page
		this.title = title;
		this.author = author;
        this.cover = cover;
        this.description = description;
        this.link = null; // link to book detail page
    }
}

class TDataBooklist {
	constructor(lid, listName, creator, bookCollection) {
        this.booklistID = lid;
		this.listName = listName
		this.creator = creator; 
        this.books = bookCollection; // list of DataBook here, list of Book object in BooklistMain
        this.link = null;
	}
}

/*************** link handler ********************/
function t_blinkHandler(bid, usertype, userid){
    // handler for book *Detail* page link
    let result;
    if (usertype == 'guest'){
        result = '/public/html/BookDetail.html?bookID='+bid
    }
    else{
        result = '/public/html/BookDetail.html?bookID='+bid+"&userID="+userid
    }
    return result; 
}  

function t_llinkHandler(lid, usertype, userid){
    // handler for book *list* page link
    let result;
    if (usertype == 'guest'){
        result = '/public/html/BooklistDetail.html?booklistID='+lid // guest
    }
    else{
        result = '/public/html/BooklistDetail.html?booklistID='+lid+'&userID='+userid
    }
    return result;
}   

/*************** display ********************/
function displayMenu(usertype, username, userid){
    const ul = document.querySelector("#topMenu").children[0]
    const lis = ul.children
    const homea = lis[1].firstChild
    const booksa = lis[2].firstChild
    const booklistsa = lis[3].firstChild
    const li = document.createElement("li")
    const a = document.createElement("a")   
    const li2 = document.createElement("li")
    li2.className = 'addUserIdToLink'
    li2.id = 'userLoginInfo'
    const a2 = document.createElement("a")   
    if (usertype == 'guest'){
        homea.setAttribute('href', '/index.html')
        booksa.setAttribute('href', '/public/html/BookMainPage.html') // here
        booklistsa.setAttribute('href', '/public/html/BooklistMainPage.html') // here
        a.setAttribute("href", "/public/html/login.html")
        a.innerText = 'Login/Register'
        li.appendChild(a)
        ul.appendChild(li)
    }
    else{
        homea.setAttribute('href', '/index.html?userID='+userid) // here 
        booksa.setAttribute('href', '/public/html/BookMainPage.html?userID='+userid) // here
        booklistsa.setAttribute('href', '/public/html/BooklistMainPage.html?userID='+userid) // here
        a.setAttribute("href","/logout")
        a.innerText = 'QUIT'
        li.append(a)
        li.className = 'quit'
        a2.setAttribute("href", "/public/html/user.html?userID="+userid) // here
        a2.innerText = username // dynamic
        li2.append(a2)
        ul.appendChild(li)
        ul.appendChild(li2)
    }
}

function displaySearchbox(){
    const bookoptionfield = document.querySelector(".search-book #myDropdown")
    for (let i=0; i<t_allBooks.length; i++){
        if (t_allBooks[i] != null){
            const id1 = t_allBooks[i].bookId
            const name1 = t_allBooks[i].title
            const a1 = document.createElement("a")
            // HERE!
            let link1 = t_blinkHandler(id1, t_usertype)

            a1.setAttribute("href", link1)
            a1.innerText = name1
            bookoptionfield.appendChild(a1)
        }
    }

    const listoptionfield = document.querySelector('.search-list #myDropdown')
    for (let i=0; i<t_booklistsList.length; i++){
        if (t_booklistsList[i] != null){
            const id2 = t_booklistsList[i].booklistID
            const name2 = "[" + t_booklistsList[i].listName + "] -- " +t_booklistsList[i].creator
            const a2 = document.createElement("a")
            // HERE!
            let link2 = t_llinkHandler(id2, t_usertype)
            a2.setAttribute("href", link2)
            a2.innerText = name2
            listoptionfield.appendChild(a2)
        }
    }
}

function bookFunction() {
    const bookdropdown = document.querySelector(".search-book #myDropdown")
    if (bookdropdown.classList.contains("hide")){
        bookdropdown.classList.remove("hide")
        bookdropdown.classList.add("dropdown-content")
    }
    else{
        bookdropdown.classList.remove("dropdown-content")
        bookdropdown.classList.add("hide")
    }  
}

function listFunction() {
    const listdropdown = document.querySelector(".search-list #myDropdown")
    if (listdropdown.classList.contains("hide")){
        listdropdown.classList.remove("hide")
        listdropdown.classList.add("dropdown-content")
    }
    else{
        listdropdown.classList.remove("dropdown-content")
        listdropdown.classList.add("hide")
    } 
}

function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
        txtValue = a[i].textContent || a[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
        } else {
        a[i].style.display = "none";
        }
    }
}

/*************** display ********************/
// /Booklist/Detail?booklistID=<int>
if (String(window.location.href).includes("Detail?booklistID") || !String(window.location.href).includes("?")){
    t_usertype = "guest"
    const url0 = '/api/two'
    fetch(url0).then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            console.log("not found")
       }                
    }).then((json) => {  //pass json into object locally
        const books = json.books
        for (each of books){
            t_allBooks.push(new TBook(each._id, each.name, each.author, each.coverURL, each.description))
        }
        const lists = json.lists
        for (each of lists){
           t_booklistsList.push(new TDataBooklist(each._id, each.listName, each.creator, each.books))
        }

        // handle links
        for (let i=0; i<t_allBooks.length; i++){
            t_allBooks[i].link = t_blinkHandler(t_allBooks[i].bookId, t_usertype, t_user)
        }
        for (let i=0; i<t_booklistsList.length; i++){
            t_booklistsList[i].link = t_llinkHandler(t_booklistsList[i].booklistID, t_usertype, t_user)
        }  

        displayMenu(t_usertype, t_username, t_user)
        displaySearchbox()

        })
    .catch((error) => {
        console.log(error)})
}
else{
    if (String(window.location.href).includes("&")){
        // ./public/html/BooklistDetail.html?booklistID=<int>&userID=<int>
        t_user = (window.location.href.split('?')[1].split('&')[1].split('=')[1].split('.')[0])
    }
    else{
        // /index.html?userID=<int> 
        t_user= String(window.location.href.split('?')[1].split('=')[1])
    }
    const url = '/api/users/'+t_user
    fetch(url).then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
           alert('Could not get this user')
       }   
    }).then((json) => {  //pass json into object locally
        t_usertype = json.user.type.toLowerCase()
        t_username = json.user.username
        console.log(t_usertype)
        console.log(t_username)

        const url2 = '/api/two'
        fetch(url2).then((res) => { 
            if (res.status === 200) {
               return res.json() 
           } else {
                console.log("not found")
           }                
        }).then((json) => {  //pass json into object locally
            const books = json.books
            for (each of books){
                t_allBooks.push(new TBook(each._id, each.name, each.author, each.coverURL, each.description))
            }
            const lists = json.lists
            for (each of lists){
                t_booklistsList.push(new TDataBooklist(each._id, each.listName, each.creator, each.books))
            }

            // handle links
            for (let i=0; i<t_allBooks.length; i++){
                t_allBooks[i].link = t_blinkHandler(t_allBooks[i].bookId, t_usertype, t_user)
            }
            for (let i=0; i<t_booklistsList.length; i++){
                t_booklistsList[i].link = t_llinkHandler(t_booklistsList[i].booklistID, t_usertype, t_user)
            }  

            displayMenu(t_usertype, t_username, t_user)
            displaySearchbox()

            })
        }).catch((error) => {
        log(error)})


}



// try { 
//     if (String(window.location.href).includes("&")){
//         // ./public/html/BooklistDetail.html?booklistID=<int>&userID=<int>
//         t_user = (window.location.href.split('?')[1].split('&')[1].split('=')[1].split('.')[0])
//     }
//     else{
//         // /index.html?userID=<int> 
//         t_user= String(window.location.href.split('?')[1].split('=')[1])

//         // ToCheck: /Booklist/Detail?booklistID=<int>
//     }
//     console.log(t_user)
    
//     /******* * NOT SURE: booklist detail guest check ********/
//     const url_try_booklist = '/api/booklists/'+t_user
//     fetch(url_try_booklist).then((res) => { 
//         if (res.status === 200) {
//             return res.json() 
//         } else {
//             return
//         }
//     }).then((json)=>{
//         // t_usertype = ''
//         t_usertype = "guest"
//     }) 
//     /******* * NOT SURE [END]: booklist detail guest check ********/

//     const url = '/api/users/'+t_user
//     fetch(url).then((res) => { 
//         if (res.status === 200) {
//            return res.json() 
//        } else {
//            alert('Could not get this user')
//        }   
//     }).then((json) => {  //pass json into object locally
//         t_usertype = json.user.type.toLowerCase()
//         t_username = json.user.username
//         console.log(t_usertype)
//         console.log(t_username)

//         const url2 = '/api/two'
//         fetch(url2).then((res) => { 
//             if (res.status === 200) {
//                return res.json() 
//            } else {
//                 console.log("not found")
//            }                
//         }).then((json) => {  //pass json into object locally
//             const books = json.books
//             for (each of books){
//                 t_allBooks.push(new TBook(each._id, each.name, each.author, each.coverURL, each.description))
//             }
//             const lists = json.lists
//             for (each of lists){
//                 t_booklistsList.push(new TDataBooklist(each._id, each.listName, each.creator, each.books))
//             }

//             // handle links
//             for (let i=0; i<t_allBooks.length; i++){
//                 t_allBooks[i].link = t_blinkHandler(t_allBooks[i].bookId, t_usertype, t_user)
//             }
//             for (let i=0; i<t_booklistsList.length; i++){
//                 t_booklistsList[i].link = t_llinkHandler(t_booklistsList[i].booklistID, t_usertype, t_user)
//             }  

//             displayMenu(t_usertype, t_username, t_user)
//             displaySearchbox()

//             })
//         }).catch((error) => {
//         log(error)})
// } catch(error) {
//     console.log(error) 
//     t_usertype= 'guest'
//     console.log(t_usertype)
//     const url0 = '/api/two'
//     fetch(url0).then((res) => { 
//         if (res.status === 200) {
//            return res.json() 
//        } else {
//             console.log("not found")
//        }                
//     }).then((json) => {  //pass json into object locally
//         const books = json.books
//         for (each of books){
//             t_allBooks.push(new TBook(each._id, each.name, each.author, each.coverURL, each.description))
//         }
//         const lists = json.lists
//         for (each of lists){
//            t_booklistsList.push(new TDataBooklist(each._id, each.listName, each.creator, each.books))
//         }

//         // handle links
//         for (let i=0; i<t_allBooks.length; i++){
//             t_allBooks[i].link = t_blinkHandler(t_allBooks[i].bookId, t_usertype, t_user)
//         }
//         for (let i=0; i<t_booklistsList.length; i++){
//             t_booklistsList[i].link = t_llinkHandler(t_booklistsList[i].booklistID, t_usertype, t_user)
//         }  

//         displayMenu(t_usertype, t_username, t_user)
//         displaySearchbox()

//         })
//     .catch((error) => {
//         console.log(error)})
// }

