import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import type { UserProgram, TrainingProgram } from '@/types/user';

export default function MyProgramsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [userPrograms, setUserPrograms] = useState<(UserProgram & { program: TrainingProgram })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/account/my-programs');
      return;
    }

    if (user) {
      fetchUserPrograms();
    }
  }, [user, authLoading, router]);

  const fetchUserPrograms = async () => {
    if (!user) return;

    try {
      const userProgramsRef = collection(db, 'userPrograms');
      const q = query(userProgramsRef, where('userId', '==', user.uid));
      const snapshot = await getDocs(q);

      const programsWithDetails = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const userProgramData = {
            id: docSnap.id,
            ...docSnap.data(),
            purchasedAt: docSnap.data().purchasedAt?.toDate() || new Date(),
          } as UserProgram;

          // Fetch program details
          const programDoc = await getDoc(doc(db, 'trainingPrograms', userProgramData.programId));
          const programData = programDoc.exists()
            ? {
                id: programDoc.id,
                ...programDoc.data(),
                createdAt: programDoc.data().createdAt?.toDate() || new Date(),
                updatedAt: programDoc.data().updatedAt?.toDate() || new Date(),
              } as TrainingProgram
            : null;

          return {
            ...userProgramData,
            program: programData!,
          };
        })
      );

      setUserPrograms(programsWithDetails.filter(p => p.program));
    } catch (error) {
      console.error('Error fetching user programs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <>
        <Head>
          <title>My Training Programs - Infinity Crochet</title>
        </Head>
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
          <Navbar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading your programs...</p>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>My Training Programs - Infinity Crochet</title>
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 py-12 pt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Training Programs</h1>
              <p className="text-gray-600">Access your purchased programs and track your progress</p>
            </div>

            {userPrograms.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <svg
                  className="mx-auto h-24 w-24 text-gray-400 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  No Programs Yet
                </h2>
                <p className="text-gray-600 mb-8">
                  You haven't purchased any training programs yet
                </p>
                <Link
                  href="/training"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                >
                  Browse Programs
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {userPrograms.map((userProgram) => {
                  const { program } = userProgram;
                  const totalVideos = program.videos?.length || 0;
                  const watchedVideos = Object.values(userProgram.progress || {}).filter(
                    p => p.watched
                  ).length;
                  const completionPercentage =
                    totalVideos > 0 ? (watchedVideos / totalVideos) * 100 : 0;

                  return (
                    <Link
                      key={userProgram.id}
                      href={`/training/${program.id}`}
                      className="card group hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex gap-6">
                        {/* Thumbnail */}
                        <div className="w-48 flex-shrink-0">
                          <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={program.thumbnail || '/placeholder.jpg'}
                              alt={program.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                        </div>

                        {/* Program Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-purple-dark mb-2 group-hover:text-purple transition-colors truncate">
                            {program.name}
                          </h3>

                          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                            {program.description}
                          </p>

                          <div className="space-y-3">
                            {/* Progress Bar */}
                            <div>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Progress</span>
                                <span className="font-semibold text-purple">
                                  {Math.round(completionPercentage)}%
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                                  style={{ width: `${completionPercentage}%` }}
                                />
                              </div>
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                </svg>
                                {watchedVideos}/{totalVideos} videos
                              </span>
                              <span className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                </svg>
                                {new Date(userProgram.purchasedAt).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Continue/Start Button */}
                            <div className="pt-2">
                              {watchedVideos > 0 ? (
                                <div className="text-purple font-medium hover:underline inline-flex items-center gap-1">
                                  Continue Learning
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              ) : (
                                <div className="text-purple font-medium hover:underline inline-flex items-center gap-1">
                                  Start Learning
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="/training"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                ← Browse More Programs
              </Link>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
