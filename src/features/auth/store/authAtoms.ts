import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthState, LoginCredentials, SignupData, User } from '../../types';
import { authService } from '../../../services/api'; // API service for authentication-related network calls

// Initial state of the auth system
const initialAuthState: AuthState = {
    isAuthenticated: false,  // User is not logged in initially
    user: null,              // No user data yet
    loading: false,          // No network call is in progress
    error: null,             // No error at the beginning
};

// Recoil atom to hold and manage the entire authentication state
export const authStateAtom = atom<AuthState>({
    key: 'authState',        // Unique key for the atom
    default: initialAuthState, // Initial/default value for auth state
});

// -------- Selectors --------
// These are derived pieces of state based on the atom above

// Get only the `user` object from authState
export const userSelector = selector({
    key: 'user',
    get: ({ get }) => get(authStateAtom).user,
});

// Get only the `isAuthenticated` boolean from authState
export const isAuthenticatedSelector = selector({
    key: 'isAuthenticated',
    get: ({ get }) => get(authStateAtom).isAuthenticated,
});

// Get the `loading` status (useful for showing spinners)
export const loadingSelector = selector({
    key: 'authLoading',
    get: ({ get }) => get(authStateAtom).loading,
});

// Get the current error message (if any)
export const errorSelector = selector({
    key: 'authError',
    get: ({ get }) => get(authStateAtom).error,
});

// -------- Custom Hooks --------
// These allow easy consumption of the Recoil state

export const useAuthState = () => useRecoilValue(authStateAtom);             // Access full auth state
export const useUser = () => useRecoilValue(userSelector);                   // Access just the user
export const useIsAuthenticated = () => useRecoilValue(isAuthenticatedSelector); // Access just the isAuthenticated flag
export const useAuthLoading = () => useRecoilValue(loadingSelector);         // Access loading status
export const useAuthError = () => useRecoilValue(errorSelector);             // Access any error message

// -------- Hook for Auth Logic --------
// This hook provides functions to login, signup, logout, etc.

export const useAuth = () => {
    const [authState, setAuthState] = useRecoilState(authStateAtom);

    // Set loading state (used at the start of any auth-related network request)
    const startLoading = () => {
        setAuthState((prevState) => ({
            ...prevState,
            loading: true,
            error: null,
        }));
    };

    // Set success state when login/signup succeeds
    const setSuccess = (user: User) => {
        setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null,
        });
    };

    // Set failure state when login/signup fails
    const setFailure = (error: string) => {
        setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error,
        });
    };

    // Login handler using authService
    const login = async (credentials: LoginCredentials) => {
        startLoading(); // show loading
        try {
            const user = await authService.login(credentials); // make API call
            setSuccess(user); // set state if successful
        } catch (e) {
            console.error('Login failed:', e);
            setFailure('Invalid credentials'); // generic error message
        }
    };

    // Signup handler using authService
    const signup = async (data: SignupData) => {
        startLoading();
        try {
            const user = await authService.signup(data); // make API call
            setSuccess(user); // success state
        } catch (e) {
            console.error('Signup failed:', e);
            setFailure('Signup failed'); // show failure
        }
    };

    // Logout handler
    const logout = async () => {
        startLoading();
        try {
            await authService.logout(); // API call to logout
            localStorage.removeItem('user'); // clear user from local storage
            setAuthState({
                ...authState,
                isAuthenticated: false,
                user: null,
                loading: false,
            });
        } catch (e) {
            console.error('Logout failed:', e);
            setFailure('Logout failed');
        }
    };

    // Clear error message from state (can be called after showing the error)
    const clearError = () => {
        setAuthState({
            ...authState,
            error: null,
        });
    };

    // Expose all auth state values and operations from the hook
    return {
        ...authState,
        login,
        signup,
        logout,
        clearError,
    };
};

// -------- Hook to Initialize Auth --------
// Used to validate a token (e.g., on app load or page refresh)

export const useInitAuth = () => {
    const setAuthState = useSetRecoilState(authStateAtom);

    const initializeAuth = async () => {
        const token = localStorage.getItem('auth_token'); // check for saved token
        if (token) {
            // Show loading while validating token
            setAuthState((prevState) => ({
                ...prevState,
                loading: true,
                error: null,
            }));

            try {
                const user = await authService.validateToken(); // validate token with backend
                setAuthState({
                    isAuthenticated: true,
                    user,
                    loading: false,
                    error: null,
                });
            } catch (e) {
                console.error('Auth initialization failed:', e);
                localStorage.removeItem('auth_token'); // token might be invalid, remove it
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: 'Session expired',
                });
            }
        }
    };

    return { initializeAuth }; // function that should be called on app start
};
