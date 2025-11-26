<template>
  <div class="manual-page">
    <TopNav />

    <div class="content">
      <!-- ✅ Title + Icon -->
      <div class="title-bar">
        <i class="fa-solid fa-book-open"></i>
        <span>คู่มือ</span>
      </div>

      <header class="page-header">
        <h1>คู่มือการใช้งานระบบ</h1>
        <div class="actions">
          <a class="btn" :href="pdfUrl" target="_blank" rel="noopener">เปิดเต็มหน้าจอ</a>
          <a class="btn outline" :href="pdfUrl" download>ดาวน์โหลด PDF</a>
        </div>
      </header>

      <div class="viewer">
        <object :data="pdfUrl" type="application/pdf" class="pdf">
          <p>
            เบราเซอร์ของคุณไม่รองรับการแสดง PDF ในหน้านี้
            กรุณา <a :href="pdfUrl" target="_blank" rel="noopener">คลิกที่นี่เพื่อเปิดไฟล์</a>
          </p>
        </object>
      </div>
    </div>
  </div>
</template>

<script setup>
import TopNav from '@/components/TopNav.vue'
const pdfUrl = '/Manual.pdf'
</script>

<style scoped>
.manual-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f8fafc;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 12px 20px;
}

/* ✅ Title bar เหมือนหน้า Tracking */
.title-bar {
  display: flex;
  align-items: center;
  font-size: 1.4rem;
  font-weight: 700;
  color: #0a693c;
  margin: 10px 0 20px;
}

.title-bar i {
  margin-right: 8px;
  color: #0a693c;
  font-size: 1.5rem;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

h1 {
  font-size: 1.2rem;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  appearance: none;
  border: 1px solid #0a693c;
  background: #0a693c;
  color: #fff;
  padding: 8px 12px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
}

.btn.outline {
  background: transparent;
  color: #0a693c;
}

.viewer {
  flex: 1;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0, 0, 0, .08);
}

.pdf {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
