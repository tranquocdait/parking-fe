<template>
  <div class="card">
    <div class="pb-0 card-header mb-0">
      <h6>{{ title }}</h6>
    </div>
    <div class="p-3 card-body">
      <div class="chart">
        <canvas :id="id" class="chart-canvas" height="300"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js/auto";

export default {
  name: "gradient-line-chart",

  props: {
    chartLabels: {
      type: Array,
      default() {
        return []
      },
    },
    id: {
      type: String,
      default() {
        return 'chart-line'
      },
    },
    label: {
      type: String,
      default() {
        return ''
      },
    },
    title: {
      type: String,
      default() {
        return ''
      },
    },
    datas: {
      type: Array,
      default() {
        return []
      },
    }
  },
  methods: {
    mappingChart() {
      var ctx1 = document.getElementById(this.id).getContext("2d");

      var gradientStroke1 = ctx1.createLinearGradient(0, 230, 0, 50);

      gradientStroke1.addColorStop(1, "rgba(94, 114, 228, 0.2)");
      gradientStroke1.addColorStop(0.2, "rgba(94, 114, 228, 0.0)");
      gradientStroke1.addColorStop(0, "rgba(94, 114, 228, 0)");
      new Chart(ctx1, {
        type: "line",
        data: {
          labels: this.chartLabels,
          datasets: [
            {
              label: this.label,
              tension: 0.4,
              borderWidth: 0,
              pointRadius: 0,
              borderColor: "#4BB543 ",
              backgroundColor: gradientStroke1,
              // eslint-disable-next-line no-dupe-keys
              borderWidth: 3,
              fill: true,
              data: this.datas,
              maxBarThickness: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
          interaction: {
            intersect: false,
            mode: "index",
          },
          scales: {
            y: {
              grid: {
                drawBorder: false,
                display: true,
                drawOnChartArea: true,
                drawTicks: false,
                borderDash: [5, 5],
              },
              ticks: {
                display: true,
                padding: 10,
                color: "#fbfbfb",
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
            x: {
              grid: {
                drawBorder: false,
                display: false,
                drawOnChartArea: false,
                drawTicks: false,
                borderDash: [5, 5],
              },
              ticks: {
                display: true,
                color: "#ccc",
                padding: 20,
                font: {
                  size: 11,
                  family: "Open Sans",
                  style: "normal",
                  lineHeight: 2,
                },
              },
            },
          },
        },
      });
    }
  },
  watch: {
    chartLabels: function () {
      this.mappingChart();
    }
  }
};
</script>
