import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const DeviceStatsChart = ({ deviceStats = {} }) => {
    const data = Object.keys(deviceStats).length > 0
        ? Object.entries(deviceStats).map(([name, value]) => ({ name, value }))
        : [
            { name: 'Desktop', value: 60 },
            { name: 'Mobile', value: 30 },
            { name: 'Tablet', value: 10 },
        ];

    const COLORS = ['#60a5fa', '#a78bfa', '#f472b6'];

    return (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl">
            <h3 className="text-white text-xl font-bold mb-4">📱 Device Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            border: 'none',
                            borderRadius: '8px',
                            color: '#fff',
                        }}
                    />
                    <Legend
                        wrapperStyle={{ color: '#fff' }}
                        iconType="circle"
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DeviceStatsChart;
