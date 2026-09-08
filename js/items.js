// items.js - ПРЕДМЕТЫ (без изменений)

class Item {
    constructor(x, y, type = 'potion') {
        this.x = x;
        this.y = y;
        this.width = 22;
        this.height = 22;
        this.type = type;
        this.collected = false;
        this.bobOffset = Math.random() * Math.PI * 2;
        this.glowTimer = 0;
        
        const types = {
            'potion': { color: '#EF4444', symbol: '❤️', effect: (p) => { p.health = Math.min(p.maxHealth, p.health + 1); } },
            'big_potion': { color: '#DC2626', symbol: '💖', effect: (p) => { p.health = Math.min(p.maxHealth, p.health + 3); } },
            'star': { color: '#FFD700', symbol: '⭐', effect: (p) => { p.score += 50; } },
            'crystal': { color: '#60A5FA', symbol: '💎', effect: (p) => { p.score += 100; } }
        };
        
        const data = types[type] || types['potion'];
        this.color = data.color;
        this.symbol = data.symbol;
        this.effect = data.effect;
    }
    
    collect(player) {
        if (this.collected || !player || !player.isAlive) return;
        this.collected = true;
        this.effect(player);
        SoundManager.play('pickup');
        console.log(`📦 Подобран предмет: ${this.type}, здоровье игрока: ${player.health}`);
    }
    
    render(ctx, camera) {
        if (this.collected) return;
        
        const x = this.x - camera.x;
        const y = this.y - camera.y + Math.sin(Date.now() / 500 + this.bobOffset) * 4;
        
        ctx.save();
        this.glowTimer += 0.02;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15 + Math.sin(this.glowTimer) * 3;
        
        ctx.fillStyle = '#1A1A2E';
        ctx.fillRect(x - 2, y - 2, this.width + 4, this.height + 4);
        
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, this.width, this.height);
        
        ctx.shadowBlur = 0;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = '16px "Courier New", monospace';
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText(this.symbol, x + this.width/2, y + this.height/2);
        
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, this.width, this.height);
        
        ctx.restore();
    }
    
    collidesWith(entity) {
        if (!entity) return false;
        return this.x < entity.x + entity.width &&
               this.x + this.width > entity.x &&
               this.y < entity.y + entity.height &&
               this.y + this.height > entity.y;
    }
}