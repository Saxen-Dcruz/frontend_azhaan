// src/components/streams/AdvancedBroadcastStudio.js
import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Mic, 
  MicOff, 
  Users, 
  Square, 
  Circle,
  Settings,
  Volume2,
  Headphones,
  BarChart3,
  MessageCircle,
  Clock,
  Download,
  Share2,
  MoreHorizontal,
  Bell,
  Eye,
  Heart,
  MessageSquare,
  Sparkles,
  Zap,
  Wifi,
  WifiOff,
  Bluetooth,
  Cast
} from 'lucide-react';

const AdvancedBroadcastStudio = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // State management
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [listeners, setListeners] = useState(0);
  const [duration, setDuration] = useState(0);
  const [streamQuality, setStreamQuality] = useState('HD');
  const [isRecording, setIsRecording] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [activeTab, setActiveTab] = useState('controls');
  
  // Stream configuration
  const [streamConfig, setStreamConfig] = useState({
    title: '',
    description: '',
    category: 'talk',
    isPublic: true,
    allowChat: true,
    recordStream: false,
    audioQuality: 'high',
    noiseSuppression: true,
    echoCancellation: true,
    autoGainControl: true
  });

  // Real-time metrics
  const [metrics, setMetrics] = useState({
    bitrate: '128 kbps',
    latency: '45ms',
    packetLoss: '0.1%',
    jitter: '2ms',
    cpuUsage: '15%'
  });

  // Mock chat messages
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Listener1', message: 'Great stream!', time: '2:30' },
    { id: 2, user: 'MusicLover', message: 'Audio quality is amazing!', time: '2:31' },
    { id: 3, user: 'TechFan', message: 'What mic are you using?', time: '2:32' }
  ]);

  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const durationIntervalRef = useRef(null);
  const listenerIntervalRef = useRef(null);

  const categories = [
    { value: 'talk', label: 'Talk Show', icon: '💬' },
    { value: 'music', label: 'Music', icon: '🎵' },
    { value: 'education', label: 'Education', icon: '📚' },
    { value: 'gaming', label: 'Gaming', icon: '🎮' },
    { value: 'business', label: 'Business', icon: '💼' },
    { value: 'technology', label: 'Technology', icon: '⚡' }
  ];

  const audioQualities = [
    { value: 'low', label: 'Standard (64kbps)', description: 'Good for talk shows' },
    { value: 'medium', label: 'High (128kbps)', description: 'Balanced quality' },
    { value: 'high', label: 'Ultra (256kbps)', description: 'Best for music' }
  ];

  // Simulate audio analysis
  const analyzeAudio = () => {
    if (!isBroadcasting || isMuted) {
      setAudioLevel(0);
      return;
    }

    const level = Math.random() * 100;
    setAudioLevel(level);

    // Update metrics based on audio level
    setMetrics(prev => ({
      ...prev,
      bitrate: `${Math.floor(128 + level * 0.5)} kbps`,
      cpuUsage: `${Math.floor(10 + level * 0.1)}%`
    }));
  };

  // Start broadcast
  const startBroadcast = async () => {
    if (!streamConfig.title.trim()) {
      alert('Please enter a stream title');
      return;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: streamConfig.echoCancellation,
          noiseSuppression: streamConfig.noiseSuppression,
          autoGainControl: streamConfig.autoGainControl,
          sampleRate: streamConfig.audioQuality === 'high' ? 48000 : 44100,
          channelCount: streamConfig.audioQuality === 'high' ? 2 : 1
        } 
      });
      
      mediaStreamRef.current = stream;

      // Set up audio analysis
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);

      // Start duration timer
      const startTime = Date.now();
      durationIntervalRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      // Simulate listener growth
      listenerIntervalRef.current = setInterval(() => {
        setListeners(prev => {
          const growth = Math.floor(Math.random() * 3);
          return prev + growth;
        });
      }, 5000);

      // Start audio analysis
      const audioInterval = setInterval(analyzeAudio, 100);

      setIsBroadcasting(true);
      setListeners(1); // Start with host

      // Cleanup function
      return () => {
        clearInterval(audioInterval);
      };

    } catch (error) {
      console.error('Error starting broadcast:', error);
      alert('Error accessing microphone. Please check your permissions.');
    }
  };

  // Stop broadcast
  const stopBroadcast = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current);
    }
    
    if (listenerIntervalRef.current) {
      clearInterval(listenerIntervalRef.current);
    }
    
    setIsBroadcasting(false);
    setListeners(0);
    setDuration(0);
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

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Audio visualization component
  const AudioVisualizer = () => (
    <div className="bg-gray-750 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold flex items-center space-x-2">
          <Volume2 className="h-5 w-5" />
          <span>Audio Levels</span>
        </h3>
        <div className="text-sm text-gray-400">
          {Math.round(audioLevel)}% Input
        </div>
      </div>
      
      {/* Main audio level bar */}
      <div className="w-full bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
        <div 
          className={`h-3 rounded-full transition-all duration-100 ${
            audioLevel > 90 ? 'bg-red-500' : 
            audioLevel > 70 ? 'bg-yellow-500' : 'bg-green-500'
          }`}
          style={{ width: `${audioLevel}%` }}
        ></div>
      </div>
      
      {/* Audio spectrum visualization */}
      <div className="flex items-end justify-between h-16 space-x-1">
        {Array.from({ length: 32 }).map((_, i) => {
          const height = Math.random() * 100 * (audioLevel / 100);
          const opacity = 0.3 + (height / 100) * 0.7;
          return (
            <div
              key={i}
              className={`flex-1 rounded-t transition-all duration-75 ${
                audioLevel > 90 ? 'bg-red-500' : 
                audioLevel > 70 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{
                height: `${height}%`,
                opacity: audioLevel > 0 ? opacity : 0.3
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );

  // Metrics panel component
  const MetricsPanel = () => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
      <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
        <BarChart3 className="h-5 w-5" />
        <span>Stream Analytics</span>
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-gray-750 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{listeners}</div>
          <div className="text-sm text-gray-400">Live Listeners</div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{metrics.bitrate}</div>
          <div className="text-sm text-gray-400">Bitrate</div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">{metrics.latency}</div>
          <div className="text-sm text-gray-400">Latency</div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400">{metrics.packetLoss}</div>
          <div className="text-sm text-gray-400">Packet Loss</div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4">
          <div className="text-2xl font-bold text-orange-400">{metrics.jitter}</div>
          <div className="text-sm text-gray-400">Jitter</div>
        </div>
        
        <div className="bg-gray-750 rounded-lg p-4">
          <div className="text-2xl font-bold text-red-400">{metrics.cpuUsage}</div>
          <div className="text-sm text-gray-400">CPU Usage</div>
        </div>
      </div>
    </div>
  );

  // Chat panel component
  const ChatPanel = () => (
    <div className="bg-gray-800 rounded-lg border border-gray-700 h-96 flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h3 className="text-lg font-semibold flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Live Chat</span>
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {chatMessages.length}
          </span>
        </h3>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.map(message => (
          <div key={message.id} className="flex space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">
                {message.user.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium text-sm">{message.user}</span>
                <span className="text-gray-500 text-xs">{message.time}</span>
              </div>
              <p className="text-gray-300 text-sm mt-1">{message.message}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Send a message..."
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Send
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      {/* Header */}
      <header className="bg-gray-800/80 backdrop-blur-lg border-b border-gray-700/50 p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${
                isBroadcasting ? 'bg-red-500 animate-pulse' : 'bg-gray-500'
              }`}></div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {isBroadcasting ? 'Live Broadcast' : 'Stream Studio'}
              </h1>
            </div>
            
            {isBroadcasting && (
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{formatTime(duration)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-300">{listeners} listeners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className="text-gray-300">{streamQuality}</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {isBroadcasting && (
              <>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <Download className="h-5 w-5" />
                </button>
                <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </>
            )}
            
            <button
              onClick={isBroadcasting ? stopBroadcast : () => navigate('/dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isBroadcasting 
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {isBroadcasting ? 'End Stream' : 'Exit Studio'}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {!isBroadcasting ? (
          // Setup Interface
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Setup Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                  <h2 className="text-2xl font-bold">Create New Broadcast</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Stream Title */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Stream Title *
                    </label>
                    <input
                      type="text"
                      value={streamConfig.title}
                      onChange={(e) => setStreamConfig(prev => ({...prev, title: e.target.value}))}
                      placeholder="What are you streaming about?"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Description
                    </label>
                    <textarea
                      value={streamConfig.description}
                      onChange={(e) => setStreamConfig(prev => ({...prev, description: e.target.value}))}
                      placeholder="Tell your audience what to expect..."
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Category Selection */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Category
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat.value}
                          onClick={() => setStreamConfig(prev => ({...prev, category: cat.value}))}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                            streamConfig.category === cat.value
                              ? 'border-blue-500 bg-blue-500/20'
                              : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                          }`}
                        >
                          <div className="text-2xl mb-2">{cat.icon}</div>
                          <div className="text-white font-medium">{cat.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Audio Quality */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-3">
                      Audio Quality
                    </label>
                    <div className="space-y-2">
                      {audioQualities.map(quality => (
                        <label key={quality.value} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-700/50 border border-gray-600 cursor-pointer hover:bg-gray-700 transition-colors">
                          <input
                            type="radio"
                            name="audioQuality"
                            value={quality.value}
                            checked={streamConfig.audioQuality === quality.value}
                            onChange={(e) => setStreamConfig(prev => ({...prev, audioQuality: e.target.value}))}
                            className="text-blue-500 focus:ring-blue-500"
                          />
                          <div>
                            <div className="text-white font-medium">{quality.label}</div>
                            <div className="text-gray-400 text-sm">{quality.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Settings */}
                  <div className="bg-gray-750 rounded-xl p-4">
                    <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Advanced Settings</span>
                    </h3>
                    
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Noise Suppression</span>
                        <input
                          type="checkbox"
                          checked={streamConfig.noiseSuppression}
                          onChange={(e) => setStreamConfig(prev => ({...prev, noiseSuppression: e.target.checked}))}
                          className="rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Echo Cancellation</span>
                        <input
                          type="checkbox"
                          checked={streamConfig.echoCancellation}
                          onChange={(e) => setStreamConfig(prev => ({...prev, echoCancellation: e.target.checked}))}
                          className="rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Auto Gain Control</span>
                        <input
                          type="checkbox"
                          checked={streamConfig.autoGainControl}
                          onChange={(e) => setStreamConfig(prev => ({...prev, autoGainControl: e.target.checked}))}
                          className="rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                        />
                      </label>
                      
                      <label className="flex items-center justify-between">
                        <span className="text-gray-300">Record Stream</span>
                        <input
                          type="checkbox"
                          checked={streamConfig.recordStream}
                          onChange={(e) => setStreamConfig(prev => ({...prev, recordStream: e.target.checked}))}
                          className="rounded bg-gray-600 border-gray-500 text-blue-500 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Start Broadcast Button */}
                  <button
                    onClick={startBroadcast}
                    disabled={!streamConfig.title.trim()}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-500/25 flex items-center justify-center space-x-3"
                  >
                    <Circle className="h-6 w-6" />
                    <span className="text-lg">Start Live Broadcast</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Panel */}
            <div className="space-y-6">
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                
                <div className="space-y-4">
                  <div className="bg-gray-750 rounded-lg p-4">
                    <div className="text-center text-gray-400 mb-4">
                      Audio Preview
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-750 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-semibold">Ready</div>
                      <div className="text-gray-400">Microphone</div>
                    </div>
                    <div className="bg-gray-750 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-semibold">Optimal</div>
                      <div className="text-gray-400">Connection</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h4 className="font-semibold text-blue-300 mb-3 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Broadcast Tips</span>
                </h4>
                <ul className="text-sm text-blue-200 space-y-2">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Test your audio levels before going live</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Use a quiet environment for better quality</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Engage with your audience in chat</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Keep your stream description updated</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          // Live Broadcast Interface
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Main Content Area */}
            <div className="xl:col-span-3 space-y-6">
              {/* Stream Info Card */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h2 className="text-2xl font-bold text-white">{streamConfig.title}</h2>
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <span>LIVE</span>
                      </span>
                    </div>
                    
                    {streamConfig.description && (
                      <p className="text-gray-300 mb-4">{streamConfig.description}</p>
                    )}
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <span>{user?.name}</span>
                      </div>
                      <span>•</span>
                      <span>{categories.find(c => c.value === streamConfig.category)?.label}</span>
                      <span>•</span>
                      <span>{streamConfig.audioQuality.toUpperCase()} Quality</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-gray-750 px-3 py-2 rounded-lg">
                      <Eye className="h-4 w-4 text-green-400" />
                      <span className="text-white font-semibold">{listeners}</span>
                    </div>
                    <div className="flex items-center space-x-1 bg-gray-750 px-3 py-2 rounded-lg">
                      <Heart className="h-4 w-4 text-red-400" />
                      <span className="text-white font-semibold">{Math.floor(listeners * 1.5)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Controls & Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Audio Controls */}
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
                  <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
                    <Headphones className="h-5 w-5" />
                    <span>Broadcast Controls</span>
                  </h3>
                  
                  <div className="space-y-6">
                    <AudioVisualizer />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={toggleMute}
                        className={`p-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                          isMuted 
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25' 
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/25'
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
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 ${
                          isRecording
                            ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        <Circle className="h-5 w-5" />
                        <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Stream Metrics */}
                <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
                  <MetricsPanel />
                </div>
              </div>

              {/* Additional Controls */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Stream Management</h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors flex flex-col items-center space-y-2">
                    <Bell className="h-6 w-6 text-blue-400" />
                    <span className="text-sm font-medium">Notifications</span>
                  </button>
                  
                  <button className="p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors flex flex-col items-center space-y-2">
                    <Wifi className="h-6 w-6 text-green-400" />
                    <span className="text-sm font-medium">Connection</span>
                  </button>
                  
                  <button className="p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors flex flex-col items-center space-y-2">
                    <Bluetooth className="h-6 w-6 text-purple-400" />
                    <span className="text-sm font-medium">Devices</span>
                  </button>
                  
                  <button className="p-4 bg-gray-750 rounded-xl hover:bg-gray-700 transition-colors flex flex-col items-center space-y-2">
                    <Cast className="h-6 w-6 text-orange-400" />
                    <span className="text-sm font-medium">Output</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Chat Panel */}
              <ChatPanel />
              
              {/* Listener Activity */}
              <div className="bg-gray-800/60 backdrop-blur-lg rounded-2xl border border-gray-700/50 p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300">5 new listeners joined</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300">User123 shared your stream</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-gray-300">Stream quality is excellent</span>
                  </div>
                </div>
              </div>
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-300">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    Share Stream Link
                  </button>
                  <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    Invite Co-host
                  </button>
                  <button className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
                    Stream Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedBroadcastStudio;