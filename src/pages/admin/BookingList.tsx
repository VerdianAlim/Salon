import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import type { Booking, BookingStatus } from '../../types';
import { getBookings } from '../../services/bookingService';
import { STATUS_LABELS } from '../../utils/constants';
import { formatDateShort } from '../../utils/formatDate';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { TableRowSkeleton } from '../../components/ui/Skeleton';

const columnHelper = createColumnHelper<Booking>();

const ALL_STATUSES: BookingStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];

const BookingList: React.FC = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    getBookings().then(data => {
      setBookings(data);
      setIsLoading(false);
    });
  }, []);

  const filteredData = useMemo(() => {
    return bookings.filter(b => {
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      const matchDateFrom = !dateFrom || b.date >= dateFrom;
      const matchDateTo = !dateTo || b.date <= dateTo;
      const q = globalFilter.toLowerCase();
      const matchSearch = !q || b.bookingCode.toLowerCase().includes(q) || b.customer.name.toLowerCase().includes(q) || b.service.name.toLowerCase().includes(q);
      return matchStatus && matchDateFrom && matchDateTo && matchSearch;
    });
  }, [bookings, statusFilter, dateFrom, dateTo, globalFilter]);

  const columns = [
    columnHelper.accessor('bookingCode', {
      header: 'Kode Booking',
      cell: info => <span className="font-mono text-xs font-bold text-slate-600">{info.getValue()}</span>,
    }),
    columnHelper.accessor('customer.name', {
      header: 'Pelanggan',
      cell: info => (
        <div>
          <p className="font-medium text-slate-800">{info.getValue()}</p>
          <p className="text-xs text-slate-400">{info.row.original.customer.phone}</p>
        </div>
      ),
    }),
    columnHelper.accessor('service.name', {
      header: 'Layanan',
      cell: info => <span className="text-slate-600 text-sm">{info.getValue()}</span>,
    }),
    columnHelper.accessor('date', {
      header: 'Tanggal & Jam',
      cell: info => (
        <div>
          <p className="text-slate-700 text-sm font-medium">{formatDateShort(info.getValue())}</p>
          <p className="text-xs text-slate-400">{info.row.original.time} WIB</p>
        </div>
      ),
    }),
    columnHelper.accessor('service.price', {
      header: 'Harga',
      cell: info => <span className="font-semibold text-rose-600">{formatCurrency(info.getValue())}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => <Badge variant={info.getValue() as BookingStatus}>{STATUS_LABELS[info.getValue()]}</Badge>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Aksi',
      cell: info => (
        <button
          onClick={() => navigate(`/admin/bookings/${info.row.original.id}`)}
          className="text-rose-500 hover:text-rose-700 font-semibold text-sm transition-colors"
        >
          Detail →
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Daftar Booking</h1>
        <p className="text-slate-500 text-sm">Kelola semua booking pelanggan Salon Widya</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Input
              id="search-bookings"
              placeholder="Cari kode / nama / layanan..."
              value={globalFilter}
              onChange={e => setGlobalFilter(e.target.value)}
              leftIcon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>
          {/* Status filter */}
          <div>
            <select
              id="filter-status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            >
              <option value="all">Semua Status</option>
              {ALL_STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          {/* Date range */}
          <div>
            <input
              type="date"
              value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              placeholder="Dari tanggal"
            />
          </div>
          <div>
            <input
              type="date"
              value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
              placeholder="Sampai tanggal"
            />
          </div>
        </div>
        {(globalFilter || statusFilter !== 'all' || dateFrom || dateTo) && (
          <button
            onClick={() => { setGlobalFilter(''); setStatusFilter('all'); setDateFrom(''); setDateTo(''); }}
            className="mt-3 text-xs text-rose-500 hover:text-rose-700 font-semibold"
          >
            Reset semua filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-bold text-slate-800">{filteredData.length}</span> dari{' '}
            <span className="font-bold text-slate-800">{bookings.length}</span> booking
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide cursor-pointer hover:text-slate-700"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => <TableRowSkeleton key={i} cols={7} />)
                : table.getRowModel().rows.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center gap-2 text-slate-400">
                          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                          <p className="font-medium text-slate-500">Tidak ada data booking</p>
                        </div>
                      </td>
                    </tr>
                  )
                  : table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-5 py-3.5">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">
            Halaman <span className="font-bold">{table.getState().pagination.pageIndex + 1}</span> dari{' '}
            <span className="font-bold">{Math.max(table.getPageCount(), 1)}</span>
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Selanjutnya →
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingList;
