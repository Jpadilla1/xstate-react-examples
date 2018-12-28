import React from "react";
import { Machine } from "xstate";
import { interpret } from "xstate/lib/interpreter";
import { phoneVerificationMachineFactory } from "./phoneVerificationMachine";

const phoneVerificationMachine = phoneVerificationMachineFactory("authorized");

const authMachine = Machine({
  initial: "unauthed",
  context: {
    ...phoneVerificationMachine.context,
  },
  states: {
    unauthed: {
      on: {
        phoneauth: "phoneauth"
      }
    },
    phoneauth: {
      ...phoneVerificationMachine.machine,
    },
    authorized: {
      type: "final"
    }
  }
}, {
  guards: {
    ...phoneVerificationMachine.guards,
  },
  actions: {
    ...phoneVerificationMachine.actions,
  },
  services: {
    ...phoneVerificationMachine.services
  }
});

export class Login extends React.Component {
  state = {
    current: authMachine.initialState
  };

  service = interpret(authMachine).onTransition(current => {
    this.setState({ current });
  });

  transition(previousState, event) {
    const currentState = this.service.send(event);

    console.log({
      previousState,
      currentState,
      event
    });

    return currentState;
  }

  componentDidMount() {
    this.service.start();
    this.transition(this.service.state, "enterPhone");
  }

  componentWillUnmount() {
    this.service.stop();
  }

  render() {
    return <div />;
  }
}
