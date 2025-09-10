<!-- src/views/TrackingPage.vue -->
<template>
  <!-- ทั้ง template คงเดิมตามที่พี่ส่งมา -->
  <div class="dashboard">
    <TopNav />

    <main class="page">
      <section class="container">
        <div class="content-narrow">
          <!-- Title -->
          <h1 class="title">
            <i class="fa-solid fa-location-crosshairs"></i>
            Tracking
          </h1>

          <!-- Search -->
          <div class="toolbar">
            <label class="sr-only" for="q">ค้นหา</label>
            <input id="q" v-model="searchQuery" type="text" placeholder="ค้นหา..." @keyup.enter="goToFirstAndFetch" />
            <button class="btn" @click="goToFirstAndFetch">ค้นหา</button>
          </div>

          <!-- Table -->
          <div class="card table-card">
            <div class="table-head">
              <h2 class="subtitle">Vehicle Records</h2>
              <div class="table-meta">
                <span>ทั้งหมด {{ total.toLocaleString() }} รายการ</span>
              </div>
            </div>

            <table>
              <colgroup>
                <col class="col-charlie" />
                <col class="col-driver" />
                <col class="col-plate" />
                <col class="col-branch" />
                <col class="col-mileage" />
                <col class="col-date" />
                <col class="col-actions" />
              </colgroup>

              <thead>
                <tr>
                  <th :data-state="stateFor('CharlieNo')" role="button" tabindex="0" @click="changeSort('CharlieNo')"
                    @keydown.enter.prevent="changeSort('CharlieNo')" @keydown.space.prevent="changeSort('CharlieNo')">
                    <span class="th-wrap">
                      <span class="th-text">Charlie No</span>
                      <span class="th-caret" aria-hidden="true"></span>
                    </span>
                  </th>
                  <th :data-state="stateFor('DriverName')" role="button" tabindex="0" @click="changeSort('DriverName')"
                    @keydown.enter.prevent="changeSort('DriverName')" @keydown.space.prevent="changeSort('DriverName')">
                    <span class="th-wrap">
                      <span class="th-text">DriverName</span>
                      <span class="th-caret" aria-hidden="true"></span>
                    </span>
                  </th>
                  <th :data-state="stateFor('PlateNo')" role="button" tabindex="0" @click="changeSort('PlateNo')"
                    @keydown.enter.prevent="changeSort('PlateNo')" @keydown.space.prevent="changeSort('PlateNo')">
                    <span class="th-wrap">
                      <span class="th-text">Plate No</span>
                      <span class="th-caret" aria-hidden="true"></span>
                    </span>
                  </th>
                  <th :data-state="stateFor('Branch')" role="button" tabindex="0" @click="changeSort('Branch')"
                    @keydown.enter.prevent="changeSort('Branch')" @keydown.space.prevent="changeSort('Branch')">
                    <span class="th-wrap">
                      <span class="th-text">Branch</span>
                      <span class="th-caret" aria-hidden="true"></span>
                    </span>
                  </th>
                  <th :data-state="stateFor('Mileage')" role="button" tabindex="0" @click="changeSort('Mileage')"
                    @keydown.enter.prevent="changeSort('Mileage')" @keydown.space.prevent="changeSort('Mileage')">
                    <span class="th-wrap">
                      <span class="th-text">Mileage</span>
                      <span class="th-caret" aria-hidden="true"></span>
                    </span>
                  </th>
                  <th :data-state="stateFor('Date')" role="button" tabindex="0" @click="changeSort('Date')"
                    @keydown.enter.prevent="changeSort('Date')" @keydown.space.prevent="changeSort('Date')">
                    <span class="th-wrap">
                      <span class="th-text">Date</span>
                      <span class="th-caret" aria-hidden="true"></span>
                    </span>
                  </th>
                  <th class="th-actions">Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(row, index) in rows" :key="row.Id ?? row.id ?? index">
                  <td class="cell">{{ row.CharlieNo }}</td>
                  <td class="cell">{{ row.DriverName }}</td>
                  <td class="cell">{{ row.PlateNo }}</td>
                  <td class="cell">{{ row.Branch }}</td>
                  <td class="cell num">{{ formatNumber(row.Mileage) }}</td>
                  <td class="cell">{{ formatDate(row.Date ?? row.CheckingDateTime) }}</td>

                  <td class="cell actions">
                    <button class="icon-btn" :title="row.HasDetailId ? 'Preview' : 'Preview (ข้อมูลจากลิสต์เท่านั้น)'"
                      @click="openPreview(row)">
                      <i class="fa-regular fa-eye"></i>
                    </button>
                    <button class="icon-btn" title="Export PDF" @click="exportPDF(row)">
                      <i class="fa-regular fa-file-pdf"></i>
                    </button>
                    <button class="icon-btn" title="Export Excel" @click="exportExcel(row)">
                      <i class="fa-regular fa-file-excel"></i>
                    </button>
                  </td>
                </tr>
                <tr v-if="rows.length === 0">
                  <td colspan="7" class="empty">ไม่พบข้อมูล</td>
                </tr>
              </tbody>
            </table>

            <!-- Pager -->
            <div class="pager">
              <div class="pager__stats">
                แสดง {{ startItem.toLocaleString() }}–{{ endItem.toLocaleString() }} จาก {{ total.toLocaleString() }}
              </div>

              <div class="pager__controls">
                <label>แสดง</label>
                <select v-model.number="pageSize" @change="goToFirstAndFetch">
                  <option :value="10">10</option>
                  <option :value="25">25</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
                <span class="sep"></span>
                <label>ไปหน้าที่</label>
                <input class="goto-input" type="number" :min="1" :max="totalPages" v-model.number="pageInput"
                  @keyup.enter="goto(pageInput)" />
                <button class="btn ghost btn--sm" @click="goto(pageInput)">ไป</button>
              </div>

              <div class="pager__nav">
                <button class="btn ghost btn--sm" :disabled="page === 1" @click="goto(1)">«</button>
                <button class="btn ghost btn--sm" :disabled="page === 1" @click="goto(page - 1)">&lt;</button>
                <button v-for="n in pageWindow" :key="n" class="btn page-btn btn--sm" :class="{ active: n === page }"
                  :aria-current="n === page ? 'page' : null" @click="goto(n)">
                  {{ n }}
                </button>
                <button class="btn ghost btn--sm" :disabled="page === totalPages" @click="goto(page + 1)">&gt;</button>
                <button class="btn ghost btn--sm" :disabled="page === totalPages" @click="goto(totalPages)">»</button>
              </div>
            </div>
            <!-- /Pager -->
          </div>
        </div>
      </section>
    </main>

    <!-- ===== Modal Preview ===== -->
    <div class="modal-backdrop" v-if="previewOpen" @click.self="closePreview">
      <div class="modal">
        <div class="modal-head">
          <h3>รายละเอียดการตรวจรถ</h3>
          <button class="icon-btn close" @click="closePreview"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" v-if="!previewLoading && detail">
          <!-- ฟอร์มหน้ากระดาษ -->
          <div class="paper">
            <div class="paper-title">Daily Vehicle Usage and Checking</div>
            <div class="paper-head">
              <div><b>Charlie No:</b> {{ detail.CharlieNo || '-' }}</div>
              <div><b>Driver:</b> {{ detail.DriverName || '-' }}</div>
              <div><b>Plate No:</b> {{ detail.PlateNo || '-' }}</div>
              <div><b>Branch:</b> {{ detail.Branch || '-' }}</div>
              <div><b>Checking Date/Time:</b> {{ formatDate(detail.CheckingDateTime) }}</div>
              <div><b>Mileage:</b> {{ formatNumber(detail.Mileage) }}</div>
              <div class="veh-type">
                <b>Type of Vehicle</b>:
                <span class="chk">{{ markVT('1') }} ปิกอัพ</span>
                <span class="chk">{{ markVT('2') }} รถ 6 ล้อ</span>
                <span class="chk">{{ markVT('3') }} รถตู้ 4 ล้อ (หุ้มเกาะ)</span>
                <span class="chk">{{ markVT('4') }} รถตู้ 4 ล้อ (ตะแกรง)</span>
                <span class="chk">
                  {{ markVT('5') }} อื่นๆ
                  <i v-if="vtOther" class="other">({{ vtOther }})</i>
                </span>
              </div>
            </div>

            <table class="paper-table">
              <thead>
                <tr>
                  <th class="col-no">ลำดับ</th>
                  <th>รายการตรวจเช็ค</th>
                  <th class="col-result">ผลการตรวจเช็ค<br />ปกติ / ผิดปกติ / ไม่มี</th>
                  <th class="col-remark">Remark <br />(ถ้าผลผิดปกติหรือสิ่งที่ตรวจพบ)</th>
                </tr>
              </thead>
              <tbody>
                <tr class="sec-row">
                  <td colspan="4"><b>1. การตรวจเช็คระบบความมั่นคง</b></td>
                </tr>
                <tr v-for="r in section1" :key="r.no">
                  <td class="tac">{{ r.no }}</td>
                  <td>{{ r.label }}</td>
                  <td class="tac">{{ r.status }}</td>
                  <td>{{ r.remark }}</td>
                </tr>
                <tr class="sec-row">
                  <td colspan="4"><b>2. การตรวจสอบสภาพรถ และอุปกรณ์</b></td>
                </tr>
                <tr v-for="r in section2" :key="r.no">
                  <td class="tac">{{ r.no }}</td>
                  <td>{{ r.label }}</td>
                  <td class="tac">{{ r.status }}</td>
                  <td>{{ r.remark }}</td>
                </tr>
                <tr class="sec-row">
                  <td colspan="4"><b>3. Legal documents and others เอกสารประจำรถ และอื่น ๆ</b></td>
                </tr>
                <tr v-for="r in section3" :key="r.no">
                  <td class="tac">{{ r.no }}</td>
                  <td>{{ r.label }}</td>
                  <td class="tac">{{ r.status }}</td>
                  <td>{{ r.remark }}</td>
                </tr>
                <tr class="sec-row">
                  <td colspan="4"><b>4. ความเสียหายภายนอกรถ</b></td>
                </tr>
                <tr v-for="r in section4" :key="r.no">
                  <td class="tac">{{ r.no }}</td>
                  <td>{{ r.label }}</td>
                  <td class="tac">{{ r.status }}</td>
                  <td>{{ r.remark }}</td>
                </tr>
              </tbody>
            </table>

            <div class="paper-other">
              <b>ความผิดปกติอื่นๆ ที่ตรวจพบ :</b>
              <div class="other-box">{{ detail.Other || '' }}</div>
            </div>
          </div>

          <!-- รูปถ่าย -->
          <div class="section">
            <h4>รูปถ่าย</h4>
            <div class="images">
              <figure v-for="(it, i) in imagesWithLabels" :key="i" class="thumb-wrap" @click="openLightbox(i)">
                <img :src="imgUrl(it.file)" :alt="it.label" class="thumb"
                  @error="(e) => { e.target.alt = 'โหลดรูปไม่สำเร็จ'; e.target.style.opacity = .4 }" />
                <figcaption class="thumb-caption">{{ it.label }}</figcaption>
              </figure>
            </div>
          </div>

          <!-- Lightbox -->
          <div class="lightbox" v-if="lightboxOpen" @click.self="closeLightbox">
            <button class="icon-btn lb-close" @click="closeLightbox" aria-label="Close">
              <i class="fa-solid fa-xmark"></i>
            </button>
            <button v-if="imageList.length > 1" class="icon-btn lb-nav lb-prev" @click.stop="prevLightbox"
              aria-label="Prev">‹</button>
            <img class="lb-img" :src="imgUrl(imageList[lightboxIndex])" :alt="`photo ${lightboxIndex + 1}`" />
            <button v-if="imageList.length > 1" class="icon-btn lb-nav lb-next" @click.stop="nextLightbox"
              aria-label="Next">›</button>
          </div>
        </div>

        <div class="modal-body" v-else>
          <p>กำลังโหลด...</p>
        </div>

        <div class="modal-foot">
          <button class="btn ghost" @click="closePreview">ปิด</button>
          <div class="grow"></div>
          <button class="btn" :disabled="!detail" @click="exportPDF(detail || selectedRow)">Export PDF</button>
          <button class="btn" :disabled="!detail" @click="exportExcel(detail || selectedRow)">Export Excel</button>
        </div>
      </div>
    </div>

    <!-- ============== HIDDEN PDF RENDERER ============== -->
    <div v-if="pdfRenderOpen" ref="pdfHost" class="pdf-hidden" aria-hidden="true">
      <div class="paper pdf-paper">
        <div class="paper-title">Daily Vehicle Usage and Checking</div>

        <div class="paper-head">
          <div><b>Charlie No:</b> {{ pdfDetail.CharlieNo || '-' }}</div>
          <div><b>Driver:</b> {{ pdfDetail.DriverName || '-' }}</div>
          <div><b>Plate No:</b> {{ pdfDetail.PlateNo || '-' }}</div>
          <div><b>Branch:</b> {{ pdfDetail.Branch || '-' }}</div>
          <div><b>Checking Date/Time:</b> {{ formatDate(pdfDetail.CheckingDateTime) }}</div>
          <div><b>Mileage:</b> {{ formatNumber(pdfDetail.Mileage) }}</div>
          <div class="veh-type">
            <b>Type of Vehicle</b>:
            <span class="chk">{{ pdfMarkVT('1') }} ปิกอัพ</span>
            <span class="chk">{{ pdfMarkVT('2') }} รถ 6 ล้อ</span>
            <span class="chk">{{ pdfMarkVT('3') }} รถตู้ 4 ล้อ (หุ้มเกาะ)</span>
            <span class="chk">{{ pdfMarkVT('4') }} รถตู้ 4 ล้อ (ตะแกรง)</span>
            <span class="chk">{{ pdfMarkVT('5') }} อื่นๆ <i v-if="pdfVtOther" class="other">({{ pdfVtOther
            }})</i></span>
          </div>
        </div>

        <table class="paper-table">
          <thead>
            <tr>
              <th class="col-no">ลำดับ</th>
              <th>รายการตรวจเช็ค</th>
              <th class="col-result">ผลการตรวจเช็ค<br />ปกติ / ผิดปกติ / ไม่มี</th>
              <th class="col-remark">Remark <br />(ถ้าผลผิดปกติหรือสิ่งที่ตรวจพบ)</th>
            </tr>
          </thead>
          <tbody>
            <tr class="sec-row">
              <td colspan="4"><b>1. การตรวจเช็คระบบความมั่นคง</b></td>
            </tr>
            <tr v-for="r in pdfSection1" :key="r.no">
              <td class="tac">{{ r.no }}</td>
              <td>{{ r.label }}</td>
              <td class="tac">{{ r.status }}</td>
              <td>{{ r.remark }}</td>
            </tr>
            <tr class="sec-row">
              <td colspan="4"><b>2. การตรวจสอบสภาพรถ และอุปกรณ์</b></td>
            </tr>
            <tr v-for="r in pdfSection2" :key="r.no">
              <td class="tac">{{ r.no }}</td>
              <td>{{ r.label }}</td>
              <td class="tac">{{ r.status }}</td>
              <td>{{ r.remark }}</td>
            </tr>
            <tr class="sec-row">
              <td colspan="4"><b>3. Legal documents and others เอกสารประจำรถ และอื่น ๆ</b></td>
            </tr>
            <tr v-for="r in pdfSection3" :key="r.no">
              <td class="tac">{{ r.no }}</td>
              <td>{{ r.label }}</td>
              <td class="tac">{{ r.status }}</td>
              <td>{{ r.remark }}</td>
            </tr>
            <tr class="sec-row">
              <td colspan="4"><b>4. ความเสียหายภายนอกรถ</b></td>
            </tr>
            <tr v-for="r in pdfSection4" :key="r.no">
              <td class="tac">{{ r.no }}</td>
              <td>{{ r.label }}</td>
              <td class="tac">{{ r.status }}</td>
              <td>{{ r.remark }}</td>
            </tr>
          </tbody>
        </table>

        <div class="paper-other">
          <b>ความผิดปกติอื่นๆ ที่ตรวจพบ :</b>
          <div class="other-box">{{ pdfDetail.Other || '' }}</div>
        </div>
      </div>
    </div>
    <!-- ============== /HIDDEN PDF RENDERER ============== -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted, nextTick } from 'vue'
import TopNav from '@/components/TopNav.vue'
import '@fortawesome/fontawesome-free/css/all.css'
import axios from 'axios'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import * as XLSX from 'xlsx-js-style'   // ใช้ static import

/* ---------- state ---------- */
const searchQuery = ref('')
const page = ref(1)
const pageSize = ref(10)
const pageInput = ref(1)
const sortBy = ref(null)
const sortDir = ref('ASC')

const total = ref(0)
const rows = ref([])

/* ---------- bases ---------- */
const API_BASE = (import.meta.env.VITE_API_APP_URL || '').replace(/\/+$/, '')
const FILES_BASE = (import.meta.env.VITE_FILES_BASE_URL || `${API_BASE}/upload_files`).replace(/\/+$/, '')

/* ===== Footer wording ===== */
const FOOTER_LEFT_TEXT = 'แบบฟอร์มนี้ใช้แทนที่แบบฟอร์มฉบับก่อนหน้า'
const FOOTER_RIGHT_TEXT = 'CSS-LOG-001-02'

/* ---------- computed & helpers ---------- */
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))
const startItem = computed(() => (total.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1))
const endItem = computed(() => Math.min(page.value * pageSize.value, total.value))
const windowSize = 5
const pageWindow = computed(() => {
  const out = []; let start = Math.max(1, page.value - Math.floor(windowSize / 2)); let end = start + windowSize - 1
  if (end > totalPages.value) { end = totalPages.value; start = Math.max(1, end - windowSize + 1) }
  for (let i = start; i <= end; i++) out.push(i); return out
})
watch(page, (p) => (pageInput.value = p))

const stateFor = (col) => (sortBy.value === col ? (sortDir.value === 'ASC' ? 'asc' : 'desc') : 'idle')
const statusText = (v) => { if (v == null) return '-'; const s = String(v).trim().toLowerCase(); if (s === 'normal') return 'ปกติ'; if (s === 'abnormal') return 'ผิดปกติ'; if (s === 'none') return 'ไม่มี'; return v }
const parseDateFlexible = (val) => {
  if (!val) return null
  if (val instanceof Date && !isNaN(val)) return val
  if (typeof val === 'number') { const d = new Date(val); return isNaN(d) ? null : d }
  if (typeof val === 'string') {
    const d = new Date(val); if (!isNaN(d)) return d
    const m = val.match(/^\s*(\d{1,2})\/(\d{1,2})\/(\d{4})(?:,|\s)?\s*(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?\s*$/i)
    if (m) {
      let [, mm, dd, yyyy, hh, mi, ss, ap] = m; let H = parseInt(hh, 10); const minute = parseInt(mi, 10); const second = ss ? parseInt(ss, 10) : 0;
      if (ap) { const u = ap.toUpperCase(); if (u === 'PM' && H < 12) H += 12; if (u === 'AM' && H === 12) H = 0 }
      const dt = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10), H, minute, second); return isNaN(dt) ? null : dt
    }
  } return null
}
const formatDate = (val) => { const d = parseDateFlexible(val); if (!d) return '-'; const pad = (n) => String(n).padStart(2, '0'); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}` }
const formatNumber = (n) => (n == null ? '-' : (Number.isFinite(+n) ? (+n).toLocaleString() : String(n)))
const clampPage = (p) => Math.min(Math.max(1, p || 1), totalPages.value)
const goto = (p) => { const next = clampPage(p); if (next !== page.value) { page.value = next; fetchData() } }
const goToFirstAndFetch = () => { page.value = 1; fetchData() }

const imgUrl = (name) => {
  if (!name) return ''
  if (/^https?:\/\//i.test(name)) return name
  const n = String(name).replace(/^\/?upload_files\/+/i, '').replace(/^\/+/, '')
  return `${FILES_BASE}/${encodeURIComponent(n)}`
}

/* ---------- sort / fetch ---------- */
const changeSort = (column) => { if (sortBy.value === column) { sortDir.value = (sortDir.value === 'ASC') ? 'DESC' : 'ASC' } else { sortBy.value = column; sortDir.value = 'ASC' } page.value = 1; fetchData() }
const fetchData = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API_APP_URL}/api/tracking`, {
      params: { q: searchQuery.value || '', page: page.value, pageSize: pageSize.value, sortBy: sortBy.value || '', sortDir: sortDir.value }
    })
    const rawRows = res.data?.rows ?? []
    rows.value = rawRows.map((r) => {
      const id = r?.Id ?? r?.id ?? r?.InspectionId ?? r?.VehicleInspectionId ?? r?.VID ?? null
      return { ...r, Id: id, HasDetailId: !!id, CheckingDateTime: r?.CheckingDateTime ?? r?.Date ?? r?.date ?? null }
    })
    total.value = res.data?.total ?? 0
    page.value = res.data?.page ?? page.value
    pageSize.value = res.data?.pageSize ?? pageSize.value
  } catch (e) { console.error('Fetch error:', e); rows.value = []; total.value = 0 }
}
onMounted(fetchData)

/* ---------- modal preview ---------- */
const previewOpen = ref(false)
const previewLoading = ref(false)
const detail = ref(null)
const selectedRow = ref(null)
const closePreview = () => { previewOpen.value = false; detail.value = null; selectedRow.value = null }
const openPreview = async (row) => {
  selectedRow.value = row; previewOpen.value = true; previewLoading.value = true
  const id = row?.Id ?? row?.id ?? row?.InspectionId ?? row?.VehicleInspectionId ?? row?.VID ?? null
  if (!id) { detail.value = { ...row }; previewLoading.value = false; return }
  try {
    const url = `${import.meta.env.VITE_API_APP_URL}/api/tracking/${encodeURIComponent(id)}`
    const res = await axios.get(url)
    detail.value = res.data || { ...row }
  } catch (e) { console.error('detail error', e); detail.value = { ...row } }
  finally { previewLoading.value = false }
}

/* ---------- rows builder ---------- */
const buildRows = (d) => {
  const S = (k) => ({ status: statusText(d[`${k}_Status`]), remark: d[`${k}_Remark`] || '' })
  const D = (k, fb) => (d[`${k}_Detail`] || fb)
  const section1 = [
    { no: '1.1', label: D('Sec1', 'ประตู (ใช้งานได้สมบูรณ์/อินเตอร์ล็อค)'), ...S('Sec1') },
    { no: '1.1.1', label: D('Sec2', 'ประตูด้านหน้า ซ้าย ขวา'), ...S('Sec2') },
    { no: '1.1.2', label: D('Sec3', 'ประตูข้าง'), ...S('Sec3') },
    { no: '1.1.3', label: D('Sec4', 'ประตูตู้เซฟ'), ...S('Sec4') },
    { no: '1.1.4', label: D('Sec5', 'ประตูฉุกเฉินเหนือศีรษะ'), ...S('Sec5') },
    { no: '1.2', label: D('Sec6', 'กล้องวงจรปิด'), ...S('Sec6') },
    { no: '1.3', label: D('Sec7', 'การทำงานของแผงควบคุมระบบรถ'), ...S('Sec7') },
    { no: '1.3.1', label: D('Sec8', 'ระบบสแกนนิ้ว'), ...S('Sec8') },
  ]
  const section2 = [
    { no: '2.1', label: D('Cond1', 'สภาพยางทั้ง 4 ล้อ และยางอะไหล่'), ...S('Cond1') },
    { no: '2.2', label: D('Cond2', 'อุปกรณ์ประจำรถ ที่ถอดล้อ แม่แรง อุปกรณ์อื่นฯ'), ...S('Cond2') },
    { no: '2.3', label: D('Cond3', 'ระดับน้ำมันเครื่อง (อยู่ในระดับที่ปกติ)'), ...S('Cond3') },
    { no: '2.4', label: D('Cond4', 'ระดับน้ำมันเบรค (อยู่ในระดับที่ปกติ)'), ...S('Cond4') },
    { no: '2.5', label: D('Cond5', 'น้ำหล่อเย็นเครื่องยนต์ ในหม้อน้ำหลัก, หม้อพักน้ำ'), ...S('Cond5') },
    { no: '2.6', label: D('Cond6', 'สายพานหน้าเครื่อง (ไม่มีร่องรอยฉีกขาด)'), ...S('Cond6') },
    { no: '2.7', label: D('Cond7', 'เบรค'), ...S('Cond7') },
    { no: '2.8', label: D('Cond8', 'เกียร์'), ...S('Cond8') },
    { no: '2.9', label: D('Cond9', 'แตร/ที่ปัดน้ำฝน'), ...S('Cond9') },
    { no: '2.10', label: D('Cond10', 'ไฟหน้า ไฟสูง ไฟเลี้ยว ไฟเบรค อยู่ในสภาพดี'), ...S('Cond10') },
    { no: '2.11', label: D('Cond11', 'เกจวัดความร้อนเครื่องยนต์/มาตรอัตราความเร็ว'), ...S('Cond11') },
    { no: '2.12', label: D('Cond12', 'แอร์'), ...S('Cond12') },
    { no: '2.13', label: D('Cond13', 'กระจก'), ...S('Cond13') },
    { no: '2.13.1', label: D('Cond14', 'กระจกมองข้างซ้าย ขวา'), ...S('Cond14') },
    { no: '2.13.2', label: D('Cond15', 'กระจกหน้า กระจกหลัง'), ...S('Cond15') },
    { no: '2.13.3', label: D('Cond16', 'กระจกอื่นๆ(หลังคนขับ, ประตูข้าง,ฯลฯ)'), ...S('Cond16') },
    { no: '2.14', label: D('Cond17', 'เข็มขัดนิรภัย'), ...S('Cond17') },
  ]
  const section3 = [
    { no: '3.1', label: D('Doc1', 'พ.ร.บ (เป็นปัจจุบัน)'), ...S('Doc1') },
    { no: '3.2', label: D('Doc2', 'ป้ายวงกลม (ภาษี)'), ...S('Doc2') },
    { no: '3.3', label: D('Doc3', 'แผ่นป้ายทะเบียนรถ หน้า/หลัง'), ...S('Doc3') },
    { no: '3.4', label: D('Doc4', 'สำเนาทะเบียน'), ...S('Doc4') },
    { no: '3.5', label: D('Doc5', 'บัตรน้ำมัน'), ...S('Doc5') },
  ]
  const dmgLabels = ['กันชนหน้า', 'กันชนหลัง', 'ประตูหน้าขวา', 'ประตูหน้าซ้าย', 'ตัวถังหน้าขวา', 'ตัวถังหน้าซ้าย', 'ตัวถังหลังขวา', 'ตัวถังหลังซ้าย', 'ไฟหน้าขวา', 'ไฟหน้าซ้าย', 'ไฟหลังขวา', 'ไฟหลังซ้าย']
  const section4 = Array.from({ length: 12 }, (_, i) => {
    const idx = i + 1
    return { no: `4.${idx}`, label: d[`Damage${idx}_Detail`] || dmgLabels[i], status: (d[`Damage${idx}_Status`] ?? '-') || '-', remark: d[`Damage${idx}_Remark`] || '' }
  })
  return { section1, section2, section3, section4 }
}

const section1 = computed(() => detail.value ? buildRows(detail.value).section1 : [])
const section2 = computed(() => detail.value ? buildRows(detail.value).section2 : [])
const section3 = computed(() => detail.value ? buildRows(detail.value).section3 : [])
const section4 = computed(() => detail.value ? buildRows(detail.value).section4 : [])
const vtCode = computed(() => { const d = detail.value || {}; const raw = d.VehicleType ?? d.vehicleType ?? d.type; return raw == null ? '' : String(raw).trim() })
const vtOther = computed(() => (detail.value?.VehicleTypeOther || '').trim())
const markVT = (c) => (vtCode.value === c ? '☑' : '☐')

/* ---------- PDF renderer (ยกมาคงเดิม) ---------- */
const pdfRenderOpen = ref(false)
const pdfDetail = ref({})
const pdfHost = ref(null)
const pdfSection1 = computed(() => pdfDetail.value ? buildRows(pdfDetail.value).section1 : [])
const pdfSection2 = computed(() => pdfDetail.value ? buildRows(pdfDetail.value).section2 : [])
const pdfSection3 = computed(() => pdfDetail.value ? buildRows(pdfDetail.value).section3 : [])
const pdfSection4 = computed(() => pdfDetail.value ? buildRows(pdfDetail.value).section4 : [])
const pdfVtCode = computed(() => { const d = pdfDetail.value || {}; const raw = d.VehicleType ?? d.vehicleType ?? d.type; return raw == null ? '' : String(raw).trim() })
const pdfVtOther = computed(() => (pdfDetail.value?.VehicleTypeOther || '').trim())
const pdfMarkVT = (c) => (pdfVtCode.value === c ? '☑' : '☐')

const rAF = () => new Promise(r => requestAnimationFrame(() => r()))
const elToCanvas = async (el) => { await rAF(); await rAF(); return await html2canvas(el, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: '#fff', logging: false, imageTimeout: 15000 }) }

/* ฟุตเตอร์ PDF */
const makeTextImage = (text, { color = '#333', fontSize = 7, bold = false, paddingX = 0, paddingY = 1, align = 'left' } = {}) => {
  const c = document.createElement('canvas')
  const ctx = c.getContext('2d')
  ctx.font = `${bold ? 'bold ' : ''}${fontSize}px system-ui, -apple-system, Segoe UI, Roboto, Arial`
  const w = Math.ceil(ctx.measureText(text).width) + paddingX * 2
  const h = fontSize + paddingY * 2
  c.width = Math.max(200, w); c.height = h
  ctx.fillStyle = 'transparent'; ctx.fillRect(0, 0, c.width, c.height)
  ctx.fillStyle = color
  ctx.textBaseline = 'middle'
  ctx.textAlign = align
  const x = align === 'left' ? paddingX : align === 'right' ? c.width - paddingX : c.width / 2
  ctx.fillText(text, x, c.height / 2)
  return { dataUrl: c.toDataURL('image/png'), pxWidth: c.width, pxHeight: c.height }
}
const addFooter = (doc, margin) => {
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const FONT_SIZE = 8
  const IMG_H_PT = 8
  const GAP_PT = 6
  const leftImg = makeTextImage(FOOTER_LEFT_TEXT, { fontSize: FONT_SIZE, align: 'left' })
  const rightImg = makeTextImage(FOOTER_RIGHT_TEXT, { fontSize: FONT_SIZE, align: 'right' })
  const rL = IMG_H_PT / leftImg.pxHeight
  const rR = IMG_H_PT / rightImg.pxHeight
  const wL = leftImg.pxWidth * rL
  const wR = rightImg.pxWidth * rR
  const y = pageH - GAP_PT - IMG_H_PT
  const SAFE_BG_H = IMG_H_PT + GAP_PT + 6
  doc.setFillColor(255, 255, 255)
  doc.rect(margin, pageH - SAFE_BG_H, pageW - margin * 2, SAFE_BG_H, 'F')
  doc.addImage(leftImg.dataUrl, 'PNG', margin, y, wL, IMG_H_PT, undefined, 'FAST')
  doc.addImage(rightImg.dataUrl, 'PNG', pageW - margin - wR, y, wR, IMG_H_PT, undefined, 'FAST')
}

/* === Export PDF (คงเดิม) === */
const exportPDF = async (row) => {
  try {
    let d = { ...row }
    const id = row?.Id ?? row?.id ?? row?.InspectionId ?? row?.VehicleInspectionId ?? row?.VID ?? null
    if (id) {
      try {
        const url = `${import.meta.env.VITE_API_APP_URL}/api/tracking/${encodeURIComponent(id)}`
        const res = await axios.get(url)
        d = res.data || { ...row }
      } catch (e) { console.warn('detail fail, use row', e) }
    }

    pdfDetail.value = d
    pdfRenderOpen.value = true
    await nextTick()

    const rootEl = pdfHost.value
    if (!rootEl) throw new Error('no pdfHost')
    const paperEl = rootEl.querySelector('.pdf-paper')
    if (!paperEl) throw new Error('no .pdf-paper')

    const canvas = await elToCanvas(paperEl)
    const cw = canvas.width
    const ch = canvas.height

    const doc = new jsPDF({ unit: 'pt', format: 'a4', orientation: 'portrait', compress: true })
    const pageW = doc.internal.pageSize.getWidth()
    const pageH = doc.internal.pageSize.getHeight()

    const M = 10
    const FOOTER_IMG_H = 2
    const FOOTER_GAP = 2
    let SAFETY_PAD = 16
    const FOOTER_BLOCK = FOOTER_IMG_H + FOOTER_GAP

    const usableW = pageW - M * 2
    const usableH = pageH - M - FOOTER_BLOCK - SAFETY_PAD
    const scaleX = usableW / cw
    const scaleY = usableH / ch
    let scale = Math.min(scaleX, scaleY) * 1.05
    let drawW = cw * scale, drawH = ch * scale
    while (drawH > usableH - 1) { scale *= 0.99; drawW = cw * scale; drawH = ch * scale }

    const x = (pageW - drawW) / 2
    const y = M
    const img = canvas.toDataURL('image/jpeg', 0.95)
    doc.addImage(img, 'JPEG', x, y, drawW, drawH, undefined, 'FAST')
    addFooter(doc, M)

    const filename = `Vehicle_${(d.CharlieNo || 'N-A')}_${(d.PlateNo || '')}.pdf`.replace(/\s+/g, '')
    doc.save(filename)
  } catch (err) {
    console.error('exportPDF error:', err)
    alert('ไม่สามารถสร้าง PDF ได้')
  } finally {
    pdfRenderOpen.value = false
    pdfDetail.value = {}
  }
}

/* ---------- Export Excel (หัวข้อชิดซ้าย + เส้นตารางครบ) ---------- */
const exportExcel = async (row) => {
  try {
    const U = XLSX.utils

    // detail
    let d = detail.value || row
    const id = d?.Id ?? d?.id ?? d?.InspectionId ?? d?.VehicleInspectionId ?? d?.VID ?? null
    if (id && !detail.value) {
      try {
        const url = `${import.meta.env.VITE_API_APP_URL}/api/tracking/${encodeURIComponent(id)}`
        const res = await axios.get(url)
        d = res.data || d
      } catch {
        //

      }
    }

    // build rows
    const { section1, section2, section3, section4 } = buildRows(d)

    // vehicle type line
    const vCode = String(d?.VehicleType ?? d?.vehicleType ?? d?.type ?? '').trim()
    const tick = (c) => (vCode === c ? '☑' : '☐')
    const vtOtherText = (vCode === '5' && d?.VehicleTypeOther) ? ` (${String(d.VehicleTypeOther).trim()})` : ''
    const vehicleLine = [
      `${tick('1')} ปิกอัพ`,
      `${tick('2')} รถ 6 ล้อ`,
      `${tick('3')} รถตู้ 4 ล้อ (หุ้มเกาะ)`,
      `${tick('4')} รถตู้ 4 ล้อ (ตะแกรง)`,
      `${tick('5')} อื่นๆ${vtOtherText}`
    ].join('   ')

    // AOA
    const aoa = []
    aoa.push(['Daily Vehicle Usage and Checking', '', '', ''])
    aoa.push([])
    aoa.push(['Charlie No:', d.CharlieNo || '-', 'Driver:', d.DriverName || '-'])
    aoa.push(['Plate No:', d.PlateNo || '-', 'Branch:', d.Branch || '-'])
    aoa.push(['Checking Date/Time:', formatDate(d.CheckingDateTime), 'Mileage:', formatNumber(d.Mileage)])
    aoa.push(['Type of Vehicle', vehicleLine, '', ''])
    aoa.push([])

    const pushSection = (title, rows) => {
      aoa.push([title, '', '', '']) // section header (merge A:D)
      aoa.push(['ลำดับ', 'รายการตรวจเช็ค', 'ผลการตรวจเช็ค', 'Remark (ถ้าผลผิดปกติหรือสิ่งที่ตรวจพบ)'])
      rows.forEach(r => aoa.push([r.no, r.label, r.status, r.remark || '']))
      aoa.push([])
    }
    pushSection('1. การตรวจเช็คระบบความมั่นคง', section1)
    pushSection('2. การตรวจสอบสภาพรถ และอุปกรณ์', section2)
    pushSection('3. Legal documents and others เอกสารประจำรถ และอื่น ๆ', section3)
    pushSection('4. ความเสียหายภายนอกรถ', section4)

    aoa.push(['ความผิดปกติอื่นๆ ที่ตรวจพบ :', (d.Other || ''), '', ''])

    // sheet
    const ws = U.aoa_to_sheet(aoa)
    ws['!cols'] = [{ wch: 12 }, { wch: 60 }, { wch: 26 }, { wch: 60 }]

    // merges
    const merges = []
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 3 } })
    merges.push({ s: { r: 5, c: 1 }, e: { r: 5, c: 3 } })
    aoa.forEach((rowArr, idx) => {
      const a = rowArr[0], b = rowArr[1], c = rowArr[2], d4 = rowArr[3]
      const isHeader = a && !b && !c && !d4 && (
        String(a).startsWith('1. ') ||
        String(a).startsWith('2. ') ||
        String(a).startsWith('3. ') ||
        String(a).startsWith('4. ')
      )
      if (isHeader) merges.push({ s: { r: idx, c: 0 }, e: { r: idx, c: 3 } })
    })
    const otherRowIndex = aoa.findIndex(arr => String(arr?.[0] ?? '').startsWith('ความผิดปกติอื่นๆ ที่ตรวจพบ'))
    if (otherRowIndex >= 0) merges.push({ s: { r: otherRowIndex, c: 1 }, e: { r: otherRowIndex, c: 3 } })
    ws['!merges'] = merges

    // styles
    const ARGB = { green: 'FF1A8D5B', white: 'FFFFFFFF', grayBg: 'FFF5F5F5', border: 'FFBFBFBF', black: 'FF000000' }
    const borderThin = {
      top: { style: 'thin', color: { rgb: ARGB.border } },
      bottom: { style: 'thin', color: { rgb: ARGB.border } },
      left: { style: 'thin', color: { rgb: ARGB.border } },
      right: { style: 'thin', color: { rgb: ARGB.border } },
    }
    const styleHeaderTable = { fill: { patternType: 'solid', fgColor: { rgb: ARGB.green } }, font: { bold: true, color: { rgb: ARGB.white } }, alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borderThin }
    const styleSectionHeader = { fill: { patternType: 'solid', fgColor: { rgb: ARGB.grayBg } }, font: { bold: true, color: { rgb: ARGB.black } }, alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, border: borderThin }
    const styleTitle = { font: { bold: true, sz: 14 }, alignment: { horizontal: 'center', vertical: 'center' }, border: borderThin }
    const styleBodyCenter = { alignment: { horizontal: 'center', vertical: 'center', wrapText: true }, border: borderThin }
    const styleBodyLeft = { alignment: { horizontal: 'left', vertical: 'top', wrapText: true }, border: borderThin }
    const styleBodyBoldLeft = { font: { bold: true }, alignment: { horizontal: 'left', vertical: 'center', wrapText: true }, border: borderThin }

    const range = U.decode_range(ws['!ref'])
    const setCellStyle = (r, c, s) => {
      const addr = U.encode_cell({ r, c })
      if (!ws[addr]) ws[addr] = { t: 's', v: '' }
      ws[addr].s = { ...(ws[addr].s || {}), ...s }
    }

    /* ===== ลำดับการเซ็ตสไตล์ใหม่ เพื่อให้หัวข้อ “ชิดซ้าย” แน่นอน ===== */

    // 1) ใส่เส้นขอบพื้นฐานให้ทุกเซลล์ก่อน
    for (let r = range.s.r; r <= range.e.r; r++) {
      for (let c = range.s.c; c <= range.e.c; c++) {
        setCellStyle(r, c, { border: borderThin })
      }
    }

    // 2) จัดคอลัมน์พื้นฐาน (A, C center / B, D wrap-left)
    for (let r = range.s.r; r <= range.e.r; r++) {
      setCellStyle(r, 0, styleBodyCenter) // A
      setCellStyle(r, 2, styleBodyCenter) // C
      setCellStyle(r, 1, styleBodyLeft)   // B
      setCellStyle(r, 3, styleBodyLeft)   // D
    }

    // 3) สไตล์พิเศษ (จะ “ทับ” ของข้อ 2 เสมอ)
    // 3.1 Title A1:D1
    for (let c = 0; c <= 3; c++) setCellStyle(0, c, styleTitle)
      // 3.2 Head rows 3 แถว + Vehicle type
      ;[2, 3, 4].forEach(rr => { setCellStyle(rr, 0, styleBodyBoldLeft); setCellStyle(rr, 1, styleBodyLeft); setCellStyle(rr, 2, styleBodyBoldLeft); setCellStyle(rr, 3, styleBodyLeft) })
    setCellStyle(5, 0, styleBodyBoldLeft); setCellStyle(5, 1, styleBodyLeft); setCellStyle(5, 2, styleBodyLeft); setCellStyle(5, 3, styleBodyLeft)

    // 3.3 table-head และ section-head (หัวข้อชิดซ้ายแน่นอน)
    aoa.forEach((rowArr, rIdx) => {
      const isTableHead = rowArr[0] === 'ลำดับ'
        && rowArr[1] === 'รายการตรวจเช็ค'
        && rowArr[2] === 'ผลการตรวจเช็ค'
        && String(rowArr[3] || '').startsWith('Remark')
      if (isTableHead) for (let cc = 0; cc < 4; cc++) setCellStyle(rIdx, cc, styleHeaderTable)

      const a = rowArr[0], b = rowArr[1], c = rowArr[2], dcol = rowArr[3]
      const isHeader = a && !b && !c && !dcol && (String(a).startsWith('1. ') || String(a).startsWith('2. ') || String(a).startsWith('3. ') || String(a).startsWith('4. '))
      if (isHeader) for (let cc = 0; cc < 4; cc++) setCellStyle(rIdx, cc, styleSectionHeader) // ← ชิดซ้าย
    })

    // 3.4 บังคับเส้นขอบรอบช่วงที่ merge (กันบางโปรแกรมโชว์ไม่ครบ)
    const drawBorderAroundMerge = (m) => {
      const { s, e } = m
      for (let c = s.c; c <= e.c; c++) {
        setCellStyle(s.r, c, { border: { ...borderThin, top: { style: 'thin', color: { rgb: ARGB.border } } } })
        setCellStyle(e.r, c, { border: { ...borderThin, bottom: { style: 'thin', color: { rgb: ARGB.border } } } })
      }
      for (let r = s.r; r <= e.r; r++) {
        setCellStyle(r, s.c, { border: { ...borderThin, left: { style: 'thin', color: { rgb: ARGB.border } } } })
        setCellStyle(r, e.c, { border: { ...borderThin, right: { style: 'thin', color: { rgb: ARGB.border } } } })
      }
    }
      ; (ws['!merges'] || []).forEach(drawBorderAroundMerge)

    // workbook
    const wb = U.book_new()
    U.book_append_sheet(wb, ws, 'Inspection')
    const filename = `Vehicle_${(d.CharlieNo || 'N-A')}_${(d.PlateNo || '')}.xlsx`.replace(/\s+/g, '')
    XLSX.writeFile(wb, filename)
  } catch (err) {
    console.error('exportExcel error:', err)
  }
}

/* ---------- Lightbox ---------- */
const lightboxOpen = ref(false)
const lightboxIndex = ref(0)
const imageList = computed(() => {
  const d = detail.value || {}
  return [d.Image1, d.Image2, d.Image3, d.Image4].filter(Boolean).filter(n => !/\.heic$/i.test(n))
})
const imagesWithLabels = computed(() => {
  const d = detail.value || {}
  const arr = [d.Image1, d.Image2, d.Image3, d.Image4]
  return arr.map((f, idx) => ({ file: f, label: ['ด้านซ้าย', 'ด้านขวา', 'ด้านหน้า', 'ด้านหลัง'][idx] }))
    .filter(o => o.file && !/\.heic$/i.test(o.file))
})

const openLightbox = (i = 0) => { if (imageList.value.length) { lightboxIndex.value = i; lightboxOpen.value = true } }
const closeLightbox = () => { lightboxOpen.value = false }
const nextLightbox = () => { if (imageList.value.length) lightboxIndex.value = (lightboxIndex.value + 1) % imageList.value.length }
const prevLightbox = () => { if (imageList.value.length) lightboxIndex.value = (lightboxIndex.value - 1 + imageList.value.length) % imageList.value.length }

const onKeydown = (e) => { if (!lightboxOpen.value) return; if (e.key === 'Escape') closeLightbox(); else if (e.key === 'ArrowRight') nextLightbox(); else if (e.key === 'ArrowLeft') prevLightbox() }
onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>



<style scoped>
/* (สไตล์ UI เดิมทั้งหมด ไม่แตะส่วนอื่น) */


/* Layout */
.dashboard {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  overflow-x: hidden
}

.page {
  flex: 1;
  width: 100%;
  display: block
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: clamp(12px, 2vw, 24px)
}

.content-narrow {
  max-width: clamp(1100px, 96vw, 2280px);
  margin: 8px auto 0
}

.title {
  color: #1a8d5b;
  margin: 8px 0 6px;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px
}

.title i {
  font-size: 1.6em;
  color: #1a8d5b
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
  margin: 6px 0 10px
}

.toolbar input {
  width: min(320px, 45vw);
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px
}

.btn {
  background: #1a8d5b;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer
}

.btn:hover {
  background: #146c46
}

.btn.ghost {
  background: #fff;
  color: #1a8d5b;
  border: 1px solid #1a8d5b
}

.btn.ghost:disabled {
  opacity: .5;
  cursor: not-allowed
}

/* Table */
.table-card {
  margin-top: 6px;
  overflow-x: auto
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 12px
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0
}

.table-meta {
  font-size: .95rem;
  color: #666
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .05)
}

/* ... (ส่วน colgroup, thead/tbody/th/td, pager, modal, paper, images, lightbox, pdf renderer ทั้งหมดเหมือนเดิมตามที่พี่ส่งมา) ... */

/* ====== คงสไตล์เดิมทั้งหมดด้านล่าง (ตัดออกเพื่อย่นข้อความ) ====== */

.page {
  flex: 1;
  width: 100%;
  display: block
}

.container {
  width: 100%;
  margin: 0 auto;
  padding: clamp(12px, 2vw, 24px)
}

.content-narrow {
  max-width: clamp(1100px, 96vw, 2280px);
  margin: 8px auto 0
}

.title {
  color: #1a8d5b;
  margin: 8px 0 6px;
  font-size: clamp(20px, 2.4vw, 28px);
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px
}

.title i {
  font-size: 1.6em;
  color: #1a8d5b
}

/* Toolbar */
.toolbar {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  align-items: center;
  margin: 6px 0 10px
}

.toolbar input {
  width: min(320px, 45vw);
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 6px
}

.btn {
  background: #1a8d5b;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  cursor: pointer
}

.btn:hover {
  background: #146c46
}

.btn.ghost {
  background: #fff;
  color: #1a8d5b;
  border: 1px solid #1a8d5b
}

.btn.ghost:disabled {
  opacity: .5;
  cursor: not-allowed
}

/* Table */
.table-card {
  margin-top: 6px;
  overflow-x: auto
}

.table-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 8px 0 12px
}

.subtitle {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0
}

.table-meta {
  font-size: .95rem;
  color: #666
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 3px 8px rgba(0, 0, 0, .05)
}

col.col-charlie {
  width: 10%
}

col.col-driver {
  width: 24%
}

col.col-plate {
  width: 14%
}

col.col-branch {
  width: 14%
}

col.col-mileage {
  width: 12%
}

col.col-date {
  width: 20%
}

col.col-actions {
  width: 8%
}

thead {
  background: #1a8d5b;
  color: #fff
}

th,
td {
  padding: 10px 14px;
  border-bottom: 1px solid #eee;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

thead th {
  text-align: center
}

tbody td {
  text-align: left
}

td.num {
  text-align: right
}

tbody tr:hover {
  background: #f7f7f7
}

th {
  user-select: none;
  cursor: pointer
}

.th-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px
}

.th-caret {
  position: relative;
  width: 10px;
  height: 14px
}

.th-caret::before {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  top: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-bottom: 6px solid currentColor;
  opacity: .6
}

.th-caret::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  bottom: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid currentColor;
  opacity: .6
}

th[data-state=asc] .th-caret::before {
  opacity: 1
}

th[data-state=asc] .th-caret::after {
  opacity: .25
}

th[data-state=desc] .th-caret::after {
  opacity: 1
}

th[data-state=desc] .th-caret::before {
  opacity: .25
}

.th-actions {
  text-align: center;
  cursor: default
}

/* Pager */
.pager {
  display: flex;
  flex-wrap: wrap;
  gap: 12px 16px;
  align-items: center;
  padding: 12px 16px;
  background: #fff;
  border: 1px solid #eee;
  border-top: 0;
  border-radius: 0 0 12px 12px
}

.pager__stats {
  flex: 1 1 240px;
  color: #444;
  min-width: 220px
}

.pager__controls {
  flex: 1 1 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-width: 320px
}

.pager__controls select,
.goto-input {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 6px 10px;
  height: 34px
}

.pager__controls select {
  width: 84px
}

.goto-input {
  width: 72px
}

.pager__controls .sep {
  width: 1px;
  height: 22px;
  background: #e8e8e8;
  margin: 0 4px
}

.pager__nav {
  flex: 1 1 320px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 6px;
  min-width: 260px;
  flex-wrap: wrap
}

.btn--sm {
  padding: 6px 10px;
  min-height: 34px;
  line-height: 20px
}

.page-btn {
  min-width: 36px
}

.page-btn.active,
.page-btn[aria-current=page] {
  background: #1a8d5b;
  color: #fff;
  border-color: #1a8d5b
}

/* Modal & Paper (preview) */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .35);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 50
}

.modal {
  width: min(1000px, 96vw);
  max-height: 90vh;
  background: #fff;
  border-radius: 14px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, .2);
  display: flex;
  flex-direction: column;
  position: relative
}

.modal-head {
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
  padding: 14px 52px 14px 16px;
  border-bottom: 1px solid #eee
}

.modal-head .close {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 8px;
  cursor: pointer
}

.modal-head .close:hover {
  background: #f2fbf7;
  border-color: #1a8d5b
}

.modal-head .close i {
  font-size: 16px
}

.modal-head h3 {
  margin: 0;
  font-size: 18px
}

.modal-body {
  padding: 12px 16px;
  overflow: auto
}

.modal-foot {
  padding: 12px 16px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 8px
}

.modal .grow {
  flex: 1
}

.paper {
  border: 1px solid #ddd;
  padding: 10px 12px 14px;
  border-radius: 8px
}

.paper-title {
  text-align: center;
  font-weight: 700;
  margin-bottom: 8px
}

.paper-head {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px 16px;
  border: 1px solid #e8e8e8;
  padding: 8px;
  border-radius: 6px
}

.paper-head .veh-type {
  grid-column: 1 / -1;
  display: flex;
  gap: 16px;
  align-items: baseline;
  flex-wrap: wrap
}

.paper-head .chk {
  display: inline-flex;
  align-items: center;
  gap: 6px
}

.paper-head .other {
  font-style: normal;
  color: #555
}

.paper-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px
}

.paper-table th,
.paper-table td {
  border: 1px solid #dcdcdc;
  padding: 6px 8px;
  font-size: 13px
}

.paper-table thead th {
  background: #1a8d5b;
  color: #fff;
  text-align: center
}

.paper-table .col-no {
  width: 64px
}

.paper-table .col-result {
  width: 160px
}

.paper-table .col-remark {
  width: 240px
}

.paper-table .tac {
  text-align: center
}

.paper-table .sec-row td {
  background: #f5f5f5;
  font-weight: 700
}

.paper-other {
  margin-top: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  align-items: start
}

.paper-other .other-box {
  min-height: 44px;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 6px 8px
}

/* Images / Lightbox */
.section {
  margin-top: 14px
}

.section h4 {
  margin: 8px 0;
  color: #1a8d5b
}

.images {
  display: flex;
  gap: 8px;
  flex-wrap: wrap
}

.images .thumb {
  width: calc(25% - 6px);
  min-width: 160px;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 10px;
  border: 1px solid #eee;
  cursor: zoom-in
}

.thumb-wrap {
  width: calc(25% - 6px);
  min-width: 160px;
  display: flex;
  flex-direction: column;
  align-items: stretch
}

.thumb-caption {
  text-align: center;
  font-size: 12.5px;
  color: #333;
  padding: 4px 6px 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis
}

.lightbox {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, .85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px
}

.lb-img {
  max-width: 96vw;
  max-height: 90vh;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, .5)
}

.lb-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  background: rgba(255, 255, 255, .15);
  border-color: rgba(255, 255, 255, .35);
  color: #fff
}

.lb-close:hover {
  background: rgba(255, 255, 255, .25)
}

.lb-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 42px;
  height: 60px;
  font-size: 28px;
  background: rgba(255, 255, 255, .12);
  color: #fff;
  border-color: rgba(255, 255, 255, .3)
}

.lb-prev {
  left: 14px
}

.lb-next {
  right: 14px
}

.lb-nav:hover {
  background: rgba(255, 255, 255, .2)
}

/* Actions */
td.actions,
th.th-actions {
  text-overflow: clip;
  overflow: visible;
  white-space: nowrap;
  text-align: center
}

td.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px
}

td.actions .icon-btn {
  appearance: none;
  background: transparent;
  border: 1px solid #e6e6e6;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  line-height: 1;
  display: grid;
  place-items: center;
  transition: background .15s, border-color .15s, transform .15s
}

td.actions .icon-btn:hover {
  background: #f2fbf7;
  border-color: #1a8d5b;
  transform: translateY(-1px)
}

td.actions .icon-btn i {
  font-size: 16px;
  color: #1a8d5b
}

td.actions .icon-btn .fa-file-pdf {
  color: #2563eb
}

.fa-file-excel {
  color: #1e7244
}

td.actions .icon-btn:focus-visible {
  outline: none;
  box-shadow: 0 0 0 2px rgba(26, 141, 91, .35);
  border-color: #1a8d5b
}

/* Hidden PDF renderer */
.pdf-hidden {
  position: fixed;
  left: -10000px;
  top: 0;
  width: 794px;
  background: #fff;
  z-index: -1
}

.pdf-paper {
  width: 794px
}

/* PDF-only tuning */
.pdf-paper {
  font-size: 11px
}

.pdf-paper .paper {
  border: 0;
  padding: 0
}

.pdf-paper .paper-title {
  margin: 0 0 6px
}

.pdf-paper .paper-head {
  padding: 6px
}

.pdf-paper .paper-table {
  width: 100%
}

.pdf-paper .paper-table th,
.pdf-paper .paper-table td {
  padding: 4px 6px;
  font-size: 11px
}

.pdf-paper .paper-other .other-box {
  padding: 4px 6px;
  min-height: 38px
}
</style>
