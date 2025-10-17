// components/NotificationBar.js
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { styled } from '@mui/material/styles';

// Custom styled Alert with your preferred colors
const CustomAlert = styled(MuiAlert)(({ theme, severity }) => ({
  '&.MuiAlert-filledSuccess': {
    backgroundColor: '#4caf50', // Green for success
    color: '#fff',
  },
  '&.MuiAlert-filledError': {
    backgroundColor: '#f44336', // Red for error
    color: '#fff',
  },
  '&.MuiAlert-filledWarning': {
    backgroundColor: '#ff9800', // Orange for warning
    color: '#fff',
  },
  '&.MuiAlert-filledInfo': {
    backgroundColor: '#2196f3', // Blue for info
    color: '#fff',
  },
}));

const Alert = React.forwardRef((props, ref) => (
  <CustomAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export default function NotificationBar(props) {
  return (
    <Snackbar 
      open={props.openNotification} 
      autoHideDuration={props.hideLimit || 4000} 
      onClose={props.handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert onClose={props.handleClose} severity={props.type} sx={{ width: '100%' }}>
        {props.notificationContent}
      </Alert>
    </Snackbar>
  );
}