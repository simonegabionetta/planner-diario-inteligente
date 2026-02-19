import { addTask } from './storage';

export function seedTestData() {
  const today = new Date().toISOString().split('T')[0];
  
  const testTasks = [
    {
      name: 'Estudar UX',
      startTime: '08:00',
      endTime: '09:00',
      color: '#3b82f6',
      status: 'completed' as const,
      date: today,
    },
    {
      name: 'Limpar Casa',
      startTime: '09:00',
      endTime: '10:00',
      color: '#10b981',
      status: 'completed' as const,
      date: today,
    },
    {
      name: 'Academia',
      startTime: '10:00',
      endTime: '11:00',
      color: '#a855f7',
      status: 'half-completed' as const,
      date: today,
    },
    {
      name: 'Reuniao com Cliente',
      startTime: '14:00',
      endTime: '15:00',
      color: '#f97316',
      status: 'not-started' as const,
      date: today,
    },
    {
      name: 'Responder Emails',
      startTime: '15:00',
      endTime: '16:00',
      color: '#ec4899',
      status: 'not-started' as const,
      date: today,
    },
  ];

  testTasks.forEach(task => {
    addTask(task);
  });
}
