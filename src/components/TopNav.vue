<template>
  <header class="nav">
    <div class="bar">
      <div class="left">
        <router-link to="/main">
          <img src="/images/gfcth.png" alt="GFCS" class="logo" />
        </router-link>
      </div>
      <!-- Desktop menu -->
      <nav class="menu-desktop">
        <RouterLink to="/main" class="link" :class="{ active: isActive('/main') }">Dashboard</RouterLink>
        <RouterLink to="/tracking" class="link" :class="{ active: isActive('/tracking') }">Tracking</RouterLink>
        <!-- <RouterLink to="/report" class="link" :class="{ active: isActive('/report') }">Report</RouterLink> -->
      </nav>

      <div class="right">
        <!-- ✅ Desktop only -->
        <!-- Desktop only -->
        <span v-if="usernameLabel" class="user-label label-desktop" title="Signed in">
          <svg class="user-icon" width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor"
              d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
          <span class="user-text">&nbsp;&nbsp;{{ usernameLabel }}</span>
        </span>
        <button class="logout btn-desktop" @click="onLogout"><span>Logout</span></button>

        <!-- Hamburger: ใช้ SVG แทน Font Awesome -->
        <button class="hamburger btn-mobile" :aria-expanded="open ? 'true' : 'false'" aria-controls="mobileMenu"
          @click="toggle">
          <!-- bars -->
          <svg v-if="!open" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
            aria-hidden="true" focusable="false">
            <path d="M3 6h18v2H3zM3 11h18v2H3zM3 16h18v2H3z" />
          </svg>
          <!-- times (X) -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"
            focusable="false">
            <path
              d="M18.3 5.7L12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7 4.3 4.3l6.3 6.3 6.3-6.3z" />
          </svg>
          <span class="sr-only">Toggle navigation</span>
        </button>
      </div>
    </div>

    <!-- Mobile overlay -->
    <div id="mobileMenu" class="overlay" v-show="open" @click.self="close">
      <nav class="mobile-panel">
        <!-- ✅ Mobile only -->
        <div v-if="usernameLabel" class="m-user label-mobile">
          <!-- ไอคอนเล็ก ๆ เพิ่มจังหวะสายตา (optional) -->
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
          </svg>
          <span class="truncate"> &nbsp; {{ usernameLabel }}</span>
        </div>

        <RouterLink to="/main" class="m-link" :class="{ active: isActive('/main') }" @click="close">Dashboard
        </RouterLink>
        <RouterLink to="/tracking" class="m-link" :class="{ active: isActive('/tracking') }" @click="close">Tracking
        </RouterLink>
        <!-- <RouterLink to="/report" class="m-link" :class="{ active: isActive('/report') }" @click="close">Report
        </RouterLink> -->

        <!-- ✅ ใช้ปุ่ม mobile -->
        <button class="m-logout" @click="onLogout">Logout</button>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const open = ref(false)
const user = ref(null)
const usernameLabel = computed(() => user.value?.username || '')


onMounted(() => {
  const saved = localStorage.getItem('user')

  if (saved) {
    try {
      user.value = JSON.parse(saved)
      //console.log('user.value: ', user.value.username)
    }
    catch {//
    }
  }
})

const isActive = (path) => route.path.startsWith(path)
const toggle = () => (open.value = !open.value)
const close = () => (open.value = false)
const onLogout = () => {
  close()
  localStorage.removeItem('user')   // ลบออกเวลา logout
  router.push('/')
}

watch(() => route.path, () => close())

const onKeydown = (e) => { if (e.key === 'Escape') close() }
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
/* ==== ขนาดตัวอักษรเท่ากับเมนู (1rem) ==== */
.user-label {
  /* pill บน desktop */
  font-size: 1rem;
  /* เดิม 14px → 1rem */
}

.user-text {
  /* ให้ข้อความข้างในส-calibrate เท่ากัน */
  font-size: inherit;
}

/* ปุ่ม Logout (desktop + mobile) ให้เท่ากัน */
.logout,
.m-logout {
  font-size: 1rem;
  line-height: 1.25;
}

/* ไอคอนให้สมดุลกับ 1rem */
.user-label .user-icon {
  width: 16px;
  /* เดิม 18px → 16px ให้บาลานซ์กับ 1rem */
  height: 16px;
}

/* (คงสไตล์ pill ที่คุณตั้งไว้) */
.user-label {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px 16px;
  border-radius: 999px;
  color: #fff;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, .55);
  font-weight: 600;
  /* ถ้าต้องการให้ “น้ำหนัก” เท่าเมนูจริง ๆ ให้เปลี่ยนเป็น 500/400 */
  line-height: 1.2;
  white-space: nowrap;
  min-height: 36px;
}

.user-label:hover {
  border-color: rgba(255, 255, 255, .85);
}


/* ใหม่: “ชิป” บน overlay (พื้นหลังขาว) */
.m-user {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #eaf8f0;
  color: #0a3d28;
  font-weight: 600;
  margin-bottom: 8px;
  border: 1px solid #d5f0e2;
}

/* ตัดชื่อยาวให้เป็น … */
.truncate {
  max-width: 100%;
  display: inline-block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(90deg, #1ea365 0%, #6ad38b 100%);
  color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, .08);
}

/* top bar */
.bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  padding: 0 clamp(12px, 2vw, 20px);
  width: 100%;
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  height: 36px;
}

/* desktop menu */
.menu-desktop {
  display: none;
  gap: 16px;
  margin-left: auto;
  margin-right: 26rem;
}

/* <-- ตัด 25rem ทิ้ง */
.link {
  color: #fff;
  text-decoration: none;
  padding: 6px 8px;
  border-radius: 6px;
}

.link.active {
  font-weight: 600;
  border-bottom: 2px solid #fff;
}

/* right */
.right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logout,
.m-logout {
  background: #0a693c;
  border: none;
  padding: 8px 12px;
  color: #fff;
  border-radius: 8px;
  cursor: pointer;
}

.logout:hover,
.m-logout:hover {
  background: #0c7f4b;
}

.hamburger {
  background: transparent;
  border: none;
  color: #fff;
  padding: 8px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hamburger svg {
  fill: currentColor;
}

/* ===== Mobile overlay ===== */
.overlay {
  position: fixed;
  top: 72px;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .25);
  backdrop-filter: blur(2px);
  z-index: 49;
}

.mobile-panel {
  background: #fff;
  color: #111;
  border-radius: 14px;
  margin: 8px clamp(8px, 3vw, 16px) 12px;
  padding: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .12);
}

.m-link {
  display: block;
  padding: 12px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: #0a3d28;
  font-weight: 500;
}

.m-link.active {
  background: #eaf8f0;
  color: #0a3d28;
}

.m-link+.m-link {
  margin-top: 6px;
}

.m-logout {
  width: 100%;
  margin-top: 10px;
}

/* responsive */
.btn-desktop {
  display: none;
}

.btn-mobile {
  display: inline-flex;
}

/* ===== Responsive visibility ===== */
.label-desktop {
  display: none;
}

/* ซ่อนค่าเริ่มต้นบนจอเล็ก */
.label-mobile {
  display: block;
}

/* โชว์บนจอเล็ก */
@media (min-width: 992px) {
  .label-desktop {
    display: inline-block;
  }

  /* ✅ โชว์บน desktop */
  .label-mobile {
    display: none;
  }

  /* ✅ ซ่อนบน desktop */
  .menu-desktop {
    display: flex;
  }

  .btn-desktop {
    display: inline-flex;
  }

  .btn-mobile {
    display: none;
  }

  .overlay {
    display: none;
  }
}

/* ===== Mobile: usernameLabel โทนเทาอ่อน (แทนสีเขียว) ===== */
@media (max-width: 991.98px) {
  .m-user {
    background: #f1f5f9;
    /* slate-100 */
    color: #0f172a;
    /* slate-900 */
    border-color: #e2e8f0;
    /* slate-300 */
  }

  .m-user svg {
    fill: currentColor;
    opacity: .8;
  }
}

/* a11y */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
