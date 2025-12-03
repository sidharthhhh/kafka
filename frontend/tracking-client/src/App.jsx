import { useState } from 'react';
import useTracker from './hooks/useTracker';
import './index.css';

function App() {
  const { trackEvent } = useTracker();
  const [clicks, setClicks] = useState(0);

  const handleClick = (buttonName) => {
    trackEvent('click', `/${buttonName}`);
    setClicks((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-4xl w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-12 border border-white/20">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-extrabold text-white mb-4">
              Visitor Tracking Demo
            </h1>
            <p className="text-xl text-white/80">
              Interact with the page to generate tracking events
            </p>
            <div className="mt-6 inline-block bg-white/20 rounded-full px-6 py-2">
              <span className="text-white font-semibold">
                Total Clicks: {clicks}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <button
              onClick={() => handleClick('button-1')}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              <div className="text-2xl mb-2">🎯</div>
              <div>Click Me!</div>
            </button>

            <button
              onClick={() => handleClick('button-2')}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              <div className="text-2xl mb-2">🚀</div>
              <div>Track This!</div>
            </button>

            <button
              onClick={() => handleClick('button-3')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-6 px-8 rounded-2xl shadow-lg transform transition hover:scale-105 active:scale-95"
            >
              <div className="text-2xl mb-2">⚡</div>
              <div>Engage!</div>
            </button>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-3">📊 What's Being Tracked?</h3>
              <ul className="text-white/80 space-y-2">
                <li>✓ Page Views</li>
                <li>✓ Button Clicks</li>
                <li>✓ Session Duration</li>
                <li>✓ Device Info</li>
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold text-lg mb-3">🔍 How It Works</h3>
              <ul className="text-white/80 space-y-2">
                <li>✓ Events → Kafka Topic</li>
                <li>✓ Consumer → MongoDB</li>
                <li>✓ Metrics → WebSocket</li>
                <li>✓ Dashboard → Real-time!</li>
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/60 text-sm">
              Open the Admin Dashboard to see real-time analytics! 📈
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
