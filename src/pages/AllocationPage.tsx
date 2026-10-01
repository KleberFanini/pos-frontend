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
  Grid,
} from '@mui/material';
import { CalendarDays, Plus, Edit, Trash2, Search, UserCheck, BookOpen, Clock, AlertTriangle } from 'lucide-react';
import { allocationService } from '../services/allocationService';
import { professorService } from '../services/professorService';
import { courseService } from '../services/courseService';
import type { Allocation, Professor, Course, DayOfWeek } from '../types';
import { DAY_OF_WEEK_LABELS } from '../types';
import { getErrorMessage } from '../services/api';
import { DeleteConfirmDialog } from '../components/DeleteConfirmDialog';

export const AllocationPage: React.FC = () => {
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [dayOfWeekInput, setDayOfWeekInput] = useState<DayOfWeek>('MONDAY');
  const [startHourInput, setStartHourInput] = useState('08:00');
  const [endHourInput, setEndHourInput] = useState('10:00');
  const [professorIdInput, setProfessorIdInput] = useState<number | ''>('');
  const [courseIdInput, setCourseIdInput] = useState<number | ''>('');
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Conflict / Toast State
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [allocList, profsList, coursesList] = await Promise.all([
        allocationService.getAll(),
        professorService.getAll(),
        courseService.getAll(),
      ]);
      setAllocations(allocList);
      setProfessors(profsList);
      setCourses(coursesList);
    } catch (err) {
      showToast('Erro ao carregar alocações, professores e cursos', 'error');
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
    setDayOfWeekInput('MONDAY');
    setStartHourInput('08:00');
    setEndHourInput('10:00');
    setProfessorIdInput(professors.length > 0 ? professors[0].id : '');
    setCourseIdInput(courses.length > 0 ? courses[0].id : '');
    setOpenModal(true);
  };

  const handleOpenEdit = (alloc: Allocation) => {
    setEditingId(alloc.id);
    setDayOfWeekInput(alloc.dayOfWeek);
    setStartHourInput(alloc.startHour.substring(0, 5));
    setEndHourInput(alloc.endHour.substring(0, 5));
    setProfessorIdInput(alloc.professorId);
    setCourseIdInput(alloc.courseId);
    setOpenModal(true);
  };

  const formatHourForDTO = (hourStr: string) => {
    if (!hourStr) return '00:00:00';
    if (hourStr.length === 5) return `${hourStr}:00`;
    return hourStr;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!professorIdInput) {
      showToast('Selecione o professor.', 'error');
      return;
    }
    if (!courseIdInput) {
      showToast('Selecione o curso.', 'error');
      return;
    }
    if (startHourInput >= endHourInput) {
      showToast('O horário inicial deve ser anterior ao horário final.', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        dayOfWeek: dayOfWeekInput,
        startHour: formatHourForDTO(startHourInput),
        endHour: formatHourForDTO(endHourInput),
        professorId: Number(professorIdInput),
        courseId: Number(courseIdInput),
      };

      if (editingId) {
        await allocationService.update(editingId, payload);
        showToast('Alocação atualizada com sucesso!');
      } else {
        await allocationService.create(payload);
        showToast('Alocação cadastrada com sucesso!');
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
      await allocationService.delete(deleteId);
      showToast('Alocação removida com sucesso!');
      setDeleteId(null);
      loadData();
    } catch (err: any) {
      showToast(getErrorMessage(err), 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatTimeDisplay = (time: string) => {
    if (!time) return '';
    return time.substring(0, 5);
  };

  const filtered = allocations.filter((a) => {
    const term = search.toLowerCase();
    const profName = a.professor?.name?.toLowerCase() || '';
    const courseName = a.course?.name?.toLowerCase() || '';
    const dayLabel = DAY_OF_WEEK_LABELS[a.dayOfWeek]?.toLowerCase() || '';
    return profName.includes(term) || courseName.includes(term) || dayLabel.includes(term);
  });

  return (
    <Box>
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: { sm: 'center' }, gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#0f172a' }}>
            Gestão de Alocações de Horários
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Vincule professores a cursos com horário de início/fim e verificação de conflitos.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: '#f59e0b',
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 2.5,
            py: 1,
            '&:hover': { backgroundColor: '#d97706' },
          }}
        >
          Nova Alocação
        </Button>
      </Box>

      {/* Filter and Search Bar */}
      <Paper elevation={0} sx={{ p: 2, mb: 3, borderRadius: 3, border: '1px solid #e2e8f0' }}>
        <TextField
          placeholder="Buscar alocação por professor, curso ou dia da semana..."
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
                <TableCell sx={{ fontWeight: 'bold', width: 70 }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Dia da Semana</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Horário</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Professor</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Curso / Disciplina</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', pr: 3 }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((alloc) => (
                  <TableRow key={alloc.id} hover>
                    <TableCell sx={{ color: '#64748b' }}>#{alloc.id}</TableCell>
                    <TableCell>
                      <Chip
                        label={DAY_OF_WEEK_LABELS[alloc.dayOfWeek] || alloc.dayOfWeek}
                        size="small"
                        sx={{
                          backgroundColor: '#fef3c7',
                          color: '#b45309',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#1e293b' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Clock size={16} color="#64748b" />
                        {formatTimeDisplay(alloc.startHour)} às {formatTimeDisplay(alloc.endHour)}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#1e293b' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <UserCheck size={16} color="#8b5cf6" />
                        {alloc.professor?.name || `Prof. #${alloc.professorId}`}
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: '#1e293b' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BookOpen size={16} color="#10b981" />
                        {alloc.course?.name || `Curso #${alloc.courseId}`}
                      </Box>
                    </TableCell>
                    <TableCell align="right" sx={{ pr: 2 }}>
                      <IconButton color="primary" onClick={() => handleOpenEdit(alloc)} size="small" title="Editar">
                        <Edit size={18} />
                      </IconButton>
                      <IconButton color="error" onClick={() => setDeleteId(alloc.id)} size="small" title="Excluir">
                        <Trash2 size={18} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4, color: '#94a3b8' }}>
                    Nenhuma alocação cadastrada.
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
            {editingId ? 'Editar Alocação' : 'Nova Alocação de Horário'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
              <TextField
                select
                label="Professor"
                fullWidth
                value={professorIdInput}
                onChange={(e) => setProfessorIdInput(Number(e.target.value))}
                required
              >
                {professors.map((p) => (
                  <MenuItem key={p.id} value={p.id}>
                    {p.name} ({p.department?.name || 'Sem depto'})
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Curso / Disciplina"
                fullWidth
                value={courseIdInput}
                onChange={(e) => setCourseIdInput(Number(e.target.value))}
                required
              >
                {courses.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Dia da Semana"
                fullWidth
                value={dayOfWeekInput}
                onChange={(e) => setDayOfWeekInput(e.target.value as DayOfWeek)}
                required
              >
                {(Object.keys(DAY_OF_WEEK_LABELS) as DayOfWeek[]).map((dayKey) => (
                  <MenuItem key={dayKey} value={dayKey}>
                    {DAY_OF_WEEK_LABELS[dayKey]}
                  </MenuItem>
                ))}
              </TextField>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Horário Inicial"
                    type="time"
                    fullWidth
                    value={startHourInput}
                    onChange={(e) => setStartHourInput(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }} // 5 min
                    required
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Horário Final"
                    type="time"
                    fullWidth
                    value={endHourInput}
                    onChange={(e) => setEndHourInput(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    required
                  />
                </Grid>
              </Grid>
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
              sx={{ backgroundColor: '#f59e0b', '&:hover': { backgroundColor: '#d97706' }, textTransform: 'none', fontWeight: 600 }}
            >
              {saving ? 'Validando Horários...' : 'Salvar Alocação'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <DeleteConfirmDialog
        open={Boolean(deleteId)}
        title="Excluir Alocação"
        description="Tem certeza que deseja remover esta alocação de horário?"
        onConfirm={handleDeleteConfirm}
        onClose={() => setDeleteId(null)}
        loading={deleting}
      />

      {/* Notification Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toast.severity}
          onClose={() => setToast({ ...toast, open: false })}
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
