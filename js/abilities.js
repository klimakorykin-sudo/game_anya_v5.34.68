// abilities.js - Способности игрока

// === ИСПРАВЛЯЕМ ПОВТОР originalUpdate ===
const originalPlayerUpdate = Player.prototype.update;

Player.prototype.update = function(tileMap) {
    this.updateAbilities();
    originalPlayerUpdate.call(this, tileMap);
};

Player.prototype.updateAbilities = function() {
    for (let key in this.abilities) {
        if (this.abilities[key].cooldown > 0) {
            this.abilities[key].cooldown--;
        }
    }
};

Player.prototype.useDash = function() {
    if (!this.abilities.dash.unlocked) return;
    if (this.abilities.dash.cooldown > 0) return;

    this.abilities.dash.cooldown = 60;
    const dashSpeed = 8;
    this.vx = this.facing * dashSpeed;
    this.vy = -2;

    Particles.createDashEffect(this.x + this.width / 2, this.y + this.height / 2, this.facing);
    SoundManager.play('dash');
};

Player.prototype.useShield = function() {
    if (!this.abilities.shield.unlocked) return;
    if (this.abilities.shield.cooldown > 0) return;

    this.abilities.shield.cooldown = 120;
    this.shieldActive = true;
    this.shieldTimer = 30;

    Particles.createShieldEffect(this.x + this.width / 2, this.y + this.height / 2);
    SoundManager.play('shield');
};

const originalTakeDamage = Player.prototype.takeDamage;
Player.prototype.takeDamage = function(damage) {
    if (this.shieldActive) {
        this.shieldActive = false;
        Particles.createShieldBreakEffect(this.x + this.width / 2, this.y + this.height / 2);
        SoundManager.play('shield_break');
        return;
    }
    originalTakeDamage.call(this, damage);
};

// Частицы для способностей
Particles.createDashEffect = function(x, y, direction) {
    const colors = ['#60a5fa', '#93c5fd', '#bfdbfe'];
    for (let i = 0; i < 20; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const p = new Particle(
            x + (Math.random() - 0.5) * 20,
            y + (Math.random() - 0.5) * 20,
            color,
            2 + Math.random() * 4,
            3 + Math.random() * 2
        );
        p.vx = direction * (2 + Math.random() * 4);
        p.vy = (Math.random() - 0.5) * 4;
        p.maxLife = 15 + Math.random() * 10;
        Particles.particles.push(p);
    }
};

Particles.createShieldEffect = function(x, y) {
    const colors = ['#60a5fa', '#93c5fd', '#bfdbfe'];
    for (let i = 0; i < 30; i++) {
        const angle = (i / 30) * Math.PI * 2;
        const radius = 20 + Math.random() * 10;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const p = new Particle(
            x + Math.cos(angle) * radius,
            y + Math.sin(angle) * radius,
            color,
            2 + Math.random() * 3,
            1 + Math.random() * 2
        );
        p.vx = -Math.cos(angle) * 2;
        p.vy = -Math.sin(angle) * 2;
        p.maxLife = 20 + Math.random() * 20;
        Particles.particles.push(p);
    }
};

Particles.createShieldBreakEffect = function(x, y) {
    const colors = ['#60a5fa', '#93c5fd', '#bfdbfe', '#ffffff'];
    for (let i = 0; i < 40; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const p = new Particle(
            x + (Math.random() - 0.5) * 30,
            y + (Math.random() - 0.5) * 30,
            color,
            3 + Math.random() * 5,
            4 + Math.random() * 3
        );
        p.gravity = -0.1;
        p.maxLife = 25 + Math.random() * 20;
        Particles.particles.push(p);
    }
};

// Расширяем UI для отображения способностей
const originalUIRender = UI.render;
UI.render = function(player, level, score) {
    originalUIRender.call(this, player, level, score);

    const ctx = UI.ctx;
    const canvas = UI.canvas;

    let yPos = canvas.height - 60;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'bottom';
    ctx.font = '14px "Courier New", monospace';

    if (player.abilities.dash.unlocked) {
        const color = player.abilities.dash.cooldown > 0 ? '#4a4a6a' : '#60a5fa';
        ctx.fillStyle = color;
        ctx.fillText('⚡ Рывок [E]', canvas.width - 10, yPos);
        yPos -= 20;
    }

    if (player.abilities.shield.unlocked) {
        const color = player.abilities.shield.cooldown > 0 ? '#4a4a6a' : '#60a5fa';
        ctx.fillStyle = color;
        ctx.fillText('🛡️ Щит [Q]', canvas.width - 10, yPos);
        yPos -= 20;
    }
};

// Звуки способностей
SoundManager.preload = function() {
    // Пустая заглушка
};