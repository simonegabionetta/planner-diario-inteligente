import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: {
    name: string;
    startTime: string;
    endTime: string;
    color: string;
  }) => void;
}

const colorOptions = [
  { name: 'Azul', value: '#3b82f6' },
  { name: 'Verde', value: '#10b981' },
  { name: 'Vermelho', value: '#ef4444' },
  { name: 'Roxo', value: '#a855f7' },
  { name: 'Laranja', value: '#f97316' },
  { name: 'Rosa', value: '#ec4899' },
];

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [name, setName] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [color, setColor] = useState(colorOptions[0].value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      alert('Por favor, digite o nome da tarefa');
      return;
    }

    if (startTime >= endTime) {
      alert('Hora de inicio deve ser menor que hora de fim');
      return;
    }

    onAddTask({
      name: name.trim(),
      startTime,
      endTime,
      color,
    });

    setName('');
    setStartTime('09:00');
    setEndTime('10:00');
    setColor(colorOptions[0].value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-card rounded-lg border border-border">
      <h2 className="text-lg font-semibold">Adicionar Tarefa</h2>
      
      <div>
        <label className="block text-sm font-medium mb-1">Nome da Tarefa</label>
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ex: Estudar UX"
          className="w-full"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">Hora Inicio</label>
          <Input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hora Fim</label>
          <Input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Cor</label>
        <div className="flex gap-2 flex-wrap">
          {colorOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setColor(option.value)}
              className={`w-8 h-8 rounded-full border-2 transition-all ${
                color === option.value ? 'border-foreground ring-2 ring-offset-2 ring-primary' : 'border-border'
              }`}
              style={{ backgroundColor: option.value }}
              title={option.name}
            />
          ))}
        </div>
      </div>

      <Button type="submit" className="w-full gap-2">
        <Plus className="w-4 h-4" />
        Adicionar Tarefa
      </Button>
    </form>
  );
}
