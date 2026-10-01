import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Chip,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Home,
  LayoutDashboard,
  Building2,
  BookOpen,
  UserCheck,
  CalendarDays,
  Menu as MenuIcon,
  Wifi,
  WifiOff,
  GraduationCap,
} from 'lucide-react';
import { checkBackendStatus, getBackendOnlineStatus } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(getBackendOnlineStatus());

  useEffect(() => {
    const updateStatus = async () => {
      const status = await checkBackendStatus();
      setIsOnline(status);
    };
    updateStatus();
    const interval = setInterval(updateStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { label: 'Início', path: '/', icon: <Home size={18} /> },
    { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
    { label: 'Departamentos', path: '/departments', icon: <Building2 size={18} /> },
    { label: 'Cursos', path: '/courses', icon: <BookOpen size={18} /> },
    { label: 'Professores', path: '/professors', icon: <UserCheck size={18} /> },
    { label: 'Alocações', path: '/allocations', icon: <CalendarDays size={18} /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <AppBar position="sticky" elevation={2} sx={{ backgroundColor: '#1e293b' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo & Brand */}
          <Box
            component={RouterLink}
            to="/"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                backgroundColor: '#3b82f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
              }}
            >
              <GraduationCap size={24} color="#ffffff" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.1, color: '#ffffff' }}>
                Professor Allocation
              </Typography>
              <Typography variant="caption" sx={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                Fafire Frontend • Avaliação
              </Typography>
            </Box>
          </Box>

          {/* Desktop Navigation Links */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5 }}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  component={RouterLink}
                  to={item.path}
                  startIcon={item.icon}
                  sx={{
                    color: isActive ? '#60a5fa' : '#cbd5e1',
                    backgroundColor: isActive ? 'rgba(96, 165, 250, 0.12)' : 'transparent',
                    fontWeight: isActive ? 600 : 500,
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                    },
                  }}
                >
                  {item.label}
                </Button>
              );
            })}
          </Box>

          {/* API Status Badge */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={isOnline ? 'API Spring Boot em http://localhost:8080 (Conectado)' : 'Modo Demonstração (Mock Storage)'}>
              <Chip
                icon={isOnline ? <Wifi size={14} color="#22c55e" /> : <WifiOff size={14} color="#f59e0b" />}
                label={isOnline ? 'API Online' : 'Modo Demo'}
                size="small"
                sx={{
                  backgroundColor: isOnline ? 'rgba(34, 197, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                  color: isOnline ? '#4ade80' : '#fbbf24',
                  borderColor: isOnline ? '#22c55e' : '#f59e0b',
                  borderWidth: 1,
                  borderStyle: 'solid',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                }}
              />
            </Tooltip>

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { md: 'none' }, color: '#ffffff' }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </Container>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: { width: 280, backgroundColor: '#0f172a', color: '#ffffff' },
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1.5, borderBottom: '1px solid #334155' }}>
          <GraduationCap size={24} color="#3b82f6" />
          <Typography variant="subtitle1" fontWeight="bold">
            Menu de Navegação
          </Typography>
        </Box>
        <List sx={{ pt: 1 }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.path} disablePadding>
                <ListItemButton
                  component={RouterLink}
                  to={item.path}
                  onClick={handleDrawerToggle}
                  selected={isActive}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    my: 0.5,
                    color: isActive ? '#60a5fa' : '#cbd5e1',
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(96, 165, 250, 0.15)',
                      color: '#60a5fa',
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 36 }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: isActive ? 600 : 400 }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Drawer>
    </AppBar>
  );
};
