import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { collection, doc, getDoc, setDoc, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { TrainingProgram, ProgramVideo } from '@/types/user';

export default function ProgramEditorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [programData, setProgramData] = useState({
    name: '',
    slug: '',
    description: '',
    price: 0,
    thumbnail: '',
    estimatedTime: '',
    published: false,
  });

  const [videos, setVideos] = useState<ProgramVideo[]>([]);
  const [newVideo, setNewVideo] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    duration: '',
    isFree: false,
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      checkAdminAndFetch();
    }
  }, [user, authLoading, router, id]);

  const checkAdminAndFetch = async () => {
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();

      if (userData?.role !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);

      if (id && id !== 'new') {
        fetchProgram();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      router.push('/');
    }
  };

  const fetchProgram = async () => {
    if (!id || id === 'new') return;

    setLoading(true);
    try {
      const programDoc = await getDoc(doc(db, 'trainingPrograms', id as string));
      
      if (programDoc.exists()) {
        const data = programDoc.data() as TrainingProgram;
        setProgramData({
          name: data.name,
          slug: data.slug,
          description: data.description,
          price: data.price,
          thumbnail: data.thumbnail,
          estimatedTime: data.estimatedTime,
          published: data.published,
        });
        setVideos(data.videos || []);
      }
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleProgramChange = (field: string, value: any) => {
    setProgramData(prev => ({
      ...prev,
      [field]: value,
      ...(field === 'name' ? { slug: generateSlug(value) } : {}),
    }));
  };

  const addVideo = () => {
    if (!newVideo.title || !newVideo.youtubeUrl) {
      alert('Please fill in at least title and YouTube URL');
      return;
    }

    const video: ProgramVideo = {
      id: Date.now().toString(),
      title: newVideo.title,
      description: newVideo.description,
      youtubeUrl: newVideo.youtubeUrl,
      duration: newVideo.duration,
      order: videos.length,
      isFree: newVideo.isFree,
    };

    setVideos([...videos, video]);
    setNewVideo({
      title: '',
      description: '',
      youtubeUrl: '',
      duration: '',
      isFree: false,
    });
  };

  const removeVideo = (videoId: string) => {
    setVideos(videos.filter(v => v.id !== videoId).map((v, index) => ({ ...v, order: index })));
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === videos.length - 1)
    ) {
      return;
    }

    const newVideos = [...videos];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newVideos[index], newVideos[newIndex]] = [newVideos[newIndex], newVideos[index]];
    
    // Update order
    newVideos.forEach((v, i) => {
      v.order = i;
    });

    setVideos(newVideos);
  };

  const handleSave = async () => {
    // Validation
    if (!programData.name || !programData.slug || !programData.description || programData.price <= 0) {
      alert('Please fill in all required fields (Name, Description, Price)');
      return;
    }

    if (videos.length === 0) {
      alert('Please add at least one video to the program');
      return;
    }

    setSaving(true);
    try {
      const programToSave = {
        ...programData,
        videos,
        updatedAt: Timestamp.now(),
      };

      if (id && id !== 'new') {
        // Update existing
        await setDoc(doc(db, 'trainingPrograms', id as string), programToSave, { merge: true });
        alert('Program updated successfully!');
      } else {
        // Create new
        const docRef = await addDoc(collection(db, 'trainingPrograms'), {
          ...programToSave,
          createdAt: Timestamp.now(),
        });
        alert('Program created successfully!');
        router.push(`/admin/programs/edit/${docRef.id}`);
      }
    } catch (error) {
      console.error('Error saving program:', error);
      alert('Failed to save program: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{id === 'new' ? 'Create' : 'Edit'} Program - Admin</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {id === 'new' ? 'Create New Program' : 'Edit Program'}
              </h1>
              <p className="text-gray-600 mt-1">Manage program details and video content</p>
            </div>
            <Link
              href="/admin/programs"
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back to Programs
            </Link>
          </div>

          {/* Program Details */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Details</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={programData.name}
                  onChange={(e) => handleProgramChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="e.g., Beginner's Guide to Amigurumi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Slug <span className="text-gray-500 text-xs">(auto-generated)</span>
                </label>
                <input
                  type="text"
                  value={programData.slug}
                  onChange={(e) => handleProgramChange('slug', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="beginners-guide-to-amigurumi"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={programData.description}
                  onChange={(e) => handleProgramChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Describe what students will learn in this program..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (USD) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={programData.price}
                    onChange={(e) => handleProgramChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estimated Time
                  </label>
                  <input
                    type="text"
                    value={programData.estimatedTime}
                    onChange={(e) => handleProgramChange('estimatedTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., 4 hours"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Thumbnail URL
                </label>
                <input
                  type="url"
                  value={programData.thumbnail}
                  onChange={(e) => handleProgramChange('thumbnail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="https://example.com/thumbnail.jpg"
                />
                {programData.thumbnail && (
                  <img
                    src={programData.thumbnail}
                    alt="Thumbnail preview"
                    className="mt-2 w-48 h-28 object-cover rounded border"
                  />
                )}
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="published"
                  checked={programData.published}
                  onChange={(e) => handleProgramChange('published', e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                  Publish program (make visible to users)
                </label>
              </div>
            </div>
          </div>

          {/* Video Management */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Videos</h2>
            
            {/* Existing Videos List */}
            {videos.length > 0 && (
              <div className="mb-6 space-y-3">
                {videos.map((video, index) => (
                  <div key={video.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => moveVideo(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveVideo(index, 'down')}
                        disabled={index === videos.length - 1}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {index + 1}. {video.title}
                            {video.isFree && (
                              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                FREE
                              </span>
                            )}
                          </h4>
                          <p className="text-sm text-gray-600">{video.description}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {video.youtubeUrl} {video.duration && `• ${video.duration}`}
                          </p>
                        </div>
                        <button
                          onClick={() => removeVideo(video.id)}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add New Video Form */}
            <div className="border-t pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Add New Video</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Video Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newVideo.title}
                    onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Introduction to Materials"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    YouTube URL <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="url"
                    value={newVideo.youtubeUrl}
                    onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use unlisted YouTube videos to prevent direct access
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newVideo.description}
                    onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="What this video covers..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration (optional)
                    </label>
                    <input
                      type="text"
                      value={newVideo.duration}
                      onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="e.g., 12:45"
                    />
                  </div>

                  <div className="flex items-end">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={newVideo.isFree}
                        onChange={(e) => setNewVideo({ ...newVideo, isFree: e.target.checked })}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Free preview video
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  onClick={addVideo}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  + Add Video
                </button>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {videos.length} video{videos.length !== 1 ? 's' : ''} • 
              {videos.filter(v => v.isFree).length} free preview{videos.filter(v => v.isFree).length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <Link
                href="/admin/programs"
                className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Program'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
