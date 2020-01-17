import './style.css'

function draw () {
    const el = document.createElement('div');
    el.innerHTML = 'Mario say welcome!';
    return el;
}

document.body.appendChild(draw())
