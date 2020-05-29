const simpsonsAPI = 'http://localhost:3000/simpsons/';
const usersAPI = 'http://localhost:3000/users/'
const commentsAPI = 'http://localhost:3000/comments/'

let user = {};
let editSimpsonId;
let editCommentSimpsonId;
let editCommentUserId;
let editCommentId;
let deleteSimpsonId;
let deleteCommentId;
let testNode;
const submitButton = document.querySelector('#trigger-simpson-form');
const simpsonForm = document.querySelector('.form-container');
const simpsonCollection = document.querySelector('#simpson-collection');

// const commentForm = document.querySelector('#comment-form')

const loginForm = document.querySelector('#login-form');
const usernameButton = document.querySelector('#username-submit-button');

loginForm.addEventListener('submit', handleLoginSubmit);

function handleLoginSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;

    // console.log(name)
    event.target.reset();

    // renderPage({ name });

    // fetch stuff

    const reqObj = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name: name})
    }

    fetch(usersAPI, reqObj)
        .then((results) => results.json())
        .then((data) => renderPage(data))
}

//trigger 'everything-else' display
let displayAll = false;

const renderPage = (name) => {
    user = name;
    console.log(user.data)
    // console.log(user.name.length)

    if(user.data.attributes.name) {
        document.querySelector('.login-stuff').style.display = "none"
        document.querySelector('.everything-else').style.display = "block"
    } else {
        document.querySelector('.everything-else').style.display = "none"
    }
}


// trigger form display
let displayForm = false;

submitButton.addEventListener('click', () => {
    displayForm = !displayForm;
    if (displayForm) {
        simpsonForm.setAttribute('id', 'trigger-test');
        document.querySelector('.simpson-form-trigger').style.display = 'none';
    } else {
        simpsonForm.style.display = 'none';
    }
});

// fetch simpsons
const fetchSimpsons = () => {
    fetch(simpsonsAPI)
    .then((results) => results.json())
    .then((simpsonData) => {
        simpsonCollection.innerHTML = '';
        simpsonData.data.forEach(renderSimpsonToCollection);
        // console.log(simpsonData)
    })
    // .then((simpsonData) => console.log(simpsonData.data))
}

// render simpsons
const renderSimpsonToCollection = (simpson) => {
    const { id, attributes } = simpson;
    
    simpsonCollection.innerHTML += `<div class="simpson-card" data-id=${id}>
        <h3>${attributes.name}</h3>
        <p>${attributes.quote}</p>
        <img src="${attributes.image}" class="simpson-image">
        <button id="edit" class="button-class" data-id=${id}>edit</button>
        <button id="delete" class="button-class" data-id=${id}>delete</button>
    </div>`;

    simpsonCollection.addEventListener('click', handleSimpsonCardClick)
}

console.log(document.querySelector('button'))

const handleSimpsonCardClick = (event) => {
    // console.log(event.target.dataset.id)
    // const testSimpId = event.target.dataset.id;
    // ---- BEGIN SIMPSON CARD UPDATE --- 
    if(event.target.id === "edit") {
        console.log(event.target.parentElement);
        // document.querySelector('.wrapper').style.display = 'none';
        // document.querySelector('body').id = 'edit-simpson-body';
        // document.querySelector('#edit-simpson-body');
        event.target.parentElement.innerHTML += `<form id="edit-simpson-card">
                                                    <input id="newName" name="name" placeholder="Enter new name"></input>
                                                    <input id="newQuote" name="quote" placeholder="Enter new quote"></input>
                                                    <input id="newLink" name="link" placeholder="Enter new link"></input>

                                                    <input type="submit"></input>
                                                </form>`
        
        // listen for submit on form and call handleEditSimpsonCard
        document.querySelector('#edit-simpson-card').addEventListener('submit', handleEditSimpsonCard);
    } else if(event.target.id === "delete") {
        console.log('delete')
        document.querySelector('.wrapper').style.display = 'block';
        deleteSimpsonId = event.target.parentElement.dataset.id;

        fetch(simpsonsAPI + deleteSimpsonId, { method: "DELETE" })
        .then((results) => results.json())
        .then((data) => console.log(data))
    } else {
        const simpsonId = event.target.parentElement.dataset.id;
        console.log(simpsonId);
        fetch(simpsonsAPI + simpsonId)
        .then((results) => results.json())
        .then((simpsonData) => renderSimpsonThread(simpsonData))
    }
}

// ---- CONTINUE SIMPSON CARD UPDATE ----
// GET values from form and call function with values as objects/params
const handleEditSimpsonCard = (event) => {
    event.preventDefault();
    const simpTargetId = event.target.parentElement.dataset.id;
    const newSimpsonName = event.target.name.value;
    const newSimpsonQuote = event.target.quote.value;
    const newSimpsonUrl = event.target.link.value;
    
    // console.log(newSimpsonName, newSimpsonQuote, newSimpsonUrl);
    // console.log(newSimpsonName)

    // call function with values as objects/params
    submitNewSimpson( {newSimpsonName, newSimpsonQuote, newSimpsonUrl, simpTargetId} )
}

// ---- CONTINUE SIMPSON CARD UPDATE ----
//
const submitNewSimpson = ({newSimpsonName, newSimpsonQuote, newSimpsonUrl, simpTargetId}) => {
    // console.log(newSimpsonName)
    console.log(event.target.parentElement);
    console.log(newSimpsonName);
    console.log(newSimpsonQuote);
    console.log(newSimpsonUrl);

    // editedSimpsonName = newSimpsonName.newSimpsonName;
    // editedSimpsonQuote = newSimpsonName.newSimpsonQuote;
    // editedSimpsonUrl = newSimpsonName.newSimpsonUrl;


    console.log(editSimpsonId);
    fetch(simpsonsAPI + simpTargetId, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            name: newSimpsonName,
            quote: newSimpsonQuote,
            image: newSimpsonUrl
        })
    })
    .then((results) => results.json())
    .then((data) => {

        fetchSimpsons()
    })
    .catch((error) => console.log(error))
}

const renderEditedSimpson = (simpson) => {
    // document.querySelector('.ghost-test').style.display = "none"
    // document.querySelector('.wrapper').style.display = "block"
    // const simpsonCollection = document.querySelector('#simpson-collection');
    const identifiedSimpsonCard = document.querySelector(".simpson-card").dataset.id;
    console.log(editSimpsonId)
    if(simpson.id === editSimpsonId) {
        console.log(simpson)
        identifiedSimpsonCard.innerHTML = `<div class="simpson-card" data-id=${simpson.id}>
            <h3>${simpson.name}</h3>
            <p>${simpson.quote}</p>
            <img src="${simpson.image}" class="simpson-image">
            <button id="edit" class="button-class" data-id=${simpson.id}>edit</button>
            <button id="delete" class="button-class" data-id=${simpson.id}>delete</button>
        </div>`;
    } else {
        console.log("F")
    }
    
}

const renderSimpsonThread = (simpsonData) => {
    const simpson = simpsonData.data.attributes;
    const simpsonId = simpsonData.data.id;
    // console.log(simpson)
    const threadBody = document.querySelector('#post-thread');
    threadBody.innerHTML = `<h3>${simpson.name}</h3>
                            <p>${simpson.quote}</p>
                            <img src="${simpson.image}" class="simpson-thread-image">
                            <ul>${renderComments(simpsonData)}</ul>
                            <form id="comment-form" class="comment-form">
                                <input type="text" name="comment" placeholder="Enter a comment . . ."></input>
                                <input id="post-simpson-comment" type="submit" name="submit" value="Comment" data-id=${simpsonId}>
                            </form>`;
    document.querySelector('#post-thread').addEventListener('click', handleButtonClicks);
    document.querySelector('#comment-form').addEventListener('submit', handleCommentFormSubmit);
}

const handleButtonClicks = (event) => {
    editCommentSimpsonId = document.querySelector('#post-simpson-comment').dataset.id;
    editCommentUserId = event.target.parentElement.dataset.userId;
    editCommentId = event.target.parentElement.dataset.commentId;
    // console.log(editCommentSimpsonId);
    // console.log(editCommentUserId);
    // console.log(editCommentId);
    if(event.target.id === 'edit-comment-icon') {
        const testThis = event.target.previousSibling;

        document.querySelector('body').innerHTML = `<div>
            <form id="edit-comment-form">
                <input id="new-comment" name="content" placeholder="Enter new content"></input>

                <input type="submit"></input>
            </form>
        </div>`

        document.querySelector('#edit-comment-form').addEventListener('submit', handleEditCommentFormSubmit)
    } else if(event.target.id === 'delete-comment-icon') {
        console.log("thrash")
        deleteCommentId = event.target.parentElement.dataset.commentId;

        fetch(commentsAPI + deleteCommentId, { method: "DELETE" })
        .then((results) => results.json())
        .then((data) => console.log(data))
    }
}

const handleEditCommentFormSubmit = (event) => {
    event.preventDefault();
    const newCommentContent = document.querySelector('#new-comment').value;
    // console.log(newCommentContent)
    // console.log(editCommentSimpsonId);
    // console.log(editCommentUserId);
    // console.log(editCommentId);

    submitNewComment({ editCommentSimpsonId, editCommentUserId, editCommentId, newCommentContent })
}

const submitNewComment = ({ editCommentSimpsonId, editCommentUserId, editCommentId, newCommentContent }) => {
    console.log(newCommentContent)
    console.log(editCommentSimpsonId);
    console.log(editCommentUserId);
    console.log(editCommentId);

    fetch(commentsAPI + editCommentId, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            content: newCommentContent,
            simpson_id: editCommentSimpsonId,
            user_id: editCommentUserId
        })
    })
    .then((results) => results.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error))
}

const renderComment = (comment) => {
    console.log(comment)
    return `<li data-comment-id=${comment.id} data-user-id=${comment.user_id}><span>user #${comment.user_id}</span> : ${comment.content}<i id="edit-comment-icon" class="fas fa-edit"></i><i id="delete-comment-icon" class="fas fa-trash"></i></li>`;
}

const renderComments = (simpsonData) => {
    const simpson = simpsonData.data.attributes;
    return simpson.comments.map(renderComment).join('');
}

const handleCommentFormSubmit = (event) => {
    event.preventDefault();
    const content = event.target.comment.value;
    const simpson_id = event.target.submit.dataset.id;
    const user_id = user.data.id;
    document.querySelector('#comment-form').reset();
    // console.log(content, simpson_id, user_id);
    postComment(content, simpson_id, user_id);
    // console.log(event.target.previousSibling.previousSibling.lastChild)
}

const renderNewComments = (data) => {
    console.log(data)
    const content = data.content;
    const ul = document.querySelector('ul');
    ul.innerHTML += renderComment({content});
}

const postComment = (content, simpson_id, user_id ) => {
    const reqObj = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            content: content,
            simpson_id: simpson_id,
            user_id: user_id
        })
    }

    fetch(commentsAPI, reqObj)
    .then((results) => results.json())
    .then((data) => {
        // const ul = document.querySelector('ul');
        renderNewComments(data)})
}

simpsonForm.addEventListener('submit', handleSubmit);

// handle simpson submit form
function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.name.value;
    const quote = event.target.quote.value;
    const image = event.target.image.value;

    event.target.reset();

    postSimpson({ name, quote, image });
}

// display newly created simpson
const renderNewSimpson = (simpson) => {
    const { id, name, quote, image } = simpson;
    const simpsonCollection = document.querySelector('#simpson-collection');
    
    simpsonCollection.innerHTML += `<div class="simpson-card" data-id=${id}>
        <h3>${name}</h3>
        <p>${quote}</p>
        <img src="${image}" class="simpson-image">
        <button id="edit" class="button-class" data-id=${id}>edit</button>
        <button id="delete" class="button-class" data-id=${id}>delete</button>
    </div>`;
}

// make changes in db
const postSimpson = (reqObj) => {
    fetch(simpsonsAPI, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(reqObj)
    })
    .then((results) => results.json())
    .then((newSimpson) => renderNewSimpson(newSimpson))
    .catch((error) =>  console.log(error))
}

// const handleSimpsonCardButtonClick = (event) => {
//     console.log("triggered")
// }

fetchSimpsons();