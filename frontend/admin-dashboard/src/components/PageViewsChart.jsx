import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PageViewsChart = ({ data = [] }) => {
    // Generate mock time-series data for demo
    const chartData = Array.from({ length: 10 }, (_, i) => ({
        time: `${i}m`,
        views: Math.floor(Math.random() * 100) + 20,
    }));

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white text-xl font-bold mb-4">📈 Page Views (Last 10 Minutes)</h3>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="time" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Line
                        type="monotone"
                        dataKey="views"
                        stroke="#60a5fa"
                        strokeWidth={3}
                        dot={{ fill: '#60a5fa', r: 5 }}
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PageViewsChart;
