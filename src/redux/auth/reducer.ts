import { AuthState, AuthActions } from './types';
import authMachine from './machine';

export const { initialState } = authMachine;

const authReducer = (
    state: AuthState = initialState,
    action: AuthActions
): AuthState => {
    return authMachine.transition(state, action);
};

export default authReducer;