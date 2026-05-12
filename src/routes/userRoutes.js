import express from 'express';
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/wiredcraftController.js";
import { validateBody } from '../middleware/usermiddleware.js';
import { createUserSchema, updateUserSchema } from '../validation/userValidation.js';

const router = express.Router();

// ==========================================
// 1. Collection Routes (จัดการข้อมูลแบบกลุ่ม)
// ==========================================

/**
 * @swagger
 * /users:
 *   get:
 *     summary: ดึงข้อมูลผู้ใช้งานทั้งหมด
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ ได้รับ Array ของผู้ใช้งาน
 *       500:
 *         description: เซิร์ฟเวอร์มีปัญหา
 */
router.get("/", getUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: สร้างผู้ใช้งานใหม่
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               dob:
 *                 type: string
 *                 example: "1995-10-25"
 *               address:
 *                 type: string
 *                 example: "Bangkok"
 *               description:
 *                 type: string
 *                 example: "I was born at Thailand"
 *     responses:
 *       201:
 *         description: สร้างสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน (Validation Error)
 */
router.post("/", validateBody(createUserSchema), createUser);

// ==========================================
// 2. Item Routes (จัดการข้อมูลแบบรายบุคคล โดยอ้างอิงจาก ID)
// ==========================================

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: ดึงข้อมูลเฉพาะ Id ที่ต้องการ
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของผู้ใช้งาน
 *     responses:
 *       200:
 *         description: ดึงข้อมูลสำเร็จ ได้รับ Object ของผู้ใช้งาน
 *       404:
 *         description: Not found user
 *       500:
 *         description: เซิร์ฟเวอร์มีปัญหา
 */
router.get("/:id", getUserById);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: แก้ไขหรืออัปเดต user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของผู้ใช้งาน
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               dob:
 *                 type: string
 *                 example: "1995-10-25"
 *               address:
 *                 type: string
 *                 example: "Bangkok"
 *               description:
 *                 type: string
 *                 example: "I was born at Thailand"
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 *       400:
 *         description: ข้อมูลไม่ครบถ้วน (Validation Error)
 *       404:
 *         description: Not found user
 *       500:
 *         description: เซิร์ฟเวอร์มีปัญหา
 */
router.patch("/:id", validateBody(updateUserSchema), updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: ลบข้อมูลเฉพาะ Id ที่ต้องการ
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของผู้ใช้งาน
 *     responses:
 *       200:
 *         description: User removed from database
 *       404:
 *         description: Not found user
 *       500:
 *         description: เซิร์ฟเวอร์มีปัญหา
 */
router.delete("/:id", deleteUser);

export default router;