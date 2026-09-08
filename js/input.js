// input.js - УПРАВЛЕНИЕ (КЛАВИАТУРА + ТЕЛЕФОН)

class Input {
    static keys = {};
    static touches = {};
    static touchStartX = 0;
    static touchStartY = 0;
    static isTouching = false;
    static touchMoved = false;
    
    static init() {
        // ====== КЛАВИАТУРА ======
        document.addEventListener('keydown', (e) => {
            Input.keys[e.code] = true;
            if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
        document.addEventListener('keyup', (e) => {
            Input.keys[e.code] = false;
        });
        
        // ====== ТЕЛЕФОН (ТАЧ) ======
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        // Начало касания
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = (touch.clientY - rect.top) / rect.height;
            
            Input.touchStartX = x;
            Input.touchStartY = y;
            Input.isTouching = true;
            Input.touchMoved = false;
            
            // ОБРАБАТЫВАЕМ КАСАНИЕ
            Input.handleTouch(x, y);
        }, { passive: false });
        
        // Движение пальца
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            if (!touch) return;
            
            const rect = canvas.getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = (touch.clientY - rect.top) / rect.height;
            
            const dx = x - Input.touchStartX;
            const dy = y - Input.touchStartY;
            if (Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05) {
                Input.touchMoved = true;
            }
            
            Input.handleTouch(x, y);
        }, { passive: false });
        
        // Конец касания
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            Input.isTouching = false;
            
            // Если это был тап (не свайп) — атака
            if (!Input.touchMoved && Input.touchStartX !== undefined) {
                // ПРОВЕРЯЕМ, НЕ БЫЛО ЛИ КАСАНИЕ КНОПКИ ПРЫЖКА
                const rect = canvas.getBoundingClientRect();
                const w = rect.width;
                const h = rect.height;
                const btnSize = Math.min(w / 6, h / 8, 80);
                const padding = 15;
                const jumpSize = btnSize * 0.7;
                const jumpX = w / 2 - jumpSize / 2;
                const jumpY = h - jumpSize - padding - 10;
                
                // Координаты касания в пикселях
                const touchX = Input.touchStartX * w;
                const touchY = Input.touchStartY * h;
                
                // Если тап был на кнопке прыжка — НЕ АТАКУЕМ
                const isJumpButton = touchX >= jumpX && touchX <= jumpX + jumpSize &&
                                     touchY >= jumpY && touchY <= jumpY + jumpSize;
                
                // Если тап был на кнопке атаки — атакуем
                const atkSize = btnSize * 0.8;
                const atkX = w - padding - atkSize - 10;
                const atkY = h - btnSize - padding - atkSize - 10;
                const isAttackButton = touchX >= atkX && touchX <= atkX + atkSize &&
                                       touchY >= atkY && touchY <= atkY + atkSize;
                
                if (isAttackButton) {
                    Input.touches['attack'] = true;
                    setTimeout(() => { Input.touches['attack'] = false; }, 100);
                } else if (!isJumpButton) {
                    // Если не кнопка прыжка и не кнопка атаки — атака
                    Input.touches['attack'] = true;
                    setTimeout(() => { Input.touches['attack'] = false; }, 100);
                }
            }
            
            // Сбрасываем всё
            setTimeout(() => {
                Input.touches = {};
            }, 50);
        }, { passive: false });
        
        canvas.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            Input.isTouching = false;
            Input.touches = {};
        }, { passive: false });
    }
    
    static handleTouch(x, y) {
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) return;
        
        const rect = canvas.getBoundingClientRect();
        const w = rect.width;
        const h = rect.height;
        const btnSize = Math.min(w / 6, h / 8, 80);
        const padding = 15;
        const jumpSize = btnSize * 0.7;
        
        // Координаты кнопки прыжка в относительных величинах
        const jumpX = (w / 2 - jumpSize / 2) / w;
        const jumpY = (h - jumpSize - padding - 10) / h;
        const jumpW = jumpSize / w;
        const jumpH = jumpSize / h;
        
        // ====== ПРОВЕРКА КНОПКИ ПРЫЖКА ======
        const isJumpButton = x >= jumpX && x <= jumpX + jumpW &&
                             y >= jumpY && y <= jumpY + jumpH;
        
        // ====== ЛЕВАЯ ПОЛОВИНА = ВЛЕВО ======
        if (x < 0.33 && !isJumpButton) {
            Input.touches['left'] = true;
            Input.touches['right'] = false;
        }
        // ====== ПРАВАЯ ПОЛОВИНА = ВПРАВО ======
        else if (x > 0.66 && !isJumpButton) {
            Input.touches['right'] = true;
            Input.touches['left'] = false;
        }
        // ====== СЕРЕДИНА = СТОИМ ======
        else {
            Input.touches['left'] = false;
            Input.touches['right'] = false;
        }
        
        // ====== ПРЫЖОК (если нажата кнопка прыжка ИЛИ верхняя треть) ======
        if (isJumpButton || y < 0.33) {
            Input.touches['jump'] = true;
        } else {
            Input.touches['jump'] = false;
        }
        
        // ====== АТАКА (если нажата правая верхняя кнопка) ======
        const atkSize = btnSize * 0.8;
        const atkX = (w - padding - atkSize - 10) / w;
        const atkY = (h - btnSize - padding - atkSize - 10) / h;
        const atkW = atkSize / w;
        const atkH = atkSize / h;
        
        if (x >= atkX && x <= atkX + atkW && y >= atkY && y <= atkY + atkH) {
            Input.touches['attack'] = true;
            setTimeout(() => { Input.touches['attack'] = false; }, 100);
        }
    }
    
    // ====== УДОБНЫЕ ГЕТТЕРЫ ======
    static get isLeft() {
        return Input.keys['ArrowLeft'] || Input.keys['KeyA'] || Input.touches['left'] || false;
    }
    
    static get isRight() {
        return Input.keys['ArrowRight'] || Input.keys['KeyD'] || Input.touches['right'] || false;
    }
    
    static get isJump() {
        return Input.keys['ArrowUp'] || Input.keys['KeyW'] || Input.touches['jump'] || false;
    }
    
    static get isAttack() {
        return Input.keys['Space'] || Input.keys['KeyX'] || Input.touches['attack'] || false;
    }
    
    static isKeyDown(code) {
        return Input.keys[code] || false;
    }
    
    static isKeyPressed(code) {
        return Input.isKeyDown(code);
    }
    
    static isTouch(action) {
        return Input.touches[action] || false;
    }
}