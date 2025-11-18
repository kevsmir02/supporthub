<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    /**
     * Display a listing of the user's notifications.
     */
    public function index(): Response
    {
        $notifications = auth()->user()
            ->notifications()
            ->latest()
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
        ]);
    }

    /**
     * Get unread notification count and recent notifications.
     */
    public function getUnread(): JsonResponse
    {
        $user = auth()->user();
        
        return response()->json([
            'unread_count' => $user->unreadNotifications()->count(),
            'recent' => $user->unreadNotifications()
                ->take(5)
                ->get()
                ->map(fn($n) => [
                    'id' => $n->id,
                    'data' => $n->data,
                    'created_at' => $n->created_at->diffForHumans(),
                ]),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(string $id): RedirectResponse
    {
        $notification = auth()->user()
            ->notifications()
            ->findOrFail($id);

        $notification->markAsRead();

        // Redirect to the notification URL if available
        if (isset($notification->data['url'])) {
            return redirect($notification->data['url']);
        }

        return redirect()->back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(): RedirectResponse
    {
        auth()->user()->unreadNotifications->markAsRead();

        return redirect()->back()
            ->with('success', 'All notifications marked as read.');
    }

    /**
     * Delete a notification.
     */
    public function destroy(string $id): RedirectResponse
    {
        auth()->user()
            ->notifications()
            ->findOrFail($id)
            ->delete();

        return redirect()->back()
            ->with('success', 'Notification deleted.');
    }
}

