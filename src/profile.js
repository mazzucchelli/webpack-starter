function draw2 () {
    const el = document.createElement('div');
    el.innerHTML = 'Mario say welcome again!';
    return el;
}

document.body.appendChild(draw2())
