import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  Paper,
  Chip,
  Stack,
  Avatar,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import {
  GraduationCap,
  Building2,
  BookOpen,
  UserCheck,
  CalendarDays,
  LayoutDashboard,
  ShieldCheck,
  Download,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const features = [
    {
      title: 'Gestão de Departamentos',
      desc: 'Organização estruturada dos setores acadêmicos da instituição com ordenação alfabética.',
      icon: <Building2 size={28} color="#3b82f6" />,
      link: '/departments',
      color: '#eff6ff',
    },
    {
      title: 'Catálogo de Cursos',
      desc: 'Cadastro e manutenção de disciplinas e cursos oferecidos na grade curricular.',
      icon: <BookOpen size={28} color="#10b981" />,
      link: '/courses',
      color: '#ecfdf5',
    },
    {
      title: 'Docentes & Validação CPF',
      desc: 'Cadastro de professores vinculados a departamentos com validação completa de CPF real.',
      icon: <UserCheck size={28} color="#8b5cf6" />,
      link: '/professors',
      color: '#f5f3ff',
    },
    {
      title: 'Alocação de Horários',
      desc: 'Detecção automática de conflito de agenda (HTTP 409) entre dia, horários, professor e curso.',
      icon: <CalendarDays size={28} color="#f59e0b" />,
      link: '/allocations',
      color: '#fffbeb',
    },
    {
      title: 'Exportação de Agenda (.ics & .csv)',
      desc: 'Download direto de arquivos de grade horária compatíveis com Google Agenda, Outlook e Apple Calendar.',
      icon: <Download size={28} color="#ec4899" />,
      link: '/professors',
      color: '#fdf2f8',
    },
    {
      title: 'Analytics & Carga Horária',
      desc: 'Cálculo dinâmico de horas de aula acumuladas por professor com relatório consolidado.',
      icon: <LayoutDashboard size={28} color="#06b6d4" />,
      link: '/dashboard',
      color: '#ecfeff',
    },
  ];

  const authors = [
    { name: 'Ana Beatriz', role: 'Desenvolvedora Fullstack' },
    { name: 'Kleber Fanini', role: 'Desenvolvedor Fullstack' },
    { name: 'Myllena Lelis', role: 'Desenvolvedora Fullstack' },
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          p: { xs: 4, md: 8 },
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#ffffff',
          mb: 6,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.2)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 300,
            height: 300,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(59,130,246,0.25) 0%, rgba(0,0,0,0) 70%)',
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Stack spacing={3} alignItems="flex-start">
            <Chip
              icon={<Sparkles size={16} color="#60a5fa" />}
              label="Avaliação Prática Frontend • Fafire 2026"
              sx={{
                backgroundColor: 'rgba(59, 130, 246, 0.18)',
                color: '#60a5fa',
                fontWeight: 600,
                border: '1px solid rgba(59, 130, 246, 0.4)',
                px: 1,
              }}
            />

            <Typography
              variant="h2"
              component="h1"
              fontWeight="800"
              sx={{
                fontSize: { xs: '2.2rem', sm: '3rem', md: '3.6rem' },
                lineHeight: 1.15,
                background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Gestão Inteligente de Alocação de Professores
            </Typography>

            <Typography
              variant="h6"
              sx={{
                color: '#94a3b8',
                maxWidth: 780,
                fontWeight: 400,
                lineHeight: 1.6,
                fontSize: { xs: '1rem', md: '1.2rem' },
              }}
            >
              Plataforma Web desenvolvida para a avaliação da disciplina de <strong>Frontend (Prof. Keven Leone)</strong> na Fafire.
              Integração completa com a API REST Spring Boot para gerenciamento de Departamentos, Cursos, Docentes e Grade Horária.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}>
              <Button
                component={RouterLink}
                to="/dashboard"
                variant="contained"
                size="large"
                endIcon={<ArrowRight size={20} />}
                sx={{
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)',
                  '&:hover': {
                    backgroundColor: '#2563eb',
                  },
                }}
              >
                Acessar Dashboard
              </Button>

              <Button
                component={RouterLink}
                to="/allocations"
                variant="outlined"
                size="large"
                startIcon={<CalendarDays size={20} />}
                sx={{
                  borderColor: '#475569',
                  color: '#f8fafc',
                  px: 3.5,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#94a3b8',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  },
                }}
              >
                Ver Alocações
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Feature Cards Grid */}
      <Box sx={{ mb: 8 }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" sx={{ mb: 1, color: '#0f172a' }}>
          Recursos da Aplicação Web
        </Typography>
        <Typography variant="body1" textAlign="center" sx={{ mb: 5, color: '#64748b' }}>
          Tudo o que você precisa para gerenciar o planejamento acadêmico com elegância e precisão.
        </Typography>

        <Grid container spacing={3}>
          {features.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={0}
                sx={{
                  height: '100%',
                  borderRadius: 3,
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.25s ease-in-out',
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 20px -5px rgba(0,0,0,0.08)',
                    borderColor: '#cbd5e1',
                  },
                }}
              >
                <CardContent sx={{ p: 3.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 2.5,
                      backgroundColor: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 2.5,
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 1, color: '#1e293b' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', mb: 3, flexGrow: 1, lineHeight: 1.6 }}>
                    {item.desc}
                  </Typography>
                  <Button
                    component={RouterLink}
                    to={item.link}
                    size="small"
                    endIcon={<ArrowRight size={16} />}
                    sx={{
                      alignSelf: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 600,
                      color: '#2563eb',
                      p: 0,
                      '&:hover': { backgroundColor: 'transparent', textDecoration: 'underline' },
                    }}
                  >
                    Acessar Módulo
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>


    </Box>
  );
};
