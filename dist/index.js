"use strict";
class AutoGrid {
    constructor(options = {}) {
        this.status = {
            wrapper: null,
            indexAdder: 1,
            objectFit: 'fill'
        };
        this.initialize(options);
        this.add = this.add.bind(this);
        this.addMock = this.addMock.bind(this);
        this.remove = this.remove.bind(this);
    }
    initialize(options = {}) {
        this.status.wrapper = options.wrapper || document.body;
        this.status.indexAdder = options.indexAdder !== undefined ? options.indexAdder : this.status.indexAdder;
        this.status.objectFit = options.objectFit ? options.objectFit : this.status.objectFit;
        this.status.wrapper.setAttribute('data-auto-grid', true);
        this.status.wrapper.style.display = 'grid';
    }
    add(element, index = undefined) {
        const s = element.style;
        s.display = 'block';
        s.minWidth = '0';
        s.minHeight = '0';
        s.width = '100%';
        s.objectFit = this.status.objectFit;
        if (index !== undefined) {
            const children = [...this.status.wrapper.children];
            const elementAtIndex = children[index];
            if (elementAtIndex) {
                this.status.wrapper.insertBefore(element, elementAtIndex);
            }
            else {
                console.warn('update currently appends at end if no existing element at index.');
                this.status.wrapper.appendChild(element);
            }
        }
        else {
            this.status.wrapper.appendChild(element);
        }
        this._resize();
        return this;
    }
    addMock() {
        const curNum = this.status.wrapper.children.length - 1 + this.status.indexAdder;
        const text = `Text: ${curNum}`;
        const el = document.createElement('div');
        el.setAttribute('title', text);
        el.style.backgroundColor = 'orange';
        el.style.border = '1px solid white';
        this.add(el);
        return this;
    }
    remove(key) {
        let element = null;
        if (typeof key === 'string') {
            element = this.status.wrapper.querySelector(key);
        }
        else if (typeof key === 'number') {
            element = this.status.wrapper.children[key];
        }
        else if (Array.isArray(key) && key.length === 2) {
        }
        else if (key === null || key === undefined || key === false) {
            const children = this.status.wrapper.children;
            element = children[children.length - 1];
        }
        else {
            element = key;
        }
        if (element) {
            element.parentElement.removeChild(element);
        }
        else {
            throw new Error('Unexpected error on remove');
        }
        this._resize();
        return this;
    }
    list() {
        const children = this.status.wrapper.children;
        return [...children];
    }
    update(arr = [], options = {}) {
        const type = options.type || 'exact';
        const list = this.list();
        const updates = {
            add: [],
            remove: []
        };
        if (type === 'exact') {
            list.forEach((item, index) => {
                if (arr[index] !== item) {
                    updates.remove.push(index);
                }
            });
            arr.forEach((item, index) => {
                if (list[index] !== item) {
                    updates.add.push([item, index]);
                }
            });
        }
        else if (type === 'exist') {
            list.forEach((item, index) => {
                if (arr.indexOf(item) < 0) {
                    updates.remove.push(index);
                }
            });
            arr.forEach((item, index) => {
                if (list.indexOf(item) < 0) {
                    updates.add.push([item, index]);
                }
            });
        }
        else if (type === 'add') {
            arr.forEach((item, index) => {
                if (list.indexOf(item) < 0) {
                    updates.add.push([item, index]);
                }
            });
        }
        updates.remove.reverse().forEach(item => {
            this.remove(item);
        });
        updates.add.forEach(item => {
            let element = item[0];
            let index = item[1];
            this.add(element, index);
        });
    }
    _resize() {
        const wrapper = this.status.wrapper;
        const count = wrapper.children.length;
        const oneDimLength = Math.ceil(Math.sqrt(count));
        const oneDimStr = '1fr '.repeat(oneDimLength).trim();
        wrapper.style.gridTemplateColumns = oneDimStr;
        wrapper.style.gridTemplateRows = oneDimStr;
    }
}
if (typeof window === 'object') {
    window.AutoGrid = AutoGrid;
}
if (typeof module === 'object') {
    module.exports = AutoGrid;
}
