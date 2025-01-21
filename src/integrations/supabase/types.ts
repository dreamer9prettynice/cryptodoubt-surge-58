export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bet_participants: {
        Row: {
          amount: number
          bet_id: string | null
          choice: string
          created_at: string | null
          id: string
          participation_tx_hash: string | null
          user_id: string | null
          wallet_address: string | null
        }
        Insert: {
          amount: number
          bet_id?: string | null
          choice: string
          created_at?: string | null
          id?: string
          participation_tx_hash?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Update: {
          amount?: number
          bet_id?: string | null
          choice?: string
          created_at?: string | null
          id?: string
          participation_tx_hash?: string | null
          user_id?: string | null
          wallet_address?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bet_participants_bet_id_fkey"
            columns: ["bet_id"]
            isOneToOne: false
            referencedRelation: "bets"
            referencedColumns: ["id"]
          },
        ]
      }
      bets: {
        Row: {
          contract_address: string | null
          created_at: string | null
          creation_tx_hash: string | null
          creator_id: string | null
          creator_wallet: string | null
          expiration_time: string
          fee_percentage: number
          id: string
          no_amount: number
          pool_address: string
          pool_amount: number
          reason: string
          status: string | null
          title: string
          total_amount: number
          updated_at: string | null
          winner: string | null
          yes_amount: number
        }
        Insert: {
          contract_address?: string | null
          created_at?: string | null
          creation_tx_hash?: string | null
          creator_id?: string | null
          creator_wallet?: string | null
          expiration_time: string
          fee_percentage?: number
          id?: string
          no_amount?: number
          pool_address?: string
          pool_amount?: number
          reason: string
          status?: string | null
          title: string
          total_amount: number
          updated_at?: string | null
          winner?: string | null
          yes_amount?: number
        }
        Update: {
          contract_address?: string | null
          created_at?: string | null
          creation_tx_hash?: string | null
          creator_id?: string | null
          creator_wallet?: string | null
          expiration_time?: string
          fee_percentage?: number
          id?: string
          no_amount?: number
          pool_address?: string
          pool_amount?: number
          reason?: string
          status?: string | null
          title?: string
          total_amount?: number
          updated_at?: string | null
          winner?: string | null
          yes_amount?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      apply_fee_and_update_pool: {
        Args: {
          p_amount: number
          p_fee_percentage: number
        }
        Returns: number
      }
      calculate_winner_share: {
        Args: {
          bet_amount: number
          total_winning_side_amount: number
          total_pool_amount: number
        }
        Returns: number
      }
      distribute_bet_winnings: {
        Args: {
          p_bet_id: string
          p_winning_side: string
        }
        Returns: {
          wallet_address: string
          winning_amount: number
        }[]
      }
      increment_bet_amount: {
        Args: {
          p_bet_id: string
          p_amount: number
          p_column: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never