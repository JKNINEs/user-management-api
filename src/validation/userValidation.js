import {z} from "zod";

export const createUserSchema = z.object({
    name: z.string({ required_error: "Name is required" })
        .min(1, "Name cannot be empty"),
    dob: z.string().optional().nullable(),
    address: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
});

export const updateUserSchema = z.object({
    name: z.string().min(1, "Name cannot be empty").optional(),
    address: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    
    //  Zod ให้แปลง วันที่ (String) กลายเป็น Date Object 
    dob: z.string().optional().nullable().transform((val) => {
        if (!val || val.trim() === "") return null; // ถ้าส่งค่าว่างมา แปลงเป็น null 
        return new Date(val); // ถ้ามีค่า ส่งเป็น Date ให้ Prisma ใช้ได้เลย
    }),
})
// คำสั่ง .refine() คือการตั้งกฎพิเศษ บังคับว่า Object ต้องมีข้อมูลข้างในอย่างน้อย 1 อย่าง
.refine((data) => Object.keys(data).length > 0, {
    message: "กรุณาส่งข้อมูลที่ต้องการอัปเดตมาอย่างน้อย 1 อย่าง",
    path: ["body"] 
});

