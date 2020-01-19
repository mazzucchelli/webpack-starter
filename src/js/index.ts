type domElement = { [selector: string]: string };

const domElement = function(selector: string): void {
    this.selector = selector || null; // The selector being targeted
    this.element = null; // The actual DOM element
};

domElement.prototype.eventHandler = {
    events: [], // Array of events & callbacks the element is subscribed to.
    bindEvent: function(event, callback, targetElement): void {
        // remove any duplicate event
        this.unbindEvent(event, targetElement);

        // bind event listener to DOM element
        targetElement.addEventListener(event, callback, false);

        this.events.push({
            type: event,
            event: callback,
            target: targetElement,
        }); // push the new event into our events array.
    },
    findEvent: function(event): object {
        return this.events.filter(function(evt) {
            return evt.type === event; // if event type is a match return
        }, event)[0];
    },
    unbindEvent: function(event, targetElement): void {
        // search events
        const foundEvent = this.findEvent(event);

        // remove event listener if found
        if (foundEvent !== undefined) {
            targetElement.removeEventListener(event, foundEvent.event, false);
        }

        // update the events array
        this.events = this.events.filter(function(evt): boolean {
            return evt.type !== event;
        }, event);
    },
};

domElement.prototype.on = function(event, callback): void {
    this.eventHandler.bindEvent(event, callback, this.element);
};
domElement.prototype.off = function(event): void {
    this.eventHandler.unbindEvent(event, this.element);
};

domElement.prototype.val = function(newVal): void {
    return newVal !== undefined ? (this.element.value = newVal) : this.element.value;
};

domElement.prototype.append = function(html): void {
    this.element.innerHTML = this.element.innerHTML + html;
};

domElement.prototype.prepend = function(html): void {
    this.element.innerHTML = html + this.element.innerHTML;
};

domElement.prototype.html = function(html): void {
    if (html === undefined) {
        return this.element.innerHTML;
    }
    this.element.innerHTML = html;
};

domElement.prototype.init = function() {
    switch (this.selector[0]) {
        case '<':
            // create element
            const matches = this.selector.match(/<([\w-]*)>/);
            if (matches === null || matches === undefined) {
                throw 'Invalid Selector / Node';
            }
            const nodeName = matches[0].replace('<i', '').replace('>', '');
            return (this.element = document.createElement(nodeName));
        // break;
        default:
            this.element = document.querySelector(this.selector);
    }
};

const $ = function(selector: string) {
    const el = new domElement(selector); // new domElement
    el.init(); // initialize the domElement
    return el; // return the domELement
};

$('span').on('click', () => console.log('yo'));
