// save.js - Сохранение (упрощённое)

class SaveManager {
    static SAVE_KEY = 'school_adventure_save';
    
    static save(game) {
        try {
            const saveData = {
                level: game.currentLevel,
                score: game.player ? game.player.score : 0,
                health: game.player ? game.player.health : 5,
                timestamp: Date.now()
            };
            localStorage.setItem(SaveManager.SAVE_KEY, JSON.stringify(saveData));
            return true;
        } catch (e) {
            return false;
        }
    }
    
    static load() {
        try {
            const data = localStorage.getItem(SaveManager.SAVE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            return null;
        }
    }
    
    static hasSave() {
        return !!localStorage.getItem(SaveManager.SAVE_KEY);
    }
    
    static delete() {
        localStorage.removeItem(SaveManager.SAVE_KEY);
    }
}

// Добавляем сохранение в игру (если Game уже определён)
if (typeof Game !== 'undefined') {
    const originalUpdate = Game.prototype.update;
    Game.prototype.update = function() {
        originalUpdate.call(this);
        if (this.frameCount % 300 === 0 && !this.isGameOver && !this.isVictory) {
            SaveManager.save(this);
        }
    };
}