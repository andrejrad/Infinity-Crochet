import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import type { TrainingProgram, ProgramReview } from '@/types/user';

export default function TrainingPage() {
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [reviews, setReviews] = useState<Record<string, ProgramReview[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const programsRef = collection(db, 'trainingPrograms');
      const q = query(programsRef, where('published', '==', true));
      const snapshot = await getDocs(q);
      
      const programsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate() || new Date(),
      })) as TrainingProgram[];
      
      setPrograms(programsData);

      // Fetch reviews for all programs
      const reviewsRef = collection(db, 'programReviews');
      const reviewsSnapshot = await getDocs(reviewsRef);
      const reviewsMap: Record<string, ProgramReview[]> = {};
      
      reviewsSnapshot.docs.forEach(doc => {
        const review = {
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate() || new Date(),
          updatedAt: doc.data().updatedAt?.toDate(),
        } as ProgramReview;
        
        if (!reviewsMap[review.programId]) {
          reviewsMap[review.programId] = [];
        }
        reviewsMap[review.programId].push(review);
      });
      
      setReviews(reviewsMap);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = (programId: string) => {
    const programReviews = reviews[programId] || [];
    if (programReviews.length === 0) return 0;
    const sum = programReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / programReviews.length;
  };

  return (
    <>
      <Head>
        <title>Online Training - Infinity Crochet</title>
        <meta name="description" content="Learn crochet from the comfort of your home with our comprehensive online training programs" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 pt-24">
          {/* Hero Section */}
          <section className="gradient-bg py-20">
            <div className="container-custom text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                Online Training Programs
              </h1>
              <p className="text-xl text-white/90 max-w-3xl mx-auto mb-4">
                Master the art of crochet with our comprehensive video training programs
              </p>
              <p className="text-lg text-white/80 max-w-2xl mx-auto">
                Purchase once, access forever. Each program includes step-by-step video tutorials 
                that you can watch at your own pace, anytime, anywhere.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-16 bg-white">
            <div className="container-custom">
              <h2 className="text-3xl font-bold text-purple-dark text-center mb-12">
                How It Works
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-dark mb-2">
                    Choose Your Program
                  </h3>
                  <p className="text-gray-600">
                    Browse our training programs and select the one that matches your learning goals
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">🔓</span>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-dark mb-2">
                    Purchase & Unlock
                  </h3>
                  <p className="text-gray-600">
                    Log in and purchase the program to get instant lifetime access to all videos
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">📚</span>
                  </div>
                  <h3 className="text-xl font-semibold text-purple-dark mb-2">
                    Learn at Your Pace
                  </h3>
                  <p className="text-gray-600">
                    Watch and rewatch videos anytime. Your progress is automatically tracked
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Programs Grid */}
          <section className="py-16">
            <div className="container-custom">
              <h2 className="text-3xl font-bold text-purple-dark mb-12 text-center">
                Available Programs
              </h2>

              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
                </div>
              ) : programs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
                  <div className="text-6xl mb-4">📹</div>
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                    No Programs Available Yet
                  </h3>
                  <p className="text-gray-600">
                    Check back soon for exciting new training programs!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {programs.map(program => {
                    const programReviews = reviews[program.id] || [];
                    const averageRating = getAverageRating(program.id);
                    const videoCount = program.videos?.length || 0;
                    const freeVideoCount = program.videos?.filter(v => v.isFree).length || 0;

                    return (
                      <Link
                        key={program.id}
                        href={`/training/${program.id}`}
                        className="card group hover:shadow-xl transition-all duration-300"
                      >
                        <div className="aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
                          <img
                            src={program.thumbnail || '/placeholder.jpg'}
                            alt={program.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-purple-dark mb-2 group-hover:text-purple transition-colors">
                            {program.name}
                          </h3>
                          
                          {programReviews.length > 0 && (
                            <div className="flex items-center gap-2 mb-3">
                              <StarRating rating={Math.round(averageRating)} readonly size="sm" />
                              <span className="text-sm text-gray-600">
                                {averageRating.toFixed(1)} ({programReviews.length})
                              </span>
                            </div>
                          )}

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {program.description}
                          </p>

                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              {videoCount} video{videoCount !== 1 ? 's' : ''}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {program.estimatedTime}
                            </span>
                          </div>

                          {freeVideoCount > 0 && (
                            <div className="text-xs text-green-600 font-medium mb-3">
                              ✓ {freeVideoCount} free preview video{freeVideoCount !== 1 ? 's' : ''}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                            <div className="text-2xl font-bold text-purple">
                              ${program.price.toFixed(2)}
                            </div>
                            <div className="text-purple font-medium group-hover:underline">
                              View Details →
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="py-16 bg-white">
            <div className="container-custom">
              <h2 className="text-3xl font-bold text-purple-dark text-center mb-12">
                Why Choose Our Training Programs?
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl mb-3">⏰</div>
                  <h3 className="font-semibold text-purple-dark mb-2">Lifetime Access</h3>
                  <p className="text-gray-600 text-sm">
                    Watch anytime, forever. No subscriptions or time limits
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📱</div>
                  <h3 className="font-semibold text-purple-dark mb-2">Any Device</h3>
                  <p className="text-gray-600 text-sm">
                    Access on computer, tablet, or phone - wherever you learn best
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🎯</div>
                  <h3 className="font-semibold text-purple-dark mb-2">Your Pace</h3>
                  <p className="text-gray-600 text-sm">
                    Pause, rewind, rewatch - learn at the speed that works for you
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📊</div>
                  <h3 className="font-semibold text-purple-dark mb-2">Track Progress</h3>
                  <p className="text-gray-600 text-sm">
                    Automatic progress tracking keeps you motivated and organized
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
}
