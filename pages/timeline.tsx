import { useState, useEffect, ReactElement } from 'react';
import axios from 'axios';
import { ITweet } from '../../models/Tweet';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Navbar, NavbarItem, NavbarSection, NavbarSpacer } from '@/components/navbar';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Text } from '@/components/text';
import { FooterLink } from '@/components/link';
import { DescriptionList, DescriptionTerm, DescriptionDetails } from '@/components/description-list';

const Timeline: NextPage = (): ReactElement => {
  const [tweets, setTweets] = useState<ITweet[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTweets = async () => {
      try {
        const response = await axios.get('/api/timeline', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        });
        setTweets(response.data);
      } catch (error) {
        setError('Failed to load tweets');
      }
    };

    fetchTweets();
  }, []);

  const handleLike = async (tweetId: string) => {
    try {
      await axios.post(`/api/tweet/${tweetId}/like`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setTweets((prevTweets) =>
        prevTweets.map(tweet =>
          tweet._id === tweetId
            ? { ...tweet, likes: tweet.likes + 1 }
            : tweet
        )
      );
    } catch (error) {
      setError('Failed to like tweet');
    }
  };

  const handleRetweet = async (tweetId: string) => {
    try {
      await axios.post(`/api/tweet/${tweetId}/retweet`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      });
      setError(null);
    } catch (error) {
      setError('Failed to retweet');
    }
  };

  return (
    <div className='flex flex-col h-screen'>
      {/* Header */}
      <Navbar>
        <NavbarSection>
          <NavbarItem href='/'>Home</NavbarItem>
          <NavbarItem href='/profile'>Profile</NavbarItem>
          <NavbarItem href='/notifications'>Notifications</NavbarItem>
          <NavbarItem href='/logout'>Log Out</NavbarItem>
          <NavbarItem href='/compose-tweet'>Compose Tweet</NavbarItem>
        </NavbarSection>
      </Navbar>

      {/* Main Content */}
      <main className='flex-1 overflow-auto p-4'>
        {error && <div className='text-red-500'>{error}</div>}
        {tweets.map((tweet) => (
          <div key={tweet._id} className='border border-gray-300 p-4 mb-4 rounded'>
            <div className='flex items-center mb-2'>
              <Avatar src={tweet.author.profilePicture} className='w-8 h-8 mr-2' />
              <span className='font-semibold'>{tweet.author.username}</span>
            </div>
            <Text>{tweet.text}</Text>
            <div className='flex space-x-4'>
              <Button onClick={() => handleLike(tweet._id)} className='text-blue-500'>Like ({tweet.likes})</Button>
              <Button onClick={() => handleRetweet(tweet._id)} className='text-green-500'>Retweet ({tweet.retweets})</Button>
              <Link href={`/tweet/${tweet._id}`}>Comment</Link>
            </div>
          </div>
        ))}
      </main>

      {/* Footer */}
      <footer className='bg-gray-800 text-white p-4'>
        <div className='container mx-auto text-center space-x-4'>
          <FooterLink href='/terms'>Terms</FooterLink>
          <FooterLink href='/privacy'>Privacy Policy</FooterLink>
          <FooterLink href='/support'>Support</FooterLink>
        </div>
      </footer>
    </div>
  );
};

export default Timeline;
