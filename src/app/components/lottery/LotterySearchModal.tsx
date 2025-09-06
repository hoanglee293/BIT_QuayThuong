'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { LotteryCode } from '@/types/lottery-types';
import { useLang } from '@/lang/useLang';
import { 
  Ticket, 
  User, 
  Calendar, 
  Hash, 
  CheckCircle, 
  XCircle, 
  Copy,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LotterySearchModalProps {
  lotteryData: LotteryCode;
  isOpen: boolean;
  onClose: () => void;
}

const LotterySearchModal: React.FC<LotterySearchModalProps> = ({
  lotteryData,
  isOpen,
  onClose
}) => {
  const { t } = useLang();

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success(`${label} copied to clipboard`);
    }).catch(() => {
      toast.error('Failed to copy to clipboard');
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-gray-900 dark:text-white">
            <Ticket className="h-6 w-6 mr-2 text-indigo-600" />
            {t('lottery.search.resultTitle') || 'Lottery Code Found'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Result Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/5 via-emerald-600/5 to-teal-600/5 rounded-lg blur-xl"></div>
            <div className="relative">
              <span className="text-sm font-mono font-medium text-yellow-400">
                {t('lottery.search.lotteryCodeBelongsTo', { code: lotteryData.code })}
              </span>
              <CardContent>
                <div className="text-center space-y-4 mt-3">
                  {/* Input Number - Main Result */}
                  <div className="bg-theme-primary-500 text-white rounded-lg p-6">
                    <div className="text-base font-medium mb-2 opacity-90">
                      UID
                    </div>
                    <div className="text-3xl font-bold">
                      {lotteryData.input_number}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </div>

          {/* Details Card */}
          <div className="p-0">
            <CardContent className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                {t('lottery.search.details') || 'Lottery Details'}
              </h3>

              {/* Lottery Code */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Hash className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('lottery.search.code') || 'Code'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{lotteryData.code}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(lotteryData.code, 'Lottery code')}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              {/* Created Date */}
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t('lottery.search.createdAt') || 'Created'}
                  </span>
                </div>
                <span className="text-sm font-mono font-medium italic text-yellow-400">{formatDate(lotteryData.created_at)}</span>
              </div>
            </CardContent>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LotterySearchModal;
