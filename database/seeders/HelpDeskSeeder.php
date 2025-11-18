<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\User;
use App\Models\Ticket;
use App\Models\TicketComment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class HelpDeskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'email_verified_at' => now(),
        ]);

        // Create Staff Users
        $staff1 = User::create([
            'name' => 'Staff Member 1',
            'email' => 'staff1@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        $staff2 = User::create([
            'name' => 'Staff Member 2',
            'email' => 'staff2@example.com',
            'password' => Hash::make('password'),
            'role' => 'staff',
            'email_verified_at' => now(),
        ]);

        // Create Regular Users
        $user1 = User::create([
            'name' => 'John Doe',
            'email' => 'user1@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        $user2 = User::create([
            'name' => 'Jane Smith',
            'email' => 'user2@example.com',
            'password' => Hash::make('password'),
            'role' => 'user',
            'email_verified_at' => now(),
        ]);

        // Create Categories
        $itSupport = Category::create([
            'name' => 'IT Support',
            'slug' => 'it-support',
            'description' => 'Technical issues, software problems, and IT-related requests',
        ]);

        $maintenance = Category::create([
            'name' => 'Maintenance',
            'slug' => 'maintenance',
            'description' => 'Facility maintenance and repair requests',
        ]);

        $hrSupport = Category::create([
            'name' => 'HR Support',
            'slug' => 'hr-support',
            'description' => 'Human resources inquiries and requests',
        ]);

        $generalInquiry = Category::create([
            'name' => 'General Inquiry',
            'slug' => 'general-inquiry',
            'description' => 'General questions and information requests',
        ]);

        // Create Sample Tickets
        $ticket1 = Ticket::create([
            'requester_id' => $user1->id,
            'assignee_id' => $staff1->id,
            'category_id' => $itSupport->id,
            'title' => 'Unable to access email',
            'description' => "I'm unable to access my email account. I get an error message saying 'Invalid credentials' even though I'm sure my password is correct. This started happening this morning.",
            'status' => 'in_progress',
            'priority' => 'high',
        ]);

        TicketComment::create([
            'ticket_id' => $ticket1->id,
            'user_id' => $staff1->id,
            'body' => "I'm looking into this issue. Can you confirm if you've recently changed your password?",
        ]);

        TicketComment::create([
            'ticket_id' => $ticket1->id,
            'user_id' => $user1->id,
            'body' => "No, I haven't changed my password recently. It was working fine yesterday.",
        ]);

        $ticket2 = Ticket::create([
            'requester_id' => $user2->id,
            'assignee_id' => $staff2->id,
            'category_id' => $maintenance->id,
            'title' => 'Air conditioning not working in Office 301',
            'description' => 'The air conditioning unit in Office 301 has stopped working. The room is getting very warm and uncomfortable.',
            'status' => 'open',
            'priority' => 'medium',
        ]);

        $ticket3 = Ticket::create([
            'requester_id' => $user1->id,
            'category_id' => $hrSupport->id,
            'title' => 'Request for leave form',
            'description' => 'I need to submit a leave request for next week. Could you please provide me with the leave application form?',
            'status' => 'closed',
            'priority' => 'low',
        ]);

        TicketComment::create([
            'ticket_id' => $ticket3->id,
            'user_id' => $admin->id,
            'body' => 'I have sent the leave form to your email. Please fill it out and send it back.',
        ]);

        $ticket4 = Ticket::create([
            'requester_id' => $user2->id,
            'assignee_id' => $staff1->id,
            'category_id' => $itSupport->id,
            'title' => 'Request for new software installation',
            'description' => 'I need Adobe Photoshop installed on my workstation for an upcoming project. Please let me know the process for software installation requests.',
            'status' => 'open',
            'priority' => 'low',
        ]);

        $ticket5 = Ticket::create([
            'requester_id' => $user1->id,
            'category_id' => $generalInquiry->id,
            'title' => 'Question about office hours',
            'description' => 'What are the official office hours during the holiday season?',
            'status' => 'closed',
            'priority' => 'low',
        ]);

        $this->command->info('HelpDesk seeder completed successfully!');
        $this->command->info('Admin: admin@example.com / password');
        $this->command->info('Staff: staff1@example.com / password');
        $this->command->info('User: user1@example.com / password');
    }
}
