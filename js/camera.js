// camera.js - ПРОСТАЯ КАМЕРА

class Camera {
    constructor() {
        this.x = 0;
        this.y = 0;
    }
    
    follow(target) {
        if (!target) return;
        this.x = target.x - 400 + target.width / 2;
        this.y = target.y - 300 + target.height / 2;
        
        // Не выходим за границы
        this.x = Math.max(0, Math.min(this.x, 800 - 800));
        this.y = Math.max(0, Math.min(this.y, 600 - 600));
    }
}