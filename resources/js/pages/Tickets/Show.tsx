import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Ticket, TicketComment, User } from '@/types/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import * as ticketsRoutes from '@/routes/tickets';
import * as commentsRoutes from '@/routes/comments';
import { FormEventHandler } from 'react';

interface TicketShowProps extends PageProps {
    ticket: Ticket;
    staffUsers: User[];
}

export default function Show({ auth, ticket, staffUsers }: TicketShowProps) {
    const isAdminOrStaff = auth.user.role === 'admin' || auth.user.role === 'staff';
    const isAdmin = auth.user.role === 'admin';
    const isOwner = ticket.requester_id === auth.user.id;

    const { data, setData, post, processing, errors, reset } = useForm({
        ticket_id: ticket.id,
        body: '',
    });

    const updateForm = useForm({
        status: ticket.status,
        assignee_id: ticket.assignee_id || '',
    });

    const submitComment: FormEventHandler = (e) => {
        e.preventDefault();
        post(commentsRoutes.store.url(), {
            onSuccess: () => reset('body'),
        });
    };

    const updateTicket: FormEventHandler = (e) => {
        e.preventDefault();
        updateForm.patch(ticketsRoutes.update.url({ ticket: ticket.id }));
    };

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
            <Head title={`Ticket #${ticket.id} - ${ticket.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-8">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <Link
                                href={ticketsRoutes.index.url()}
                                className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                            >
                                ← Back to Tickets
                            </Link>
                            <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Ticket #{ticket.id}: {ticket.title}
                            </h2>
                        </div>
                        {(isOwner || isAdminOrStaff) && (
                            <Link href={ticketsRoutes.edit.url({ ticket: ticket.id })}>
                                <Button variant="outline">Edit Ticket</Button>
                            </Link>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Ticket Details */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <CardTitle>Description</CardTitle>
                                            <CardDescription>
                                                Created on{' '}
                                                {new Date(ticket.created_at).toLocaleString()}
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge className={getStatusColor(ticket.status)}>
                                                {ticket.status.replace('_', ' ')}
                                            </Badge>
                                            <Badge className={getPriorityColor(ticket.priority)}>
                                                {ticket.priority}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                        {ticket.description}
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Comments Section */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Comments ({ticket.comments?.length || 0})</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {ticket.comments && ticket.comments.length > 0 ? (
                                        ticket.comments.map((comment: TicketComment) => (
                                            <div
                                                key={comment.id}
                                                className="rounded-lg border p-4"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-semibold">
                                                                {comment.user?.name}
                                                            </span>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(
                                                                    comment.created_at
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <p className="mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                                            {comment.body}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-center text-gray-500">
                                            No comments yet
                                        </p>
                                    )}

                                    {/* Add Comment Form */}
                                    <form onSubmit={submitComment} className="mt-6 space-y-4">
                                        <div>
                                            <Label htmlFor="body">Add a Comment</Label>
                                            <Textarea
                                                id="body"
                                                value={data.body}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                    setData('body', e.target.value)
                                                }
                                                placeholder="Write your comment here..."
                                                rows={4}
                                                className="mt-1"
                                            />
                                            {errors.body && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.body}
                                                </p>
                                            )}
                                        </div>
                                        <Button type="submit" disabled={processing}>
                                            Post Comment
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            {/* Ticket Information */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ticket Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label className="text-xs text-gray-500">
                                            Requester
                                        </Label>
                                        <p className="font-medium">
                                            {ticket.requester?.name}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {ticket.requester?.email}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Category</Label>
                                        <p className="font-medium">
                                            {ticket.category?.name}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Assignee</Label>
                                        <p className="font-medium">
                                            {ticket.assignee?.name || 'Unassigned'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Priority</Label>
                                        <p className="font-medium capitalize">
                                            {ticket.priority}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Status</Label>
                                        <p className="font-medium capitalize">
                                            {ticket.status.replace('_', ' ')}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">
                                            Last Updated
                                        </Label>
                                        <p className="text-sm">
                                            {new Date(ticket.updated_at).toLocaleString()}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Update Status (Admin/Staff Only) */}
                            {isAdminOrStaff && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Update Ticket</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={updateTicket} className="space-y-4">
                                            {/* Assignee (Admin Only) */}
                                            {isAdmin && (
                                                <div>
                                                    <Label htmlFor="assignee">Assign To</Label>
                                                    <Select
                                                        value={updateForm.data.assignee_id?.toString() || 'unassigned'}
                                                        onValueChange={(value) =>
                                                            updateForm.setData('assignee_id', value === 'unassigned' ? null : parseInt(value) as any)
                                                        }
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select staff member" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="unassigned">Unassigned</SelectItem>
                                                            {staffUsers.map((staff) => (
                                                                <SelectItem key={staff.id} value={staff.id.toString()}>
                                                                    {staff.name} ({staff.role})
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            )}
                                            <div>
                                                <Label htmlFor="status">Status</Label>
                                                <Select
                                                    value={updateForm.data.status}
                                                    onValueChange={(value) =>
                                                        updateForm.setData('status', value as any)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="open">Open</SelectItem>
                                                        <SelectItem value="in_progress">
                                                            In Progress
                                                        </SelectItem>
                                                        <SelectItem value="closed">
                                                            Closed
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <Button
                                                type="submit"
                                                disabled={updateForm.processing}
                                                className="w-full"
                                            >
                                                Update Ticket
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
