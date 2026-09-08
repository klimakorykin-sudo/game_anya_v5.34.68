// achievements.js - Достижения (упрощённые)

class AchievementManager {
    constructor() {
        this.achievements = {
            'first_step': { name: '👣 Первый шаг', desc: 'Начать игру', unlocked: false },
            'slime_killer': { name: '💚 Убийца слизей', desc: 'Убить 3 слизей', unlocked: false, count: 0, target: 3 },
            'hero': { name: '🦸 Герой школы', desc: 'Победить босса', unlocked: false }
        };
        this.notifications = [];
        this.showingList = false;
    }
    
    unlock(id) {
        if (!this.achievements[id]) return false;
        if (this.achievements[id].unlocked) return false;
        
        this.achievements[id].unlocked = true;
        this.notifications.push({ id: id, timer: 180 });
        SoundManager.play('levelup');
        
        if (window.game && window.game.player) {
            window.game.player.score += 50;
            window.game.showFloatingText(400, 300, `🏆 ${this.achievements[id].name}`);
        }
        return true;
    }
    
    progress(id, increment = 1) {
        const ach = this.achievements[id];
        if (!ach || ach.unlocked) return;
        
        ach.count = (ach.count || 0) + increment;
        if (ach.count >= ach.target) {
            this.unlock(id);
        }
    }
    
    update() {
        this.notifications.forEach(n => n.timer--);
        this.notifications = this.notifications.filter(n => n.timer > 0);
    }
    
    render(ctx, canvas) {
        // Показываем нотификацию
        if (this.notifications.length > 0) {
            const last = this.notifications[this.notifications.length - 1];
            const alpha = Math.min(1, last.timer / 30);
            const y = 120 + (1 - alpha) * 30;
            
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = 'rgba(0,0,0,0.8)';
            ctx.fillRect(canvas.width/2 - 150, y - 30, 300, 60);
            ctx.strokeStyle = '#ffd700';
            ctx.lineWidth = 2;
            ctx.strokeRect(canvas.width/2 - 150, y - 30, 300, 60);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = 'bold 18px "Courier New", monospace';
            ctx.fillStyle = '#ffd700';
            ctx.fillText(`🏆 ${this.achievements[last.id].name}`, canvas.width/2, y);
            ctx.restore();
        }
    }
}

// Отслеживаем убийства врагов (если Enemy уже определён)
if (typeof Enemy !== 'undefined') {
    const originalTakeDamage = Enemy.prototype.takeDamage;
    Enemy.prototype.takeDamage = function(damage) {
        originalTakeDamage.call(this, damage);
        
        if (!this.isAlive && window.game && window.game.achievements) {
            const ach = window.game.achievements;
            if (this.type === 'slime') ach.progress('slime_killer');
            if (this.type === 'boss') ach.unlock('hero');
        }
    };
}