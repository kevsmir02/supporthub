import { Head, Link, router, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { PaginatedData, Ticket } from '@/types/models';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import * as ticketsRoutes from '@/routes/tickets';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface TicketsIndexProps extends PageProps {
    tickets: PaginatedData<Ticket>;
    filters: {
        status?: string;
        priority?: string;
        category_id?: string;
        search?: string;
    };
}

export default function Index({ auth, tickets, filters }: TicketsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [priority, setPriority] = useState(filters.priority || 'all');
    const { flash } = usePage<PageProps>().props;

    // Show toast notification for flash messages
    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                ticketsRoutes.index.url(),
                {
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    priority: priority !== 'all' ? priority : undefined,
                },
                { preserveState: true, preserveScroll: true }
            );
        }, 300); // Debounce search input

        return () => clearTimeout(timeoutId);
    }, [search, status, priority]);

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
            <Head title="Tickets" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            {auth.user.role === 'user' ? 'My Tickets' : 'All Tickets'}
                        </h2>
                        <Link href={ticketsRoutes.create.url()}>
                            <Button>Create New Ticket</Button>
                        </Link>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Filters</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    placeholder="Search tickets..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="open">Open</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="closed">Closed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={priority} onValueChange={setPriority}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priorities</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Tickets List */}
                    <Card>
                        <CardContent className="p-0">
                            {tickets.data.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    No tickets found
                                </div>
                            ) : (
                                <div className="divide-y">
                                    {tickets.data.map((ticket) => (
                                        <Link
                                            key={ticket.id}
                                            href={ticketsRoutes.show.url({ ticket: ticket.id })}
                                            className="block p-6 transition hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {ticket.title}
                                                    </h3>
                                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                        {ticket.description.substring(0, 150)}
                                                        {ticket.description.length > 150 ? '...' : ''}
                                                    </p>
                                                    <div className="mt-4 flex flex-wrap items-center gap-2">
                                                        <Badge className={getStatusColor(ticket.status)}>
                                                            {ticket.status.replace('_', ' ')}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(ticket.priority)}>
                                                            {ticket.priority}
                                                        </Badge>
                                                        {ticket.category && (
                                                            <Badge variant="outline">
                                                                {ticket.category.name}
                                                            </Badge>
                                                        )}
                                                        {ticket.assignee && (
                                                            <Badge variant="secondary">
                                                                Assigned to: {ticket.assignee.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="ml-4 text-right text-sm text-gray-500">
                                                    <p className="font-medium">
                                                        #{ticket.id}
                                                    </p>
                                                    <p className="mt-1">
                                                        {new Date(ticket.created_at).toLocaleDateString()}
                                                    </p>
                                                    {ticket.requester && (
                                                        <p className="mt-2 text-xs">
                                                            By: {ticket.requester.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Pagination */}
                    {tickets.last_page > 1 && (
                        <div className="flex items-center justify-center gap-2">
                            {tickets.links.map((link, index) => (
                                <Button
                                    key={index}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url && router.get(link.url)
                                    }
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
