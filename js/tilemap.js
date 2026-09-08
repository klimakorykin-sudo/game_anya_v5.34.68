// tilemap.js - БОЛЬШАЯ КАРТА (чтобы игра была по всему экрану)

class TileMap {
    constructor(data) {
        this.tiles = data;
        this.rows = data.length;
        this.cols = data[0].length;
        this.tileSize = CONFIG.TILE_SIZE;
    }
    
    getTile(col, row) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            return 2; // Стена за границами
        }
        return this.tiles[row][col];
    }
    
    isSolid(col, row) {
        return this.getTile(col, row) === 2;
    }
    
    isWalkable(col, row) {
        return this.getTile(col, row) === 1 || this.getTile(col, row) === 0;
    }
    
    collidesWithRect(x, y, width, height) {
        const left = Math.floor(x / this.tileSize);
        const right = Math.floor((x + width - 1) / this.tileSize);
        const top = Math.floor(y / this.tileSize);
        const bottom = Math.floor((y + height - 1) / this.tileSize);
        
        for (let row = top; row <= bottom; row++) {
            for (let col = left; col <= right; col++) {
                if (this.isSolid(col, row)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    moveAndCollide(entity) {
        // Движение по X
        entity.x += entity.vx;
        if (this.collidesWithRect(entity.x, entity.y, entity.width, entity.height)) {
            entity.x -= entity.vx;
            entity.vx = 0;
        }
        
        // Движение по Y
        entity.y += entity.vy;
        if (this.collidesWithRect(entity.x, entity.y, entity.width, entity.height)) {
            entity.y -= entity.vy;
            entity.vy = 0;
            entity.isGrounded = true;
        } else {
            entity.isGrounded = false;
        }
        
        // Защита от выпадения за пределы карты
        const maxX = this.cols * this.tileSize - entity.width;
        const maxY = this.rows * this.tileSize - entity.height;
        entity.x = Math.max(0, Math.min(entity.x, maxX));
        entity.y = Math.max(0, Math.min(entity.y, maxY));
    }
    
    render(ctx, camera) {
        const startCol = Math.floor(camera.x / this.tileSize);
        const endCol = Math.ceil((camera.x + CONFIG.CANVAS_WIDTH) / this.tileSize);
        const startRow = Math.floor(camera.y / this.tileSize);
        const endRow = Math.ceil((camera.y + CONFIG.CANVAS_HEIGHT) / this.tileSize);
        
        // Рисуем только видимые тайлы
        for (let row = Math.max(0, startRow); row < Math.min(endRow, this.rows); row++) {
            for (let col = Math.max(0, startCol); col < Math.min(endCol, this.cols); col++) {
                const tile = this.getTile(col, row);
                if (tile === 0) continue; // Пустота
                
                const x = col * this.tileSize - camera.x;
                const y = row * this.tileSize - camera.y;
                
                switch(tile) {
                    case 1: // ПОЛ (зелёный с текстурой)
                        const shade = ((col + row) % 2 === 0) ? '#4A7C59' : '#3D6B4E';
                        ctx.fillStyle = shade;
                        ctx.fillRect(x, y, this.tileSize, this.tileSize);
                        // Травинки
                        ctx.fillStyle = 'rgba(100,180,100,0.2)';
                        for (let i = 0; i < 3; i++) {
                            const gx = x + 4 + i * 10 + Math.sin(row * 2 + col) * 3;
                            const gy = y + this.tileSize - 4 - Math.sin(i * 3) * 2;
                            ctx.fillRect(gx, gy, 1, 3 + Math.sin(row + i) * 2);
                        }
                        break;
                        
                    case 2: // СТЕНА (кирпичи)
                        ctx.fillStyle = '#4A3728';
                        ctx.fillRect(x, y, this.tileSize, this.tileSize);
                        ctx.strokeStyle = '#3D2B1F';
                        ctx.lineWidth = 1;
                        // Горизонтальные линии
                        ctx.beginPath();
                        ctx.moveTo(x, y + this.tileSize/2);
                        ctx.lineTo(x + this.tileSize, y + this.tileSize/2);
                        ctx.stroke();
                        // Вертикальные линии
                        ctx.beginPath();
                        ctx.moveTo(x + this.tileSize/2, y);
                        ctx.lineTo(x + this.tileSize/2, y + this.tileSize/2);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x + this.tileSize/4, y + this.tileSize/2);
                        ctx.lineTo(x + this.tileSize/4, y + this.tileSize);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x + this.tileSize*3/4, y + this.tileSize/2);
                        ctx.lineTo(x + this.tileSize*3/4, y + this.tileSize);
                        ctx.stroke();
                        // Светлый блик
                        ctx.fillStyle = 'rgba(255,255,255,0.05)';
                        ctx.fillRect(x, y, this.tileSize, 2);
                        break;
                        
                    case 3: // СТОЛ
                        ctx.fillStyle = '#8B5E3C';
                        ctx.fillRect(x + 2, y + 10, this.tileSize - 4, this.tileSize - 12);
                        ctx.fillStyle = '#6B4423';
                        ctx.fillRect(x + 4, y + 8, this.tileSize - 8, 4);
                        ctx.fillRect(x + 6, y + 20, 4, 10);
                        ctx.fillRect(x + this.tileSize - 10, y + 20, 4, 10);
                        break;
                        
                    default:
                        ctx.fillStyle = '#FF6B6B';
                        ctx.fillRect(x, y, this.tileSize, this.tileSize);
                }
            }
        }
    }
}