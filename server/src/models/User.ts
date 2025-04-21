// Import required dependencies
// supabase: Our database client for interacting with Supabase
// bcryptjs: A library for hashing passwords securely
import { supabase } from '../config/supabase';
import bcrypt from 'bcryptjs';

// Define the structure of a User object
// This interface tells TypeScript what properties a User must have
export interface IUser {
  id: string;          // A unique identifier for each user (like a social security number)
  email: string;       // The user's email address (used for login)
  password: string;    // The user's hashed password (never stored as plain text)
  name: string;        // The user's full name
  role: string;        // The user's role (e.g., 'user', 'admin')
  created_at: Date;    // When the user account was created
  updated_at: Date;    // When the user account was last updated
  passwordChangedAt?: Date;  // When the user last changed their password (optional)
}

// The User class contains all the methods for working with user data in the database
export class User {
  // Create a new user in the database
  // This is like signing up for a new account
  static async create(data: Omit<IUser, 'id' | 'created_at' | 'updated_at'>): Promise<IUser> {
    // Hash the password before storing it
    // Hashing is like putting the password through a one-way encryption
    // It can't be reversed, but we can check if a password matches the hash
    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    // Insert the new user into the database
    // Supabase will automatically generate an ID and timestamps
    const { data: user, error } = await supabase
      .from('users')  // Select the 'users' table
      .insert([       // Insert a new row
        {
          email: data.email,
          password: hashedPassword,
          name: data.name,
          role: data.role || 'user'  // Default to 'user' role if not specified
        }
      ])
      .select()       // Get the inserted data back
      .single();      // We expect only one result

    // If there's an error, throw it to be handled by the calling code
    if (error) throw error;
    return user;
  }

  // Find a user by their email address
  // This is used during login to check if the email exists
  static async findByEmail(email: string): Promise<IUser | null> {
    // Query the database for a user with matching email
    const { data: user, error } = await supabase
      .from('users')           // Select the 'users' table
      .select('*')            // Get all columns
      .eq('email', email)     // Where email equals the provided email
      .single();              // We expect only one result

    // If there's an error or no user found, return null
    if (error) return null;
    return user;
  }

  // Find a user by their ID
  // This is used to get user details when we only know their ID
  static async findById(id: string): Promise<IUser | null> {
    // Query the database for a user with matching ID
    const { data: user, error } = await supabase
      .from('users')          // Select the 'users' table
      .select('*')           // Get all columns
      .eq('id', id)          // Where id equals the provided id
      .single();             // We expect only one result

    // If there's an error or no user found, return null
    if (error) return null;
    return user;
  }

  // Update an existing user's information
  // This is used when a user wants to change their details
  static async update(id: string, data: Partial<IUser>): Promise<IUser | null> {
    // If the password is being updated, hash the new password
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    // Update the user's data in the database
    const { data: user, error } = await supabase
      .from('users')          // Select the 'users' table
      .update(data)           // Update with the new data
      .eq('id', id)           // Where id equals the provided id
      .select()               // Get the updated data back
      .single();              // We expect only one result

    // If there's an error, return null
    if (error) return null;
    return user;
  }

  // Compare a plain text password with a hashed password
  // This is used during login to check if the password is correct
  static async comparePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    // bcrypt.compare checks if the plain password matches the hash
    // It handles all the complex cryptography for us
    return bcrypt.compare(plainPassword, hashedPassword);
  }
} 