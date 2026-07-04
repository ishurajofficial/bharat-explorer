'use client';

import { useState, useEffect } from 'react';
import { useTravelStore } from '@/store/travel-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Calendar, Phone, MapPin, FileText } from 'lucide-react';
import { motion } from 'motion/react';

export default function SettingsPage() {
  const { user, updateProfile } = useTravelStore();
  
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    phone: '',
    address: '',
    bio: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Pre-fill form when user data loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        dob: user.dob || '',
        phone: user.phone || '',
        address: user.address || '',
        bio: user.bio || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage('');
    
    try {
      updateProfile(formData);
      setSaveMessage('Profile updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setSaveMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return (
    <div className="flex-1 p-4 md:p-8 flex items-center justify-center h-[50vh]">
      <p className="text-muted-foreground">Please log in to view settings.</p>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-8 max-w-4xl mx-auto w-full pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground">Manage your profile information and preferences.</p>
        </div>

        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle>Profile Details</CardTitle>
            <CardDescription>
              Update your personal information to personalize your Bharat Explorer experience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="flex items-center gap-4 pb-4 mb-4 border-b border-border/30">
                <div className="w-16 h-16 rounded-full bg-background border border-border flex items-center justify-center text-2xl overflow-hidden shrink-0">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    user.avatar
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email || 'No email provided'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="w-4 h-4 text-muted-foreground" />
                    Display Name
                  </Label>
                  <Input 
                    id="name" 
                    name="name"
                    value={formData.name} 
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    Date of Birth
                  </Label>
                  <Input 
                    id="dob" 
                    name="dob"
                    type="date"
                    value={formData.dob} 
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    Phone Number
                  </Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    type="tel"
                    placeholder="+91 "
                    value={formData.phone} 
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    Address / City
                  </Label>
                  <Input 
                    id="address" 
                    name="address"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={formData.address} 
                    onChange={handleChange}
                    className="bg-background/50"
                  />
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio" className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    placeholder="Tell us a bit about your travel interests..."
                    value={formData.bio}
                    onChange={handleChange}
                    className="flex w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/30">
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
                {saveMessage && (
                  <p className={`text-sm ${saveMessage.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                    {saveMessage}
                  </p>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
