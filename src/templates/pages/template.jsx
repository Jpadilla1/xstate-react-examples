import React from "react";
import { Machine } from "xstate";
import { interpret } from "xstate/lib/interpreter";
import sample from "./data";
import { Template } from "../components/template";
import { Edit } from "../components/edit";

const templateMachine = Machine({
  initial: "viewing",
  states: {
    viewing: {
      on: {
        edit: "editing"
      }
    },
    editing: {
      on: {
        cancel: "viewing",
        save: "saving"
      }
    },
    saving: {
      on: {
        cancel: {
          target: "viewing",
          actions: ["displayCancelMessage"]
        },
        complete: {
          target: "viewing",
          actions: ["displaySavedMessage"]
        },
        failure: {
          target: "editing",
          actions: ["displayErrorMessage"]
        }
      }
    }
  }
});

export class TemplatePage extends React.Component {
  state = {
    current: templateMachine.initialState
  };

  service = interpret(templateMachine).onTransition(current => {
    this.setState({ current })
  });

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  onSubmit = e => {
    e.preventDefault();
    this.service.send("save");
    return new Promise(resolve => {
      setTimeout(() => {
        this.service.send("complete");
        resolve();
      }, 3000);
    });
  };

  onEdit = (e) => {
    e.preventDefault()
    this.service.send("edit");
  }

  onCancel = e => {
    e.preventDefault();
    this.service.send("cancel");
  };

  render() {
    const { current } = this.state;
    const template = { ...sample.templates[0] };

    if (current.value === "editing") {
      return (
        <Edit
          id={template.id}
          page={template.page}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
        />
      );
    }

    if (current.value === 'saving') {
      return (
        <>
          <div>Saving...</div>
          <Edit
            id={template.id}
            page={template.page}
            onSubmit={this.onSubmit}
            onCancel={this.onCancel}
          />
        </>
      );
    }

    return <Template {...template} onEdit={this.onEdit} />;
  }
}
