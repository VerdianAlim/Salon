import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import type { Service, ServiceFormData } from '../../types';
import { useServiceStore } from '../../store/serviceStore';
import { serviceSchema } from '../../utils/validators';
import { formatCurrency, formatDuration } from '../../utils/formatCurrency';
import Button from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Modal, ConfirmModal } from '../../components/ui/Modal';
import { TableRowSkeleton } from '../../components/ui/Skeleton';
import { z } from 'zod';

type ServiceForm = z.infer<typeof serviceSchema>;

const CATEGORIES = ['Makeup', 'Hair', 'Perawatan'];

const ServiceManager: React.FC = () => {
  const { services, isLoading, fetchServices, addService, editService, removeService } = useServiceStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ServiceForm>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { isActive: true, price: 0, duration: 60 },
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const openAdd = () => {
    setEditingService(null);
    reset({ isActive: true, price: 0, duration: 60, name: '', description: '', category: '' });
    setIsModalOpen(true);
  };

  const openEdit = (service: Service) => {
    setEditingService(service);
    reset({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category,
      imageUrl: service.imageUrl || '',
      isActive: service.isActive,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ServiceForm) => {
    try {
      if (editingService) {
        await editService(editingService.id, data as ServiceFormData);
        toast.success('Layanan berhasil diperbarui!');
      } else {
        await addService(data as ServiceFormData);
        toast.success('Layanan berhasil ditambahkan!');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await removeService(deleteTarget.id);
      toast.success(`Layanan "${deleteTarget.name}" berhasil dihapus`);
      setDeleteTarget(null);
    } catch {
      toast.error('Gagal menghapus layanan');
    } finally {
      setIsDeleting(false);
    }
  };

  const isActive = watch('isActive');

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 mb-1">Manajemen Layanan</h1>
          <p className="text-slate-500 text-sm">Kelola daftar layanan Salon Widya</p>
        </div>
        <Button
          id="add-service"
          onClick={openAdd}
          leftIcon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
        >
          Tambah Layanan
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Layanan', value: services.length, color: 'bg-rose-100 text-rose-700' },
          { label: 'Aktif', value: services.filter(s => s.isActive).length, color: 'bg-emerald-100 text-emerald-700' },
          { label: 'Nonaktif', value: services.filter(s => !s.isActive).length, color: 'bg-slate-100 text-slate-600' },
        ].map(item => (
          <div key={item.label} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
            <p className={`text-2xl font-extrabold ${item.color.split(' ')[1]}`}>{item.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                {['Nama Layanan', 'Kategori', 'Harga', 'Durasi', 'Status', 'Aksi'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                : services.map(service => (
                  <tr key={service.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-800">{service.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{service.description}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
                        {service.category}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-rose-600">{formatCurrency(service.price)}</td>
                    <td className="px-5 py-4 text-slate-600">{formatDuration(service.duration)}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${service.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {service.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(service)}
                          className="text-blue-500 hover:text-blue-700 font-semibold text-xs transition-colors"
                        >
                          Edit
                        </button>
                        <span className="text-slate-200">|</span>
                        <button
                          onClick={() => setDeleteTarget(service)}
                          className="text-red-500 hover:text-red-700 font-semibold text-xs transition-colors"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingService ? 'Edit Layanan' : 'Tambah Layanan Baru'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Nama Layanan"
            placeholder="Contoh: Makeup Natural"
            error={errors.name?.message}
            required
            {...register('name')}
          />
          <Textarea
            label="Deskripsi"
            placeholder="Deskripsi lengkap layanan..."
            error={errors.description?.message}
            required
            {...register('description')}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Harga (Rp) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                placeholder="150000"
              />
              {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Durasi (menit) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                {...register('duration', { valueAsNumber: true })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                placeholder="60"
              />
              {errors.duration && <p className="mt-1 text-xs text-red-500">{errors.duration.message}</p>}
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
              Kategori <span className="text-rose-500">*</span>
            </label>
            <select
              {...register('category')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 focus:border-transparent"
            >
              <option value="">Pilih kategori...</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
          </div>

          {/* Toggle aktif */}
          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
            <button
              type="button"
              onClick={() => setValue('isActive', !isActive)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${isActive ? 'bg-rose-500' : 'bg-slate-300'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-700">Status Layanan</p>
              <p className="text-xs text-slate-500">{isActive ? 'Layanan aktif dan dapat dibooking' : 'Layanan tidak aktif'}</p>
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {editingService ? 'Simpan Perubahan' : 'Tambah Layanan'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Layanan"
        message={`Apakah Anda yakin ingin menghapus layanan "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmLabel="Ya, Hapus"
        confirmVariant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default ServiceManager;
