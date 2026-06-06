export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  admissionDate: string;
  meritScore: number; // IMN médio
  status: 'active' | 'probation' | 'on_leave';
  avatar?: string;
}

export const permanentEmployees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Carlos Oliveira',
    role: 'Operador de Máquinas Senior',
    department: 'Produção',
    admissionDate: '2023-01-15',
    meritScore: 8.5,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=11'
  },
  {
    id: 'emp-002',
    name: 'Leticia Braga',
    role: 'Analista de Qualidade',
    department: 'Qualidade',
    admissionDate: '2023-06-10',
    meritScore: 9.2,
    status: 'active',
    avatar: '/images/leticia_braga.png'
  },
  {
    id: 'emp-003',
    name: 'Marcos Vinícius',
    role: 'Auxiliar de Logística',
    department: 'Logística',
    admissionDate: '2024-02-01',
    meritScore: 7.8,
    status: 'probation',
    avatar: 'https://i.pravatar.cc/150?img=12'
  },
  {
    id: 'emp-004',
    name: 'Juliana Mendes',
    role: 'Líder de Célula',
    department: 'Produção',
    admissionDate: '2022-11-20',
    meritScore: 9.5,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=5'
  },
  {
    id: 'emp-005',
    name: 'Roberto Silva',
    role: 'Técnico de Manutenção',
    department: 'Manutenção',
    admissionDate: '2023-03-12',
    meritScore: 8.0,
    status: 'active',
    avatar: 'https://i.pravatar.cc/150?img=8'
  }
];
