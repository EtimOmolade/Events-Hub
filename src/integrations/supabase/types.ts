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
          booking_id: string | null
          created_at: string | null
          date: string
          event_type: string | null
          id: string
          status: string | null
          vendor_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          date: string
          event_type?: string | null
          id?: string
          status?: string | null
          vendor_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          date?: string
          event_type?: string | null
          id?: string
          status?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
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
          created_at: string | null
          id: string
          image_url: string | null
          link_text: string | null
          link_url: string | null
          position: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          link_text?: string | null
          link_url?: string | null
          position?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          active?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          link_text?: string | null
          link_url?: string | null
          position?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          event_date: string
          event_type: string | null
          guest_count: number | null
          id: string
          notes: string | null
          service_id: string | null
          status: string | null
          total_price: number | null
          updated_at: string | null
          user_id: string
          vendor_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_date: string
          event_type?: string | null
          guest_count?: number | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id: string
          vendor_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_date?: string
          event_type?: string | null
          guest_count?: number | null
          id?: string
          notes?: string | null
          service_id?: string | null
          status?: string | null
          total_price?: number | null
          updated_at?: string | null
          user_id?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      event_plans: {
        Row: {
          ai_conversation: Json | null
          ai_summary: string | null
          budget: number | null
          colors: string | null
          created_at: string | null
          event_date: string | null
          event_type: string | null
          guest_count: number | null
          id: string
          name: string
          notes: string | null
          raw_query: string | null
          selected_services: Json | null
          selected_vendors: Json | null
          theme: string | null
          timeline: Json | null
          updated_at: string | null
          user_id: string
          venue: string | null
        }
        Insert: {
          ai_conversation?: Json | null
          ai_summary?: string | null
          budget?: number | null
          colors?: string | null
          created_at?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          name: string
          notes?: string | null
          raw_query?: string | null
          selected_services?: Json | null
          selected_vendors?: Json | null
          theme?: string | null
          timeline?: Json | null
          updated_at?: string | null
          user_id: string
          venue?: string | null
        }
        Update: {
          ai_conversation?: Json | null
          ai_summary?: string | null
          budget?: number | null
          colors?: string | null
          created_at?: string | null
          event_date?: string | null
          event_type?: string | null
          guest_count?: number | null
          id?: string
          name?: string
          notes?: string | null
          raw_query?: string | null
          selected_services?: Json | null
          selected_vendors?: Json | null
          theme?: string | null
          timeline?: Json | null
          updated_at?: string | null
          user_id?: string
          venue?: string | null
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          read: boolean | null
          receiver_id: string | null
          sender_id: string
          vendor_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id: string
          vendor_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          receiver_id?: string | null
          sender_id?: string
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
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      promotions: {
        Row: {
          active: boolean | null
          code: string
          created_at: string | null
          description: string | null
          discount_type: string | null
          discount_value: number
          id: string
          max_uses: number | null
          min_purchase: number | null
          uses_count: number | null
          valid_from: string | null
          valid_until: string | null
        }
        Insert: {
          active?: boolean | null
          code: string
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value: number
          id?: string
          max_uses?: number | null
          min_purchase?: number | null
          uses_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Update: {
          active?: boolean | null
          code?: string
          created_at?: string | null
          description?: string | null
          discount_type?: string | null
          discount_value?: number
          id?: string
          max_uses?: number | null
          min_purchase?: number | null
          uses_count?: number | null
          valid_from?: string | null
          valid_until?: string | null
        }
        Relationships: []
      }
      services: {
        Row: {
          available: boolean | null
          category_id: string | null
          created_at: string | null
          description: string | null
          features: string[] | null
          id: string
          images: string[] | null
          location: string | null
          name: string
          price: number
          price_type: string | null
          rating: number | null
          review_count: number | null
          short_description: string | null
          updated_at: string | null
          vendor_id: string | null
        }
        Insert: {
          available?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          location?: string | null
          name: string
          price: number
          price_type?: string | null
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Update: {
          available?: boolean | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          location?: string | null
          name?: string
          price?: number
          price_type?: string | null
          rating?: number | null
          review_count?: number | null
          short_description?: string | null
          updated_at?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "services_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      vendors: {
        Row: {
          active: boolean | null
          avatar: string | null
          bio: string | null
          created_at: string | null
          id: string
          location: string | null
          name: string
          rating: number | null
          review_count: number | null
          specialty: string | null
          updated_at: string | null
          verified: boolean | null
        }
        Insert: {
          active?: boolean | null
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name: string
          rating?: number | null
          review_count?: number | null
          specialty?: string | null
          updated_at?: string | null
          verified?: boolean | null
        }
        Update: {
          active?: boolean | null
          avatar?: string | null
          bio?: string | null
          created_at?: string | null
          id?: string
          location?: string | null
          name?: string
          rating?: number | null
          review_count?: number | null
          specialty?: string | null
          updated_at?: string | null
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
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
