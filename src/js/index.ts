const draw = (): Node => {
    const el = document.createElement('div');
    el.innerHTML = 'Mario say welcome!';
    return el;
};

document.body.appendChild(draw());
