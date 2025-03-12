
export const primaryColor = '#00A99E';
export const modalStyleWhite = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: '12px',
  width: '95.75%',
  maxWidth: '400px',
  p: { xs: 2.5, md: 3 },
  outline: 'none',
  backgroundColor: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(4px)',
  maxHeight: "90vh",
  overflowY: "auto"

};

export const inputFieldWhite = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#fff',
    '& fieldset': {
      borderColor: '#dfe4ea'
    },
    '&:hover fieldset': {
      borderColor: 'primary.main'
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.light'
    }
  }
};


export const firstLetterUppercase = {
  '& input': {
    textTransform: 'lowercase',
  },
  '& input:first-letter': {
    textTransform: 'uppercase',
  },
}