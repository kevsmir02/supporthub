<?php

namespace App\Notifications;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class TicketNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public string $type,
        public Ticket $ticket,
        public ?User $actor = null,
        public ?string $message = null
    ) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'ticket_id' => $this->ticket->id,
            'ticket_title' => $this->ticket->title,
            'ticket_status' => $this->ticket->status,
            'actor_name' => $this->actor?->name,
            'message' => $this->message ?? $this->getDefaultMessage(),
            'url' => route('tickets.show', $this->ticket),
        ];
    }

    /**
     * Get default message based on notification type.
     */
    protected function getDefaultMessage(): string
    {
        return match($this->type) {
            'ticket_created' => "New ticket #{$this->ticket->id} has been created",
            'ticket_assigned' => "Ticket #{$this->ticket->id} has been assigned to you",
            'ticket_status_changed' => "Ticket #{$this->ticket->id} status changed to {$this->ticket->status}",
            'ticket_comment_added' => "New comment on ticket #{$this->ticket->id}",
            'ticket_updated' => "Ticket #{$this->ticket->id} has been updated",
            default => "Update on ticket #{$this->ticket->id}",
        };
    }
}

