import { safeExecute } from "../utils/Utilities.js";

export class SoundService {
  constructor() {
    this.sounds = {};
    this.isEnabled = this.loadSoundSetting();
    this.audioContext = null;
    this.initializeSounds();
  }

  initializeSounds() {
    return safeExecute(() => {
      // Создаем простые звуки с помощью Web Audio API
      this.createMergeSound();
      this.createGameOverSound();
      this.createVictorySound();
    }, "Ошибка при инициализации звуков");
  }

  createMergeSound() {
    // Звук соединения плиток - шуршание бумаги
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      audioContext.currentTime + 0.1
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      200,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.005,
      audioContext.currentTime + 0.1
    );

    this.sounds.merge = { oscillator, gainNode, filter, audioContext };
  }

  createGameOverSound() {
    // Грустный звук проигрыша
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      110,
      audioContext.currentTime + 0.5
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    this.sounds.gameOver = { oscillator, gainNode, filter, audioContext };
  }

  createVictorySound() {
    // Веселый победный звук фанфар
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.type = "square";
    oscillator1.frequency.setValueAtTime(523, audioContext.currentTime); // C5
    oscillator1.frequency.exponentialRampToValueAtTime(
      659,
      audioContext.currentTime + 0.1
    ); // E5
    oscillator1.frequency.exponentialRampToValueAtTime(
      784,
      audioContext.currentTime + 0.2
    ); // G5

    oscillator2.type = "triangle";
    oscillator2.frequency.setValueAtTime(261, audioContext.currentTime); // C4
    oscillator2.frequency.exponentialRampToValueAtTime(
      329,
      audioContext.currentTime + 0.1
    ); // E4
    oscillator2.frequency.exponentialRampToValueAtTime(
      392,
      audioContext.currentTime + 0.2
    ); // G4

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    this.sounds.victory = {
      oscillator1,
      oscillator2,
      gainNode,
      filter,
      audioContext,
    };
  }

  getAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
      } catch (error) {
        console.error("Web Audio API не поддерживается");
        return null;
      }
    }
    return this.audioContext;
  }

  playSound(soundName) {
    return safeExecute(() => {
      if (!this.isEnabled) return;

      const sound = this.sounds[soundName];
      if (!sound) return;

      const audioContext = this.getAudioContext();
      if (!audioContext) return;

      // Создаем новые узлы для каждого воспроизведения
      this.createSoundInstance(soundName);
    }, `Ошибка при воспроизведении звука ${soundName}`);
  }

  createSoundInstance(soundName) {
    const audioContext = this.getAudioContext();
    if (!audioContext) return;

    switch (soundName) {
      case "merge":
        this.playMergeSound(audioContext);
        break;
      case "gameOver":
        this.playGameOverSound(audioContext);
        break;
      case "victory":
        this.playVictorySound(audioContext);
        break;
    }
  }

  playMergeSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sawtooth";
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      50,
      audioContext.currentTime + 0.1
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(800, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(
      200,
      audioContext.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.01, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.1
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
  }

  playGameOverSound(audioContext) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(
      110,
      audioContext.currentTime + 0.5
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(400, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.5
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  }

  playVictorySound(audioContext) {
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    oscillator1.connect(filter);
    oscillator2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator1.type = "square";
    oscillator1.frequency.setValueAtTime(523, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(
      659,
      audioContext.currentTime + 0.1
    );
    oscillator1.frequency.exponentialRampToValueAtTime(
      784,
      audioContext.currentTime + 0.2
    );

    oscillator2.type = "triangle";
    oscillator2.frequency.setValueAtTime(261, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(
      329,
      audioContext.currentTime + 0.1
    );
    oscillator2.frequency.exponentialRampToValueAtTime(
      392,
      audioContext.currentTime + 0.2
    );

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1000, audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.3);
    oscillator2.stop(audioContext.currentTime + 0.3);
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    this.saveSoundSetting();
    return this.isEnabled;
  }

  isSoundEnabled() {
    return this.isEnabled;
  }

  loadSoundSetting() {
    try {
      const saved = localStorage.getItem("stock101_sound_enabled");
      return saved === null ? true : JSON.parse(saved);
    } catch (error) {
      return true;
    }
  }

  saveSoundSetting() {
    try {
      localStorage.setItem(
        "stock101_sound_enabled",
        JSON.stringify(this.isEnabled)
      );
    } catch (error) {
      console.warn("Не удалось сохранить настройку звука");
    }
  }

  destroy() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.sounds = {};
  }
}
