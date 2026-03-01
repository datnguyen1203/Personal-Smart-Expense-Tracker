import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

// Đăng ký các thành phần cần thiết
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

export const CategoryHorizontalBar = ({ transactions }) => {
    // Logic nhóm dữ liệu theo Category
    const categories = {};
    transactions.forEach(t => {
        if (t.type === 'expense') {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
    });

    const data = {
        labels: Object.keys(categories),
        datasets: [
            {
                label: 'Chi tiêu theo hạng mục',
                data: Object.values(categories),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgb(54, 162, 235)',

                // CHỈNH SỬA TẠI ĐÂY:
                barThickness: 10,       // Độ dày cố định của mỗi cột (ví dụ 20px)
                categoryPercentage: 1.0, // Tận dụng tối đa không gian của nhóm danh mục
                barPercentage: 0.9,      // Tận dụng tối đa không gian bên trong mỗi cột      // Bo góc cho cột nhìn hiện đại hơn
            },
        ],
    };

    const options = {
        indexAxis: 'y', // Biến cột dọc thành cột ngang
        responsive: true,
        maintainAspectRatio: false, // Quan trọng để fit với chiều cao div cha
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { display: false, },
                ticks: { font: { size: 15 } },

            },
            y: {
                grid: { display: false, },
                ticks: { font: { size: 15 } }
            },
        }
    };

    return <Bar data={data} options={options} />;
};

export const WeeklyLineChart = ({ transactions }) => {
    const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];

    // Khởi tạo mảng 7 phần tử tương ứng 7 ngày với giá trị 0
    const dailyData = new Array(7).fill(0);

    transactions.forEach(t => {
        const dayIndex = new Date(t.date).getDay(); // 0 là CN, 1 là Thứ 2...
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // Chuyển về T2=0, CN=6
        if (t.type === 'expense') {
            dailyData[adjustedIndex] += t.amount;
        }
    });

    const data = {
        labels: days,
        datasets: [
            {
                label: 'Chi tiêu hàng ngày',
                data: dailyData,
                fill: true,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.4, // Tạo độ cong cho đường kẻ
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 13 } }
            },
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' }, // Làm mờ đường lưới ngang
                ticks: { font: { size: 15 } }
            }
        },
        elements: {
            point: { radius: 2 } // Làm nhỏ các chấm trên đường kẻ
        }
    };

    return <Line data={data} options={options} />;
};

export const WeekStrip = ({ transactions, selectedDay, onSelectDay }) => {
    return (
        <div className="grid grid-cols-7 gap-2 mb-6">
            {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map((day, i) => {
                const isSelected = selectedDay === i;

                return (
                    <button
                        key={i}
                        onClick={() => onSelectDay(i)}
                        className={`p-2 rounded-lg border text-center shadow-sm transition ${isSelected
                            ? 'bg-green-100 border-green-500 ring-2 ring-green-400'
                            : 'bg-white hover:bg-gray-50'
                            }`}
                    >
                        <p className="text-xs text-gray-500 uppercase font-semibold">{day}</p>
                    </button>
                );
            })}
        </div>
    );
};

export const MonthlyBarChart = ({ transactions }) => {
    const getDaysInMonth = () => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth();
    const dailyData = new Array(daysInMonth).fill(0);

    transactions.forEach(t => {
        const date = new Date(t.date);
        const day = date.getDate() - 1; // 0-indexed
        if (t.type === 'expense' && day >= 0 && day < daysInMonth) {
            dailyData[day] += t.amount;
        }
    });

    const labels = Array.from({ length: daysInMonth }, (_, i) => `${i + 1}`);

    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Chi tiêu hàng ngày',
                data: dailyData,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            x: {
                grid: { display: false },
                ticks: { font: { size: 11 }, maxRotation: 45, minRotation: 0 }
            },
            y: {
                beginAtZero: true,
                grid: { color: '#f3f4f6' },
                ticks: { font: { size: 15 } }
            }
        },
    };

    return <Bar data={data} options={options} />;
};

export const WeekCategoryPieChart = ({ transactions }) => {
    const getCurrentWeekStart = () => {
        const today = new Date();
        const dayOfWeek = today.getDay();
        const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
        return new Date(today.setDate(diff));
    };

    const weekStart = getCurrentWeekStart();
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const categories = {};
    transactions.forEach(t => {
        const txDate = new Date(t.date);
        if (t.type === 'expense' && txDate >= weekStart && txDate <= weekEnd) {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
    });

    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
    ];

    const data = {
        labels: Object.keys(categories),
        datasets: [
            {
                data: Object.values(categories),
                backgroundColor: colors.slice(0, Object.keys(categories).length),
                borderColor: colors.slice(0, Object.keys(categories).length).map(c => c.replace('0.7', '1')),
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { font: { size: 12 }, padding: 15 },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.parsed;
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value.toLocaleString()} VNĐ (${percent}%)`;
                    }
                }
            }
        },
    };

    return <Doughnut data={data} options={options} />;
};

export const MonthCategoryPieChart = ({ transactions }) => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    monthStart.setHours(0, 0, 0, 0);
    const monthEnd = new Date();
    monthEnd.setHours(23, 59, 59, 999);

    const categories = {};
    transactions.forEach(t => {
        const txDate = new Date(t.date);
        if (t.type === 'expense' && txDate >= monthStart && txDate <= monthEnd) {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        }
    });

    const colors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
    ];

    const data = {
        labels: Object.keys(categories),
        datasets: [
            {
                data: Object.values(categories),
                backgroundColor: colors.slice(0, Object.keys(categories).length),
                borderColor: colors.slice(0, Object.keys(categories).length).map(c => c.replace('0.7', '1')),
                borderWidth: 2,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: { font: { size: 12 }, padding: 15 },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const value = context.parsed;
                        const percent = ((value / total) * 100).toFixed(1);
                        return `${context.label}: ${value.toLocaleString()} VNĐ (${percent}%)`;
                    }
                }
            }
        },
    };

    return <Doughnut data={data} options={options} />;
};