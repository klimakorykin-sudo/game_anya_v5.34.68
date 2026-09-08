// sound.js - Звуки и музыка
class SoundManager {
    static sounds = {};
    static bgm = null;
    static currentBGM = null;
    static isMuted = false;
    
    static preload() {
        // Фоновая музыка
        const bgmList = ['bgm_1', 'bgm_2', 'bgm_3', 'bgm_4', 'bgm_5', 'boss'];
        bgmList.forEach(name => {
            SoundManager.sounds[name] = new Audio(`audio/${name}.mp3`);
            SoundManager.sounds[name].loop = true;
        });
        
        // Эффекты
        const sfxList = ['step', 'attack', 'hit', 'hurt', 'pickup', 'levelup', 'dialog', 'victory'];
        sfxList.forEach(name => {
            SoundManager.sounds[name] = new Audio(`audio/${name}.wav`);
        });
    }
    
    static play(name) {
        if (SoundManager.isMuted) return;
        
        const sound = SoundManager.sounds[name];
        if (sound) {
            // Клонируем, чтобы можно было играть одновременно несколько звуков
            const clone = sound.cloneNode();
            clone.volume = 0.3;
            clone.play().catch(e => console.log('Audio error:', e));
        }
    }
    
    static playBGM(name) {
        if (SoundManager.isMuted) return;
        if (SoundManager.currentBGM === name) return;
        
        if (SoundManager.bgm) {
            SoundManager.bgm.pause();
        }
        
        const bgm = SoundManager.sounds[name];
        if (bgm) {
            bgm.currentTime = 0;
            bgm.volume = 0.2;
            bgm.play().catch(e => console.log('BGM error:', e));
            SoundManager.bgm = bgm;
            SoundManager.currentBGM = name;
        }
    }
    
    static stopBGM() {
        if (SoundManager.bgm) {
            SoundManager.bgm.pause();
            SoundManager.bgm.currentTime = 0;
            SoundManager.currentBGM = null;
        }
    }
    
    static toggleMute() {
        SoundManager.isMuted = !SoundManager.isMuted;
        if (SoundManager.isMuted) {
            SoundManager.stopBGM();
        } else if (SoundManager.currentBGM) {
            SoundManager.playBGM(SoundManager.currentBGM);
        }
    }
}