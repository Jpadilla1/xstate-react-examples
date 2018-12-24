import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';

export const Notification = (props) => (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open
      autoHideDuration={3000}
      ContentProps={{
        'aria-describedby': 'message-id',
      }}
      message={<span id="message-id">{props.message}</span>}
    />
);
