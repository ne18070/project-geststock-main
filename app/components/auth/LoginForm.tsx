'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button } from 'antd';
import { signIn, useSession } from 'next-auth/react';
import { useAppDispatch } from '@/app/lib/hooks';
import { login } from '@/app/lib/slices/authSlice';

const LoginForm = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  interface FormValues {
    email: string;
    password: string;
  }

  const handleFinish = async (values: FormValues) => {
    const result = await signIn('credentials', {
      redirect: false,
      email: values.email,
      password: values.password,
      callbackUrl: '/',
    });

    if (result?.error) {
      setError(result.error);
      return;
    }
    if (result?.ok && result.ok && session?.user) {
      if (session?.user?.email) {
        dispatch(
          login({
            id: session.user.id || '',
            email: session.user.email,
            role: session.user.role || '',
            name: session.user.name || '',
          }),
        );
      } else {
        setError('Email is missing from the session.');
      }
    }
    router.push('/');
  };

  return (
    <Form onFinish={handleFinish}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Veuillez saisir votre email!' }]}
      >
        <Input type="email" />
      </Form.Item>
      <Form.Item
        label="Mot de Passe"
        name="password"
        rules={[
          { required: true, message: 'Veuillez saisir votre mot de passe!' },
        ]}
      >
        <Input type="password" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Se Connecter
        </Button>
      </Form.Item>
    </Form>
  );
};

export default LoginForm;
