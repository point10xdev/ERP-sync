/**
 * TEST LOGIN HELPER MODULE
 * 
 * This file provides utility functions for testing the application with different user roles.
 * It allows easy login as various predefined users without going through the login form.
 * 
 * Key features:
 * - Direct login as Dean, HOD, or Supervisor with a single function call
 * - Role-specific login functions with department/course filtering
 * - Automatic user setup with appropriate permissions and attributes
 * 
 * Usage flow:
 * 1. Call a login function (e.g. loginAsDean())
 * 2. The corresponding user is created and stored in localStorage
 * 3. Page reloads to update authentication state
 * 4. User is now logged in with the selected role and permissions
 * 
 * This module is primarily used for testing and development purposes.
 */

import { AUTH_CONFIG } from '../config';
import {
    DEAN_LOGIN,
    HOD_LOGINS,
    SUPERVISOR_LOGINS,
    findLoginDetailsByUsername
} from './loginCredentials';

/**
 * Creates a user with the provided username and logs them in
 * 
 * @param username - Username from the loginCredentials module
 */
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

/**
 * Logs in as the Dean user
 * Dean has access to all students across all departments
 */
export const loginAsDean = (): void => {
    loginWithUsername(DEAN_LOGIN.username);
};

/**
 * Logs in as an HOD (Head of Department) with the specified department
 * HOD can view and manage students within their department
 * 
 * @param department - The department to filter by (defaults to Computer Science)
 */
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

/**
 * Logs in as a Supervisor with the specified department and course
 * Supervisor can only view and manage students assigned to them
 * 
 * @param department - The department to filter by (defaults to Computer Science)
 * @param course - The course to filter by (defaults to B.Tech)
 */
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