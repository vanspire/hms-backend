"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/modules/payment/strategies/cash-payment.service.ts
var CashPaymentService;
var init_cash_payment_service = __esm({
  "src/modules/payment/strategies/cash-payment.service.ts"() {
    "use strict";
    CashPaymentService = class {
      async createPayment(amount, metadata) {
        return {
          success: true,
          transactionId: `CASH-${Date.now()}`,
          amount,
          status: "SUCCESS",
          message: "Cash payment recorded"
        };
      }
      async verifyPayment(transactionId) {
        return true;
      }
      async refundPayment(transactionId) {
        return true;
      }
    };
  }
});

// src/modules/payment/strategies/stripe-payment.service.ts
var StripePaymentService;
var init_stripe_payment_service = __esm({
  "src/modules/payment/strategies/stripe-payment.service.ts"() {
    "use strict";
    StripePaymentService = class {
      // In a real app, initialize Stripe SDK here
      // private stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      async createPayment(amount, metadata) {
        return {
          success: true,
          transactionId: `STRIPE-MOCK-${Date.now()}`,
          clientSecret: "pi_3Jxxxxxxx_secret_xxxxx",
          url: "https://checkout.stripe.com/pay/cs_test_xxx",
          amount,
          status: "PENDING"
        };
      }
      async verifyPayment(transactionId) {
        return true;
      }
      async refundPayment(transactionId) {
        return true;
      }
    };
  }
});

// src/modules/payment/strategies/upi-payment.service.ts
var UpiPaymentService;
var init_upi_payment_service = __esm({
  "src/modules/payment/strategies/upi-payment.service.ts"() {
    "use strict";
    UpiPaymentService = class {
      // E.g., Razorpay, PhonePe, Paytm implementations
      async createPayment(amount, metadata) {
        return {
          success: true,
          transactionId: `UPI-MOCK-${Date.now()}`,
          upiId: "hospital@upi",
          qrData: `upi://pay?pa=hospital@upi&pn=EnterpriseHMS&am=${amount}&cu=INR`,
          amount,
          status: "PENDING"
        };
      }
      async verifyPayment(transactionId) {
        return true;
      }
      async refundPayment(transactionId) {
        return true;
      }
    };
  }
});

// src/modules/payment/payment.factory.ts
var payment_factory_exports = {};
__export(payment_factory_exports, {
  PaymentStrategyFactory: () => PaymentStrategyFactory
});
var PaymentStrategyFactory;
var init_payment_factory = __esm({
  "src/modules/payment/payment.factory.ts"() {
    "use strict";
    init_cash_payment_service();
    init_stripe_payment_service();
    init_upi_payment_service();
    PaymentStrategyFactory = class {
      static getProvider(mode) {
        switch (mode) {
          case "CASH":
            return new CashPaymentService();
          case "STRIPE":
            return new StripePaymentService();
          case "UPI":
            return new UpiPaymentService();
          default:
            throw new Error(`Unsupported payment mode: ${mode}`);
        }
      }
    };
  }
});

// src/index.ts
var import_express15 = __toESM(require("express"));
var import_cors = __toESM(require("cors"));
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_dotenv = __toESM(require("dotenv"));
var import_helmet = __toESM(require("helmet"));
var import_express_rate_limit = __toESM(require("express-rate-limit"));
var import_path2 = __toESM(require("path"));

// src/utils/jwt.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var JWT_SECRET = process.env.JWT_SECRET || "secret";
var generateToken = (payload) => {
  return import_jsonwebtoken.default.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};
var verifyToken = (token) => {
  try {
    return import_jsonwebtoken.default.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// src/middlewares/auth.middleware.ts
var authenticate = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized: No token provided" });
    return;
  }
  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
  req.user = decoded;
  next();
};
var requireRoles = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: "Forbidden: Insufficient permissions" });
      return;
    }
    next();
  };
};

// src/utils/upload.ts
var import_multer = __toESM(require("multer"));
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var uploadDir = import_path.default.join(__dirname, "../../uploads");
if (!import_fs.default.existsSync(uploadDir)) {
  import_fs.default.mkdirSync(uploadDir, { recursive: true });
}
var storage = import_multer.default.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + import_path.default.extname(file.originalname));
  }
});
var upload = (0, import_multer.default)({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }
  // 10MB limit
});

// src/modules/auth/auth.routes.ts
var import_express = require("express");

// src/config/prisma.ts
var import_client = require("@prisma/client");
var prisma = new import_client.PrismaClient();

// src/modules/auth/auth.repository.ts
var import_client2 = require("@prisma/client");
var AuthRepository = class {
  async findUserByUsername(username) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        adminProfile: true,
        doctorProfile: true,
        receptionist: true
      }
    });
  }
  async checkSuperAdminExists() {
    const count = await prisma.user.count({
      where: { role: import_client2.Role.SUPERADMIN }
    });
    console.log("SUPERADMIN COUNT: ", count);
    return count > 0;
  }
  async createSuperAdmin(data) {
    return prisma.user.create({
      data
    });
  }
  async createOrganization(data) {
    return prisma.organization.create({ data });
  }
};

// src/utils/hash.ts
var import_bcryptjs = __toESM(require("bcryptjs"));
var SALT_ROUNDS = 10;
var hashPassword = async (password) => {
  return import_bcryptjs.default.hash(password, SALT_ROUNDS);
};
var comparePassword = async (password, hash) => {
  return import_bcryptjs.default.compare(password, hash);
};

// src/modules/auth/auth.service.ts
var import_client3 = require("@prisma/client");
var AuthService = class {
  repository = new AuthRepository();
  async login(data) {
    const user = await this.repository.findUserByUsername(data.username);
    if (!user || !await comparePassword(data.password, user.passwordHash)) {
      throw new Error("Invalid credentials");
    }
    if (!user.isActive) {
      throw new Error("Account disabled");
    }
    const payload = { userId: user.id, role: user.role };
    const token = generateToken(payload);
    const resultUser = { id: user.id, username: user.username, role: user.role };
    if (user.role === import_client3.Role.ADMIN) {
      const adminProfile = user.adminProfile;
      resultUser.permissions = adminProfile?.permissions ? adminProfile.permissions : [];
    }
    return { user: resultUser, token };
  }
  async checkSetupRequired() {
    const superAdminExists = await this.repository.checkSuperAdminExists();
    console.log("SUPERADMIN EXISTS: ", superAdminExists);
    return !superAdminExists;
  }
  async setupSystem(data) {
    const isSetupRequired = await this.checkSetupRequired();
    if (!isSetupRequired) {
      throw new Error("System is already configured");
    }
    const passwordHash = await hashPassword(data.superAdminPassword);
    const superAdmin = await this.repository.createSuperAdmin({
      username: data.superAdminUsername,
      passwordHash,
      role: import_client3.Role.SUPERADMIN,
      isActive: true
    });
    const organization = await this.repository.createOrganization({
      organizationName: data.organizationName,
      timezone: data.timezone,
      currency: data.currency,
      logoUrl: data.logoUrl
    });
    return {
      message: "Setup completed successfully",
      superAdmin: { id: superAdmin.id, username: superAdmin.username },
      organization
    };
  }
};

// src/modules/auth/auth.dto.ts
var import_zod = require("zod");
var LoginDto = import_zod.z.object({
  username: import_zod.z.string().min(1, "Username is required"),
  password: import_zod.z.string().min(1, "Password is required")
});
var SetupDto = import_zod.z.object({
  organizationName: import_zod.z.string().min(1, "Organization Name is required"),
  superAdminUsername: import_zod.z.string().min(3, "Username must be at least 3 characters"),
  superAdminPassword: import_zod.z.string().min(6, "Password must be at least 6 characters"),
  timezone: import_zod.z.string(),
  currency: import_zod.z.string(),
  logoUrl: import_zod.z.string().optional()
});

// src/modules/auth/auth.controller.ts
var AuthController = class {
  service = new AuthService();
  login = async (req, res) => {
    try {
      const data = LoginDto.parse(req.body);
      const result = await this.service.login(data);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1e3
        // 1 day
      });
      res.status(200).json({ message: "Login successful", user: result.user });
    } catch (error) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  };
  logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logged out successfully" });
  };
  checkSetup = async (req, res) => {
    try {
      const isRequired = await this.service.checkSetupRequired();
      res.status(200).json({ setupRequired: isRequired });
    } catch (error) {
      res.status(500).json({ message: "Error checking setup status", error });
    }
  };
  setup = async (req, res) => {
    try {
      const data = SetupDto.parse(req.body);
      const result = await this.service.setupSystem(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message || "Setup failed" });
    }
  };
  me = async (req, res) => {
    if (!req.user) {
      res.status(401).json({ message: "Not authenticated" });
      return;
    }
    res.status(200).json({ user: req.user });
  };
};

// src/modules/auth/auth.routes.ts
var router = (0, import_express.Router)();
var controller = new AuthController();
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.get("/setup-status", controller.checkSetup);
router.post("/setup", controller.setup);
router.get("/me", authenticate, controller.me);
var auth_routes_default = router;

// src/modules/admin/admin.routes.ts
var import_express2 = require("express");

// src/modules/admin/admin.repository.ts
var import_client4 = require("@prisma/client");
var AdminRepository = class {
  async getAllAdmins() {
    return prisma.user.findMany({
      where: { role: import_client4.Role.ADMIN },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        username: true,
        isActive: true,
        createdAt: true,
        adminProfile: true
        // we want to see their profile & permissions
      }
    });
  }
  async getAdminById(id) {
    return prisma.user.findUnique({
      where: { id, role: import_client4.Role.ADMIN },
      include: { adminProfile: true }
    });
  }
  async createAdmin(userData, profileData) {
    return prisma.user.create({
      data: {
        ...userData,
        adminProfile: {
          create: profileData
        }
      },
      include: { adminProfile: true }
    });
  }
  async updateAdmin(id, data) {
    return prisma.$transaction(async (tx) => {
      const { isActive, name, phone, permissions } = data;
      let userUpdateArgs = {};
      if (isActive !== void 0) userUpdateArgs.isActive = isActive;
      if (Object.keys(userUpdateArgs).length > 0) {
        await tx.user.update({
          where: { id },
          data: userUpdateArgs
        });
      }
      let profileUpdateArgs = {};
      if (name !== void 0) profileUpdateArgs.name = name;
      if (phone !== void 0) profileUpdateArgs.phone = phone;
      if (permissions !== void 0) profileUpdateArgs.permissions = permissions;
      if (Object.keys(profileUpdateArgs).length > 0) {
        await tx.adminProfile.update({
          where: { userId: id },
          data: profileUpdateArgs
        });
      }
      return tx.user.findUnique({
        where: { id },
        include: { adminProfile: true }
      });
    });
  }
  async deleteAdmin(id) {
    await prisma.adminProfile.delete({ where: { userId: id } });
    return prisma.user.delete({ where: { id } });
  }
  async getDashboardStats() {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const [
      totalDoctors,
      totalPatients,
      todayAppointments,
      recentDoctors,
      recentPatients,
      recentPayments
    ] = await Promise.all([
      prisma.user.count({ where: { role: import_client4.Role.DOCTOR, isActive: true } }),
      prisma.user.count({ where: { role: import_client4.Role.PATIENT } }),
      prisma.appointment.count({
        where: {
          // Appointments from today onwards (simple filter, assuming 'date' is string ISO or DateTime)
          createdAt: { gte: today }
        }
      }),
      prisma.user.findMany({
        where: { role: import_client4.Role.DOCTOR },
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          doctorProfile: {
            include: { department: true }
          }
        }
      }),
      prisma.user.findMany({
        where: { role: import_client4.Role.PATIENT },
        orderBy: { createdAt: "desc" },
        take: 5
        // Note: Patient profile data is stored directly on User or in external relational tables if added, but no explicit `patientProfile` exists in this schema.
      }),
      // Get recent payments to calculate revenue
      prisma.payment.findMany({
        where: { status: "COMPLETED" },
        orderBy: { paymentDate: "desc" },
        take: 100,
        // Fetch last 100 to aggregate
        select: { amount: true, paymentDate: true }
      })
    ]);
    const formattedRevenue = recentPayments.reduce((acc, curr) => {
      const dateStr = curr.paymentDate.toISOString().split("T")[0];
      acc[dateStr] = (acc[dateStr] || 0) + curr.amount;
      return acc;
    }, {});
    const mappedRevenue = Object.entries(formattedRevenue).map(([date, amount]) => ({
      name: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: amount
    })).reverse().slice(0, 7);
    return {
      counts: {
        doctors: totalDoctors,
        patients: totalPatients,
        appointmentsToday: todayAppointments
      },
      recentDoctors,
      recentPatients,
      revenueChart: mappedRevenue.length > 0 ? mappedRevenue : [
        { name: "Mon", revenue: 0 },
        { name: "Tue", revenue: 0 },
        { name: "Wed", revenue: 0 },
        { name: "Thu", revenue: 0 },
        { name: "Fri", revenue: 0 }
      ]
    };
  }
  async getMedicines(includeInactive = false) {
    return prisma.medicine.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ medicineName: "asc" }, { createdAt: "desc" }]
    });
  }
  async createMedicine(data) {
    return prisma.medicine.create({ data });
  }
  async updateMedicine(id, data) {
    return prisma.medicine.update({
      where: { id },
      data
    });
  }
};

// src/modules/admin/admin.service.ts
var import_client5 = require("@prisma/client");
var AdminService = class {
  repository = new AdminRepository();
  async getAllAdmins() {
    return this.repository.getAllAdmins();
  }
  async getAdminById(id) {
    return this.repository.getAdminById(id);
  }
  async createAdmin(data) {
    const passwordHash = await hashPassword(data.password);
    return this.repository.createAdmin(
      {
        username: data.username,
        passwordHash,
        role: import_client5.Role.ADMIN
      },
      {
        name: data.name,
        phone: data.phone,
        permissions: data.permissions
      }
    );
  }
  async updateAdmin(id, data) {
    return this.repository.updateAdmin(id, {
      isActive: data.isActive,
      name: data.name,
      phone: data.phone,
      permissions: data.permissions
    });
  }
  async deleteAdmin(id) {
    return this.repository.deleteAdmin(id);
  }
  async getDashboardStats() {
    return this.repository.getDashboardStats();
  }
  async getMedicines(includeInactive = false) {
    return this.repository.getMedicines(includeInactive);
  }
  async createMedicine(data) {
    return this.repository.createMedicine(data);
  }
  async updateMedicine(id, data) {
    return this.repository.updateMedicine(id, data);
  }
  async deactivateMedicine(id) {
    return this.repository.updateMedicine(id, { isActive: false });
  }
};

// src/modules/admin/admin.dto.ts
var import_zod2 = require("zod");
var CreateAdminDto = import_zod2.z.object({
  username: import_zod2.z.string().min(3),
  password: import_zod2.z.string().min(6),
  name: import_zod2.z.string().min(1),
  phone: import_zod2.z.string().optional(),
  permissions: import_zod2.z.array(import_zod2.z.string()).default([])
  // array of allowed module names
});
var UpdateAdminDto = import_zod2.z.object({
  name: import_zod2.z.string().optional(),
  phone: import_zod2.z.string().optional(),
  permissions: import_zod2.z.array(import_zod2.z.string()).optional(),
  isActive: import_zod2.z.boolean().optional()
});
var CreateMedicineDto = import_zod2.z.object({
  medicineName: import_zod2.z.string().min(1),
  brand: import_zod2.z.string().min(1)
});
var UpdateMedicineDto = import_zod2.z.object({
  medicineName: import_zod2.z.string().min(1).optional(),
  brand: import_zod2.z.string().min(1).optional(),
  isActive: import_zod2.z.boolean().optional()
});

// src/modules/admin/admin.controller.ts
var AdminController = class {
  service = new AdminService();
  getDashboard = async (req, res) => {
    try {
      const stats = await this.service.getDashboardStats();
      res.status(200).json({ data: stats });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch dashboard stats" });
    }
  };
  getAll = async (req, res) => {
    try {
      const admins = await this.service.getAllAdmins();
      res.status(200).json({ data: admins });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch admins" });
    }
  };
  getById = async (req, res) => {
    try {
      const adminId = String(req.params.id);
      const admin = await this.service.getAdminById(adminId);
      if (!admin) {
        res.status(404).json({ message: "Admin not found" });
        return;
      }
      res.status(200).json({ data: admin });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  create = async (req, res) => {
    try {
      const data = CreateAdminDto.parse(req.body);
      const admin = await this.service.createAdmin(data);
      res.status(201).json({ message: "Admin created", data: admin });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create admin" });
    }
  };
  update = async (req, res) => {
    try {
      const adminId = String(req.params.id);
      const data = UpdateAdminDto.parse(req.body);
      const updated = await this.service.updateAdmin(adminId, data);
      res.status(200).json({ message: "Admin updated", data: updated });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update admin" });
    }
  };
  delete = async (req, res) => {
    try {
      const adminId = String(req.params.id);
      await this.service.deleteAdmin(adminId);
      res.status(200).json({ message: "Admin deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to delete admin" });
    }
  };
  getMedicines = async (req, res) => {
    try {
      const includeInactive = String(req.query.includeInactive || "false") === "true";
      const data = await this.service.getMedicines(includeInactive);
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch medicines" });
    }
  };
  createMedicine = async (req, res) => {
    try {
      const payload = CreateMedicineDto.parse(req.body);
      const data = await this.service.createMedicine(payload);
      res.status(201).json({ message: "Medicine created successfully", data });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create medicine" });
    }
  };
  updateMedicine = async (req, res) => {
    try {
      const id = String(req.params.id);
      const payload = UpdateMedicineDto.parse(req.body);
      const data = await this.service.updateMedicine(id, payload);
      res.status(200).json({ message: "Medicine updated successfully", data });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update medicine" });
    }
  };
  deactivateMedicine = async (req, res) => {
    try {
      const id = String(req.params.id);
      const data = await this.service.deactivateMedicine(id);
      res.status(200).json({ message: "Medicine deactivated successfully", data });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to deactivate medicine" });
    }
  };
};

// src/modules/admin/admin.routes.ts
var import_client6 = require("@prisma/client");
var router2 = (0, import_express2.Router)();
var controller2 = new AdminController();
router2.get("/dashboard", authenticate, requireRoles([import_client6.Role.ADMIN, import_client6.Role.SUPERADMIN]), controller2.getDashboard);
router2.get("/medicines", authenticate, requireRoles([import_client6.Role.ADMIN, import_client6.Role.SUPERADMIN]), controller2.getMedicines);
router2.post("/medicines", authenticate, requireRoles([import_client6.Role.ADMIN, import_client6.Role.SUPERADMIN]), controller2.createMedicine);
router2.put("/medicines/:id", authenticate, requireRoles([import_client6.Role.ADMIN, import_client6.Role.SUPERADMIN]), controller2.updateMedicine);
router2.patch("/medicines/:id/deactivate", authenticate, requireRoles([import_client6.Role.ADMIN, import_client6.Role.SUPERADMIN]), controller2.deactivateMedicine);
router2.use(authenticate, requireRoles([import_client6.Role.SUPERADMIN]));
router2.get("/", controller2.getAll);
router2.post("/", controller2.create);
router2.get("/:id", controller2.getById);
router2.put("/:id", controller2.update);
router2.delete("/:id", controller2.delete);
var admin_routes_default = router2;

// src/modules/doctor/doctor.routes.ts
var import_express3 = require("express");

// src/modules/doctor/doctor.repository.ts
var DoctorRepository = class {
  async createDoctor(data, profileData) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });
      const { departmentId, ...restProfileData } = profileData;
      const profile = await tx.doctorProfile.create({
        data: {
          ...restProfileData,
          department: { connect: { id: departmentId } },
          user: { connect: { id: user.id } }
        }
      });
      return { user, profile };
    });
  }
  async getAllDoctors() {
    return prisma.doctorProfile.findMany({
      include: {
        user: { select: { username: true, isActive: true } },
        department: true
      }
    });
  }
  async getDoctorById(id) {
    return prisma.doctorProfile.findUnique({
      where: { id },
      include: {
        user: { select: { username: true, isActive: true } },
        department: true
      }
    });
  }
};

// src/modules/doctor/doctor.service.ts
var import_client7 = require("@prisma/client");
var DoctorService = class {
  repository = new DoctorRepository();
  async createDoctor(data) {
    const passwordHash = await hashPassword(data.password);
    const userData = {
      username: data.username,
      passwordHash,
      role: import_client7.Role.DOCTOR,
      isActive: true
    };
    const profileData = {
      name: data.name,
      departmentId: data.departmentId,
      phone: data.phone,
      consultationFee: data.consultationFee,
      incrementIntervalDays: data.incrementIntervalDays,
      renewalCharge: data.renewalCharge
    };
    return this.repository.createDoctor(userData, profileData);
  }
  async getAllDoctors() {
    return this.repository.getAllDoctors();
  }
  async getDoctorById(id) {
    return this.repository.getDoctorById(id);
  }
};

// src/modules/doctor/doctor.dto.ts
var import_zod3 = require("zod");
var CreateDoctorDto = import_zod3.z.object({
  name: import_zod3.z.string().min(1, "Name is required"),
  departmentId: import_zod3.z.string().uuid("Invalid department ID pattern"),
  phone: import_zod3.z.string().max(10, "Phone must be max 10 digits").regex(/^\d+$/, "Must be numeric"),
  username: import_zod3.z.string().min(4, "Username must be at least 4 characters"),
  password: import_zod3.z.string().min(6, "Password must be at least 6 characters"),
  consultationFee: import_zod3.z.number().max(1e4, "Fee cannot exceed 10000"),
  incrementIntervalDays: import_zod3.z.number().max(365, "Interval cannot exceed 365 days"),
  renewalCharge: import_zod3.z.number().max(5e3, "Renewal charge cannot exceed 5000")
});
var UpdateDoctorDto = import_zod3.z.object({
  name: import_zod3.z.string().min(1, "Name is required").optional(),
  departmentId: import_zod3.z.string().uuid("Invalid department ID pattern").optional(),
  phone: import_zod3.z.string().max(10, "Phone must be max 10 digits").regex(/^\d+$/, "Must be numeric").optional(),
  consultationFee: import_zod3.z.number().max(1e4, "Fee cannot exceed 10000").optional(),
  incrementIntervalDays: import_zod3.z.number().max(365, "Interval cannot exceed 365 days").optional(),
  renewalCharge: import_zod3.z.number().max(5e3, "Renewal charge cannot exceed 5000").optional()
});

// src/modules/doctor/doctor.controller.ts
var DoctorController = class {
  service = new DoctorService();
  create = async (req, res) => {
    try {
      const data = CreateDoctorDto.parse(req.body);
      const result = await this.service.createDoctor(data);
      res.status(201).json({ message: "Doctor created successfully", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create doctor" });
    }
  };
  getAll = async (req, res) => {
    try {
      const doctors = await this.service.getAllDoctors();
      res.status(200).json({ data: doctors });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctors" });
    }
  };
  getById = async (req, res) => {
    try {
      const id = req.params.id;
      const doctor = await this.service.getDoctorById(id);
      if (!doctor) {
        res.status(404).json({ message: "Doctor not found" });
        return;
      }
      res.status(200).json({ data: doctor });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch doctor" });
    }
  };
};

// src/modules/doctor/doctor.routes.ts
var import_client8 = require("@prisma/client");
var router3 = (0, import_express3.Router)();
var controller3 = new DoctorController();
router3.post("/", authenticate, requireRoles([import_client8.Role.SUPERADMIN, import_client8.Role.ADMIN]), controller3.create);
router3.get("/", authenticate, controller3.getAll);
router3.get("/:id", authenticate, controller3.getById);
var doctor_routes_default = router3;

// src/modules/receptionist/receptionist.routes.ts
var import_express4 = require("express");

// src/modules/receptionist/receptionist.repository.ts
var ReceptionistRepository = class {
  async createReceptionist(data, profileData) {
    return prisma.$transaction(async (tx) => {
      const user = await tx.user.create({ data });
      const profile = await tx.receptionistProfile.create({
        data: {
          ...profileData,
          user: { connect: { id: user.id } }
        }
      });
      return { user, profile };
    });
  }
  async getAllReceptionists() {
    return prisma.receptionistProfile.findMany({
      include: { user: { select: { username: true, isActive: true } } }
    });
  }
};

// src/modules/receptionist/receptionist.service.ts
var import_client9 = require("@prisma/client");
var ReceptionistService = class {
  repository = new ReceptionistRepository();
  async createReceptionist(data) {
    const passwordHash = await hashPassword(data.password);
    return this.repository.createReceptionist(
      { username: data.username, passwordHash, role: import_client9.Role.RECEPTIONIST, isActive: true },
      { name: data.name, phone: data.phone }
    );
  }
  async getAllReceptionists() {
    return this.repository.getAllReceptionists();
  }
};

// src/modules/receptionist/receptionist.dto.ts
var import_zod4 = require("zod");
var CreateReceptionistDto = import_zod4.z.object({
  name: import_zod4.z.string().min(1, "Name is required"),
  phone: import_zod4.z.string().max(10, "Phone must be max 10 digits").regex(/^\d+$/, "Must be numeric"),
  username: import_zod4.z.string().min(4, "Username must be at least 4 characters"),
  password: import_zod4.z.string().min(6, "Password must be at least 6 characters")
});

// src/modules/receptionist/receptionist.controller.ts
var ReceptionistController = class {
  service = new ReceptionistService();
  getAll = async (req, res) => {
    try {
      const receptionists = await this.service.getAllReceptionists();
      res.status(200).json({ data: receptionists });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch receptionists" });
    }
  };
  create = async (req, res) => {
    try {
      const data = CreateReceptionistDto.parse(req.body);
      const receptionist = await this.service.createReceptionist(data);
      res.status(201).json({ message: "Receptionist created", data: receptionist });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create receptionist" });
    }
  };
};

// src/modules/receptionist/receptionist.routes.ts
var import_client10 = require("@prisma/client");
var router4 = (0, import_express4.Router)();
var controller4 = new ReceptionistController();
router4.post("/", authenticate, requireRoles([import_client10.Role.SUPERADMIN, import_client10.Role.ADMIN]), controller4.create);
router4.get("/", authenticate, controller4.getAll);
var receptionist_routes_default = router4;

// src/modules/patient/patient.routes.ts
var import_express5 = require("express");

// src/modules/patient/patient.repository.ts
var PatientRepository = class {
  async createPatient(data) {
    return prisma.patient.create({ data });
  }
  async getAllPatients(search) {
    const where = search ? {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { uhid: { contains: search, mode: "insensitive" } },
        { contactNo: { contains: search, mode: "insensitive" } }
      ]
    } : {};
    return prisma.patient.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        uhid: true,
        name: true,
        age: true,
        gender: true,
        contactNo: true,
        alternateContact: true,
        email: true,
        registrationPaymentStatus: true,
        createdAt: true
      }
    });
  }
  async getPatientById(id) {
    return prisma.patient.findFirst({
      where: {
        OR: [
          { id },
          { uhid: id }
        ]
      },
      include: {
        appointments: {
          include: { doctor: true, slot: true },
          orderBy: { createdAt: "desc" }
        },
        prescriptions: true,
        medicalReports: true,
        medicalHistory: true
      }
    });
  }
  async updatePatient(id, data) {
    const {
      name,
      firstName,
      lastName,
      dob,
      gender,
      registrationDate,
      address,
      contactNo,
      alternateContact,
      email,
      houseNumber,
      houseName,
      houseAddress,
      localArea,
      street,
      city,
      state,
      pincode,
      guardianName,
      guardianRelation,
      guardianContact,
      guardianComment,
      guardianAddress,
      referredDoctor,
      referredHospital,
      idProofType,
      idProofDetail
    } = data;
    return prisma.patient.update({
      where: { id },
      data: {
        name,
        firstName,
        lastName,
        dob: dob ? new Date(dob) : void 0,
        gender,
        registrationDate: registrationDate ? new Date(registrationDate) : void 0,
        address,
        contactNo,
        alternateContact,
        email,
        houseNumber,
        houseName,
        houseAddress,
        localArea,
        street,
        city,
        state,
        pincode,
        guardianName,
        guardianRelation,
        guardianContact,
        guardianComment,
        guardianAddress,
        referredDoctor,
        referredHospital,
        idProofType,
        idProofDetail
      }
    });
  }
  async deletePatient(id) {
    await prisma.appointment.updateMany({
      where: { patientId: id },
      data: { status: "CANCELLED" }
    });
    return prisma.patient.delete({ where: { id } });
  }
  async getPatientMedicalHistory(patientId) {
    return prisma.patientMedicalHistory.findUnique({
      where: { patientId }
    });
  }
  async upsertPatientMedicalHistory(patientId, data) {
    return prisma.patientMedicalHistory.upsert({
      where: { patientId },
      update: data,
      create: {
        patientId,
        ...data
      }
    });
  }
  getPatientByUserId(userId) {
    return prisma.patient.findUnique({ where: { userId } });
  }
  updateRegistrationPaymentStatus(id) {
    return prisma.patient.update({
      where: { id },
      data: { registrationPaymentStatus: "PAID" }
    });
  }
};

// src/modules/patient/patient.service.ts
var import_client11 = require("@prisma/client");
var PatientService = class {
  repository = new PatientRepository();
  generateUHID() {
    const randomNum = Math.floor(1e5 + Math.random() * 9e5);
    return `IP-${randomNum}`;
  }
  async registerPatient(data) {
    const uhid = this.generateUHID();
    return this.repository.createPatient({
      uhid,
      name: data.name,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      age: data.age,
      dob: data.dob ? new Date(data.dob) : void 0,
      gender: data.gender,
      registrationDate: data.registrationDate ? new Date(data.registrationDate) : /* @__PURE__ */ new Date(),
      // Structured address
      houseNumber: data.houseNumber || null,
      houseName: data.houseName || null,
      houseAddress: data.houseAddress || null,
      localArea: data.localArea || null,
      street: data.street || null,
      city: data.city || null,
      state: data.state || null,
      pincode: data.pincode || null,
      // Combined address
      address: data.address,
      contactNo: data.contactNo,
      alternateContact: data.alternateContact || null,
      email: data.email,
      // Guardian
      guardianName: data.guardianName,
      guardianRelation: data.guardianRelation,
      guardianContact: data.guardianContact,
      guardianComment: data.guardianComment || null,
      guardianAddress: data.guardianAddress || null,
      // Referral
      referredDoctor: data.referredDoctor || null,
      referredHospital: data.referredHospital || null,
      // ID proof
      idProofType: data.idProofType || null,
      idProofDetail: data.idProofDetail || null,
      idProofData: data.idProofData || null,
      registrationAmount: data.registrationAmount || 200
    });
  }
  async getAllPatients(search) {
    return this.repository.getAllPatients(search);
  }
  async getPatientById(id) {
    return this.repository.getPatientById(id);
  }
  async updatePatient(id, data) {
    return this.repository.updatePatient(id, data);
  }
  async deletePatient(id) {
    return this.repository.deletePatient(id);
  }
  async getPatientMedicalHistory(patientId) {
    return this.repository.getPatientMedicalHistory(patientId);
  }
  async upsertPatientMedicalHistory(id, data) {
    return this.repository.upsertPatientMedicalHistory(id, data);
  }
  getPatientByUserId(userId) {
    return this.repository.getPatientByUserId(userId);
  }
  async payRegistration(id) {
    const patient = await this.repository.getPatientById(id);
    if (!patient) throw new Error("Patient not found");
    if (patient.registrationPaymentStatus === import_client11.PaymentStatus.PAID) {
      throw new Error("Registration is already paid");
    }
    return this.repository.updateRegistrationPaymentStatus(id);
  }
};

// src/modules/patient/patient.dto.ts
var import_zod5 = require("zod");
var RegisterPatientDto = import_zod5.z.object({
  name: import_zod5.z.string().min(1, "Name is required"),
  firstName: import_zod5.z.string().optional(),
  lastName: import_zod5.z.string().optional(),
  age: import_zod5.z.number().int().nonnegative("Age cannot be negative"),
  dob: import_zod5.z.string().optional(),
  gender: import_zod5.z.string().optional(),
  // Structured Address
  houseNumber: import_zod5.z.string().optional(),
  houseName: import_zod5.z.string().optional(),
  houseAddress: import_zod5.z.string().optional(),
  localArea: import_zod5.z.string().optional(),
  street: import_zod5.z.string().optional(),
  city: import_zod5.z.string().optional(),
  state: import_zod5.z.string().optional(),
  pincode: import_zod5.z.string().optional(),
  // Contact info
  contactNo: import_zod5.z.string().optional(),
  alternateContact: import_zod5.z.string().optional(),
  email: import_zod5.z.string().email("Invalid email").optional().or(import_zod5.z.literal("")),
  address: import_zod5.z.string().optional(),
  // Legacy combined
  // Guardian Info
  guardianName: import_zod5.z.string().optional(),
  guardianRelation: import_zod5.z.string().optional(),
  guardianContact: import_zod5.z.string().optional(),
  guardianComment: import_zod5.z.string().optional(),
  guardianAddress: import_zod5.z.string().optional(),
  // Referral
  referredDoctor: import_zod5.z.string().optional(),
  referredHospital: import_zod5.z.string().optional(),
  // ID Proof
  idProofType: import_zod5.z.string().optional(),
  idProofDetail: import_zod5.z.string().optional(),
  idProofData: import_zod5.z.string().optional(),
  registrationAmount: import_zod5.z.number().optional().default(200),
  registrationDate: import_zod5.z.string().optional()
  // ISO date
});
var UpsertPatientMedicalHistoryDto = import_zod5.z.object({
  pastMedicalHistory: import_zod5.z.string().optional(),
  pastSurgicalHistory: import_zod5.z.string().optional(),
  allergies: import_zod5.z.string().optional(),
  familyHistory: import_zod5.z.string().optional(),
  socialHistory: import_zod5.z.string().optional(),
  medications: import_zod5.z.string().optional(),
  vaccinationHistory: import_zod5.z.string().optional()
});

// src/modules/patient/patient.controller.ts
var PatientController = class {
  service = new PatientService();
  register = async (req, res) => {
    try {
      const data = RegisterPatientDto.parse(req.body);
      const result = await this.service.registerPatient(data);
      res.status(201).json({ message: "Patient registered successfully", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to register patient" });
    }
  };
  getMe = async (req, res) => {
    try {
      if (!req.user || req.user.role !== "PATIENT") {
        res.status(403).json({ message: "Only patients can fetch their profile via /me" });
        return;
      }
      const patient = await this.service.getPatientByUserId(req.user.userId);
      if (!patient) {
        res.status(404).json({ message: "Patient profile not found" });
        return;
      }
      res.status(200).json({ data: patient });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  };
  getAll = async (req, res) => {
    try {
      const search = req.query.search;
      const result = await this.service.getAllPatients(search);
      res.status(200).json({ data: result });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  };
  getById = async (req, res) => {
    try {
      const id = req.params.id;
      const patient = await this.service.getPatientById(id);
      if (!patient) {
        res.status(404).json({ message: "Patient not found" });
        return;
      }
      res.status(200).json({ data: patient });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  };
  update = async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await this.service.updatePatient(id, req.body);
      res.status(200).json({ message: "Patient updated", data: updated });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update patient" });
    }
  };
  delete = async (req, res) => {
    try {
      const id = req.params.id;
      await this.service.deletePatient(id);
      res.status(200).json({ message: "Patient deleted" });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to delete patient" });
    }
  };
  pay = async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await this.service.payRegistration(id);
      res.status(200).json({ message: "Registration paid successfully", data: updated });
    } catch (error) {
      res.status(400).json({ message: error.message || "Registration payment failed" });
    }
  };
  getMedicalHistory = async (req, res) => {
    try {
      const id = String(req.params.id);
      const data = await this.service.getPatientMedicalHistory(id);
      res.status(200).json({ data: data || null });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch medical history" });
    }
  };
  upsertMedicalHistory = async (req, res) => {
    try {
      const id = String(req.params.id);
      const payload = UpsertPatientMedicalHistoryDto.parse(req.body);
      const data = await this.service.upsertPatientMedicalHistory(id, payload);
      res.status(200).json({ message: "Medical history updated", data });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update medical history" });
    }
  };
};

// src/modules/patient/patient.routes.ts
var router5 = (0, import_express5.Router)();
var controller5 = new PatientController();
router5.post("/register", authenticate, controller5.register);
router5.get("/me", authenticate, controller5.getMe);
router5.get("/", authenticate, controller5.getAll);
router5.get("/:id/medical-history", authenticate, controller5.getMedicalHistory);
router5.put("/:id/medical-history", authenticate, controller5.upsertMedicalHistory);
router5.get("/:id", authenticate, controller5.getById);
router5.put("/:id/pay", authenticate, controller5.pay);
router5.put("/:id", authenticate, controller5.update);
router5.delete("/:id", authenticate, controller5.delete);
var patient_routes_default = router5;

// src/modules/booking/booking.routes.ts
var import_express6 = require("express");
var import_client16 = require("@prisma/client");

// src/modules/booking/booking.controller.ts
var import_client15 = require("@prisma/client");

// src/modules/booking/booking.dto.ts
var import_zod6 = require("zod");
var CreateSlotDto = import_zod6.z.object({
  doctorId: import_zod6.z.string().uuid(),
  startTime: import_zod6.z.string().datetime(),
  endTime: import_zod6.z.string().datetime(),
  maxCapacity: import_zod6.z.number().int().positive().default(1)
});
var CreateBulkSlotsDto = import_zod6.z.object({
  doctorId: import_zod6.z.string().uuid(),
  startDate: import_zod6.z.string().datetime().optional(),
  endDate: import_zod6.z.string().datetime().optional(),
  startTimeStr: import_zod6.z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  endTimeStr: import_zod6.z.string().regex(/^([01]\d|2[0-3]):?([0-5]\d)$/),
  slotDurationMinutes: import_zod6.z.number().int().positive().default(15),
  breakDurationMinutes: import_zod6.z.number().int().min(0).default(0),
  maxCapacity: import_zod6.z.number().int().positive().default(1),
  daysOfWeek: import_zod6.z.array(import_zod6.z.number().int().min(0).max(6)).optional(),
  specificDates: import_zod6.z.array(import_zod6.z.string().datetime()).optional()
}).refine(
  (data) => data.startDate && data.endDate || data.specificDates && data.specificDates.length > 0,
  { message: "Either startDate and endDate OR specificDates must be provided" }
);
var BookAppointmentDto = import_zod6.z.object({
  patientId: import_zod6.z.string().uuid(),
  doctorId: import_zod6.z.string().uuid(),
  slotId: import_zod6.z.string().uuid(),
  paymentMode: import_zod6.z.enum(["CASH", "CREDIT", "UPI", "STRIPE"])
});
var UpdateVisitDto = import_zod6.z.object({
  chiefComplaint: import_zod6.z.string().optional(),
  examination: import_zod6.z.string().optional(),
  diagnosis: import_zod6.z.string().optional(),
  diagnosisIcd10: import_zod6.z.string().optional(),
  treatmentPlan: import_zod6.z.string().optional(),
  consultationNotes: import_zod6.z.string().optional(),
  notes: import_zod6.z.string().optional(),
  medications: import_zod6.z.array(import_zod6.z.object({
    medicineId: import_zod6.z.string().uuid(),
    brand: import_zod6.z.string().min(1),
    drug: import_zod6.z.string().min(1),
    strength: import_zod6.z.string().min(1),
    dosageForm: import_zod6.z.string().min(1),
    dose: import_zod6.z.string().min(1),
    unit: import_zod6.z.string().min(1),
    frequency: import_zod6.z.string().min(1),
    duration: import_zod6.z.string().min(1),
    durationUnit: import_zod6.z.string().min(1),
    instructions: import_zod6.z.string().min(1),
    notes: import_zod6.z.string().optional()
  })).optional(),
  labRequests: import_zod6.z.array(import_zod6.z.object({
    labTestId: import_zod6.z.string().uuid().optional(),
    testName: import_zod6.z.string().min(1).optional(),
    clinicalNotes: import_zod6.z.string().optional(),
    status: import_zod6.z.enum(["REQUESTED", "SAMPLE_COLLECTED", "REPORT_UPLOADED", "COMPLETED"]).default("REQUESTED")
  })).optional(),
  radiologyRequests: import_zod6.z.array(import_zod6.z.object({
    radiologyTestId: import_zod6.z.string().uuid().optional(),
    modality: import_zod6.z.enum(["X_RAY", "MRI", "CT_SCAN", "ULTRASOUND"]).optional(),
    testName: import_zod6.z.string().min(1).optional(),
    clinicalNotes: import_zod6.z.string().optional(),
    status: import_zod6.z.enum(["REQUESTED", "SCHEDULED", "REPORT_UPLOADED", "COMPLETED"]).default("REQUESTED")
  })).optional(),
  vitals: import_zod6.z.object({
    temperature: import_zod6.z.string().optional(),
    pulse: import_zod6.z.string().optional(),
    spo2: import_zod6.z.string().optional(),
    bpSystolic: import_zod6.z.string().optional(),
    bpDiastolic: import_zod6.z.string().optional(),
    respiratoryRate: import_zod6.z.string().optional(),
    nurseNotes: import_zod6.z.string().optional()
  }).optional()
});

// src/modules/booking/booking.service.ts
var import_client14 = require("@prisma/client");

// src/modules/invoice/invoice.service.ts
var import_client12 = require("@prisma/client");

// src/modules/invoice/invoice.repository.ts
var InvoiceRepository = class {
  getById(id) {
    return prisma.invoice.findUnique({
      where: { id },
      include: {
        appointment: {
          include: {
            patient: { select: { id: true, name: true, uhid: true } },
            doctor: { select: { id: true, name: true } }
          }
        },
        patient: { select: { id: true, name: true, uhid: true } },
        items: { orderBy: { createdAt: "asc" } }
      }
    });
  }
  getByAppointmentId(appointmentId) {
    return prisma.invoice.findUnique({
      where: { appointmentId },
      include: {
        appointment: {
          include: {
            patient: { select: { id: true, name: true, uhid: true } },
            doctor: { select: { id: true, name: true } },
            payments: { orderBy: { paymentDate: "asc" } }
          }
        },
        patient: { select: { id: true, name: true, uhid: true } },
        items: { orderBy: { createdAt: "asc" } }
      }
    });
  }
  getByPatientId(patientId) {
    return prisma.invoice.findMany({
      where: { patientId },
      include: {
        appointment: {
          select: {
            id: true,
            token: true,
            startTime: true,
            status: true,
            paymentStatus: true,
            paidAmount: true,
            pendingAmount: true
          }
        },
        items: { orderBy: { createdAt: "asc" } }
      },
      orderBy: { issuedDate: "desc" }
    });
  }
  getAppointmentInvoiceSource(appointmentId) {
    return prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: { select: { id: true, name: true, uhid: true } },
        doctor: { select: { id: true, name: true } },
        billingItems: { where: { invoiceId: null }, orderBy: { createdAt: "asc" } },
        payments: { orderBy: { paymentDate: "asc" } },
        invoice: true
      }
    });
  }
  async createInvoice(data) {
    return prisma.$transaction(async (tx) => {
      const invoice = await tx.invoice.create({
        data: {
          appointmentId: data.appointmentId,
          patientId: data.patientId,
          invoiceNumber: data.invoiceNumber,
          totalAmount: data.totalAmount,
          taxAmount: data.taxAmount,
          netAmount: data.netAmount,
          status: data.status
        }
      });
      if (data.billingItemIds.length > 0) {
        await tx.billingItem.updateMany({
          where: { id: { in: data.billingItemIds } },
          data: { invoiceId: invoice.id }
        });
      }
      return tx.invoice.findUnique({
        where: { id: invoice.id },
        include: {
          appointment: {
            include: {
              patient: { select: { id: true, name: true, uhid: true } },
              doctor: { select: { id: true, name: true } },
              payments: { orderBy: { paymentDate: "asc" } }
            }
          },
          patient: { select: { id: true, name: true, uhid: true } },
          items: { orderBy: { createdAt: "asc" } }
        }
      });
    });
  }
  updateStatus(id, status) {
    return prisma.invoice.update({ where: { id }, data: { status } });
  }
  updateStatusByAppointmentId(appointmentId, status) {
    return prisma.invoice.update({ where: { appointmentId }, data: { status } });
  }
  getLatestInvoiceNumber() {
    return prisma.invoice.findFirst({
      orderBy: { issuedDate: "desc" },
      select: { invoiceNumber: true }
    });
  }
};

// src/modules/invoice/invoice.service.ts
var InvoiceService = class {
  repository = new InvoiceRepository();
  getById(id) {
    return this.repository.getById(id);
  }
  getByAppointmentId(appointmentId) {
    return this.repository.getByAppointmentId(appointmentId);
  }
  getByPatientId(patientId) {
    return this.repository.getByPatientId(patientId);
  }
  async generateInvoiceNumber() {
    const latest = await this.repository.getLatestInvoiceNumber();
    const nextNumber = latest?.invoiceNumber ? Number(latest.invoiceNumber.split("-").pop() || "0") + 1 : 1;
    return `INV-${(/* @__PURE__ */ new Date()).getFullYear()}-${String(nextNumber).padStart(5, "0")}`;
  }
  async generateInvoice(appointmentId, payload) {
    const appointment = await this.repository.getAppointmentInvoiceSource(appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    if (appointment.invoice) throw new Error("Invoice already exists for this appointment");
    if (appointment.billingItems.length === 0) throw new Error("No billing items available for invoice generation");
    const subtotal = appointment.billingItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const taxRate = payload.taxRate ?? 0;
    const taxAmount = Number((subtotal * taxRate).toFixed(2));
    const netAmount = Number((subtotal + taxAmount).toFixed(2));
    const paidAmount = appointment.payments.reduce((sum, payment) => sum + payment.amount, 0);
    let status = payload.status ?? import_client12.InvoiceStatus.ISSUED;
    if (paidAmount >= netAmount && netAmount > 0) status = import_client12.InvoiceStatus.PAID;
    else if (paidAmount > 0) status = import_client12.InvoiceStatus.PARTIALLY_PAID;
    return this.repository.createInvoice({
      appointmentId,
      patientId: appointment.patientId,
      invoiceNumber: await this.generateInvoiceNumber(),
      totalAmount: subtotal,
      taxAmount,
      netAmount,
      status,
      billingItemIds: appointment.billingItems.map((item) => item.id)
    });
  }
  async updateStatus(id, status) {
    const invoice = await this.repository.getById(id);
    if (!invoice) throw new Error("Invoice not found");
    return this.repository.updateStatus(id, status);
  }
  async syncStatusAfterPayment(appointmentId, paidAmount, totalAmount) {
    const invoice = await this.repository.getByAppointmentId(appointmentId);
    if (!invoice) return null;
    const targetAmount = invoice.netAmount || totalAmount;
    let status = import_client12.InvoiceStatus.ISSUED;
    if (paidAmount >= targetAmount && targetAmount > 0) status = import_client12.InvoiceStatus.PAID;
    else if (paidAmount > 0) status = import_client12.InvoiceStatus.PARTIALLY_PAID;
    return this.repository.updateStatusByAppointmentId(appointmentId, status);
  }
};

// src/modules/booking/booking.repository.ts
var import_client13 = require("@prisma/client");
var BookingRepository = class {
  async createSlot(data) {
    return prisma.slot.create({ data });
  }
  async findOverlappingSlot(doctorId, startTime, endTime) {
    return prisma.slot.findFirst({ where: { doctorId, startTime: { lt: endTime }, endTime: { gt: startTime } } });
  }
  async getFutureSlotsForDoctor(doctorId, now) {
    return prisma.slot.findMany({ where: { doctorId, endTime: { gt: now } }, select: { startTime: true, endTime: true } });
  }
  async createBulkSlots(data) {
    return prisma.slot.createMany({ data, skipDuplicates: true });
  }
  async getAvailableSlots(doctorId, date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
    return prisma.slot.findMany({ where: { doctorId, isAvailable: true, startTime: { gte: startOfDay, lte: endOfDay } }, orderBy: { startTime: "asc" } });
  }
  async bookSlotTransaction(patientId, doctorId, slotId, expectedVersion, tokenStr, totalFee) {
    return prisma.$transaction(async (tx) => {
      const result = await tx.slot.updateMany({ where: { id: slotId, version: expectedVersion, isAvailable: true }, data: { bookedCount: { increment: 1 }, version: { increment: 1 } } });
      if (result.count === 0) throw new Error("Slot booking collision or slot unavailable. Please try again.");
      const updatedSlot = await tx.slot.findUniqueOrThrow({ where: { id: slotId } });
      if (updatedSlot.bookedCount >= updatedSlot.maxCapacity) {
        await tx.slot.update({ where: { id: slotId }, data: { isAvailable: false } });
      }
      const appointment = await tx.appointment.create({
        data: {
          token: tokenStr,
          patientId,
          doctorId,
          slotId,
          startTime: updatedSlot.startTime,
          endTime: updatedSlot.endTime,
          totalAmount: totalFee,
          pendingAmount: totalFee,
          status: import_client13.AppointmentStatus.BOOKED,
          paymentStatus: import_client13.PaymentStatus.PENDING
        }
      });
      await tx.billingItem.create({
        data: {
          appointmentId: appointment.id,
          category: import_client13.BillingCategory.CONSULTATION,
          itemId: doctorId,
          itemName: "Consultation",
          quantity: 1,
          unitPrice: totalFee,
          totalPrice: totalFee
        }
      });
      return appointment;
    });
  }
  async getTodaysBookingsCount() {
    const startOfDay = /* @__PURE__ */ new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return prisma.appointment.count({ where: { createdAt: { gte: startOfDay } } });
  }
  async findDoctorProfileByUserId(userId) {
    return prisma.doctorProfile.findFirst({ where: { userId }, select: { id: true } });
  }
  async findPatientByUserId(userId) {
    return prisma.patient.findFirst({ where: { userId }, select: { id: true } });
  }
  async findDoctorFeeProfile(doctorId) {
    return prisma.doctorProfile.findUnique({ where: { id: doctorId }, select: { consultationFee: true, incrementIntervalDays: true, renewalCharge: true } });
  }
  async findSlotById(slotId) {
    return prisma.slot.findUnique({ where: { id: slotId } });
  }
  async findLastAppointmentForPatient(patientId, doctorId) {
    return prisma.appointment.findFirst({ where: { patientId, doctorId, status: { in: ["COMPLETED", "ACKNOWLEDGED", "CHECKED_IN"] } }, orderBy: { startTime: "desc" } });
  }
  async getAppointmentsForDoctor(doctorId, patientId) {
    return prisma.appointment.findMany({
      where: { doctorId, ...patientId ? { patientId } : {} },
      include: {
        patient: { select: { id: true, name: true, uhid: true, age: true, gender: true } },
        doctor: { select: { id: true, name: true, department: true } },
        visit: { select: { id: true, chiefComplaint: true, examination: true, diagnosis: true, diagnosisIcd10: true, treatmentPlan: true, consultationNotes: true, notes: true, status: true } }
      },
      orderBy: { startTime: "asc" }
    });
  }
  async getAppointmentsForAdminOrReception(patientId) {
    return prisma.appointment.findMany({
      where: patientId ? { patientId } : {},
      include: {
        patient: { select: { id: true, name: true, uhid: true, age: true, gender: true } },
        doctor: { select: { id: true, name: true, department: true } },
        visit: { select: { id: true, chiefComplaint: true, examination: true, diagnosis: true, diagnosisIcd10: true, treatmentPlan: true, consultationNotes: true, notes: true, status: true } }
      },
      orderBy: { startTime: "desc" }
    });
  }
  async getAppointmentsForPatient(patientId) {
    return prisma.appointment.findMany({
      where: { patientId },
      include: {
        patient: { select: { id: true, name: true, uhid: true, age: true, gender: true } },
        doctor: { select: { id: true, name: true, department: true } },
        visit: { select: { id: true, chiefComplaint: true, examination: true, diagnosis: true, diagnosisIcd10: true, treatmentPlan: true, consultationNotes: true, notes: true, status: true } }
      },
      orderBy: { startTime: "desc" }
    });
  }
  async acknowledgeAppointment(id) {
    return prisma.appointment.update({ where: { id }, data: { status: import_client13.AppointmentStatus.CHECKED_IN } });
  }
  async getAppointmentById(id) {
    return prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: { select: { id: true, name: true, uhid: true, age: true, gender: true, contactNo: true } },
        doctor: { select: { id: true, name: true, department: true } }
      }
    });
  }
  async getVisitByAppointmentId(appointmentId) {
    const visit = await prisma.visit.findUnique({
      where: { appointmentId },
      include: {
        vitalsRecord: true,
        labRequestRecords: { include: { labTest: { select: { id: true, testName: true, testCode: true } }, report: true }, orderBy: { orderedAt: "asc" } },
        radiologyRequestRecords: { include: { radiologyTest: { select: { id: true, testName: true, modality: true } }, report: true }, orderBy: { orderedAt: "asc" } }
      }
    });
    if (!visit) return null;
    return {
      ...visit,
      vitals: visit.vitalsRecord,
      labRequests: visit.labRequestRecords.map((request) => ({ id: request.id, labTestId: request.labTestId, testName: request.testNameSnapshot, clinicalNotes: request.clinicalNotes, status: request.status, report: request.report })),
      radiologyRequests: visit.radiologyRequestRecords.map((request) => ({ id: request.id, radiologyTestId: request.radiologyTestId, modality: request.modalitySnapshot, testName: request.testNameSnapshot, clinicalNotes: request.clinicalNotes, status: request.status, report: request.report }))
    };
  }
  async upsertVisitByAppointmentId(appointmentId, data) {
    const appointment = await prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new Error("Appointment not found");
    await prisma.$transaction(async (tx) => {
      const visit = await tx.visit.upsert({
        where: { appointmentId },
        update: { chiefComplaint: data.chiefComplaint, examination: data.examination, diagnosis: data.diagnosis, diagnosisIcd10: data.diagnosisIcd10, treatmentPlan: data.treatmentPlan, consultationNotes: data.consultationNotes, notes: data.notes ?? data.consultationNotes },
        create: { appointmentId, patientId: appointment.patientId, doctorId: appointment.doctorId, chiefComplaint: data.chiefComplaint, examination: data.examination, diagnosis: data.diagnosis, diagnosisIcd10: data.diagnosisIcd10, treatmentPlan: data.treatmentPlan, consultationNotes: data.consultationNotes, notes: data.notes ?? data.consultationNotes }
      });
      if (data.vitals) {
        const vitals = data.vitals;
        await tx.vitals.upsert({
          where: { visitId: visit.id },
          update: { temperature: String(vitals.temperature || ""), pulse: String(vitals.pulse || ""), spo2: String(vitals.spo2 || ""), bpSystolic: String(vitals.bpSystolic || ""), bpDiastolic: String(vitals.bpDiastolic || ""), respiratoryRate: String(vitals.respiratoryRate || ""), nurseNotes: String(vitals.nurseNotes || "") },
          create: { visitId: visit.id, temperature: String(vitals.temperature || ""), pulse: String(vitals.pulse || ""), spo2: String(vitals.spo2 || ""), bpSystolic: String(vitals.bpSystolic || ""), bpDiastolic: String(vitals.bpDiastolic || ""), respiratoryRate: String(vitals.respiratoryRate || ""), nurseNotes: String(vitals.nurseNotes || "") }
        });
      }
      const existingLabRequests = await tx.labRequest.findMany({ where: { visitId: visit.id }, select: { id: true, labTestId: true } });
      for (const request of data.labRequests ?? []) {
        const catalog = request.labTestId ? await tx.labTestCatalog.findUnique({ where: { id: request.labTestId } }) : request.testName ? await tx.labTestCatalog.findFirst({ where: { testName: request.testName, isActive: true } }) : null;
        if (!catalog) throw new Error(`Lab test not found for request "${request.testName || request.labTestId || "unknown"}"`);
        const existing = existingLabRequests.find((item) => item.labTestId === catalog.id);
        if (existing) {
          await tx.labRequest.update({ where: { id: existing.id }, data: { clinicalNotes: request.clinicalNotes, status: request.status ?? void 0 } });
        } else {
          await tx.labRequest.create({ data: { visitId: visit.id, appointmentId, patientId: appointment.patientId, doctorId: appointment.doctorId, labTestId: catalog.id, testNameSnapshot: catalog.testName, priceSnapshot: catalog.price, clinicalNotes: request.clinicalNotes, status: request.status ?? import_client13.LabRequestStatus.REQUESTED } });
          await tx.billingItem.create({ data: { appointmentId, category: import_client13.BillingCategory.LAB_TEST, itemId: catalog.id, itemName: catalog.testName, quantity: 1, unitPrice: catalog.price, totalPrice: catalog.price } });
          await tx.appointment.update({ where: { id: appointmentId }, data: { totalAmount: { increment: catalog.price }, pendingAmount: { increment: catalog.price } } });
        }
      }
      const existingRadiologyRequests = await tx.radiologyRequest.findMany({ where: { visitId: visit.id }, select: { id: true, radiologyTestId: true } });
      for (const request of data.radiologyRequests ?? []) {
        const catalog = request.radiologyTestId ? await tx.radiologyTestCatalog.findUnique({ where: { id: request.radiologyTestId } }) : request.testName ? await tx.radiologyTestCatalog.findFirst({ where: { testName: request.testName, isActive: true } }) : null;
        if (!catalog) throw new Error(`Radiology test not found for request "${request.testName || request.radiologyTestId || "unknown"}"`);
        const existing = existingRadiologyRequests.find((item) => item.radiologyTestId === catalog.id);
        if (existing) {
          await tx.radiologyRequest.update({ where: { id: existing.id }, data: { clinicalNotes: request.clinicalNotes, status: request.status ?? void 0 } });
        } else {
          await tx.radiologyRequest.create({ data: { visitId: visit.id, appointmentId, patientId: appointment.patientId, doctorId: appointment.doctorId, radiologyTestId: catalog.id, testNameSnapshot: catalog.testName, modalitySnapshot: catalog.modality, priceSnapshot: catalog.price, clinicalNotes: request.clinicalNotes, status: request.status ?? import_client13.RadiologyRequestStatus.REQUESTED } });
          await tx.billingItem.create({ data: { appointmentId, category: import_client13.BillingCategory.RADIOLOGY_TEST, itemId: catalog.id, itemName: catalog.testName, quantity: 1, unitPrice: catalog.price, totalPrice: catalog.price } });
          await tx.appointment.update({ where: { id: appointmentId }, data: { totalAmount: { increment: catalog.price }, pendingAmount: { increment: catalog.price } } });
        }
      }
    });
    return this.getVisitByAppointmentId(appointmentId);
  }
  async completeAppointment(id) {
    return prisma.$transaction(async (tx) => {
      const appointment = await tx.appointment.update({ where: { id }, data: { status: import_client13.AppointmentStatus.COMPLETED } });
      await tx.visit.updateMany({ where: { appointmentId: id }, data: { status: "completed" } });
      return appointment;
    });
  }
  async getActiveMedicines() {
    return prisma.medicine.findMany({ where: { isActive: true }, orderBy: [{ medicineName: "asc" }, { createdAt: "desc" }] });
  }
  async getAppointmentPaymentSnapshot(id) {
    return prisma.appointment.findUnique({ where: { id }, select: { id: true, paidAmount: true, totalAmount: true } });
  }
  async recordPaymentAndUpdateAppointment(data) {
    return prisma.$transaction(async (tx) => {
      await tx.payment.create({ data: { appointmentId: data.appointmentId, amount: data.amount, paymentMode: data.paymentMode, status: data.providerStatus, transactionId: data.transactionId } });
      return tx.appointment.update({ where: { id: data.appointmentId }, data: { paidAmount: data.paidAmount, pendingAmount: data.pendingAmount, paymentStatus: data.paymentStatus } });
    });
  }
};

// src/modules/booking/booking.service.ts
var BookingService = class {
  repository = new BookingRepository();
  async createSlot(data) {
    const startTime = new Date(data.startTime);
    const endTime = new Date(data.endTime);
    if (startTime < /* @__PURE__ */ new Date()) throw new Error("Selected time is not valid or past.");
    const existingOverlaps = await this.repository.findOverlappingSlot(data.doctorId, startTime, endTime);
    if (existingOverlaps) throw new Error("Slot overlaps with an existing appointment slot.");
    return this.repository.createSlot({ doctorId: data.doctorId, startTime, endTime, maxCapacity: data.maxCapacity });
  }
  async createBulkSlots(data) {
    const slots = [];
    const [startHour, startMinute] = data.startTimeStr.split(":").map(Number);
    const [endHour, endMinute] = data.endTimeStr.split(":").map(Number);
    const now = /* @__PURE__ */ new Date();
    const existingSlots = await this.repository.getFutureSlotsForDoctor(data.doctorId, now);
    const isOverlapping = (newStart, newEnd) => existingSlots.some((existing) => newStart < existing.endTime && newEnd > existing.startTime);
    const generateForDate = (dateObj) => {
      let currentSlotStart = new Date(dateObj);
      currentSlotStart.setHours(startHour, startMinute, 0, 0);
      const currentDayEnd = new Date(dateObj);
      currentDayEnd.setHours(endHour, endMinute, 0, 0);
      while (currentSlotStart < currentDayEnd) {
        const currentSlotEnd = new Date(currentSlotStart.getTime() + data.slotDurationMinutes * 6e4);
        if (currentSlotEnd <= currentDayEnd) {
          if (currentSlotStart < now) throw new Error("Selected time is not valid or past.");
          if (isOverlapping(currentSlotStart, currentSlotEnd)) {
            throw new Error("One or more generated slots overlap with existing appointments for this doctor.");
          }
          slots.push({ doctorId: data.doctorId, startTime: new Date(currentSlotStart), endTime: new Date(currentSlotEnd), maxCapacity: data.maxCapacity });
        }
        currentSlotStart = new Date(currentSlotEnd.getTime() + data.breakDurationMinutes * 6e4);
      }
    };
    if (data.specificDates?.length) {
      for (const dateStr of data.specificDates) generateForDate(new Date(dateStr));
    } else if (data.startDate && data.endDate) {
      let currentDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      endDate.setHours(23, 59, 59, 999);
      while (currentDate <= endDate) {
        if (!data.daysOfWeek || data.daysOfWeek.includes(currentDate.getDay())) generateForDate(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    } else {
      throw new Error("Invalid date configuration for bulk slots.");
    }
    if (slots.length > 0) await this.repository.createBulkSlots(slots);
    return { count: slots.length, message: `Created ${slots.length} slots successfully.` };
  }
  async getAvailableSlots(doctorId, dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error("Invalid date");
    return this.repository.getAvailableSlots(doctorId, date);
  }
  async generateToken() {
    const todaysCount = await this.repository.getTodaysBookingsCount();
    const datePart = (/* @__PURE__ */ new Date()).toISOString().split("T")[0].replace(/-/g, "");
    return `TKN-${datePart}-${String(todaysCount + 1).padStart(4, "0")}`;
  }
  async bookAppointment(data) {
    const doctor = await this.repository.findDoctorFeeProfile(data.doctorId);
    if (!doctor) throw new Error("Doctor not found");
    const slot = await this.repository.findSlotById(data.slotId);
    if (!slot || !slot.isAvailable) throw new Error("Slot unavailable");
    let finalFee = doctor.consultationFee;
    const lastAppointment = await this.repository.findLastAppointmentForPatient(data.patientId, data.doctorId);
    if (lastAppointment) {
      const daysSinceLastVisit = (new Date(slot.startTime).getTime() - new Date(lastAppointment.startTime).getTime()) / (1e3 * 3600 * 24);
      finalFee = daysSinceLastVisit <= doctor.incrementIntervalDays ? 0 : doctor.renewalCharge;
    }
    const token = await this.generateToken();
    return this.repository.bookSlotTransaction(data.patientId, data.doctorId, data.slotId, slot.version, token, finalFee);
  }
  async getAppointmentsForUser(userId, role, patientId, doctorId) {
    if (role === "DOCTOR") {
      const profile = await this.repository.findDoctorProfileByUserId(userId);
      if (!profile) throw new Error("Doctor profile not found");
      return this.repository.getAppointmentsForDoctor(profile.id, patientId);
    }
    if (role === "PATIENT") {
      const patient = await this.repository.findPatientByUserId(userId);
      if (!patient) throw new Error("Patient profile not found");
      return this.repository.getAppointmentsForPatient(patient.id);
    }
    if (doctorId) return this.repository.getAppointmentsForDoctor(doctorId, patientId);
    return this.repository.getAppointmentsForAdminOrReception(patientId);
  }
  async acknowledgeAppointment(id) {
    return this.repository.acknowledgeAppointment(id);
  }
  async getAppointmentById(id) {
    return this.repository.getAppointmentById(id);
  }
  async getVisit(appointmentId) {
    return this.repository.getVisitByAppointmentId(appointmentId);
  }
  async upsertVisit(appointmentId, data) {
    return this.repository.upsertVisitByAppointmentId(appointmentId, data);
  }
  async completeAppointment(id) {
    return this.repository.completeAppointment(id);
  }
  async getActiveMedicines() {
    return this.repository.getActiveMedicines();
  }
  async payAppointment(appointmentId, amount, paymentMode) {
    const appointment = await this.repository.getAppointmentPaymentSnapshot(appointmentId);
    if (!appointment) throw new Error("Appointment not found");
    const { PaymentStrategyFactory: PaymentStrategyFactory2 } = (init_payment_factory(), __toCommonJS(payment_factory_exports));
    const provider = PaymentStrategyFactory2.getProvider(paymentMode);
    const paymentResult = await provider.createPayment(amount, { appointmentId });
    if (!paymentResult.success) throw new Error("Payment processing failed with provider");
    const newPaid = appointment.paidAmount + amount;
    const newPending = Math.max(0, appointment.totalAmount - newPaid);
    const newStatus = newPending === 0 ? import_client14.PaymentStatus.PAID : newPaid > 0 ? import_client14.PaymentStatus.PARTIAL : import_client14.PaymentStatus.PENDING;
    const updated = await this.repository.recordPaymentAndUpdateAppointment({
      appointmentId,
      amount,
      paymentMode,
      providerStatus: paymentResult.status,
      transactionId: paymentResult.transactionId,
      paidAmount: newPaid,
      pendingAmount: newPending,
      paymentStatus: newStatus
    });
    try {
      const invoiceService = new InvoiceService();
      await invoiceService.syncStatusAfterPayment(appointmentId, newPaid, appointment.totalAmount);
    } catch {
    }
    return { data: updated, transactionInfo: paymentResult };
  }
};

// src/modules/booking/booking.controller.ts
var BookingController = class {
  service = new BookingService();
  isSameDay = (dateA, dateB) => dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
  createSlot = async (req, res) => {
    try {
      const data = CreateSlotDto.parse(req.body);
      if (req.user?.role === "DOCTOR" && req.user.userId !== data.doctorId) {
        res.status(403).json({ message: "Forbidden: Can only create slots for yourself" });
        return;
      }
      const result = await this.service.createSlot(data);
      res.status(201).json({ message: "Slot created successfully", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to create slot" });
    }
  };
  createBulkSlots = async (req, res) => {
    try {
      const data = CreateBulkSlotsDto.parse(req.body);
      if (req.user?.role === "DOCTOR" && req.user.userId !== data.doctorId) {
        res.status(403).json({ message: "Forbidden: Can only create slots for yourself" });
        return;
      }
      const result = await this.service.createBulkSlots(data);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to bulk create slots" });
    }
  };
  getAvailableSlots = async (req, res) => {
    try {
      const doctorId = String(req.params.doctorId || "");
      const date = req.query.date ? String(req.query.date) : "";
      if (!doctorId || !date) {
        res.status(400).json({ message: "Doctor ID and Date are required" });
        return;
      }
      const slots = await this.service.getAvailableSlots(doctorId, date);
      res.status(200).json({ data: slots });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch slots" });
    }
  };
  bookAppointment = async (req, res) => {
    try {
      const data = BookAppointmentDto.parse(req.body);
      const appointment = await this.service.bookAppointment(data);
      res.status(201).json({ message: "Appointment booked successfully", data: appointment });
    } catch (error) {
      res.status(400).json({ message: error.message || "Booking collision or failure" });
    }
  };
  getAppointments = async (req, res) => {
    try {
      const appointments = await this.service.getAppointmentsForUser(
        String(req.user?.userId || ""),
        String(req.user?.role || ""),
        req.query.patientId ? String(req.query.patientId) : void 0,
        req.query.doctorId ? String(req.query.doctorId) : void 0
      );
      res.status(200).json({ data: appointments });
    } catch (error) {
      if ((error.message || "").includes("profile not found")) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(500).json({ message: error.message || "Failed to fetch appointments" });
    }
  };
  acknowledgeAppointment = async (req, res) => {
    try {
      const id = String(req.params.id);
      const appt = await this.service.getAppointmentById(id);
      if (!appt) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }
      if (req.user?.role === "DOCTOR" && !this.isSameDay(new Date(appt.startTime), /* @__PURE__ */ new Date())) {
        res.status(400).json({ message: "Doctors can acknowledge only on the appointment day" });
        return;
      }
      if (appt.status !== "BOOKED" && appt.status !== "CHECKED_IN") {
        res.status(400).json({ message: "Appointment cannot be acknowledged in current status" });
        return;
      }
      const appointment = await this.service.acknowledgeAppointment(id);
      res.status(200).json({ message: "Appointment acknowledged", data: appointment });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to acknowledge" });
    }
  };
  getAppointmentById = async (req, res) => {
    try {
      const appt = await this.service.getAppointmentById(String(req.params.id));
      if (!appt) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }
      res.status(200).json({ data: appt });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch appointment" });
    }
  };
  payAppointment = async (req, res) => {
    try {
      const result = await this.service.payAppointment(
        String(req.params.id),
        Number(req.body.amount),
        req.body.paymentMode || import_client15.PaymentMode.CASH
      );
      res.status(200).json(result);
    } catch (error) {
      if ((error.message || "").includes("Appointment not found")) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: error.message || "Payment failed" });
    }
  };
  getVisit = async (req, res) => {
    try {
      const visit = await this.service.getVisit(String(req.params.id));
      res.status(200).json({ data: visit || null });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch visit" });
    }
  };
  updateVisit = async (req, res) => {
    try {
      const appointmentId = String(req.params.id);
      const data = UpdateVisitDto.parse(req.body);
      const appt = await this.service.getAppointmentById(appointmentId);
      if (!appt) {
        res.status(404).json({ message: "Appointment not found" });
        return;
      }
      if (req.user?.role === "DOCTOR" && !this.isSameDay(new Date(appt.startTime), /* @__PURE__ */ new Date())) {
        res.status(400).json({ message: "Doctors can edit consultation only on the appointment day" });
        return;
      }
      const visit = await this.service.upsertVisit(appointmentId, data);
      res.status(200).json({ message: "Visit updated", data: visit });
    } catch (error) {
      if ((error.message || "").includes("Appointment not found")) {
        res.status(404).json({ message: error.message });
        return;
      }
      res.status(400).json({ message: error.message || "Failed to update visit" });
    }
  };
  completeAppointment = async (req, res) => {
    try {
      const appointment = await this.service.completeAppointment(String(req.params.id));
      res.status(200).json({ message: "Consultation completed", data: appointment });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to complete appointment" });
    }
  };
  getMedicines = async (_req, res) => {
    try {
      const data = await this.service.getActiveMedicines();
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch medicines" });
    }
  };
};

// src/modules/booking/booking.routes.ts
var router6 = (0, import_express6.Router)();
var controller6 = new BookingController();
router6.post("/slots", authenticate, requireRoles([import_client16.Role.SUPERADMIN, import_client16.Role.ADMIN, import_client16.Role.RECEPTIONIST]), controller6.createSlot);
router6.post("/slots/bulk", authenticate, requireRoles([import_client16.Role.SUPERADMIN, import_client16.Role.ADMIN, import_client16.Role.RECEPTIONIST]), controller6.createBulkSlots);
router6.get("/slots/:doctorId", authenticate, controller6.getAvailableSlots);
router6.get("/medicines", authenticate, controller6.getMedicines);
router6.post("/book", authenticate, requireRoles([import_client16.Role.RECEPTIONIST, import_client16.Role.PATIENT, import_client16.Role.ADMIN, import_client16.Role.SUPERADMIN]), controller6.bookAppointment);
router6.get("/appointments", authenticate, controller6.getAppointments);
router6.get("/my-appointments", authenticate, controller6.getAppointments);
router6.get("/appointments/:id", authenticate, controller6.getAppointmentById);
router6.post("/appointments/:id/pay", authenticate, controller6.payAppointment);
router6.patch("/appointments/:id/acknowledge", authenticate, controller6.acknowledgeAppointment);
router6.get("/appointments/:id/visit", authenticate, controller6.getVisit);
router6.put("/appointments/:id/visit", authenticate, requireRoles([import_client16.Role.SUPERADMIN, import_client16.Role.DOCTOR]), controller6.updateVisit);
router6.patch("/appointments/:id/complete", authenticate, requireRoles([import_client16.Role.SUPERADMIN, import_client16.Role.DOCTOR]), controller6.completeAppointment);
var booking_routes_default = router6;

// src/modules/settings/settings.routes.ts
var import_express7 = require("express");

// src/modules/settings/settings.repository.ts
var SettingsRepository = class {
  async getOrganization() {
    return prisma.organization.findFirst();
  }
  async updateOrganization(id, data) {
    return prisma.organization.update({
      where: { id },
      data
    });
  }
};

// src/modules/settings/settings.service.ts
var import_zod7 = require("zod");
var UpdateOrganizationDto = import_zod7.z.object({
  organizationName: import_zod7.z.string().optional(),
  timezone: import_zod7.z.string().optional(),
  currency: import_zod7.z.string().optional(),
  contactEmail: import_zod7.z.string().email().optional().or(import_zod7.z.literal("")),
  contactPhone: import_zod7.z.string().optional(),
  address: import_zod7.z.string().optional(),
  logoUrl: import_zod7.z.string().optional()
});
var SettingsService = class {
  repository = new SettingsRepository();
  async getOrganization() {
    const org = await this.repository.getOrganization();
    if (!org) throw new Error("Organization not found");
    return org;
  }
  async updateOrganization(data) {
    const org = await this.getOrganization();
    return this.repository.updateOrganization(org.id, data);
  }
};

// src/modules/settings/settings.controller.ts
var SettingsController = class {
  service = new SettingsService();
  getOrganization = async (req, res) => {
    try {
      const org = await this.service.getOrganization();
      res.status(200).json({ data: org });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  };
  updateOrganization = async (req, res) => {
    try {
      const data = UpdateOrganizationDto.parse(req.body);
      const updated = await this.service.updateOrganization(data);
      res.status(200).json({ message: "Organization updated successfully", data: updated });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update organization" });
    }
  };
};

// src/modules/settings/settings.routes.ts
var import_client17 = require("@prisma/client");
var router7 = (0, import_express7.Router)();
var controller7 = new SettingsController();
router7.use(authenticate);
router7.get("/organization", requireRoles([import_client17.Role.SUPERADMIN, import_client17.Role.ADMIN, import_client17.Role.DOCTOR, import_client17.Role.RECEPTIONIST]), controller7.getOrganization);
router7.put("/organization", requireRoles([import_client17.Role.SUPERADMIN, import_client17.Role.ADMIN]), controller7.updateOrganization);
var settings_routes_default = router7;

// src/modules/medical-report/medical-report.routes.ts
var import_express8 = require("express");

// src/modules/medical-report/medical-report.repository.ts
var MedicalReportRepository = class {
  createReport(data) {
    return prisma.medicalReport.create({ data });
  }
  getReportsByPatientId(patientId) {
    return prisma.medicalReport.findMany({
      where: { patientId },
      orderBy: { uploadedDate: "desc" }
    });
  }
  getReportById(id) {
    return prisma.medicalReport.findUnique({ where: { id } });
  }
  deleteReport(id) {
    return prisma.medicalReport.delete({ where: { id } });
  }
};

// src/modules/medical-report/medical-report.service.ts
var MedicalReportService = class {
  repository = new MedicalReportRepository();
  async createReport(data) {
    return this.repository.createReport(data);
  }
  async getReportsByPatientId(patientId) {
    return this.repository.getReportsByPatientId(patientId);
  }
  async getReportById(id) {
    return this.repository.getReportById(id);
  }
  async deleteReport(id) {
    return this.repository.deleteReport(id);
  }
};

// src/modules/medical-report/medical-report.dto.ts
var import_zod8 = require("zod");
var CreateMedicalReportDto = import_zod8.z.object({
  patientId: import_zod8.z.string().uuid(),
  reportType: import_zod8.z.string().min(2),
  description: import_zod8.z.string().optional(),
  fileUrl: import_zod8.z.string().url()
});

// src/modules/medical-report/medical-report.controller.ts
var MedicalReportController = class {
  service = new MedicalReportService();
  create = async (req, res) => {
    try {
      const data = CreateMedicalReportDto.parse(req.body);
      const result = await this.service.createReport(data);
      res.status(201).json({ message: "Medical report uploaded", data: result });
    } catch (error) {
      res.status(400).json({ message: error.message || "Validation failed" });
    }
  };
  getByPatient = async (req, res) => {
    try {
      const patientId = String(req.params.patientId);
      const reports = await this.service.getReportsByPatientId(patientId);
      res.status(200).json({ data: reports });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical reports" });
    }
  };
  // Add more as needed
};

// src/modules/medical-report/medical-report.routes.ts
var import_client18 = require("@prisma/client");
var router8 = (0, import_express8.Router)();
var controller8 = new MedicalReportController();
router8.post("/", authenticate, requireRoles([import_client18.Role.SUPERADMIN, import_client18.Role.ADMIN, import_client18.Role.DOCTOR, import_client18.Role.RECEPTIONIST, import_client18.Role.PATIENT]), controller8.create);
router8.get("/patient/:patientId", authenticate, controller8.getByPatient);
var medical_report_routes_default = router8;

// src/modules/department/department.routes.ts
var import_express9 = require("express");

// src/modules/department/department.repository.ts
var DepartmentRepository = class {
  async getAll() {
    return prisma.department.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { doctors: true }
        }
      }
    });
  }
  async getById(id) {
    return prisma.department.findUnique({
      where: { id }
    });
  }
  async create(data) {
    return prisma.department.create({
      data
    });
  }
  async update(id, data) {
    return prisma.department.update({
      where: { id },
      data
    });
  }
  async delete(id) {
    return prisma.department.delete({
      where: { id }
    });
  }
};

// src/modules/department/department.service.ts
var import_zod9 = require("zod");
var CreateDepartmentDto = import_zod9.z.object({
  name: import_zod9.z.string().min(2, "Name must be at least 2 characters"),
  description: import_zod9.z.string().optional()
});
var UpdateDepartmentDto = import_zod9.z.object({
  name: import_zod9.z.string().min(2, "Name must be at least 2 characters").optional(),
  description: import_zod9.z.string().optional()
});
var DepartmentService = class {
  repository = new DepartmentRepository();
  async getAll() {
    return this.repository.getAll();
  }
  async getById(id) {
    return this.repository.getById(id);
  }
  async create(data) {
    return this.repository.create(data);
  }
  async update(id, data) {
    return this.repository.update(id, data);
  }
  async delete(id) {
    return this.repository.delete(id);
  }
};

// src/modules/department/department.controller.ts
var import_zod10 = require("zod");
var DepartmentController = class {
  service = new DepartmentService();
  getAll = async (req, res) => {
    try {
      const departments = await this.service.getAll();
      res.status(200).json({ data: departments });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch departments" });
    }
  };
  getById = async (req, res) => {
    try {
      const department = await this.service.getById(String(req.params.id));
      if (!department) {
        res.status(404).json({ message: "Department not found" });
        return;
      }
      res.status(200).json({ data: department });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch department" });
    }
  };
  create = async (req, res) => {
    try {
      const validatedData = CreateDepartmentDto.parse(req.body);
      const department = await this.service.create(validatedData);
      res.status(201).json({ data: department });
    } catch (err) {
      if (err instanceof import_zod10.z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: err.issues });
        return;
      }
      res.status(500).json({ message: err.message || "Failed to create department" });
    }
  };
  update = async (req, res) => {
    try {
      const validatedData = UpdateDepartmentDto.parse(req.body);
      const department = await this.service.update(String(req.params.id), validatedData);
      res.status(200).json({ data: department });
    } catch (err) {
      if (err?.code === "P2025") {
        res.status(404).json({ message: "Department not found" });
        return;
      }
      if (err instanceof import_zod10.z.ZodError) {
        res.status(400).json({ message: "Validation failed", errors: err.issues });
        return;
      }
      res.status(500).json({ message: err.message || "Failed to update department" });
    }
  };
  delete = async (req, res) => {
    try {
      await this.service.delete(String(req.params.id));
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (err) {
      if (err?.code === "P2003") {
        res.status(400).json({ message: "Cannot delete department as it has associated doctors." });
        return;
      }
      if (err?.code === "P2025") {
        res.status(404).json({ message: "Department not found" });
        return;
      }
      res.status(500).json({ message: err.message || "Failed to delete department" });
    }
  };
};

// src/modules/department/department.routes.ts
var import_client19 = require("@prisma/client");
var router9 = (0, import_express9.Router)();
var controller9 = new DepartmentController();
router9.use(authenticate);
router9.get("/", controller9.getAll);
router9.get("/:id", controller9.getById);
router9.use(requireRoles([import_client19.Role.ADMIN, import_client19.Role.SUPERADMIN]));
router9.post("/", controller9.create);
router9.put("/:id", controller9.update);
router9.delete("/:id", controller9.delete);
var department_routes_default = router9;

// src/modules/lab/lab.routes.ts
var import_express10 = require("express");
var import_client21 = require("@prisma/client");

// src/modules/lab/lab.dto.ts
var import_zod11 = require("zod");
var CreateLabTestDto = import_zod11.z.object({
  testName: import_zod11.z.string().min(1),
  testCode: import_zod11.z.string().min(1),
  price: import_zod11.z.number().positive(),
  description: import_zod11.z.string().optional(),
  department: import_zod11.z.string().optional()
});
var UpdateLabTestDto = import_zod11.z.object({
  testName: import_zod11.z.string().min(1).optional(),
  testCode: import_zod11.z.string().min(1).optional(),
  price: import_zod11.z.number().positive().optional(),
  description: import_zod11.z.string().optional(),
  department: import_zod11.z.string().optional(),
  isActive: import_zod11.z.boolean().optional()
});
var CreateLabRequestDto = import_zod11.z.object({
  visitId: import_zod11.z.string().uuid(),
  appointmentId: import_zod11.z.string().uuid(),
  patientId: import_zod11.z.string().uuid(),
  doctorId: import_zod11.z.string().uuid(),
  labTestId: import_zod11.z.string().uuid(),
  clinicalNotes: import_zod11.z.string().optional()
});
var UpdateLabRequestStatusDto = import_zod11.z.object({
  status: import_zod11.z.enum(["REQUESTED", "SAMPLE_COLLECTED", "REPORT_UPLOADED", "COMPLETED"])
});
var CreateLabReportDto = import_zod11.z.object({
  labRequestId: import_zod11.z.string().uuid(),
  fileUrl: import_zod11.z.string().url(),
  uploadedBy: import_zod11.z.string().min(1),
  reportNotes: import_zod11.z.string().optional()
});

// src/modules/lab/lab.repository.ts
var import_client20 = require("@prisma/client");
var LabRepository = class {
  getAllTests(includeInactive = false) {
    return prisma.labTestCatalog.findMany({ where: includeInactive ? {} : { isActive: true }, orderBy: [{ testName: "asc" }] });
  }
  getTestById(id) {
    return prisma.labTestCatalog.findUnique({ where: { id } });
  }
  createTest(data) {
    return prisma.labTestCatalog.create({ data });
  }
  updateTest(id, data) {
    return prisma.labTestCatalog.update({ where: { id }, data });
  }
  getAllRequests(filters) {
    return prisma.labRequest.findMany({
      where: { ...filters?.status ? { status: filters.status } : {}, ...filters?.patientId ? { patientId: filters.patientId } : {}, ...filters?.doctorId ? { doctorId: filters.doctorId } : {} },
      include: { labTest: { select: { id: true, testName: true, testCode: true, department: true } }, patient: { select: { id: true, name: true, uhid: true } }, doctor: { select: { id: true, name: true } }, report: true },
      orderBy: { orderedAt: "desc" }
    });
  }
  getRequestById(id) {
    return prisma.labRequest.findUnique({ where: { id }, include: { labTest: true, patient: { select: { id: true, name: true, uhid: true, age: true, gender: true } }, doctor: { select: { id: true, name: true } }, report: true } });
  }
  getRequestsByPatientId(patientId) {
    return prisma.labRequest.findMany({ where: { patientId }, include: { labTest: { select: { id: true, testName: true, testCode: true } }, doctor: { select: { id: true, name: true } }, report: true }, orderBy: { orderedAt: "desc" } });
  }
  async createRequest(data) {
    return prisma.$transaction(async (tx) => {
      const labRequest = await tx.labRequest.create({ data });
      await tx.billingItem.create({ data: { appointmentId: data.appointmentId, category: import_client20.BillingCategory.LAB_TEST, itemId: data.labTestId, itemName: data.testNameSnapshot, quantity: 1, unitPrice: data.priceSnapshot, totalPrice: data.priceSnapshot } });
      await tx.appointment.update({ where: { id: data.appointmentId }, data: { totalAmount: { increment: data.priceSnapshot }, pendingAmount: { increment: data.priceSnapshot } } });
      return labRequest;
    });
  }
  updateRequestStatus(id, status) {
    return prisma.labRequest.update({ where: { id }, data: { status } });
  }
  async createReport(data) {
    return prisma.$transaction(async (tx) => {
      const report = await tx.labReport.create({ data });
      await tx.labRequest.update({ where: { id: data.labRequestId }, data: { status: import_client20.LabRequestStatus.REPORT_UPLOADED } });
      return report;
    });
  }
  getReportById(id) {
    return prisma.labReport.findUnique({ where: { id }, include: { labRequest: { include: { patient: { select: { id: true, name: true, uhid: true } }, doctor: { select: { id: true, name: true } }, labTest: { select: { id: true, testName: true, testCode: true } } } } } });
  }
};

// src/modules/lab/lab.service.ts
var LabService = class {
  repository = new LabRepository();
  getAllTests(includeInactive = false) {
    return this.repository.getAllTests(includeInactive);
  }
  createTest(data) {
    return this.repository.createTest(data);
  }
  updateTest(id, data) {
    return this.repository.updateTest(id, data);
  }
  deactivateTest(id) {
    return this.repository.updateTest(id, { isActive: false });
  }
  getAllRequests(filters) {
    return this.repository.getAllRequests({ status: filters?.status, patientId: filters?.patientId, doctorId: filters?.doctorId });
  }
  getRequestById(id) {
    return this.repository.getRequestById(id);
  }
  getRequestsByPatientId(patientId) {
    return this.repository.getRequestsByPatientId(patientId);
  }
  async createRequest(data) {
    const labTest = await this.repository.getTestById(data.labTestId);
    if (!labTest) throw new Error("Lab test not found");
    if (!labTest.isActive) throw new Error("Lab test is inactive");
    return this.repository.createRequest({ ...data, testNameSnapshot: labTest.testName, priceSnapshot: labTest.price });
  }
  async updateRequestStatus(id, data) {
    const request = await this.repository.getRequestById(id);
    if (!request) throw new Error("Lab request not found");
    return this.repository.updateRequestStatus(id, data.status);
  }
  async createReport(data) {
    const request = await this.repository.getRequestById(data.labRequestId);
    if (!request) throw new Error("Lab request not found");
    if (request.report) throw new Error("Report already exists for this request");
    return this.repository.createReport(data);
  }
  getReportById(id) {
    return this.repository.getReportById(id);
  }
};

// src/modules/lab/lab.controller.ts
var LabController = class {
  service = new LabService();
  getTests = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getAllTests(String(req.query.includeInactive || "false") === "true") });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch lab tests" });
    }
  };
  createTest = async (req, res) => {
    try {
      res.status(201).json({ message: "Lab test created", data: await this.service.createTest(CreateLabTestDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create lab test" });
    }
  };
  updateTest = async (req, res) => {
    try {
      res.status(200).json({ message: "Lab test updated", data: await this.service.updateTest(String(req.params.id), UpdateLabTestDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update lab test" });
    }
  };
  deactivateTest = async (req, res) => {
    try {
      res.status(200).json({ message: "Lab test deactivated", data: await this.service.deactivateTest(String(req.params.id)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to deactivate lab test" });
    }
  };
  getRequests = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getAllRequests({ status: req.query.status ? String(req.query.status) : void 0, patientId: req.query.patientId ? String(req.query.patientId) : void 0, doctorId: req.query.doctorId ? String(req.query.doctorId) : void 0 }) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch lab requests" });
    }
  };
  getRequestById = async (req, res) => {
    try {
      const data = await this.service.getRequestById(String(req.params.id));
      if (!data) {
        res.status(404).json({ message: "Lab request not found" });
        return;
      }
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch lab request" });
    }
  };
  createRequest = async (req, res) => {
    try {
      res.status(201).json({ message: "Lab request created", data: await this.service.createRequest(CreateLabRequestDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create lab request" });
    }
  };
  updateRequestStatus = async (req, res) => {
    try {
      res.status(200).json({ message: "Lab request status updated", data: await this.service.updateRequestStatus(String(req.params.id), UpdateLabRequestStatusDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update status" });
    }
  };
  createReport = async (req, res) => {
    try {
      res.status(201).json({ message: "Lab report uploaded", data: await this.service.createReport(CreateLabReportDto.parse({ ...req.body, labRequestId: req.params.id || req.body.labRequestId })) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create lab report" });
    }
  };
  getReport = async (req, res) => {
    try {
      const data = await this.service.getReportById(String(req.params.id));
      if (!data) {
        res.status(404).json({ message: "Lab report not found" });
        return;
      }
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch lab report" });
    }
  };
  getPatientLabData = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getRequestsByPatientId(String(req.params.patientId)) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch patient lab data" });
    }
  };
};

// src/modules/lab/lab.routes.ts
var router10 = (0, import_express10.Router)();
var controller10 = new LabController();
router10.get("/catalog", authenticate, controller10.getTests);
router10.post("/catalog", authenticate, requireRoles([import_client21.Role.ADMIN, import_client21.Role.SUPERADMIN]), controller10.createTest);
router10.put("/catalog/:id", authenticate, requireRoles([import_client21.Role.ADMIN, import_client21.Role.SUPERADMIN]), controller10.updateTest);
router10.patch("/catalog/:id/deactivate", authenticate, requireRoles([import_client21.Role.ADMIN, import_client21.Role.SUPERADMIN]), controller10.deactivateTest);
router10.get("/requests", authenticate, controller10.getRequests);
router10.get("/requests/:id", authenticate, controller10.getRequestById);
router10.post("/requests", authenticate, requireRoles([import_client21.Role.DOCTOR, import_client21.Role.SUPERADMIN]), controller10.createRequest);
router10.patch("/requests/:id/status", authenticate, requireRoles([import_client21.Role.ADMIN, import_client21.Role.SUPERADMIN]), controller10.updateRequestStatus);
router10.post("/reports", authenticate, requireRoles([import_client21.Role.ADMIN, import_client21.Role.SUPERADMIN]), controller10.createReport);
router10.post("/requests/:id/report", authenticate, requireRoles([import_client21.Role.ADMIN, import_client21.Role.SUPERADMIN]), controller10.createReport);
router10.get("/reports/:id", authenticate, controller10.getReport);
router10.get("/patient/:patientId", authenticate, controller10.getPatientLabData);
var lab_routes_default = router10;

// src/modules/radiology/radiology.routes.ts
var import_express11 = require("express");
var import_client23 = require("@prisma/client");

// src/modules/radiology/radiology.dto.ts
var import_zod12 = require("zod");
var CreateRadiologyTestDto = import_zod12.z.object({
  testName: import_zod12.z.string().min(1),
  modality: import_zod12.z.enum(["X_RAY", "MRI", "CT_SCAN", "ULTRASOUND"]),
  price: import_zod12.z.number().positive(),
  description: import_zod12.z.string().optional()
});
var UpdateRadiologyTestDto = import_zod12.z.object({
  testName: import_zod12.z.string().min(1).optional(),
  modality: import_zod12.z.enum(["X_RAY", "MRI", "CT_SCAN", "ULTRASOUND"]).optional(),
  price: import_zod12.z.number().positive().optional(),
  description: import_zod12.z.string().optional(),
  isActive: import_zod12.z.boolean().optional()
});
var CreateRadiologyRequestDto = import_zod12.z.object({
  visitId: import_zod12.z.string().uuid(),
  appointmentId: import_zod12.z.string().uuid(),
  patientId: import_zod12.z.string().uuid(),
  doctorId: import_zod12.z.string().uuid(),
  radiologyTestId: import_zod12.z.string().uuid(),
  clinicalNotes: import_zod12.z.string().optional()
});
var UpdateRadiologyRequestStatusDto = import_zod12.z.object({
  status: import_zod12.z.enum(["REQUESTED", "SCHEDULED", "REPORT_UPLOADED", "COMPLETED"])
});
var CreateRadiologyReportDto = import_zod12.z.object({
  radiologyRequestId: import_zod12.z.string().uuid(),
  fileUrl: import_zod12.z.string().url(),
  uploadedBy: import_zod12.z.string().min(1),
  reportNotes: import_zod12.z.string().optional()
});

// src/modules/radiology/radiology.repository.ts
var import_client22 = require("@prisma/client");
var RadiologyRepository = class {
  getAllTests(includeInactive = false) {
    return prisma.radiologyTestCatalog.findMany({ where: includeInactive ? {} : { isActive: true }, orderBy: [{ testName: "asc" }] });
  }
  getTestById(id) {
    return prisma.radiologyTestCatalog.findUnique({ where: { id } });
  }
  createTest(data) {
    return prisma.radiologyTestCatalog.create({ data });
  }
  updateTest(id, data) {
    return prisma.radiologyTestCatalog.update({ where: { id }, data });
  }
  getAllRequests(filters) {
    return prisma.radiologyRequest.findMany({
      where: { ...filters?.status ? { status: filters.status } : {}, ...filters?.patientId ? { patientId: filters.patientId } : {}, ...filters?.doctorId ? { doctorId: filters.doctorId } : {} },
      include: { radiologyTest: { select: { id: true, testName: true, modality: true } }, patient: { select: { id: true, name: true, uhid: true } }, doctor: { select: { id: true, name: true } }, report: true },
      orderBy: { orderedAt: "desc" }
    });
  }
  getRequestById(id) {
    return prisma.radiologyRequest.findUnique({ where: { id }, include: { radiologyTest: true, patient: { select: { id: true, name: true, uhid: true, age: true, gender: true } }, doctor: { select: { id: true, name: true } }, report: true } });
  }
  getRequestsByPatientId(patientId) {
    return prisma.radiologyRequest.findMany({ where: { patientId }, include: { radiologyTest: { select: { id: true, testName: true, modality: true } }, doctor: { select: { id: true, name: true } }, report: true }, orderBy: { orderedAt: "desc" } });
  }
  async createRequest(data) {
    return prisma.$transaction(async (tx) => {
      const request = await tx.radiologyRequest.create({ data });
      await tx.billingItem.create({ data: { appointmentId: data.appointmentId, category: import_client22.BillingCategory.RADIOLOGY_TEST, itemId: data.radiologyTestId, itemName: data.testNameSnapshot, quantity: 1, unitPrice: data.priceSnapshot, totalPrice: data.priceSnapshot } });
      await tx.appointment.update({ where: { id: data.appointmentId }, data: { totalAmount: { increment: data.priceSnapshot }, pendingAmount: { increment: data.priceSnapshot } } });
      return request;
    });
  }
  updateRequestStatus(id, status) {
    return prisma.radiologyRequest.update({ where: { id }, data: { status } });
  }
  async createReport(data) {
    return prisma.$transaction(async (tx) => {
      const report = await tx.radiologyReport.create({ data });
      await tx.radiologyRequest.update({ where: { id: data.radiologyRequestId }, data: { status: import_client22.RadiologyRequestStatus.REPORT_UPLOADED } });
      return report;
    });
  }
  getReportById(id) {
    return prisma.radiologyReport.findUnique({ where: { id }, include: { radiologyRequest: { include: { patient: { select: { id: true, name: true, uhid: true } }, doctor: { select: { id: true, name: true } }, radiologyTest: { select: { id: true, testName: true, modality: true } } } } } });
  }
};

// src/modules/radiology/radiology.service.ts
var RadiologyService = class {
  repository = new RadiologyRepository();
  async getAllTests(includeInactive = false, role) {
    const tests = await this.repository.getAllTests(includeInactive);
    return role === "DOCTOR" ? tests.map(({ price: _price, ...rest }) => rest) : tests;
  }
  createTest(data) {
    return this.repository.createTest(data);
  }
  updateTest(id, data) {
    return this.repository.updateTest(id, data);
  }
  deactivateTest(id) {
    return this.repository.updateTest(id, { isActive: false });
  }
  getAllRequests(filters) {
    return this.repository.getAllRequests({ status: filters?.status, patientId: filters?.patientId, doctorId: filters?.doctorId });
  }
  getRequestById(id) {
    return this.repository.getRequestById(id);
  }
  getRequestsByPatientId(patientId) {
    return this.repository.getRequestsByPatientId(patientId);
  }
  async createRequest(data) {
    const test = await this.repository.getTestById(data.radiologyTestId);
    if (!test) throw new Error("Radiology test not found");
    if (!test.isActive) throw new Error("Radiology test is inactive");
    return this.repository.createRequest({ ...data, testNameSnapshot: test.testName, modalitySnapshot: test.modality, priceSnapshot: test.price });
  }
  async updateRequestStatus(id, data) {
    const request = await this.repository.getRequestById(id);
    if (!request) throw new Error("Radiology request not found");
    return this.repository.updateRequestStatus(id, data.status);
  }
  async createReport(data) {
    const request = await this.repository.getRequestById(data.radiologyRequestId);
    if (!request) throw new Error("Radiology request not found");
    if (request.report) throw new Error("Report already exists for this request");
    return this.repository.createReport(data);
  }
  getReportById(id) {
    return this.repository.getReportById(id);
  }
};

// src/modules/radiology/radiology.controller.ts
var RadiologyController = class {
  service = new RadiologyService();
  getTests = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getAllTests(String(req.query.includeInactive || "false") === "true", req.user?.role) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch radiology tests" });
    }
  };
  createTest = async (req, res) => {
    try {
      res.status(201).json({ message: "Radiology test created", data: await this.service.createTest(CreateRadiologyTestDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create radiology test" });
    }
  };
  updateTest = async (req, res) => {
    try {
      res.status(200).json({ message: "Radiology test updated", data: await this.service.updateTest(String(req.params.id), UpdateRadiologyTestDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update radiology test" });
    }
  };
  deactivateTest = async (req, res) => {
    try {
      res.status(200).json({ message: "Radiology test deactivated", data: await this.service.deactivateTest(String(req.params.id)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to deactivate radiology test" });
    }
  };
  getRequests = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getAllRequests({ status: req.query.status ? String(req.query.status) : void 0, patientId: req.query.patientId ? String(req.query.patientId) : void 0, doctorId: req.query.doctorId ? String(req.query.doctorId) : void 0 }) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch radiology requests" });
    }
  };
  getRequestById = async (req, res) => {
    try {
      const data = await this.service.getRequestById(String(req.params.id));
      if (!data) {
        res.status(404).json({ message: "Radiology request not found" });
        return;
      }
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch radiology request" });
    }
  };
  createRequest = async (req, res) => {
    try {
      res.status(201).json({ message: "Radiology request created", data: await this.service.createRequest(CreateRadiologyRequestDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create radiology request" });
    }
  };
  updateRequestStatus = async (req, res) => {
    try {
      res.status(200).json({ message: "Radiology request status updated", data: await this.service.updateRequestStatus(String(req.params.id), UpdateRadiologyRequestStatusDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update status" });
    }
  };
  createReport = async (req, res) => {
    try {
      res.status(201).json({ message: "Radiology report uploaded", data: await this.service.createReport(CreateRadiologyReportDto.parse({ ...req.body, radiologyRequestId: req.params.id || req.body.radiologyRequestId })) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to create radiology report" });
    }
  };
  getReport = async (req, res) => {
    try {
      const data = await this.service.getReportById(String(req.params.id));
      if (!data) {
        res.status(404).json({ message: "Radiology report not found" });
        return;
      }
      res.status(200).json({ data });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch radiology report" });
    }
  };
  getPatientRadiologyData = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getRequestsByPatientId(String(req.params.patientId)) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch patient radiology data" });
    }
  };
};

// src/modules/radiology/radiology.routes.ts
var router11 = (0, import_express11.Router)();
var controller11 = new RadiologyController();
router11.get("/catalog", authenticate, controller11.getTests);
router11.post("/catalog", authenticate, requireRoles([import_client23.Role.ADMIN, import_client23.Role.SUPERADMIN]), controller11.createTest);
router11.put("/catalog/:id", authenticate, requireRoles([import_client23.Role.ADMIN, import_client23.Role.SUPERADMIN]), controller11.updateTest);
router11.patch("/catalog/:id/deactivate", authenticate, requireRoles([import_client23.Role.ADMIN, import_client23.Role.SUPERADMIN]), controller11.deactivateTest);
router11.get("/requests", authenticate, controller11.getRequests);
router11.get("/requests/:id", authenticate, controller11.getRequestById);
router11.post("/requests", authenticate, requireRoles([import_client23.Role.DOCTOR, import_client23.Role.SUPERADMIN]), controller11.createRequest);
router11.patch("/requests/:id/status", authenticate, requireRoles([import_client23.Role.ADMIN, import_client23.Role.SUPERADMIN]), controller11.updateRequestStatus);
router11.post("/reports", authenticate, requireRoles([import_client23.Role.ADMIN, import_client23.Role.SUPERADMIN]), controller11.createReport);
router11.post("/requests/:id/report", authenticate, requireRoles([import_client23.Role.ADMIN, import_client23.Role.SUPERADMIN]), controller11.createReport);
router11.get("/reports/:id", authenticate, controller11.getReport);
router11.get("/patient/:patientId", authenticate, controller11.getPatientRadiologyData);
var radiology_routes_default = router11;

// src/modules/billing/billing.routes.ts
var import_express12 = require("express");
var import_client24 = require("@prisma/client");

// src/modules/billing/billing.dto.ts
var import_zod13 = require("zod");
var CreateBillingItemDto = import_zod13.z.object({
  appointmentId: import_zod13.z.string().uuid(),
  category: import_zod13.z.enum(["CONSULTATION", "REGISTRATION", "LAB_TEST", "RADIOLOGY_TEST", "OTHER"]),
  itemId: import_zod13.z.string().optional(),
  itemName: import_zod13.z.string().min(1),
  quantity: import_zod13.z.number().int().positive(),
  unitPrice: import_zod13.z.number().nonnegative()
});
var UpdateBillingItemDto = import_zod13.z.object({
  itemName: import_zod13.z.string().min(1).optional(),
  quantity: import_zod13.z.number().int().positive().optional(),
  unitPrice: import_zod13.z.number().nonnegative().optional()
});

// src/modules/billing/billing.repository.ts
var BillingRepository = class {
  getItemsByAppointmentId(appointmentId) {
    return prisma.billingItem.findMany({ where: { appointmentId }, orderBy: { createdAt: "asc" } });
  }
  getItemsByPatientId(patientId) {
    return prisma.appointment.findMany({
      where: { patientId },
      select: {
        id: true,
        token: true,
        startTime: true,
        status: true,
        paymentStatus: true,
        totalAmount: true,
        paidAmount: true,
        pendingAmount: true,
        billingItems: { orderBy: { createdAt: "asc" } },
        invoice: { select: { id: true, invoiceNumber: true, status: true, totalAmount: true, netAmount: true, issuedDate: true } }
      },
      orderBy: { startTime: "desc" }
    });
  }
  createItem(data) {
    return prisma.billingItem.create({ data });
  }
  updateItem(id, data) {
    return prisma.billingItem.update({ where: { id }, data });
  }
  deleteItem(id) {
    return prisma.billingItem.delete({ where: { id } });
  }
  getItemById(id) {
    return prisma.billingItem.findUnique({ where: { id } });
  }
};

// src/modules/billing/billing.service.ts
var BillingService = class {
  repository = new BillingRepository();
  getItemsByAppointmentId(appointmentId) {
    return this.repository.getItemsByAppointmentId(appointmentId);
  }
  getItemsByPatientId(patientId) {
    return this.repository.getItemsByPatientId(patientId);
  }
  createItem(data) {
    return this.repository.createItem({ ...data, category: data.category, totalPrice: data.quantity * data.unitPrice });
  }
  async updateItem(id, data) {
    const existing = await this.repository.getItemById(id);
    if (!existing) throw new Error("Billing item not found");
    const quantity = data.quantity ?? existing.quantity;
    const unitPrice = data.unitPrice ?? existing.unitPrice;
    return this.repository.updateItem(id, { ...data, totalPrice: quantity * unitPrice });
  }
  async deleteItem(id) {
    const existing = await this.repository.getItemById(id);
    if (!existing) throw new Error("Billing item not found");
    return this.repository.deleteItem(id);
  }
};

// src/modules/billing/billing.controller.ts
var BillingController = class {
  service = new BillingService();
  getByAppointment = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getItemsByAppointmentId(String(req.params.id)) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch billing items" });
    }
  };
  getByPatient = async (req, res) => {
    try {
      res.status(200).json({ data: await this.service.getItemsByPatientId(String(req.params.patientId)) });
    } catch (err) {
      res.status(500).json({ message: err.message || "Failed to fetch patient billing history" });
    }
  };
  createItem = async (req, res) => {
    try {
      res.status(201).json({ message: "Billing item added", data: await this.service.createItem(CreateBillingItemDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to add billing item" });
    }
  };
  updateItem = async (req, res) => {
    try {
      res.status(200).json({ message: "Billing item updated", data: await this.service.updateItem(String(req.params.id), UpdateBillingItemDto.parse(req.body)) });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to update billing item" });
    }
  };
  deleteItem = async (req, res) => {
    try {
      await this.service.deleteItem(String(req.params.id));
      res.status(200).json({ message: "Billing item removed" });
    } catch (err) {
      res.status(400).json({ message: err.message || "Failed to remove billing item" });
    }
  };
};

// src/modules/billing/billing.routes.ts
var router12 = (0, import_express12.Router)();
var controller12 = new BillingController();
router12.get("/appointment/:id", authenticate, controller12.getByAppointment);
router12.get("/patient/:patientId", authenticate, controller12.getByPatient);
router12.post("/", authenticate, requireRoles([import_client24.Role.ADMIN, import_client24.Role.SUPERADMIN, import_client24.Role.RECEPTIONIST]), controller12.createItem);
router12.put("/:id", authenticate, requireRoles([import_client24.Role.ADMIN, import_client24.Role.SUPERADMIN, import_client24.Role.RECEPTIONIST]), controller12.updateItem);
router12.delete("/:id", authenticate, requireRoles([import_client24.Role.ADMIN, import_client24.Role.SUPERADMIN]), controller12.deleteItem);
var billing_routes_default = router12;

// src/modules/invoice/invoice.routes.ts
var import_express13 = require("express");
var import_client26 = require("@prisma/client");

// src/modules/invoice/invoice.dto.ts
var import_client25 = require("@prisma/client");
var import_zod14 = require("zod");
var GenerateInvoiceDto = import_zod14.z.object({
  taxRate: import_zod14.z.number().min(0).max(1).optional(),
  status: import_zod14.z.nativeEnum(import_client25.InvoiceStatus).optional()
});
var UpdateInvoiceStatusDto = import_zod14.z.object({
  status: import_zod14.z.nativeEnum(import_client25.InvoiceStatus)
});

// src/modules/invoice/invoice.controller.ts
var InvoiceController = class {
  service = new InvoiceService();
  generate = async (req, res) => {
    try {
      const data = await this.service.generateInvoice(String(req.params.appointmentId), GenerateInvoiceDto.parse(req.body ?? {}));
      res.status(201).json({ message: "Invoice generated", data });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to generate invoice" });
    }
  };
  getByAppointment = async (req, res) => {
    try {
      const data = await this.service.getByAppointmentId(String(req.params.appointmentId));
      if (!data) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch invoice" });
    }
  };
  getByPatient = async (req, res) => {
    try {
      const data = await this.service.getByPatientId(String(req.params.patientId));
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch invoices" });
    }
  };
  getById = async (req, res) => {
    try {
      const data = await this.service.getById(String(req.params.id));
      if (!data) {
        res.status(404).json({ message: "Invoice not found" });
        return;
      }
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch invoice" });
    }
  };
  updateStatus = async (req, res) => {
    try {
      const data = await this.service.updateStatus(String(req.params.id), UpdateInvoiceStatusDto.parse(req.body).status);
      res.status(200).json({ message: "Invoice status updated", data });
    } catch (error) {
      res.status(400).json({ message: error.message || "Failed to update invoice status" });
    }
  };
};

// src/modules/invoice/invoice.routes.ts
var router13 = (0, import_express13.Router)();
var controller13 = new InvoiceController();
router13.post("/generate/:appointmentId", authenticate, requireRoles([import_client26.Role.ADMIN, import_client26.Role.SUPERADMIN, import_client26.Role.RECEPTIONIST]), controller13.generate);
router13.get("/appointment/:appointmentId", authenticate, controller13.getByAppointment);
router13.get("/patient/:patientId", authenticate, controller13.getByPatient);
router13.get("/:id", authenticate, controller13.getById);
router13.patch("/:id/status", authenticate, requireRoles([import_client26.Role.ADMIN, import_client26.Role.SUPERADMIN, import_client26.Role.RECEPTIONIST]), controller13.updateStatus);
var invoice_routes_default = router13;

// src/modules/analytics/analytics.routes.ts
var import_express14 = require("express");
var import_client28 = require("@prisma/client");

// src/modules/analytics/analytics.repository.ts
var import_client27 = require("@prisma/client");
var AnalyticsRepository = class {
  async revenueByBucket(unit, start, end) {
    return prisma.$queryRaw(import_client27.Prisma.sql`
      SELECT date_trunc(${unit}, "paymentDate") AS bucket, COALESCE(SUM(amount), 0)::float AS amount
      FROM "Payment"
      WHERE "paymentDate" >= ${start} AND "paymentDate" <= ${end}
      GROUP BY 1
      ORDER BY 1 ASC
    `);
  }
  getDailyRevenue(start, end) {
    return this.revenueByBucket("day", start, end);
  }
  getWeeklyRevenue(start, end) {
    return this.revenueByBucket("week", start, end);
  }
  getMonthlyRevenue(start, end) {
    return this.revenueByBucket("month", start, end);
  }
  getYearlyRevenue(start, end) {
    return this.revenueByBucket("year", start, end);
  }
  getPaymentMethodRevenue(start, end) {
    return prisma.payment.groupBy({
      by: ["paymentMode"],
      where: start && end ? { paymentDate: { gte: start, lte: end } } : void 0,
      _sum: { amount: true },
      orderBy: { paymentMode: "asc" }
    });
  }
  getCashFlowSummary(start, end) {
    return prisma.payment.groupBy({
      by: ["paymentMode"],
      where: { paymentDate: { gte: start, lte: end } },
      _sum: { amount: true }
    });
  }
  getDepartmentRevenue(start, end) {
    return prisma.$queryRaw(import_client27.Prisma.sql`
      SELECT d.id AS "departmentId", d.name AS "departmentName", COALESCE(SUM(bi."totalPrice"), 0)::float AS revenue
      FROM "BillingItem" bi
      JOIN "Appointment" a ON a.id = bi."appointmentId"
      JOIN "DoctorProfile" dp ON dp.id = a."doctorId"
      JOIN "Department" d ON d.id = dp."departmentId"
      WHERE ${start && end ? import_client27.Prisma.sql`bi."createdAt" >= ${start} AND bi."createdAt" <= ${end}` : import_client27.Prisma.sql`TRUE`}
      GROUP BY d.id, d.name
      ORDER BY revenue DESC, d.name ASC
    `);
  }
  getDoctorRevenue(start, end) {
    return prisma.$queryRaw(import_client27.Prisma.sql`
      SELECT
        dp.id AS "doctorId",
        dp.name AS "doctorName",
        COALESCE(SUM(CASE WHEN bi.category = 'CONSULTATION' THEN bi."totalPrice" ELSE 0 END), 0)::float AS "consultationRevenue",
        COALESCE(SUM(CASE WHEN bi.category IN ('LAB_TEST', 'RADIOLOGY_TEST') THEN bi."totalPrice" ELSE 0 END), 0)::float AS "diagnosticRevenue",
        COALESCE(SUM(bi."totalPrice"), 0)::float AS "totalRevenue"
      FROM "BillingItem" bi
      JOIN "Appointment" a ON a.id = bi."appointmentId"
      JOIN "DoctorProfile" dp ON dp.id = a."doctorId"
      WHERE ${start && end ? import_client27.Prisma.sql`bi."createdAt" >= ${start} AND bi."createdAt" <= ${end}` : import_client27.Prisma.sql`TRUE`}
      GROUP BY dp.id, dp.name
      ORDER BY "totalRevenue" DESC, dp.name ASC
    `);
  }
  getPatientRevenue(start, end) {
    return prisma.$queryRaw(import_client27.Prisma.sql`
      SELECT
        p.id AS "patientId",
        p.name AS "patientName",
        COALESCE(SUM(a."totalAmount"), 0)::float AS "totalBilled",
        COALESCE(SUM(a."paidAmount"), 0)::float AS "totalPaid",
        COALESCE(SUM(a."pendingAmount"), 0)::float AS "outstandingBalance"
      FROM "Appointment" a
      JOIN "Patient" p ON p.id = a."patientId"
      WHERE ${start && end ? import_client27.Prisma.sql`a."createdAt" >= ${start} AND a."createdAt" <= ${end}` : import_client27.Prisma.sql`TRUE`}
      GROUP BY p.id, p.name
      ORDER BY "totalBilled" DESC, p.name ASC
    `);
  }
  getLabRevenue(start, end) {
    return prisma.labRequest.aggregate({
      where: start && end ? { orderedAt: { gte: start, lte: end } } : void 0,
      _sum: { priceSnapshot: true },
      _count: { id: true }
    });
  }
  getRadiologyRevenue(start, end) {
    return prisma.radiologyRequest.aggregate({
      where: start && end ? { orderedAt: { gte: start, lte: end } } : void 0,
      _sum: { priceSnapshot: true },
      _count: { id: true }
    });
  }
};

// src/modules/analytics/analytics.service.ts
var AnalyticsService = class {
  repository = new AnalyticsRepository();
  buildRange(days) {
    const end = /* @__PURE__ */ new Date();
    const start = /* @__PURE__ */ new Date();
    start.setDate(start.getDate() - days);
    start.setHours(0, 0, 0, 0);
    return { start, end };
  }
  getDailyRevenue() {
    const { start, end } = this.buildRange(30);
    return this.repository.getDailyRevenue(start, end);
  }
  getWeeklyRevenue() {
    const { start, end } = this.buildRange(84);
    return this.repository.getWeeklyRevenue(start, end);
  }
  getMonthlyRevenue() {
    const { start, end } = this.buildRange(365);
    return this.repository.getMonthlyRevenue(start, end);
  }
  getYearlyRevenue() {
    const end = /* @__PURE__ */ new Date();
    const start = /* @__PURE__ */ new Date();
    start.setFullYear(start.getFullYear() - 5);
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
    return this.repository.getYearlyRevenue(start, end);
  }
  getPaymentMethods() {
    return this.repository.getPaymentMethodRevenue();
  }
  getDepartmentRevenue() {
    return this.repository.getDepartmentRevenue();
  }
  getDoctorRevenue() {
    return this.repository.getDoctorRevenue();
  }
  getPatientRevenue() {
    return this.repository.getPatientRevenue();
  }
  async getLabRevenue() {
    const result = await this.repository.getLabRevenue();
    return {
      totalRevenue: result._sum.priceSnapshot ?? 0,
      totalRequests: result._count.id ?? 0
    };
  }
  async getRadiologyRevenue() {
    const result = await this.repository.getRadiologyRevenue();
    return {
      totalRevenue: result._sum.priceSnapshot ?? 0,
      totalRequests: result._count.id ?? 0
    };
  }
  async getCashFlow() {
    const start = /* @__PURE__ */ new Date();
    start.setHours(0, 0, 0, 0);
    const end = /* @__PURE__ */ new Date();
    const rows = await this.repository.getCashFlowSummary(start, end);
    const summary = rows.reduce((acc, row) => {
      acc[row.paymentMode] = row._sum.amount ?? 0;
      return acc;
    }, {});
    return {
      totalCollectedToday: Object.values(summary).reduce((sum, value) => sum + value, 0),
      byMode: summary
    };
  }
};

// src/modules/analytics/analytics.controller.ts
var AnalyticsController = class {
  service = new AnalyticsService();
  getDailyRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getDailyRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch daily revenue" });
    }
  };
  getWeeklyRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getWeeklyRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch weekly revenue" });
    }
  };
  getMonthlyRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getMonthlyRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch monthly revenue" });
    }
  };
  getYearlyRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getYearlyRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch yearly revenue" });
    }
  };
  getPaymentMethods = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getPaymentMethods() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch payment analytics" });
    }
  };
  getDepartmentRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getDepartmentRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch department revenue" });
    }
  };
  getDoctorRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getDoctorRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch doctor revenue" });
    }
  };
  getPatientRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getPatientRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch patient revenue" });
    }
  };
  getLabRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getLabRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch lab revenue" });
    }
  };
  getRadiologyRevenue = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getRadiologyRevenue() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch radiology revenue" });
    }
  };
  getCashFlow = async (_req, res) => {
    try {
      res.status(200).json({ data: await this.service.getCashFlow() });
    } catch (error) {
      res.status(500).json({ message: error.message || "Failed to fetch cash flow analytics" });
    }
  };
};

// src/modules/analytics/analytics.routes.ts
var router14 = (0, import_express14.Router)();
var controller14 = new AnalyticsController();
router14.use(authenticate, requireRoles([import_client28.Role.ADMIN, import_client28.Role.SUPERADMIN]));
router14.get("/revenue/daily", controller14.getDailyRevenue);
router14.get("/revenue/weekly", controller14.getWeeklyRevenue);
router14.get("/revenue/monthly", controller14.getMonthlyRevenue);
router14.get("/revenue/yearly", controller14.getYearlyRevenue);
router14.get("/payment-methods", controller14.getPaymentMethods);
router14.get("/department-revenue", controller14.getDepartmentRevenue);
router14.get("/doctor-revenue", controller14.getDoctorRevenue);
router14.get("/patient-revenue", controller14.getPatientRevenue);
router14.get("/lab-revenue", controller14.getLabRevenue);
router14.get("/radiology-revenue", controller14.getRadiologyRevenue);
router14.get("/cash-flow", controller14.getCashFlow);
var analytics_routes_default = router14;

// src/index.ts
import_dotenv.default.config();
var app = (0, import_express15.default)();
var port = process.env.PORT || 5e3;
app.use((0, import_helmet.default)());
app.use(import_helmet.default.crossOriginResourcePolicy({ policy: "cross-origin" }));
var authLimiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  limit: process.env.NODE_ENV === "production" ? 100 : 1e3,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  skip: () => process.env.NODE_ENV !== "production",
  message: { message: "Too many requests, please try again later." }
});
app.use((0, import_cors.default)({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true
}));
app.use(import_express15.default.json());
app.use((0, import_cookie_parser.default)());
app.use("/api/auth", authLimiter, auth_routes_default);
app.use("/api/admins", admin_routes_default);
app.use("/api/doctors", doctor_routes_default);
app.use("/api/receptionists", receptionist_routes_default);
app.use("/api/patients", patient_routes_default);
app.use("/api/bookings", booking_routes_default);
app.use("/api/settings", settings_routes_default);
app.use("/api/medical-reports", medical_report_routes_default);
app.use("/api/departments", department_routes_default);
app.use("/api/lab", lab_routes_default);
app.use("/api/radiology", radiology_routes_default);
app.use("/api/billing", billing_routes_default);
app.use("/api/invoices", invoice_routes_default);
app.use("/api/analytics", analytics_routes_default);
app.use("/uploads", import_express15.default.static(import_path2.default.join(__dirname, "../../uploads")));
app.post("/api/upload", authenticate, upload.single("file"), (req, res) => {
  try {
    const fileReq = req;
    if (!fileReq.file) {
      res.status(400).json({ message: "No file provided" });
      return;
    }
    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${fileReq.file.filename}`;
    res.status(201).json({ url: fileUrl, filename: fileReq.file.originalname });
  } catch (error) {
    res.status(500).json({ message: "Upload failed", error: error.message });
  }
});
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Hospital Management API is running" });
});
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", message: "Hospital Management API is running from 10.03.2026" });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
