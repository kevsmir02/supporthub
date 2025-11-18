import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { PaginatedData, Ticket } from '@/types/models';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';

interface RequestsIndexProps extends PageProps {
    requests: PaginatedData<Ticket>;
    filters: {
        status?: string;
        priority?: string;
        category_id?: string;
        search?: string;
    };
}

export default function Index({ requests, filters }: RequestsIndexProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [priority, setPriority] = useState(filters.priority || 'all');

    // Auto-apply filters when they change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            router.get(
                '/requests',
                {
                    search: search || undefined,
                    status: status !== 'all' ? status : undefined,
                    priority: priority !== 'all' ? priority : undefined,
                },
                { preserveState: true, preserveScroll: true }
            );
        }, 300);

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
            <Head title="All Requests" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div>
                        <h2 className="text-3xl font-bold leading-tight text-gray-800 dark:text-gray-200">
                            All My Requests
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            View all service requests you created or are assigned to
                        </p>
                    </div>

                    {/* Filters */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search requests..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
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

                    {/* Requests List */}
                    <div className="space-y-4">
                        {requests.data.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <div className="flex flex-col items-center justify-center text-gray-500">
                                        <Search className="mb-4 h-12 w-12" />
                                        <p className="text-lg font-medium">No requests found</p>
                                        <p className="mt-1 text-sm">Try adjusting your filters</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {requests.data.map((request) => (
                                    <Card key={request.id} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start gap-3 mb-2">
                                                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                                                            #{request.id}
                                                        </span>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex-1">
                                                            {request.title}
                                                        </h3>
                                                    </div>
                                                    
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                                                        {request.description}
                                                    </p>

                                                    <div className="flex flex-wrap items-center gap-2">
                                                        <Badge className={getStatusColor(request.status)}>
                                                            {request.status.replace('_', ' ')}
                                                        </Badge>
                                                        <Badge className={getPriorityColor(request.priority)}>
                                                            {request.priority}
                                                        </Badge>
                                                        {request.category && (
                                                            <Badge variant="outline">
                                                                {request.category.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="text-right text-sm text-gray-500 dark:text-gray-400 shrink-0">
                                                    <p className="font-medium">
                                                        {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                    {request.requester && (
                                                        <p className="mt-1 text-xs">
                                                            By: {request.requester.name}
                                                        </p>
                                                    )}
                                                    {request.assignee && (
                                                        <p className="mt-1 text-xs">
                                                            Assigned: {request.assignee.name}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </>
                        )}
                    </div>

                    {/* Pagination */}
                    {requests.last_page > 1 && (
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                Showing <span className="font-medium">{requests.from}</span> to{' '}
                                <span className="font-medium">{requests.to}</span> of{' '}
                                <span className="font-medium">{requests.total}</span> requests
                            </div>
                            <div className="flex gap-2">
                                {requests.links.map((link, index) => (
                                    <button
                                        key={index}
                                        disabled={!link.url}
                                        onClick={() => link.url && router.get(link.url)}
                                        className={`px-3 py-1 text-sm rounded border ${
                                            link.active
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : link.url
                                                ? 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                : 'bg-gray-100 dark:bg-gray-900 text-gray-400 border-gray-200 dark:border-gray-700 cursor-not-allowed'
                                        }`}
                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
