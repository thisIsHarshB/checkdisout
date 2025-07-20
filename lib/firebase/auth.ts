import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User, AuthUser } from '../types';

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

// Email/Password Authentication
export const signInWithEmail = async (email: string, password: string): Promise<AuthUser> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    throw error as AuthError;
  }
};

export const signUpWithEmail = async (email: string, password: string, displayName: string): Promise<AuthUser> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Create user profile in Firestore
    const userProfile: Omit<User, 'id'> = {
      email: user.email!,
      displayName: displayName,
      age: undefined,
      location: '',
      bio: '',
      profilePicture: user.photoURL || undefined,
      qualities: [],
      skills: [],
      socialLinks: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), userProfile);
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    throw error as AuthError;
  }
};

// Google Authentication
export const signInWithGoogle = async (): Promise<AuthUser> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user profile exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // Create user profile for new Google users
      const userProfile: Omit<User, 'id'> = {
        email: user.email!,
        displayName: user.displayName || 'User',
        age: undefined,
        location: '',
        bio: '',
        profilePicture: user.photoURL || undefined,
        qualities: [],
        skills: [],
        socialLinks: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);
    }
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  } catch (error) {
    throw error as AuthError;
  }
};

// Logout
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error as AuthError;
  }
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: AuthUser | null) => void) => {
  return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
    if (user) {
      const authUser: AuthUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
      };
      callback(authUser);
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  const user = auth.currentUser;
  if (user) {
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };
  }
  return null;
}; 