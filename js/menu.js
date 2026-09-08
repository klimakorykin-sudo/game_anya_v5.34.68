// menu.js - МЕНЮ СОХРАНЕНИЙ

class SaveMenu {
    constructor() {
        this.isOpen = false;
        this.selectedSlot = 0;
        this.slots = ['slot1', 'slot2', 'slot3'];
        this.slotNames = {
            slot1: '💾 Слот 1',
            slot2: '💾 Слот 2',
            slot3: '💾 Слот 3'
        };
    }
    
    // ====== ОТКРЫТЬ МЕНЮ ======
    open() {
        this.isOpen = true;
        this.selectedSlot = 0;
        if (window.game) window.game.isPaused = true;
    }
    
    // ====== ЗАКРЫТЬ МЕНЮ ======
    close() {
        this.isOpen = false;
        if (window.game) window.game.isPaused = false;
    }
    
    // ====== ОБНОВЛЕНИЕ (обработка клавиш) ======
    update() {
        if (!this.isOpen) return;
        
        // Выбор слота
        if (Input.isKeyDown('ArrowDown') || Input.isKeyDown('KeyS')) {
            this.selectedSlot = (this.selectedSlot + 1) % 3;
            Input.keys['ArrowDown'] = false;
            Input.keys['KeyS'] = false;
        }
        if (Input.isKeyDown('ArrowUp') || Input.isKeyDown('KeyW')) {
            this.selectedSlot = (this.selectedSlot - 1 + 3) % 3;
            Input.keys['ArrowUp'] = false;
            Input.keys['KeyW'] = false;
        }
        
        // Сохранить (S)
        if (Input.isKeyDown('KeyS')) {
            this.saveCurrent();
            Input.keys['KeyS'] = false;
        }
        
        // Загрузить (L)
        if (Input.isKeyDown('KeyL')) {
            this.loadSelected();
            Input.keys['KeyL'] = false;
        }
        
        // Удалить (D)
        if (Input.isKeyDown('KeyD')) {
            this.deleteSelected();
            Input.keys['KeyD'] = false;
        }
        
        // Выйти (Escape)
        if (Input.isKeyDown('Escape')) {
            this.close();
            Input.keys['Escape'] = false;
        }
    }
    
    // ====== СОХРАНИТЬ ТЕКУЩУЮ ИГРУ ======
    saveCurrent() {
        const game = window.game;
        if (!game || !game.player) {
            alert('❌ Нет игры для сохранения!');
            return;
        }
        
        const slot = this.slots[this.selectedSlot];
        SaveManager.save(slot, {
            currentLevel: game.currentLevel,
            player: game.player
        });
        alert(`✅ Сохранено в ${this.slotNames[slot]}!`);
    }
    
    // ====== ЗАГРУЗИТЬ ИЗ СЛОТА ======
    loadSelected() {
        const slot = this.slots[this.selectedSlot];
        const save = SaveManager.load(slot);
        
        if (!save) {
            alert(`❌ В ${this.slotNames[slot]} нет сохранения!`);
            return;
        }
        
        const game = window.game;
        if (!game) return;
        
        // Загружаем уровень
        game.currentLevel = save.level;
        game.loadLevel(save.level);
        
        // Восстанавливаем здоровье и очки
        if (game.player) {
            game.player.health = save.health;
            game.player.maxHealth = save.maxHealth;
            game.player.score = save.score;
            if (save.abilities) {
                game.player.abilities = game.player.abilities || {};
                game.player.abilities.dash = { unlocked: save.abilities.dash || false, cooldown: 0 };
                game.player.abilities.shield = { unlocked: save.abilities.shield || false, cooldown: 0 };
            }
        }
        
        this.close();
        alert(`📂 Загружено из ${this.slotNames[slot]}!`);
    }
    
    // ====== УДАЛИТЬ СЛОТ ======
    deleteSelected() {
        const slot = this.slots[this.selectedSlot];
        if (!SaveManager.hasSave(slot)) {
            alert(`❌ В ${this.slotNames[slot]} нет сохранения!`);
            return;
        }
        
        if (confirm(`🗑️ Удалить ${this.slotNames[slot]}?`)) {
            SaveManager.deleteSlot(slot);
            alert(`✅ ${this.slotNames[slot]} удалён!`);
        }
    }
    
    // ====== ОТРИСОВКА МЕНЮ ======
    render(ctx, canvas) {
        if (!this.isOpen) return;
        
        const w = canvas.width;
        const h = canvas.height;
        
        // Затемнение
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, w, h);
        
        // Заголовок
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 40px "Courier New", monospace';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('💾 УПРАВЛЕНИЕ СОХРАНЕНИЯМИ', w/2, 30);
        
        // Подзаголовок
        ctx.font = '18px "Courier New", monospace';
        ctx.fillStyle = '#8888AA';
        ctx.fillText('Выбери слот и нажми:', w/2, 90);
        ctx.fillStyle = '#4ADE80';
        ctx.fillText('S — Сохранить  |  L — Загрузить  |  D — Удалить  |  ESC — Выйти', w/2, 120);
        
        // Список слотов
        let y = 180;
        this.slots.forEach((slot, index) => {
            const isSelected = index === this.selectedSlot;
            const saveInfo = SaveManager.getSaveInfo(slot);
            const hasSave = saveInfo !== null;
            
            // Фон слота
            if (isSelected) {
                ctx.fillStyle = 'rgba(255,215,0,0.15)';
                ctx.fillRect(50, y - 15, w - 100, 60);
                ctx.strokeStyle = '#FFD700';
                ctx.lineWidth = 2;
                ctx.strokeRect(50, y - 15, w - 100, 60);
            } else {
                ctx.fillStyle = 'rgba(255,255,255,0.05)';
                ctx.fillRect(50, y - 15, w - 100, 60);
            }
            
            // Имя слота
            ctx.textAlign = 'left';
            ctx.textBaseline = 'middle';
            ctx.font = isSelected ? 'bold 24px "Courier New", monospace' : '20px "Courier New", monospace';
            ctx.fillStyle = isSelected ? '#FFD700' : '#FFFFFF';
            ctx.fillText(this.slotNames[slot], 80, y + 15);
            
            // Информация о сохранении
            if (hasSave) {
                ctx.textAlign = 'left';
                ctx.font = '16px "Courier New", monospace';
                ctx.fillStyle = '#4ADE80';
                ctx.fillText(`📂 Уровень ${saveInfo.level}  |  ⭐ ${saveInfo.score} очков  |  ❤️ ${saveInfo.health}/${saveInfo.maxHealth}`, 280, y + 15);
                ctx.fillStyle = '#8888AA';
                ctx.font = '14px "Courier New", monospace';
                ctx.fillText(`📅 ${saveInfo.date}`, 280, y + 38);
            } else {
                ctx.textAlign = 'left';
                ctx.font = '16px "Courier New", monospace';
                ctx.fillStyle = '#666688';
                ctx.fillText('📭 Пусто', 280, y + 15);
            }
            
            // Стрелка выбора
            if (isSelected) {
                ctx.textAlign = 'center';
                ctx.font = '24px "Courier New", monospace';
                ctx.fillStyle = '#FFD700';
                ctx.fillText('▶', 40, y + 15);
            }
            
            y += 70;
        });
        
        // Подсказки
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillText('↑↓ — Выбор слота  |  ESC — Выйти', w/2, h - 20);
    }
}