import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  LinearProgress,
  IconButton,
  Button,
  Alert,
} from '@mui/material';
import {
  UserCheck,
  Building2,
  BookOpen,
  CalendarDays,
  Clock,
  RefreshCw,
  TrendingUp,
} from 'lucide-react';
import { reportService } from '../services/reportService';
import type { DashboardReport, ProfessorWorkload } from '../types';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const report = await reportService.getDashboardReport();
      setData(report);
    } catch (err: any) {
      setError('Não foi possível carregar os dados do painel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const statCards = [
    {
      title: 'Total de Professores',
      value: data?.totalProfessors ?? 0,
      icon: <UserCheck size={28} color="#3b82f6" />,
      color: '#eff6ff',
    },
    {
      title: 'Departamentos',
      value: data?.totalDepartments ?? 0,
      icon: <Building2 size={28} color="#10b981" />,
      color: '#ecfdf5',
    },
    {
      title: 'Cursos Ativos',
      value: data?.totalCourses ?? 0,
      icon: <BookOpen size={28} color="#8b5cf6" />,
      color: '#f5f3ff',
    },
    {
      title: 'Alocações Realizadas',
      value: data?.totalAllocations ?? 0,
      icon: <CalendarDays size={28} color="#f59e0b" />,
      color: '#fffbeb',
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>
            Painel de Analytics & Carga Horária
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Acompanhamento em tempo real do volume de horas e alocações acadêmicas.
          </Typography>
        </Box>
        <Button
          startIcon={<RefreshCw size={18} />}
          onClick={fetchDashboard}
          variant="outlined"
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Atualizar Dados
        </Button>
      </Box>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Metric Cards Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid #e2e8f0',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2.5 }}>
                <Box
                  sx={{
                    width: 52,
                    height: 52,
                    borderRadius: 2.5,
                    backgroundColor: card.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {card.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 500 }}>
                    {card.title}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a', lineHeight: 1.2 }}>
                    {card.value}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Workload Table */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <Clock size={24} color="#2563eb" />
          <Box>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#0f172a' }}>
              Carga Horária Semanal por Docente
            </Typography>
            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Cálculo acumulado a partir dos horários das alocações ativas do professor.
            </Typography>
          </Box>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                <TableCell sx={{ fontWeight: 'bold' }}>Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horas Semanais</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Progresso da Carga</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.workloads && data.workloads.length > 0 ? (
                data.workloads.map((item: ProfessorWorkload) => {
                  const maxHours = 40;
                  const percent = Math.min(100, Math.round((item.totalHours / maxHours) * 100));
                  return (
                    <TableRow key={item.professorId} hover>
                      <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {item.professorName}
                      </TableCell>
                      <TableCell sx={{ color: '#475569' }}>
                        <Chip label={item.departmentName} size="small" variant="outlined" />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.formattedWorkload || `${item.totalHours}h`}
                          size="small"
                          sx={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            fontWeight: 'bold',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: 260 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Box sx={{ flexGrow: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={percent}
                              sx={{
                                height: 8,
                                borderRadius: 4,
                                backgroundColor: '#e2e8f0',
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: percent > 80 ? '#f59e0b' : '#3b82f6',
                                },
                              }}
                            />
                          </Box>
                          <Typography variant="caption" fontWeight="bold" sx={{ minWidth: 35, color: '#64748b' }}>
                            {percent}%
                          </Typography>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    Nenhum professor com carga horária registrada até o momento.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
