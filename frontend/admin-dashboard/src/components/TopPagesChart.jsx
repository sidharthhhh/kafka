import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TopPagesChart = ({ topPages = [] }) => {
    const chartData = topPages.length > 0
        ? topPages.slice(0, 5)
        : [
            { page: '/home', views: 45 },
            { page: '/about', views: 32 },
            { page: '/products', views: 28 },
            { page: '/contact', views: 15 },
            { page: '/blog', views: 12 },
        ];

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white text-xl font-bold mb-4">🔥 Top Pages</h3>
            <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="page" stroke="rgba(255,255,255,0.6)" />
                    <YAxis stroke="rgba(255,255,255,0.6)" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Bar dataKey="views" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default TopPagesChart;
