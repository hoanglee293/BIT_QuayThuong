'use client';

import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { Badge } from '@/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { LotteryCode } from '@/types/lottery';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Copy, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/ui/button';

interface LotteryTableProps {
  data: LotteryCode[];
  loading?: boolean;
}

const LotteryTable: React.FC<LotteryTableProps> = ({ data, loading = false }) => {
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
    try {
      return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: vi });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách mã dự thưởng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2">Đang tải...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Danh sách mã dự thưởng</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Không tìm thấy mã dự thưởng nào
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-8 shadow-inset dark:shadow-none border-none dark:border-solid">
      <CardHeader className="p-0 pb-5">
        <CardTitle>Danh sách mã dự thưởng ({data.length} kết quả)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto p-2 bg-white dark:bg-black rounded-xl border border-white/20 dark:border-slate-700/50">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[8%] text-center">ID</TableHead>
                <TableHead className="w-[18%] text-center">Mã dự thưởng</TableHead>
                <TableHead className="w-[10%] text-center">UID</TableHead>
                <TableHead className="w-[15%] text-center">Tên người dùng</TableHead>
                <TableHead className="w-[15%] text-center">Telegram ID</TableHead>
                <TableHead className="w-[12%] text-center">Trạng thái</TableHead>
                <TableHead className="w-[15%] text-center">Ngày tạo</TableHead>
                <TableHead className="w-[7%] text-center">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((lottery) => (
                <TableRow key={lottery.id}>
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
                      {lottery.user?.name || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="font-mono text-sm">
                      {lottery.user?.telegram_id || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Badge 
                        variant={lottery.is_used ? "destructive" : "default"}
                        className="flex items-center gap-1 w-fit"
                      >
                        {lottery.is_used ? (
                          <>
                            <XCircle className="h-3 w-3" />
                            Đã sử dụng
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Chưa sử dụng
                          </>
                        )}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-sm text-gray-600">
                      {formatDate(lottery.created_at)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCopyCode(lottery.code)}
                        className="text-xs"
                      >
                        Copy
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LotteryTable;
