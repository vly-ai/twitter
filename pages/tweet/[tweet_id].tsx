import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ITweet } from '../../../models/Tweet';
import { IComment } from '../../../models/Comment';
import Link from 'next/link';
import { Avatar } from '@/components/avatar';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Button } from '@/components/button';
import { Textarea } from '@/components/textarea';
import { Text } from '@/components/text';
import { Divider } from '@/components/divider';

const TweetDetails = () => {
  const router = useRouter();
  const { tweet_id } = router.query;
  const [tweet, setTweet] = useState<ITweet | null>(null);
  const [comments, setComments] = useState<IComment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tweet_id) {
      fetchTweetDetails(tweet_id as string);
      fetchComments(tweet_id as string);
    }
  }, [tweet_id]);

  const fetchTweetDetails = async (id: string) => {
    try {
      const response = await axios.get(`/api/tweet/${id}`);
      setTweet(response.data);
    } catch (error) {
      setError('Failed to fetch tweet details');
    }
  };

  const fetchComments = async (id: string) => {
    try {
      const response = await axios.get(`/api/tweet/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      setError('Failed to fetch comments');
    }
  };

  const handleLike = async () => {
    try {
      await axios.post(`/api/tweet/${tweet_id}/like`);
      if (tweet) {
        setTweet({ ...tweet, likes: tweet.likes ? tweet.likes + 1 : 1 });
      }
    } catch (error) {
      setError('Failed to like the tweet');
    }
  };

  const handleRetweet = async () => {
    try {
      await axios.post(`/api/tweet/${tweet_id}/retweet`);
      fetchTweetDetails(tweet_id as string);
    } catch (error) {
      setError('Failed to retweet');
    }
  };

  const handleCommentSubmit = async () => {
    if (newComment.length > 280 || newComment.length === 0) {
      setError('Comment length should be between 1 and 280 characters');
      return;
    }
    try {
      const response = await axios.post(`/api/tweet/${tweet_id}/comment`, { comment: newComment });
      setComments([...comments, response.data.newComment]);
      setNewComment('');
    } catch (error) {
      setError('Failed to post the comment');
    }
  };

  return (
    <div className='container mx-auto px-4'>
      <Navbar>
        <NavbarSection>
          <NavbarItem href='/'>Home</NavbarItem>
          <NavbarItem href='/profile'>Profile</NavbarItem>
          <NavbarItem href='/timeline'>Timeline</NavbarItem>
          <NavbarItem href='/notifications'>Notifications</NavbarItem>
          <NavbarItem href='/logout'>Log Out</NavbarItem>
        </NavbarSection>
      </Navbar>
      <main className='flex flex-col items-center'>
        {tweet && (
          <div className='tweet-details w-full max-w-2xl p-4 border-b border-gray-300'>
            <div className='flex items-center'>
              <Avatar src={tweet.author.profilePicture || '/default-profile.png'} className='w-12 h-12 rounded-full mr-4' />
              <div>
                <Text>{tweet.author.username}</Text>
                <Text className='text-gray-500 text-sm'>{new Date(tweet.createdAt).toLocaleString()}</Text>
              </div>
            </div>
            <div className='my-4'>{tweet.text}</div>
            <div className='flex space-x-4'>
              <Button onClick={handleLike}>Like {tweet.likes}</Button>
              <Button onClick={handleRetweet}>Retweet {tweet.retweets}</Button>
              <Button>Comment</Button>
            </div>
          </div>
        )}

        {error && <Text className='text-red-500'>{error}</Text>}
        <Divider />
        <section className='comments w-full max-w-2xl mt-4'>
          <h2 className='text-xl font-semibold'>Comments</h2>
          <form className='mt-4' onSubmit={(e) => { e.preventDefault(); handleCommentSubmit(); }}>
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className='w-full p-2 border border-gray-400 rounded focus:outline-none focus:border-blue-400'
              maxLength={280}
            />
            <div className='flex justify-between items-center mt-2'>
              <Text>{newComment.length} / 280</Text>
              <Button type='submit' variant='solid' color='blue'>Submit</Button>
            </div>
          </form>
          {comments.map((comment) => (
            <div key={comment._id} className='comment mt-4'>
              <div className='flex items-center'>
                <Avatar src={comment.author.profilePicture || '/default-profile.png'} className='w-8 h-8 rounded-full mr-2' />
                <div>
                  <Text>{comment.author.username}</Text>
                  <Text className='text-gray-500 text-sm'>{new Date(comment.createdAt).toLocaleString()}</Text>
                </div>
              </div>
              <div className='mt-2'>{comment.content}</div>
            </div>
          ))}
        </section>
        </main>
        <footer className='flex justify-center py-4 border-t border-gray-300'>
          <Navbar>
            <NavbarSection>
              <NavbarItem href='/terms'>Terms</NavbarItem>
              <NavbarItem href='/privacy'>Privacy Policy</NavbarItem>
              <NavbarItem href='/about'>About</NavbarItem>
              <NavbarItem href='/help'>Help</NavbarItem>
            </NavbarSection>
          </Navbar>
        </footer>
    </div>
  );
};

export default TweetDetails;