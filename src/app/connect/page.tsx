'use client'

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useLang } from '@/lang/useLang';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { PasswordInput } from '@/ui/password-input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const Connect = () => {
    const [activeTab, setActiveTab] = useState('login');
    const { login, isLoading, error, clearError, isAuthenticated, getCurrentUser } = useAuth();
    const router = useRouter();
    const { t } = useLang();

    // Login form state
    const [loginData, setLoginData] = useState({
        username_or_email: '',
        password: ''
    });

    // Clear error when component mounts or tab changes
    useEffect(() => {
        clearError();
    }, [activeTab, clearError]);

    // Redirect if authenticated (this will be triggered by login success)
    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();

        try {
            await login(loginData.username_or_email, loginData.password);
            toast.success('Đăng nhập thành công!');
            router.push('/');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
            toast.error(errorMessage);
        }
    };

    return (
        <div className='relative flex-1 w-full flex flex-col justify-center items-center'>
            <div className='absolute inset-0 left-0 top-0 right-0 bottom-0'>
                <img src="/bg-quay-du-thuong.png" alt="logo" className='w-full h-full' />
            </div>
            <div className="flex flex-col justify-center items-center gap-2 xl:gap-4 px-4 lg:px-0 relative z-40 2xl:pt-4 pt-2 w-full">
                <Card className="w-full max-w-lg py-5 px-8">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white p-0">
                            Login
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username-or-email">Username hoặc Email</Label>
                                <Input
                                    id="username-or-email"
                                    type="text"
                                    placeholder="Nhập username hoặc email"
                                    value={loginData.username_or_email}
                                    onChange={(e) => setLoginData({ ...loginData, username_or_email: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mật khẩu</Label>
                                <PasswordInput
                                    id="password"
                                    placeholder="Nhập mật khẩu"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                    required
                                />
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm text-center">
                                    {error}
                                </div>
                            )}
                            <Button
                                type="submit"
                                className="w-full bg-theme-primary-500/80 hover:bg-theme-primary-500"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                            </Button>
                        </form>

                        {/* <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                Tài khoản mặc định:
                            </h3>
                            <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
                                <div><strong>Username:</strong> admin</div>
                                <div><strong>Password:</strong> admin123</div>
                                <div><strong>Email:</strong> admin@bittworld.com</div>
                            </div>
                        </div> */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Connect;