const simpsonsAPI = 'http://localhost:3000/simpsons/';
let user = {};
const submitButton = document.querySelector('#trigger-simpson-form');
const simpsonForm = document.querySelector('.form-container');
let displayForm = false;


// trigger form display
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
    .then((simpsonData) => simpsonData.data.forEach(renderSimpsonToCollection))
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
    </div>`;

    simpsonCollection.addEventListener('click', handleSimpsonCardClick)
}

const handleSimpsonCardClick = (event) => {
    const simpsonId = event.target.parentElement.dataset.id;
    console.log(simpsonId);
    fetch(simpsonsAPI + simpsonId)
    .then((results) => results.json())
    .then((simpsonData) => renderSimpsonThread(simpsonData))
}

const renderSimpsonThread = (simpsonData) => {
    const simpson = simpsonData.data.attributes;
    // console.log(simpson)
    const threadBody = document.querySelector('#post-thread');
    threadBody.innerHTML = `<h3>${simpson.name}</h3>
                            <p>${simpson.quote}</p>
                            <img src="${simpson.image}">`;
    for (let i = 0, l = simpson.comments.length; i < l; i++) {
        console.log(simpson.comments[i].content);
        threadBody.innerHTML += `<p>${simpson.comments[i].content}</p>`;
    }
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

fetchSimpsons();
