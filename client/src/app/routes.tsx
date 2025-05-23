export const ROUTES = {
  FACULTY_LOGIN: "/faculty-login",
  STUDENT_LOGIN: "/student-login",

  SIGNUP: "/signup",

  DASHBOARD: "/dashboard",
  MY_PROFILE: "/dashboard/my-profile",
  MY_STUDENTS: "/dashboard/my-students",
  DEPARTMENT_FACULTY: "/dashboard/department-faculty",
  SUPERVISOR: "/dashboard/supervisor",
  STUDENT_VERIFICATION: "/dashboard/supervisor/student-verification",
  SUBJECT_ASSIGNMENT: "/dashboard/supervisor/subject-assignment",
  SEMESTER: "/dashboard/supervisor/semester",

  CURRENT_SCHOLARSHIP: "/dashboard/scholarship/current",
  PREVIOUS_SCHOLARSHIPS: "/dashboard/scholarship/previous",

  
} as const;

// as const tells TypeScript to:
//   Treat object values as literal types, not just string or number.  
//   Make the object and its properties readonly (immutable).