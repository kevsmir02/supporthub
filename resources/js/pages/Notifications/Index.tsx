import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Check, Trash2 } from 'lucide-react';

interface NotificationData {
    type: string;
    ticket_id: number;
    ticket_title: string;
    ticket_status: string;
    actor_name?: string;
    message: string;
    url: string;
}

interface Notification {
    id: string;
    type: string;
    data: NotificationData;
    read_at: string | null;
    created_at: string;
}

interface PaginatedNotifications {
    data: Notification[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface NotificationsIndexProps extends PageProps {
    notifications: PaginatedNotifications;
}

export default function Index({ notifications }: NotificationsIndexProps) {
    const handleMarkAsRead = (notificationId: string) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
        });
    };

    const handleMarkAllAsRead = () => {
        router.post('/notifications/read-all', {}, {
            preserveScroll: true,
        });
    };

    const handleDelete = (notificationId: string) => {
        if (confirm('Are you sure you want to delete this notification?')) {
            router.delete(`/notifications/${notificationId}`, {
                preserveScroll: true,
            });
        }
    };

    const getNotificationIcon = (type: string) => {
        return <Bell className="h-5 w-5 text-blue-500" />;
    };

    const unreadCount = notifications.data.filter(n => !n.read_at).length;

    return (
        <AppLayout>
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Notifications
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <Button onClick={handleMarkAllAsRead} variant="outline">
                                <Check className="mr-2 h-4 w-4" />
                                Mark all as read
                            </Button>
                        )}
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>All Notifications</CardTitle>
                            <CardDescription>
                                Stay updated on your tickets and activities
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {notifications.data.length === 0 ? (
                                <div className="py-12 text-center">
                                    <Bell className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
                                        No notifications
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        You're all caught up!
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {notifications.data.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`flex items-start justify-between rounded-lg border p-4 ${
                                                !notification.read_at
                                                    ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800'
                                                    : 'bg-white dark:bg-gray-800'
                                            }`}
                                        >
                                            <div className="flex items-start space-x-3 flex-1">
                                                <div className="mt-1">
                                                    {getNotificationIcon(notification.data.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Link
                                                        href={notification.data.url}
                                                        className="block hover:underline"
                                                        onClick={() => !notification.read_at && handleMarkAsRead(notification.id)}
                                                    >
                                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                            {notification.data.message}
                                                        </p>
                                                        <p className="mt-1 text-xs text-gray-500">
                                                            {notification.data.actor_name && (
                                                                <span className="font-medium">
                                                                    {notification.data.actor_name}
                                                                </span>
                                                            )}
                                                            {' · '}
                                                            {new Date(notification.created_at).toLocaleString()}
                                                        </p>
                                                    </Link>
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-2 ml-4">
                                                {!notification.read_at && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkAsRead(notification.id)}
                                                        title="Mark as read"
                                                    >
                                                        <Check className="h-4 w-4" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(notification.id)}
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {notifications.last_page > 1 && (
                                <div className="mt-6 flex items-center justify-between">
                                    <div className="text-sm text-gray-700 dark:text-gray-300">
                                        Showing {notifications.data.length} of {notifications.total} notifications
                                    </div>
                                    <div className="flex gap-2">
                                        {notifications.current_page > 1 && (
                                            <Link
                                                href={`/notifications?page=${notifications.current_page - 1}`}
                                                preserveScroll
                                            >
                                                <Button variant="outline" size="sm">
                                                    Previous
                                                </Button>
                                            </Link>
                                        )}
                                        {notifications.current_page < notifications.last_page && (
                                            <Link
                                                href={`/notifications?page=${notifications.current_page + 1}`}
                                                preserveScroll
                                            >
                                                <Button variant="outline" size="sm">
                                                    Next
                                                </Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
