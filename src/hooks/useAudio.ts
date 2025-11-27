import { useRef, useCallback } from 'react';

type SoundType = 'spin' | 'win' | 'click' | 'error' | 'tick';

interface AudioContextRef {
  context: AudioContext | null;
  gainNode: GainNode | null;
  enabled: boolean;
}

export function useAudio() {
  const audioRef = useRef<AudioContextRef>({
    context: null,
    gainNode: null,
    enabled: true,
  });

  const getAudioContext = useCallback(() => {
    if (!audioRef.current.context) {
      audioRef.current.context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioRef.current.gainNode = audioRef.current.context.createGain();
      audioRef.current.gainNode.connect(audioRef.current.context.destination);
      audioRef.current.gainNode.gain.value = 0.5; // Volume padrão 50%
    }
    return audioRef.current.context;
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (audioRef.current.gainNode) {
      audioRef.current.gainNode.gain.value = Math.max(0, Math.min(1, volume));
    }
  }, []);

  const setEnabled = useCallback((enabled: boolean) => {
    audioRef.current.enabled = enabled;
  }, []);

  const playSound = useCallback((type: SoundType) => {
    if (!audioRef.current.enabled) return;

    const ctx = getAudioContext();
    const gainNode = audioRef.current.gainNode!;

    let oscillator: OscillatorNode;
    let duration: number;

    switch (type) {
      case 'spin':
        // Som de rotação contínua (será interrompido manualmente)
        oscillator = ctx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
        duration = 4; // Duração da rotação
        break;

      case 'win':
        // Som de vitória (fanfarra)
        oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        duration = 0.2;
        break;

      case 'click':
        // Som de clique
        oscillator = ctx.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        duration = 0.05;
        break;

      case 'error':
        // Som de erro
        oscillator = ctx.createOscillator();
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(150, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);
        duration = 0.3;
        break;

      case 'tick':
        // Som de tick (quando a roleta passa por um segmento)
        oscillator = ctx.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        duration = 0.02;
        break;

      default:
        return;
    }

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    
    if (type === 'win') {
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    } else if (type === 'spin') {
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    } else {
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    }

    oscillator.connect(gain);
    gain.connect(gainNode);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);

    return oscillator;
  }, [getAudioContext]);

  const playSpinSound = useCallback(() => {
    if (!audioRef.current.enabled) return null;
    
    const ctx = getAudioContext();
    const gainNode = audioRef.current.gainNode!;
    
    // Som de rotação com variação de frequência
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);
    oscillator.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 2);
    oscillator.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 3.5);
    
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 2);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 4);
    
    oscillator.connect(gain);
    gain.connect(gainNode);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 4);
    
    return oscillator;
  }, [getAudioContext]);

  const playWinSound = useCallback(() => {
    if (!audioRef.current.enabled) return;
    
    const ctx = getAudioContext();
    const gainNode = audioRef.current.gainNode!;
    
    // Fanfarra de vitória (3 notas)
    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.15 }, // E5
      { freq: 783.99, time: 0.3 },  // G5
    ];
    
    notes.forEach((note) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      
      gain.gain.setValueAtTime(0.4, ctx.currentTime + note.time);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + 0.4);
      
      oscillator.connect(gain);
      gain.connect(gainNode);
      
      oscillator.start(ctx.currentTime + note.time);
      oscillator.stop(ctx.currentTime + note.time + 0.4);
    });
  }, [getAudioContext]);

  const playTickSound = useCallback(() => {
    if (!audioRef.current.enabled) return;
    
    const ctx = getAudioContext();
    const gainNode = audioRef.current.gainNode!;
    
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);
    
    oscillator.connect(gain);
    gain.connect(gainNode);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }, [getAudioContext]);

  return {
    playSound,
    playSpinSound,
    playWinSound,
    playTickSound,
    setVolume,
    setEnabled,
    isEnabled: audioRef.current.enabled,
  };
}

