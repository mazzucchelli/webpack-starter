import logger from './components/Logger'

function draw () {
    const el = document.createElement('div');
    el.innerHTML = 'Mario say welcome!';
    return el;
}

document.body.appendChild(draw())
logger.log()
