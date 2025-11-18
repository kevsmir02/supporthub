<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Ticket;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        $user = auth()->user();

        if ($user->isAdmin()) {
            // Admin dashboard with overall statistics for ALL tickets
            $stats = [
                'total_tickets' => Ticket::count(),
                'open_tickets' => Ticket::where('status', 'open')->count(),
                'in_progress_tickets' => Ticket::where('status', 'in_progress')->count(),
                'closed_tickets' => Ticket::where('status', 'closed')->count(),
                'high_priority_tickets' => Ticket::where('priority', 'high')->where('status', '!=', 'closed')->count(),
            ];

            $recentTickets = Ticket::with(['requester', 'category', 'assignee'])
                ->latest()
                ->take(10)
                ->get();

            $categoriesWithCounts = Category::withCount('tickets')
                ->get();

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'recentTickets' => $recentTickets,
                'categories' => $categoriesWithCounts,
            ]);
        } elseif ($user->isStaff()) {
            // Staff dashboard with statistics for ASSIGNED tickets only
            $stats = [
                'my_assigned_tickets' => Ticket::where('assignee_id', $user->id)->count(),
                'my_open_tickets' => Ticket::where('assignee_id', $user->id)->where('status', 'open')->count(),
                'my_in_progress_tickets' => Ticket::where('assignee_id', $user->id)->where('status', 'in_progress')->count(),
                'my_closed_tickets' => Ticket::where('assignee_id', $user->id)->where('status', 'closed')->count(),
                'high_priority_tickets' => Ticket::where('assignee_id', $user->id)->where('priority', 'high')->where('status', '!=', 'closed')->count(),
            ];

            $myAssignedTickets = Ticket::with(['requester', 'category', 'assignee'])
                ->where('assignee_id', $user->id)
                ->latest()
                ->take(10)
                ->get();

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'recentTickets' => $myAssignedTickets,
            ]);
        } else {
            // Regular user dashboard with their own statistics
            $stats = [
                'my_open_tickets' => Ticket::where('requester_id', $user->id)->where('status', 'open')->count(),
                'my_in_progress_tickets' => Ticket::where('requester_id', $user->id)->where('status', 'in_progress')->count(),
                'my_closed_tickets' => Ticket::where('requester_id', $user->id)->where('status', 'closed')->count(),
                'my_total_tickets' => Ticket::where('requester_id', $user->id)->count(),
            ];

            $myRecentTickets = Ticket::with(['category', 'assignee'])
                ->where('requester_id', $user->id)
                ->latest()
                ->take(10)
                ->get();

            return Inertia::render('Dashboard', [
                'stats' => $stats,
                'myRecentTickets' => $myRecentTickets,
            ]);
        }
    }
}
