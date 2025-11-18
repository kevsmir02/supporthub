import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { Head, Link, useForm } from '@inertiajs/react';
import { LifeBuoy, ShieldCheck } from 'lucide-react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

export default function Login({
    status,
    canResetPassword,
}: LoginProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(store.url(), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Log in - AUF Helpdesk" />
            
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
                        <h2 className="text-4xl font-bold mb-6">Welcome Back!</h2>
                        <p className="text-xl text-blue-100 mb-8">
                            Access your support dashboard to manage tickets, track requests, and get help when you need it.
                        </p>
                        
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm">
                                    <ShieldCheck className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-1">Secure Access</h3>
                                    <p className="text-sm text-blue-100">Your data is protected with industry-standard security measures</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10">
                        <p className="text-sm text-blue-100">© 2025 AUF Helpdesk. All rights reserved.</p>
                    </div>
                </div>

                {/* Right Side - Login Form */}
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
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Log in to your account</h2>
                            <p className="text-slate-600 dark:text-slate-400">Enter your credentials to access your dashboard</p>
                        </div>

                        {status && (
                            <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                                {status}
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
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="email@example.com"
                                    className="h-12 text-base"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password" className="text-slate-900 dark:text-slate-100">Password</Label>
                                    {canResetPassword && (
                                        <TextLink
                                            href={request().url}
                                            className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                            tabIndex={4}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    className="h-12 text-base"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                    tabIndex={3}
                                />
                                <Label htmlFor="remember" className="text-sm text-slate-700 dark:text-slate-300">
                                    Remember me for 30 days
                                </Label>
                            </div>

                            <Button
                                type="submit"
                                className="w-full h-12 text-base font-semibold bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <Spinner />}
                                Log in
                            </Button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Need access? Contact your administrator
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
