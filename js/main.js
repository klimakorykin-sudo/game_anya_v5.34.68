// main.js - С ВОСКРЕШЕНИЕМ ИГРОКА

function resizeCanvas() {
    const canvas = document.getElementById('gameCanvas');
    const container = document.getElementById('gameContainer');
    if (!canvas || !container) return;
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
}

document.addEventListener('DOMContentLoaded', () => {
    resizeCanvas();
    Input.init();
    UI.init();
    SoundManager.preload();
    
    window.game = new Game();
    window.game.start();
    
    setTimeout(() => {
        const screen = document.getElementById('loadingScreen');
        if (screen) screen.classList.add('hidden');
    }, 500);
});

window.addEventListener('resize', resizeCanvas);
window.addEventListener('orientationchange', () => setTimeout(resizeCanvas, 300));

// ====== УРОВНИ ======
const LEVELS = [
    {
        name: '🌲 Лесная опушка',
        bgColors: ['#1a3a1a', '#2d4a2d', '#0d1a0d'],
        floorColor: '#2d4a1a',
        wallColor: '#3d2b1f',
        enemies: [
            { x: 300, y: 300, type: 'slime' },
            { x: 500, y: 350, type: 'slime' }
        ],
        items: [
            { x: 250, y: 280, type: 'potion' },
            { x: 450, y: 280, type: 'star' }
        ]
    },
    {
        name: '🏜️ Пустыня',
        bgColors: ['#4a3520', '#6b4c30', '#2a1a10'],
        floorColor: '#6b5a3a',
        wallColor: '#5a3d2b',
        enemies: [
            { x: 200, y: 300, type: 'scorpion' },
            { x: 400, y: 350, type: 'scorpion' },
            { x: 600, y: 300, type: 'slime' }
        ],
        items: [
            { x: 150, y: 280, type: 'big_potion' },
            { x: 400, y: 280, type: 'star' },
            { x: 550, y: 280, type: 'potion' }
        ]
    },
    {
        name: '🏰 Тёмный замок',
        bgColors: ['#1a0a2a', '#2d1a3d', '#0a0a1a'],
        floorColor: '#3d2a3a',
        wallColor: '#4a2a3a',
        enemies: [
            { x: 250, y: 300, type: 'ghost' },
            { x: 450, y: 350, type: 'ghost' },
            { x: 350, y: 300, type: 'slime' }
        ],
        items: [
            { x: 200, y: 280, type: 'big_potion' },
            { x: 500, y: 280, type: 'big_potion' },
            { x: 350, y: 280, type: 'crystal' }
        ]
    },
    {
        name: '🌋 Огненная гора',
        bgColors: ['#2a0a0a', '#4a1a0a', '#1a0505'],
        floorColor: '#5a2a1a',
        wallColor: '#3d1a0a',
        enemies: [
            { x: 200, y: 300, type: 'fire' },
            { x: 450, y: 350, type: 'fire' },
            { x: 600, y: 300, type: 'scorpion' }
        ],
        items: [
            { x: 150, y: 280, type: 'crystal' },
            { x: 400, y: 280, type: 'big_potion' },
            { x: 550, y: 280, type: 'crystal' }
        ]
    },
    {
        name: '🚀 Космическая станция',
        bgColors: ['#0a0a2a', '#1a0a3a', '#050510'],
        floorColor: '#2a2a4a',
        wallColor: '#1a1a3a',
        enemies: [
            { x: 200, y: 300, type: 'ghost' },
            { x: 350, y: 350, type: 'fire' },
            { x: 500, y: 300, type: 'ghost' },
            { x: 650, y: 350, type: 'fire' }
        ],
        items: [
            { x: 150, y: 280, type: 'crystal' },
            { x: 300, y: 280, type: 'big_potion' },
            { x: 500, y: 280, type: 'crystal' },
            { x: 650, y: 280, type: 'big_potion' }
        ]
    }
];

// ====== НОВЫЕ ТИПЫ ВРАГОВ ======
class Scorpion extends Enemy {
    constructor(x, y) {
        super(x, y, 'scorpion');
        this.health = 3; this.maxHealth = 3; this.speed = 1.2; this.width = 30; this.height = 22;
    }
    render(ctx, camera) {
        if (!this.isAlive) return;
        const x = this.x - camera.x, y = this.y - camera.y;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 4, y + 6, 22, 12);
        ctx.fillRect(x + 2, y + 8, 6, 8);
        ctx.fillRect(x + 24, y + 4, 6, 4);
        ctx.fillRect(x + 28, y + 2, 4, 4);
        ctx.fillRect(x, y + 10, 4, 4);
        ctx.fillRect(x + 26, y + 10, 4, 4);
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(x + 4, y + 10, 2, 2);
        ctx.fillRect(x + 8, y + 10, 2, 2);
        this.drawHealthBar(ctx, x, y);
    }
}

class Ghost extends Enemy {
    constructor(x, y) {
        super(x, y, 'ghost');
        this.health = 2; this.maxHealth = 2; this.speed = 1.5; this.width = 28; this.height = 34;
    }
    render(ctx, camera) {
        if (!this.isAlive) return;
        const x = this.x - camera.x, y = this.y - camera.y + Math.sin(Date.now()/500)*3;
        const alpha = 0.6 + Math.sin(Date.now()/300)*0.3;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = '#8B5CF6';
        ctx.beginPath();
        ctx.ellipse(x + 14, y + 16, 14, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        for (let i = 0; i < 4; i++) {
            ctx.fillRect(x + 4 + i*6, y + 28, 4, 6 + Math.sin(Date.now()/400 + i)*3);
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 6, y + 10, 6, 6);
        ctx.fillRect(x + 16, y + 10, 6, 6);
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(x + 8, y + 12, 2, 3);
        ctx.fillRect(x + 18, y + 12, 2, 3);
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(x + 10, y + 20, 8, 2);
        ctx.globalAlpha = 1;
        this.drawHealthBar(ctx, x, y);
    }
}

class Fire extends Enemy {
    constructor(x, y) {
        super(x, y, 'fire');
        this.health = 3; this.maxHealth = 3; this.speed = 1.0; this.width = 26; this.height = 28; this.damage = 1;
    }
    render(ctx, camera) {
        if (!this.isAlive) return;
        const x = this.x - camera.x, y = this.y - camera.y;
        const flicker = Math.sin(Date.now()/200)*3;
        ctx.fillStyle = '#EF4444';
        ctx.fillRect(x + 4, y + 4 + flicker, 18, 20 - flicker);
        ctx.fillStyle = '#F97316';
        ctx.fillRect(x + 8, y + 2 + flicker/2, 10, 10 - flicker/2);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 10, y + 4 + flicker/3, 6, 4 - flicker/3);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 6, y + 12, 3, 3);
        ctx.fillRect(x + 16, y + 12, 3, 3);
        ctx.fillStyle = '#DC2626';
        ctx.fillRect(x + 10, y + 18, 6, 2);
        this.drawHealthBar(ctx, x, y);
    }
}

// ====== ГЛАВНЫЙ КЛАСС ======
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.camera = new Camera();
        
        this.currentLevel = 0;
        this.isGameOver = false;
        this.isVictory = false;
        this.isLevelComplete = false;
        this.levelCompleteTimer = 0;
        
        // ====== СОЗДАЁМ ИГРОКА ======
        this.player = new Player(200, 300);
        console.log('✅ Игрок создан');
        
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.floatingTexts = [];
        
        this.loadLevel(0);
    }
    
    loadLevel(levelIndex) {
        if (levelIndex >= LEVELS.length) {
            this.isVictory = true;
            return;
        }
        
        this.currentLevel = levelIndex;
        const level = LEVELS[levelIndex];
        
        console.log(`📂 Загружаю уровень ${levelIndex + 1}: ${level.name}`);
        
        // ====== ВРАГИ ======
        this.enemies = [];
        level.enemies.forEach(data => {
            let enemy;
            switch(data.type) {
                case 'scorpion': enemy = new Scorpion(data.x, data.y); break;
                case 'ghost': enemy = new Ghost(data.x, data.y); break;
                case 'fire': enemy = new Fire(data.x, data.y); break;
                default: enemy = new Enemy(data.x, data.y, data.type);
            }
            this.enemies.push(enemy);
        });
        
        // ====== ПРЕДМЕТЫ ======
        this.items = [];
        level.items.forEach(data => {
            this.items.push(new Item(data.x, data.y, data.type));
        });
        
        // ====== ВОСКРЕШАЕМ ИГРОКА ======
        if (this.player) {
            this.player.revive(); // ← ГЛАВНЫЙ ФИКС!
            console.log(`✅ Игрок воскрешён: здоровье ${this.player.health}/${this.player.maxHealth}`);
        } else {
            this.player = new Player(200, 300);
            console.log('✅ Игрок создан заново');
        }
        
        this.projectiles = [];
        this.isLevelComplete = false;
        this.levelCompleteTimer = 0;
        this.currentLevelData = level;
    }
    
    start() {
        this.gameLoop();
    }
    
    gameLoop() {
        if (!this.isGameOver && !this.isVictory) {
            this.update();
        }
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    createProjectile(x, y, target) {
        const proj = {
            x, y, width: 8, height: 8,
            vx: Math.sign(target.x - x) * 3,
            vy: Math.sign(target.y - y) * 3,
            isAlive: true, color: '#EF4444', damage: 1,
            update() {
                this.x += this.vx; this.y += this.vy;
                if (window.game && window.game.player) {
                    const p = window.game.player;
                    if (p && p.isAlive && 
                        this.x < p.x + p.width && this.x + this.width > p.x &&
                        this.y < p.y + p.height && this.y + this.height > p.y) {
                        p.takeDamage(this.damage);
                        this.isAlive = false;
                    }
                }
                if (this.x < 0 || this.x > 800 || this.y < 0 || this.y > 600) this.isAlive = false;
            },
            render(ctx, camera) {
                const x = this.x - camera.x, y = this.y - camera.y;
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 15;
                ctx.beginPath();
                ctx.arc(x + this.width/2, y + this.height/2, this.width/2, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#FFFFFF';
                ctx.beginPath();
                ctx.arc(x + this.width/2 - 1, y + this.height/2 - 1, 2, 0, Math.PI * 2);
                ctx.fill();
            }
        };
        this.projectiles.push(proj);
        return proj;
    }
    
    update() {
        if (this.isLevelComplete) {
            this.levelCompleteTimer++;
            if (this.levelCompleteTimer > 60) {
                this.loadLevel(this.currentLevel + 1);
            }
            return;
        }
        
        // ====== ИГРОК ======
        if (this.player && this.player.isAlive) {
            this.player.update();
            if (this.player.y + this.player.height > 500) {
                this.player.y = 500 - this.player.height;
                this.player.vy = 0;
                this.player.isGrounded = true;
            }
        }
        
        // ====== ВРАГИ ======
        this.enemies.forEach(e => e.update(this.player));
        this.enemies = this.enemies.filter(e => e.isAlive);
        
        // ====== ПРЕДМЕТЫ ======
        if (this.player && this.player.isAlive) {
            this.items.forEach(item => {
                if (!item.collected && this.player.collidesWith(item)) {
                    item.collect(this.player);
                }
            });
        }
        this.items = this.items.filter(i => !i.collected);
        
        // ====== СНАРЯДЫ ======
        this.projectiles.forEach(p => p.update());
        this.projectiles = this.projectiles.filter(p => p.isAlive);
        
        if (typeof Particles !== 'undefined') Particles.updateAll();
        
        if (this.player) this.camera.follow(this.player);
        
        // ====== ПРОВЕРКА ЗАВЕРШЕНИЯ ======
        if (this.enemies.length === 0 && this.items.length === 0 && !this.isLevelComplete && this.player && this.player.isAlive) {
            this.isLevelComplete = true;
            this.levelCompleteTimer = 0;
            console.log(`🎉 Уровень ${this.currentLevel + 1} пройден!`);
        }
    }
    
    render() {
        const ctx = this.ctx;
        const canvas = this.canvas;
        const w = canvas.width, h = canvas.height;
        
        const level = this.currentLevelData || LEVELS[0];
        const colors = level.bgColors || ['#1a1a3e', '#0d0d2b', '#050510'];
        
        const grad = ctx.createRadialGradient(w/2, h/2, 0, w/2, h/2, w);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(0.5, colors[1]);
        grad.addColorStop(1, colors[2]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        
        const scale = Math.min(w / 800, h / 600);
        const ox = (w - 800 * scale) / 2;
        const oy = (h - 600 * scale) / 2;
        
        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = level.floorColor || '#2d1b1a';
        ctx.fillRect(0, 500, 800, 100);
        ctx.fillStyle = level.floorColor ? level.floorColor + '88' : '#3d2b2a';
        for (let i = 0; i < 25; i++) ctx.fillRect(i * 32, 500, 32, 2);
        
        ctx.fillStyle = level.wallColor || '#3d2b1f';
        ctx.fillRect(0, 0, 32, 600);
        ctx.fillRect(768, 0, 32, 600);
        
        this.items.forEach(item => item.render(ctx, this.camera));
        this.enemies.forEach(enemy => enemy.render(ctx, this.camera));
        this.projectiles.forEach(p => p.render(ctx, this.camera));
        
        if (this.player) {
            this.player.render(ctx, this.camera);
        }
        
        if (typeof Particles !== 'undefined') Particles.renderAll(ctx, this.camera);
        
        ctx.restore();
        
        if (this.player) UI.render(this.player, this.currentLevel, this.player.score);
        
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 18px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText(level.name || `Уровень ${this.currentLevel + 1}`, w/2, 60);
        
        if (this.isLevelComplete && this.levelCompleteTimer < 60) {
            ctx.fillStyle = 'rgba(0,0,0,0.5)';
            ctx.fillRect(0, 0, w, h);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 48px "Courier New", monospace';
            ctx.fillStyle = '#FFD700';
            ctx.fillText('🎉 УРОВЕНЬ ПРОЙДЕН!', w/2, h/2 - 20);
            ctx.font = '24px "Courier New", monospace';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`Следующий: ${LEVELS[this.currentLevel + 1]?.name || 'Финал!'}`, w/2, h/2 + 50);
        }
        
        if (this.isVictory) {
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(0, 0, w, h);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 56px "Courier New", monospace';
            ctx.fillStyle = '#FFD700';
            ctx.fillText('🏆 ИГРА ПРОЙДЕНА!', w/2, h/2 - 60);
            ctx.font = '28px "Courier New", monospace';
            ctx.fillStyle = '#FFFFFF';
            ctx.fillText(`⭐ Очки: ${this.player ? this.player.score : 0}`, w/2, h/2 + 20);
            ctx.font = '20px "Courier New", monospace';
            ctx.fillStyle = '#8888AA';
            ctx.fillText('Обнови страницу, чтобы начать заново', w/2, h/2 + 80);
        }
    }
}