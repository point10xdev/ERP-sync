/**
 * LOGIN CREDENTIALS MODULE
 * 
 * This file defines the predefined login credentials for the ERP system.
 * It contains structured data for all available user accounts organized by role:
 * - Dean (single administrator user)
 * - HODs (Department Heads)
 * - Supervisors (Faculty members supervising students)
 * 
 * Purpose:
 * - Provides a centralized repository of valid login credentials
 * - Enforces role-based authentication with proper user profiles
 * - Establishes connections between users and departments/courses
 * 
 * Authentication flow:
 * 1. User enters credentials on login screen
 * 2. The auth service validates credentials against these predefined accounts
 * 3. If valid, the user object is created with appropriate role and permissions
 */

import { SystemRole } from '../features/types/schema';

// Type for login credentials
export interface LoginDetail {
    username: string;
    password: string; // For mock purposes only
    role: SystemRole;
    name: string;
    email: string;
    department: string;
    designation: string;
    course?: string; // For supervisors
}

// Dean login details - only one
export const DEAN_LOGIN: LoginDetail = {
    username: 'dean_user',
    password: 'password123',
    role: 'dean',
    name: 'Dr. Prakash Verma',
    email: 'dean@nitsrinagar.ac.in',
    department: 'Administration',
    designation: 'Dean of Academic Affairs'
};

// HOD login details - one for each department
export const HOD_LOGINS: LoginDetail[] = [
    {
        username: 'hod_cs',
        password: 'password123',
        role: 'hod',
        name: 'Dr. Aditya Sharma',
        email: 'hod.cs@nitsrinagar.ac.in',
        department: 'Computer Science',
        designation: 'Professor & Head of Department'
    },
    {
        username: 'hod_ee',
        password: 'password123',
        role: 'hod',
        name: 'Dr. Sneha Gupta',
        email: 'hod.ee@nitsrinagar.ac.in',
        department: 'Electrical Engineering',
        designation: 'Professor & Head of Department'
    },
    {
        username: 'hod_me',
        password: 'password123',
        role: 'hod',
        name: 'Dr. Aamir Khan',
        email: 'hod.me@nitsrinagar.ac.in',
        department: 'Mechanical Engineering',
        designation: 'Professor & Head of Department'
    },
    {
        username: 'hod_ce',
        password: 'password123',
        role: 'hod',
        name: 'Dr. Sunil Mehta',
        email: 'hod.ce@nitsrinagar.ac.in',
        department: 'Civil Engineering',
        designation: 'Professor & Head of Department'
    },
    {
        username: 'hod_ch',
        password: 'password123',
        role: 'hod',
        name: 'Dr. Anjali Desai',
        email: 'hod.ch@nitsrinagar.ac.in',
        department: 'Chemical Engineering',
        designation: 'Professor & Head of Department'
    }
];

// Supervisor login details - course-wise
export const SUPERVISOR_LOGINS: LoginDetail[] = [
    // Computer Science Supervisors
    {
        username: 'supervisor_cs_1',
        password: 'password123',
        role: 'supervisor',
        name: 'Dr. Priya Patel',
        email: 'priya.patel@nitsrinagar.ac.in',
        department: 'Computer Science',
        designation: 'Associate Professor',
        course: 'B.Tech'
    },
    {
        username: 'supervisor_cs_2',
        password: 'password123',
        role: 'supervisor',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@nitsrinagar.ac.in',
        department: 'Computer Science',
        designation: 'Professor',
        course: 'PhD'
    },
    // Electrical Engineering Supervisors
    {
        username: 'supervisor_ee_1',
        password: 'password123',
        role: 'supervisor',
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@nitsrinagar.ac.in',
        department: 'Electrical Engineering',
        designation: 'Assistant Professor',
        course: 'M.Tech'
    },
    // Mechanical Engineering Supervisors
    {
        username: 'supervisor_me_1',
        password: 'password123',
        role: 'supervisor',
        name: 'Dr. Neha Verma',
        email: 'neha.verma@nitsrinagar.ac.in',
        department: 'Mechanical Engineering',
        designation: 'Assistant Professor',
        course: 'M.Tech'
    },
    // Civil Engineering Supervisors
    {
        username: 'supervisor_ce_1',
        password: 'password123',
        role: 'supervisor',
        name: 'Dr. Divya Joshi',
        email: 'divya.joshi@nitsrinagar.ac.in',
        department: 'Civil Engineering',
        designation: 'Assistant Professor',
        course: 'B.Tech'
    }
];

/**
 * Finds login details by username
 * Used by the authentication service to validate credentials
 * 
 * @param username - The username to look for
 * @returns The matching login details or undefined if not found
 */
export const findLoginDetailsByUsername = (username: string): LoginDetail | undefined => {
    if (username === DEAN_LOGIN.username) {
        return DEAN_LOGIN;
    }

    const hodMatch = HOD_LOGINS.find(hod => hod.username === username);
    if (hodMatch) return hodMatch;

    const supervisorMatch = SUPERVISOR_LOGINS.find(sup => sup.username === username);
    if (supervisorMatch) return supervisorMatch;

    return undefined;
};

/**
 * Returns a list of all available usernames with their roles and names
 * Used for UI displays and test login features
 * 
 * @returns Array of username, role and name objects
 */
export const getAllUsernames = (): { username: string; role: SystemRole; name: string }[] => {
    return [
        { username: DEAN_LOGIN.username, role: DEAN_LOGIN.role, name: DEAN_LOGIN.name },
        ...HOD_LOGINS.map(hod => ({ username: hod.username, role: hod.role, name: hod.name })),
        ...SUPERVISOR_LOGINS.map(sup => ({ username: sup.username, role: sup.role, name: sup.name }))
    ];
}; 