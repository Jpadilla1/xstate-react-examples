import React from "react";

export const Template = props => (
  <div>
    <div>Id: {props.id}</div>
    <div>Page: {props.page}</div>
    <div>
      Fields:{" "}
      {props.fields.map((field, i) => {
        return (
          <div key={i}>{field.name} {":"} {field.value}</div>
        );
      })}
    </div>
    <button type="button" onClick={props.onEdit}>Edit</button>
  </div>
);
