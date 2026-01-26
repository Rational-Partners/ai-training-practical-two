// Initial task data
const tasks = [
  {
    id: 1,
    title: 'Set up project structure',
    description: 'Initialize the repository and configure build tools',
    assigneeId: 1,
    priority: 'high',
    status: 'completed',
    createdAt: '2024-01-15T09:00:00Z',
  },
  {
    id: 2,
    title: 'Implement user authentication',
    description: 'Add login and registration endpoints',
    assigneeId: 2,
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-16T10:30:00Z',
  },
  {
    id: 3,
    title: 'Write API documentation',
    description: 'Document all endpoints using OpenAPI spec',
    assigneeId: 1,
    priority: 'medium',
    status: 'pending',
    createdAt: '2024-01-17T14:00:00Z',
  },
];

module.exports = { tasks };
