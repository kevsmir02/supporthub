import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { HelpCircle, LifeBuoy, TicketIcon } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6 text-slate-900 lg:justify-center lg:p-8 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 dark:text-slate-100">
                <header className="mb-12 w-full max-w-6xl">
                    <nav className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                                <LifeBuoy className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">SupportHub</h1>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Support & Service Request System</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {auth.user ? (
                                <Link
                                    href={dashboard()}
                                    className="inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-white px-6 py-2.5 text-sm font-medium text-blue-700 shadow-sm transition-all hover:bg-blue-50 hover:border-blue-300 dark:border-blue-800 dark:bg-slate-800 dark:text-blue-400 dark:hover:bg-slate-700"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Log in
                                </Link>
                            )}
                        </div>
                    </nav>
                </header>
                <div className="flex w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <main className="flex w-full max-w-6xl flex-col gap-12">
                        {/* Hero Section */}
                        <div className="text-center">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 shadow-2xl">
                                <TicketIcon className="h-10 w-10 text-white" strokeWidth={2} />
                            </div>
                            <h1 className="mb-4 text-5xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-6xl">
                                Welcome to SupportHub
                            </h1>
                            <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 dark:text-slate-400">
                                Your centralized platform for submitting, tracking, and resolving support requests efficiently. Get help when you need it.
                            </p>
                            {!auth.user && (
                                <Link
                                    href={login()}
                                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-xl transition-all hover:bg-blue-700 hover:shadow-2xl hover:scale-105 dark:bg-blue-600 dark:hover:bg-blue-700"
                                >
                                    Get Started
                                </Link>
                            )}
                        </div>

                        {/* Features Grid */}
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                                    <TicketIcon className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                                    Submit Requests
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Create support tickets for IT issues, maintenance requests, or any service needs with a simple and intuitive interface.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                                    <HelpCircle className="h-7 w-7 text-green-600 dark:text-green-400" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                                    Track Progress
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Monitor your ticket status in real-time, receive updates, and communicate with support staff throughout the resolution process.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-lg transition-all hover:shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                                    <LifeBuoy className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="mb-3 text-xl font-semibold text-slate-900 dark:text-white">
                                    Get Support
                                </h3>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Access dedicated support from our team with categorized service requests and priority-based ticket management.
                                </p>
                            </div>
                        </div>

                        {/* Stats Section */}
                        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-8 shadow-xl dark:border-slate-800 dark:from-slate-900 dark:to-slate-800">
                            <div className="grid gap-8 md:grid-cols-3">
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold text-blue-600 dark:text-blue-400">24/7</div>
                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Support Available</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold text-green-600 dark:text-green-400">Fast</div>
                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Response Times</div>
                                </div>
                                <div className="text-center">
                                    <div className="mb-2 text-4xl font-bold text-purple-600 dark:text-purple-400">Easy</div>
                                    <div className="text-sm font-medium text-slate-600 dark:text-slate-400">Ticket Management</div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
