import { useEffect, useRef, useCallback } from 'react';
import { Task } from '@/lib/storage';

interface AlarmConfig {
  enabled: boolean;
  soundUrl?: string;
  onAlarm?: (task: Task) => void;
}

export function useAlarms(tasks: Task[], config: AlarmConfig = { enabled: true }) {
  const alarmTriggeredRef = useRef<Set<string>>(new Set());
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Criar elemento de áudio para alarme
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      // Som de alarme padrão (usando Web Audio API para gerar um tom)
      audioRef.current.src = 'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA==';
    }
  }, []);

  const playAlarmSound = useCallback(() => {
    if (audioRef.current && config.soundUrl) {
      audioRef.current.src = config.soundUrl;
      audioRef.current.play().catch(err => console.error('Erro ao tocar alarme:', err));
    } else if (audioRef.current) {
      // Gerar tom de alarme com Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Frequência em Hz
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    }
  }, [config.soundUrl]);

  const triggerAlarm = useCallback((task: Task) => {
    if (!alarmTriggeredRef.current.has(task.id)) {
      alarmTriggeredRef.current.add(task.id);
      playAlarmSound();
      
      // Notificação visual
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(`Hora de começar: ${task.name}`, {
          body: `${task.startTime} - ${task.endTime}`,
          icon: '/icon.png',
        });
      }

      if (config.onAlarm) {
        config.onAlarm(task);
      }

      // Limpar após 1 minuto
      setTimeout(() => {
        alarmTriggeredRef.current.delete(task.id);
      }, 60000);
    }
  }, [playAlarmSound, config]);

  // Verificar alarmes a cada minuto
  useEffect(() => {
    if (!config.enabled) return;

    const checkAlarms = () => {
      const now = new Date();
      const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

      tasks.forEach(task => {
        if (task.status === 'not-started' && task.startTime === currentTime) {
          triggerAlarm(task);
        }
      });
    };

    checkAlarms();
    const interval = setInterval(checkAlarms, 60000);
    return () => clearInterval(interval);
  }, [tasks, config.enabled, triggerAlarm]);

  // Solicitar permissão para notificações
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return { triggerAlarm };
}
