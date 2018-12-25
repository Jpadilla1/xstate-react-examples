import { Machine } from "xstate";

const enterPhoneNumberMachine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        submit: "pending"
      }
    },
    pending: {
      on: {
        failed: "error",
        success: "#phone.phoneAccepted"
      }
    },
    error: {
      on: {
        submit: "pending"
      }
    }
  }
};

const verificationCodeMachine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        submit: "pending"
      }
    },
    pending: {
      on: {
        failed: "error",
        success: "#phone.codeAccepted"
      }
    },
    error: {
      on: {
        submit: "pending"
      }
    }
  }
};

export const phoneVerificationMachineFactory = (parentKey, onFinishedEvent) => Machine({
  key: "phone",
  initial: "enterPhone",
  states: {
    enterPhone: {
      ...enterPhoneNumberMachine
    },
    enterCode: {
      on: {
        resend: "enterPhone"
      },
      ...verificationCodeMachine
    },
    finished: {
      '': `#${parentKey}.${onFinishedEvent}`
    }
  }
});
