<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal-box">

      <!-- Title + Export -->
      <div class="modal-header">
        <h3>{{ modalTitle }}</h3>

        <div class="export-buttons">
          <button @click="exportPDF"><i class="fa-solid fa-file-pdf"></i> PDF</button>
          <button @click="exportExcel"><i class="fa-solid fa-file-excel"></i> Excel</button>
        </div>
      </div>

      <!-- Search Inputs -->
      <table class="vehicle-table">
        <thead>
          <tr>
            <th v-for="c in columns" :key="c">
              <input type="text" v-model="filters[c]" placeholder="ค้นหา..." />
            </th>
          </tr>
          <tr>
            <th v-for="c in columns" :key="c">{{ c }}</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="row in filteredRows" :key="row.Id">
            <td>{{ row.CharlieNo }}</td>
            <td>{{ row.DriverName }}</td>
            <td>{{ row.PlateNo }}</td>
            <td>{{ row.Branch }}</td>
            <td>{{ row.Mileage }}</td>
            <td>{{ formatDate(row.CreateDate) }}</td>
          </tr>
        </tbody>
      </table>

      <button class="close-btn" @click="$emit('close')">ปิด</button>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, watch } from "vue";

const props = defineProps({
  show: Boolean,
  type: String,
})

const columns = [
  "CharlieNo",
  "DriverName",
  "PlateNo",
  "Branch",
  "Mileage",
  "Date"
]

const filters = ref({
  CharlieNo: "",
  DriverName: "",
  PlateNo: "",
  Branch: "",
  Mileage: "",
  Date: ""
})

const rows = ref([])

const modalTitle = computed(() => {
  if (props.type === 'total') return "ข้อมูลรถทั้งหมด"
  if (props.type === 'used') return "ข้อมูลรถที่ออกปฏิบัติงาน"
  if (props.type === 'unused') return "ข้อมูลรถที่ไม่ได้ใช้งาน"
  return ""
})

watch(() => props.type, async () => {
  if (!props.type) return;
  const api = import.meta.env.VITE_API_APP_URL + `/api/dashboard/list/${props.type}`
  const res = await fetch(api)
  rows.value = await res.json()
})

const filteredRows = computed(() => {
  return rows.value.filter(row =>
    Object.keys(filters.value).every(key =>
      String(row[key] || '').includes(filters.value[key])
    )
  )
})

const formatDate = (d) => {
  return d ? new Date(d).toLocaleString() : ""
}

const exportPDF = () => {
  window.print()
}

const exportExcel = () => {
  const data = JSON.stringify(rows.value)
  const blob = new Blob([data], { type: "application/json" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.download = modalTitle.value + ".json"
  link.click()
}
</script>


<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-box {
  background: white;
  width: 90%;
  max-width: 1100px;
  padding: 20px;
  border-radius: 10px;
  max-height: 90vh;
  overflow: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.export-buttons button {
  margin-left: 10px;
  padding: 6px 12px;
  background: #1a8d5b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.vehicle-table {
  width: 100%;
  border-collapse: collapse;
}

.vehicle-table th,
.vehicle-table td {
  border: 1px solid #ddd;
  padding: 6px;
}

.vehicle-table input {
  width: 100%;
  padding: 4px;
}

.close-btn {
  margin-top: 20px;
  padding: 6px 18px;
  background: #ef4444;
  color: white;
  border-radius: 6px;
  border: none;
}
</style>
