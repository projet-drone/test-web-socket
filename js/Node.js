export default class Node {
    origin = {x: 0, y: 0}
    position = {x: 0, y: 0}
    radius;

    constructor(top, left, radius, el) {

        this.circle = el.querySelector('.circle');
        this.el = el;
        this.position = {x: left, y: top};
        this.radius = radius;
        this.origin = this.calcOrigin(left, top);
       
        this.isActive = false;
        this.inventor; 
    }

    get orign() {
        return this.calcOrigin();
    }

    calcOrigin(left, top) {

        let oX = left + this.radius;
        let oY = top + this.radius;

        return {x: oX, y: oY}
    }
}


