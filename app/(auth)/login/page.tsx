'use client';

import { useState } from 'react';
import { Form, Input, Button, Card, Alert, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const { Title } = Typography;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null); // Clear any previous error
    try {
      const result = await signIn('credentials', {
        redirect: false,
        username: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError('Invalid credentials');
      } else {
        router.push('/');
      }
    } catch (err) {
         setError('An error occurred, please try again');
             if (err instanceof Error) {
               console.error('Error during login:', err);
           }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-md rounded-lg">
        <div className="text-center mb-6">
          <Title level={2} style={{ marginBottom: 0 }}>
            Login
          </Title>
          <p className="text-gray-500 text-sm mt-1">
            Please login to your account
          </p>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email address' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email address"
              size="large"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your password',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>
           {error && (
                         <Form.Item>
                             <Alert
                                 message={error}
                                 type="error"
                                 showIcon
                             />
                         </Form.Item>
                    )}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              loading={loading}
            >
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}