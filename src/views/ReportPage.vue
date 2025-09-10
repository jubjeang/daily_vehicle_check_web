<template>
  <div class="dashboard">
    <TopNav />
    <main class="page">
      <section class="container">
        <h1 class="title">
          <i class="fa-solid fa-chart-column"></i>
          Report
        </h1>
        <div class="grid">
          <div class="card">[ กราฟแท่ง2 ]</div>
          <div class="card">[ กราฟโดนัท ]</div>
        </div>
      </section>
    </main>
  </div>
</template>
<script setup>
import TopNav from '@/components/TopNav.vue'
import '@fortawesome/fontawesome-free/css/all.css'
</script>
<style scoped>
/* ---- Override ของ template เดิมที่ main.css ทำไว้ (ป้องกันโดนจัด layout เป็น grid สองคอลัมน์) ---- */
:global(body) {
  display: block;
  place-items: unset;
}

:global(#app) {
  display: block;
  grid-template-columns: unset;
  padding: 0;
  max-width: 100%;
}

/* ---- โครงหน้าให้เต็มสูง ยืดตามจอ ---- */
.dashboard {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

/* ใช้ .page (ตรงกับ template) แทน .main เดิม */
.page {
  flex: 1;
  width: 100%;
  display: block;
  /* เผื่อ nav สูง ~80px อยู่แล้ว ไม่ต้องลบ height */
}

/* container กว้างเต็ม แต่เว้นระยะขอบแบบ responsive */
.container {
  width: 100%;
  margin: 0 auto;
  padding: clamp(12px, 2vw, 24px);
}

.title {
  color: #1a8d5b;
  margin: 8px 0 16px;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
}

.title i {
  font-size: 1.6em;
  color: #1a8d5b;
}



/* Grid ยืดหยุ่น: 1 คอล์มน์บนจอเล็ก, 2+ คอล์มน์บนจอใหญ่ โดยใช้ auto-fit */
.grid {
  display: grid;
  gap: clamp(12px, 2vw, 20px);
  grid-template-columns: repeat(auto-fit, minmax(min(360px, 100%), 1fr));
  align-items: stretch;
}

/* Card พื้นฐาน */
.card {
  background: #fff;
  border-radius: 16px;
  padding: clamp(12px, 2vw, 16px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, .06);
  min-height: clamp(260px, 36vh, 420px);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* Breakpoints เพิ่มเติม (ถ้าต้องการควบคุมละเอียด) */
@media (max-width: 768px) {
  .container {
    padding-left: 16px;
    padding-right: 16px;
  }
}

@media (min-width: 1200px) {
  .grid {
    /* บังคับให้ 2 คอล์มน์สวย ๆ บนจอกว้างมาก */
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
