export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'staff' | 'user';
    created_at: string;
    updated_at: string;
    requested_tickets_count?: number;
    assigned_tickets_count?: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    created_at: string;
    updated_at: string;
    tickets_count?: number;
}

export interface Ticket {
    id: number;
    requester_id: number;
    assignee_id?: number;
    category_id: number;
    title: string;
    description: string;
    status: 'open' | 'in_progress' | 'closed';
    priority: 'low' | 'medium' | 'high';
    created_at: string;
    updated_at: string;
    requester?: User;
    assignee?: User;
    category?: Category;
    comments?: TicketComment[];
    attachments?: Attachment[];
}

export interface TicketComment {
    id: number;
    ticket_id: number;
    user_id: number;
    body: string;
    created_at: string;
    updated_at: string;
    user?: User;
    ticket?: Ticket;
}

export interface Attachment {
    id: number;
    ticket_id: number;
    uploader_id: number;
    file_name: string;
    file_path: string;
    mime_type: string;
    created_at: string;
    updated_at: string;
    ticket?: Ticket;
    uploader?: User;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface DashboardStats {
    total_tickets?: number;
    open_tickets?: number;
    in_progress_tickets?: number;
    closed_tickets?: number;
    high_priority_tickets?: number;
    my_open_tickets?: number;
    my_in_progress_tickets?: number;
    my_closed_tickets?: number;
    my_total_tickets?: number;
}
