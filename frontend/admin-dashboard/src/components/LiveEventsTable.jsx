const LiveEventsTable = ({ events = [] }) => {
    const displayEvents = events.length > 0 ? events.slice(0, 10) : [];

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString();
    };

    const getEventBadge = (eventType) => {
        const badges = {
            page_view: 'bg-blue-500',
            click: 'bg-purple-500',
            session_start: 'bg-green-500',
            session_end: 'bg-red-500',
        };
        return badges[eventType] || 'bg-gray-500';
    };

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white text-xl font-bold mb-4">🔴 Live Event Feed</h3>

            {events.length === 0 ? (
                <div className="text-white/60 text-center py-8">
                    Waiting for events...
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/20">
                                <th className="text-left text-white/80 pb-3 px-2">Event</th>
                                <th className="text-left text-white/80 pb-3 px-2">Page</th>
                                <th className="text-left text-white/80 pb-3 px-2">Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayEvents.map((event, index) => (
                                <tr
                                    key={index}
                                    className="border-b border-white/10 hover:bg-white/5 transition"
                                >
                                    <td className="py-3 px-2">
                                        <span className={`${getEventBadge(event.event)} text-white text-xs px-3 py-1 rounded-full font-medium`}>
                                            {event.event}
                                        </span>
                                    </td>
                                    <td className="text-white/80 py-3 px-2 text-sm">{event.page}</td>
                                    <td className="text-white/60 py-3 px-2 text-sm">{formatTime(event.timestamp)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default LiveEventsTable;
