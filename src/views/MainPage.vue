<template>
  <div class="dashboard">
    <TopNav />
    <main class="page">
      <section class="container">
        <h1 class="title">
          <i class="fa-solid fa-chart-column"></i>
          Dashboard
        </h1>

        <div class="grid charts-section">
          <!-- กราฟแท่ง -->
          <div class="card">
            <div class="chart-wrap">
              <canvas ref="barRef" aria-label="Top 5 รายการที่มีสถานะผิดปกติ (Abnormal/None)"></canvas>
            </div>
          </div>

          <!-- กราฟโดนัท -->
          <div class="card">
            <div class="chart-wrap">
              <canvas ref="donutRef" aria-label="Top 5 รถที่ใช้บ่อย)"></canvas>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import TopNav from '@/components/TopNav.vue'
import '@fortawesome/fontawesome-free/css/all.css'

import {
  Chart,
  BarController, BarElement,
  CategoryScale, LinearScale,
  DoughnutController, ArcElement,
  Tooltip, Legend, Title,
} from 'chart.js'

Chart.register(
  BarController, BarElement, CategoryScale, LinearScale,
  DoughnutController, ArcElement, Tooltip, Legend, Title,
)

const valueLabelPlugin = {
  id: 'valueLabel',
  afterDatasetsDraw: chart => {
    const { ctx, chartArea } = chart
    ctx.save()
    ctx.font = '12px sans-serif'
    ctx.fillStyle = '#374151'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'

    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di)
      meta.data.forEach((el, i) => {
        const val = dataset.data[i]
        if (val == null) return
        const pos = el.tooltipPosition()
        const topGuard = chartArea.top + 14
        const y = chart.config.type === 'bar'
          ? Math.max(pos.y - 12, topGuard)
          : pos.y
        ctx.fillText(String(val), pos.x, y)
      })
    })
    ctx.restore()
  }
}
Chart.register(valueLabelPlugin)

const barRef = ref(null)
const donutRef = ref(null)

let barChart = null
let donutChart = null

const colors = ['#1a8d5b', '#f59e0b', '#3b82f6', '#ef4444', '#8b5cf6']

// ===== helpers =====
const isMobile = () => window.matchMedia('(max-width: 640px)').matches
const wrapLabel = (str, maxLen = 14) =>
  !str ? '' : Array.from({ length: Math.ceil(str.length / maxLen) },
    (_, i) => str.slice(i * maxLen, (i + 1) * maxLen)
  )
const shorten = (str, max = 22) =>
  (str?.length > max ? str.slice(0, max - 1) + '…' : str)

const fetchTop5 = async () => {
  const res = await fetch(import.meta.env.VITE_API_APP_URL + '/top5-abnormal')
  if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
  return await res.json()
}
const fetchTopVehicleUsed = async () => {
  const res = await fetch(import.meta.env.VITE_API_APP_URL + '/top_Vehicle_used')
  if (!res.ok) throw new Error('โหลดข้อมูลไม่สำเร็จ')
  const data = await res.json()        // { labels, counts, total }
  return {
    labels: Array.isArray(data?.labels) ? data.labels : [],
    counts: Array.isArray(data?.counts) ? data.counts : []
  }
}


const makeBarChart = (canvas, labels, counts) => {
  if (barChart) barChart.destroy()

  const maxVal = Math.max(...counts)
  const pad = Math.max(3, Math.ceil(maxVal * 0.12))

  const mobile = isMobile()
  const originalLabels = [...labels]
  const displayLabels = mobile
    ? labels.map(l => shorten(l, 28))
    : labels.map(l => wrapLabel(l, 14))

  barChart = new Chart(canvas, {
    type: 'bar',
    data: {
      labels: displayLabels,
      datasets: [{
        label: 'จำนวนครั้ง',
        data: counts,
        backgroundColor: colors[0],
        borderRadius: 8,
        maxBarThickness: mobile ? 22 : 56,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: mobile ? 'y' : 'x',
      plugins: {
        title: {
          display: true,
          text: 'Top 5 รายการที่มีสถานะผิดปกติ (Abnormal/None)',
          padding: { top: 8, bottom: 12 },
          font: { size: mobile ? 13 : 14, weight: 'bold' }
        },
        legend: { display: false },
        tooltip: {
          callbacks: {
            title: items => originalLabels[items[0].dataIndex],
            label: ctx => ` ${mobile ? ctx.parsed.x : ctx.parsed.y} ครั้ง`
          }
        },
        valueLabel: {}
      },
      layout: { padding: { top: 28, bottom: mobile ? 0 : 8, left: mobile ? 6 : 0, right: 6 } },
      scales: {
        x: mobile
          ? { ticks: { precision: 0, padding: 6 }, grid: { drawTicks: false } }
          : { ticks: { maxRotation: 0, autoSkip: false, padding: 6 } },
        y: mobile
          ? {
            ticks: {
              autoSkip: false,
              maxRotation: 0,
              font: { size: 10 },
              padding: 4
            },
            grid: { drawTicks: false }
          }
          : {
            beginAtZero: true,
            suggestedMax: maxVal + pad,
            ticks: { precision: 0, padding: 6 },
            grid: { drawTicks: false }
          }
      }
    }
  })
}

const makeDonutChart = (canvas, labelsInput, countsInput) => {
  if (donutChart) donutChart.destroy()

  const labels = Array.isArray(labelsInput) ? labelsInput : []
  const counts = Array.isArray(countsInput) ? countsInput : []

  donutChart = new Chart(canvas, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data: counts,
        backgroundColor: counts.map((_, i) => colors[i % colors.length]),
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: isMobile() ? '52%' : '58%',
      plugins: {
        title: {
          display: true,
          text: 'Top 5 รายการรถที่ถูกใช้บ่อยสุด',
          padding: { top: 8, bottom: 12 },
          font: { size: isMobile() ? 13 : 14, weight: 'bold' }
        },
        legend: {
          position: 'bottom',
          labels: { boxWidth: 10, font: { size: isMobile() ? 10 : 12 } }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const v = ctx.parsed
              const total = ctx.dataset.data.reduce((a, b) => a + b, 0)
              const pct = total ? ((v / total) * 100).toFixed(1) : 0
              return ` ${ctx.label}: ${v} ครั้ง (${pct}%)`
            }
          }
        },
        valueLabel: {}
      }
    }
  })
}

onMounted(async () => {
  try {
    const { labels, counts } = await fetchTop5()
    const { labels: donutLabels, counts: donutCounts } = await fetchTopVehicleUsed()

    makeBarChart(barRef.value, labels, counts)
    makeDonutChart(donutRef.value, donutLabels, donutCounts)

    const onResize = () => {
      makeBarChart(barRef.value, labels, counts)
      makeDonutChart(donutRef.value, donutLabels, donutCounts)
    }
    window.addEventListener('resize', onResize)
    barRef.value._onResize = onResize
  } catch (err) {
    console.error(err)
  }
})

onBeforeUnmount(() => {
  if (barChart) barChart.destroy()
  if (donutChart) donutChart.destroy()
  if (barRef.value._onResize) window.removeEventListener('resize', barRef.value._onResize)
})
</script>

<style scoped>
/* ===== Layout base คงเดิม ===== */
.dashboard {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1;
  width: 100%;
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: clamp(12px, 2vw, 24px);
}

.title {
  color: #1a8d5b;
  margin: 8px 0 28px;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.grid {
  display: grid;
  gap: clamp(16px, 3vw, 24px);
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
}

/* ===== ปรับความสูงการ์ดเพื่อให้กราฟกินพื้นที่แนวตั้งมากขึ้น ===== */
.card {
  background: #fff;
  border-radius: 16px;
  padding: clamp(12px, 2vw, 16px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, .06);

  /* เดิม: min-height: clamp(260px, 36vh, 420px);  */
  /* ใหม่: ให้สูงขึ้นแบบยืดหยุ่นตามจอ */
  min-height: clamp(380px, 52vh, 680px);

  display: flex;
}

/* ให้แคนวาสกินพื้นที่เต็มการ์ด */
.chart-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: inherit;
  /* ยึดความสูงจาก .card */
}

/* จอใหญ่ให้สูงขึ้นอีกนิดเพื่อเก็บ label/legend สบาย ๆ */
@media (min-width: 1280px) {
  .card {
    min-height: clamp(460px, 58vh, 760px);
  }
}

/* มือถือ: คุมให้พอดีตา */
@media (max-width: 640px) {
  .card {
    min-height: 420px;
  }

  .title {
    font-size: 18px;
  }
}
</style>
