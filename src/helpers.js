class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, listener) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }

    emit(type, ...arg) {
        if (this.events[type]) {
            this.events[type].forEach(listener => listener(...arg));
        }
    }
}

function save(data) {
    const string = JSON.stringify(data);

    localStorage.setItem('session', string);
}

function load() {
    const string = localStorage.getItem('session');
    const data = JSON.parse(string);

    return data;
}

export { EventEmitter, save, load };