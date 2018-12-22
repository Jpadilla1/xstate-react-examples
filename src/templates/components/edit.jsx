import React from "react";

export const Edit = props => (
  <form onSubmit={props.onSubmit}>
    <label>Id:</label>
    <input type="text" value={props.id} />
    <label>Page:</label>
    <input type="text" value={props.page} />
    <button type="submit">Save</button>
    <button type="button" onClick={props.onCancel}>Cancel</button>
  </form>
);
