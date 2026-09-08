// particles.js - Система частиц
class Particle {
    constructor(x, y, color, size = 3, speed = 2) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.size = size;
        this.life = 1;
        this.maxLife = 30 + Math.random() * 30;
        this.vx = (Math.random() - 0.5) * speed * 3;
        this.vy = (Math.random() - 0.5) * speed * 3 - 2;
        this.gravity = 0.1;
        this.isAlive = true;
        this.friction = 0.98;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += this.gravity;
        this.vx *= this.friction;
        
        this.life++;
        if (this.life >= this.maxLife) {
            this.isAlive = false;
        }
    }
    
    render(ctx, camera) {
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        const alpha = 1 - (this.life / this.maxLife);
        
        ctx.globalAlpha = alpha;
        ctx.fillStyle = this.color;
        ctx.fillRect(x - this.size/2, y - this.size/2, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

class Particles {
    static particles = [];
    
    static createHitEffect(x, y) {
        const colors = ['#ff6b6b', '#ff4757', '#ff6348', '#ff4757'];
        for (let i = 0; i < 15; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particle = new Particle(x, y, color, 3 + Math.random() * 3, 3 + Math.random() * 2);
            particle.gravity = 0.2;
            Particles.particles.push(particle);
        }
    }
    
    static createDeathEffect(x, y) {
        const colors = ['#ffd93d', '#f6b93b', '#ff6348', '#ff6b6b', '#4ade80'];
        for (let i = 0; i < 30; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particle = new Particle(x, y, color, 3 + Math.random() * 5, 4 + Math.random() * 3);
            particle.gravity = 0.3;
            Particles.particles.push(particle);
        }
    }
    
    static createSwordSlash(x, y) {
        const colors = ['#ffffff', '#ffd700', '#ff6b6b'];
        for (let i = 0; i < 10; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particle = new Particle(x + (Math.random() - 0.5) * 20, 
                                         y + (Math.random() - 0.5) * 20, 
                                         color, 2 + Math.random() * 4, 5 + Math.random() * 3);
            particle.gravity = -0.1;
            particle.maxLife = 15 + Math.random() * 10;
            Particles.particles.push(particle);
        }
    }
    
    static createPickupEffect(x, y) {
        const colors = ['#ffd93d', '#f6b93b', '#ff6b6b', '#4ade80', '#60a5fa'];
        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const particle = new Particle(x + (Math.random() - 0.5) * 10, 
                                         y + (Math.random() - 0.5) * 10, 
                                         color, 2 + Math.random() * 4, 2 + Math.random() * 2);
            particle.gravity = -0.2;
            particle.maxLife = 20 + Math.random() * 20;
            Particles.particles.push(particle);
        }
    }
    
    static updateAll() {
        Particles.particles.forEach(p => p.update());
        Particles.particles = Particles.particles.filter(p => p.isAlive);
    }
    
    static renderAll(ctx, camera) {
        Particles.particles.forEach(p => p.render(ctx, camera));
    }
}