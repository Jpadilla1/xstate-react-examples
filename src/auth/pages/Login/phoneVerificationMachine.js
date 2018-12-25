const enterPhoneNumberMachine = (parentKey) => ({
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
        success: `#${parentKey}.phoneAccepted`
      }
    },
    error: {
      on: {
        submit: "pending"
      }
    }
  }
});

const verificationCodeMachine = (parentKey) => ({
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
        success: `#${parentKey}.codeAccepted`
      }
    },
    error: {
      on: {
        submit: "pending"
      }
    }
  }
});

const KEY = "phoneVerification";

export const phoneVerificationMachineFactory = (parentKey, onFinishedEvent) => ({
  key: KEY,
  initial: "enterPhone",
  states: {
    enterPhone: {
      ...enterPhoneNumberMachine(KEY)
    },
    enterCode: {
      on: {
        resend: "enterPhone"
      },
      ...verificationCodeMachine(KEY)
    },
    finished: {
      '': `#${parentKey}.${onFinishedEvent}`
    }
  }
});
