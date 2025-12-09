export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          created_at: string
          date: string
          event_type: string | null
          id: string
          metadata: Json | null
          status: Database["public"]["Enums"]["availability_status"] | null
          vendor_id: string
        }
        Insert: {
          created_at?: string
          date: string
          event_type?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["availability_status"] | null
          vendor_id: string
        }
        Update: {
          created_at?: string
          date?: string
          event_type?: string | null
          id?: string
          metadata?: Json | null
          status?: Database["public"]["Enums"]["availability_status"] | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      banners: {
        Row: {
          active: boolean | null
          created_at: string
          display_order: number | null
          id: string
          image_path: string | null
          link: string | null
          subtitle: string | null
          title: string
        }
        Insert: {
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_path?: string | null
          link?: string | null
          subtitle?: string | null
          title: string
        }
        Update: {
          active?: boolean | null
          created_at?: string
          display_order?: number | null
          id?: string
          image_path?: string | null
          link?: string | null
          subtitle?: string | null
          title?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          customer_email: string | null
          customer_name: string | null
          customer_phone: string | null
          event_date: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          notes: string | null
          services: Json | null
          status: Database["public"]["Enums"]["booking_status"] | null
          total_price: number | null
          updated_at: string
          user_id: string | null
          vendor_ids: Json | null
          venue: string | null
        }
        Insert: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          notes?: string | null
          services?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number | null
          updated_at?: string
          user_id?: string | null
          vendor_ids?: Json | null
          venue?: string | null
        }
        Update: {
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          notes?: string | null
          services?: Json | null
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_price?: number | null
          updated_at?: string
          user_id?: string | null
          vendor_ids?: Json | null
          venue?: string | null
        }
        Relationships: []
      }
      event_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      event_plans: {
        Row: {
          ai_summary: string | null
          budget: string | null
          color_palette: string | null
          created_at: string
          event_date: string | null
          event_type: string | null
          guest_size: string | null
          id: string
          name: string
          packages: Json | null
          raw_data: Json | null
          theme: string | null
          updated_at: string
          user_id: string
          venue_type: string | null
        }
        Insert: {
          ai_summary?: string | null
          budget?: string | null
          color_palette?: string | null
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          guest_size?: string | null
          id?: string
          name: string
          packages?: Json | null
          raw_data?: Json | null
          theme?: string | null
          updated_at?: string
          user_id: string
          venue_type?: string | null
        }
        Update: {
          ai_summary?: string | null
          budget?: string | null
          color_palette?: string | null
          created_at?: string
          event_date?: string | null
          event_type?: string | null
          guest_size?: string | null
          id?: string
          name?: string
          packages?: Json | null
          raw_data?: Json | null
          theme?: string | null
          updated_at?: string
          user_id?: string
          venue_type?: string | null
        }
        Relationships: []
      }
      event_services: {
        Row: {
          available: boolean | null
          category_id: string | null
          created_at: string
          description: string | null
          duration: string | null
          features: Json | null
          id: string
          images: Json | null
          location: string | null
          price: number
          price_type: string | null
          rating: number | null
          review_count: number | null
          short_description: string | null
          title: string
          updated_at: string
          vendor_id: string
        }
        Insert: {
          available?: boolean | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: Json | null
          id?: string
          images?: Json | null
          location?: string | null
          price: number
          price_type?: string | null
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          title: string
          updated_at?: string
          vendor_id: string
        }
        Update: {
          available?: boolean | null
          category_id?: string | null
          created_at?: string
          description?: string | null
          duration?: string | null
          features?: Json | null
          id?: string
          images?: Json | null
          location?: string | null
          price?: number
          price_type?: string | null
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          title?: string
          updated_at?: string
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "event_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          created_at: string
          id: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string | null
          vendor_id: string | null
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
          vendor_id?: string | null
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean | null
          code: string
          created_at: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          id: string
          max_uses: number | null
          min_order: number | null
          used_count: number | null
          valid_from: string | null
          valid_to: string | null
          value: number
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string
          discount_type: Database["public"]["Enums"]["discount_type"]
          id?: string
          max_uses?: number | null
          min_order?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_to?: string | null
          value: number
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string
          discount_type?: Database["public"]["Enums"]["discount_type"]
          id?: string
          max_uses?: number | null
          min_order?: number | null
          used_count?: number | null
          valid_from?: string | null
          valid_to?: string | null
          value?: number
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendor_portfolio: {
        Row: {
          caption: string | null
          category: string | null
          created_at: string
          event_type: string | null
          id: string
          image_path: string
          title: string | null
          vendor_id: string
        }
        Insert: {
          caption?: string | null
          category?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          image_path: string
          title?: string | null
          vendor_id: string
        }
        Update: {
          caption?: string | null
          category?: string | null
          created_at?: string
          event_type?: string | null
          id?: string
          image_path?: string
          title?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_portfolio_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          avatar_url: string | null
          bio: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          id: string
          location: string | null
          name: string
          rating: number | null
          review_count: number | null
          slug: string
          specialty: string | null
          status: Database["public"]["Enums"]["vendor_status"] | null
          updated_at: string
          user_id: string | null
          verified: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name: string
          rating?: number | null
          review_count?: number | null
          slug: string
          specialty?: string | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          rating?: number | null
          review_count?: number | null
          slug?: string
          specialty?: string | null
          status?: Database["public"]["Enums"]["vendor_status"] | null
          updated_at?: string
          user_id?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_vendor_owner: { Args: { _vendor_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "vendor" | "user"
      availability_status: "available" | "booked" | "tentative"
      booking_status: "pending" | "in_progress" | "completed" | "cancelled"
      discount_type: "percentage" | "fixed"
      vendor_status: "pending" | "approved" | "suspended"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "vendor", "user"],
      availability_status: ["available", "booked", "tentative"],
      booking_status: ["pending", "in_progress", "completed", "cancelled"],
      discount_type: ["percentage", "fixed"],
      vendor_status: ["pending", "approved", "suspended"],
    },
  },
} as const
