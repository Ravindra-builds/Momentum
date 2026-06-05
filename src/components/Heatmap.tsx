import { useMemo, useState, useRef, useEffect } from 'react';
import { getWeekDates, getDayOfWeekIndex, getMonthLabel, getToday } from '../utils/date';

interface HeatmapProps {
  data: Record<string, number>;
  weeks?: number;
  maxValue?: number;
  label?: string;
  currentStreak?: number;
  longestStreak?: number;
  totalActiveDays?: number;
}

const CELL_SIZE = 12;
const CELL_GAP = 2;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getColor(value: number, max: number): string {
  if (value === 0) return '#161b22';
  if (max === 0) return '#161b22';
  const ratio = Math.min(value / max, 1);
  if (ratio <= 0.25) return '#0e4429';
  if (ratio <= 0.5) return '#006d32';
  if (ratio <= 0.75) return '#26a641';
  return '#39d353';
}

export default function Heatmap({
  data,
  weeks = 26,
  maxValue,
  label,
  currentStreak = 0,
  longestStreak = 0,
  totalActiveDays = 0,
}: HeatmapProps) {
  const [tooltip, setTooltip] = useState<{ date: string; value: number; x: number; y: number } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to today (rightmost columns) on mount
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  }, []);

  const { grid, monthLabels, max } = useMemo(() => {
    const allDates = getWeekDates(weeks);
    const today = getToday();
    const values = Object.values(data);
    const m = maxValue || Math.max(...values, 1);

    // Build grid: 7 rows x weeks columns
    const gridCells: { date: string; value: number; isFuture: boolean }[][] = [];
    for (let row = 0; row < 7; row++) {
      gridCells[row] = [];
    }

    // Group dates by week
    const weekColumns: string[][] = [];
    let currentWeek: string[] = [];

    allDates.forEach(date => {
      const dow = getDayOfWeekIndex(date);
      if (dow === 0 && currentWeek.length > 0) {
        weekColumns.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(date);
    });
    if (currentWeek.length > 0) weekColumns.push(currentWeek);

    // Fill grid
    weekColumns.forEach(week => {
      for (let row = 0; row < 7; row++) {
        const dateForSlot = week.find(d => getDayOfWeekIndex(d) === row);
        if (dateForSlot) {
          gridCells[row].push({
            date: dateForSlot,
            value: data[dateForSlot] || 0,
            isFuture: dateForSlot > today,
          });
        } else {
          gridCells[row].push({ date: '', value: 0, isFuture: true });
        }
      }
    });

    // Month labels
    const mLabels: { label: string; col: number }[] = [];
    let lastMonth = '';
    weekColumns.forEach((week, colIdx) => {
      const firstDate = week.find(d => d);
      if (firstDate) {
        const month = getMonthLabel(firstDate);
        if (month !== lastMonth) {
          mLabels.push({ label: month, col: colIdx });
          lastMonth = month;
        }
      }
    });

    return { grid: gridCells, monthLabels: mLabels, max: m };
  }, [data, weeks, maxValue]);

  const totalCols = grid[0]?.length || 0;
  const svgWidth = totalCols * (CELL_SIZE + CELL_GAP) + 32;
  const svgHeight = 7 * (CELL_SIZE + CELL_GAP) + 24;

  return (
    <div className="w-full">
      {label && (
        <h3 className="text-sm font-semibold text-neutral-300 mb-3">{label}</h3>
      )}

      <div ref={scrollRef} className="overflow-x-auto heatmap-scroll pb-1 -mx-1 px-1">
        <svg width={svgWidth} height={svgHeight} className="block">
          {/* Month labels */}
          {monthLabels.map((m, i) => (
            <text
              key={i}
              x={32 + m.col * (CELL_SIZE + CELL_GAP)}
              y={10}
              fill="#525252"
              fontSize={9}
              fontFamily="Inter, sans-serif"
            >
              {m.label}
            </text>
          ))}

          {/* Day labels */}
          {DAY_LABELS.map((dayLabel, row) => {
            if (!dayLabel) return null;
            return (
              <text
                key={row}
                x={0}
                y={22 + row * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2 + 3}
                fill="#404040"
                fontSize={8}
                fontFamily="Inter, sans-serif"
              >
                {dayLabel}
              </text>
            );
          })}

          {/* Grid cells */}
          {grid.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              if (!cell.date) return null;
              return (
                <rect
                  key={`${rowIdx}-${colIdx}`}
                  x={32 + colIdx * (CELL_SIZE + CELL_GAP)}
                  y={18 + rowIdx * (CELL_SIZE + CELL_GAP)}
                  width={CELL_SIZE}
                  height={CELL_SIZE}
                  rx={2}
                  fill={cell.isFuture ? '#0d0d0d' : getColor(cell.value, max)}
                  opacity={cell.isFuture ? 0.3 : 1}
                  onMouseEnter={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setTooltip({
                      date: cell.date,
                      value: cell.value,
                      x: rect.left + rect.width / 2,
                      y: rect.top,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ cursor: 'pointer', transition: 'opacity 0.15s ease' }}
                />
              );
            })
          )}
        </svg>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 40,
            transform: 'translateX(-50%)',
          }}
        >
          <div className="bg-neutral-800 text-neutral-200 text-xs px-2.5 py-1.5 rounded-lg shadow-xl border border-neutral-700 whitespace-nowrap">
            <span className="text-neutral-400">{tooltip.date}</span>
            <span className="mx-1.5 text-neutral-600">·</span>
            <span className="font-medium">{tooltip.value > 0 ? `${tooltip.value}` : 'No activity'}</span>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
        <span>
          <span className="text-neutral-300 font-medium">{totalActiveDays}</span> active days
        </span>
        {currentStreak > 0 && (
          <span>
            🔥 <span className="text-green-500 font-medium">{currentStreak}</span> day streak
          </span>
        )}
        {longestStreak > 0 && (
          <span>
            ⭐ <span className="text-neutral-300 font-medium">{longestStreak}</span> best
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-2 text-[10px] text-neutral-600">
        <span>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <div
            key={i}
            className="rounded-sm"
            style={{
              width: 10,
              height: 10,
              backgroundColor: getColor(ratio * max, max),
            }}
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
