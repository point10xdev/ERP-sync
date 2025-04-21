/**
 * MOCK FACULTY DATA MODULE
 * 
 * This file provides a static dataset of faculty members for the ERP system.
 * It contains structured data for faculty across different departments and roles.
 * 
 * Purpose:
 * - Provides test data for development and testing without a backend
 * - Establishes relationships between faculty and departments
 * - Defines faculty with different roles (HOD, supervisor)
 * - Used for filtering students by supervisor/department
 * 
 * Data structure:
 * - Each faculty member has a unique ID 
 * - Faculty members are linked to departments
 * - Each faculty has a specific role (HOD or supervisor)
 * - These IDs are referenced in the student data to establish relationships
 * 
 * This mock data synchronizes with the loginCredentials.ts file to maintain
 * consistency between login profiles and faculty member information.
 */

import { Faculty } from '../types/schema';

// Sample mock data for faculty members in various departments
export const MOCKING_FACULTY_DATA: Faculty[] = [
    {
        id: 'f1',
        user: 'hod_cs',
        name: 'Dr. Aditya Sharma',
        email: 'aditya.sharma@nitsrinagar.ac.in',
        phone_number: '9876543210',
        department: 'Computer Science',
        designation: 'Associate Professor',
        role: 'hod',
        profile_pic: ''
    },
    {
        id: 'f2',
        user: 'supervisor_cs_1',
        name: 'Dr. Priya Patel',
        email: 'priya.patel@nitsrinagar.ac.in',
        phone_number: '9876543211',
        department: 'Computer Science',
        designation: 'Assistant Professor',
        role: 'supervisor',
        profile_pic: ''
    },
    {
        id: 'f3',
        user: 'supervisor_cs_2',
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@nitsrinagar.ac.in',
        phone_number: '9876543212',
        department: 'Computer Science',
        designation: 'Professor',
        role: 'supervisor',
        profile_pic: ''
    },
    {
        id: 'f4',
        user: 'hod_ee',
        name: 'Dr. Sneha Gupta',
        email: 'sneha.gupta@nitsrinagar.ac.in',
        phone_number: '9876543213',
        department: 'Electrical Engineering',
        designation: 'Associate Professor',
        role: 'hod',
        profile_pic: ''
    },
    {
        id: 'f5',
        user: 'supervisor_ee_1',
        name: 'Dr. Vikram Singh',
        email: 'vikram.singh@nitsrinagar.ac.in',
        phone_number: '9876543214',
        department: 'Electrical Engineering',
        designation: 'Assistant Professor',
        role: 'supervisor',
        profile_pic: ''
    },
    {
        id: 'f6',
        user: 'hod_me',
        name: 'Dr. Aamir Khan',
        email: 'aamir.khan@nitsrinagar.ac.in',
        phone_number: '9876543215',
        department: 'Mechanical Engineering',
        designation: 'Professor',
        role: 'hod',
        profile_pic: ''
    },
    {
        id: 'f7',
        user: 'supervisor_me_1',
        name: 'Dr. Neha Verma',
        email: 'neha.verma@nitsrinagar.ac.in',
        phone_number: '9876543216',
        department: 'Mechanical Engineering',
        designation: 'Assistant Professor',
        role: 'supervisor',
        profile_pic: ''
    },
    {
        id: 'f8',
        user: 'hod_ce',
        name: 'Dr. Sunil Mehta',
        email: 'sunil.mehta@nitsrinagar.ac.in',
        phone_number: '9876543217',
        department: 'Civil Engineering',
        designation: 'Associate Professor',
        role: 'hod',
        profile_pic: ''
    },
    {
        id: 'f9',
        user: 'supervisor_ce_1',
        name: 'Dr. Divya Joshi',
        email: 'divya.joshi@nitsrinagar.ac.in',
        phone_number: '9876543218',
        department: 'Civil Engineering',
        designation: 'Assistant Professor',
        role: 'supervisor',
        profile_pic: ''
    },
    {
        id: 'f10',
        user: 'hod_ch',
        name: 'Dr. Anjali Desai',
        email: 'anjali.desai@nitsrinagar.ac.in',
        phone_number: '9876543219',
        department: 'Chemical Engineering',
        designation: 'Professor',
        role: 'hod',
        profile_pic: ''
    },
    {
        id: 'f11',
        user: 'dean_user',
        name: 'Dr. Prakash Verma',
        email: 'dean@nitsrinagar.ac.in',
        phone_number: '9876543220',
        department: 'Administration',
        designation: 'Dean of Academic Affairs',
        role: 'dean',
        profile_pic: ''
    }
]; 