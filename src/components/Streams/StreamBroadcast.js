import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Headphones, 
  Users, 
  Square, 
  Circle,
  Settings,
  Volume2
} from 'lucide-react';

const StreamBroadcast = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [category, setCategory] = useState('talk');
  const [listeners, setListeners] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const animationRef = useRef(null);

  const categories = [
    { value: 'talk', label: 'Talk Show' },
    { value: 'music', label: 'Music' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' }
  ];

  // Simulate audio level visualization
  const simulateAudioLevel = () => {
    if (isBroadcasting && !isMuted) {
      const level = Math.random() * 100;
      setAudioLevel(level);
    } else {
      setAudioLevel(0);
    }
  };

  useEffect(() => {
    let interval;
    if (isBroadcasting) {
      interval = setInterval(simulateAudioLevel, 100);
      // Simulate listeners joining
      const listenerInterval = setInterval(() => {
        setListeners(prev => prev + Math.floor(Math.random() * 3));
      }, 5000);
      return () => {
        clearInterval(interval);
        clearInterval(listenerInterval);
      };
    }
    return () => clearInterval(interval);
  }, [isBroadcasting]);

  const startBroadcast = async () => {
    if (!streamTitle.trim()) {
      alert('Please enter a stream title');
      return;
    }

    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      mediaStreamRef.current = stream;
      
      // Set up audio analysis for visualization
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      setIsBroadcasting(true);
      
      // Simulate initial listeners
      setListeners(Math.floor(Math.random() * 10) + 1);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Error accessing microphone. Please check your permissions.');
    }
  };

  const stopBroadcast = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setIsBroadcasting(false);
    setListeners(0);
    setAudioLevel(0);
  };

  const toggleMute = () => {
    if (mediaStreamRef.current) {
      const audioTracks = mediaStreamRef.current.getAudioTracks();
      audioTracks.forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const handleEndStream = () => {
    stopBroadcast();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${isBroadcasting ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
            <h1 className="text-xl font-bold">
              {isBroadcasting ? 'Live Broadcast' : 'Stream Setup'}
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {isBroadcasting && (
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <Users className="h-4 w-4" />
                <span>{listeners} listeners</span>
              </div>
            )}
            
            <button
              onClick={handleEndStream}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              {isBroadcasting ? 'End Stream' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        {!isBroadcasting ? (
          // Stream Setup Form
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
            <h2 className="text-2xl font-bold mb-6">Start a New Broadcast</h2>
            
            <div className="space-y-6">
              {/* Stream Title */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Stream Title *
                </label>
                <input
                  type="text"
                  value={streamTitle}
                  onChange={(e) => setStreamTitle(e.target.value)}
                  placeholder="Enter a compelling title for your stream"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Stream Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  value={streamDescription}
                  onChange={(e) => setStreamDescription(e.target.value)}
                  placeholder="Describe what your stream is about..."
                  rows="4"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Audio Settings Preview */}
              <div className="bg-gray-750 rounded-lg p-4 border border-gray-600">
                <h3 className="text-lg font-semibold mb-3 flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Audio Preview</span>
                </h3>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Microphone</span>
                      <span className="text-sm text-green-400">Ready</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full transition-all duration-100"
                        style={{ width: '75%' }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                    <Volume2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Start Broadcast Button */}
              <button
                onClick={startBroadcast}
                disabled={!streamTitle.trim()}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Circle className="h-5 w-5" />
                <span>Start Broadcasting</span>
              </button>
            </div>
          </div>
        ) : (
          // Live Broadcast Interface
          <div className="space-y-6">
            {/* Stream Info Card */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{streamTitle}</h2>
                  {streamDescription && (
                    <p className="text-gray-300 mb-4">{streamDescription}</p>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>Host: {user?.name}</span>
                    <span>Category: {categories.find(c => c.value === category)?.label}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 bg-red-600 px-3 py-1 rounded-full">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-white font-semibold">LIVE</span>
                </div>
              </div>
            </div>

            {/* Audio Controls */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Headphones className="h-5 w-5" />
                <span>Broadcast Controls</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Audio Visualization */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Audio Level</span>
                    <span className="text-sm text-gray-400">{Math.round(audioLevel)}%</span>
                  </div>
                  
                  <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-100"
                      style={{ width: `${audioLevel}%` }}
                    ></div>
                  </div>
                  
                  {/* Audio Bars Visualization */}
                  <div className="flex items-end justify-between h-12 space-x-1">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-green-500 rounded-t transition-all duration-100"
                        style={{
                          height: `${Math.random() * 100}%`,
                          opacity: audioLevel > 0 ? 0.7 + (Math.random() * 0.3) : 0.3
                        }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-col space-y-4">
                  <button
                    onClick={toggleMute}
                    className={`flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-semibold transition-colors ${
                      isMuted 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isMuted ? (
                      <MicOff className="h-5 w-5" />
                    ) : (
                      <Mic className="h-5 w-5" />
                    )}
                    <span>{isMuted ? 'Unmute' : 'Mute'}</span>
                  </button>
                  
                  <button
                    onClick={stopBroadcast}
                    className="flex items-center justify-center space-x-2 py-3 px-6 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                  >
                    <Square className="h-5 w-5" />
                    <span>Stop Broadcast</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Listeners Stats */}
            <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Audience</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-750 rounded-lg">
                  <div className="text-2xl font-bold text-white">{listeners}</div>
                  <div className="text-sm text-gray-400">Current Listeners</div>
                </div>
                
                <div className="text-center p-4 bg-gray-750 rounded-lg">
                  <div className="text-2xl font-bold text-white">{(listeners * 2.5).toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Avg. Listen Time (min)</div>
                </div>
                
                <div className="text-center p-4 bg-gray-750 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">Live</div>
                  <div className="text-sm text-gray-400">Status</div>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-semibold text-blue-300 mb-2">Broadcast Tips</h4>
              <ul className="text-sm text-blue-200 space-y-1">
                <li>• Speak clearly and at a consistent volume</li>
                <li>• Engage with your audience through chat</li>
                <li>• Monitor your audio levels to avoid distortion</li>
                <li>• Keep your stream description updated</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamBroadcast;