import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import type { Service, TimeSlot } from '../../types';
import { useBookingStore } from '../../store/bookingStore';
import { getServices } from '../../services/serviceService';
import { fetchAvailableSlots } from '../../services/bookingService';
import { createBooking } from '../../services/bookingService';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import Button from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import TimePicker from '../../components/booking/TimePicker';
import DatePicker from '../../components/booking/DatePicker';
import { formatCurrency, formatDuration } from '../../utils/formatCurrency';
import { formatDateLong } from '../../utils/formatDate';

// Zod schemas per step
const step3Schema = z.object({
  customerName: z.string().min(3, 'Nama minimal 3 karakter'),
  customerPhone: z
    .string()
    .regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Format nomor HP Indonesia tidak valid (contoh: 08123456789)'),
  customerEmail: z.string().email('Format email tidak valid').optional().or(z.literal('')),
  notes: z.string().max(500, 'Catatan maksimal 500 karakter').optional(),
});

type Step3Form = z.infer<typeof step3Schema>;

// ============================================================
// STEP INDICATOR
// ============================================================
const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const steps = ['Pilih Layanan', 'Pilih Jadwal', 'Data Diri', 'Konfirmasi'];
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((label, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isDone = step < currentStep;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div className={`
                w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
                ${isDone
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : isActive
                    ? 'bg-white border-rose-500 text-rose-600 shadow-md shadow-rose-100'
                    : 'bg-slate-100 border-slate-200 text-slate-400'}
              `}>
                {isDone ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                ) : step}
              </div>
              <span className={`text-xs mt-1.5 font-medium hidden sm:block ${isActive ? 'text-rose-600' : isDone ? 'text-rose-400' : 'text-slate-400'}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 sm:w-20 mx-1 sm:mx-2 transition-all duration-300 ${step < currentStep ? 'bg-rose-400' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

// ============================================================
// BOOKING FORM (MULTI-STEP)
// ============================================================
const BookingForm: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    selectedService,
    selectedDate,
    selectedTime,
    formData,
    setStep,
    setService,
    setDateTime,
    setFormData,
    resetBooking,
  } = useBookingStore();

  const [services, setServices] = useState<Service[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customerInfo, setCustomerInfo] = useState<Step3Form | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Step3Form>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      customerName: formData.customerName || '',
      customerPhone: formData.customerPhone || '',
      customerEmail: formData.customerEmail || '',
      notes: formData.notes || '',
    },
  });

  // Load layanan
  useEffect(() => {
    getServices(true).then(setServices);
  }, []);

  // Load slot waktu
  useEffect(() => {
    if (selectedDate && selectedService) {
      setIsSlotsLoading(true);
      fetchAvailableSlots(selectedDate, selectedService.id).then(s => {
        setSlots(s);
        setIsSlotsLoading(false);
      });
    }
  }, [selectedDate, selectedService]);

  // ---- STEP 1: Pilih layanan ----
  const renderStep1 = () => (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Pilih Layanan</h2>
      <p className="text-sm text-slate-500 mb-6">Pilih layanan yang ingin Anda booking</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map(s => (
          <div
            key={s.id}
            onClick={() => setService(s)}
            className={`
              cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
              ${selectedService?.id === s.id
                ? 'border-rose-500 bg-rose-50'
                : 'border-slate-200 bg-white hover:border-rose-300'}
            `}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedService?.id === s.id ? 'bg-rose-500 text-white' : 'bg-rose-100 text-rose-500'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                <p className="text-xs text-rose-600 font-medium">{formatCurrency(s.price)} · {formatDuration(s.duration)}</p>
              </div>
              {selectedService?.id === s.id && (
                <svg className="w-5 h-5 text-rose-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-6">
        <Button
          id="step1-next"
          disabled={!selectedService}
          onClick={() => setStep(2)}
        >
          Lanjut ke Jadwal →
        </Button>
      </div>
    </div>
  );

  // ---- STEP 2: Pilih jadwal ----
  const renderStep2 = () => (
    <div>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Pilih Jadwal</h2>
      <p className="text-sm text-slate-500 mb-6">Pilih tanggal dan jam yang paling nyaman untuk Anda</p>

      <div className="space-y-6">
        <DatePicker
          value={selectedDate}
          onChange={(date) => {
            setDateTime(date, '');
          }}
          error={!selectedDate && currentStep > 2 ? 'Pilih tanggal booking' : undefined}
        />

        <div>
          <p className="text-sm font-semibold text-slate-700 mb-3">
            Jam Booking
            {selectedDate && <span className="font-normal text-slate-400 ml-2">— {formatDateLong(selectedDate)}</span>}
          </p>
          <TimePicker
            slots={slots}
            selectedTime={selectedTime}
            onSelect={(time) => setDateTime(selectedDate, time)}
            isLoading={isSlotsLoading}
          />
        </div>
      </div>

      <div className="flex gap-3 justify-between mt-6">
        <Button variant="outline" onClick={() => setStep(1)}>
          ← Kembali
        </Button>
        <Button
          id="step2-next"
          disabled={!selectedDate || !selectedTime}
          onClick={() => setStep(3)}
        >
          Lanjut ke Data Diri →
        </Button>
      </div>
    </div>
  );

  // ---- STEP 3: Data diri ----
  const onStep3Submit: SubmitHandler<Step3Form> = (data) => {
    setCustomerInfo(data);
    setFormData({
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      notes: data.notes,
    });
    setStep(4);
  };

  const renderStep3 = () => (
    <form onSubmit={handleSubmit(onStep3Submit)}>
      <h2 className="text-xl font-bold text-slate-800 mb-2">Data Diri</h2>
      <p className="text-sm text-slate-500 mb-6">Isi informasi kontak Anda untuk konfirmasi booking</p>

      <div className="space-y-5">
        <Input
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap Anda"
          error={errors.customerName?.message}
          required
          {...register('customerName')}
        />
        <Input
          label="Nomor HP / WhatsApp"
          placeholder="Contoh: 08123456789"
          error={errors.customerPhone?.message}
          helperText="Format: 08xxxxxxxxxx atau +62xxxxxxxxxx"
          required
          {...register('customerPhone')}
        />
        <Input
          label="Email"
          type="email"
          placeholder="email@contoh.com (opsional)"
          error={errors.customerEmail?.message}
          {...register('customerEmail')}
        />
        <Textarea
          label="Catatan Tambahan"
          placeholder="Catatan untuk stylist (opsional, maks. 500 karakter)"
          error={errors.notes?.message}
          {...register('notes')}
        />
      </div>

      <div className="flex gap-3 justify-between mt-6">
        <Button variant="outline" type="button" onClick={() => setStep(2)}>
          ← Kembali
        </Button>
        <Button id="step3-next" type="submit">
          Lanjut ke Konfirmasi →
        </Button>
      </div>
    </form>
  );

  // ---- STEP 4: Konfirmasi ----
  const handleConfirmBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime || !customerInfo) return;
    setIsSubmitting(true);
    try {
      const booking = await createBooking({
        serviceId: selectedService.id,
        date: selectedDate,
        time: selectedTime,
        customerName: customerInfo.customerName,
        customerPhone: customerInfo.customerPhone,
        customerEmail: customerInfo.customerEmail,
        notes: customerInfo.notes,
      });
      toast.success('Booking berhasil dibuat!');
      resetBooking();
      navigate('/booking/success', { state: { booking } });
    } catch {
      toast.error('Gagal membuat booking. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep4 = () => {
    const info = customerInfo || formData;
    return (
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Konfirmasi Booking</h2>
        <p className="text-sm text-slate-500 mb-6">Periksa kembali detail booking Anda sebelum dikonfirmasi</p>

        <div className="space-y-4">
          {/* Layanan */}
          <div className="bg-rose-50 rounded-2xl p-5 border border-rose-100">
            <p className="text-xs text-rose-600 font-semibold uppercase tracking-wide mb-3">Layanan Dipilih</p>
            <p className="font-bold text-slate-800 text-lg">{selectedService?.name}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
              <span className="font-semibold text-rose-600">{formatCurrency(selectedService?.price || 0)}</span>
              <span>·</span>
              <span>{formatDuration(selectedService?.duration || 0)}</span>
            </div>
          </div>

          {/* Jadwal */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Jadwal</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Tanggal</p>
                <p className="font-semibold text-slate-800 text-sm">{formatDateLong(selectedDate)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Jam</p>
                <p className="font-semibold text-slate-800 text-sm">{selectedTime} WIB</p>
              </div>
            </div>
          </div>

          {/* Data diri */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide mb-3">Data Diri</p>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2"><span className="text-slate-400 w-24">Nama</span><span className="font-medium text-slate-800">{info.customerName}</span></div>
              <div className="flex gap-2"><span className="text-slate-400 w-24">No. HP</span><span className="font-medium text-slate-800">{info.customerPhone}</span></div>
              {info.customerEmail && <div className="flex gap-2"><span className="text-slate-400 w-24">Email</span><span className="font-medium text-slate-800">{info.customerEmail}</span></div>}
              {info.notes && <div className="flex gap-2"><span className="text-slate-400 w-24">Catatan</span><span className="font-medium text-slate-800">{info.notes}</span></div>}
            </div>
          </div>
        </div>

        <div className="flex gap-3 justify-between mt-6">
          <Button variant="outline" onClick={() => setStep(3)} disabled={isSubmitting}>
            ← Kembali
          </Button>
          <Button
            id="confirm-booking"
            onClick={handleConfirmBooking}
            isLoading={isSubmitting}
            leftIcon={
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            }
          >
            Konfirmasi Booking
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <div className="pt-16">
        <div className="bg-gradient-to-br from-rose-50 to-pink-50 py-10">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <h1 className="text-3xl font-extrabold text-slate-900 text-center mb-1">Form Booking</h1>
            <p className="text-slate-500 text-center text-sm mb-8">Selesaikan proses booking dalam 4 langkah mudah</p>
            <StepIndicator currentStep={currentStep} />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BookingForm;
