import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import { Navbar } from './Navbar';
import { GraduationCap } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">{children}</Container>
      </Box>

      {/* Footer */}
      <Paper
        component="footer"
        square
        elevation={0}
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: '#0f172a',
          color: '#94a3b8',
          borderTop: '1px solid #1e293b',
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <GraduationCap size={20} color="#3b82f6" />
              <Typography variant="body2" fontWeight="500" sx={{ color: '#f8fafc' }}>
                Faculdade Frassinetti do Recife (Fafire)
              </Typography>
            </Box>

            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.85rem' }}>
              Projeto Avaliativo Frontend • Orientação: <strong>Prof. Keven Leone</strong>
            </Typography>

            <Typography variant="caption" sx={{ color: '#64748b' }}>
              Desenvolvido por: <strong>Kleber Fanini</strong>
            </Typography>
          </Box>
        </Container>
      </Paper>
    </Box>
  );
};
