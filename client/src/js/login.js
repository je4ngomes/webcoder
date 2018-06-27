const getElements = () =>
    [...document.querySelectorAll('#register, #login')];

const createEventClick = element => 
    element.addEventListener('click', toggleElements);

const toggleElements = () => {
    document.querySelector('.signin').classList.toggle('disabled');
    document.querySelector('.signup').classList.toggle('disabled');
};

getElements()
    .map(createEventClick);