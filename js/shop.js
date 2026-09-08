// shop.js - Магазин (БЕЗ ОШИБОК)

class Shop {
    constructor() {
        this.items = [
            { id: 'hp_up', name: '💖 +1 здоровье', price: 50, level: 0, maxLevel: 3 },
            { id: 'speed_up', name: '💨 +скорость', price: 75, level: 0, maxLevel: 3 }
        ];
        this.isOpen = false;
        this.selectedItem = 0;
        this.currency = 0;
    }
    
    buy(index) {
        const item = this.items[index];
        if (!item || item.level >= item.maxLevel) return false;
        if (this.currency < item.price) return false;
        
        this.currency -= item.price;
        item.level++;
        
        const player = window.game ? window.game.player : null;
        if (player) {
            if (item.id === 'hp_up') {
                player.maxHealth += 1;
                player.health = Math.min(player.health + 1, player.maxHealth);
            }
            if (item.id === 'speed_up') {
                player.speed += 0.3;
            }
        }
        SoundManager.play('pickup');
        return true;
    }
    
    render(ctx, canvas) {
        if (!this.isOpen) return;
        
        // Затемнение
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Заголовок
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.font = 'bold 32px "Courier New", monospace';
        ctx.fillStyle = '#FFD700';
        ctx.fillText('🏪 МАГАЗИН', canvas.width/2, 20);
        
        // Валюта
        ctx.font = '18px "Courier New", monospace';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`⭐ ${this.currency} очков`, canvas.width/2, 70);
        
        // Список товаров
        let y = 120;
        this.items.forEach((item, index) => {
            const isSelected = index === this.selectedItem;
            
            // Фон выбранного
            if (isSelected) {
                ctx.fillStyle = 'rgba(255,215,0,0.15)';
                ctx.fillRect(40, y - 15, canvas.width - 80, 40);
            }
            
            // Название
            ctx.textAlign = 'left';
            ctx.font = '18px "Courier New", monospace';
            ctx.fillStyle = item.level >= item.maxLevel ? '#666688' : '#FFFFFF';
            ctx.fillText(item.name, 60, y);
            
            // Цена
            ctx.textAlign = 'right';
            const canBuy = this.currency >= item.price && item.level < item.maxLevel;
            ctx.fillStyle = canBuy ? '#FFD700' : '#666688';
            ctx.fillText(item.level >= item.maxLevel ? 'MAX' : `${item.price}⭐`, canvas.width - 60, y);
            
            // Звёзды уровня
            ctx.textAlign = 'center';
            ctx.fillStyle = '#8888AA';
            ctx.font = '14px "Courier New", monospace';
            let stars = '';
            for (let i = 0; i < item.maxLevel; i++) {
                stars += i < item.level ? '⭐' : '☆';
            }
            ctx.fillText(stars, canvas.width/2, y + 22);
            
            y += 50;
        });
        
        // Управление
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        ctx.font = '14px "Courier New", monospace';
        ctx.fillStyle = 'rgba(255,255,255,0.5)';
        ctx.fillText('↑↓ Выбор | Пробел Купить | ESC Выйти', canvas.width/2, canvas.height - 20);
    }
}

// ====== НЕ ДОБАВЛЯЕМ МЕТОДЫ В Game, ЧТОБЫ НЕ БЫЛО ОШИБОК ======
// Вместо этого игра сама будет использовать класс Shop
// В main.js уже есть: this.shop = new Shop();