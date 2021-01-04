import { assign, Assigner, Machine, PropertyAssigner } from "xstate";
import { AuthActionEnum, AuthActions, AuthMachineContext } from "./types";

const _assign = (
  assignment:
    | Assigner<AuthMachineContext, AuthActions>
    | PropertyAssigner<AuthMachineContext, AuthActions>
) => assign<AuthMachineContext, AuthActions>(assignment);

const authMachine = Machine<AuthMachineContext, AuthActions>(
  {
    // A unique identifier for the machine
    id: "auth",

    // The initial state of the authentication machine.
    initial: "signIn",

    // Local context (or state) for the entire machine
    context: {
      user: null,
      error: null,
      loading: false,
    },

    // The valid states the machine can be in and the allowed transitions between states
    states: {
      signIn: {
        on: {
          "auth/LOGIN": {
            target: "signIn",
            actions: ["setLoading"],
          },
          "auth/LOGIN_SUCCESS": {
            target: "signedIn",
            actions: ["setUser", "unsetError", "unsetLoading"],
          },
          "auth/LOGIN_ERROR": {
            target: "signIn",
            actions: ["setError", "unsetUser", "unsetLoading"],
          },
          "auth/CONFIRM_USER": {
            target: "accountSetup",
            actions: ["setUser", "unsetError", "unsetLoading"],
          },
        },
      },
      signedIn: {
        on: {
          "auth/LOGOUT": {
            target: "signIn",
            actions: ["unsetUser", "unsetError", "unsetLoading"],
          },
        },
      },
      accountSetup: {
        on: {
          "auth/LOGIN_SUCCESS": {
            target: "signedIn",
            actions: ["setUser", "unsetError", "unsetLoading"],
          },
          "auth/LOGIN_ERROR": {
            target: "accountSetup",
            actions: ["setError", "unsetUser", "unsetLoading"],
          },
        }
      },
    },
  },
  {
    actions: {
      setUser: _assign({
        user: (_, event) =>
          event.type === AuthActionEnum.LOGIN_SUCCESS
            ? event.payload.user
            : null,
      }),
      unsetUser: _assign({
        user: () => null,
      }),
      setError: _assign({
        error: (_, event) => ("error" in event ? event.error : null),
      }),
      unsetError: _assign({
        error: null,
      }),
      setLoading: _assign({
        loading: true,
      }),
      unsetLoading: _assign({
        loading: false,
      }),
    },
  }
);

export default authMachine;
