import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const RiskDistribution = ({ distribution }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    // If we already have a chart instance, destroy it
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart with improved styling
    const ctx = chartRef.current.getContext('2d');
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: distribution.labels,
        datasets: [
          {
            label: 'Number of Users',
            data: distribution.data,
            backgroundColor: [
              '#4285F4', // Low - Google Blue
              '#FBBC05', // Medium - Google Yellow
              '#EA4335'  // High - Google Red
            ],
            borderColor: [
              '#4285F4',
              '#FBBC05',
              '#EA4335'
            ],
            borderWidth: 1,
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              precision: 0,
              font: {
                family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                size: 12
              },
              color: '#666'
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
              drawBorder: false
            }
          },
          x: {
            ticks: {
              font: {
                family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                size: 12,
                weight: 'bold'
              },
              color: '#666'
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleFont: {
              family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              family: "'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
              size: 14
            },
            padding: 12,
            cornerRadius: 6,
            displayColors: false,
            callbacks: {
              title: function(tooltipItems) {
                return `${tooltipItems[0].label} Risk Users`;
              },
              label: function(context) {
                return `Count: ${context.raw} users`;
              }
            }
          }
        },
        animation: {
          duration: 1000,
          easing: 'easeOutQuart'
        }
      }
    });

    // Add title and data labels
    const updateChart = () => {
      const total = distribution.data.reduce((sum, value) => sum + value, 0);
      if (total === 0) return;

      const percentages = distribution.data.map(value => Math.round((value / total) * 100));
      
      // Add percentage on top of each bar
      const meta = chartInstance.current.getDatasetMeta(0);
      
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      ctx.font = 'bold 12px "Segoe UI", Roboto, sans-serif';
      
      meta.data.forEach((bar, index) => {
        if (distribution.data[index] > 0) {
          const position = bar.getCenterPoint();
          ctx.fillStyle = index === 2 ? '#fff' : '#333';
          ctx.fillText(`${percentages[index]}%`, position.x, position.y - 10);
        }
      });
      
      ctx.restore();
    };
    
    chartInstance.current.options.animation.onComplete = updateChart;
    chartInstance.current.options.plugins.tooltip = {
      ...chartInstance.current.options.plugins.tooltip,
      callbacks: {
        ...chartInstance.current.options.plugins.tooltip.callbacks,
        afterLabel: function(context) {
          const total = distribution.data.reduce((sum, value) => sum + value, 0);
          const percentage = total > 0 ? Math.round((context.raw / total) * 100) : 0;
          return `${percentage}% of total users`;
        }
      }
    };

    // Cleanup
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [distribution]);

  return (
    <div>
      <canvas ref={chartRef} height="300"></canvas>
    </div>
  );
};

export default RiskDistribution;