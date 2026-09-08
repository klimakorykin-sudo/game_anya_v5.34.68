// animation.js - Система анимаций для спрайтов

class SpriteSheet {
    constructor(spriteData) {
        this.frames = spriteData.frames || [];
        this.frameWidth = spriteData.frameWidth || 32;
        this.frameHeight = spriteData.frameHeight || 32;
        this.totalFrames = this.frames.length;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameDelay = spriteData.frameDelay || 8;
        this.isPlaying = false;
        this.loop = spriteData.loop !== undefined ? spriteData.loop : true;
        this.onComplete = spriteData.onComplete || null;
        this.pixelData = spriteData.pixels || [];
    }
    
    play() {
        this.isPlaying = true;
        this.currentFrame = 0;
        this.frameTimer = 0;
    }
    
    stop() {
        this.isPlaying = false;
    }
    
    update() {
        if (!this.isPlaying) return;
        
        this.frameTimer++;
        if (this.frameTimer >= this.frameDelay) {
            this.frameTimer = 0;
            this.currentFrame++;
            if (this.currentFrame >= this.totalFrames) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.isPlaying = false;
                    if (this.onComplete) this.onComplete();
                }
            }
        }
    }
    
    getCurrentFrame() {
        return this.frames[this.currentFrame] || this.frames[0];
    }
    
    render(ctx, x, y, scale = 2) {
        const frame = this.getCurrentFrame();
        if (!frame) return;
        
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        
        // Рисуем пиксели
        const pixelSize = scale;
        frame.forEach((row, rowIndex) => {
            row.forEach((color, colIndex) => {
                if (color && color !== 'transparent') {
                    ctx.fillStyle = color;
                    ctx.fillRect(
                        x + colIndex * pixelSize,
                        y + rowIndex * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            });
        });
        
        ctx.restore();
    }
}

// Пиксельные спрайты Ани
class PlayerSprites {
    static idle() {
        return new SpriteSheet({
            frameWidth: 16,
            frameHeight: 20,
            frameDelay: 10,
            frames: [
                [
                    ['transparent','transparent','transparent','#8b4513','#8b4513','#8b4513','#8b4513','transparent','transparent','#8b4513','#8b4513','#8b4513','#8b4513','transparent','transparent','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#8b4513','#8b4513','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#8b4513','#8b4513','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#2d3436','#2d3436','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#2d3436','#2d3436','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#2d3436','#2d3436','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#2d3436','#2d3436','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent'],
                    ['transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#2d3436','#2d3436','transparent','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','transparent','#2d3436','#2d3436','transparent'],
                    ['transparent','#2d3436','#2d3436','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','#2d3436','#2d3436','transparent']
                ]
            ]
        });
    }
    
    static walk() {
        return new SpriteSheet({
            frameWidth: 16,
            frameHeight: 20,
            frameDelay: 8,
            frames: [
                // Кадр 1 - правая нога вперёд
                [
                    ['transparent','transparent','transparent','#8b4513','#8b4513','#8b4513','#8b4513','transparent','transparent','#8b4513','#8b4513','#8b4513','#8b4513','transparent','transparent','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#8b4513','#8b4513','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#8b4513','#8b4513','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#2d3436','#2d3436','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#2d3436','#2d3436','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#2d3436','#2d3436','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#2d3436','#2d3436','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent'],
                    ['transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#2d3436','#2d3436','transparent','transparent','transparent','#2d3436','#2d3436','#2d3436','#2d3436','transparent','transparent','transparent','transparent','transparent','transparent'],
                    ['transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','#2d3436','#2d3436','transparent']
                ],
                // Кадр 2 - левая нога вперёд
                [
                    ['transparent','transparent','transparent','#8b4513','#8b4513','#8b4513','#8b4513','transparent','transparent','#8b4513','#8b4513','#8b4513','#8b4513','transparent','transparent','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#8b4513','#8b4513','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#8b4513','#8b4513','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#2d3436','#2d3436','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#2d3436','#2d3436','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#8b4513','#2d3436','#2d3436','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#2d3436','#2d3436','#8b4513','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent'],
                    ['transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','#ffcd94','#ffcd94','#ffcd94','transparent','transparent','#ff6b6b','#ff6b6b','#ff6b6b','#ff6b6b','transparent','transparent','#ffcd94','#ffcd94','#ffcd94','transparent'],
                    ['transparent','transparent','transparent','transparent','transparent','transparent','#2d3436','#2d3436','#2d3436','#2d3436','transparent','transparent','transparent','#2d3436','#2d3436','transparent'],
                    ['transparent','#2d3436','#2d3436','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent','transparent']
                ]
            ]
        });
    }
}

// Используем анимации в игре
const originalRenderPlayer = Player.prototype.render;
Player.prototype.render = function(ctx, camera) {
    const x = this.x - camera.x;
    const y = this.y - camera.y;
    
    // Создаём анимацию если её нет
    if (!this.sprite) {
        this.sprite = this.isMoving ? PlayerSprites.walk() : PlayerSprites.idle();
        this.sprite.play();
    }
    
    // Обновляем анимацию
    this.sprite.update();
    
    // Меняем анимацию при движении
    if (this.isMoving && this.sprite.totalFrames < 2) {
        this.sprite = PlayerSprites.walk();
        this.sprite.play();
    } else if (!this.isMoving && this.sprite.totalFrames > 1) {
        this.sprite = PlayerSprites.idle();
        this.sprite.play();
    }
    
    // Рисуем спрайт с отражением
    ctx.save();
    if (this.facing < 0) {
        ctx.translate(x + 32, 0);
        ctx.scale(-1, 1);
        this.sprite.render(ctx, -32, y);
    } else {
        this.sprite.render(ctx, x, y);
    }
    ctx.restore();
    
    // Полоска здоровья
    this.drawHealthBar(ctx, x, y);
};