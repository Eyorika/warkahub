import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ error: any }>;
    register: (userData: Partial<User>, password: string) => Promise<{ error: any }>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setLoading(false);
            }
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                fetchProfile(session.user.id);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const fetchProfile = async (userId: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                console.warn('Profile not found, using auth fallback:', error);
                // Fallback to basic auth user info if profile fetch fails
                const { data: sessionData } = await supabase.auth.getSession();
                const authUser = sessionData.session?.user;

                if (authUser) {
                    setUser({
                        id: userId,
                        name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'User',
                        email: authUser.email || '',
                        phone: authUser.phone || '',
                        role: authUser.user_metadata?.role || 'customer',
                        createdAt: authUser.created_at,
                    });
                }
                return;
            }

            if (data) {
                setUser({
                    id: userId,
                    name: data.full_name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    role: data.role || 'customer',
                    profileImage: data.avatar_url,
                    createdAt: data.created_at,
                    ...data
                });
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        return { error };
    };

    const register = async (userData: Partial<User>, password: string) => {
        if (!userData.email) return { error: { message: 'Email is required' } };

        // 1. Sign up auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email: userData.email,
            password,
            options: {
                data: {
                    full_name: userData.name,
                    role: userData.role
                }
            }
        });

        if (authError) return { error: authError };
        if (!authData.user) return { error: { message: 'Registration failed' } };

        // 2. Create profile entry
        const { error: profileError } = await supabase
            .from('profiles')
            .insert([{
                id: authData.user.id,
                full_name: userData.name,
                email: userData.email, // Storing email in profile for easy access
                role: userData.role,
                business_name: userData.role === 'vendor' ? (userData as any).businessName : null,
                created_at: new Date().toISOString(),
            }]);

        if (profileError) {
            // Cleanup auth user if profile creation fails (optional but good practice)
            return { error: profileError };
        }

        return { error: null };
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
};
