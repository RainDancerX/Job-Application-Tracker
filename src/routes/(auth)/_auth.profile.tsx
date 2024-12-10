import { createFileRoute } from '@tanstack/react-router'; 
import { Button } from '@/components/ui/button'; 
import { Input } from '@/components/ui/input'; 
import { Label } from '@/components/ui/label'; 
import { useAuth } from '@/hooks/useAuth'; 
import { useToast } from '@/hooks/use-toast'; 
import { 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential, 
} from 'firebase/auth'; 
import { auth } from '@/lib/firebase'; 
import React from 'react'; 
import { Loader2 } from 'lucide-react'; 
 
export const Route = createFileRoute('/(auth)/_auth/profile')({ 
  component: ProfilePage, 
}); 
 
function ProfilePage() { 
  const { user } = useAuth(); 
  const { toast } = useToast(); 
  const [isLoading, setIsLoading] = React.useState(false); 
  const [currentPassword, setCurrentPassword] = React.useState(''); 
  const [newPassword, setNewPassword] = React.useState(''); 
 
  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) { 
    e.preventDefault(); 
    setIsLoading(true); 
 
    try { 
      const currentUser = auth.currentUser; 
      if (!currentUser?.email) throw new Error('No user found'); 
 
      // Reauthenticate user before password change 
      const credential = EmailAuthProvider.credential( 
        currentUser.email, 
        currentPassword 
      ); 
      await reauthenticateWithCredential(currentUser, credential); 
 
      // Update password 
      await updatePassword(currentUser, newPassword); 
 
      toast({ 
        title: 'Success', 
        description: 'Your password has been updated.', 
      }); 
 
      // Clear form 
      setCurrentPassword(''); 
      setNewPassword(''); 
    } catch (error: any) { 
      toast({ 
        variant: 'destructive', 
        title: 'Error', 
        description: error.message || 'Failed to update password', 
      }); 
    } finally { 
      setIsLoading(false); 
    } 
  } 
 
  return ( 
    <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-sm"> 
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2> 
 
      <div className="mb-6"> 
        <Label>Email</Label> 
        <p className="text-muted-foreground">{user}</p> 
      </div> 
 
      <form onSubmit={handlePasswordChange} className="space-y-4"> 
        <h3 className="text-lg font-semibold">Change Password</h3> 
 
        <div className="space-y-2"> 
          <Label htmlFor="currentPassword">Current Password</Label> 
          <Input 
            id="currentPassword" 
            type="password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            required 
            minLength={8} 
          /> 
        </div> 
 
        <div className="space-y-2"> 
          <Label htmlFor="newPassword">New Password</Label> 
          <Input 
            id="newPassword" 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
            minLength={8} 
          /> 
        </div> 
 
        <Button type="submit" disabled={isLoading} className="w-full"> 
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} 
          Update Password 
        </Button> 
      </form> 
    </div> 
  ); 
} 
