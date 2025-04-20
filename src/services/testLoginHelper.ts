import { AUTH_CONFIG } from '../config';
import {
    DEAN_LOGIN,
    HOD_LOGINS,
    SUPERVISOR_LOGINS,
    findLoginDetailsByUsername
} from './loginCredentials';

// Test login function to create a user with the specific username
export const loginWithUsername = (username: string): void => {
    const loginDetail = findLoginDetailsByUsername(username);

    if (!loginDetail) {
        console.error(`No login details found for username: ${username}`);
        return;
    }

    // Create a user object based on login details
    const user = {
        username: loginDetail.username,
        role: loginDetail.role,
        firstName: loginDetail.name.split(' ')[1], // Assuming "Dr. First Last" format
        lastName: loginDetail.name.split(' ')[2] || '', // Some names might not have Last name
        email: loginDetail.email,
        department: loginDetail.department,
        course: loginDetail.course || null, // Only for supervisors
        designation: loginDetail.designation,
        profileImageUrl: '',
        lastLogin: new Date()
    };

    // Store auth token and user data
    localStorage.setItem(AUTH_CONFIG.TOKEN_KEY, 'mock-jwt-token');
    localStorage.setItem(AUTH_CONFIG.USER_KEY, JSON.stringify(user));

    console.log(`Test login successful as ${loginDetail.role} (${loginDetail.name}):`, user);

    // Force reload to update authentication state
    window.location.reload();
};

// Function to login as dean
export const loginAsDean = (): void => {
    loginWithUsername(DEAN_LOGIN.username);
};

// Function to login as HOD with department
export const loginAsHOD = (department: string = 'Computer Science'): void => {
    const hodLogin = HOD_LOGINS.find(hod => hod.department === department);

    if (!hodLogin) {
        console.error(`No HOD found for department: ${department}`);
        // Fallback to first HOD
        loginWithUsername(HOD_LOGINS[0].username);
        return;
    }

    loginWithUsername(hodLogin.username);
};

// Function to login as supervisor with department and course
export const loginAsSupervisor = (
    department: string = 'Computer Science',
    course: string = 'B.Tech'
): void => {
    const supervisorLogin = SUPERVISOR_LOGINS.find(
        sup => sup.department === department && sup.course === course
    );

    if (!supervisorLogin) {
        console.error(`No supervisor found for department: ${department} and course: ${course}`);
        // Fallback to first supervisor
        loginWithUsername(SUPERVISOR_LOGINS[0].username);
        return;
    }

    loginWithUsername(supervisorLogin.username);
}; 