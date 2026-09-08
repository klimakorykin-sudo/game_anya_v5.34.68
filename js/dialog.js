// dialog.js - Диалоги (упрощённые, без ошибок)

class Dialog {
    constructor(data) {
        this.lines = data.lines || [{ text: data.text || '', character: data.character || 'Аня' }];
        this.currentLine = 0;
        this.isActive = false;
        this.onComplete = data.onComplete || null;
        this.choices = data.choices || [];
        this.character = data.character || 'Аня';
        this.fullText = '';
        this.displayText = '';
        this.charIndex = 0;
        this.isTyping = false;
        this.textTimer = 0;
        this.showingChoices = false;
    }
    
    start() {
        this.isActive = true;
        this.currentLine = 0;
        this.loadLine();
    }
    
    loadLine() {
        if (this.currentLine >= this.lines.length) {
            this.end();
            return;
        }
        const line = this.lines[this.currentLine];
        this.fullText = line.text || '';
        this.character = line.character || this.character;
        this.choices = line.choices || [];
        this.charIndex = 0;
        this.displayText = '';
        this.isTyping = true;
        this.textTimer = 0;
        this.showingChoices = false;
        SoundManager.play('dialog');
    }
    
    update() {
        if (!this.isActive) return;
        if (this.isTyping) {
            this.textTimer++;
            if (this.textTimer % 2 === 0) {
                this.charIndex++;
                this.displayText = this.fullText.substring(0, this.charIndex);
                if (this.charIndex >= this.fullText.length) {
                    this.isTyping = false;
                    if (this.choices.length > 0) this.showingChoices = true;
                }
            }
        }
    }
    
    next() {
        if (this.isTyping) {
            this.displayText = this.fullText;
            this.charIndex = this.fullText.length;
            this.isTyping = false;
            if (this.choices.length > 0) this.showingChoices = true;
            return;
        }
        if (this.showingChoices) return;
        this.currentLine++;
        this.loadLine();
    }
    
    makeChoice(index) {
        if (index >= 0 && index < this.choices.length) {
            if (this.choices[index].action) this.choices[index].action();
            this.showingChoices = false;
            this.currentLine++;
            this.loadLine();
        }
    }
    
    end() {
        this.isActive = false;
        if (this.onComplete) this.onComplete();
    }
    
    render(ctx, canvas) {
        if (!this.isActive) return;
        
        const dialogHeight = 150;
        const y = canvas.height - dialogHeight;
        ctx.fillStyle = 'rgba(0,0,0,0.85)';
        ctx.fillRect(0, y, canvas.width, dialogHeight);
        ctx.strokeStyle = 'rgba(255,215,0,0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(5, y + 5, canvas.width - 10, dialogHeight - 10);
        
        ctx.textAlign = 'left';
        ctx.font = 'bold 16px "Courier New", monospace';
        ctx.fillStyle = '#ffd700';
        ctx.fillText('✨ ' + this.character, 20, y + 30);
        
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.font = '18px "Courier New", monospace';
        ctx.fillStyle = '#ffffff';
        ctx.fillText(this.displayText, 20, y + 55);
        
        if (!this.isTyping && !this.showingChoices) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '14px "Courier New", monospace';
            ctx.textAlign = 'right';
            ctx.fillText('▶ Нажми пробел', canvas.width - 20, y + dialogHeight - 10);
        }
    }
}

// ====== НЕ ДОБАВЛЯЕМ МЕТОДЫ В Game, ЧТОБЫ НЕ БЫЛО ОШИБОК ======
// Просто оставляем класс Dialog, игра сама будет его использовать