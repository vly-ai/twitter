import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Alert, AlertDescription } from '@/components/alert';
import { Field, Label } from '@/components/fieldset';

interface FormState {
  username: string;
  email: string;
  password: string;
}

interface MessageState {
  type: 'success' | 'error';
  content: string;
}

export default function Register() {
  const [form, setForm] = useState<FormState>({ username: '', email: '', password: '' });
  const [message, setMessage] = useState<MessageState | null>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/register', form);
      setMessage({ type: 'success', content: 'User registered successfully!' });
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error: any) {
      const errorMessage = error.response?.data.message || 'Registration failed';
      setMessage({ type: 'error', content: errorMessage });
    }
  };

  return (
    <div className='flex flex-col min-h-screen'>
      <header className='bg-gray-800 p-4 text-white flex justify-between'>
        <Navbar>
          <NavbarSection>
            <NavbarItem href='/'>Home</NavbarItem>
            <NavbarItem href='/login'>Login</NavbarItem>
          </NavbarSection>
        </Navbar>
      </header>
      <main className='flex grow justify-center items-center p-4'>
        <div className='w-full max-w-md'>
          <h1 className='text-2xl font-bold mb-4'>Register</h1>
          {message && (
            <Alert size='md' onClose={() => setMessage(null)}>
              <AlertDescription>{message.content}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className='space-y-4'>
            <Field>
              <Label>Username</Label>
              <Input
                type='text'
                name='username'
                value={form.username}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
              />
            </Field>
            <Field>
              <Label>Password</Label>
              <Input
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                required
              />
            </Field>
            <Button type='submit' className='w-full'>Register</Button>
          </form>
        </div>
      </main>
      <footer className='bg-gray-800 p-4 text-white text-center'>
        <nav>
          <Link href='/about' className='mr-4'>About</Link>
          <Link href='/help' className='mr-4'>Help</Link>
          <Link href='/terms' className='mr-4'>Terms</Link>
          <Link href='/privacy'>Privacy Policy</Link>
        </nav>
      </footer>
    </div>
  );
}