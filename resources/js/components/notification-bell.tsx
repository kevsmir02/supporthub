import { Bell } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface Notification {
    id: string;
    data: {
        type: string;
        ticket_id: number;
        ticket_title: string;
        ticket_status?: string;
        actor_name?: string;
        message: string;
        url: string;
    };
    created_at: string;
    read_at: string | null;
}

export function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [recentNotifications, setRecentNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications/unread');
            setUnreadCount(response.data.unread_count);
            setRecentNotifications(response.data.recent);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        
        return () => clearInterval(interval);
    }, []);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read
            await axios.post(`/notifications/${notification.id}/read`);
            fetchNotifications();
            setIsOpen(false);
            
            // Navigate to the ticket
            window.location.href = notification.data.url;
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axios.post('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Failed to mark all as read:', error);
        }
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                        >
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-auto p-0 text-xs text-blue-600 hover:text-blue-800"
                        >
                            Mark all as read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                
                {recentNotifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                        No new notifications
                    </div>
                ) : (
                    <>
                        {recentNotifications.map((notification) => (
                            <DropdownMenuItem
                                key={notification.id}
                                className="cursor-pointer p-3 focus:bg-gray-100 dark:focus:bg-gray-800"
                                onSelect={(e) => {
                                    e.preventDefault();
                                    handleNotificationClick(notification);
                                }}
                            >
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {notification.data.message}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(notification.created_at).toLocaleString()}
                                    </p>
                                </div>
                            </DropdownMenuItem>
                        ))}
                    </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link
                        href="/notifications"
                        className="text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer w-full justify-center"
                    >
                        View all notifications
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
