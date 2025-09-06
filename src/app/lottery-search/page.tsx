'use client';

import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { Search, Ticket, AlertCircle } from 'lucide-react';
import { useLang } from '@/lang/useLang';
import { axiosClient } from '@/utils/axiosClient';
import { LotteryCode } from '@/types/lottery-types';
import toast from 'react-hot-toast';
import LotterySearchModal from '../components/lottery/LotterySearchModal';

const LotterySearchPage = () => {
    const { t } = useLang();
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchResult, setSearchResult] = useState<LotteryCode | null>(null);
    const [showModal, setShowModal] = useState(false);

    const handleSearch = async () => {
        if (!code.trim()) {
            toast.error(t('lottery.search.codeRequired') || 'Please enter a lottery code');
            return;
        }

        setLoading(true);
        try {
            const response = await axiosClient.get<{ data: LotteryCode[], pagination: any }>(`/lotterys?code=${code.trim()}`);

            if (response.data.data && response.data.data.length > 0) {
                // Get the first result from the array
                setSearchResult(response.data.data[0]);
                setShowModal(true);
                setCode('');
            } else {
                toast.error(t('lottery.search.notFound') || 'Lottery code not found');
            }
        } catch (err: any) {
            let errorMessage = t('lottery.search.error') || 'Error searching lottery code';

            if (err.response?.status === 404) {
                errorMessage = t('lottery.search.notFound') || 'Lottery code not found';
            } else if (err.response?.status === 401) {
                errorMessage = t('lottery.unauthorized') || 'Unauthorized';
            }

            toast.error(errorMessage);
            console.error('Error searching lottery:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="h-svh bg-white dark:bg-black w-full">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <Ticket className="h-12 w-12 text-indigo-600 mr-3" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {t('lottery.search.title') || 'Search Lottery Code'}
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 italic">
                            {t('lottery.search.description') || 'Enter a lottery code to find its corresponding BITT UID'}
                        </p>
                    </div>

                    {/* Search Card */}
                    <div className="relative p-0">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-lg blur-xl"></div>
                        <div className="relative flex flex-col gap-6">
                            
                            <div className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder={t('lottery.search.codePlaceholder') || 'Enter lottery code (e.g., 64322)'}
                                        value={code}
                                        maxLength={5}
                                        onChange={(e) => setCode(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        className="flex-1"
                                        disabled={loading}
                                    />
                                    <Button
                                        onClick={handleSearch}
                                        disabled={loading || !code.trim()}
                                        className="px-4 bg-theme-primary-500 text-white font-semibold text-base h-10 flex items-center justify-center hover:bg-theme-primary-500/90"
                                    >
                                        {loading ? (
                                            <div className="flex items-center text-sm">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                {t('lottery.search.searching') || 'Searching...'}
                                            </div>
                                        ) : (
                                            <>
                                                <Search className="h-5 w-5 mr-2" />
                                                <div className="flex items-center justify-center mb-0.5">
                                                {t('lottery.search.search') || 'Search'}
                                                </div>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                {/* Info */}
                                <div className="flex items-start gap-2 p-3 bg-theme-primary-500/70 rounded-lg">
                                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-white">
                                        <p className="font-medium mb-1 text-white">
                                            {t('lottery.search.infoTitle') || 'How to use:'}
                                        </p>
                                        <ul className="list-disc list-inside space-y-1 text-xs text-white">
                                            <li>{t('lottery.search.info1') || 'Enter the exact lottery code you want to search'}</li>
                                            <li>{t('lottery.search.info2') || 'The system will return the corresponding BITT UID'}</li>
                                            <li>{t('lottery.search.info3') || 'Only valid and existing codes will return results'}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal for displaying results */}
                {showModal && searchResult && (
                    <LotterySearchModal
                        lotteryData={searchResult}
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                    />
                )}
            </div>
        </div>
    );
};

export default LotterySearchPage;
