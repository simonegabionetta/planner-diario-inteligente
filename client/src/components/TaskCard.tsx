import { Task } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, CheckCircle2, Circle, Minus, Play } from 'lucide-react';
import { useTaskTimer, formatTime } from '@/hooks/useTaskTimer';

interface TaskCardProps {
  task: Task;
  onStatusChange: (status: Task['status']) => void;
  onStart: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isCurrent?: boolean;
}

const statusLabels: Record<Task['status'], string> = {
  'not-started': 'Nao Iniciada',
  'in-progress': 'Em Andamento',
  'half-completed': 'Pela Metade',
  'completed': 'Concluida',
  'not-completed': 'Nao Concluida',
};

const statusColors: Record<Task['status'], string> = {
  'not-started': 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  'half-completed': 'bg-yellow-100 text-yellow-700',
  'completed': 'bg-green-100 text-green-700',
  'not-completed': 'bg-red-100 text-red-700',
};

export function TaskCard({
  task,
  onStatusChange,
  onStart,
  onEdit,
  onDelete,
  isCurrent = false,
}: TaskCardProps) {
  const timerInfo = useTaskTimer(task.status === 'in-progress' ? task : null);
  const borderStyle = isCurrent ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md';
  
  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border-l-4 bg-card text-card-foreground transition-all duration-200 ${borderStyle}`}
      style={{ borderLeftColor: task.color }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">{task.name}</h3>
          <p className="text-sm text-muted-foreground">
            {task.startTime} - {task.endTime}
          </p>
          {task.status === 'in-progress' && timerInfo.isActive && (
            <div className="mt-2">
              <div className="text-sm font-medium text-blue-600 mb-1">
                Tempo decorrido: {formatTime(timerInfo.timeElapsed)} | Faltam: {formatTime(timerInfo.timeRemaining)}
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${timerInfo.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${statusColors[task.status]}`}>
          {statusLabels[task.status]}
        </span>
      </div>

      <div className="flex gap-2">
        {task.status === 'not-started' && (
          <Button
            size="sm"
            variant="default"
            onClick={onStart}
            className="flex-1 gap-1 bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Iniciar</span>
          </Button>
        )}
        <Button
          size="sm"
          variant={task.status === 'not-started' ? 'default' : 'outline'}
          onClick={() => onStatusChange('not-started')}
          className="flex-1 gap-1"
        >
          <Circle className="w-4 h-4" />
          <span className="hidden sm:inline">Nao</span>
        </Button>
        <Button
          size="sm"
          variant={task.status === 'half-completed' ? 'default' : 'outline'}
          onClick={() => onStatusChange('half-completed')}
          className="flex-1 gap-1"
        >
          <Minus className="w-4 h-4" />
          <span className="hidden sm:inline">Metade</span>
        </Button>
        <Button
          size="sm"
          variant={task.status === 'completed' ? 'default' : 'outline'}
          onClick={() => onStatusChange('completed')}
          className="flex-1 gap-1"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">Concluida</span>
        </Button>
      </div>

      <div className="flex gap-2 pt-2 border-t border-border">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="flex-1 gap-2"
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="flex-1 gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Deletar</span>
        </Button>
      </div>
    </div>
  );
}
