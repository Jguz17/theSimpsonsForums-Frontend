const simpsonsAPI = 'http://localhost:3000/simpsons/';
const usersAPI = 'http://localhost:3000/users/'
const commentsAPI = 'http://localhost:3000/comments/'

let user = {};
let editSimpsonId;
const submitButton = document.querySelector('#trigger-simpson-form');
const simpsonForm = document.querySelector('.form-container');
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
        simpsonData.data.forEach(renderSimpsonToCollection);
        // console.log(simpsonData)
    })
    // .then((simpsonData) => console.log(simpsonData.data))
}

// render simpsons
const renderSimpsonToCollection = (simpson) => {
    const { id, attributes } = simpson;
    const simpsonCollection = document.querySelector('#simpson-collection');
    
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
    editSimpsonId = event.target.dataset.id;
    if(event.target.id === "edit") {
        console.log("edit");
        document.querySelector('body').innerHTML = `<div>
            <form id="edit-simpson-card">
                <input id="newName" name="name" placeholder="Enter new name"></input>
                <input id="newQuote" name="quote" placeholder="Enter new quote"></input>
                <input id="newLink" name="link" placeholder="Enter new link"></input>

                <input type="submit"></input>
            </form>
        </div>`
        document.querySelector('#edit-simpson-card').addEventListener('submit', handleEditSimpsonCard);
    } else if(event.target.id === "delete") {
        console.log('delete')
    } else {
        const simpsonId = event.target.parentElement.dataset.id;
        console.log(simpsonId);
        fetch(simpsonsAPI + simpsonId)
        .then((results) => results.json())
        .then((simpsonData) => renderSimpsonThread(simpsonData))
    }
    
}

const handleEditSimpsonCard = (event) => {
    event.preventDefault();
    console.log(editSimpsonId);
    const newSimpsonName = event.target.name.value;
    const newSimpsonQuote = event.target.quote.value;
    const newSimpsonUrl = event.target.link.value;
    // console.log(newSimpsonName, newSimpsonQuote, newSimpsonUrl);
    // console.log(newSimpsonName)

    submitNewSimpson( {newSimpsonName, newSimpsonQuote, newSimpsonUrl} )
}

const submitNewSimpson = (newSimpsonName) => {
    console.log(newSimpsonName)
    console.log(newSimpsonName.newSimpsonName);
    console.log(newSimpsonName.newSimpsonQuote);
    console.log(newSimpsonName.newSimpsonUrl);

    // editedSimpsonName = newSimpsonName.newSimpsonName;
    // editedSimpsonQuote = newSimpsonName.newSimpsonQuote;
    // editedSimpsonUrl = newSimpsonName.newSimpsonUrl;


    console.log(editSimpsonId);
    fetch(simpsonsAPI + editSimpsonId, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify({
            name: newSimpsonName.newSimpsonName,
            quote: newSimpsonName.newSimpsonQuote,
            image: newSimpsonName.newSimpsonUrl
        })
    })
    .then((results) => results.json())
    .then((data) => console.log(data))
    .catch((error) => console.log(error))
}

const renderEditedSimpson = (simpson) => {
    const simpsonCollection = document.querySelector('#simpson-collection');
    console.log(simpson)
    // simpsonCollection.innerHTML += `<div class="simpson-card" data-id=${id}>
    //     <h3>${attributes.name}</h3>
    //     <p>${attributes.quote}</p>
    //     <img src="${attributes.image}" class="simpson-image">
    //     <button id="edit" class="button-class" data-id=${id}>edit</button>
    //     <button id="delete" class="button-class" data-id=${id}>delete</button>
    // </div>`;
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
                            </form>`
                            ;
    document.querySelector('#comment-form').addEventListener('submit', handleCommentFormSubmit);
}
const renderComment = (comment) => {
    return `<li>${comment.content}</li>`;
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