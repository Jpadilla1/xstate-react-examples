import React from "react";
import Button from '@material-ui/core/Button';

export const Item = props => (
  <div>
    <div>Id: {props.item.id}</div>
    <div>Name: {props.item.name}</div>

    <Button type="button" variant="contained" color="primary" onClick={props.onEdit}>Edit</Button>
  </div>
);
