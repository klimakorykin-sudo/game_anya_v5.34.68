// enemy.js - ВРАГИ (с уменьшенным уроном)

class Enemy {
    constructor(x, y, type = 'slime') {
        this.x = x;
        this.y = y;
        this.width = 28;
        this.height = 28;
        this.vx = 0;
        this.vy = 0;
        this.type = type;
        this.isAlive = true;
        this.isGrounded = false;
        this.facing = 1;
        this.health = 2;
        this.maxHealth = 2;
        this.speed = 0.8;
        this.damage = 1;
        this.attackCooldown = 0;
        
        if (type === 'plant') {
            this.health = 3;
            this.maxHealth = 3;
            this.speed = 0;
            this.height = 34;
        }
        if (type === 'scorpion') {
            this.health = 3;
            this.maxHealth = 3;
            this.speed = 1.2;
            this.width = 30;
            this.height = 22;
        }
        if (type === 'ghost') {
            this.health = 2;
            this.maxHealth = 2;
            this.speed = 1.5;
            this.width = 28;
            this.height = 34;
        }
        if (type === 'fire') {
            this.health = 3;
            this.maxHealth = 3;
            this.speed = 1.0;
            this.width = 26;
            this.height = 28;
            this.damage = 1; // ← УМЕНЬШИЛ (было 2)
        }
    }
    
    update(player) {
        if (!this.isAlive) return;
        if (!player) return;
        
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const dist = Math.hypot(dx, dy);
        
        // ====== ПОВЕДЕНИЕ ======
        if (this.type === 'slime') {
            this.vx = Math.sign(dx) * this.speed * 0.5;
            if (dist < 50 && this.isGrounded && Math.random() < 0.02) {
                this.vy = -6;
            }
        } else if (this.type === 'plant') {
            this.vx = 0;
            if (dist < 200 && this.attackCooldown <= 0) {
                this.attackCooldown = 60;
                if (window.game) {
                    window.game.createProjectile(this.x + this.width/2, this.y, player);
                }
            }
        } else if (this.type === 'scorpion') {
            this.vx = Math.sign(dx) * this.speed;
            this.facing = Math.sign(dx);
            if (dist < 80 && this.isGrounded && Math.random() < 0.03) {
                this.vy = -4;
            }
        } else if (this.type === 'ghost') {
            this.vx = Math.sign(dx) * this.speed * 0.6;
            this.vy = Math.sign(dy) * this.speed * 0.3;
        } else if (this.type === 'fire') {
            this.vx = Math.sign(dx) * this.speed * 0.7;
            if (dist < 150 && this.attackCooldown <= 0) {
                this.attackCooldown = 80;
                if (window.game) {
                    const proj = window.game.createProjectile(this.x + this.width/2, this.y, player);
                    proj.color = '#F97316';
                    proj.damage = 1; // ← УМЕНЬШИЛ
                }
            }
        }
        
        // ====== ГРАВИТАЦИЯ ======
        this.vy += 0.4;
        if (this.vy > 12) this.vy = 12;
        
        this.x += this.vx;
        this.y += this.vy;
        
        // ====== ПОЛ ======
        if (this.y + this.height > 500) {
            this.y = 500 - this.height;
            this.vy = 0;
            this.isGrounded = true;
        }
        
        // ====== СТЕНЫ ======
        if (this.x < 32) this.x = 32;
        if (this.x + this.width > 768) this.x = 768 - this.width;
        
        // ====== СТОЛКНОВЕНИЕ С ИГРОКОМ ======
        if (this.isAlive && player.isAlive && this.collidesWith(player)) {
            if (player.isAttacking) {
                this.takeDamage(1);
                this.vx = player.facing * 5;
                this.vy = -3;
            } else {
                player.takeDamage(this.damage);
                player.vx = (player.x < this.x ? -1 : 1) * 3;
                player.vy = -3;
            }
        }
        
        if (this.attackCooldown > 0) this.attackCooldown--;
    }
    
    collidesWith(entity) {
        if (!entity) return false;
        return this.x < entity.x + entity.width &&
               this.x + this.width > entity.x &&
               this.y < entity.y + entity.height &&
               this.y + this.height > entity.y;
    }
    
    takeDamage(damage) {
        this.health -= damage;
        if (this.health <= 0) {
            this.isAlive = false;
            if (window.game && window.game.player) {
                window.game.player.score += 10;
            }
        }
    }
    
    drawHealthBar(ctx, x, y) {
        const bw = this.width;
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(x, y - 6, bw, 3);
        ctx.fillStyle = this.health > 1 ? '#4ADE80' : '#EF4444';
        ctx.fillRect(x, y - 6, bw * (this.health/this.maxHealth), 3);
    }
    
    render(ctx, camera) {
        if (!this.isAlive) return;
        
        const x = this.x - camera.x;
        const y = this.y - camera.y;
        
        if (this.type === 'slime') {
            ctx.fillStyle = '#4ADE80';
            const wobble = Math.sin(Date.now() / 500) * 2;
            ctx.beginPath();
            ctx.ellipse(x + 14, y + 12 + wobble/4, 14, 10 + wobble/4, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#1A1A2E';
            ctx.fillRect(x + 6, y + 6, 3, 4);
            ctx.fillRect(x + 16, y + 6, 3, 4);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 7, y + 7, 1, 2);
            ctx.fillRect(x + 17, y + 7, 1, 2);
            ctx.fillStyle = '#166534';
            ctx.fillRect(x + 10, y + 14, 4, 1);
            
        } else if (this.type === 'plant') {
            ctx.fillStyle = '#166534';
            ctx.fillRect(x + 12, y + 20, 6, 14);
            ctx.fillStyle = '#22C55E';
            ctx.fillRect(x + 2, y + 2, 26, 20);
            ctx.fillStyle = '#1A1A2E';
            ctx.fillRect(x + 6, y + 8, 4, 4);
            ctx.fillRect(x + 18, y + 8, 4, 4);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(x + 7, y + 9, 2, 2);
            ctx.fillRect(x + 19, y + 9, 2, 2);
            ctx.fillStyle = '#166534';
            ctx.fillRect(x + 11, y + 16, 6, 2);
            
        } else if (this.type === 'scorpion') {
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
            
        } else if (this.type === 'ghost') {
            const alpha = 0.6 + Math.sin(Date.now() / 300) * 0.3;
            ctx.globalAlpha = alpha;
            ctx.fillStyle = '#8B5CF6';
            ctx.beginPath();
            ctx.ellipse(x + 14, y + 16, 14, 16, 0, 0, Math.PI * 2);
            ctx.fill();
            for (let i = 0; i < 4; i++) {
                ctx.fillRect(x + 4 + i * 6, y + 28, 4, 6 + Math.sin(Date.now() / 400 + i) * 3);
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
            
        } else if (this.type === 'fire') {
            const flicker = Math.sin(Date.now() / 200) * 3;
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
        }
        
        if (this.health < this.maxHealth) {
            this.drawHealthBar(ctx, x, y);
        }
    }
}