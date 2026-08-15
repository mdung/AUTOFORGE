import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const savedLang = localStorage.getItem('autoforge_lang') || 'vi';

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
        "noData": "No data available",
        "role": "Role",
        "signOut": "Sign Out"
      },
      "header": {
        "searchPlaceholder": "Search VIN, license plate, customer, phone...",
        "toggleThemeDark": "Switch to Light Mode",
        "toggleThemeLight": "Switch to Dark Mode",
        "toggleLang": "Switch Language"
      },
      "navigation": {
        "dashboard": "Dashboard",
        "appointments": "Appointments",
        "calendar": "Calendar & Bays",
        "checkin": "Vehicle Check-in",
        "dvi": "Inspection (DVI)",
        "estimates": "Estimates & Billing",
        "workshop": "Workshop Board",
        "tech": "Technician PWA",
        "parts": "Parts & Inventory",
        "customers": "Customers Ledger",
        "vehicles": "Vehicles Ledger",
        "fleet": "Fleet Manager",
        "portal": "Customer Portal",
        "qc": "QC Inspections",
        "delivery": "Delivery Checklists",
        "audit": "Audit Logs",
        "admin": "Staff Permissions",
        "settings": "System Settings"
      },
      "serviceTypes": {
        "Periodic Maintenance": "Periodic Maintenance",
        "Brake Inspection": "Brake Inspection",
        "A/C Repair": "A/C Repair",
        "EV Battery Check": "EV Battery Check",
        "Periodic Maintenance Mercedes": "Periodic Maintenance",
        "Tire Replacement": "Tire Replacement",
        "Fleet Maintenance": "Fleet Maintenance",
        "Engine Diagnosis": "Engine Diagnosis",
        "Body & Paint": "Body & Paint"
      },
      "status": {
        "CONFIRMED": "Confirmed",
        "ARRIVED": "Arrived",
        "REQUESTED": "Requested",
        "IN_PROGRESS": "In Progress",
        "READY_FOR_WORK": "Ready",
        "WAITING_PARTS": "Waiting Parts",
        "QC_CHECK": "QC Check",
        "COMPLETED": "Completed",
        "DELIVERED": "Delivered",
        "ACTIVE": "Active",
        "SUSPENDED": "Suspended"
      },
      "dashboard": {
        "title": "Dashboard",
        "kpiSection": "Key Performance Indicators",
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
        "title": "Customers Ledger",
        "addCustomer": "Add Customer",
        "searchPlaceholder": "Search by name, phone, or email...",
        "name": "Full Name",
        "phone": "Phone Number",
        "email": "Email",
        "address": "Address",
        "type": "Customer Type",
        "individual": "Individual",
        "fleet": "Fleet",
        "noCustomers": "No customers found."
      },
      "vehicles": {
        "title": "Vehicles Ledger",
        "addVehicle": "Add Vehicle",
        "searchPlaceholder": "Search by plate, VIN, make, or model...",
        "owner": "Owner",
        "selectOwner": "Select owner...",
        "licensePlate": "License Plate",
        "vin": "VIN Number",
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
        "sku": "SKU Code",
        "partName": "Part Name",
        "brand": "Brand",
        "cost": "Cost Price",
        "sellingPrice": "Selling Price",
        "stockQty": "Stock Qty",
        "actions": "Actions",
        "addStock": "Add stock to",
        "removeStock": "Remove stock from",
        "lowStockAlert": "Low Stock Warning",
        "noParts": "No parts found."
      },
      "workshop": {
        "title": "Workshop Board",
        "kanbanBoard": "Repair order workflow board",
        "roNumber": "RO Number",
        "jobs": "jobs",
        "noOrders": "No orders in this column",
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
        "title": "Calendar & Bays Dispatch",
        "day": "Day",
        "week": "Week",
        "month": "Month",
        "no_appts": "No Appointments",
        "no_appts_day": "No appointments scheduled for this day.",
        "appointments_unit": "appointments",
        "month_view_fallback": "Please switch to Day or Week view for workshop schedule dispatching."
      },
      "admin": {
        "title": "Staff Management & Permissions",
        "desc": "Staff accounts list, role-based access control (RBAC), and status management",
        "directory": "Staff Directory",
        "name": "Full Name",
        "email": "Email",
        "role": "Role",
        "status": "Status",
        "actions": "Actions",
        "suspend": "Suspend",
        "activate": "Activate"
      },
      "qc": {
        "title": "Quality Control Audit (QC)",
        "desc": "Post-repair quality audit report before vehicle handover protocol",
        "checklist": "QC Audit Checklist",
        "inspector": "QC Inspector",
        "qcStatus": "QC Status",
        "submit": "Submit QC Report",
        "passed": "PASSED",
        "failed": "FAILED",
        "pending": "PENDING"
      },
      "delivery": {
        "title": "Vehicle Handover Process",
        "desc": "Vehicle handover protocol and deferred recommendations log",
        "odometer": "Odometer at handover (km)",
        "deferredTitle": "Deferred Work Recommendations:",
        "signature": "Customer Digital Signature",
        "signaturePlaceholder": "Enter customer full name to sign",
        "complete": "Complete Vehicle Handover",
        "successMsg": "Vehicle handover completed! Confirmation signature:"
      },
      "audit": {
        "title": "Audit Logs & System Events",
        "desc": "Transaction audit trail log and configuration change events",
        "registry": "Audit Events Registry",
        "loading": "Loading system logs...",
        "noEvents": "No audit events registered yet."
      },
      "settings": {
        "title": "System Settings",
        "subtitle": "System configuration, internationalization (i18n), and UI theme settings",
        "personalOptions": "Personal Preferences",
        "displayLang": "Display Language (i18n)",
        "displayLangDesc": "Choose between English or Vietnamese",
        "uiTheme": "UI Appearance Theme",
        "uiThemeDesc": "Select between Dark Mode or Light Mode",
        "currentTheme": "Currently selected:",
        "switchToLight": "Switch to Light Mode",
        "switchToDark": "Switch to Dark Mode"
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
        "noData": "Không có dữ liệu",
        "role": "Vai trò",
        "signOut": "Đăng Xuất"
      },
      "header": {
        "searchPlaceholder": "Tìm kiếm VIN, biển số, khách hàng, SĐT...",
        "toggleThemeDark": "Chuyển sang Giao diện Sáng",
        "toggleThemeLight": "Chuyển sang Giao diện Tối",
        "toggleLang": "Đổi ngôn ngữ"
      },
      "navigation": {
        "dashboard": "Bảng Điều Khiển",
        "appointments": "Lịch Hẹn",
        "calendar": "Lịch Hẹn & Bay",
        "checkin": "Tiếp Nhận Xe",
        "dvi": "Kiểm Tra DVI",
        "estimates": "Báo Giá & Hóa Đơn",
        "workshop": "Bảng Tổ Kỹ Thuật",
        "tech": "PWA Kỹ Thuật Viên",
        "parts": "Kho Phụ Tùng",
        "customers": "Sổ Khách Hàng",
        "vehicles": "Sổ Phương Tiện",
        "fleet": "Quản Lý Đội Xe",
        "portal": "Cổng Khách Hàng",
        "qc": "Kiểm Tra QC",
        "delivery": "Bàn Giao Xe",
        "audit": "Nhật Ký Hệ Thống",
        "admin": "Phân Quyền Nhân Viên",
        "settings": "Cài Đặt Hệ Thống"
      },
      "serviceTypes": {
        "Periodic Maintenance": "Bảo Dưỡng Định Kỳ",
        "Brake Inspection": "Kiểm Tra Phanh",
        "A/C Repair": "Sửa Chữa Điều Hòa",
        "EV Battery Check": "Kiểm Tra Pin EV",
        "Periodic Maintenance Mercedes": "Bảo Dưỡng Định Kỳ",
        "Tire Replacement": "Thay Lốp Xe",
        "Fleet Maintenance": "Bảo Dưỡng Đội Xe",
        "Engine Diagnosis": "Chẩn Đoán Động Cơ",
        "Body & Paint": "Đồng Sơn & Sơn Xe"
      },
      "status": {
        "CONFIRMED": "Đã Xóa/Xác Nhận",
        "ARRIVED": "Đã Đến Xưởng",
        "REQUESTED": "Mới Yêu Cầu",
        "IN_PROGRESS": "Đang Thực Hiện",
        "READY_FOR_WORK": "Sẵn Sàng",
        "WAITING_PARTS": "Chờ Phụ Tùng",
        "QC_CHECK": "Kiểm Tra QC",
        "COMPLETED": "Hoàn Thành",
        "DELIVERED": "Đã Bàn Giao",
        "ACTIVE": "Hoạt Động",
        "SUSPENDED": "Tạm Khóa"
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
        "type": "Loại khách hàng",
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
        "title": "Lịch Hẹn & Bay Dịch Vụ",
        "day": "Ngày",
        "week": "Tuần",
        "month": "Tháng",
        "no_appts": "Không có lịch",
        "no_appts_day": "Không có lịch hẹn nào được lên lịch cho ngày hôm nay.",
        "appointments_unit": "lịch hẹn",
        "month_view_fallback": "Vui lòng chọn chế độ Tuần hoặc Ngày để xem và điều phối chi tiết công việc của xưởng dịch vụ."
      },
      "admin": {
        "title": "Quản Trị Nhân Viên & Phân Quyền",
        "desc": "Danh sách tài khoản nhân viên, thiết lập vai trò (RBAC) và kiểm soát trạng thái truy cập",
        "directory": "Danh Sách Nhân Viên",
        "name": "Họ Tên",
        "email": "Email",
        "role": "Vai Trò (Role)",
        "status": "Trạng Thái",
        "actions": "Hành Động",
        "suspend": "Tạm Khóa",
        "activate": "Kích Hoạt"
      },
      "qc": {
        "title": "Kiểm Tra Chất Lượng QC (Quality Control Audit)",
        "desc": "Báo cáo thẩm định chất lượng sau sửa chữa trước khi làm thủ tục bàn giao xe",
        "checklist": "Danh Mục Kiểm Tra QC Audit",
        "inspector": "Giám Định Viên QC",
        "qcStatus": "Trạng Thái QC",
        "submit": "Gửi Báo Cáo QC",
        "passed": "ĐẠT (PASSED)",
        "failed": "KHÔNG ĐẠT (FAILED)",
        "pending": "ĐANG CHỜ (PENDING)"
      },
      "delivery": {
        "title": "Quy Trình Bàn Giao Xe (Vehicle Handover)",
        "desc": "Biên bản bàn giao phương tiện cho khách hàng và ghi nhận công việc hoãn lại",
        "odometer": "Số Odometer khi bàn giao (km)",
        "deferredTitle": "Hạng mục hoãn làm sau này (Deferred Recommendations):",
        "signature": "Chữ ký số xác nhận của Khách hàng",
        "signaturePlaceholder": "Nhập họ tên khách hàng ký nhận",
        "complete": "Hoàn Tất Bàn Giao Xe",
        "successMsg": "🎉 Đã bàn giao phương tiện hoàn tất! Chữ ký xác nhận:"
      },
      "audit": {
        "title": "Nhật Ký Giao Dịch & Hệ Thống (Audit Logs)",
        "desc": "Danh sách hành động ghi vết giao dịch, thay đổi dữ liệu cấu hình xưởng trên hệ thống",
        "registry": "Nhật Ký Sự Kiện Hệ Thống",
        "loading": "Đang tải nhật ký hệ thống...",
        "noEvents": "Chưa có sự kiện nhật ký nào được ghi nhận."
      },
      "settings": {
        "title": "Cài Đặt Hệ Thống",
        "subtitle": "Cấu hình hệ thống, ngôn ngữ quốc tế hóa (i18n) và tùy chỉnh giao diện",
        "personalOptions": "Tùy Chọn Cá Nhân",
        "displayLang": "Ngôn ngữ hiển thị (i18n)",
        "displayLangDesc": "Lựa chọn tiếng Anh hoặc tiếng Việt",
        "uiTheme": "Giao diện (Theme)",
        "uiThemeDesc": "Lựa chọn Chế độ Tối (Dark) hoặc Chế độ Sáng (Light)",
        "currentTheme": "Đang chọn:",
        "switchToLight": "Chuyển sang Sáng",
        "switchToDark": "Chuyển sang Tối"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
