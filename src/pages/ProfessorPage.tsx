import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  InputAdornment,
  LinearProgress,
  Chip,
  Tooltip,
} from '@mui/material';
import { UserCheck, Plus, Edit, Trash2, Search, FileText, Calendar, Building2 } from 'lucide-react';
import { professorService } from '../services/professorService';
import { departmentService } from '../services/departmentService';
import type { Professor, Department } from '../types';
import { getErrorMessage } from '../services/api';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export const ProfessorPage: React.FC = () => {
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState('');
  const [cpfInput, setCpfInput] = useState('');
  const [departmentIdInput, setDepartmentIdInput] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [profsList, depsList] = await Promise.all([
        professorService.getAll(),
        departmentService.getAll(),
      ]);
      setProfessors(profsList);
      setDepartments(depsList);
    } catch (err) {
      showToast('Erro ao carregar lista de professores e departamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setNameInput('');
    setCpfInput('');
    setDepartmentIdInput(departments.length > 0 ? departments[0].id : '');
    setOpenModal(true);
  };

  const handleOpenEdit = (prof: Professor) => {
    setEditingId(prof.id);
    setNameInput(prof.name);
    setCpfInput(prof.cpf || '');
    setDepartmentIdInput(prof.departmentId);
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Informe o nome do professor.', 'error');
      return;
    }
    const rawCpf = cpfInput.replace(/\D/g, '');
    if (rawCpf.length !== 11) {
      showToast('O CPF deve possuir exatamente 11 dígitos numéricos.', 'error');
      return;
    }
    if (!departmentIdInput) {
      showToast('Selecione um departamento.', 'error');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await professorService.update(editingId, {
          name: nameInput.trim(),
          cpf: rawCpf,
          departmentId: Number(departmentIdInput),
        });
        showToast('Professor atualizado com sucesso!');
      } else {
        await professorService.create({
          name: nameInput.trim(),
          cpf: rawCpf,
          departmentId: Number(departmentIdInput),
        });
        showToast('Professor cadastrado com sucesso!');
      }
      setOpenModal(false);
      loadData();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await professorService.delete(deleteId);
      showToast('Professor removido com sucesso!');
      setDeleteId(null);
      loadData();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleExportCSV = async (prof: Professor) => {
    try {
      await professorService.exportScheduleCSV(prof.id, prof.name);
      showToast(`Agenda de ${prof.name} baixada em CSV!`);
    } catch (err) {
      showToast('Erro ao exportar agenda em CSV.', 'error');
    }
  };

  const handleExportICS = async (prof: Professor) => {
    try {
      await professorService.exportScheduleICS(prof.id, prof.name);
      showToast(`Agenda de ${prof.name} baixada em iCalendar (.ics)!`);
    } catch (err) {
      showToast('Erro ao exportar agenda em iCalendar.', 'error');
    }
  };

  const formatCPFDisplay = (cpf: string) => {
    if (!cpf) return '';
    const clean = cpf.replace(/\D/g, '');
    if (clean.length !== 11) return cpf;
    return `${clean.slice(0, 3)}.${clean.slice(3, 6)}.${clean.slice(6, 9)}-${clean.slice(9)}`;
  };

  const filtered = professors.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.cpf && p.cpf.includes(search)) ||
      (p.department?.name && p.department.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>
            Corpo Docente (Professores)
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Cadastro de professores, vínculo departamental e exportação de agendas individuais.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: '#8b5cf6',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            py: 1,
            '&:hover': { backgroundColor: '#7c3aed' },
          }}
        >
          Novo Professor
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <TextField
          placeholder="Buscar professor por nome, CPF ou departamento..."
          variant="outlined"
          size="small"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search size={18} color="#94a3b8" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {loading && <LinearProgress sx={{ mb: 3, borderRadius: 1 }} />}

      {/* Table List */}
      <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ backgroundColor: '#f8fafc' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: 80 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome do Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>CPF</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Departamento</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold' }}>Exportar Agenda</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', pr: 3 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((prof) => (
                  <TableRow key={prof.id} hover>
                    <TableCell sx={{ color: '#64748b' }}>#{prof.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <UserCheck size={18} color="#8b5cf6" />
                        {prof.name}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ fontFamily: 'monospace', color: '#475569' }}>
                      {formatCPFDisplay(prof.cpf)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={<Building2 size={14} />}
                        label={prof.department?.name || 'Não vinculado'}
                        size="small"
                        variant="outlined"
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Exportar Agenda em CSV">
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<FileText size={14} />}
                            onClick={() => handleExportCSV(prof)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.2 }}
                          >
                            CSV
                          </Button>
                        </Tooltip>
                        <Tooltip title="Exportar Agenda em iCalendar (.ics) para Google Agenda / Outlook">
                          <Button
                            size="small"
                            variant="outlined"
                            color="secondary"
                            startIcon={<Calendar size={14} />}
                            onClick={() => handleExportICS(prof)}
                            sx={{ textTransform: 'none', fontSize: '0.75rem', py: 0.2 }}
                          >
                            .ICS
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(prof)} size="small" title="Editar">
                        <Edit size={18} />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(prof.id)} size="small" title="Excluir">
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    Nenhum professor cadastrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal Form */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle fontWeight="bold">
            {editingId ? 'Editar Professor' : 'Novo Professor'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                label="Nome do Professor"
                type="text"
                fullWidth
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
              />
              <TextField
                label="CPF (apenas números ou formatado)"
                type="text"
                fullWidth
                value={cpfInput}
                onChange={(e) => setCpfInput(e.target.value)}
                placeholder="000.000.000-00"
                helperText="O sistema valida a estrutura real do CPF (11 dígitos)."
                required
              />
              <TextField
                select
                label="Departamento Vínculo"
                fullWidth
                value={departmentIdInput}
                onChange={(e) => setDepartmentIdInput(Number(e.target.value))}
                required
              >
                {departments.map((dep) => (
                  <MenuItem key={dep.id} value={dep.id}>
                    {dep.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit" disabled={saving}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={saving}
              sx={{ backgroundColor: '#8b5cf6', '&:hover': { backgroundColor: '#7c3aed' }, textTransform: 'none', fontWeight: 600 }}
            >
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title="Excluir Professor"
        description="Tem certeza que deseja excluir este professor? Todas as alocações vinculadas a ele serão afetadas."
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />

      {/* Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={4000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} onClose={() => setToast({ ...toast, open: false })} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
