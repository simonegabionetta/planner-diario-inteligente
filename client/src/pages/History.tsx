import { useState, useMemo } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTasks, getProductivityStats } from '@/lib/storage';
import { ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

type Period = 'daily' | 'weekly' | 'monthly';

export default function History() {
  const [, setLocation] = useLocation();
  const [period, setPeriod] = useState<Period>('daily');

  const today = new Date();
  const getDateRange = (type: Period) => {
    const start = new Date(today);
    const end = new Date(today);

    if (type === 'daily') {
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    } else if (type === 'weekly') {
      start.setDate(today.getDate() - today.getDay());
      end.setDate(today.getDate() + (6 - today.getDay()));
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    } else {
      start.setDate(1);
      end.setMonth(today.getMonth() + 1, 0);
      return {
        start: start.toISOString().split('T')[0],
        end: end.toISOString().split('T')[0],
      };
    }
  };

  const dateRange = getDateRange(period);
  const stats = getProductivityStats(dateRange.start, dateRange.end);
  const allTasks = getTasks().filter(
    t => t.date >= dateRange.start && t.date <= dateRange.end
  );

  const chartData = useMemo(() => {
    return [
      { name: 'Concluidas', value: stats.completed, color: '#10b981' },
      { name: 'Pela Metade', value: stats.halfCompleted, color: '#f59e0b' },
      { name: 'Nao Concluidas', value: stats.notCompleted, color: '#ef4444' },
      { name: 'Nao Iniciadas', value: stats.notStarted, color: '#d1d5db' },
    ].filter(item => item.value > 0);
  }, [stats]);

  const tasksByDate = useMemo(() => {
    const grouped: Record<string, typeof allTasks> = {};
    allTasks.forEach(task => {
      if (!grouped[task.date]) {
        grouped[task.date] = [];
      }
      grouped[task.date].push(task);
    });
    return Object.entries(grouped).sort(([dateA], [dateB]) => dateB.localeCompare(dateA));
  }, [allTasks]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('pt-BR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const periodLabel = {
    daily: 'Diario',
    weekly: 'Semanal',
    monthly: 'Mensal',
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <h1 className="text-2xl font-bold">Historico de Produtividade</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="daily">Diario</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
            <TabsTrigger value="monthly">Mensal</TabsTrigger>
          </TabsList>

          {['daily', 'weekly', 'monthly'].map((p) => (
            <TabsContent key={p} value={p} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4">Grafico de Pizza</h2>
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={chartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, value }) => `${name}: ${value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-80 flex items-center justify-center text-muted-foreground">
                      Nenhum dado disponivel
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="bg-card rounded-lg border border-border p-6">
                  <h2 className="text-lg font-semibold mb-4">Resumo</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-muted-foreground">Total de Tarefas:</span>
                      <span className="font-semibold">{stats.total}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-muted-foreground">Concluidas:</span>
                      <span className="font-semibold text-green-600">{stats.completed}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-muted-foreground">Pela Metade:</span>
                      <span className="font-semibold text-amber-600">{stats.halfCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-muted-foreground">Nao Concluidas:</span>
                      <span className="font-semibold text-red-600">{stats.notCompleted}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-border">
                      <span className="text-muted-foreground">Nao Iniciadas:</span>
                      <span className="font-semibold text-gray-600">{stats.notStarted}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 bg-blue-50 p-2 rounded">
                      <span className="font-semibold">Taxa de Conclusao:</span>
                      <span className="font-bold text-blue-600">{stats.completionRate}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tasks List */}
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-lg font-semibold mb-4">Lista de Tarefas</h2>
                {tasksByDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhuma tarefa neste periodo
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasksByDate.map(([date, dateTasks]) => (
                      <div key={date}>
                        <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                          {formatDate(date)}
                        </h3>
                        <div className="space-y-2">
                          {dateTasks.map(task => (
                            <div
                              key={task.id}
                              className="flex items-center justify-between p-3 bg-secondary rounded border-l-4"
                              style={{ borderLeftColor: task.color }}
                            >
                              <div className="flex-1">
                                <p className="font-medium">{task.startTime} - {task.name}</p>
                                <p className="text-xs text-muted-foreground">{task.startTime} - {task.endTime}</p>
                              </div>
                              <span className="text-xs px-2 py-1 bg-background rounded">
                                {task.status === 'completed' && 'Concluida'}
                                {task.status === 'half-completed' && 'Metade'}
                                {task.status === 'not-completed' && 'Nao Concluida'}
                                {task.status === 'not-started' && 'Nao Iniciada'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
