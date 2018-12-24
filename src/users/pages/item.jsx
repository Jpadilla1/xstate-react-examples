import React from "react";
import { Machine } from "xstate";
import { interpret } from "xstate/lib/interpreter";
import { Item } from "../components/item";
import { EditForm } from "../components/edit";
import { Notification } from "../components/notification";

const itemMachine = Machine({
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

export class ItemPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: itemMachine.initialState,
      item: props.item
    };
  }

  service = interpret(itemMachine).onTransition(current => {
    this.setState({ current });
  });

  componentDidMount() {
    this.service.start();
  }

  componentWillUnmount() {
    this.service.stop();
  }

  onSubmit = payload => {
    this.service.send("save");
    return new Promise(resolve => {
      setTimeout(() => {
        if (this.service.state.matches("saving")) {
          this.setState({
            item: {
              ...this.state.item,
              ...payload.data
            }
          });
        }
        this.service.send("complete");
        resolve();
      }, 3000);
    });
  };

  onEdit = e => {
    e.preventDefault();
    this.service.send("edit");
  };

  onCancel = e => {
    e.preventDefault();
    this.service.send("cancel");
  };

  getActionContent = action => {
    if (action === "displaySavedMessage") {
      return "Saved";
    }

    if (action === "displayCancelMessage") {
      return "Canceled";
    }

    if (action === "displayErrorMessage") {
      return "Failure";
    }
  };

  render() {
    const { current, item } = this.state;

    if (current.value === "editing" || current.value === "saving") {
      return (
        <EditForm
          item={item}
          onSubmit={this.onSubmit}
          onCancel={this.onCancel}
          saving={current.value === "saving"}
        />
      );
    }

    return (
      <>
        {current.actions && current.actions[0] && current.actions[0].type.startsWith("display") ? (
          <Notification message={this.getActionContent(current.actions[0].type)} />
        ) : null}
        <Item item={item} onEdit={this.onEdit} />
      </>
    );
  }
}
