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
  Snackbar,
  Alert,
  InputAdornment,
  LinearProgress,
} from '@mui/material';
import { Building2, Plus, Edit, Trash2, Search } from 'lucide-react';
import { departmentService } from '../services/departmentService';
import type { Department } from '../types';
import { getErrorMessage } from '../services/api';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export const DepartmentPage: React.FC = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nameInput, setNameInput] = useState('');
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

  const loadDepartments = async () => {
    setLoading(true);
    try {
      const list = await departmentService.getAll();
      setDepartments(list);
    } catch (err) {
      showToast('Erro ao carregar departamentos', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const showToast = (message: string, severity: 'success' | 'error' = 'success') => {
    setToast({ open: true, message, severity });
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setNameInput('');
    setOpenModal(true);
  };

  const handleOpenEdit = (dep: Department) => {
    setEditingId(dep.id);
    setNameInput(dep.name);
    setOpenModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      showToast('Por favor, informe o nome do departamento.', 'error');
      return;
    }
    setSaving(true);
    try {
      if (editingId) {
        await departmentService.update(editingId, { name: nameInput.trim() });
        showToast('Departamento atualizado com sucesso!');
      } else {
        await departmentService.create({ name: nameInput.trim() });
        showToast('Departamento cadastrado com sucesso!');
      }
      setOpenModal(false);
      loadDepartments();
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
      await departmentService.delete(deleteId);
      showToast('Departamento removido com sucesso!');
      setDeleteId(null);
      loadDepartments();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>
            Gestão de Departamentos
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Cadastre e gerencie os departamentos acadêmicos da instituição.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: '#2563eb',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            py: 1,
            '&:hover': { backgroundColor: '#1d4ed8' },
          }}
        >
          Novo Departamento
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <TextField
          placeholder="Buscar departamento por nome..."
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
                <TableCell sx={{ fontWeight: 'bold', width: 100 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Nome do Departamento</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', pr: 3 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((dep) => (
                  <TableRow key={dep.id} hover>
                    <TableCell sx={{ color: '#64748b' }}>#{dep.id}</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Building2 size={18} color="#3b82f6" />
                        {dep.name}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(dep)} size="small" title="Editar">
                        <Edit size={18} />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(dep.id)} size="small" title="Excluir">
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    Nenhum departamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Modal Form */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="xs" fullWidth>
        <form onSubmit={handleSave}>
          <DialogTitle fontWeight="bold">
            {editingId ? 'Editar Departamento' : 'Novo Departamento'}
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Nome do Departamento"
              type="text"
              fullWidth
              variant="outlined"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              required
              sx={{ mt: 1 }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setOpenModal(false)} color="inherit" disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={saving} sx={{ textTransform: 'none', fontWeight: 600 }}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title="Excluir Departamento"
        description="Tem certeza que deseja excluir este departamento? Esta ação não poderá ser desfeita."
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
