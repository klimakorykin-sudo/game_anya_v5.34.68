// player.js - ИГРОК (С ЗАЩИТОЙ ОТ СМЕРТИ)

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 40;
        this.vx = 0;
        this.vy = 0;
        this.speed = CONFIG.PLAYER_SPEED || 3.5;
        this.health = 5;
        this.maxHealth = 5;
        this.score = 0;
        this.isAlive = true;
        this.isGrounded = false;
        this.facing = 1;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.attackCooldown = 0;
        this.walkCycle = 0;
        this.isMoving = false;
        this.invincibleTimer = 0;
        this.isInvincible = false;
        
        console.log('🟢 Player создан:', this.x, this.y, 'здоровье:', this.health);
    }
    
    // ====== ВОСКРЕШЕНИЕ ======
    revive() {
        this.isAlive = true;
        this.health = this.maxHealth;
        this.x = 200;
        this.y = 300;
        this.vx = 0;
        this.vy = 0;
        this.isGrounded = false;
        this.isAttacking = false;
        this.attackTimer = 0;
        this.invincibleTimer = 60;
        this.isInvincible = true;
        console.log('💚 Игрок ВОСКРЕС! здоровье:', this.health);
    }
    
    collidesWith(entity) {
        if (!entity) return false;
        return this.x < entity.x + entity.width &&
               this.x + this.width > entity.x &&
               this.y < entity.y + entity.height &&
               this.y + this.height > entity.y;
    }
    
    update() {
        // ====== ЗАЩИТА: если мёртв — НЕ ОБНОВЛЯЕМ ======
        if (!this.isAlive) {
            return;
        }
        
        // ====== НЕУЯЗВИМОСТЬ ======
        if (this.isInvincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.isInvincible = false;
            }
        }
        
        // ====== ДВИЖЕНИЕ ======
        this.vx = 0;
        this.isMoving = false;
        
        if (Input.isLeft) {
            this.vx = -this.speed;
            this.facing = -1;
            this.isMoving = true;
        }
        if (Input.isRight) {
            this.vx = this.speed;
            this.facing = 1;
            this.isMoving = true;
        }
        
        // ====== ПРЫЖОК ======
        if (Input.isJump && this.isGrounded) {
            this.vy = CONFIG.JUMP_FORCE || -13;
            this.isGrounded = false;
            SoundManager.play('step');
        }
        
        // ====== ГРАВИТАЦИЯ ======
        this.vy += CONFIG.GRAVITY || 0.35;
        if (this.vy > 12) this.vy = 12;
        
        // ====== ДВИЖЕНИЕ ======
        this.x += this.vx;
        this.y += this.vy;
        
        // ====== СТЕНЫ ======
        if (this.x < 32) this.x = 32;
        if (this.x + this.width > 768) this.x = 768 - this.width;
        
        // ====== ПОЛ ======
        if (this.y + this.height > 500) {
            this.y = 500 - this.height;
            this.vy = 0;
            this.isGrounded = true;
        }
        
        // ====== АНИМАЦИЯ ======
        if (this.isMoving) {
            this.walkCycle += 0.15;
        } else {
            this.walkCycle = 0;
        }
        
        // ====== АТАКА ======
        if (this.attackCooldown > 0) {
            this.attackCooldown--;
        }
        
        if (Input.isAttack && this.attackCooldown <= 0 && !this.isAttacking) {
            this.isAttacking = true;
            this.attackTimer = 20;
            this.attackCooldown = 15;
            SoundManager.play('attack');
        }
        
        if (this.isAttacking) {
            this.attackTimer--;
            if (this.attackTimer <= 0) {
                this.isAttacking = false;
            }
        }
    }
    
    takeDamage(damage) {
        if (this.isInvincible || !this.isAlive) return;
        
        this.health -= damage;
        this.isInvincible = true;
        this.invincibleTimer = 30;
        
        console.log('💥 Игрок получил урон! здоровье:', this.health);
        
        if (this.health <= 0) {
            this.health = 0;
            this.isAlive = false;
            console.log('💀 Игрок УМЕР!');
            // НЕ СТАВИМ Game Over здесь — пусть игра сама решает
        }
    }
    
    render(ctx, camera) {
        // ====== НЕ РИСУЕМ МЁРТВОГО ======
        if (!this.isAlive) {
            console.warn('⚠️ Игрок мёртв, рендер пропущен');
            return;
        }
        
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        
        // ====== МЕРЦАНИЕ ПРИ НЕУЯЗВИМОСТИ ======
        if (this.isInvincible && Math.floor(Date.now() / 100) % 2 === 0) {
            ctx.globalAlpha = 0.5;
        }
        
        // ====== ТЕНЬ ======
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.beginPath();
        ctx.ellipse(x + 14, y + 38, 12, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // ====== ВОЛОСЫ ======
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(x + 2, y - 2, 24, 14);
        ctx.fillRect(x - 2, y + 4, 6, 8);
        ctx.fillRect(x + 24, y + 4, 6, 8);
        ctx.fillRect(x + 4, y - 4, 20, 6);
        ctx.fillRect(x + 6, y - 6, 16, 4);
        
        // ====== ЛИЦО ======
        ctx.fillStyle = '#FFD5A0';
        ctx.fillRect(x + 4, y + 4, 20, 18);
        
        // ====== ГЛАЗА ======
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 6, y + 8, 6, 8);
        ctx.fillRect(x + 16, y + 8, 6, 8);
        ctx.fillStyle = '#5D3A1A';
        ctx.fillRect(x + 8, y + 10, 3, 5);
        ctx.fillRect(x + 18, y + 10, 3, 5);
        ctx.fillStyle = '#2D1B0E';
        ctx.fillRect(x + 9, y + 12, 2, 2);
        ctx.fillRect(x + 19, y + 12, 2, 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 8, y + 10, 2, 2);
        ctx.fillRect(x + 18, y + 10, 2, 2);
        
        // ====== РОТ ======
        ctx.fillStyle = '#E74C3C';
        ctx.fillRect(x + 11, y + 18, 6, 2);
        ctx.fillRect(x + 12, y + 19, 4, 1);
        
        // ====== РУМЯНЕЦ ======
        ctx.fillStyle = 'rgba(255, 150, 150, 0.4)';
        ctx.fillRect(x + 4, y + 14, 4, 3);
        ctx.fillRect(x + 20, y + 14, 4, 3);
        
        // ====== ПЛАТЬЕ ======
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x + 2, y + 22, 24, 14);
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 8, y + 22, 4, 2);
        ctx.fillRect(x + 16, y + 22, 4, 2);
        ctx.fillRect(x + 10, y + 22, 8, 1);
        ctx.fillStyle = '#FF4757';
        ctx.fillRect(x + 2, y + 28, 24, 2);
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 12, y + 26, 4, 6);
        ctx.fillRect(x + 10, y + 26, 2, 2);
        ctx.fillRect(x + 16, y + 26, 2, 2);
        
        // ====== РУКИ ======
        ctx.fillStyle = '#FFD5A0';
        if (this.isAttacking) {
            ctx.fillRect(x + (this.facing > 0 ? 26 : -6), y + 18, 4, 8);
            ctx.fillStyle = '#DFE6E9';
            ctx.fillRect(x + (this.facing > 0 ? 30 : -10), y + 6, 3, 20);
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + (this.facing > 0 ? 30 : -10), y + 4, 3, 4);
            ctx.fillStyle = '#FF6B6B';
            ctx.fillRect(x + (this.facing > 0 ? 31 : -9), y + 24, 1, 4);
        } else {
            ctx.fillRect(x, y + 18, 4, 8);
            ctx.fillRect(x + 24, y + 18, 4, 8);
        }
        
        // ====== НОГИ ======
        ctx.fillStyle = '#2D3436';
        if (this.isMoving) {
            const step = Math.sin(this.walkCycle) * 3;
            ctx.fillRect(x + 4, y + 36, 6, 4 + step);
            ctx.fillRect(x + 18, y + 36, 6, 4 - step);
        } else {
            ctx.fillRect(x + 4, y + 36, 6, 4);
            ctx.fillRect(x + 18, y + 36, 6, 4);
        }
        
        // ====== БАНТИК ======
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(x + 10, y - 6, 8, 4);
        ctx.fillRect(x + 6, y - 8, 6, 4);
        ctx.fillRect(x + 16, y - 8, 6, 4);
        ctx.fillStyle = '#FF6B6B';
        ctx.fillRect(x + 12, y - 4, 4, 2);
        
        // ====== ЗДОРОВЬЕ ======
        const barWidth = 30;
        const barHeight = 4;
        const barX = x + (this.width - barWidth) / 2;
        const barY = y - 10;
        
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);
        
        const healthPercent = this.health / this.maxHealth;
        ctx.fillStyle = healthPercent > 0.5 ? '#4ADE80' : healthPercent > 0.25 ? '#FBBF24' : '#EF4444';
        ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);
        
        ctx.globalAlpha = 1;
    }
}