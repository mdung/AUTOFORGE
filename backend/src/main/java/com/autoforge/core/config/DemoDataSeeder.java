package com.autoforge.core.config;

import com.autoforge.core.tenant.TenantContext;
import com.autoforge.modules.identity.model.User;
import com.autoforge.modules.identity.repository.UserRepository;
import com.autoforge.modules.customer.model.Customer;
import com.autoforge.modules.customer.repository.CustomerRepository;
import com.autoforge.modules.vehicle.model.Vehicle;
import com.autoforge.modules.vehicle.repository.VehicleRepository;
import com.autoforge.modules.tenant.model.Branch;
import com.autoforge.modules.tenant.model.Organization;
import com.autoforge.modules.tenant.model.Tenant;
import com.autoforge.modules.tenant.model.Bay;
import com.autoforge.modules.tenant.repository.BranchRepository;
import com.autoforge.modules.tenant.repository.OrganizationRepository;
import com.autoforge.modules.tenant.repository.TenantRepository;
import com.autoforge.modules.tenant.repository.BayRepository;
import com.autoforge.modules.parts.model.Part;
import com.autoforge.modules.parts.repository.PartRepository;
import com.autoforge.modules.parts.model.Supplier;
import com.autoforge.modules.parts.repository.SupplierRepository;
import com.autoforge.modules.appointment.model.Appointment;
import com.autoforge.modules.appointment.repository.AppointmentRepository;
import com.autoforge.modules.repairorder.model.RepairOrder;
import com.autoforge.modules.repairorder.model.RepairJob;
import com.autoforge.modules.repairorder.repository.RepairOrderRepository;
import com.autoforge.modules.repairorder.repository.RepairJobRepository;
import com.autoforge.modules.estimate.model.Estimate;
import com.autoforge.modules.estimate.model.EstimateItem;
import com.autoforge.modules.estimate.repository.EstimateRepository;
import com.autoforge.modules.estimate.repository.EstimateItemRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class DemoDataSeeder implements CommandLineRunner {

    private final TenantRepository tenantRepository;
    private final OrganizationRepository organizationRepository;
    private final BranchRepository branchRepository;
    private final BayRepository bayRepository;
    private final UserRepository userRepository;
    private final CustomerRepository customerRepository;
    private final VehicleRepository vehicleRepository;
    private final PartRepository partRepository;
    private final SupplierRepository supplierRepository;
    private final AppointmentRepository appointmentRepository;
    private final RepairOrderRepository repairOrderRepository;
    private final RepairJobRepository repairJobRepository;
    private final EstimateRepository estimateRepository;
    private final EstimateItemRepository estimateItemRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (tenantRepository.count() > 0) {
            log.info("Database already seeded. Skipping demo data initialization.");
            return;
        }

        log.info("Seeding realistic demo data for AutoForge Motors Group...");

        // ==================== 1. TENANT ====================
        Tenant tenant = new Tenant();
        tenant.setName("AutoForge Motors Group");
        tenant.setPlan("BUSINESS");
        tenant = tenantRepository.save(tenant);
        UUID tenantId = tenant.getId();
        TenantContext.setCurrentTenant(tenantId);

        // ==================== 2. ORGANIZATION ====================
        Organization org = new Organization();
        org.setTenantId(tenantId);
        org.setName("AutoForge Vietnam");
        org = organizationRepository.save(org);

        // ==================== 3. BRANCHES ====================
        Branch hanoiBranch = new Branch();
        hanoiBranch.setTenantId(tenantId);
        hanoiBranch.setOrgId(org.getId());
        hanoiBranch.setName("Hanoi Service Center");
        hanoiBranch.setAddress("123 Le Thanh Nghi, Hai Ba Trung, Hanoi");
        hanoiBranch.setTimezone("Asia/Ho_Chi_Minh");
        hanoiBranch = branchRepository.save(hanoiBranch);

        Branch hcmcBranch = new Branch();
        hcmcBranch.setTenantId(tenantId);
        hcmcBranch.setOrgId(org.getId());
        hcmcBranch.setName("HCMC Service Center");
        hcmcBranch.setAddress("456 Nguyen Hue, District 1, Ho Chi Minh City");
        hcmcBranch.setTimezone("Asia/Ho_Chi_Minh");
        hcmcBranch = branchRepository.save(hcmcBranch);

        // ==================== 4. BAYS (5 total: 3 Hanoi, 2 HCMC) ====================
        Bay bay1 = new Bay();
        bay1.setTenantId(tenantId);
        bay1.setBranchId(hanoiBranch.getId());
        bay1.setName("Bay 01 - General Lift");
        bay1.setType("LIFT");
        bay1.setStatus("AVAILABLE");
        bay1 = bayRepository.save(bay1);

        Bay bay2 = new Bay();
        bay2.setTenantId(tenantId);
        bay2.setBranchId(hanoiBranch.getId());
        bay2.setName("Bay 02 - EV Diagnosis");
        bay2.setType("EV");
        bay2.setStatus("OCCUPIED");
        bay2 = bayRepository.save(bay2);

        Bay bay3 = new Bay();
        bay3.setTenantId(tenantId);
        bay3.setBranchId(hanoiBranch.getId());
        bay3.setName("Bay 03 - Heavy Duty");
        bay3.setType("LIFT");
        bay3.setStatus("AVAILABLE");
        bay3 = bayRepository.save(bay3);

        Bay bay4 = new Bay();
        bay4.setTenantId(tenantId);
        bay4.setBranchId(hcmcBranch.getId());
        bay4.setName("Bay 01 - General Service");
        bay4.setType("LIFT");
        bay4.setStatus("AVAILABLE");
        bay4 = bayRepository.save(bay4);

        Bay bay5 = new Bay();
        bay5.setTenantId(tenantId);
        bay5.setBranchId(hcmcBranch.getId());
        bay5.setName("Bay 02 - Paint & Body");
        bay5.setType("BODY");
        bay5.setStatus("AVAILABLE");
        bay5 = bayRepository.save(bay5);

        // ==================== 5. USERS (5 total) ====================
        User admin = new User();
        admin.setTenantId(tenantId);
        admin.setBranchId(hanoiBranch.getId());
        admin.setEmail("admin@autoforge.com");
        admin.setPasswordHash(passwordEncoder.encode("password"));
        admin.setFirstName("Anh");
        admin.setLastName("Nguyen");
        admin.setRole("TENANT_ADMIN");
        admin.setStatus("ACTIVE");
        admin = userRepository.save(admin);

        User advisor1 = new User();
        advisor1.setTenantId(tenantId);
        advisor1.setBranchId(hanoiBranch.getId());
        advisor1.setEmail("minh.tran@autoforge.com");
        advisor1.setPasswordHash(passwordEncoder.encode("password"));
        advisor1.setFirstName("Minh");
        advisor1.setLastName("Tran");
        advisor1.setRole("SERVICE_ADVISOR");
        advisor1.setStatus("ACTIVE");
        advisor1 = userRepository.save(advisor1);

        User advisor2 = new User();
        advisor2.setTenantId(tenantId);
        advisor2.setBranchId(hcmcBranch.getId());
        advisor2.setEmail("hoa.pham@autoforge.com");
        advisor2.setPasswordHash(passwordEncoder.encode("password"));
        advisor2.setFirstName("Hoa");
        advisor2.setLastName("Pham");
        advisor2.setRole("SERVICE_ADVISOR");
        advisor2.setStatus("ACTIVE");
        advisor2 = userRepository.save(advisor2);

        User tech1 = new User();
        tech1.setTenantId(tenantId);
        tech1.setBranchId(hanoiBranch.getId());
        tech1.setEmail("dung.le@autoforge.com");
        tech1.setPasswordHash(passwordEncoder.encode("password"));
        tech1.setFirstName("Dung");
        tech1.setLastName("Le");
        tech1.setRole("TECHNICIAN");
        tech1.setStatus("ACTIVE");
        tech1 = userRepository.save(tech1);

        User tech2 = new User();
        tech2.setTenantId(tenantId);
        tech2.setBranchId(hcmcBranch.getId());
        tech2.setEmail("tuan.vo@autoforge.com");
        tech2.setPasswordHash(passwordEncoder.encode("password"));
        tech2.setFirstName("Tuan");
        tech2.setLastName("Vo");
        tech2.setRole("TECHNICIAN");
        tech2.setStatus("ACTIVE");
        tech2 = userRepository.save(tech2);

        // ==================== 6. CUSTOMERS (12 total: 8 individual, 2 business, 2 fleet) ====================
        Customer c1 = new Customer();
        c1.setTenantId(tenantId);
        c1.setName("Nguyen Van Hung");
        c1.setPhone("0912345678");
        c1.setEmail("hung.nguyen@gmail.com");
        c1.setAddress("15 Tran Dai Nghia, Hai Ba Trung, Hanoi");
        c1.setType("INDIVIDUAL");
        c1 = customerRepository.save(c1);

        Customer c2 = new Customer();
        c2.setTenantId(tenantId);
        c2.setName("Tran Thi Mai");
        c2.setPhone("0987654321");
        c2.setEmail("mai.tran@gmail.com");
        c2.setAddress("88 Nguyen Trai, Thanh Xuan, Hanoi");
        c2.setType("INDIVIDUAL");
        c2 = customerRepository.save(c2);

        Customer c3 = new Customer();
        c3.setTenantId(tenantId);
        c3.setName("Pham Duc Toan");
        c3.setPhone("0905123456");
        c3.setEmail("toan.pham@yahoo.com");
        c3.setAddress("201 Le Van Sy, Phu Nhuan, HCMC");
        c3.setType("INDIVIDUAL");
        c3 = customerRepository.save(c3);

        Customer c4 = new Customer();
        c4.setTenantId(tenantId);
        c4.setName("Le Hoang Nam");
        c4.setPhone("0918222333");
        c4.setEmail("nam.le@outlook.com");
        c4.setAddress("72 Ba Trieu, Hoan Kiem, Hanoi");
        c4.setType("INDIVIDUAL");
        c4 = customerRepository.save(c4);

        Customer c5 = new Customer();
        c5.setTenantId(tenantId);
        c5.setName("Vo Thi Lan Anh");
        c5.setPhone("0933444555");
        c5.setEmail("lananh.vo@gmail.com");
        c5.setAddress("55 Hai Ba Trung, District 1, HCMC");
        c5.setType("INDIVIDUAL");
        c5 = customerRepository.save(c5);

        Customer c6 = new Customer();
        c6.setTenantId(tenantId);
        c6.setName("Hoang Minh Duc");
        c6.setPhone("0976111222");
        c6.setEmail("duc.hoang@gmail.com");
        c6.setAddress("30 Kim Ma, Ba Dinh, Hanoi");
        c6.setType("INDIVIDUAL");
        c6 = customerRepository.save(c6);

        Customer c7 = new Customer();
        c7.setTenantId(tenantId);
        c7.setName("Bui Thanh Son");
        c7.setPhone("0945666777");
        c7.setEmail("son.bui@gmail.com");
        c7.setAddress("120 Cach Mang Thang 8, District 3, HCMC");
        c7.setType("INDIVIDUAL");
        c7 = customerRepository.save(c7);

        Customer c8 = new Customer();
        c8.setTenantId(tenantId);
        c8.setName("Do Thi Huong");
        c8.setPhone("0961888999");
        c8.setEmail("huong.do@gmail.com");
        c8.setAddress("45 Phan Chu Trinh, Hoan Kiem, Hanoi");
        c8.setType("INDIVIDUAL");
        c8 = customerRepository.save(c8);

        // Business customers
        Customer c9 = new Customer();
        c9.setTenantId(tenantId);
        c9.setName("Cong ty TNHH Phuong Nam Trading");
        c9.setPhone("02838123456");
        c9.setEmail("contact@phuongnam.vn");
        c9.setAddress("789 Vo Van Kiet, District 5, HCMC");
        c9.setType("BUSINESS");
        c9 = customerRepository.save(c9);

        Customer c10 = new Customer();
        c10.setTenantId(tenantId);
        c10.setName("Cong ty CP Xay Dung Thang Long");
        c10.setPhone("02436789012");
        c10.setEmail("info@thanglong-construction.vn");
        c10.setAddress("100 Nguyen Chi Thanh, Dong Da, Hanoi");
        c10.setType("BUSINESS");
        c10 = customerRepository.save(c10);

        // Fleet customers
        Customer c11 = new Customer();
        c11.setTenantId(tenantId);
        c11.setName("Logistics Express Vietnam");
        c11.setPhone("02439998877");
        c11.setEmail("fleet@logisticsexpress.vn");
        c11.setAddress("KCN Bac Thang Long, Dong Anh, Hanoi");
        c11.setType("FLEET");
        c11 = customerRepository.save(c11);

        Customer c12 = new Customer();
        c12.setTenantId(tenantId);
        c12.setName("Grab Vietnam Fleet Services");
        c12.setPhone("02871001234");
        c12.setEmail("fleet-ops@grab.vn");
        c12.setAddress("Landmark 81, Binh Thanh, HCMC");
        c12.setType("FLEET");
        c12 = customerRepository.save(c12);

        // ==================== 7. VEHICLES (15 total) ====================
        Vehicle v1 = new Vehicle();
        v1.setTenantId(tenantId);
        v1.setOwnerId(c1.getId());
        v1.setLicensePlate("30A-12345");
        v1.setVin("JTDKN3DU5A0123456");
        v1.setMake("Toyota");
        v1.setModel("Camry");
        v1.setVariant("2.5Q");
        v1.setYear(2022);
        v1.setMileage(35000);
        v1.setEngineType("ICE");
        v1.setFuelType("Gasoline");
        v1.setTransmission("Automatic");
        v1.setColor("Black");
        v1 = vehicleRepository.save(v1);

        Vehicle v2 = new Vehicle();
        v2.setTenantId(tenantId);
        v2.setOwnerId(c2.getId());
        v2.setLicensePlate("30F-56789");
        v2.setVin("RLHGC2650LA000123");
        v2.setMake("Honda");
        v2.setModel("CR-V");
        v2.setVariant("1.5L Turbo");
        v2.setYear(2023);
        v2.setMileage(18000);
        v2.setEngineType("ICE");
        v2.setFuelType("Gasoline");
        v2.setTransmission("CVT");
        v2.setColor("White");
        v2 = vehicleRepository.save(v2);

        Vehicle v3 = new Vehicle();
        v3.setTenantId(tenantId);
        v3.setOwnerId(c3.getId());
        v3.setLicensePlate("51G-11223");
        v3.setVin("KMHD35LH5LU200456");
        v3.setMake("Hyundai");
        v3.setModel("Tucson");
        v3.setVariant("2.0 Premium");
        v3.setYear(2021);
        v3.setMileage(42000);
        v3.setEngineType("ICE");
        v3.setFuelType("Gasoline");
        v3.setTransmission("Automatic");
        v3.setColor("Silver");
        v3 = vehicleRepository.save(v3);

        Vehicle v4 = new Vehicle();
        v4.setTenantId(tenantId);
        v4.setOwnerId(c4.getId());
        v4.setLicensePlate("29A-67890");
        v4.setVin("VFSSV8888LA000789");
        v4.setMake("VinFast");
        v4.setModel("VF8");
        v4.setVariant("Plus");
        v4.setYear(2023);
        v4.setMileage(12000);
        v4.setEngineType("EV");
        v4.setFuelType("Electric");
        v4.setTransmission("Automatic");
        v4.setColor("Blue");
        v4 = vehicleRepository.save(v4);

        Vehicle v5 = new Vehicle();
        v5.setTenantId(tenantId);
        v5.setOwnerId(c5.getId());
        v5.setLicensePlate("51C-33445");
        v5.setVin("1FTFW1E50LFA12345");
        v5.setMake("Ford");
        v5.setModel("Ranger");
        v5.setVariant("Wildtrak 2.0L Bi-Turbo");
        v5.setYear(2021);
        v5.setMileage(65000);
        v5.setEngineType("ICE");
        v5.setFuelType("Diesel");
        v5.setTransmission("Automatic");
        v5.setColor("Orange");
        v5 = vehicleRepository.save(v5);

        Vehicle v6 = new Vehicle();
        v6.setTenantId(tenantId);
        v6.setOwnerId(c6.getId());
        v6.setLicensePlate("30H-78901");
        v6.setVin("WDD2050421A234567");
        v6.setMake("Mercedes-Benz");
        v6.setModel("C200");
        v6.setVariant("Exclusive");
        v6.setYear(2022);
        v6.setMileage(28000);
        v6.setEngineType("ICE");
        v6.setFuelType("Gasoline");
        v6.setTransmission("Automatic");
        v6.setColor("Dark Blue");
        v6 = vehicleRepository.save(v6);

        Vehicle v7 = new Vehicle();
        v7.setTenantId(tenantId);
        v7.setOwnerId(c7.getId());
        v7.setLicensePlate("51F-22334");
        v7.setVin("KNAB3512ALT567890");
        v7.setMake("Kia");
        v7.setModel("Seltos");
        v7.setVariant("1.6 Turbo Premium");
        v7.setYear(2023);
        v7.setMileage(15000);
        v7.setEngineType("ICE");
        v7.setFuelType("Gasoline");
        v7.setTransmission("DCT");
        v7.setColor("Red");
        v7 = vehicleRepository.save(v7);

        Vehicle v8 = new Vehicle();
        v8.setTenantId(tenantId);
        v8.setOwnerId(c8.getId());
        v8.setLicensePlate("30K-44556");
        v8.setVin("JM3KFBDM5L0345678");
        v8.setMake("Mazda");
        v8.setModel("CX-5");
        v8.setVariant("2.0 Premium");
        v8.setYear(2022);
        v8.setMileage(31000);
        v8.setEngineType("ICE");
        v8.setFuelType("Gasoline");
        v8.setTransmission("Automatic");
        v8.setColor("Gray");
        v8 = vehicleRepository.save(v8);

        Vehicle v9 = new Vehicle();
        v9.setTenantId(tenantId);
        v9.setOwnerId(c9.getId());
        v9.setLicensePlate("51D-55667");
        v9.setVin("JTEBR3FJ5LK456789");
        v9.setMake("Toyota");
        v9.setModel("Hilux");
        v9.setVariant("2.8G AT 4x4");
        v9.setYear(2020);
        v9.setMileage(92000);
        v9.setEngineType("ICE");
        v9.setFuelType("Diesel");
        v9.setTransmission("Automatic");
        v9.setColor("White");
        v9 = vehicleRepository.save(v9);

        Vehicle v10 = new Vehicle();
        v10.setTenantId(tenantId);
        v10.setOwnerId(c9.getId());
        v10.setLicensePlate("51D-55668");
        v10.setVin("RLHFC2630MA001234");
        v10.setMake("Honda");
        v10.setModel("City");
        v10.setVariant("1.5 RS");
        v10.setYear(2023);
        v10.setMileage(8000);
        v10.setEngineType("ICE");
        v10.setFuelType("Gasoline");
        v10.setTransmission("CVT");
        v10.setColor("Red");
        v10 = vehicleRepository.save(v10);

        Vehicle v11 = new Vehicle();
        v11.setTenantId(tenantId);
        v11.setOwnerId(c10.getId());
        v11.setLicensePlate("30E-77889");
        v11.setVin("1FTEW1E55MFA56789");
        v11.setMake("Ford");
        v11.setModel("Everest");
        v11.setVariant("Titanium 2.0L");
        v11.setYear(2022);
        v11.setMileage(47000);
        v11.setEngineType("ICE");
        v11.setFuelType("Diesel");
        v11.setTransmission("Automatic");
        v11.setColor("Black");
        v11 = vehicleRepository.save(v11);

        Vehicle v12 = new Vehicle();
        v12.setTenantId(tenantId);
        v12.setOwnerId(c11.getId());
        v12.setLicensePlate("30L-99001");
        v12.setVin("KMHCT41BADU678901");
        v12.setMake("Hyundai");
        v12.setModel("Accent");
        v12.setVariant("1.4 AT");
        v12.setYear(2021);
        v12.setMileage(110000);
        v12.setEngineType("ICE");
        v12.setFuelType("Gasoline");
        v12.setTransmission("Automatic");
        v12.setColor("White");
        v12 = vehicleRepository.save(v12);

        Vehicle v13 = new Vehicle();
        v13.setTenantId(tenantId);
        v13.setOwnerId(c11.getId());
        v13.setLicensePlate("30L-99002");
        v13.setVin("JTDKN3DU7B0234567");
        v13.setMake("Toyota");
        v13.setModel("Vios");
        v13.setVariant("1.5E CVT");
        v13.setYear(2022);
        v13.setMileage(85000);
        v13.setEngineType("ICE");
        v13.setFuelType("Gasoline");
        v13.setTransmission("CVT");
        v13.setColor("Silver");
        v13 = vehicleRepository.save(v13);

        Vehicle v14 = new Vehicle();
        v14.setTenantId(tenantId);
        v14.setOwnerId(c12.getId());
        v14.setLicensePlate("51K-88112");
        v14.setVin("VFSSV9999MA001567");
        v14.setMake("VinFast");
        v14.setModel("VF5");
        v14.setVariant("Plus");
        v14.setYear(2024);
        v14.setMileage(5000);
        v14.setEngineType("EV");
        v14.setFuelType("Electric");
        v14.setTransmission("Automatic");
        v14.setColor("Green");
        v14 = vehicleRepository.save(v14);

        Vehicle v15 = new Vehicle();
        v15.setTenantId(tenantId);
        v15.setOwnerId(c12.getId());
        v15.setLicensePlate("51K-88113");
        v15.setVin("KNAB3512BLT678901");
        v15.setMake("Kia");
        v15.setModel("Morning");
        v15.setVariant("1.25 AT Luxury");
        v15.setYear(2022);
        v15.setMileage(62000);
        v15.setEngineType("ICE");
        v15.setFuelType("Gasoline");
        v15.setTransmission("Automatic");
        v15.setColor("Yellow");
        v15 = vehicleRepository.save(v15);

        // ==================== 8. SUPPLIERS (2 total) ====================
        Supplier supplier1 = new Supplier();
        supplier1.setTenantId(tenantId);
        supplier1.setName("VinaParts Distributor");
        supplier1.setContactName("Nguyen Thanh Nam");
        supplier1.setPhone("0909090909");
        supplier1.setEmail("sales@vinaparts.vn");
        supplier1.setAddress("KCN Sai Dong, Long Bien, Hanoi");
        supplier1 = supplierRepository.save(supplier1);

        Supplier supplier2 = new Supplier();
        supplier2.setTenantId(tenantId);
        supplier2.setName("Saigon Auto Parts JSC");
        supplier2.setContactName("Tran Minh Quang");
        supplier2.setPhone("0283456789");
        supplier2.setEmail("order@saigonautoparts.vn");
        supplier2.setAddress("59 Xa Lo Ha Noi, Thu Duc, HCMC");
        supplier2 = supplierRepository.save(supplier2);

        // ==================== 9. PARTS (15 total) ====================
        Part p1 = new Part();
        p1.setTenantId(tenantId);
        p1.setSku("BRK-P-F-001");
        p1.setOemNumber("04465-33470");
        p1.setName("Front Brake Pads (Ceramic)");
        p1.setBrand("Brembo");
        p1.setCategory("Brakes");
        p1.setCost(300000.0);
        p1.setSellingPrice(450000.0);
        p1.setStockQty(20);
        p1.setReservedQty(2);
        p1.setReorderPoint(5);
        p1.setLocation("Shelf A-04");
        partRepository.save(p1);

        Part p2 = new Part();
        p2.setTenantId(tenantId);
        p2.setSku("BRK-D-F-001");
        p2.setOemNumber("43512-33130");
        p2.setName("Front Brake Disc Rotor");
        p2.setBrand("Brembo");
        p2.setCategory("Brakes");
        p2.setCost(650000.0);
        p2.setSellingPrice(950000.0);
        p2.setStockQty(8);
        p2.setReservedQty(0);
        p2.setReorderPoint(3);
        p2.setLocation("Shelf A-05");
        partRepository.save(p2);

        Part p3 = new Part();
        p3.setTenantId(tenantId);
        p3.setSku("OIL-5W30-001");
        p3.setOemNumber(null);
        p3.setName("Engine Oil 5W-30 Full Synthetic (4L)");
        p3.setBrand("Castrol Edge");
        p3.setCategory("Fluids");
        p3.setCost(480000.0);
        p3.setSellingPrice(720000.0);
        p3.setStockQty(40);
        p3.setReservedQty(5);
        p3.setReorderPoint(10);
        p3.setLocation("Shelf B-01");
        partRepository.save(p3);

        Part p4 = new Part();
        p4.setTenantId(tenantId);
        p4.setSku("OIL-0W20-001");
        p4.setName("Engine Oil 0W-20 Hybrid (4L)");
        p4.setBrand("Mobil 1");
        p4.setCategory("Fluids");
        p4.setCost(550000.0);
        p4.setSellingPrice(800000.0);
        p4.setStockQty(25);
        p4.setReservedQty(0);
        p4.setReorderPoint(8);
        p4.setLocation("Shelf B-02");
        partRepository.save(p4);

        Part p5 = new Part();
        p5.setTenantId(tenantId);
        p5.setSku("FLT-OIL-001");
        p5.setOemNumber("90915-YZZE1");
        p5.setName("Oil Filter");
        p5.setBrand("Toyota OEM");
        p5.setCategory("Filters");
        p5.setCost(80000.0);
        p5.setSellingPrice(120000.0);
        p5.setStockQty(35);
        p5.setReservedQty(3);
        p5.setReorderPoint(10);
        p5.setLocation("Shelf A-02");
        partRepository.save(p5);

        Part p6 = new Part();
        p6.setTenantId(tenantId);
        p6.setSku("FLT-AIR-001");
        p6.setOemNumber("17801-21050");
        p6.setName("Air Filter Element");
        p6.setBrand("Denso");
        p6.setCategory("Filters");
        p6.setCost(120000.0);
        p6.setSellingPrice(180000.0);
        p6.setStockQty(28);
        p6.setReservedQty(0);
        p6.setReorderPoint(8);
        p6.setLocation("Shelf A-03");
        partRepository.save(p6);

        Part p7 = new Part();
        p7.setTenantId(tenantId);
        p7.setSku("FLT-CAB-001");
        p7.setOemNumber("87139-06080");
        p7.setName("Cabin Air Filter (Activated Carbon)");
        p7.setBrand("Bosch");
        p7.setCategory("Filters");
        p7.setCost(150000.0);
        p7.setSellingPrice(220000.0);
        p7.setStockQty(20);
        p7.setReservedQty(0);
        p7.setReorderPoint(5);
        p7.setLocation("Shelf A-03");
        partRepository.save(p7);

        Part p8 = new Part();
        p8.setTenantId(tenantId);
        p8.setSku("TIR-MXV5-001");
        p8.setName("Tire 215/55R17 All Season");
        p8.setBrand("Michelin Primacy");
        p8.setCategory("Tires");
        p8.setCost(2200000.0);
        p8.setSellingPrice(2800000.0);
        p8.setStockQty(16);
        p8.setReservedQty(4);
        p8.setReorderPoint(4);
        p8.setLocation("Rack T-01");
        partRepository.save(p8);

        Part p9 = new Part();
        p9.setTenantId(tenantId);
        p9.setSku("BAT-MF-001");
        p9.setName("Battery 12V 60Ah Maintenance-Free");
        p9.setBrand("GS Yuasa");
        p9.setCategory("Electrical");
        p9.setCost(1500000.0);
        p9.setSellingPrice(2100000.0);
        p9.setStockQty(6);
        p9.setReservedQty(1);
        p9.setReorderPoint(3);
        p9.setLocation("Shelf C-01");
        partRepository.save(p9);

        Part p10 = new Part();
        p10.setTenantId(tenantId);
        p10.setSku("SPK-IRD-001");
        p10.setOemNumber("90919-01253");
        p10.setName("Spark Plug Iridium");
        p10.setBrand("NGK");
        p10.setCategory("Ignition");
        p10.setCost(95000.0);
        p10.setSellingPrice(150000.0);
        p10.setStockQty(48);
        p10.setReservedQty(0);
        p10.setReorderPoint(12);
        p10.setLocation("Shelf C-02");
        partRepository.save(p10);

        Part p11 = new Part();
        p11.setTenantId(tenantId);
        p11.setSku("AC-COMP-001");
        p11.setName("A/C Compressor Assembly");
        p11.setBrand("Denso");
        p11.setCategory("Air Conditioning");
        p11.setCost(4500000.0);
        p11.setSellingPrice(6200000.0);
        p11.setStockQty(3);
        p11.setReservedQty(0);
        p11.setReorderPoint(1);
        p11.setLocation("Shelf D-01");
        partRepository.save(p11);

        Part p12 = new Part();
        p12.setTenantId(tenantId);
        p12.setSku("AC-REF-001");
        p12.setName("Refrigerant R134a (500g)");
        p12.setBrand("Honeywell");
        p12.setCategory("Air Conditioning");
        p12.setCost(180000.0);
        p12.setSellingPrice(280000.0);
        p12.setStockQty(15);
        p12.setReservedQty(0);
        p12.setReorderPoint(5);
        p12.setLocation("Shelf D-02");
        partRepository.save(p12);

        Part p13 = new Part();
        p13.setTenantId(tenantId);
        p13.setSku("WPR-BLD-001");
        p13.setName("Wiper Blade Set (Front Pair)");
        p13.setBrand("Bosch Aerofit");
        p13.setCategory("Wipers");
        p13.setCost(250000.0);
        p13.setSellingPrice(380000.0);
        p13.setStockQty(22);
        p13.setReservedQty(0);
        p13.setReorderPoint(6);
        p13.setLocation("Shelf E-01");
        partRepository.save(p13);

        Part p14 = new Part();
        p14.setTenantId(tenantId);
        p14.setSku("BLT-SERP-001");
        p14.setOemNumber("99366-H2030");
        p14.setName("Serpentine Belt");
        p14.setBrand("Gates");
        p14.setCategory("Belts");
        p14.setCost(320000.0);
        p14.setSellingPrice(480000.0);
        p14.setStockQty(10);
        p14.setReservedQty(0);
        p14.setReorderPoint(3);
        p14.setLocation("Shelf E-02");
        partRepository.save(p14);

        Part p15 = new Part();
        p15.setTenantId(tenantId);
        p15.setSku("CLN-COOL-001");
        p15.setName("Coolant Premixed (4L)");
        p15.setBrand("Toyota Super Long Life");
        p15.setCategory("Fluids");
        p15.setCost(200000.0);
        p15.setSellingPrice(320000.0);
        p15.setStockQty(18);
        p15.setReservedQty(0);
        p15.setReorderPoint(5);
        p15.setLocation("Shelf B-03");
        partRepository.save(p15);

        // ==================== 10. APPOINTMENTS (8 total) ====================
        ZoneOffset vnOffset = ZoneOffset.ofHours(7);

        Appointment apt1 = new Appointment();
        apt1.setTenantId(tenantId);
        apt1.setCustomerId(c1.getId());
        apt1.setVehicleId(v1.getId());
        apt1.setBranchId(hanoiBranch.getId());
        apt1.setAdvisorId(advisor1.getId());
        apt1.setScheduledTime(OffsetDateTime.of(2026, 8, 14, 8, 30, 0, 0, vnOffset));
        apt1.setServiceType("Periodic Maintenance");
        apt1.setStatus("CONFIRMED");
        apt1.setNotes("40,000km scheduled service. Customer requests full synthetic oil.");
        appointmentRepository.save(apt1);

        Appointment apt2 = new Appointment();
        apt2.setTenantId(tenantId);
        apt2.setCustomerId(c2.getId());
        apt2.setVehicleId(v2.getId());
        apt2.setBranchId(hanoiBranch.getId());
        apt2.setAdvisorId(advisor1.getId());
        apt2.setScheduledTime(OffsetDateTime.of(2026, 8, 14, 10, 0, 0, 0, vnOffset));
        apt2.setServiceType("Brake Inspection");
        apt2.setStatus("ARRIVED");
        apt2.setNotes("Customer reports squeaking noise from front brakes.");
        appointmentRepository.save(apt2);

        Appointment apt3 = new Appointment();
        apt3.setTenantId(tenantId);
        apt3.setCustomerId(c3.getId());
        apt3.setVehicleId(v3.getId());
        apt3.setBranchId(hcmcBranch.getId());
        apt3.setAdvisorId(advisor2.getId());
        apt3.setScheduledTime(OffsetDateTime.of(2026, 8, 15, 9, 0, 0, 0, vnOffset));
        apt3.setServiceType("A/C Repair");
        apt3.setStatus("REQUESTED");
        apt3.setNotes("A/C not cooling properly. Needs diagnosis.");
        appointmentRepository.save(apt3);

        Appointment apt4 = new Appointment();
        apt4.setTenantId(tenantId);
        apt4.setCustomerId(c4.getId());
        apt4.setVehicleId(v4.getId());
        apt4.setBranchId(hanoiBranch.getId());
        apt4.setAdvisorId(advisor1.getId());
        apt4.setScheduledTime(OffsetDateTime.of(2026, 8, 15, 14, 0, 0, 0, vnOffset));
        apt4.setServiceType("EV Battery Check");
        apt4.setStatus("CONFIRMED");
        apt4.setNotes("Routine EV battery health check at 12,000km.");
        appointmentRepository.save(apt4);

        Appointment apt5 = new Appointment();
        apt5.setTenantId(tenantId);
        apt5.setCustomerId(c6.getId());
        apt5.setVehicleId(v6.getId());
        apt5.setBranchId(hanoiBranch.getId());
        apt5.setAdvisorId(advisor1.getId());
        apt5.setScheduledTime(OffsetDateTime.of(2026, 8, 16, 8, 0, 0, 0, vnOffset));
        apt5.setServiceType("Periodic Maintenance");
        apt5.setStatus("REQUESTED");
        apt5.setNotes("30,000km service for Mercedes C200. Premium package requested.");
        appointmentRepository.save(apt5);

        Appointment apt6 = new Appointment();
        apt6.setTenantId(tenantId);
        apt6.setCustomerId(c7.getId());
        apt6.setVehicleId(v7.getId());
        apt6.setBranchId(hcmcBranch.getId());
        apt6.setAdvisorId(advisor2.getId());
        apt6.setScheduledTime(OffsetDateTime.of(2026, 8, 16, 10, 30, 0, 0, vnOffset));
        apt6.setServiceType("Tire Replacement");
        apt6.setStatus("CONFIRMED");
        apt6.setNotes("Replace all 4 tires. Customer prefers Michelin brand.");
        appointmentRepository.save(apt6);

        Appointment apt7 = new Appointment();
        apt7.setTenantId(tenantId);
        apt7.setCustomerId(c11.getId());
        apt7.setVehicleId(v12.getId());
        apt7.setBranchId(hanoiBranch.getId());
        apt7.setAdvisorId(advisor1.getId());
        apt7.setScheduledTime(OffsetDateTime.of(2026, 8, 17, 7, 30, 0, 0, vnOffset));
        apt7.setServiceType("Fleet Maintenance");
        apt7.setStatus("REQUESTED");
        apt7.setNotes("Fleet vehicle 110,000km major service. Engine oil + all filters.");
        appointmentRepository.save(apt7);

        Appointment apt8 = new Appointment();
        apt8.setTenantId(tenantId);
        apt8.setCustomerId(c5.getId());
        apt8.setVehicleId(v5.getId());
        apt8.setBranchId(hcmcBranch.getId());
        apt8.setAdvisorId(advisor2.getId());
        apt8.setScheduledTime(OffsetDateTime.of(2026, 8, 18, 9, 0, 0, 0, vnOffset));
        apt8.setServiceType("Engine Diagnosis");
        apt8.setStatus("ARRIVED");
        apt8.setNotes("Check engine light on. Intermittent rough idle at low RPM.");
        appointmentRepository.save(apt8);

        // ==================== 11. REPAIR ORDERS (5 total) ====================
        RepairOrder ro1 = new RepairOrder();
        ro1.setTenantId(tenantId);
        ro1.setRoNumber("RO-2026-0001");
        ro1.setCustomerId(c1.getId());
        ro1.setVehicleId(v1.getId());
        ro1.setBranchId(hanoiBranch.getId());
        ro1.setAdvisorId(advisor1.getId());
        ro1.setBayId(bay1.getId());
        ro1.setStatus("IN_PROGRESS");
        ro1.setMileage(35200);
        ro1.setPriority("MEDIUM");
        ro1.setPromisedTime(OffsetDateTime.of(2026, 8, 14, 17, 0, 0, 0, vnOffset));
        ro1.setNotes("Regular 40K service. Customer waiting in lounge.");
        ro1 = repairOrderRepository.save(ro1);

        RepairOrder ro2 = new RepairOrder();
        ro2.setTenantId(tenantId);
        ro2.setRoNumber("RO-2026-0002");
        ro2.setCustomerId(c2.getId());
        ro2.setVehicleId(v2.getId());
        ro2.setBranchId(hanoiBranch.getId());
        ro2.setAdvisorId(advisor1.getId());
        ro2.setBayId(bay3.getId());
        ro2.setStatus("READY_FOR_WORK");
        ro2.setMileage(18500);
        ro2.setPriority("HIGH");
        ro2.setPromisedTime(OffsetDateTime.of(2026, 8, 14, 16, 0, 0, 0, vnOffset));
        ro2.setNotes("Brake noise complaint. Needs pad and rotor inspection.");
        ro2 = repairOrderRepository.save(ro2);

        RepairOrder ro3 = new RepairOrder();
        ro3.setTenantId(tenantId);
        ro3.setRoNumber("RO-2026-0003");
        ro3.setCustomerId(c9.getId());
        ro3.setVehicleId(v9.getId());
        ro3.setBranchId(hcmcBranch.getId());
        ro3.setAdvisorId(advisor2.getId());
        ro3.setBayId(bay4.getId());
        ro3.setStatus("QUALITY_CONTROL");
        ro3.setMileage(92500);
        ro3.setPriority("MEDIUM");
        ro3.setPromisedTime(OffsetDateTime.of(2026, 8, 15, 12, 0, 0, 0, vnOffset));
        ro3.setNotes("Major service + suspension check for fleet vehicle.");
        ro3 = repairOrderRepository.save(ro3);

        RepairOrder ro4 = new RepairOrder();
        ro4.setTenantId(tenantId);
        ro4.setRoNumber("RO-2026-0004");
        ro4.setCustomerId(c6.getId());
        ro4.setVehicleId(v6.getId());
        ro4.setBranchId(hanoiBranch.getId());
        ro4.setAdvisorId(advisor1.getId());
        ro4.setBayId(null);
        ro4.setStatus("DRAFT");
        ro4.setMileage(28300);
        ro4.setPriority("LOW");
        ro4.setPromisedTime(OffsetDateTime.of(2026, 8, 16, 18, 0, 0, 0, vnOffset));
        ro4.setNotes("Scheduled maintenance. Awaiting parts confirmation.");
        ro4 = repairOrderRepository.save(ro4);

        RepairOrder ro5 = new RepairOrder();
        ro5.setTenantId(tenantId);
        ro5.setRoNumber("RO-2026-0005");
        ro5.setCustomerId(c8.getId());
        ro5.setVehicleId(v8.getId());
        ro5.setBranchId(hanoiBranch.getId());
        ro5.setAdvisorId(advisor1.getId());
        ro5.setBayId(bay2.getId());
        ro5.setStatus("DELIVERED");
        ro5.setMileage(31200);
        ro5.setPriority("MEDIUM");
        ro5.setPromisedTime(OffsetDateTime.of(2026, 8, 13, 15, 0, 0, 0, vnOffset));
        ro5.setNotes("Oil change + tire rotation completed. Customer picked up.");
        ro5 = repairOrderRepository.save(ro5);

        // ==================== 12. REPAIR JOBS ====================
        // RO1 Jobs (3 jobs - periodic maintenance)
        RepairJob job1 = new RepairJob();
        job1.setTenantId(tenantId);
        job1.setRepairOrderId(ro1.getId());
        job1.setName("Engine Oil & Filter Change");
        job1.setDescription("Drain old oil, replace oil filter, fill with Castrol Edge 5W-30 full synthetic.");
        job1.setCategory("Maintenance");
        job1.setLaborHours(0.75);
        job1.setTechnicianId(tech1.getId());
        job1.setStatus("IN_PROGRESS");
        repairJobRepository.save(job1);

        RepairJob job2 = new RepairJob();
        job2.setTenantId(tenantId);
        job2.setRepairOrderId(ro1.getId());
        job2.setName("Air Filter Replacement");
        job2.setDescription("Replace engine air filter and cabin air filter.");
        job2.setCategory("Maintenance");
        job2.setLaborHours(0.5);
        job2.setTechnicianId(tech1.getId());
        job2.setStatus("PENDING");
        repairJobRepository.save(job2);

        RepairJob job3 = new RepairJob();
        job3.setTenantId(tenantId);
        job3.setRepairOrderId(ro1.getId());
        job3.setName("Multi-Point Inspection");
        job3.setDescription("Full vehicle inspection: brakes, suspension, tires, fluids, belts, battery.");
        job3.setCategory("Inspection");
        job3.setLaborHours(1.0);
        job3.setTechnicianId(tech1.getId());
        job3.setStatus("PENDING");
        repairJobRepository.save(job3);

        // RO2 Jobs (2 jobs - brake repair)
        RepairJob job4 = new RepairJob();
        job4.setTenantId(tenantId);
        job4.setRepairOrderId(ro2.getId());
        job4.setName("Front Brake Pad Replacement");
        job4.setDescription("Remove wheels, replace front brake pads with Brembo ceramic pads, clean calipers.");
        job4.setCategory("Brakes");
        job4.setLaborHours(1.5);
        job4.setTechnicianId(null);
        job4.setStatus("PENDING");
        repairJobRepository.save(job4);

        RepairJob job5 = new RepairJob();
        job5.setTenantId(tenantId);
        job5.setRepairOrderId(ro2.getId());
        job5.setName("Brake Disc Inspection & Resurface");
        job5.setDescription("Measure rotor thickness, check for warping. Resurface or replace as needed.");
        job5.setCategory("Brakes");
        job5.setLaborHours(1.0);
        job5.setTechnicianId(null);
        job5.setStatus("PENDING");
        repairJobRepository.save(job5);

        RepairJob job6 = new RepairJob();
        job6.setTenantId(tenantId);
        job6.setRepairOrderId(ro2.getId());
        job6.setName("Brake Fluid Flush");
        job6.setDescription("Complete brake fluid flush and bleed all four corners.");
        job6.setCategory("Brakes");
        job6.setLaborHours(0.75);
        job6.setTechnicianId(null);
        job6.setStatus("PENDING");
        repairJobRepository.save(job6);

        // RO3 Jobs (3 jobs - fleet major service)
        RepairJob job7 = new RepairJob();
        job7.setTenantId(tenantId);
        job7.setRepairOrderId(ro3.getId());
        job7.setName("Engine Oil & Filter Service");
        job7.setDescription("Replace engine oil with diesel-spec 5W-30 and genuine oil filter.");
        job7.setCategory("Maintenance");
        job7.setLaborHours(0.75);
        job7.setTechnicianId(tech2.getId());
        job7.setStatus("COMPLETED");
        repairJobRepository.save(job7);

        RepairJob job8 = new RepairJob();
        job8.setTenantId(tenantId);
        job8.setRepairOrderId(ro3.getId());
        job8.setName("Front Suspension Inspection");
        job8.setDescription("Inspect ball joints, tie rod ends, bushings, and shock absorbers for wear.");
        job8.setCategory("Suspension");
        job8.setLaborHours(1.5);
        job8.setTechnicianId(tech2.getId());
        job8.setStatus("COMPLETED");
        repairJobRepository.save(job8);

        RepairJob job9 = new RepairJob();
        job9.setTenantId(tenantId);
        job9.setRepairOrderId(ro3.getId());
        job9.setName("Fuel Filter Replacement");
        job9.setDescription("Replace diesel fuel filter and prime fuel system.");
        job9.setCategory("Maintenance");
        job9.setLaborHours(0.5);
        job9.setTechnicianId(tech2.getId());
        job9.setStatus("COMPLETED");
        repairJobRepository.save(job9);

        // RO4 Jobs (2 jobs - Mercedes scheduled maintenance)
        RepairJob job10 = new RepairJob();
        job10.setTenantId(tenantId);
        job10.setRepairOrderId(ro4.getId());
        job10.setName("Service A - Oil & Filter");
        job10.setDescription("Mercedes Service A package: synthetic oil change, oil filter, fluid top-up.");
        job10.setCategory("Maintenance");
        job10.setLaborHours(1.0);
        job10.setTechnicianId(null);
        job10.setStatus("PENDING");
        repairJobRepository.save(job10);

        RepairJob job11 = new RepairJob();
        job11.setTenantId(tenantId);
        job11.setRepairOrderId(ro4.getId());
        job11.setName("Spark Plug Replacement");
        job11.setDescription("Replace all 4 spark plugs with NGK Iridium. Check ignition coils.");
        job11.setCategory("Ignition");
        job11.setLaborHours(1.25);
        job11.setTechnicianId(null);
        job11.setStatus("PENDING");
        repairJobRepository.save(job11);

        // RO5 Jobs (3 jobs - completed/delivered)
        RepairJob job12 = new RepairJob();
        job12.setTenantId(tenantId);
        job12.setRepairOrderId(ro5.getId());
        job12.setName("Engine Oil Change");
        job12.setDescription("Drain and replace with Mobil 1 0W-20 full synthetic. Replace oil filter.");
        job12.setCategory("Maintenance");
        job12.setLaborHours(0.75);
        job12.setTechnicianId(tech1.getId());
        job12.setStatus("COMPLETED");
        repairJobRepository.save(job12);

        RepairJob job13 = new RepairJob();
        job13.setTenantId(tenantId);
        job13.setRepairOrderId(ro5.getId());
        job13.setName("Tire Rotation");
        job13.setDescription("Rotate tires front-to-back, check tire pressure and tread depth.");
        job13.setCategory("Tires");
        job13.setLaborHours(0.5);
        job13.setTechnicianId(tech1.getId());
        job13.setStatus("COMPLETED");
        repairJobRepository.save(job13);

        RepairJob job14 = new RepairJob();
        job14.setTenantId(tenantId);
        job14.setRepairOrderId(ro5.getId());
        job14.setName("Wiper Blade Replacement");
        job14.setDescription("Replace front wiper blades with Bosch Aerofit set.");
        job14.setCategory("Accessories");
        job14.setLaborHours(0.25);
        job14.setTechnicianId(tech1.getId());
        job14.setStatus("COMPLETED");
        repairJobRepository.save(job14);

        // ==================== 13. ESTIMATES ====================
        // Estimate for RO1 (approved)
        Estimate est1 = new Estimate();
        est1.setTenantId(tenantId);
        est1.setRepairOrderId(ro1.getId());
        est1.setStatus("APPROVED");
        est1.setTaxRate(0.1);
        est1.setDiscountAmount(50000.0);
        est1.setTotalPrice(1782000.0);
        est1.setApprovalTimestamp(OffsetDateTime.of(2026, 8, 13, 16, 30, 0, 0, vnOffset));
        est1.setApprovalSignature("Nguyen Van Hung");
        est1 = estimateRepository.save(est1);

        EstimateItem ei1 = new EstimateItem();
        ei1.setTenantId(tenantId);
        ei1.setEstimateId(est1.getId());
        ei1.setName("Engine Oil Change - Castrol Edge 5W-30 (4L)");
        ei1.setItemType("PART");
        ei1.setQuantity(1.0);
        ei1.setUnitPrice(720000.0);
        ei1.setStatus("APPROVED");
        estimateItemRepository.save(ei1);

        EstimateItem ei2 = new EstimateItem();
        ei2.setTenantId(tenantId);
        ei2.setEstimateId(est1.getId());
        ei2.setName("Oil Filter Replacement");
        ei2.setItemType("PART");
        ei2.setQuantity(1.0);
        ei2.setUnitPrice(120000.0);
        ei2.setStatus("APPROVED");
        estimateItemRepository.save(ei2);

        EstimateItem ei3 = new EstimateItem();
        ei3.setTenantId(tenantId);
        ei3.setEstimateId(est1.getId());
        ei3.setName("Labor - Oil Service");
        ei3.setItemType("LABOR");
        ei3.setQuantity(0.75);
        ei3.setUnitPrice(350000.0);
        ei3.setStatus("APPROVED");
        estimateItemRepository.save(ei3);

        EstimateItem ei4 = new EstimateItem();
        ei4.setTenantId(tenantId);
        ei4.setEstimateId(est1.getId());
        ei4.setName("Air Filter Replacement");
        ei4.setItemType("PART");
        ei4.setQuantity(1.0);
        ei4.setUnitPrice(180000.0);
        ei4.setStatus("APPROVED");
        estimateItemRepository.save(ei4);

        EstimateItem ei5 = new EstimateItem();
        ei5.setTenantId(tenantId);
        ei5.setEstimateId(est1.getId());
        ei5.setName("Cabin Air Filter Replacement");
        ei5.setItemType("PART");
        ei5.setQuantity(1.0);
        ei5.setUnitPrice(220000.0);
        ei5.setStatus("DECLINED");
        estimateItemRepository.save(ei5);

        // Estimate for RO2 (sent - awaiting approval)
        Estimate est2 = new Estimate();
        est2.setTenantId(tenantId);
        est2.setRepairOrderId(ro2.getId());
        est2.setStatus("SENT");
        est2.setTaxRate(0.1);
        est2.setDiscountAmount(0.0);
        est2.setTotalPrice(4235000.0);
        est2 = estimateRepository.save(est2);

        EstimateItem ei6 = new EstimateItem();
        ei6.setTenantId(tenantId);
        ei6.setEstimateId(est2.getId());
        ei6.setName("Front Brake Pads (Brembo Ceramic)");
        ei6.setItemType("PART");
        ei6.setQuantity(1.0);
        ei6.setUnitPrice(450000.0);
        ei6.setStatus("PENDING");
        estimateItemRepository.save(ei6);

        EstimateItem ei7 = new EstimateItem();
        ei7.setTenantId(tenantId);
        ei7.setEstimateId(est2.getId());
        ei7.setName("Front Brake Disc Rotor (pair)");
        ei7.setItemType("PART");
        ei7.setQuantity(2.0);
        ei7.setUnitPrice(950000.0);
        ei7.setStatus("PENDING");
        estimateItemRepository.save(ei7);

        EstimateItem ei8 = new EstimateItem();
        ei8.setTenantId(tenantId);
        ei8.setEstimateId(est2.getId());
        ei8.setName("Labor - Brake Pad & Rotor Replacement");
        ei8.setItemType("LABOR");
        ei8.setQuantity(1.5);
        ei8.setUnitPrice(450000.0);
        ei8.setStatus("PENDING");
        estimateItemRepository.save(ei8);

        EstimateItem ei9 = new EstimateItem();
        ei9.setTenantId(tenantId);
        ei9.setEstimateId(est2.getId());
        ei9.setName("Brake Fluid Flush");
        ei9.setItemType("LABOR");
        ei9.setQuantity(0.75);
        ei9.setUnitPrice(280000.0);
        ei9.setStatus("PENDING");
        estimateItemRepository.save(ei9);

        // Estimate for RO3 (partially approved)
        Estimate est3 = new Estimate();
        est3.setTenantId(tenantId);
        est3.setRepairOrderId(ro3.getId());
        est3.setStatus("PARTIALLY_APPROVED");
        est3.setTaxRate(0.1);
        est3.setDiscountAmount(100000.0);
        est3.setTotalPrice(2860000.0);
        est3.setApprovalTimestamp(OffsetDateTime.of(2026, 8, 12, 14, 0, 0, 0, vnOffset));
        est3.setApprovalSignature("Cong ty TNHH Phuong Nam Trading");
        est3 = estimateRepository.save(est3);

        EstimateItem ei10 = new EstimateItem();
        ei10.setTenantId(tenantId);
        ei10.setEstimateId(est3.getId());
        ei10.setName("Engine Oil Service (Diesel Spec 5W-30)");
        ei10.setItemType("LABOR");
        ei10.setQuantity(0.75);
        ei10.setUnitPrice(400000.0);
        ei10.setStatus("APPROVED");
        estimateItemRepository.save(ei10);

        EstimateItem ei11 = new EstimateItem();
        ei11.setTenantId(tenantId);
        ei11.setEstimateId(est3.getId());
        ei11.setName("Front Suspension Ball Joint Replacement");
        ei11.setItemType("LABOR");
        ei11.setQuantity(2.0);
        ei11.setUnitPrice(650000.0);
        ei11.setStatus("APPROVED");
        estimateItemRepository.save(ei11);

        EstimateItem ei12 = new EstimateItem();
        ei12.setTenantId(tenantId);
        ei12.setEstimateId(est3.getId());
        ei12.setName("Rear Shock Absorber Replacement (pair)");
        ei12.setItemType("PART");
        ei12.setQuantity(2.0);
        ei12.setUnitPrice(1200000.0);
        ei12.setStatus("DECLINED");
        estimateItemRepository.save(ei12);

        EstimateItem ei13 = new EstimateItem();
        ei13.setTenantId(tenantId);
        ei13.setEstimateId(est3.getId());
        ei13.setName("Fuel Filter Replacement");
        ei13.setItemType("PART");
        ei13.setQuantity(1.0);
        ei13.setUnitPrice(280000.0);
        ei13.setStatus("APPROVED");
        estimateItemRepository.save(ei13);

        TenantContext.clear();
        log.info("Demo data seeding completed successfully. Created: 2 branches, 5 bays, 5 users, 12 customers, 15 vehicles, 2 suppliers, 15 parts, 8 appointments, 5 repair orders, 14 jobs, 3 estimates with 13 items.");
    }
}
