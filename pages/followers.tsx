import { useEffect, useState } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { IUser } from '../../models/User';
import { fetchFollowers } from '../../lib/axiosHelper';
import { Avatar } from '@/components/avatar';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Divider } from '@/components/divider';
import { Text } from '@/components/text';
import { Button } from '@/components/button';

const FollowersPage: NextPage = () => {
    const [followers, setFollowers] = useState<IUser[]>([]);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        const getFollowers = async () => {
            try {
                const data = await fetchFollowers('/api/profile/followers', { headers: { Authorization: 'Bearer YOUR_TOKEN_HERE' } });
                setFollowers(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load followers');
            }
        };
        getFollowers();
    }, []);

    return (
        <div className='min-h-screen flex flex-col'>
            <header className='bg-gray-800 text-white p-4'>
                <Navbar>
                    <NavbarSection>
                        <NavbarItem href='/home'>Home</NavbarItem>
                        <NavbarItem href='/timeline'>Timeline</NavbarItem>
                        <NavbarItem href='/profile'>Profile</NavbarItem>
                        <NavbarItem href='/logout'>Logout</NavbarItem>
                    </NavbarSection>
                </Navbar>
            </header>

            <main className='flex-1 p-4 overflow-y-auto'>
                {error && <Text className='text-red-500'>{error}</Text>}
                {!error && followers.map((follower) => (
                    <div key={follower._id} className='flex items-center p-4'>
                        <Avatar src={follower.profilePicture} alt='Profile' className='w-12 h-12 rounded-full mr-4' />
                        <div>
                            <Link href={`/profile/${follower._id}`}>{follower.username}</Link>
                        </div>
                        <Divider />
                    </div>
                ))}
            </main>

            <footer className='bg-gray-800 text-white p-4 text-center'>
                <Button href='/terms'>Terms</Button> | <Button href='/privacy'>Privacy Policy</Button>
            </footer>
        </div>
    );
};

export default FollowersPage;