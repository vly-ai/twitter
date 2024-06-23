import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { IUser } from '../../models/User';
import { ITweet } from '../../models/Tweet';
import { Navbar, NavbarItem, NavbarSection } from '@/components/navbar';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/button';
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/dialog';
import { Input } from '@/components/input';
import { Textarea } from '@/components/textarea';
import { Field, Label } from '@/components/fieldset';
import { Listbox, ListboxLabel, ListboxOption } from '@/components/listbox';
import { Divider } from '@/components/divider';
import { Text } from '@/components/text';

const ProfilePage = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [followers, setFollowers] = useState<IUser[]>([]);
  const [following, setFollowing] = useState<IUser[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [profilePicture, setProfilePicture] = useState<File | null>(null);

  useEffect(() => {
    fetchUserDetails();
    fetchFollowers();
    fetchFollowing();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/profile', { headers: { Authorization: `Bearer ${token}` } });
      setUser(response.data);
      setUsername(response.data.username);
      setBio(response.data.bio);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchFollowers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/profile/followers', { headers: { Authorization: `Bearer ${token}` } });
      setFollowers(response.data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    }
  };

  const fetchFollowing = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/profile/following', { headers: { Authorization: `Bearer ${token}` } });
      setFollowing(response.data);
    } catch (error) {
      console.error('Error fetching following:', error);
    }
  };

  const handleEditProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('bio', bio);
      if (profilePicture) {
        formData.append('profile_picture', profilePicture);
      }
      
      await axios.post('/api/profile/update', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });

      setEditMode(false);
      fetchUserDetails();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleFollowUnfollow = async (targetUserId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/profile/follow', { targetUserId }, { headers: { Authorization: `Bearer ${token}` } });
      fetchFollowers();
      fetchFollowing();
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
    }
  };

  return (
    <div>
      <header className='border-b'>
        <Navbar>
          <NavbarSection>
            <NavbarItem href='/'>Home</NavbarItem>
            <NavbarItem href='/notifications'>Notifications</NavbarItem>
            <NavbarItem href='/logout'>Log Out</NavbarItem>
          </NavbarSection>
        </Navbar>
      </header>

      <main className='p-4'>
        {user && (
          <div>
            <div className='flex items-center mb-4'>
              <Avatar src={user.profilePicture || '/default-profile.png'} className='size-20' />
              <div className='ml-4'>
                <Text className='text-lg font-semibold'>{user.username}</Text>
                <Text className='text-sm'>{user.bio}</Text>
                <Button onClick={() => setEditMode(true)} className='mt-2'>Edit Profile</Button>
              </div>
            </div>

            <Dialog open={editMode} onClose={() => setEditMode(false)}>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Modify your profile details</DialogDescription>
              <DialogBody>
                <Field>
                  <Label>Username</Label>
                  <Input type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
                </Field>
                <Field>
                  <Label>Bio</Label>
                  <Textarea value={bio} onChange={(e) => setBio(e.target.value)} />
                </Field>
                <Field>
                  <Label>Profile Picture</Label>
                  <Input type='file' onChange={(e) => setProfilePicture(e.target.files?.[0] || null)} />
                </Field>
              </DialogBody>
              <DialogActions>
                <Button plain onClick={() => setEditMode(false)}>Cancel</Button>
                <Button onClick={handleEditProfile}>Save</Button>
              </DialogActions>
            </Dialog>

            <Divider className='my-4' />

            <div>
              <Text className='text-lg font-semibold'>Followers</Text>
              <Listbox className='mb-4'>
                {followers.map(follower => (
                  <ListboxOption key={follower._id} value={follower._id}>
                    <ListboxLabel>{follower.username}</ListboxLabel>
                    <Button onClick={() => handleFollowUnfollow(follower._id)}>Unfollow</Button>
                  </ListboxOption>
                ))}
              </Listbox>

              <Divider className='my-4' />

              <Text className='text-lg font-semibold'>Following</Text>
              <Listbox>
                {following.map(followedUser => (
                  <ListboxOption key={followedUser._id} value={followedUser._id}>
                    <ListboxLabel>{followedUser.username}</ListboxLabel>
                    <Button onClick={() => handleFollowUnfollow(followedUser._id)}>Unfollow</Button>
                  </ListboxOption>
                ))}
              </Listbox>
            </div>
          </div>
        )}
      </main>

      <footer className='p-4 border-t'>
        <Navbar>
          <NavbarSection>
            <NavbarItem href='/terms'>Terms</NavbarItem>
            <NavbarItem href='/privacy'>Privacy Policy</NavbarItem>
          </NavbarSection>
        </Navbar>
      </footer>
    </div>
  );
};

export default ProfilePage;
