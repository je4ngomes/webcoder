const movers = 
    [...document.querySelectorAll('.btn__prev, .btn__next')];

const isPageMoveDefined = (element) => {
    const page = element.firstChild.getAttribute('href')
        .split('=')[1];

    return (page === '' ? undefined : page);
};

const disableBtn = (btn) => {
    if (!isPageMoveDefined(btn)) {
        btn.classList.add('disabled');
        btn.firstChild.removeAttribute('href');
    }
};

movers.map(disableBtn);