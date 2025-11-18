<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RequestController extends Controller
{
    /**
     * Display a listing of service requests visible to the user.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::with(['requester', 'assignee', 'category'])
            ->latest();

        // Role-based access control:
        // - Admin: see all tickets
        // - Staff: see tickets assigned to them OR tickets they created
        // - User: see only their own tickets
        if (auth()->user()->isUser()) {
            $query->where('requester_id', auth()->id());
        } elseif (auth()->user()->isStaff()) {
            $query->where(function ($q) {
                $q->where('assignee_id', auth()->id())
                  ->orWhere('requester_id', auth()->id());
            });
        }
        // Admin sees all (no filter)

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by priority if provided
        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Search by title or description
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $requests = $query->paginate(15)->withQueryString();

        return Inertia::render('Requests/Index', [
            'requests' => $requests,
            'filters' => $request->only(['status', 'priority', 'search']),
        ]);
    }
}
