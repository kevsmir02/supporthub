<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Notifications\TicketNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

class TicketCommentController extends Controller
{
    /**
     * Store a newly created comment in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'body' => 'required|string',
        ]);

        $ticket = Ticket::findOrFail($validated['ticket_id']);

        // Authorization: users can only comment on their own tickets or if they're staff/admin
        if (auth()->user()->isUser() && $ticket->requester_id !== auth()->id()) {
            abort(403, 'Unauthorized to comment on this ticket.');
        }

        $comment = TicketComment::create([
            'ticket_id' => $validated['ticket_id'],
            'user_id' => auth()->id(),
            'body' => $validated['body'],
        ]);

        // Notify relevant users about new comment
        $usersToNotify = collect();
        
        // Notify requester if comment is not from them
        if ($ticket->requester_id !== auth()->id()) {
            $usersToNotify->push($ticket->requester);
        }
        
        // Notify assignee if exists and comment is not from them
        if ($ticket->assignee_id && $ticket->assignee_id !== auth()->id()) {
            $usersToNotify->push($ticket->assignee);
        }
        
        // Notify other commenters (excluding current user)
        $otherCommenters = $ticket->comments()
            ->where('user_id', '!=', auth()->id())
            ->pluck('user_id')
            ->unique()
            ->map(fn($id) => \App\Models\User::find($id))
            ->filter();
        
        $usersToNotify = $usersToNotify->merge($otherCommenters)->unique('id');
        
        if ($usersToNotify->isNotEmpty()) {
            Notification::send($usersToNotify, new TicketNotification(
                'ticket_comment_added',
                $ticket,
                auth()->user()
            ));
        }

        // Role-specific toast message
        $toastMessage = auth()->user()->isUser()
            ? 'Your comment has been posted'
            : 'Comment added successfully';

        return redirect()->back()
            ->with('success', $toastMessage);
    }

    /**
     * Update the specified comment in storage.
     */
    public function update(Request $request, TicketComment $comment): RedirectResponse
    {
        // Only the comment author can update their comment
        if ($comment->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to update this comment.');
        }

        $validated = $request->validate([
            'body' => 'required|string',
        ]);

        $comment->update($validated);

        return redirect()->back()
            ->with('success', 'Comment updated successfully.');
    }

    /**
     * Remove the specified comment from storage.
     */
    public function destroy(TicketComment $comment): RedirectResponse
    {
        // Only the comment author or admin can delete the comment
        if ($comment->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
            abort(403, 'Unauthorized to delete this comment.');
        }

        $comment->delete();

        return redirect()->back()
            ->with('success', 'Comment deleted successfully.');
    }
}
