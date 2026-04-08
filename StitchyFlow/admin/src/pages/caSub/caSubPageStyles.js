/**
 * Shared layout + form styles for CA/SUB Category & Subcategory admin pages.
 */
export const inputSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fbff',
    '& fieldset': { borderColor: '#cfe2fc' },
    '&:hover fieldset': { borderColor: '#90caf9' },
    '&.Mui-focused fieldset': { borderColor: '#1976d2' }
  }
};

export const tableHeadCellSx = {
  fontWeight: 700,
  fontSize: '0.72rem',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: '#37474f',
  borderBottom: '2px solid #e3f2fd',
  py: 1.75
};

export const tableBodyCellSx = { py: 1.75, fontSize: '0.9rem', color: '#263238' };

export const pageCardSx = {
  borderRadius: '20px',
  border: '1px solid #c5dcf5',
  boxShadow: '0 16px 48px rgba(13, 71, 161, 0.08)',
  background: 'linear-gradient(165deg, #ffffff 0%, #f4f9ff 55%, #ffffff 100%)',
  overflow: 'hidden'
};

/** Large corporate modal shell (Category / Subcategory forms). */
export const dialogPaperSx = {
  width: '100%',
  maxWidth: { xs: '100%', sm: 'min(92vw, 720px)', md: 'min(94vw, 880px)' },
  borderRadius: { xs: '16px 16px 0 0', sm: '24px' },
  border: '1px solid #b8d4f0',
  boxShadow: '0 32px 88px rgba(13, 71, 161, 0.2), 0 0 1px rgba(13, 71, 161, 0.12)',
  overflow: 'hidden',
  bgcolor: '#ffffff',
  m: { xs: 0, sm: 2 },
  maxHeight: { xs: '100%', sm: 'calc(100vh - 48px)' },
  '&::before': {
    content: '""',
    display: 'block',
    height: 6,
    width: '100%',
    background: 'linear-gradient(90deg, #0d47a1 0%, #1976d2 38%, #42a5f5 72%, #64b5f6 100%)'
  }
};

/** Inputs inside modals — slightly larger touch targets and type scale. */
export const dialogFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '14px',
    backgroundColor: '#f5f9ff',
    fontSize: '1rem',
    '& fieldset': { borderColor: '#cfe2fc', borderWidth: 1 },
    '&:hover fieldset': { borderColor: '#90caf9' },
    '&.Mui-focused fieldset': { borderColor: '#1976d2', borderWidth: 2 }
  },
  '& .MuiInputLabel-root': { fontWeight: 600, color: '#455a64', fontSize: '0.95rem' },
  '& .MuiInputBase-input': { py: 1.35 }
};

export const primaryButtonSx = {
  textTransform: 'none',
  borderRadius: '12px',
  px: 2.75,
  py: 1.15,
  fontWeight: 700,
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  boxShadow: '0 8px 24px rgba(21, 101, 192, 0.35)',
  '&:hover': { background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' }
};

export const switchSx = {
  '& .MuiSwitch-switchBase.Mui-checked': { color: '#1976d2' },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { backgroundColor: '#1976d2' }
};

export const dialogSaveButtonSx = {
  textTransform: 'none',
  borderRadius: '12px',
  px: 4,
  py: 1.35,
  minWidth: 140,
  fontSize: '0.95rem',
  fontWeight: 700,
  boxShadow: '0 6px 20px rgba(21, 101, 192, 0.35)',
  background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
  '&:hover': { background: 'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)' }
};

export const dialogCancelButtonSx = {
  textTransform: 'none',
  fontWeight: 600,
  color: '#546e7a',
  px: 2.5,
  py: 1.25,
  fontSize: '0.95rem'
};
