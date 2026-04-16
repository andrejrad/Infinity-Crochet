import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import StarRating from '@/components/StarRating';
import type { TrainingProgram, UserProgram, ProgramReview } from '@/types/user';

export default function ProgramDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [program, setProgram] = useState<TrainingProgram | null>(null);
  const [userProgram, setUserProgram] = useState<UserProgram | null>(null);
  const [reviews, setReviews] = useState<ProgramReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProgram();
    }
  }, [id, user]);

  const fetchProgram = async () => {
    try {
      const programDoc = await getDoc(doc(db, 'trainingPrograms', id as string));
      
      if (!programDoc.exists()) {
        router.push('/404');
        return;
      }

      const programData = {
        id: programDoc.id,
        ...programDoc.data(),
        createdAt: programDoc.data().createdAt?.toDate() || new Date(),
        updatedAt: programDoc.data().updatedAt?.toDate() || new Date(),
      } as TrainingProgram;

      setProgram(programData);

      // Set first free video as default selected
      const firstFreeVideo = programData.videos?.find(v => v.isFree);
      if (firstFreeVideo) {
        setSelectedVideo(firstFreeVideo.youtubeUrl);
      }

     // Check if user owns this program
      if (user) {
        const userProgramsRef = collection(db, 'userPrograms');
        const q = query(
          userProgramsRef,
          where('userId', '==', user.uid),
          where('programId', '==', id)
        );
        const userProgramSnapshot = await getDocs(q);
        
        if (!userProgramSnapshot.empty) {
          const userProgramData = {
            id: userProgramSnapshot.docs[0].id,
            ...userProgramSnapshot.docs[0].data(),
            purchasedAt: userProgramSnapshot.docs[0].data().purchasedAt?.toDate() || new Date(),
          } as UserProgram;
          setUserProgram(userProgramData);
          
          // If user owns it, set first video as default
          if (programData.videos && programData.videos.length > 0) {
            setSelectedVideo(programData.videos[0].youtubeUrl);
          }
        }
      }

      // Fetch reviews
      const reviewsRef = collection(db, 'programReviews');
      const reviewsQuery = query(reviewsRef, where('programId', '==', id));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ProgramReview[];
      
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!user) {
      router.push(`/login?redirect=/training/${id}`);
      return;
    }

    setPurchasing(true);
    try {
      const response = await fetch('/api/create-program-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programId: id,
          userId: user.uid,
          userEmail: user.email,
        }),
      });

      const data = await response.json();
      
      console.log('Checkout response:', { status: response.status, data });

      if (response.ok && data.url) {
        window.location.href = data.url;
      } else {
        const errorMessage = data.error || 'Failed to start checkout';
        console.error('Checkout error:', errorMessage, data);
        alert(`Error: ${errorMessage}`);
        setPurchasing(false);
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
      alert('Failed to start checkout. Please try again.');
      setPurchasing(false);
    }
  };

  const getYouTubeEmbedUrl = (url: string) => {
    const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();
    return `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1&disablekb=1&fs=0&iv_load_policy=3&cc_load_policy=0&playsinline=1`;
  };

  const canWatchVideo = (video: any) => {
    return video.isFree || userProgram !== null;
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const formatReviewDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!program) {
    return null;
  }

  return (
    <>
      <Head>
        <title>{program.name} - Infinity Crochet Training</title>
        <meta name="description" content={program.description} />
      </Head>

      <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
        <Navbar />

        <main className="flex-1 pt-24 pb-12">
          <div className="container-custom">
            {/* Breadcrumb */}
            <nav className="text-sm text-gray-600 mb-6">
              <Link href="/" className="hover:text-purple">Home</Link>
              {' / '}
              <Link href="/training" className="hover:text-purple">Training</Link>
              {' / '}
              <span className="text-purple-dark">{program.name}</span>
            </nav>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player */}
                {selectedVideo ? (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(selectedVideo)}
                        title="Training Video"
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-2xl shadow-lg p-12 text-center aspect-video flex items-center justify-center">
                    <div>
                      <div className="text-6xl mb-4">🔒</div>
                      <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                        Select a Video
                      </h3>
                      <p className="text-gray-600">
                        {userProgram
                          ? 'Choose a video from the list to start watching'
                          : 'Purchase this program to access all videos'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Program Info */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h1 className="text-4xl font-bold text-purple-dark mb-4">
                    {program.name}
                  </h1>

                  {reviews.length > 0 && (
                    <div className="flex items-center gap-3 mb-6">
                      <StarRating rating={Math.round(averageRating)} readonly size="md" />
                      <span className="text-gray-600">
                        {averageRating.toFixed(1)} out of 5 ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-6 text-gray-600 mb-6">
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      {program.videos?.length || 0} Videos
                    </span>
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {program.estimatedTime}
                    </span>
                  </div>

                  <div className="prose max-w-none">
                    <h3 className="text-xl font-semibold text-purple-dark mb-3">About This Program</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {program.description}
                    </p>
                  </div>

                  {userProgram && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 font-medium">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        You own this program - Lifetime access unlocked!
                      </div>
                      <Link
                        href="/account/my-programs"
                        className="text-green-700 hover:text-green-800 text-sm mt-2 inline-block underline"
                      >
                        View in My Programs →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Video List */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-purple-dark mb-6">Course Content</h2>
                  <div className="space-y-3">
                    {program.videos && program.videos.length > 0 ? (
                      program.videos
                        .sort((a, b) => a.order - b.order)
                        .map((video, index) => {
                          const canWatch = canWatchVideo(video);
                          const isSelected = selectedVideo === video.youtubeUrl;
                          
                          return (
                            <button
                              key={video.id}
                              onClick={() => canWatch && setSelectedVideo(video.youtubeUrl)}
                              disabled={!canWatch}
                              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                                isSelected
                                  ? 'border-purple bg-purple-50'
                                  : canWatch
                                  ? 'border-gray-200 hover:border-purple hover:bg-purple-50'
                                  : 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                              }`}
                            >
                              <div className="flex items-start gap-4">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                  isSelected ? 'bg-purple text-white' : 'bg-gray-200 text-gray-600'
                                }`}>
                                  {canWatch ? (
                                    isSelected ? (
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                      </svg>
                                    ) : (
                                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                      </svg>
                                    )
                                  ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className={`font-semibold ${isSelected ? 'text-purple' : 'text-gray-900'}`}>
                                      {index + 1}. {video.title}
                                    </h3>
                                    {video.isFree && (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                        FREE
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 line-clamp-2">
                                    {video.description}
                                  </p>
                                  {video.duration && (
                                    <p className="text-xs text-gray-500 mt-1">{video.duration}</p>
                                  )}
                                </div>
                              </div>
                            </button>
                          );
                        })
                    ) : (
                      <p className="text-gray-500 text-center py-8">No videos yet</p>
                    )}
                  </div>
                </div>

                {/* Reviews Section */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-purple-dark mb-6">Reviews</h2>
                  
                  {reviews.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                      <svg
                        className="mx-auto h-16 w-16 text-gray-400 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                        />
                      </svg>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No reviews yet
                      </h3>
                      <p className="text-gray-600">
                        Be the first to review this program after purchasing!
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="font-semibold text-gray-900">
                                  {review.userInitials}
                                </span>
                                {review.verifiedPurchase && (
                                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                    Verified Purchase
                                  </span>
                                )}
                              </div>
                              <StarRating rating={review.rating} readonly size="sm" />
                            </div>
                            <span className="text-sm text-gray-500">
                              {formatReviewDate(review.createdAt)}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-gray-700 leading-relaxed">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    {userProgram ? (
                      <div>
                        <div className="text-center py-4">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            You Own This Program
                          </h3>
                          <p className="text-gray-600 text-sm mb-6">
                            Purchased on {new Date(userProgram.purchasedAt).toLocaleDateString()}
                          </p>
                        </div>
                        
                        {userProgram.completionPercentage !== undefined && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progress</span>
                              <span className="font-semibold text-purple">
                                {Math.round(userProgram.completionPercentage)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-purple h-2 rounded-full transition-all"
                                style={{ width: `${userProgram.completionPercentage}%` }}
                              />
                            </div>
                          </div>
                        )}

                        <Link
                          href="/account/my-programs"
                          className="block w-full px-6 py-3 bg-purple text-white text-center font-medium rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          View My Programs
                        </Link>
                      </div>
                    ) : (
                      <div>
                        <div className="text-4xl font-bold text-purple mb-6 text-center">
                          ${program.price.toFixed(2)}
                        </div>
                        
                        <button
                          onClick={handlePurchase}
                          disabled={purchasing}
                          className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mb-4"
                        >
                          {purchasing ? 'Processing...' : user ? 'Purchase Program' : 'Login to Purchase'}
                        </button>

                        <div className="space-y-3 text-sm text-gray-600">
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Lifetime access</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Watch on any device</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>Progress tracking</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
 </svg>
                            <span>Learn at your own pace</span>
                          </div>
                        </div>

                        {!user && (
                          <p className="text-xs text-gray-500 mt-4 text-center">
                            You need to be logged in to purchase this program
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
