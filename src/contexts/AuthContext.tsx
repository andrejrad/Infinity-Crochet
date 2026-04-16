import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail,
  deleteUser
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { User } from '@/types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: userData.displayName || firebaseUser.displayName,
            photoURL: userData.photoURL || firebaseUser.photoURL,
            role: userData.role || 'user',
            createdAt: userData.createdAt?.toDate() || new Date(),
          });
        } else {
          // Create user document if it doesn't exist
          const newUser: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            role: 'user',
            createdAt: new Date(),
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            email: newUser.email,
            displayName: newUser.displayName,
            photoURL: newUser.photoURL,
            role: newUser.role,
            createdAt: newUser.createdAt,
          });
          
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update profile
    await updateProfile(userCredential.user, { displayName });
    
    // Create user document in Firestore
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      displayName,
      photoURL: null,
      role: 'user', // Default role
      createdAt: new Date(),
    });
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const updateUserProfile = async (displayName: string) => {
    if (!auth.currentUser || !user) {
      throw new Error('No user logged in');
    }

    // Update Firebase Auth profile
    await updateProfile(auth.currentUser, { displayName });

    // Update Firestore document
    await updateDoc(doc(db, 'users', user.uid), {
      displayName,
    });

    // Update local state
    setUser({
      ...user,
      displayName,
    });
  };

  const deleteAccount = async () => {
    if (!auth.currentUser || !user) {
      throw new Error('No user logged in');
    }

    const userId = user.uid;

    try {
      // Delete all user's orders
      const ordersQuery = query(collection(db, 'orders'), where('userId', '==', userId));
      const ordersSnapshot = await getDocs(ordersQuery);
      
      const deletePromises = ordersSnapshot.docs.map(orderDoc => 
        deleteDoc(doc(db, 'orders', orderDoc.id))
      );
      await Promise.all(deletePromises);

      // Delete user's cart if it exists
      try {
        await deleteDoc(doc(db, 'carts', userId));
      } catch (err) {
        // Cart might not exist, ignore error
      }

      // Delete user document
      await deleteDoc(doc(db, 'users', userId));

      // Delete Firebase Auth account
      await deleteUser(auth.currentUser);
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword, updateUserProfile, deleteAccount, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
