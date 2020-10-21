export default class Cursor {
    origin = { x: 0, y: 0 }
    position = { x: 0, y: 0 }
    isLoading = false;
   
    // collideWith = false
    radius;

    constructor(top, left, radius, el) {

        this.position = { x: left, y: top };
        this.radius = radius;
        this.origin = this.calcOrigin();
        this.el = el;
        this.isActive = false;
    }

    calcOrigin() {
        let oX = this.position.x + this.radius;
        let oY = this.position.y + this.radius;

        return { x: oX, y: oY }
    }

    moveCursor(x, y) {
        this.el.style.left = x + "px"
        this.el.style.top = y + "px"
        this.position = { x: x, y: y }
        this.origin = this.calcOrigin();
    }

    // Start - Collision logic 
    collisionHandler(nodes) {
        nodes.forEach(node => {
            let result = Math.sqrt(Math.pow(node.origin.x - this.origin.x, 2) + Math.pow(node.origin.y - this.origin.y, 2))
            // let result = Math.sqrt( Math.pow(this.origin.x - node.origin.x, 2) + Math.pow(this.origin.y -node.origin.y, 2))
        
            if (result < node.radius*2) {
              
                node.el.classList.add('active');
                this.isLoading = true;
                // this.magneted(node) 
            } 
        });
    }

    magneted(node) {

        // To improve 
        if(node.isFocused) {
            node.isFocused = false;
            this.el.classList.remove('magnet')
        } else {

            node.isFocused = true;
            this.el.classList.add('magnet')
            
            this.el.style.top = node.origin.y - this.radius + "px"
            this.el.style.left = node.origin.x - this.radius + "px"
        }
    }
    // End - Collision logic 
}