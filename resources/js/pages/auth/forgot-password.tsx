// Components
import { login } from '@/routes';
import { email } from '@/routes/password';
import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, LifeBuoy, Mail, ShieldCheck } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(email.url());
    };

    return (
        <>
            <Head title="Forgot password - AUF Helpdesk" />
            
            <div className="flex min-h-screen">
                {/* Left Side - Branding */}
                <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 flex-col justify-between relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                            backgroundSize: '40px 40px'
                        }}></div>
                    </div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-12">
                            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-2xl">
                                <LifeBuoy className="h-8 w-8 text-white" strokeWidth={2.5} />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">AUF Helpdesk</h1>
                                <p className="text-sm text-blue-100">Support & Service Request System</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 text-white">
                        <h2 className="text-4xl font-bold mb-6">Reset Your Password</h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Don't worry! It happens. Enter your email address and we'll send you instructions to reset your password.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Check Your Email</h3>
                                    <p className="text-sm text-blue-100">We'll send you a secure link to reset your password</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Secure Process</h3>
                                    <p className="text-sm text-blue-100">Your password reset link is encrypted and expires in 60 minutes</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-blue-100">© 2025 AUF Helpdesk. All rights reserved.</p>
                    </div>
                </div>

                {/* Right Side - Reset Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white dark:bg-slate-950">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden flex items-center gap-3 mb-8">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-lg">
                                <LifeBuoy className="h-7 w-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 dark:text-white">AUF Helpdesk</h1>
                                <p className="text-xs text-slate-600 dark:text-slate-400">Support System</p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Forgot password?</h2>
                            <p className="text-slate-600 dark:text-slate-400">No worries, we'll send you reset instructions</p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                <div className="flex items-start gap-3">
                                    <Mail className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold mb-1">Email sent!</p>
                                        <p>{status}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-900 dark:text-slate-100">Email address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    autoComplete="email"
                                    autoFocus
                                    placeholder="email@example.com"
                                    className="h-12 text-base"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && <Spinner />}
                                Send reset link
                            </Button>
                        </form>

                        <div className="mt-8">
                            <TextLink 
                                href={login()} 
                                className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to login
                            </TextLink>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
