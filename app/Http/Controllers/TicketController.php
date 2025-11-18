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

        // Notify only admins about new ticket (not staff, since it's not assigned yet)
        $admins = User::where('role', 'admin')->get();
        Notification::send($admins, new TicketNotification(
            'ticket_created',
            $ticket,
            auth()->user()
        ));

        // User-specific toast message
        $toastMessage = 'Your request has been submitted successfully';

        return redirect()->route('tickets.show', $ticket)
            ->with('success', $toastMessage);
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
        // Only the requester can edit the ticket data
        if ($ticket->requester_id !== auth()->id()) {
            abort(403, 'Only the ticket creator can edit ticket details.');
        }

        // Users can only edit if ticket is still open (not assigned or in progress)
        if ($ticket->status !== 'open' || $ticket->assignee_id !== null) {
            abort(403, 'Cannot edit ticket once it has been assigned or status changed.');
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
        $currentUser = auth()->user();

        // Determine what kind of update this is
        $isStatusOrAssignmentUpdate = $request->has('status') || $request->has('assignee_id');
        $isTicketDataUpdate = $request->has('title') || $request->has('description') || $request->has('category_id') || $request->has('priority');

        // Admin and Staff can ONLY update status/assignment, NOT ticket data
        if (($currentUser->isAdmin() || $currentUser->isStaff()) && $isTicketDataUpdate) {
            abort(403, 'Admin and Staff cannot edit ticket details. Only status and assignment can be changed.');
        }

        // Users can ONLY update ticket data, NOT status/assignment (except via Edit form)
        // Users can only edit their own tickets
        if ($currentUser->isUser()) {
            if ($ticket->requester_id !== $currentUser->id) {
                abort(403, 'You can only edit your own tickets.');
            }

            // If updating ticket data, check if ticket is still open and unassigned
            if ($isTicketDataUpdate) {
                if ($ticket->status !== 'open' || $ticket->assignee_id !== null) {
                    abort(403, 'Cannot edit ticket once it has been assigned or status changed.');
                }
            }
        }

        $validated = $request->validate([
            'category_id' => 'sometimes|exists:categories,id',
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'priority' => 'sometimes|in:low,medium,high',
            'status' => 'sometimes|in:open,in_progress,closed',
            'assignee_id' => 'nullable|exists:users,id',
        ]);

        // Users can't change assignee or status (only via status update form on Show page)
        if ($currentUser->isUser()) {
            unset($validated['assignee_id']);
            unset($validated['status']);
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

        // Generate role-specific and context-aware toast message
        $toastMessage = 'Ticket updated successfully';
        $currentUser = auth()->user();

        if (isset($validated['status']) && $oldStatus !== $validated['status']) {
            // Status changed - message depends on role and action
            if ($currentUser->isAdmin() || $currentUser->isStaff()) {
                $toastMessage = match($validated['status']) {
                    'open' => 'Ticket has been reopened',
                    'in_progress' => 'Ticket is now being worked on',
                    'closed' => 'Ticket has been resolved and closed',
                    default => 'Ticket status updated',
                };
            }
        } elseif (isset($validated['assignee_id']) && $oldAssigneeId !== $validated['assignee_id']) {
            // Assignee changed - only admins can do this
            if ($currentUser->isAdmin()) {
                $assigneeName = User::find($validated['assignee_id'])?->name ?? 'Unassigned';
                $toastMessage = $validated['assignee_id']
                    ? "Ticket assigned to {$assigneeName}"
                    : 'Ticket unassigned';
            }
        }

        return redirect()->route('tickets.show', $ticket)
            ->with('success', $toastMessage);
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

        // Role-specific toast message
        $toastMessage = auth()->user()->isAdmin()
            ? 'Ticket deleted successfully'
            : 'Your request has been deleted';

        return redirect()->route('tickets.index')
            ->with('success', $toastMessage);
    }
}
