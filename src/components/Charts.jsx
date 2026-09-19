import React from 'react';

// Custom SVG Bar Chart
export const BarChart = ({ data = [], height = 200 }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 40; // reserve space for labels

  return (
    <div className="w-full">
      <div className="flex items-end justify-between h-[160px] gap-2 px-2" style={{ height: `${chartHeight}px` }}>
        {data.map((item, index) => {
          const barHeightPercentage = (item.value / maxVal) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
              {/* Tooltip */}
              <div className="absolute bottom-full mb-2 hidden group-hover:block bg-slate-800 text-white text-xs py-1 px-2 rounded shadow-md z-10 whitespace-nowrap">
                {item.value} {item.unit || ''}
              </div>
              {/* Bar */}
              <div
                style={{ height: `${Math.max(barHeightPercentage, 5)}%` }}
                className="w-full bg-blue-600 hover:bg-blue-700 rounded-t-sm transition-all duration-300 ease-out cursor-pointer"
              />
            </div>
          );
        })}
      </div>
      {/* Labels */}
      <div className="flex justify-between border-t border-slate-100 pt-2 mt-1">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center text-[10px] text-slate-500 truncate px-0.5">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};

// Custom SVG Donut / Pie Chart
export const DonutChart = ({ data = [] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;
  let accumulatedAngle = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
      {/* Circular Donut */}
      <div className="relative w-36 h-36">
        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
          {data.map((item, index) => {
            const percentage = item.value / total;
            const angle = percentage * 360;
            const startAngle = accumulatedAngle;
            accumulatedAngle += angle;

            // Calculate SVG arc paths
            const x1 = 50 + 40 * Math.cos((startAngle * Math.PI) / 180);
            const y1 = 50 + 40 * Math.sin((startAngle * Math.PI) / 180);
            const x2 = 50 + 40 * Math.cos((accumulatedAngle * Math.PI) / 180);
            const y2 = 50 + 40 * Math.sin((accumulatedAngle * Math.PI) / 180);

            const largeArc = angle > 180 ? 1 : 0;

            return (
              <path
                key={index}
                d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                fill={item.color || '#4f46e5'}
                className="hover:opacity-90 transition-opacity cursor-pointer stroke-white stroke-2"
              />
            );
          })}
          {/* Inner circle to make it a donut */}
          <circle cx="50" cy="50" r="22" fill="#ffffff" />
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-2">
        {data.map((item, index) => {
          const pct = Math.round((item.value / total) * 100);
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-xs font-medium text-slate-700">{item.label}:</span>
              <span className="text-xs text-slate-500 font-semibold">{item.value} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Custom SVG Line/Area Chart
export const AreaChart = ({ data = [], height = 200 }) => {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const chartHeight = height - 40;
  const padding = 10;
  const pointsCount = data.length;

  if (pointsCount === 0) return <div className="text-slate-400 text-xs py-4 text-center">No data available</div>;

  // Generate SVG coordinates
  const svgWidth = 500;
  const svgHeight = chartHeight;

  const points = data.map((item, i) => {
    const x = padding + (i / (pointsCount - 1 || 1)) * (svgWidth - padding * 2);
    const y = svgHeight - (item.value / maxVal) * (svgHeight - padding * 2) - padding;
    return { x, y, label: item.label, value: item.value };
  });

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, '');

  const areaD = points.length > 0
    ? `${pathD} L ${points[points.length - 1].x} ${svgHeight} L ${points[0].x} ${svgHeight} Z`
    : '';

  return (
    <div className="w-full">
      <div className="relative" style={{ height: `${svgHeight}px` }}>
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={svgHeight / 2} x2={svgWidth - padding} y2={svgHeight / 2} stroke="#f1f5f9" strokeWidth="1" />
          <line x1={padding} y1={padding} x2={svgWidth - padding} y2={padding} stroke="#f1f5f9" strokeWidth="1" />

          {/* Area Fill */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#chartGrad)"
              className="opacity-20"
            />
          )}

          {/* Path Line */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke="#2563eb"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Points */}
          {points.map((p, idx) => (
            <g key={idx} className="group cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r="4"
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-all duration-200 hover:r-6"
              />
              {/* Tooltip on SVG hover */}
              <title>{`${p.label}: ${p.value}`}</title>
            </g>
          ))}

          {/* Gradients */}
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between border-t border-slate-100 pt-2 mt-1">
        {data.map((item, index) => (
          <div key={index} className="text-[10px] text-slate-500 font-medium">
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
