/**
 * Utilitários para persistência de tarefas no localStorage
 * Estrutura de dados: Task
 */

export interface Task {
  id: string;
  name: string;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  color: string; // hex color
  status: 'not-started' | 'in-progress' | 'half-completed' | 'completed' | 'not-completed';
  date: string; // YYYY-MM-DD
  createdAt: number; // timestamp
}

const STORAGE_KEY = 'planner-tasks';

/**
 * Obter todas as tarefas do localStorage
 */
export function getTasks(): Task[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Erro ao ler tarefas:', error);
    return [];
  }
}

/**
 * Obter tarefas de um dia específico
 */
export function getTasksByDate(date: string): Task[] {
  const tasks = getTasks();
  return tasks.filter(task => task.date === date).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
}

/**
 * Obter tarefas de um período (semana ou mês)
 */
export function getTasksByPeriod(startDate: string, endDate: string): Task[] {
  const tasks = getTasks();
  return tasks.filter(task => {
    return task.date >= startDate && task.date <= endDate;
  }).sort((a, b) => {
    if (a.date !== b.date) return a.date.localeCompare(b.date);
    return a.startTime.localeCompare(b.startTime);
  });
}

/**
 * Adicionar nova tarefa
 */
export function addTask(task: Omit<Task, 'id' | 'createdAt'>): Task {
  const tasks = getTasks();
  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: Date.now(),
  };
  tasks.push(newTask);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return newTask;
}

/**
 * Atualizar tarefa existente
 */
export function updateTask(id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>): Task | null {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  tasks[index] = { ...tasks[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  return tasks[index];
}

/**
 * Deletar tarefa
 */
export function deleteTask(id: string): boolean {
  const tasks = getTasks();
  const filtered = tasks.filter(t => t.id !== id);
  
  if (filtered.length === tasks.length) return false;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Calcular estatísticas de produtividade
 */
export function getProductivityStats(startDate: string, endDate: string) {
  const tasks = getTasksByPeriod(startDate, endDate);
  
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    halfCompleted: tasks.filter(t => t.status === 'half-completed').length,
    notCompleted: 0,
    notStarted: tasks.filter(t => t.status === 'not-started').length,
  };
  
  stats.notCompleted = stats.total - stats.completed - stats.halfCompleted - stats.notStarted;
  
  return {
    ...stats,
    completionRate: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  };
}

/**
 * Obter tarefa atual (próxima a começar)
 */
export function getCurrentTask(date: string, currentTime: string): Task | null {
  const tasks = getTasksByDate(date);
  
  // Procura por tarefa em andamento
  const inProgress = tasks.find(t => t.status === 'in-progress');
  if (inProgress) return inProgress;
  
  // Procura pela próxima tarefa
  const upcoming = tasks.find(t => {
    return t.startTime > currentTime && t.status === 'not-started';
  });
  
  return upcoming || null;
}

/**
 * Obter próxima tarefa
 */
export function getNextTask(date: string, currentTime: string): Task | null {
  const tasks = getTasksByDate(date);
  const upcoming = tasks.find(t => {
    return t.startTime > currentTime && t.status === 'not-started';
  });
  
  return upcoming || null;
}

/**
 * Limpar todos os dados (para testes)
 */
export function clearAllTasks(): void {
  localStorage.removeItem(STORAGE_KEY);
}
