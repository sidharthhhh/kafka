import useWebSocket from './hooks/useWebSocket';
import MetricCard from './components/MetricCard';
import PageViewsChart from './components/PageViewsChart';
import TopPagesChart from './components/TopPagesChart';
import DeviceStatsChart from './components/DeviceStatsChart';
import LiveEventsTable from './components/LiveEventsTable';
import './index.css';

function App() {
  const { metrics, connected } = useWebSocket();

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-extrabold text-white mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-white/70 text-lg">
                Real-time visitor tracking powered by Kafka
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`h-3 w-3 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className="text-white font-medium">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Active Users"
            value={metrics.activeUsers}
            icon="👥"
            color="blue"
          />
          <MetricCard
            title="Views / Minute"
            value={metrics.pageViewsLastMinute}
            icon="📈"
            color="purple"
          />
          <MetricCard
            title="Unique Visitors"
            value={metrics.uniqueVisitorsToday}
            icon="🎯"
            color="green"
          />
          <MetricCard
            title="Total Events"
            value={metrics.recentEvents.length}
            icon="⚡"
            color="orange"
          />
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PageViewsChart data={metrics.pageViewsHistory} />
          <TopPagesChart topPages={metrics.topPages} />
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <DeviceStatsChart deviceStats={metrics.deviceStats} />
          <LiveEventsTable events={metrics.recentEvents} />
        </div>

        {/* Footer Info */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-white font-bold text-lg mb-3">🔧 System Architecture</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-white/80">
              <div className="font-semibold mb-1">Event Flow</div>
              <div className="text-sm">Client → API → Kafka Topic → Consumer → MongoDB</div>
            </div>
            <div className="text-white/80">
              <div className="font-semibold mb-1">Real-time Updates</div>
              <div className="text-sm">WebSocket broadcasts metrics every event</div>
            </div>
            <div className="text-white/80">
              <div className="font-semibold mb-1">Tech Stack</div>
              <div className="text-sm">Node.js • Kafka • MongoDB • React • Socket.IO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
