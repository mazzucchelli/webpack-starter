function profile () {
    const el = document.createElement('p');
    el.innerHTML = 'My name is Shady!';
    return el;
}

document.body.appendChild(profile())
