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
    <Card className="p-8">
      <CardHeader className="p-0 pb-5">
        <CardTitle>Danh sách mã dự thưởng ({data.length} kết quả)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead className="w-[150px]">Mã dự thưởng</TableHead>
                <TableHead className="w-[120px]">UID</TableHead>
                <TableHead className="w-[150px]">Tên người dùng</TableHead>
                <TableHead className="w-[150px]">Telegram ID</TableHead>
                <TableHead className="w-[100px]">Trạng thái</TableHead>
                <TableHead className="w-[150px]">Ngày tạo</TableHead>
                <TableHead className="w-[100px]">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((lottery) => (
                <TableRow key={lottery.id}>
                  <TableCell className="font-medium">
                    {lottery.id}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className=" px-2 py-1 rounded text-sm font-mono">
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
                  <TableCell>
                    <span className="font-mono">
                      {lottery.input_number}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[120px] truncate" title={lottery.user?.name}>
                      {lottery.user?.name || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-sm">
                      {lottery.user?.telegram_id || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-600">
                      {formatDate(lottery.created_at)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
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
