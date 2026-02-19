import { useState, useEffect, useCallback } from 'react';
import { Task, getTasks, addTask, updateTask, deleteTask, getTasksByDate, getCurrentTask, getNextTask } from '@/lib/storage';

export function useTasks(date: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);

  // Carregar tarefas do localStorage
  useEffect(() => {
    const loadTasks = () => {
      const dayTasks = getTasksByDate(date);
      setTasks(dayTasks);
    };

    loadTasks();
    // Recarregar a cada minuto para atualizar tarefas atuais
    const interval = setInterval(loadTasks, 60000);
    return () => clearInterval(interval);
  }, [date]);

  // Atualizar tarefa atual e próxima
  useEffect(() => {
    const updateCurrentTasks = () => {
      const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setCurrentTask(getCurrentTask(date, now));
      setNextTask(getNextTask(date, now));
    };

    updateCurrentTasks();
    const interval = setInterval(updateCurrentTasks, 60000);
    return () => clearInterval(interval);
  }, [date]);

  const createTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = addTask(taskData);
    setTasks(prev => [...prev, newTask].sort((a, b) => a.startTime.localeCompare(b.startTime)));
    return newTask;
  }, []);

  const updateTaskStatus = useCallback((id: string, status: Task['status']) => {
    const updated = updateTask(id, { status });
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    }
    return updated;
  }, []);

  const removeTask = useCallback((id: string) => {
    const success = deleteTask(id);
    if (success) {
      setTasks(prev => prev.filter(t => t.id !== id));
    }
    return success;
  }, []);

  const editTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    const updated = updateTask(id, updates);
    if (updated) {
      setTasks(prev => prev.map(t => t.id === id ? updated : t).sort((a, b) => a.startTime.localeCompare(b.startTime)));
    }
    return updated;
  }, []);

  return {
    tasks,
    currentTask,
    nextTask,
    createTask,
    updateTaskStatus,
    removeTask,
    editTask,
  };
}
