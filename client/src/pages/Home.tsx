import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { TaskForm } from '@/components/TaskForm';
import { TaskCard } from '@/components/TaskCard';
import { useTasks } from '@/hooks/useTasks';
import { useAlarms } from '@/hooks/useAlarms';
import { Task, getTasks } from '@/lib/storage';
import { seedTestData } from '@/lib/seedData';
import { History, Bell } from 'lucide-react';

export default function Home() {
  const [, setLocation] = useLocation();
  const today = new Date().toISOString().split('T')[0];
  const { tasks, currentTask, nextTask, createTask, updateTaskStatus, removeTask, editTask } = useTasks(today);
  const { triggerAlarm } = useAlarms(tasks, { enabled: true });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const allTasks = getTasks();
    if (allTasks.length === 0) {
      seedTestData();
    }
  }, []);

  useEffect(() => {
    tasks.forEach(task => {
      if (task.status === 'not-started') {
        const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        if (task.startTime === now) {
          triggerAlarm(task);
        }
      }
    });
  }, [tasks, triggerAlarm]);

  const handleAddTask = (taskData: any) => {
    createTask({
      ...taskData,
      status: 'not-started',
      date: today,
    });
  };

  const handleStatusChange = (id: string, status: Task['status']) => {
    updateTaskStatus(id, status);
  };

  const handleDeleteTask = (id: string) => {
    if (confirm('Tem certeza que deseja deletar esta tarefa?')) {
      removeTask(id);
    }
  };

  const handleEditTask = (id: string) => {
    setEditingId(editingId === id ? null : id);
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Planner Diario</h1>
            <p className="text-sm text-muted-foreground capitalize">{currentDate}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setLocation('/history')}
            className="gap-2"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Ver Historico</span>
            <span className="sm:hidden">Historico</span>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TaskForm onAddTask={handleAddTask} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            {currentTask && (
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="w-5 h-5 text-blue-600" />
                  <h2 className="font-semibold text-blue-900">Agora: {currentTask.name}</h2>
                </div>
                <p className="text-sm text-blue-700">
                  {currentTask.startTime} - {currentTask.endTime}
                </p>
              </div>
            )}

            {nextTask && !currentTask && (
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
                <h2 className="font-semibold text-amber-900 mb-1">Proxima: {nextTask.name}</h2>
                <p className="text-sm text-amber-700">
                  {nextTask.startTime} - {nextTask.endTime}
                </p>
              </div>
            )}

            <div>
              <h2 className="text-lg font-semibold mb-4">Tarefas do Dia</h2>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhuma tarefa adicionada ainda</p>
                </div>
              ) : (
                <div className="grid gap-3">
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isCurrent={task.id === currentTask?.id}
                      onStatusChange={(status) => handleStatusChange(task.id, status)}
                      onEdit={() => handleEditTask(task.id)}
                      onDelete={() => handleDeleteTask(task.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
