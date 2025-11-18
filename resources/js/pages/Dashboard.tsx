import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Category, DashboardStats, Ticket } from '@/types/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import * as ticketsRoutes from '@/routes/tickets';

interface DashboardProps extends PageProps {
    stats: DashboardStats;
    recentTickets?: Ticket[];
    myRecentTickets?: Ticket[];
    categories?: Category[];
}

export default function Dashboard({ auth, stats, recentTickets, myRecentTickets, categories }: DashboardProps) {
    const isAdmin = auth.user.role === 'admin';
    const isStaff = auth.user.role === 'staff';
    const isAdminOrStaff = isAdmin || isStaff;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-950 dark:text-blue-300';
            case 'in_progress':
                return 'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
            case 'closed':
                return 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950 dark:text-green-300';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300';
            case 'medium':
                return 'border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300';
            case 'low':
                return 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
            default:
                return 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300';
        }
    };

    return (
        <AppLayout>
            <Head title="My Tickets" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Welcome to SupportHub
                        </h2>
                        <Link href={ticketsRoutes.create.url()}>
                            <Button>Create New Ticket</Button>
                        </Link>
                    </div>
                    {/* Statistics Cards */}
                    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {isAdmin ? (
                            // Admin sees all system statistics
                            <>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Total Tickets</CardDescription>
                                        <CardTitle className="text-4xl">{stats.total_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Open Tickets</CardDescription>
                                        <CardTitle className="text-4xl">{stats.open_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>In Progress</CardDescription>
                                        <CardTitle className="text-4xl">{stats.in_progress_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Closed Tickets</CardDescription>
                                        <CardTitle className="text-4xl">{stats.closed_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </>
                        ) : isStaff ? (
                            // Staff sees only their assigned tickets
                            <>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>My Assigned</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_assigned_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Open</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_open_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>In Progress</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_in_progress_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Closed</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_closed_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </>
                        ) : (
                            // Regular users see their own tickets
                            <>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Total Tickets</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_total_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Open</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_open_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>In Progress</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_in_progress_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                                <Card>
                                    <CardHeader className="pb-2">
                                        <CardDescription>Closed</CardDescription>
                                        <CardTitle className="text-4xl">{stats.my_closed_tickets}</CardTitle>
                                    </CardHeader>
                                </Card>
                            </>
                        )}
                    </div>

                    {/* Recent Tickets */}
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {isAdmin ? 'Recent Tickets' : isStaff ? 'My Assigned Tickets' : 'My Recent Tickets'}
                            </CardTitle>
                            <CardDescription>
                                {isAdmin ? 'Latest ticket submissions in the system' : isStaff ? 'Tickets assigned to you' : 'Your latest ticket submissions'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {(recentTickets || myRecentTickets || []).length === 0 ? (
                                    <p className="text-center text-gray-500">No tickets found</p>
                                ) : (
                                    (recentTickets || myRecentTickets || []).map((ticket) => (
                                        <Link
                                            key={ticket.id}
                                            href={ticketsRoutes.show.url({ ticket: ticket.id })}
                                            className="block rounded-lg border p-4 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                        {ticket.title}
                                                    </h3>
                                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                        {ticket.description.substring(0, 100)}
                                                        {ticket.description.length > 100 ? '...' : ''}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <Badge className={getStatusColor(ticket.status)}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(ticket.priority)}>
                                                            {ticket.priority}
                                                        </Badge>
                                                        {ticket.category && (
                                                            <Badge variant="outline">{ticket.category.name}</Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4 text-right text-sm text-gray-500">
                                                    <p>{new Date(ticket.created_at).toLocaleDateString()}</p>
                                                    {ticket.requester && isAdminOrStaff && (
                                                        <p className="mt-1">{ticket.requester.name}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Categories (Admin only) */}
                    {isAdmin && categories && (
                        <Card className="mt-8">
                            <CardHeader>
                                <CardTitle>Categories Overview</CardTitle>
                                <CardDescription>Ticket distribution by category</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {categories.map((category) => (
                                        <div
                                            key={category.id}
                                            className="rounded-lg border p-4"
                                        >
                                            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {category.name}
                                            </h4>
                                            <p className="mt-1 text-2xl font-bold text-blue-600">
                                                {category.tickets_count || 0}
                                            </p>
                                            <p className="text-sm text-gray-500">tickets</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
