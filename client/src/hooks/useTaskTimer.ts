import { useState, useEffect } from 'react';
import { Task } from '@/lib/storage';

interface TimerInfo {
  timeRemaining: number; // em segundos
  timeElapsed: number; // em segundos
  isActive: boolean;
  percentage: number; // 0-100
}

/**
 * Hook para gerenciar o timer de uma tarefa
 * Calcula tempo decorrido e tempo restante
 */
export function useTaskTimer(task: Task | null): TimerInfo {
  const [timerInfo, setTimerInfo] = useState<TimerInfo>({
    timeRemaining: 0,
    timeElapsed: 0,
    isActive: false,
    percentage: 0,
  });

  useEffect(() => {
    if (!task || task.status !== 'in-progress') {
      setTimerInfo({
        timeRemaining: 0,
        timeElapsed: 0,
        isActive: false,
        percentage: 0,
      });
      return;
    }

    const updateTimer = () => {
      const now = new Date();
      const currentTimeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const currentTime = now;

      // Converter startTime e endTime para minutos
      const [startHour, startMin] = task.startTime.split(':').map(Number);
      const [endHour, endMin] = task.endTime.split(':').map(Number);

      const startDate = new Date();
      startDate.setHours(startHour, startMin, 0, 0);

      const endDate = new Date();
      endDate.setHours(endHour, endMin, 0, 0);

      // Se a hora de término é menor que a de início, assume que é no dia seguinte
      if (endDate < startDate) {
        endDate.setDate(endDate.getDate() + 1);
      }

      const timeElapsed = Math.max(0, Math.floor((currentTime.getTime() - startDate.getTime()) / 1000));
      const totalDuration = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);
      const timeRemaining = Math.max(0, totalDuration - timeElapsed);

      const percentage = totalDuration > 0 ? Math.min(100, (timeElapsed / totalDuration) * 100) : 0;

      setTimerInfo({
        timeRemaining,
        timeElapsed,
        isActive: true,
        percentage,
      });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [task]);

  return timerInfo;
}

/**
 * Converter segundos para formato HH:MM:SS
 */
export function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}
