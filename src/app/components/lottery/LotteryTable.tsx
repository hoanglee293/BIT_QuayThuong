'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { LotteryCode } from '@/types/lottery-types';
import { Copy, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/ui/button';
import { useLang } from '@/lang/useLang';
import { formatDateWithOffset } from '@/utils/dateFormat';

interface LotteryTableProps {
  data: LotteryCode[];
  loading?: boolean;
  total?: number;
}

const LotteryTable: React.FC<LotteryTableProps> = ({ data, loading = false, total = 0 }) => {
  const { t, lang } = useLang();
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const formatDate = (dateString: string) => {
    return formatDateWithOffset(dateString, lang);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('lottery.table.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">{t('lottery.table.loading')}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('lottery.table.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            {t('lottery.table.noData')}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border-none">
      <div className="flex items-center justify-between w-full gap-2 text-2xl font-bold mb-5">{t('lottery.table.title')} <span className="text-xl text-theme-primary-500">
      {t('lottery.total')}: { total }</span></div>
      <CardContent>
        <div className="overflow-x-auto bg-gray-400 dark:bg-black rounded-xl border border-white/20 dark:border-slate-700/50 shadow-inset">
          <Table className="table-fixed w-full">
            <TableHeader className="rounded-t-xl">
              <TableRow className="bg-theme-primary-500 text-white">
                <TableHead className="w-[8%] text-center rounded-tl-lg">{t('lottery.table.id')}</TableHead>
                <TableHead className="w-[18%] text-center">{t('lottery.table.lotteryCode')}</TableHead>
                <TableHead className="w-[10%] text-center">{t('lottery.table.uid')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('lottery.table.userName')}</TableHead>
                <TableHead className="w-[15%] text-center">{t('lottery.table.telegramId')}</TableHead>
                <TableHead className="w-[15%] text-center rounded-tr-lg">{t('lottery.table.createdAt')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((lottery) => (
                <TableRow key={lottery.id} className="bg-gray-100 dark:bg-gray-950 border-b border-gray-300 dark:border-gray-700">
                  <TableCell className="font-medium text-center">
                    {lottery.id}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <code className="px-2 py-1 rounded text-sm font-mono bg-gray-100 dark:bg-gray-800">
                        {lottery.code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyCode(lottery.code)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedCode === lottery.code ? (
                          <CheckCircle className="h-3 w-3 text-green-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-sm">
                      {lottery.input_number}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="truncate" title={lottery.user?.name}>
                      {lottery.user?.name || t('lottery.table.na')}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-sm">
                      {lottery.user?.telegram_id || t('lottery.table.na')}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <span className="text-sm text-yellow-400 italic">
                      {formatDate(lottery.created_at)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </div>
  );
};

export default LotteryTable;
