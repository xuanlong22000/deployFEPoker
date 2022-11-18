<template>
  <div id="chart">
    <canvas
      id="doughnut-chart"
      ref="doughnutChart"
      v-if="summary.length"
    ></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import DoughnutLabel from 'chartjs-plugin-doughnutlabel-rebourne';

export default {
  name: 'GameManagementChart',
  props: {
    summary: {
      type: Array,
      default: () => [],
    },
    colors: {
      type: Object,
      default: () => {},
    },
    dataConvert: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      myChart: null,
    };
  },
  computed: {
    // ...mapGetters({
    //   summaryStoryPoints: getterTypes.GET_SUMMARY_STORY_POINTS,
    //   summaryPlayers: getterTypes.GET_SUMMARY_PLAYERS,
    //   game: getterTypes.GET_GAME_MANAGEMENT,
    // }),
    chartColor() {
      return this.dataConvert.map((e) => {
        return e.color;
      });
    },
    summaryStoryPoints() {
      return this.dataConvert.map((item) => item.repeat);
    },
    summaryPlayers() {
      return this.summary.filter((e) => e.story_point !== null);
    },
    summaryLabels() {
      return this.dataConvert.map((item) => item.name);
    },
    average() {
      const point = this.summary.filter((e) => e.story_point !== null);
      if (point.length) {
        const totalPoint = point.reduce((pes, cur) => {
          return pes + cur.story_point;
        }, 0);
        return 'AVG: ' + (totalPoint / point.length).toFixed(1);
      } else {
        return 'AVG: ' + 0;
      }
    },
  },
  watch: {
    dataConvert() {
      if (this.myChart) {
        this.myChart.data.datasets[0].backgroundColor = this.chartColor;
        this.myChart.data.datasets[0].data = this.summaryStoryPoints;
        this.myChart.data.labels = this.summaryLabels;
        this.myChart.options.plugins.doughnutlabel.labels[4].text =
          this.average;
        this.myChart.options.plugins.doughnutlabel.labels[0].text =
          this.summaryPlayers.length + ' Players';
        this.myChart.update();
      } else {
        this.initChartData();
      }
    },
  },
  methods: {
    initData(data) {
      return {
        type: 'doughnut',
        data: {
          labels: data.name,
          datasets: [
            {
              data: data.repeat,
              backgroundColor: data.color,
              hoverOffset: 0,
              borderWidth: 0,
            },
          ],
        },
        options: {
          cutout: 82,
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            datalabels: {
              display: true,
              color: '#ffffff',
              borderRadius: 3,
              font: {
                size: 16,
              },
            },
            legend: {
              position: 'bottom',
              display: false,
              align: 'left',
              title: {
                font: 'Roboto',
              },
              labels: {
                usePointStyle: true,
                pointStyle: 'circle',
              },
            },
            doughnutlabel: {
              labels: [
                {
                  text: this.summaryPlayers.length + ' Players',
                  font: {
                    size: 20,
                    weight: 'bold',
                    family: 'Roboto',
                  },
                  color: '#000',
                },
                {
                  text: ':',
                  font: {
                    size: 6,
                  },
                  color: '#FFF',
                },
                {
                  text: 'Voted:',
                  font: {
                    size: 18,
                    family: 'Roboto',
                  },
                  color: '#000',
                },
                {
                  text: ':',
                  font: {
                    size: 6,
                  },
                  color: '#FFF',
                },
                {
                  text: this.average,
                  font: {
                    size: 20,
                    weight: 'bold',
                    family: 'Roboto',
                  },
                  color: '#000',
                },
              ],
            },
          },
        },
        plugins: [ChartDataLabels, DoughnutLabel],
      };
    },
    getGameId() {
      return this.$route.params.id;
    },
    initChartData() {
      const ctx = document.getElementById('doughnut-chart');
      const filterDataConvert = this.dataConvert.filter((e) => e.repeat !== 0);
      const name = filterDataConvert.map((e) => {
        const arrayName = e.name.split('&');
        return arrayName.length === 1 ? e.name : arrayName[0] + '... ';
      });
      const repeat = filterDataConvert.map((e) => e.repeat);
      if (repeat.length === 1 && repeat[0] === 0) {
        repeat[0] = 100;
      }
      const color = filterDataConvert.map((e) => e.color);
      this.myChart = new Chart(
        ctx,
        this.initData({
          name: name,
          repeat: repeat,
          color: color,
        })
      );
    },
  },
  async created() {},
  async mounted() {},
};
</script>

<style scoped>
#chart {
  width: 241px;
  margin: 0px 35px 0px 25px;
}
.backlog-point-rate {
  text-align: center;
  margin-bottom: 8px;
}
.backlog-point-rate span {
  font: 500 17px Roboto !important;
  color: #0a0a0c;
}

@media (max-width: 768px) {
  #chart {
    margin: 0px auto 0px auto;
  }
}
</style>
