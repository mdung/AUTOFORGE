import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../services/api';

const loginSchema = z.object({
  email: z.string().email({ message: "Định dạng Email không hợp lệ" }),
  password: z.string().min(6, { message: "Mật khẩu phải từ 6 ký tự trở lên" })
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage({ onLoginSuccess }: { onLoginSuccess: (user: any) => void }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await api.login(data.email, data.password);
      onLoginSuccess({
        id: result.userId,
        email: result.email,
        firstName: result.firstName,
        lastName: result.lastName,
        role: result.role,
        token: result.token
      });
    } catch (e) {
      alert("Sai email đăng nhập hoặc mật khẩu!");
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-app)' }}>
      <form onSubmit={handleSubmit(onSubmit)} className="card" style={{ width: '400px', display: 'flex', flexDirection: 'column', gap: '16px', padding: '30px' }}>
        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Auto<span>Forge</span> Login</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Workshop Management Suite</p>
        </div>

        <div className="input-group">
          <span className="input-label">Email đăng nhập</span>
          <input className="input-field" type="text" {...register('email')} placeholder="advisor@autoforge.com" />
          {errors.email && <span style={{ color: 'var(--primary)', fontSize: '0.7rem', marginTop: '4px' }}>{errors.email.message}</span>}
        </div>

        <div className="input-group">
          <span className="input-label">Mật khẩu</span>
          <input className="input-field" type="password" {...register('password')} placeholder="••••••" />
          {errors.password && <span style={{ color: 'var(--primary)', fontSize: '0.7rem', marginTop: '4px' }}>{errors.password.message}</span>}
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }} disabled={isSubmitting}>
          {isSubmitting ? 'Đang xác thực...' : 'Đăng Nhập'}
        </button>
      </form>
    </div>
  );
}
