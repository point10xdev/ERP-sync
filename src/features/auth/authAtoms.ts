import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { AuthState, LoginCredentials, SignupData, User } from '../types';
import { authService } from '../../services/api';

// Initial auth state
const initialAuthState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
};

// Define atoms
export const authStateAtom = atom<AuthState>({
    key: 'authState',
    default: initialAuthState,
});

// Selectors for individual state properties
export const userSelector = selector({
    key: 'user',
    get: ({ get }) => get(authStateAtom).user,
});

export const isAuthenticatedSelector = selector({
    key: 'isAuthenticated',
    get: ({ get }) => get(authStateAtom).isAuthenticated,
});

export const loadingSelector = selector({
    key: 'authLoading',
    get: ({ get }) => get(authStateAtom).loading,
});

export const errorSelector = selector({
    key: 'authError',
    get: ({ get }) => get(authStateAtom).error,
});

// Custom hooks for auth operations
export const useAuthState = () => useRecoilValue(authStateAtom);
export const useUser = () => useRecoilValue(userSelector);
export const useIsAuthenticated = () => useRecoilValue(isAuthenticatedSelector);
export const useAuthLoading = () => useRecoilValue(loadingSelector);
export const useAuthError = () => useRecoilValue(errorSelector);

// Hook for auth operations
export const useAuth = () => {
    const [authState, setAuthState] = useRecoilState(authStateAtom);

    // Start loading
    const startLoading = () => {
        setAuthState((prevState) => ({
            ...prevState,
            loading: true,
            error: null,
        }));
    };

    // Set success
    const setSuccess = (user: User) => {
        setAuthState({
            isAuthenticated: true,
            user,
            loading: false,
            error: null,
        });
    };

    // Set failure
    const setFailure = (error: string) => {
        setAuthState({
            isAuthenticated: false,
            user: null,
            loading: false,
            error,
        });
    };

    // Login
    const login = async (credentials: LoginCredentials) => {
        startLoading();
        try {
            const user = await authService.login(credentials);
            setSuccess(user);
        } catch (e) {
            console.error('Login failed:', e);
            setFailure('Invalid credentials');
        }
    };

    // Signup
    const signup = async (data: SignupData) => {
        startLoading();
        try {
            const user = await authService.signup(data);
            setSuccess(user);
        } catch (e) {
            console.error('Signup failed:', e);
            setFailure('Signup failed');
        }
    };

    // Logout
    const logout = async () => {
        startLoading();
        try {
            await authService.logout();
            localStorage.removeItem('user');
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

    // Clear error
    const clearError = () => {
        setAuthState({
            ...authState,
            error: null,
        });
    };

    return {
        ...authState,
        login,
        signup,
        logout,
        clearError,
    };
};

// Initialize auth on app load
export const useInitAuth = () => {
    const setAuthState = useSetRecoilState(authStateAtom);

    const initializeAuth = async () => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            setAuthState((prevState) => ({
                ...prevState,
                loading: true,
                error: null,
            }));

            try {
                const user = await authService.validateToken();
                setAuthState({
                    isAuthenticated: true,
                    user,
                    loading: false,
                    error: null,
                });
            } catch (e) {
                console.error('Auth initialization failed:', e);
                localStorage.removeItem('auth_token');
                setAuthState({
                    isAuthenticated: false,
                    user: null,
                    loading: false,
                    error: 'Session expired',
                });
            }
        }
    };

    return { initializeAuth };
}; 