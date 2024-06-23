import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { verifyToken } from '../lib/auth';
import { IUser } from '../models/User';
import { ITweet } from '../models/Tweet';
import { Navbar, NavbarSection, NavbarItem, NavbarSpacer } from '@/components/navbar';
import { Button } from '@/components/button';
import { Textarea } from '@/components/textarea';
import { Input } from '@/components/input';

const ComposeTweetPage = () => {
  const [text, setText] = useState<string>('');
  const [charCount, setCharCount] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [user, setUser] = useState<IUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded: any = verifyToken(token);
      setUser(decoded);
    } else {
      router.push('/login');
    }
  }, [router]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const tweetText = e.target.value;
    setText(tweetText);
    setCharCount(tweetText.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      return setMessage('Authentication required');
    }

    try {
      const response = await axios.post('/api/tweets/create', { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.status === 201) {
        setMessage('Tweet posted successfully');
        setText('');
        setCharCount(0);
      }
    } catch (error) {
      setMessage('Failed to post tweet');
    }
  };

  return (
    <div className='min-h-screen flex flex-col justify-between'>
      <header className='h-16 shadow-md'>
        <Navbar>
          <NavbarSection>
            <NavbarItem href='/home'>Home</NavbarItem>
            <NavbarItem href='/profile'>Profile</NavbarItem>
            <NavbarItem href='/notifications'>Notifications</NavbarItem>
          </NavbarSection>
          <NavbarSpacer />
          <NavbarSection>
            {user && (
              <Button onClick={() => {
                localStorage.removeItem('token');
                router.push('/login');
              }}>Log Out</Button>
            )}
          </NavbarSection>
        </Navbar>
      </header>
      <main className='flex-grow flex items-center justify-center'>
        <div className='w-1/2'>
          <form onSubmit={handleSubmit} className='flex flex-col items-center'>
            <Textarea
              className='w-full p-2 border border-gray-300 rounded'
              maxLength={280}
              value={text}
              onChange={handleTextChange}
              placeholder='What\'s happening?'
            ></Textarea>
            <div className='self-end mt-1'>{charCount}/280</div>
            <Button type='submit' className='mt-4'>Tweet</Button>
          </form>
          {message && <div className='mt-4 text-center'>{message}</div>}
        </div>
      </main>
      <footer className='h-16 flex items-center justify-around p-4 shadow-t-md'>
        <Link href='/terms'>Terms</Link>
        <Link href='/privacy-policy'>Privacy Policy</Link>
        <Link href='/support'>Support</Link>
      </footer>
    </div>
  );
};

export default ComposeTweetPage;