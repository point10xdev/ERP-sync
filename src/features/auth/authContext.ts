// //----Omitted File----


// // Import necessary React utilities and types
// import { createContext, useContext, useReducer, useCallback, ReactNode, useEffect } from 'react';
// // Import custom types for auth-related state and props
// import { AuthContextType, AuthState, LoginCredentials, SignupData, User } from '../types';
// // Import functions to handle API requests related to authentication
// import { authService } from '../../services/api';

// // ----------------------
// // Initial Authentication State
// // ----------------------
// const initialState: AuthState = {
//   isAuthenticated: false,  // Initially user is not authenticated
//   user: null,              // No user info available yet
//   loading: false,          // Not in a loading state initially
//   error: null,             // No error at the start
// };

// // ----------------------
// // Define Actions for Reducer
// // ----------------------
// // This defines all the possible actions the auth reducer can respond to
// type AuthAction =
//   | { type: 'AUTH_START' }                        // Start of any auth process
//   | { type: 'AUTH_SUCCESS'; payload: User }       // Successful login/signup
//   | { type: 'AUTH_FAILURE'; payload: string }     // Login/signup error
//   | { type: 'AUTH_LOGOUT' }                       // Logging out
//   | { type: 'CLEAR_ERROR' };                      // Clear error messages

// // ----------------------
// // Authentication Reducer
// // ----------------------
// // Reducers are pure functions that manage state transitions
// function authReducer(state: AuthState, action: AuthAction): AuthState {
//   switch (action.type) {
//     case 'AUTH_START':
//       return { ...state, loading: true, error: null };

//     case 'AUTH_SUCCESS':
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload,
//         loading: false,
//         error: null,
//       };

//     case 'AUTH_FAILURE':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         loading: false,
//         error: action.payload,
//       };

//     case 'AUTH_LOGOUT':
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//         loading: false,
//       };

//     case 'CLEAR_ERROR':
//       return { ...state, error: null };

//     default:
//       return state;
//   }
// }

// // ----------------------
// // Create Authentication Context
// // ----------------------
// // React context allows sharing state and functions throughout the app
// const AuthContext = createContext<AuthContextType | null>(null);

// // ----------------------
// // AuthProvider Component
// // ----------------------
// // Wraps the app and provides auth state + methods to all children
// export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
//   const [state, dispatch] = useReducer(authReducer, initialState);

//   // ----------------------
//   // Validate token on component mount
//   // ----------------------
//   // Automatically try to restore session from saved token
//   useEffect(() => {
//     const validateAuth = async () => {
//       const token = localStorage.getItem('auth_token');
//       if (token) {
//         dispatch({ type: 'AUTH_START' });
//         try {
//           const user = await authService.validateToken();  // backend validates token
//           dispatch({ type: 'AUTH_SUCCESS', payload: user });
//         } catch (error) {
//           dispatch({ type: 'AUTH_FAILURE', payload: 'Session expired' });
//           localStorage.removeItem('auth_token');
//         }
//       }
//     };
//     validateAuth();
//   }, []);

//   // ----------------------
//   // Login Function
//   // ----------------------
//   // Handles login with credentials and updates state accordingly
//   const login = useCallback(async (credentials: LoginCredentials) => {
//     dispatch({ type: 'AUTH_START' });
//     try {
//       const user = await authService.login(credentials);
//       dispatch({ type: 'AUTH_SUCCESS', payload: user });
//     } catch (error) {
//       dispatch({ type: 'AUTH_FAILURE', payload: 'Invalid credentials' });
//     }
//   }, []);

//   // ----------------------
//   // Signup Function
//   // ----------------------
//   const signup = useCallback(async (data: SignupData) => {
//     dispatch({ type: 'AUTH_START' });
//     try {
//       const user = await authService.signup(data);
//       dispatch({ type: 'AUTH_SUCCESS', payload: user });
//     } catch (error) {
//       dispatch({ type: 'AUTH_FAILURE', payload: 'Signup failed' });
//     }
//   }, []);

//   // ----------------------
//   // Logout Function
//   // ----------------------
//   const logout = useCallback(async () => {
//     dispatch({ type: 'AUTH_START' });
//     try {
//       await authService.logout();
//       localStorage.removeItem('user');  // clean up local storage
//       dispatch({ type: 'AUTH_LOGOUT' });
//     } catch (error) {
//       dispatch({ type: 'AUTH_FAILURE', payload: 'Logout failed' });
//     }
//   }, []);

//   // ----------------------
//   // Clear Error Function
//   // ----------------------
//   // Helpful for dismissing error messages in the UI
//   const clearError = useCallback(() => {
//     dispatch({ type: 'CLEAR_ERROR' });
//   }, []);

//   // Bundle state and actions to be provided via context
//   const value: AuthContextType = {
//     ...state,
//     login,
//     signup,
//     logout,
//     clearError,
//   };

//   // Provide auth context to all children
//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // ----------------------
// // Custom Hook: useAuth
// // ----------------------
// // Convenience hook to access the AuthContext in components
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
