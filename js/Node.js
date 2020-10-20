export default class Node {
    origin = {x: 0, y: 0}
    isFocused = false;
    position;
    radius;

    constructor(top, left, radius, el) {

        this.circle = el.querySelector('.circle');
        this.el = el;
        this.position = this.circle.getBoundingClientRect()
        
        this.radius = radius;
        this.origin = this.calcOrigin();
        
        this.isActive = false;
        this.inventor; 
    }

    get orign() {
        return this.calcOrigin();
    }

    calcOrigin() {
        let position = this.circle.getBoundingClientRect()

        let oX = position.left + this.radius/2;
        let oY = position.top + this.radius/2;

        console.log(position);

        return {x: oX, y: oY}
    }
}


