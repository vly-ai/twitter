import { useState, useEffect } from 'react';
import { NextPage } from 'next';
import Link from 'next/link';
import axios from 'axios';
import { ITweet } from '../models/Tweet';
import { IUser } from '../models/User';
import { fetchPopularTweets } from '../lib/fetchPopularTweets';
import { fetchPersonalizedFeed } from '../lib/fetchPersonalizedFeed';
import { useRouter } from 'next/router';
import { verifyToken } from '../lib/authenticate';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Button } from '@/components/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';
import { Alert } from '@/components/alert';

const Home: NextPage = () => {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const router = useRouter();
  
  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const decodedUser = verifyToken(token);
          setUser(decodedUser);
          const personalizedTweets = await fetchPersonalizedFeed(token);
          setTweets(personalizedTweets);
        } else {
          const popularTweets = await fetchPopularTweets();
          setTweets(popularTweets);
        }
      } catch (err) {
        setError('Error fetching tweets');
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, []);

  const handleTweetClick = (tweetId: string) => {
    router.push(`/tweets/${tweetId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setTweets([]);
    fetchPopularTweets()
      .then(setTweets)
      .catch(() => setError('Error fetching popular tweets'));
  };

  return (
    <div className='container mx-auto px-4'>
      <Navbar>
        <NavbarSection>
          <NavbarItem href='/'>Home</NavbarItem>
          {user ? (
            <>
              <NavbarItem href='/profile'>Profile</NavbarItem>
              <NavbarItem href='/compose-tweet'>Compose Tweet</NavbarItem>
              <Button onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <NavbarItem href='/login'>Login</NavbarItem>
              <NavbarItem href='/register'>Register</NavbarItem>
            </>
          )}
        </NavbarSection>
      </Navbar>
      <main>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <Alert>{error}</Alert>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Author</TableHeader>
                <TableHeader>Tweet</TableHeader>
                <TableHeader>Actions</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {tweets.map((tweet) => (
                <TableRow key={tweet._id} className='tweet'>
                  <TableCell>{tweet.author.username}</TableCell>
                  <TableCell>{tweet.text}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleTweetClick(tweet._id)}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </main>
      <footer className='py-4'>
        <nav>
          <Link href='/about'>About</Link>
          {' | '}
          <Link href='/help'>Help</Link>
          {' | '}
          <Link href='/terms'>Terms</Link>
          {' | '}
          <Link href='/privacy'>Privacy Policy</Link>
        </nav>
      </footer>
    </div>
  );
};

export default Home;
