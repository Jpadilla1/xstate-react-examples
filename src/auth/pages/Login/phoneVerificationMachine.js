import { actions } from "xstate";

const { assign } = actions;

const registerPhone = phoneNumber =>
  new Promise((resolve, _reject) =>
    resolve({ data: { status: "201", phoneNumber } })
  );

const attemptAuth = (phoneNumber, verificationCode) =>
  new Promise((resolve, _reject) =>
    resolve({
      data: {
        status: "200",
        token: "some-token",
        phoneNumber,
        verificationCode
      }
    })
  );

const enterPhoneNumberMachine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        submit: {
          target: "pending",
          cond: "isValidPhoneNumber",
          actions: "setPhoneNumber"
        }
      }
    },
    pending: {
      invoke: {
        id: "registerPhone",
        src: "registerPhone",
        onDone: {
          target: "success",
          actions: "registerPhoneOnSuccess"
        },
        onError: {
          target: "error",
          actions: "registerPhoneOnError"
        }
      }
    },
    error: {
      on: {
        submit: "pending"
      }
    },
    success: {
      type: "final"
    }
  },
  onDone: "enterCode"
};

const verificationCodeMachine = {
  initial: "idle",
  states: {
    idle: {
      on: {
        submit: {
          target: "pending",
          cond: "hasPhoneNumberAndVerificationCode",
          actions: "setVerificationCode"
        }
      }
    },
    pending: {
      invoke: {
        id: "attemptAuth",
        src: "attemptAuth",
        onDone: {
          target: "success",
          actions: "attemptAuthOnSuccess"
        },
        onError: {
          target: "error",
          actions: "attemptAuthOnError"
        }
      }
    },
    error: {
      on: {
        submit: "pending"
      }
    },
    success: {
      type: "final"
    }
  },
  onDone: "success"
};

export const phoneVerificationMachineFactory = onFinishedEvent => ({
  machine: {
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
      success: {
        type: "final"
      }
    },
    onDone: onFinishedEvent
  },
  guards: {
    isValidPhoneNumber: (_ctx, evt) => evt.phoneNumber !== undefined && evt.phoneNumber !== null,
    hasPhoneNumberAndVerificationCode: (ctx, evt) => ctx.phoneNumber !== null && evt.verificationCode !== null,
  },
  actions: {
    setPhoneNumber: assign({ phoneNumber: (_ctx, event) => event.phoneNumber }),
    registerPhoneOnSuccess: assign({ data: (_ctx, { data }) => data }),
    registerPhoneOnError: assign({ error: (_, { data }) => data }),
    setVerificationCode: assign({ verificationCode: (_ctx, event) => event.verificationCode }),
    attemptAuthOnSuccess: assign({ data: (_ctx, { data }) => data }),
    attemptAuthOnError: assign({ error: (_, { data }) => data })
  },
  services: {
    registerPhone: (ctx, _event) => registerPhone(ctx.phoneNumber),
    attemptAuth: (ctx, _event) => attemptAuth(ctx.phoneNumber, ctx.verificationCode),
  },
  context: {
    phoneNumber: null,
    verificationCode: null,
    data: null,
    error: null
  }
});
