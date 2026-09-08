// enemyTypes.js - Расширенные типы врагов

// Переопределяем конструктор Enemy, чтобы добавить новые типы
const EnemyTypes = {
    // Летающий враг
    'bat': {
        width: 24,
        height: 20,
        health: 2,
        speed: 1.5,
        color: '#8b5cf6',
        damage: 1,
        behavior: 'fly'
    },
    // Огненный элементаль
    'fire': {
        width: 26,
        height: 26,
        health: 3,
        speed: 1.2,
        color: '#ef4444',
        damage: 2,
        behavior: 'ranged'
    },
    // Ледяной враг
    'ice': {
        width: 28,
        height: 28,
        health: 3,
        speed: 0.8,
        color: '#60a5fa',
        damage: 1,
        behavior: 'slow'
    },
    // Босс - Корень Зла
    'boss': {
        width: 48,
        height: 52,
        health: 15,
        speed: 0.5,
        color: '#7c2d12',
        damage: 2,
        behavior: 'boss'
    },
    // Призрак (проходит сквозь стены)
    'ghost': {
        width: 24,
        height: 30,
        health: 2,
        speed: 1.8,
        color: '#a78bfa',
        damage: 1,
        behavior: 'ghost'
    }
};

// Расширяем метод setupByType
const originalSetup = Enemy.prototype.setupByType;
Enemy.prototype.setupByType = function() {
    const typeData = EnemyTypes[this.type];
    if (typeData) {
        this.width = typeData.width;
        this.height = typeData.height;
        this.health = typeData.health;
        this.maxHealth = typeData.health;
        this.speed = typeData.speed;
        this.color = typeData.color;
        this.damage = typeData.damage;
        this.behavior = typeData.behavior;
        this.phase = 0;
        this.phaseTimer = 0;
    } else {
        // Если тип не найден, используем базовые настройки
        originalSetup.call(this);
    }
};

// Расширяем AI поведение
const originalAI = Enemy.prototype.aiBehavior;
Enemy.prototype.aiBehavior = function(player) {
    // Если есть специальное поведение - используем его
    if (this.behavior) {
        this.specialBehavior(player);
        return;
    }
    originalAI.call(this, player);
};

// Добавляем специальные поведения
Enemy.prototype.specialBehavior = function(player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);
    
    switch(this.behavior) {
        case 'fly':
            // Летает над игроком и атакует сверху
            this.vy += CONFIG.GRAVITY * 0.3;
            if (dist < 150) {
                this.vx = Math.sign(dx) * this.speed * 0.5;
                if (this.y > player.y - 60 && Math.random() < 0.02) {
                    this.vy = -4;
                }
            } else {
                this.vx = Math.sign(dx) * this.speed * 0.3;
                if (this.y > 200) this.vy = -2;
            }
            // Рисуем крылья (в рендере)
            this.wingsAngle = (this.wingsAngle || 0) + 0.1;
            break;
            
        case 'ranged':
            // Стреляет огненными шарами
            this.vx = 0;
            if (dist < 200 && this.attackCooldown <= 0 && this.isGrounded) {
                this.attackCooldown = 80;
                // Создаём огненный шар
                if (window.game) {
                    const proj = window.game.createProjectile(
                        this.x + this.width/2, 
                        this.y + 10,
                        player,
                        'fire'
                    );
                    proj.color = '#ef4444';
                    proj.size = 12;
                }
            }
            break;
            
        case 'slow':
            // Замедляет игрока при касании
            this.vx = Math.sign(dx) * this.speed * 0.3;
            this.vy += CONFIG.GRAVITY * 0.5;
            // Игрок в радиусе замедляется
            if (dist < 80 && window.game && window.game.player) {
                window.game.player.speed = CONFIG.PLAYER_SPEED * 0.5;
            } else if (window.game && window.game.player) {
                window.game.player.speed = CONFIG.PLAYER_SPEED;
            }
            break;
            
        case 'boss':
            // Босс - сложное поведение с фазами
            this.phaseTimer++;
            this.vx = 0;
            
            // Фаза 1: прыгает и стреляет
            if (this.health > this.maxHealth * 0.6) {
                if (this.isGrounded && Math.random() < 0.02) {
                    this.vy = -8;
                    this.vx = Math.sign(dx) * 2;
                }
                if (this.attackCooldown <= 0 && dist < 300) {
                    this.attackCooldown = 60;
                    // Создаём несколько снарядов
                    for (let i = -2; i <= 2; i++) {
                        if (window.game) {
                            const proj = window.game.createProjectile(
                                this.x + this.width/2, 
                                this.y + 10,
                                player,
                                'boss'
                            );
                            proj.vx = i * 1.2;
                            proj.vy = -3;
                            proj.color = '#7c2d12';
                            proj.size = 10;
                            proj.damage = 2;
                        }
                    }
                }
            }
            // Фаза 2: быстрый и злой
            else if (this.health > this.maxHealth * 0.3) {
                if (this.isGrounded) {
                    this.vy = -6 + Math.random() * 4;
                    this.vx = Math.sign(dx) * 3;
                }
                if (this.attackCooldown <= 0) {
                    this.attackCooldown = 30;
                    if (window.game) {
                        const proj = window.game.createProjectile(
                            this.x + this.width/2, 
                            this.y + 10,
                            player,
                            'boss'
                        );
                        proj.vx = Math.sign(dx) * 4;
                        proj.vy = -1;
                        proj.color = '#dc2626';
                        proj.size = 14;
                        proj.damage = 2;
                    }
                }
            }
            // Фаза 3: отчаяние
            else {
                if (this.isGrounded && Math.random() < 0.05) {
                    this.vy = -10;
                    this.vx = Math.sign(dx) * 4;
                }
                if (this.attackCooldown <= 0) {
                    this.attackCooldown = 20;
                    // Огненное кольцо
                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2 + this.phaseTimer * 0.02;
                        if (window.game) {
                            const proj = window.game.createProjectile(
                                this.x + this.width/2, 
                                this.y + this.height/2,
                                player,
                                'boss'
                            );
                            proj.vx = Math.cos(angle) * 3;
                            proj.vy = Math.sin(angle) * 3;
                            proj.color = '#ef4444';
                            proj.size = 8;
                            proj.damage = 1;
                        }
                    }
                }
            }
            break;
            
        case 'ghost':
            // Призрак - проходит сквозь стены, но медленно
            this.vx = Math.sign(dx) * this.speed * 0.4;
            this.vy = Math.sign(dy) * this.speed * 0.2;
            // Мерцание
            this.flicker = (this.flicker || 0) + 0.1;
            break;
    }
};

// Расширяем рендер для новых типов
const originalRender = Enemy.prototype.render;
Enemy.prototype.render = function(ctx, camera) {
    if (!this.isAlive) return;
    
    const x = this.x - camera.x;
    const y = this.y - camera.y;
    
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    
    // Специальная отрисовка для разных типов
    switch(this.type) {
        case 'bat':
            this.renderBat(ctx, x, y);
            break;
        case 'fire':
            this.renderFire(ctx, x, y);
            break;
        case 'ice':
            this.renderIce(ctx, x, y);
            break;
        case 'boss':
            this.renderBoss(ctx, x, y);
            break;
        case 'ghost':
            this.renderGhost(ctx, x, y);
            break;
        default:
            originalRender.call(this, ctx, { x: camera.x, y: camera.y });
            break;
    }
    
    ctx.restore();
    
    // Полоска здоровья для босса
    if (this.type === 'boss') {
        this.drawBossHealthBar(ctx, x, y);
    } else if (this.health < this.maxHealth) {
        this.drawHealthBar(ctx, x, y);
    }
};

// Отрисовка летучей мыши
Enemy.prototype.renderBat = function(ctx, x, y) {
    const wing = Math.sin(this.wingsAngle || 0) * 8;
    ctx.fillStyle = this.color;
    // Тело
    ctx.fillRect(x + 8, y + 8, 8, 8);
    // Крылья
    ctx.fillRect(x, y + 4 + wing/2, 8, 4);
    ctx.fillRect(x + 16, y + 4 - wing/2, 8, 4);
    // Глаза
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 10, y + 10, 2, 2);
    ctx.fillRect(x + 14, y + 10, 2, 2);
};

// Отрисовка огненного элементаля
Enemy.prototype.renderFire = function(ctx, x, y) {
    const flicker = Math.random() * 4;
    ctx.fillStyle = this.color;
    ctx.fillRect(x + 4, y + 6 + flicker, 18, 18 - flicker);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(x + 8, y + 4 + flicker/2, 10, 8 - flicker/2);
    // Глаза-огоньки
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(x + 8, y + 12, 3, 3);
    ctx.fillRect(x + 15, y + 12, 3, 3);
};

// Отрисовка ледяного врага
Enemy.prototype.renderIce = function(ctx, x, y) {
    const shimmer = Math.sin(Date.now() / 300) * 2;
    ctx.fillStyle = this.color;
    ctx.fillRect(x + 2, y + 2 + shimmer, 24, 24 - shimmer);
    ctx.fillStyle = '#93c5fd';
    ctx.fillRect(x + 6, y + 6, 4, 4);
    ctx.fillRect(x + 18, y + 6, 4, 4);
    // Иней
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(x + 4, y + 14, 20, 2);
};

// Отрисовка босса
Enemy.prototype.renderBoss = function(ctx, x, y) {
    const pulse = Math.sin(Date.now() / 500) * 2;
    // Тёмная аура
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 30;
    
    // Тело босса
    ctx.fillStyle = this.color;
    ctx.fillRect(x + 4, y + 4 + pulse, 40, 44 - pulse);
    
    // Глаза
    ctx.fillStyle = '#ef4444';
    ctx.shadowBlur = 15;
    ctx.fillRect(x + 12, y + 16, 6, 6);
    ctx.fillRect(x + 28, y + 16, 6, 6);
    
    // Рот
    ctx.fillStyle = '#450a0a';
    ctx.fillRect(x + 16, y + 28, 16, 6);
    
    // Коронные шипы
    ctx.fillStyle = '#dc2626';
    for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + 6 + i * 8, y - 2, 4, 6 + Math.sin(Date.now() / 300 + i) * 2);
    }
    
    ctx.shadowBlur = 0;
    
    // Полоска здоровья показывается отдельно
};

// Отрисовка призрака
Enemy.prototype.renderGhost = function(ctx, x, y) {
    const alpha = 0.5 + Math.sin(this.flicker || 0) * 0.3;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    // Плавная форма
    ctx.beginPath();
    ctx.ellipse(x + this.width/2, y + this.height/2, this.width/2, this.height/2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    // Глаза
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(x + 6, y + 8, 4, 4);
    ctx.fillRect(x + 14, y + 8, 4, 4);
};

// Здоровье босса в виде большой полосы вверху экрана
Enemy.prototype.drawBossHealthBar = function(ctx, x, y) {
    const canvas = ctx.canvas;
    const barWidth = canvas.width - 40;
    const barHeight = 20;
    const barX = 20;
    const barY = 50;
    
    // Фон
    ctx.fillStyle = 'rgba(0,0,0,0.8)';
    ctx.fillRect(barX - 2, barY - 2, barWidth + 4, barHeight + 4);
    
    // Имя босса
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.fillStyle = '#ff6b6b';
    ctx.fillText('👹 КОРЕНЬ ЗЛА', canvas.width/2, barY - 2);
    
    // Здоровье
    const healthPercent = this.health / this.maxHealth;
    const gradient = ctx.createLinearGradient(barX, 0, barX + barWidth, 0);
    gradient.addColorStop(0, healthPercent > 0.5 ? '#4ade80' : '#fbbf24');
    gradient.addColorStop(1, healthPercent > 0.3 ? '#fbbf24' : '#ef4444');
    ctx.fillStyle = gradient;
    ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
    
    // Рамка
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barWidth, barHeight);
    
    // Текст здоровья
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 12px "Courier New", monospace';
    ctx.fillStyle = '#ffffff';
    ctx.fillText(`${Math.ceil(this.health)}/${this.maxHealth}`, canvas.width/2, barY + barHeight/2);
};