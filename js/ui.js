// ui.js - ИНТЕРФЕЙС (С КНОПКАМИ ДЛЯ ТЕЛЕФОНА)

class UI {
    static init() {
        UI.canvas = document.getElementById('gameCanvas');
        UI.ctx = UI.canvas.getContext('2d');
        UI.showTouchControls = 'ontouchstart' in window;
        console.log('📱 Телефонный режим:', UI.showTouchControls);
    }
    
    static render(player, level, score) {
        if (!player) return;
        
        const ctx = UI.ctx;
        const canvas = UI.canvas;
        const w = canvas.width;
        const h = canvas.height;
        
        // ====== ВЕРХНЯЯ ПАНЕЛЬ ======
        const panelHeight = 50;
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(0, 0, w, panelHeight);
        ctx.fillStyle = 'rgba(255,255,255,0.05)';
        ctx.fillRect(0, panelHeight - 2, w, 2);
        
        const fontSize = Math.max(14, Math.min(20, w / 40));
        ctx.font = `bold ${fontSize}px "Courier New", monospace`;
        ctx.textBaseline = 'middle';
        
        ctx.textAlign = 'left';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`🏫 ${level + 1}`, 15, panelHeight / 2);
        
        ctx.textAlign = 'center';
        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        ctx.fillText('✨ Аня ✨', w / 2, panelHeight / 2);
        
        ctx.textAlign = 'right';
        ctx.fillStyle = '#4ADE80';
        ctx.fillText(`⭐ ${score}`, w - 15, panelHeight / 2);
        
        const healthSize = Math.max(16, Math.min(22, w / 35));
        ctx.font = `${healthSize}px "Courier New", monospace`;
        let healthText = '';
        for (let i = 0; i < player.maxHealth; i++) {
            healthText += i < player.health ? '❤️' : '🖤';
        }
        ctx.textAlign = 'right';
        ctx.fillText(healthText, w - 80, panelHeight / 2);
        
        // ====== ТЕЛЕФОН: ВИРТУАЛЬНЫЕ КНОПКИ ======
        if (UI.showTouchControls) {
            const btnSize = Math.min(w / 6, h / 8, 80);
            const padding = 15;
            const bottomY = h - btnSize - padding;
            
            // ====== КНОПКА ВЛЕВО ======
            const leftX = padding;
            ctx.fillStyle = Input.touches['left'] ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(leftX + btnSize/2, bottomY + btnSize/2, btnSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(leftX + btnSize/2, bottomY + btnSize/2, btnSize/2 - 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = `${btnSize * 0.5}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('◀', leftX + btnSize/2, bottomY + btnSize/2 + 2);
            
            // ====== КНОПКА ВПРАВО ======
            const rightX = w - padding - btnSize;
            ctx.fillStyle = Input.touches['right'] ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)';
            ctx.beginPath();
            ctx.arc(rightX + btnSize/2, bottomY + btnSize/2, btnSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,255,255,0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(rightX + btnSize/2, bottomY + btnSize/2, btnSize/2 - 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,255,255,0.6)';
            ctx.font = `${btnSize * 0.5}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('▶', rightX + btnSize/2, bottomY + btnSize/2 + 2);
            
            // ====== КНОПКА ПРЫЖОК (ЦЕНТР) ======
            const jumpSize = btnSize * 0.7;
            const jumpX = w / 2 - jumpSize / 2;
            const jumpY = h - jumpSize - padding - 10;
            
            // Фон кнопки прыжка
            ctx.fillStyle = Input.touches['jump'] ? 'rgba(255,215,0,0.5)' : 'rgba(255,215,0,0.25)';
            ctx.beginPath();
            ctx.roundRect(jumpX, jumpY, jumpSize, jumpSize, 10);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,215,0,0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(jumpX, jumpY, jumpSize, jumpSize, 10);
            ctx.stroke();
            
            // Стрелка вверх
            ctx.fillStyle = 'rgba(255,215,0,0.9)';
            ctx.font = `${jumpSize * 0.6}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⬆', jumpX + jumpSize/2, jumpY + jumpSize/2 + 2);
            
            // Подпись "ПРЫЖОК"
            ctx.fillStyle = 'rgba(255,215,0,0.3)';
            ctx.font = `${jumpSize * 0.2}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('ПРЫЖОК', jumpX + jumpSize/2, jumpY + jumpSize + 2);
            
            // ====== КНОПКА АТАКИ ======
            const atkSize = btnSize * 0.8;
            const atkX = w - padding - atkSize - 10;
            const atkY = bottomY - atkSize - 10;
            ctx.fillStyle = Input.touches['attack'] ? 'rgba(255,50,50,0.5)' : 'rgba(255,50,50,0.2)';
            ctx.beginPath();
            ctx.arc(atkX + atkSize/2, atkY + atkSize/2, atkSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,50,50,0.4)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(atkX + atkSize/2, atkY + atkSize/2, atkSize/2 - 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(255,50,50,0.8)';
            ctx.font = `${atkSize * 0.5}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('⚔️', atkX + atkSize/2, atkY + atkSize/2 + 2);
            
            // Подпись "АТАКА"
            ctx.fillStyle = 'rgba(255,50,50,0.3)';
            ctx.font = `${atkSize * 0.2}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'top';
            ctx.fillText('АТАКА', atkX + atkSize/2, atkY + atkSize + 2);
        }
    }
    
    static showGameOver() {
        const ctx = UI.ctx;
        const canvas = UI.canvas;
        const w = canvas.width;
        const h = canvas.height;
        
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, w, h);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.min(48, w/15)}px "Courier New", monospace`;
        ctx.fillStyle = '#EF4444';
        ctx.fillText('💔 ИГРА ОКОНЧЕНА', w/2, h/2 - 40);
        ctx.font = `${Math.min(20, w/35)}px "Courier New", monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Нажми R, чтобы начать заново', w/2, h/2 + 40);
        
        document.addEventListener('keydown', function restartHandler(e) {
            if (e.code === 'KeyR') {
                document.removeEventListener('keydown', restartHandler);
                location.reload();
            }
        });
    }
    
    static showVictory() {
        const ctx = UI.ctx;
        const canvas = UI.canvas;
        const w = canvas.width;
        const h = canvas.height;
        
        ctx.fillStyle = 'rgba(0,0,0,0.8)';
        ctx.fillRect(0, 0, w, h);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `bold ${Math.min(48, w/15)}px "Courier New", monospace`;
        ctx.fillStyle = '#FFD700';
        ctx.fillText('🎉 ПОБЕДА!', w/2, h/2 - 60);
        ctx.font = `${Math.min(24, w/30)}px "Courier New", monospace`;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillText('Аня спасла школу! 🌟', w/2, h/2);
        ctx.font = `${Math.min(18, w/40)}px "Courier New", monospace`;
        ctx.fillStyle = '#4ADE80';
        ctx.fillText(`Очки: ${window.game ? window.game.player.score : 0}`, w/2, h/2 + 50);
    }
    
    static updateLevel(levelNumber) {
        console.log(`📖 Уровень ${levelNumber}`);
    }
}

// ====== roundRect для старых браузеров ======
if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (r > w/2) r = w/2;
        if (r > h/2) r = h/2;
        this.moveTo(x + r, y);
        this.lineTo(x + w - r, y);
        this.quadraticCurveTo(x + w, y, x + w, y + r);
        this.lineTo(x + w, y + h - r);
        this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
        this.lineTo(x + r, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - r);
        this.lineTo(x, y + r);
        this.quadraticCurveTo(x, y, x + r, y);
        return this;
    };
}