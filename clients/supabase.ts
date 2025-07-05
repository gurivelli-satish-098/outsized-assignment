import { createClient, SupabaseClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();

/**
 * Singleton for managing Supabase client connection.
 */
export class SupabaseConnection {
  private static instance: SupabaseConnection | null;
  private supabaseUrl!: string;
  private supabaseKey!: string;
  private supabase!: SupabaseClient;
  private isInitialized!: boolean;

  constructor() {
    if (SupabaseConnection.instance) {
      return SupabaseConnection.instance;
    }
    this.supabaseUrl = process.env.SUPABASE_URL || "";
    this.supabaseKey = process.env.SUPABASE_KEY || "";
    if (!this.supabaseUrl || !this.supabaseKey) {
      throw new Error(
        "Missing required Supabase environment variables: SUPABASE_URL and SUPABASE_KEY"
      );
    }
    this.isInitialized = false;
    SupabaseConnection.instance = this;
  }

  /**
   * Initialize the Supabase client connection.
   * @returns {SupabaseConnection} The initialized instance.
   */
  initialize() {
    if (this.isInitialized) {
      return this;
    }
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
      db: {
        schema: "public",
      },
    });
    this.isInitialized = true;
    return this;
  }

  /**
   * Get the Supabase client instance.
   * @returns {SupabaseClient} The Supabase client.
   */
  getClient = (): SupabaseClient => {
    if (!this.isInitialized) {
      this.initialize();
    }
    return this.supabase!;
  };

  /**
   * Get the singleton instance of SupabaseConnection.
   * @returns {SupabaseConnection} The singleton instance.
   */
  static getInstance(): SupabaseConnection {
    if (!SupabaseConnection.instance) {
      SupabaseConnection.instance = new SupabaseConnection();
    }
    return SupabaseConnection.instance;
  }

  /**
   * Reset the singleton instance (for testing).
   */
  static resetInstance() {
    SupabaseConnection.instance = null;
  }
}
