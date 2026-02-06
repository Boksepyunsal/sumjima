export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      messages: {
        Row: {
          created_at: string;
          id: number;
          message: string;
          proposal_id: number;
          sender_id: string;
        };
        Insert: {
          created_at?: string;
          id?: number;
          message: string;
          proposal_id: number;
          sender_id: string;
        };
        Update: {
          created_at?: string;
          id?: number;
          message?: string;
          proposal_id?: number;
          sender_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'messages_proposal_id_fkey';
            columns: ['proposal_id'];
            isOneToOne: false;
            referencedRelation: 'proposals';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'messages_sender_id_fkey';
            columns: ['sender_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: 'profiles_id_fkey';
            columns: ['id'];
            isOneToOne: true;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ];
      };
      proposals: {
        Row: {
          contact: string;
          created_at: string;
          id: number;
          message: string;
          price: string;
          provider_id: string;
          request_id: number;
        };
        Insert: {
          contact: string;
          created_at?: string;
          id?: number;
          message: string;
          price: string;
          provider_id: string;
          request_id: number;
        };
        Update: {
          contact?: string;
          created_at?: string;
          id?: number;
          message?: string;
          price?: string;
          provider_id?: string;
          request_id?: number;
        };
        Relationships: [
          {
            foreignKeyName: 'proposals_provider_id_fkey';
            columns: ['provider_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'proposals_request_id_fkey';
            columns: ['request_id'];
            isOneToOne: false;
            referencedRelation: 'requests';
            referencedColumns: ['id'];
          },
        ];
      };
      requests: {
        Row: {
          author_id: string;
          category: string;
          created_at: string;
          description: string;
          id: number;
          region: string;
          status: string;
          title: string;
        };
        Insert: {
          author_id: string;
          category: string;
          created_at?: string;
          description: string;
          id?: number;
          region: string;
          status?: string;
          title: string;
        };
        Update: {
          author_id?: string;
          category?: string;
          created_at?: string;
          description?: string;
          id?: number;
          region?: string;
          status?: string;
          title?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'requests_author_id_fkey';
            columns: ['author_id'];
            isOneToOne: false;
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      handle_new_user: {
        Args: Record<PropertyKey, never>;
        Returns: Record<PropertyKey, never>;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
