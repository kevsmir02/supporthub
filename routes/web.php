<?php

use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\AiChatController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RequestController;
use App\Http\Controllers\TicketCommentController;
use App\Http\Controllers\TicketController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // All Requests - Public view for all users
    Route::get('requests', [RequestController::class, 'index'])->name('requests.index');

    // Tickets - Available to all authenticated users
    Route::resource('tickets', TicketController::class);

    // Ticket Comments - Available to all authenticated users
    Route::post('comments', [TicketCommentController::class, 'store'])->name('comments.store');
    Route::patch('comments/{comment}', [TicketCommentController::class, 'update'])->name('comments.update');
    Route::delete('comments/{comment}', [TicketCommentController::class, 'destroy'])->name('comments.destroy');

    // Notifications - Available to all authenticated users
    Route::get('notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::get('notifications/unread', [NotificationController::class, 'getUnread'])->name('notifications.unread');
    Route::post('notifications/{id}/read', [NotificationController::class, 'markAsRead'])->name('notifications.read');
    Route::post('notifications/read-all', [NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
    Route::delete('notifications/{id}', [NotificationController::class, 'destroy'])->name('notifications.destroy');

    // AI Chat - Available to all authenticated users
    Route::post('ai/chat', [AiChatController::class, 'chat'])->name('ai.chat');

    // Categories - Admin only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('categories', CategoryController::class);
    });

    // Admin User Management - Admin only routes
    Route::middleware(['role:admin'])->group(function () {
        Route::resource('admin/users', AdminUserController::class)
            ->names([
                'index' => 'admin.users.index',
                'create' => 'admin.users.create',
                'store' => 'admin.users.store',
                'show' => 'admin.users.show',
                'edit' => 'admin.users.edit',
                'update' => 'admin.users.update',
                'destroy' => 'admin.users.destroy',
            ]);
    });
});

require __DIR__.'/settings.php';
