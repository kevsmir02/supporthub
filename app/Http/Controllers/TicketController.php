<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\User;
use App\Notifications\TicketNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;
use Inertia\Response;

class TicketController extends Controller
{
    /**
     * Display a listing of the tickets.
     */
    public function index(Request $request): Response
    {
        $query = Ticket::with(['requester', 'assignee', 'category'])
            ->latest();

        // Filter by status if provided
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Filter by priority if provided
        if ($request->has('priority') && $request->priority !== 'all') {
            $query->where('priority', $request->priority);
        }

        // Filter by category if provided
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search by title or description
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        // Role-based access control:
        // - Admin: see all tickets
        // - Staff: see only tickets assigned to them
        // - User: see only their own tickets
        if (auth()->user()->isUser()) {
            $query->where('requester_id', auth()->id());
        } elseif (auth()->user()->isStaff()) {
            $query->where('assignee_id', auth()->id());
        }
        // Admin sees all (no filter)

        $tickets = $query->paginate(15)->withQueryString();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only(['status', 'priority', 'category_id', 'search']),
        ]);
    }

    /**
     * Show the form for creating a new ticket.
     */
    public function create(): Response
    {
        $categories = \App\Models\Category::all();
        
        return Inertia::render('Tickets/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created ticket in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:categories,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        $ticket = Ticket::create([
            'requester_id' => auth()->id(),
            'category_id' => $validated['category_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'status' => 'open',
        ]);

        // Notify all staff and admins about new ticket
        $staffAndAdmins = User::whereIn('role', ['admin', 'staff'])->get();
        Notification::send($staffAndAdmins, new TicketNotification(
            'ticket_created',
            $ticket,
            auth()->user()
        ));

        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket created successfully.');
    }

    /**
     * Display the specified ticket.
     */
    public function show(Ticket $ticket): Response
    {
        // Load relationships with nested relationships
        $ticket->load([
            'requester',
            'assignee',
            'category',
            'comments.user',
            'attachments.uploader'
        ]);

        // Authorization check
        // Users can only see their own tickets
        if (auth()->user()->isUser() && $ticket->requester_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this ticket.');
        }
        // Staff can only see tickets assigned to them
        if (auth()->user()->isStaff() && $ticket->assignee_id !== auth()->id()) {
            abort(403, 'Unauthorized access to this ticket.');
        }
        // Admin can see all tickets

        // Get all staff and admin users for assignment dropdown
        $staffUsers = User::whereIn('role', ['admin', 'staff'])
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role']);

        return Inertia::render('Tickets/Show', [
            'ticket' => $ticket,
            'staffUsers' => $staffUsers,
        ]);
    }

    /**
     * Show the form for editing the specified ticket.
     */
    public function edit(Ticket $ticket): Response
    {
        // Authorization check
        if (auth()->user()->isUser() && $ticket->requester_id !== auth()->id()) {
            abort(403, 'Unauthorized to edit this ticket.');
        }

        $ticket->load(['category']);

        return Inertia::render('Tickets/Edit', [
            'ticket' => $ticket,
        ]);
    }

    /**
     * Update the specified ticket in storage.
     */
    public function update(Request $request, Ticket $ticket): RedirectResponse
    {
        // Authorization check
        if (auth()->user()->isUser() && $ticket->requester_id !== auth()->id()) {
            abort(403, 'Unauthorized to update this ticket.');
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:open,in_progress,closed',
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        // Regular users can't change assignee or status to closed
        if (auth()->user()->isUser()) {
            unset($validated['assignee_id']);
            if (isset($validated['status']) && $validated['status'] === 'closed') {
                unset($validated['status']);
            }
        }

        $oldStatus = $ticket->status;
        $oldAssigneeId = $ticket->assignee_id;
        
        $ticket->update($validated);

        // Notify requester if status changed
        if (isset($validated['status']) && $oldStatus !== $validated['status']) {
            $ticket->requester->notify(new TicketNotification(
                'ticket_status_changed',
                $ticket,
                auth()->user()
            ));
        }

        // Notify new assignee if ticket was assigned
        if (isset($validated['assignee_id']) && $validated['assignee_id'] && $oldAssigneeId !== $validated['assignee_id']) {
            $assignee = User::find($validated['assignee_id']);
            $assignee?->notify(new TicketNotification(
                'ticket_assigned',
                $ticket,
                auth()->user()
            ));
        }

        return redirect()->route('tickets.show', $ticket)
            ->with('success', 'Ticket updated successfully.');
    }

    /**
     * Remove the specified ticket from storage.
     */
    public function destroy(Ticket $ticket): RedirectResponse
    {
        // Only admins and the requester can delete tickets
        if (!auth()->user()->isAdmin() && $ticket->requester_id !== auth()->id()) {
            abort(403, 'Unauthorized to delete this ticket.');
        }

        $ticket->delete();

        return redirect()->route('tickets.index')
            ->with('success', 'Ticket deleted successfully.');
    }
}
