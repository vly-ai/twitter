import { useState } from 'react';
import { NextPage } from 'next';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarSection, NavbarItem } from '@/components/navbar';
import { Input } from '@/components/input';
import { Button } from '@/components/button';
import { Alert } from '@/components/alert';
import { Fieldset, Label } from '@/components/fieldset';
import { Text } from '@/components/text';

const Login: NextPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await axios.post('/api/login', { email, password });
      setMessage(response.data.message);
      if (response.data.token) {
        setMessage('Login successful');
        router.push('/');
      }
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <header className='bg-gray-800 text-white p-4'>
        <Navbar>
          <NavbarSection>
            <NavbarItem href='/'>Home</NavbarItem>
            <NavbarItem href='/register'>Register</NavbarItem>
          </NavbarSection>
        </Navbar>
      </header>

      <main className='flex-grow container mx-auto flex items-center justify-center'>
        <div className='w-full max-w-sm'>
          <form onSubmit={handleSubmit} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
            <Fieldset>
              <legend className='text-2xl mb-4 text-center'>Login</legend>

              <div className='mb-4'>
                <Label htmlFor='email' className='block text-gray-700 text-sm font-bold mb-2'>Email:</Label>
                <Input id='email' type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className='mb-6'>
                <Label htmlFor='password' className='block text-gray-700 text-sm font-bold mb-2'>Password:</Label>
                <Input id='password' type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>

              {message && <Alert size='sm'>{message}</Alert>}

              <div className='flex items-center justify-between'>
                <Button type='submit'>Login</Button>
              </div>
            </Fieldset>
          </form>
        </div>
      </main>

      <footer className='bg-gray-800 text-white p-4'>
        <div className='container mx-auto text-center'>
          <Text className='flex justify-center space-x-4'>
            <Link href='/about'>About</Link>
            <Link href='/help'>Help</Link>
            <Link href='/terms'>Terms</Link>
            <Link href='/privacy'>Privacy Policy</Link>
          </Text>
        </div>
      </footer>
    </div>
  );
};

export default Login;
