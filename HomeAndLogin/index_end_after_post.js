
const log = console.log;

/****************************** END USER index-posts js ******************************/

/** After log in, end user can like others' posts **/
/********** Posts display **********/
const posts = [];
const collectedPosts = []; // collection of posts made by current user


class Post {
	constructor(pid, bid, booktitle, booklink, userid, postername, posterlink, posterProfile, pic, content, time, likes) {
		this.postID = pid;
        this.bookID = bid;
        this.booktitle = booktitle;
        this.booklink = booklink;
        this.userid = userid;
		this.poster = postername;
        this.posterlink = posterlink;
        this.posterProfile = posterProfile;
        this.pic = pic;
        this.content = content; 
        this.time = time;
        this.likes = likes; 
    }
}

function blinkHandlerinPost(bid){
    // handler for book Detail page link
        for (let i =0; i<posts.length; i++){
            if (posts[i].bookID == bid){
                let result = '../BookDetail/'+posts[i].bookID+'/'+posts[i].bookID+'_end_after.html'
                return result;
            }
        } 
         // OR other actions...     
    }

function postCallBack() {
    /// Get post from server
    // code below requires server call
    // posts in post list should be added by admin user
    posts.push(new Post(0, 0, 'Solaris',null,1, 'admin', null,
    "https://avatars.githubusercontent.com/u/73209681?v=4", 
    null,
    'It was stunning. An ocean with life, a planet covered by an ocean.',
    '2022-02-20 3:02', 0));

    posts.push(new Post(1, 0, 'Solaris',null,0, 'user', null,
    'https://avatars.githubusercontent.com/u/71192401?v=4', 
    'https://upload.wikimedia.org/wikipedia/en/d/d1/SolarisNovel.jpg',
    'I really like this book! I really like this book! I really like this book! I really like this book!',
    '2022-03-01 18:05', 1));

    posts.push(new Post(2, 4, 'Song of Solomon',null,0,'user', null,
    'https://avatars.githubusercontent.com/u/71192401?v=4', 
    'https://reviewed-com-res.cloudinary.com/image/fetch/s--vRlwGaKY--/b_white,c_limit,cs_srgb,f_auto,fl_progressive.strip_profile,g_center,h_668,q_auto,w_1187/https://reviewed-production.s3.amazonaws.com/1615411074746/EreadersBG3.jpg',
    'I have to read it every day otherwise I cannot sleep',
    '2022-03-05 00:05', 5));

    posts.push(new Post(3, 3, 'War and Peace',null,0, 'user', null,
    'https://avatars.githubusercontent.com/u/71192401?v=4', 
    null,
    "I have a version of War and Peace that's been lying around for years on my desk. The French dialogues aren't translated in the footnotes. I read that the use of Frech in this book functions as a 'literary device', but I really want to know what is being said. How important are these dialogues in French?",
    '2022-03-05 16:00', 0));
  }



const postul = document.querySelector('#posts ul');
postCallBack()
displayPosts()


// clean all before display
function cleanPosts(){
    const lis = postul.children;
    for (let i=0; i<5; i++){
        if (lis[i] != null){
            lis[i].remove();
        }
    }
}

function displayPosts(){
    cleanPosts();

    for (let i=0; i<5; i++){
        if (posts[i] != null){
            let li = document.createElement('li')

            let postDiv = document.createElement('div')
            postDiv.className = 'post'
            let userDiv = document.createElement('div')
            userDiv.className = 'userProfileContainer'
            let contentDiv = document.createElement('div')
            contentDiv.className ='postContent'

            let title = posts[i].booktitle
            let userName = posts[i].poster
            let userProfile = posts[i].posterProfile
            let pic = posts[i].pic
            let content = posts[i].content
            let time = posts[i].time
            let likes = posts[i].likes
            let plink = posts[i].posterlink
            let pid = posts[i].postID
            let bid = posts[i].bookID
            let userid = posts[i].userid

            // need to handle user link
            // let plink = plinkHandler...

            let blink = blinkHandlerinPost(bid)

            let img1 = document.createElement('img')
            img1.className='userProfile'
            img1.setAttribute('src', userProfile)
            img1.setAttribute('alt', 'profile')
            userDiv.appendChild(img1)

            let userh3 = document.createElement('h3')
            let a1 = document.createElement('a')
            a1.className = 'linkColor'
            
            // need to handle user link
            // temporary use
            if (userid){
                plink = '../user/user.html?visit='+userid
            }
            else{ // userid is user, visit myself
                plink = '../user/user.html'
            }

            a1.setAttribute('href', plink)
            a1.innerText = userName
            a1.onclick = function open(e){
                e.preventDefault();
                window.location.href=(a1.href) // need to handle user link
            }
            let spanid2 = document.createElement('span')
            spanid2.className = 'postId'
            spanid2.innerText = pid
            userh3.appendChild(a1)
            userh3.appendChild(spanid2) // Post id is here

            contentDiv.appendChild(userh3)

            let pbook = document.createElement('p')
            pbook.innerText = 'Book Name: '
            let span1 = document.createElement('span')
            let a2 = document.createElement('a')
            a2.className = 'linkColor'
            a2.setAttribute('href', blink)
            a2.innerText = title
            a2.onclick = function open(e){
                e.preventDefault();
                window.location.href=(a2.href)
            }
            span1.appendChild(a2)
            let span2 = document.createElement('span')
            span2.className = 'postTime'
            span2.innerText = time

            let spanid3 = document.createElement('span')
            spanid3.className = 'bookId'
            spanid3.innerText = ' bookID: '
            let spanid4 = document.createElement('span')
            spanid4.className = 'bookId'
            spanid4.innerText = bid

            pbook.appendChild(span1)
            pbook.appendChild(span2)
            pbook.appendChild(spanid3) 
            pbook.appendChild(spanid4) // Book id is here
            contentDiv.appendChild(pbook)

            let p = document.createElement('p')
            p.innerText = content
            contentDiv.appendChild(p)

            if (pic != null){
                let img2 = document.createElement('img')
                img2.className='postContentPicture'
                img2.setAttribute('src', pic)
                img2.setAttribute('alt', 'pic')
                contentDiv.appendChild(img2)
            }

            let br = document.createElement('br')
            contentDiv.appendChild(br)

            let likeh5 = document.createElement('h5')
            let icon = document.createElement('i')
            icon.className = 'fa fa-heart'
            icon.innerText = ' '+likes
            let button = document.createElement('button')
            button.className = 'btn btn-outline-primary'
            button.classList.add('like')
            button.innerText = 'Like'
            let button2 = document.createElement('button')
            button2.className = 'btn btn-outline-success'
            button2.classList.add('collect')
            button2.innerText = 'Collect'

            likeh5.appendChild(icon)
            likeh5.appendChild(button2)
            likeh5.appendChild(button)
            contentDiv.appendChild(likeh5)


            postDiv.appendChild(userDiv)
            postDiv.appendChild(contentDiv)

            li.appendChild(postDiv)
            postul.appendChild(li)
        }
    }
}

const likefield = document.querySelector('#posts')
likefield.addEventListener('click', like)

function like(e){
    e.preventDefault(); // prevent default action

    const contentDiv = e.target.parentElement.parentElement
    const h3 = contentDiv.children[0]
    const pid = h3.children[1].innerText
    for (let i=0; i<posts.length; i++){
        if(parseInt(posts[i].postID) == pid){
            if (e.target.classList.contains('like')) {
                posts[i].likes ++
                let length = contentDiv.children.length
                length -= 1
                const target = contentDiv.children[length]
                const icon = target.children[0]
                icon.innerText = ' '+ posts[i].likes
                e.target.classList.remove('like');
                e.target.classList.add('dislike');
                e.target.innerText = 'Dislike';
                break;
            }
            else if (e.target.classList.contains('dislike')){
                posts[i].likes --
                let length = contentDiv.children.length
                length -= 1
                const target = contentDiv.children[length]
                const icon = target.children[0]
                icon.innerText = ' '+ posts[i].likes
                e.target.classList.remove('dislike');
                e.target.classList.add('like');
                e.target.innerText = 'Like';
                break;
            }
        }
    } 
}

const collectfield = document.querySelector('#posts')
collectfield.addEventListener('click', collect);

function collect(e){
    e.preventDefault(); // prevent default action

    const contentDiv = e.target.parentElement.parentElement
    const h3 = contentDiv.children[0]
    const pid = h3.children[1].innerText
    for (let i=0; i<posts.length; i++){
        if(parseInt(posts[i].postID) == pid){
            if (e.target.classList.contains('collect')) {
                collectedPosts.push(posts[i])
                const h5 = contentDiv.children[contentDiv.children.length-1]
                h5.children[1].innerText='Collected!'
                e.target.classList.remove('collect');
                e.target.classList.add('collected');
                break;
            }
            else if (e.target.classList.contains('collected')){
                //collectedPosts.remove(posts[i])
                for (let j=0; i<collectedPosts.length; i++){
                    if (collectedPosts[j] == posts[i]){
                        collectedPosts.splice(j, 1)
                        break;
                    }
                }
                const h5 = contentDiv.children[contentDiv.children.length-1]
                h5.children[1].innerText='Collect'
                e.target.classList.remove('collected');
                e.target.classList.add('collect');
                break;
            }
            
        }
    } 
}

 