const log = console.log
// global variables
let BooklistsNum = 0; 
let BooklistsList = [] 


class Booklist {
	constructor(listName, listDescription, creator, bookCollection, id, likedBy, collectedBy, createTime, creatorID) {
		this.listName = listName;
        if (listDescription.length === 0){
            this.listDescription = '__The creator hasn\'t add description yet...__'
        } else {
            this.listDescription = listDescription
        }
		this.creator = creator // username 
        this.creatorID = creatorID // user id
        this.books = bookCollection; // list of Book object
		this.booklistID = id;
		BooklistsNum++;
        this.likedBy = likedBy;
        this.collectedBy = collectedBy;
        this.createTime = createTime
	}
}

// get all booklist
function getBooklists(){
    const url = '/api/booklists'
    fetch(url).then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            res.status(500).send("Internal Server Error") // not sure
       }                
    }).then((json) => {  //pass json into object locally
        const booklists = json.booklists
        for (each of booklists){
            BooklistsList.push(
                new Booklist(each.listName, each.listDescription, 
                    each.creator, each.books, 
                    each._id, each.likedBy, 
                    each.collectedBy, each.createTime,
                    each.creatorID))
        }
        selectBooklistToPlay()
    }).catch((error) => {
        log(error)
    })
}

// Display the booklist detail page:
function displayBooklistDetail(booklist, user) {
    // fill list name
    const booklistInfo = document.querySelector('#booklistInfo')
    const title = booklistInfo.children[0]
    const titleContent = document.createElement('span');
    titleContent.id = 'titleContent';
    titleContent.appendChild(document.createTextNode(booklist.listName))
    title.appendChild(titleContent)
    

    // fill list info
    const listId = document.querySelector('.listId')
    const idContent = document.createTextNode(booklist.booklistID)
    idContent.id = 'idContent';
    listId.appendChild(idContent)

    const creator = document.querySelector('.creator')
    const creatorContent = document.createTextNode(booklist.creator)
    creatorContent.id = 'creatorContent'
    creator.appendChild(creatorContent)

    const createTime = document.querySelector('.createTime')
    const timeContent = document.createTextNode(booklist.createTime)
    timeContent.id = 'timeContent'
    createTime.appendChild(timeContent)

    // fill like and collect number
    const likes = document.querySelector('.likes')
    const collects = document.querySelector('.collects')
    const likeContent = document.createTextNode(booklist.likedBy.length)
    likeContent.id = 'likeContent'
    likes.appendChild(likeContent)
    const collectContent = document.createTextNode(booklist.collectedBy.length)
    collectContent.id = 'collectContent'
    collects.appendChild(collectContent)

    // fill description
    const description = document.querySelector('#description')
    const desc = document.createElement('span')
    desc.id = 'descriptionText'
    desc.appendChild(document.createTextNode(booklist.listDescription))
    description.appendChild(desc)

    // fill books in the list
    fillBooklistBooks(booklist,user)
}

function fillBooklistBooks(booklist, user){
    const bookUL = document.querySelector('#bookUL')

	for(let i = 0; i < booklist.books.length; i++) {
        const li = document.createElement('li')
        li.className = 'bookli'

        // <a> content
        const a = document.createElement('a')
        a.className = "book"
        a.href = "/BookDetail?bookID=" + String((booklist.books[i])._id) //need check
        if(user === 'User' | user === 'Admin'){ // current user type
            a.href+= ("&userID="+getUserID())
        }
        a.onclick = function open(e){e.preventDefault(); window.location.href = a.href}
        a.appendChild(document.createTextNode(booklist.books[i].name))
        li.appendChild(a)
        bookUL.appendChild(li)
        bookUL.appendChild(document.createElement('br'))
    }
}

function selectBooklistToPlay(){
    const query = window.location.href.split('?')[1]
    if (query == null){
        return;
    } else if (window.location.href.split('?')[1].split('&').length === 1){ // guest visit any booklist
        const currentListID = query.split('booklistID=')[1].split('.')[0]
        const list = BooklistsList.filter((list) => list.booklistID == currentListID)
        displayBooklistDetail(list[0], 'guest')
        //selectNarviBarUser('guest','')
    } else { // admin & user
        const currentListID = getBooklistID()
        const currentUser = getUserID()

        const list = BooklistsList.filter((list) => list.booklistID === currentListID)
        if (list.length === 0){ // not ready to connect the database yet, implement on phase 2
            window.location.assign("./UnderConstruction.html")
        } else {
            const url = '/api/users/'+currentUser
            fetch(url).then((res) => { 
                if (res.status === 200) {
                return res.json() 
            } else {
                    log('faild to get user info. as guest.')
            }                
            }).then((json) => {
                return JSON.stringify(json)
            }).then((userInfo)=>{
                const userType = userInfo.split("\"type\":\"")[1].split("\"")[0]
                const username = userInfo.split("\"username\":\"")[1].split("\"")[0]
                displayBooklistDetail(list[0], userType)
                //selectNarviBarUser(userType, username)
                editBooklist(username)
            }).catch((error)=>{
                log(error)
            })
            
        }
    }
}

/* function selectNarviBarUser(userType,userName){
    const userColumn = document.querySelector('.addUserIdToLink')
    if (userType === 'User'){//end user
        userColumn.innerHTML =''
        const newLI = document.createElement('li')
        newLI.className = "quit"
        newLI.innerHTML = "<a href=\"../HomeAndLogin/index.html\">QUIT</a>"
        const a = document.createElement('a')
        a.id = 'userLoginInfo'
        a.className = 'addUserIdToLink'
        a.href = "../user/user.html" // need more dynamiclly link fix on phase 2
        a.onclick = function open(e){e.preventDefault(); window.location.href = a.href}
        a.appendChild(document.createTextNode(userName)) // need more dynamiclly get username
        userColumn.appendChild(a)
        userColumn.before(newLI)
        document.querySelector('#home').href = "../HomeAndLogin/index.html?userID="+getUserID()
        document.querySelector('#bookmain').href = "./BookMainPage.html?userID="+getUserID()
        document.querySelector('#booklistmain').href = "../BooklistMainPage/BooklistMainPage.html?userID="+getUserID()
        document.querySelector('#userLoginInfo').href = "../user/user.html?userID="+getUserID() // need check
    } else if (userType === 'Admin'){ // admin
        userColumn.innerHTML =''
        const newLI = document.createElement('li')
        newLI.className = "quit"
        newLI.innerHTML = "<a href=\"../HomeAndLogin/index.html\">QUIT</a>"
        const a = document.createElement('a')
        a.id = 'userLoginInfo'
        a.className = 'addUserIdToLink'
        a.href = "../user/admin.html" // need more dynamiclly link fix on phase 2
        a.onclick = function open(e){e.preventDefault(); window.location.href = a.href}
        a.appendChild(document.createTextNode(userName)) // need more dynamiclly get username
        userColumn.appendChild(a)
        userColumn.before(newLI)
        document.querySelector('#home').href = "../HomeAndLogin/index.html?userID="+getUserID()
        document.querySelector('#bookmain').href = "./BookMainPage.html?userID="+getUserID()
        document.querySelector('#booklistmain').href = "../BooklistMainPage/BooklistMainPage.html?userID="+getUserID()
        document.querySelector('#userLoginInfo').href = "../user/user.html?userID="+getUserID() // need check
    } //else guest
} */

// edit booklist
function editBooklist(user){
    // get self info (for booklist exist reference)
    const listID = BooklistsList.filter((booklist) => 
        booklist.booklistID === (document.querySelector(".listId").innerText.split(': ')[1])
    )
    let currList = ''
    const creator = listID[0].creator
    const description = document.querySelector('#descriptionText')
    const bookUL = document.querySelector('#bookUL')
    const button1 = addEditElement('editDescription','Modify the description:', document.querySelector('#descriptionText').innerText)
    const button2 = addEditElement('editBooks','Modify the booklist content:', currList)
    if (creator == user){ // creator only 
        const div1 = document.createElement('div')
        div1.className = 'editDiv'
        div1.id ='edit_description'
        div1.appendChild(button1)

        description.before(div1)
        const div2 = document.createElement('div')
        div2.className = 'editDiv'
        div2.id='edit_books'
        div2.appendChild(button2)
        bookUL.before(div2)
    } 
}

function addEditElement(id, text, inner){
    const outter = document.createElement('div')
    const button = document.createElement('button')
    button.className = id + ', btn btn-outline-info'
    button.appendChild(document.createTextNode('Edit'))
    outter.appendChild(button)
    //pop up element
    if(id =='editBooks'){
        outter.appendChild(document.querySelector('#myForm_editBooks'))
        return outter
    }
    const wrapper = document.createElement('div')
    wrapper.id ='myForm_'+id
    wrapper.className='form-popup'


    const form = document.createElement('form')
    form.className='form-container'
    form.action = '/action_page.php'

    const h5 = document.createElement('h5')
    h5.innerText= text
    form.appendChild(h5)

    const input = document.createElement('input')
    input.type ='text'
    input.id = id+'_input'
    input.value = inner
    input.name =id+'_input'
    form.appendChild(input)

    const small = document.createElement('small')
    small.id="message_"+id
    form.appendChild(small)

    form.appendChild(document.createElement('br'))

    const submit = document.createElement('button')
    submit.type = "submit"
    submit.className='addSubmit, btn'
    submit.id = 'submit_'+id
    submit.innerText='Save'
    form.appendChild(submit)

    const cancel = document.createElement('button')
    cancel.type = "button"
    cancel.className='btn cancel'
    cancel.id = "cancel_"+id
    cancel.innerText='Cancel'
    form.appendChild(cancel)
    wrapper.appendChild(form)

    outter.appendChild(wrapper)
    return outter
}

// DOM modifying functions:

// creator only: edit description
const description = document.querySelector('#description')
description.addEventListener("click", editDescription)
description.addEventListener('click', saveDescription)
description.addEventListener('click', cancelEditDescription)

function saveDescription(e){
    e.preventDefault()
    if (e.target.className =='editDescription, btn btn-outline-info'){
        document.getElementById("myForm_editDescription").style.display="block";
    }
}
function cancelEditDescription(e){
    if (e.target.id =='cancel_editDescription'){
        document.getElementById("myForm_editDescription").style.display="none";
    }
}
function editDescription(e){
    e.preventDefault()
    if (e.target.id ==='submit_editDescription'){
        let textSpan = document.querySelector('#descriptionText')
        let request = document.querySelector('#editDescription_input').value
        let curr = document.querySelector('#descriptionText').innerText
        while (request == null || request.length === 0 || request === curr){
            if (request == null) {
                return;
            } else if (request === curr){
                document.querySelector('#message_editDescription').innerHTML = 'Failed, the description is still same. Please re-enter.'
                return
            } else {
                document.querySelector('#message_editDescription').innerHTML = 'Failed, the new description cannot be empty. Please re-enter.'
                return
            }
        }
        textSpan.innerText = request
        const self = BooklistsList.filter((booklist)=>
            booklist.booklistID === getBooklistID()
        )
        modiEditNewValue(self[0].booklistID, "listDescription", "new", request)
        document.getElementById("myForm_editDescription").style.display="none";
    }
}

// creator only: edit books in the booklist
const books = document.querySelector('#books')
books.addEventListener("click", saveEditBooksContent)
books.addEventListener('click', clickEditBooks)
books.addEventListener('click', cancelEdit)
function clickEditBooks(e){
    e.preventDefault()
    if (e.target.className =='editBooks, btn btn-outline-info'){
        document.getElementById("myForm_editBooks").style.display="block";
    }
}
function cancelEdit(e){
    if (e.target.id =='cancel_editBooks'){
        document.getElementById("myForm_editBooks").style.display="none";
    }
}
function saveEditBooksContent(e){
    e.preventDefault()
    if (e.target.id ==='submit_editBooks'){
        // get self info
        let entireBooklist = document.querySelectorAll('.bookli')
        const listID = BooklistsList.filter((booklist) => 
            booklist.booklistID === (document.querySelector(".listId").innerText.split(': ')[1])
        )
        // prompt input default: self curr book ids
        let currList = (listID[0].books).map((each)=>each._id)
        let listString = ""
        document.querySelector('#editBooks_input').placeholder = listString
        
        let request = document.querySelector('#editBooks_input').value
        let uniqueCurrInput = uniqueSortedIDsArrayGenerator(request)
        
        // error check for input format and repeatness 
        while (uniqueCurrInput === "null" || uniqueCurrInput.length === 0 || JSON.stringify(uniqueCurrInput) === JSON.stringify(currList.sort())){
            if (uniqueCurrInput === "null") {
                return;
            } else if (JSON.stringify(uniqueCurrInput) === JSON.stringify(currList.sort())){
                document.querySelector('#message_editBooks').innerHTML = 'Failed, all books are still same. Please re-enter.'
                uniqueCurrInput = uniqueSortedIDsArrayGenerator(request)
                return
            } else {
                document.querySelector('#message_editBooks').innerHTML = 'Failed, booklist cannot be empty. Please re-enter.'
                uniqueCurrInput = uniqueSortedIDsArrayGenerator(request)
                return
            }
        }

        // error check for input id validation:
        let result = []
        const url = '/api/books'
        fetch(url).then((res) => { 
            if (res.status === 200) {
            return res.json() 
        } else {
                res.status(500).send("Internal Server Error") // not sure
        }                
        }).then((json) => {  //pass json into object locally
            const books = json.books

            for (each of books){
                result.push({
                    "_id": each._id,
                    "name": each.name,
                    "author": each.author,
                    "year": each.year,
                    "coverURL": each.coverURL,
                    "postCollection": each.postCollection,
                    "description": each.description
                })
            }
            return result
        }).then((result)=>{
            const idCollection = result.map((each)=>each._id)
            const Invalid = uniqueCurrInput.filter(inputID => !idCollection.includes(inputID))
            if(Invalid.length > 0){
                document.querySelector('#message_editBooks').innerHTML = 'Failed, you have invalid ID input.'
                    return;
            } else { // valid
                // modify books in object
                let newBooksAttribute = Array()
                const iterate = uniqueCurrInput.map((eachInputID) => {
                    const selected = result.filter((bookObject) => bookObject._id === eachInputID)
                    newBooksAttribute.push(selected[0])
                })
                listID[0].books = newBooksAttribute
                log(listID)
                log(newBooksAttribute)
                
                // display on page
                modiEditNewValue(listID[0].booklistID, "books", "new", newBooksAttribute)
                document.getElementById("myForm_editBooks").style.display="none";
            }
            location.reload()
        }).catch((error)=>{
            log(error)
        })
        
    }
}
//helper: get user name by user id
function getUserName(userID){
    return document.querySelector('#userLoginInfo').innerText 
}

/* function changeBooks(){
    let result = []
    const url = '/api/books'
    fetch(url).then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            res.status(500).send("Internal Server Error") // not sure
       }                
    }).then((json) => {  //pass json into object locally
        const books = json.books

        for (each of books){
            result.push({
                "bookID": each._id,
                "name": each.name
            })
        }
        return result
    }).then((result)=>{
    const ul = document.querySelector('#randomBooks')
    ul.innerHTML=''
    const random3 = []
    while (random3.length<3){
        const idx = Math.floor(Math.random() * result.length)
        if (!random3.includes(idx)){
            random3.push(idx)
        }
    }
    //const ids = random3.map((idx)=>result[idx].bookID)
    //const names = random3.map((idx)=>result[idx].name)
    for (let i=0;i<3;i++){
        const li = document.createElement('li')
        li.innerText = "[ID:" + result[random3[i]].bookID + "]--" + result[random3[i]].name
        ul.appendChild(li)
    }
    }).catch((error) => {
        log(error)
    })
} */


function changeBooks(){
    let result = []
    const url = '/api/books'
    fetch(url).then((res) => { 
        if (res.status === 200) {
           return res.json() 
       } else {
            res.status(500).send("Internal Server Error") // not sure
       }                
    }).then((json) => {  //pass json into object locally
        const books = json.books

        for (each of books){
            result.push({
                "bookID": each._id,
                "name": each.name
            })
        }
        return result
    }).then((result)=>{
    const ul = document.querySelector('#randomBooks')
    const random3 = []
    while (random3.length<3){
        const idx = Math.floor(Math.random() * result.length)
        if (!random3.includes(idx)){
            random3.push(idx)
        }
    }
    for (let i=0;i<3;i++){
        ul.children[i].children[0].innerHTML =  result[random3[i]].name
        const span = document.createElement('span')
        span.className = 'bookIDhide'
        span.innerText = result[random3[i]].bookID
        ul.children[i].appendChild(span)
    }
    }).catch((error) => {
        log(error)
    })
}

const ul = document.querySelector('#randomBooks')
ul.addEventListener('click', loadBook)
function loadBook(e){
    e.preventDefault;
    if(e.target.className == 'addListID btn btn-outline-info'){
        document.querySelector("#editBooks_input").value += (e.target.nextSibling.innerText+';')
        e.target.className += " active"
    } else if (e.target.className == 'addListID btn btn-outline-info active'){
        let curr = document.querySelector("#editBooks_input").value
        curr = curr.replace((e.target.nextSibling.innerText+';'),'')
        document.querySelector("#editBooks_input").value = curr
        e.target.className = "addListID btn btn-outline-info"
    }
    
}

function uniqueSortedIDsArrayGenerator(str){
    if (str == null){
        return "null"
    }
    const splited = (str.split(';'))
    const valids = splited.filter((each)=> each != '')
    return Array.from(new Set(valids.sort()))
}

//back up. not used yet
function createForm(){
    const wrapper = document.createElement('div')
    wrapper.id ='myForm'
    wrapper.className='form-popup'

    const div1 = document.createElement('div')
    div1.className = 'div_form'
    const form = document.createElement('form')
    form.className='form-container'
    form.action = '/action_page.php'

    const h5 = document.createElement('h5')
    h5.innerText='Please edit the new description:'
    form.appendChild(h5)


    const label1 = document.createElement('label')
    label1.for = 'new_input'
    const b = document.createElement('b')
    b.innerText='New description: '
    form.appendChild(label1)

    const input = document.createElement('input')
    input.type ='text'
    input.id = 'new_input'
    input.placeholder = '<new description...>'
    input.name ='new_input'
    form.appendChild(input)

    const small = document.createElement('SMALL')
    small.id="inputMessage" 
    small.className="form-text text-muted"
    form.appendChild(small)

    const submit = document.createElement('button')
    submit.type = "submit"
    submit.className='addSubmit, btn'
    submit.innerText='Submit'
    form.appendChild(submit)

    const cancel = document.createElement('button')
    cancel.type = "button"
    cancel.className='btn cancel'
    cancel.innerText='Cancel'
    cancel.onclick = 'closeForm()'
    form.appendChild(cancel)
    div1.appendChild(form)
    wrapper.appendChild(div1)
    document.querySelector('#edit_description').append(wrapper)
}

// helper: get user id
function getUserID(){
    try { 
        return (window.location.href.split('?')[1].split('&')[1].split('=')[1].split('.')[0])
    } catch { 
        return 'guest'
    }
}

// helper: get booklist id
function getBooklistID(){
    return (window.location.href.split('?')[1].split('&')[0].split('=')[1])
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
        return 'guest'
    }
}

// patch modify
function modiEditNewValue(id, target, operation, value){
    const url = '/api/booklist/content/'+id
    let data = {
        target: target,
        operation: operation,
        value: value
    }
    log(data)
    log(id)
    const request = new Request(url, {
        method: 'PATCH', 
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    fetch(request)
    .then(function(res) {
        if (res.status === 200) {
            console.log('updated')    
        } else {
            console.log('Failed to updated')
        }
        log(res)
    }).catch((error) => {
        log(error)
    })
}

getBooklists()