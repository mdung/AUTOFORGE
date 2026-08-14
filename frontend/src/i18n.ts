import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "common": {
        "loading": "Loading...",
        "error": "An error occurred. Please try again.",
        "save": "Save",
        "cancel": "Cancel",
        "delete": "Delete",
        "edit": "Edit",
        "search": "Search",
        "customer": "Customer",
        "vehicle": "Vehicle",
        "status": "Status",
        "actions": "Actions",
        "noData": "No data available"
      },
      "navigation": {
        "dashboard": "Dashboard",
        "appointments": "Appointments & Bays",
        "checkin": "Vehicle Check-in",
        "dvi": "Inspection (DVI)",
        "estimates": "Estimates & Billing",
        "workshop": "Workshop Board",
        "parts": "Parts & Stock",
        "customers": "Customers Ledger",
        "vehicles": "Vehicles Ledger",
        "fleet": "Fleet Manager",
        "portal": "Customer Portal",
        "settings": "Settings",
        "audit": "Audit Log",
        "qc": "QC Inspections",
        "delivery": "Delivery Checklists"
      },
      "dashboard": {
        "title": "Dashboard",
        "kpiSection": "Key performance indicators",
        "todayAppointments": "Today's Appointments",
        "activeRepairOrders": "Active Repair Orders",
        "totalCustomers": "Total Customers",
        "totalVehicles": "Total Vehicles",
        "recentAppointments": "Recent Appointments",
        "activeWork": "Active Work",
        "noAppointments": "No appointments scheduled.",
        "noActiveWork": "No active repair orders."
      },
      "appointments": {
        "title": "Appointments",
        "newAppointment": "New Appointment",
        "selectCustomer": "Select customer...",
        "selectVehicle": "Select vehicle...",
        "date": "Date",
        "time": "Time",
        "serviceType": "Service Type",
        "create": "Create Appointment",
        "noAppointments": "No appointments found."
      },
      "customers": {
        "title": "Customers",
        "addCustomer": "Add Customer",
        "searchPlaceholder": "Search by name, phone, or email...",
        "name": "Name",
        "phone": "Phone",
        "email": "Email",
        "address": "Address",
        "type": "Type",
        "individual": "Individual",
        "fleet": "Fleet",
        "noCustomers": "No customers found."
      },
      "vehicles": {
        "title": "Vehicles",
        "addVehicle": "Add Vehicle",
        "searchPlaceholder": "Search by plate, VIN, make, or model...",
        "owner": "Owner",
        "selectOwner": "Select owner...",
        "licensePlate": "License Plate",
        "vin": "VIN",
        "make": "Make",
        "model": "Model",
        "year": "Year",
        "mileage": "Mileage",
        "color": "Color",
        "noVehicles": "No vehicles found."
      },
      "parts": {
        "title": "Parts & Inventory",
        "addPart": "Add Part",
        "searchPlaceholder": "Search by name, SKU, or brand...",
        "sku": "SKU",
        "partName": "Part Name",
        "brand": "Brand",
        "cost": "Cost",
        "sellingPrice": "Selling Price",
        "stockQty": "Stock Qty",
        "actions": "Actions",
        "addStock": "Add stock to",
        "removeStock": "Remove stock from",
        "lowStockAlert": "Low Stock Alert",
        "noParts": "No parts found."
      },
      "workshop": {
        "title": "Workshop Board",
        "kanbanBoard": "Repair order workflow board",
        "roNumber": "RO Number",
        "jobs": "jobs",
        "noOrders": "No orders in this status",
        "moveTo": "Move to",
        "status": {
          "READY_FOR_WORK": "Ready",
          "IN_PROGRESS": "In Progress",
          "WAITING_PARTS": "Waiting Parts",
          "QC_CHECK": "QC Check",
          "COMPLETED": "Completed"
        }
      },
      "calendar": {
        "day": "Day",
        "week": "Week",
        "month": "Month",
        "no_appts": "No Appointments",
        "no_appts_day": "No appointments scheduled for this day.",
        "appointments_unit": "appointments",
        "month_view_fallback": "Please switch to Day or Week mode for detailed workshop schedule dispatching."
      },
      "settings": {
        "title": "System Settings",
        "language": "Language",
        "theme": "Theme Mode",
        "branch": "Default Branch Access",
        "dark": "Dark Mode",
        "light": "Light Mode",
        "save": "Save Configuration"
      }
    }
  },
  vi: {
    translation: {
      "common": {
        "loading": "Đang tải...",
        "error": "Đã xảy ra lỗi. Vui lòng thử lại.",
        "save": "Lưu",
        "cancel": "Hủy",
        "delete": "Xóa",
        "edit": "Sửa",
        "search": "Tìm kiếm",
        "customer": "Khách hàng",
        "vehicle": "Phương tiện",
        "status": "Trạng thái",
        "actions": "Thao tác",
        "noData": "Không có dữ liệu"
      },
      "navigation": {
        "dashboard": "Bảng Điều Khiển",
        "appointments": "Lịch Hẹn & Bay Dịch Vụ",
        "checkin": "Tiếp Nhận Xe",
        "dvi": "Kiểm Tra DVI",
        "estimates": "Báo Giá & Hóa Đơn",
        "workshop": "Bảng Tổ Kỹ Thuật",
        "parts": "Kho Phụ Tùng",
        "customers": "Sổ Khách Hàng",
        "vehicles": "Sổ Phương Tiện",
        "fleet": "Quản Lý Đội Xe",
        "portal": "Cổng Khách Hàng",
        "settings": "Cài Đặt Hệ Thống",
        "audit": "Nhật Ký Hệ Thống",
        "qc": "Kiểm Tra Chất Lượng QC",
        "delivery": "Bàn Giao Xe"
      },
      "dashboard": {
        "title": "Bảng Điều Khiển",
        "kpiSection": "Chỉ số hiệu suất chính",
        "todayAppointments": "Lịch Hẹn Hôm Nay",
        "activeRepairOrders": "Lệnh Sửa Chữa Đang Hoạt Động",
        "totalCustomers": "Tổng Khách Hàng",
        "totalVehicles": "Tổng Phương Tiện",
        "recentAppointments": "Lịch Hẹn Gần Đây",
        "activeWork": "Công Việc Đang Thực Hiện",
        "noAppointments": "Không có lịch hẹn.",
        "noActiveWork": "Không có lệnh sửa chữa đang hoạt động."
      },
      "appointments": {
        "title": "Lịch Hẹn",
        "newAppointment": "Tạo Lịch Hẹn Mới",
        "selectCustomer": "Chọn khách hàng...",
        "selectVehicle": "Chọn phương tiện...",
        "date": "Ngày",
        "time": "Giờ",
        "serviceType": "Loại Dịch Vụ",
        "create": "Tạo Lịch Hẹn",
        "noAppointments": "Không tìm thấy lịch hẹn."
      },
      "customers": {
        "title": "Sổ Khách Hàng",
        "addCustomer": "Thêm Khách Hàng",
        "searchPlaceholder": "Tìm theo tên, số điện thoại, hoặc email...",
        "name": "Họ tên",
        "phone": "Số điện thoại",
        "email": "Email",
        "address": "Địa chỉ",
        "type": "Loại",
        "individual": "Cá nhân",
        "fleet": "Đội xe",
        "noCustomers": "Không tìm thấy khách hàng."
      },
      "vehicles": {
        "title": "Sổ Phương Tiện",
        "addVehicle": "Thêm Phương Tiện",
        "searchPlaceholder": "Tìm theo biển số, VIN, hãng, hoặc model...",
        "owner": "Chủ xe",
        "selectOwner": "Chọn chủ xe...",
        "licensePlate": "Biển số",
        "vin": "Số khung (VIN)",
        "make": "Hãng xe",
        "model": "Dòng xe",
        "year": "Năm sản xuất",
        "mileage": "Số km",
        "color": "Màu sắc",
        "noVehicles": "Không tìm thấy phương tiện."
      },
      "parts": {
        "title": "Kho Phụ Tùng",
        "addPart": "Thêm Phụ Tùng",
        "searchPlaceholder": "Tìm theo tên, mã SKU, hoặc thương hiệu...",
        "sku": "Mã SKU",
        "partName": "Tên Phụ Tùng",
        "brand": "Thương hiệu",
        "cost": "Giá vốn",
        "sellingPrice": "Giá bán",
        "stockQty": "Số lượng tồn",
        "actions": "Thao tác",
        "addStock": "Nhập thêm cho",
        "removeStock": "Xuất kho cho",
        "lowStockAlert": "Cảnh Báo Tồn Kho Thấp",
        "noParts": "Không tìm thấy phụ tùng."
      },
      "workshop": {
        "title": "Bảng Tổ Kỹ Thuật",
        "kanbanBoard": "Bảng theo dõi quy trình sửa chữa",
        "roNumber": "Số Lệnh SC",
        "jobs": "công việc",
        "noOrders": "Không có lệnh trong trạng thái này",
        "moveTo": "Chuyển sang",
        "status": {
          "READY_FOR_WORK": "Sẵn Sàng",
          "IN_PROGRESS": "Đang Thực Hiện",
          "WAITING_PARTS": "Chờ Phụ Tùng",
          "QC_CHECK": "Kiểm Tra QC",
          "COMPLETED": "Hoàn Thành"
        }
      },
      "calendar": {
        "day": "Ngày",
        "week": "Tuần",
        "month": "Tháng",
        "no_appts": "Không có lịch",
        "no_appts_day": "Không có lịch hẹn nào được lên lịch cho ngày hôm nay.",
        "appointments_unit": "lịch hẹn",
        "month_view_fallback": "Vui lòng chọn chế độ Tuần hoặc Ngày để xem và điều phối chi tiết công việc của xưởng dịch vụ."
      },
      "settings": {
        "title": "Cài Đặt Hệ Thống",
        "language": "Ngôn ngữ",
        "theme": "Giao diện",
        "branch": "Chi nhánh mặc định",
        "dark": "Tối",
        "light": "Sáng",
        "save": "Lưu cấu hình"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
