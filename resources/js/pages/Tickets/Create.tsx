import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { PageProps } from '@/types';
import { Category } from '@/types/models';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import { FormEventHandler, useEffect, useState } from 'react';

interface TicketsCreateProps extends PageProps {
    categories?: Category[];
}

export default function Create({ auth, categories = [] }: TicketsCreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        category_id: '',
        title: '',
        description: '',
        priority: 'medium' as 'low' | 'medium' | 'high',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(ticketsRoutes.store.url());
    };

    return (
        <AppLayout>
            <Head title="Create Ticket" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href={ticketsRoutes.index.url()}
                            className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                            ← Back to Tickets
                        </Link>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                            Create New Ticket
                        </h2>
                    </div>

                    {/* Create Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ticket Details</CardTitle>
                            <CardDescription>
                                Fill in the details below to submit your support request
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-6">
                                {/* Category */}
                                <div>
                                    <Label htmlFor="category_id">
                                        Category <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.category_id}
                                        onValueChange={(value) =>
                                            setData('category_id', value)
                                        }
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id.toString()}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category_id && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.category_id}
                                        </p>
                                    )}
                                </div>

                                {/* Title */}
                                <div>
                                    <Label htmlFor="title">
                                        Title <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="title"
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        placeholder="Brief description of your issue"
                                        className="mt-1"
                                        autoFocus
                                    />
                                    {errors.title && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.title}
                                        </p>
                                    )}
                                </div>

                                {/* Description */}
                                <div>
                                    <Label htmlFor="description">
                                        Description <span className="text-red-500">*</span>
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            setData('description', e.target.value)
                                        }
                                        placeholder="Provide detailed information about your issue..."
                                        rows={6}
                                        className="mt-1"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>

                                {/* Priority */}
                                <div>
                                    <Label htmlFor="priority">
                                        Priority <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.priority}
                                        onValueChange={(value) =>
                                            setData('priority', value as 'low' | 'medium' | 'high')
                                        }
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="low">
                                                Low - General inquiry
                                            </SelectItem>
                                            <SelectItem value="medium">
                                                Medium - Issue affecting work
                                            </SelectItem>
                                            <SelectItem value="high">
                                                High - Critical issue
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.priority && (
                                        <p className="mt-1 text-sm text-red-600">
                                            {errors.priority}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Buttons */}
                                <div className="flex items-center gap-4">
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creating...' : 'Create Ticket'}
                                    </Button>
                                    <Link href={ticketsRoutes.index.url()}>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Help Text */}
                    <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            Tips for submitting a ticket:
                        </h3>
                        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-blue-800 dark:text-blue-200">
                            <li>Provide a clear and descriptive title</li>
                            <li>Include all relevant details in the description</li>
                            <li>Choose the appropriate category for faster routing</li>
                            <li>Set priority based on urgency and impact</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
