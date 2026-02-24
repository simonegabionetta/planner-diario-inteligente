import { Task } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Trash2, Edit2, CheckCircle2, Circle, Minus, Play } from 'lucide-react';
import { useTaskTimer, formatTime } from '@/hooks/useTaskTimer';
import { getContrastColor } from '@/lib/utils';

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
  const textColorClass = getContrastColor(task.color) === 'white' ? 'text-white' : 'text-black';
  const mutedTextColorClass = getContrastColor(task.color) === 'white' ? 'text-white/80' : 'text-black/60';
  
  return (
    <div
      className={`flex flex-col gap-3 p-4 rounded-lg border-l-4 transition-all duration-200 ${borderStyle} ${textColorClass}`}
      style={{ 
        backgroundColor: task.color,
        borderLeftColor: 'rgba(0,0,0,0.2)' // Borda levemente mais escura que a cor
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg truncate">{task.name}</h3>
          <p className={`text-sm font-medium ${mutedTextColorClass}`}>
            {task.startTime} - {task.endTime}
          </p>
          {task.status === 'in-progress' && timerInfo.isActive && (
            <div className="mt-2">
              <div className={`text-sm font-bold mb-1 ${textColorClass}`}>
                Decorridos: {formatTime(timerInfo.timeElapsed)} | Faltam: {formatTime(timerInfo.timeRemaining)}
              </div>
              <div className="w-full bg-black/20 rounded-full h-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${timerInfo.percentage}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
        <span className={`px-2 py-1 rounded text-xs font-bold whitespace-nowrap bg-black/10`}>
          {statusLabels[task.status]}
        </span>
      </div>

      <div className="flex gap-2">
        {task.status === 'not-started' && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onStart}
            className="flex-1 gap-1 bg-white/20 hover:bg-white/30 text-current border-none"
          >
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Iniciar</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onStatusChange('not-started')}
          className={`flex-1 gap-1 bg-white/10 hover:bg-white/20 text-current border-none ${task.status === 'not-started' ? 'ring-2 ring-white/50' : ''}`}
        >
          <Circle className="w-4 h-4" />
          <span className="hidden sm:inline">Nao</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onStatusChange('half-completed')}
          className={`flex-1 gap-1 bg-white/10 hover:bg-white/20 text-current border-none ${task.status === 'half-completed' ? 'ring-2 ring-white/50' : ''}`}
        >
          <Minus className="w-4 h-4" />
          <span className="hidden sm:inline">Metade</span>
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => onStatusChange('completed')}
          className={`flex-1 gap-1 bg-white/10 hover:bg-white/20 text-current border-none ${task.status === 'completed' ? 'ring-2 ring-white/50' : ''}`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span className="hidden sm:inline">Concluida</span>
        </Button>
      </div>

      <div className="flex gap-2 pt-2 border-t border-black/10">
        <Button
          size="sm"
          variant="ghost"
          onClick={onEdit}
          className="flex-1 gap-2 hover:bg-white/10 text-current"
        >
          <Edit2 className="w-4 h-4" />
          <span className="hidden sm:inline">Editar</span>
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onDelete}
          className="flex-1 gap-2 hover:bg-red-500/20 text-current"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Deletar</span>
        </Button>
      </div>
    </div>
  );
}
