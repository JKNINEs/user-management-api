import { z } from "zod";
import { prisma } from "../config/db.js";

export const validateBody = (schema) =>{
    return (req,res,next) =>{
        try{

            // Zod ตรวจสอบข้อมูลใน req.body
            schema.parse(req.body);
            // ถ้าผ่าน (ไม่ Error) ให้เรียก next() ไปหา Controller
            next();
        }catch (error){
            // ถ้าไม่ผ่าน Zod จะโยน Error กลับมา เราจะดักจับแล้วส่ง Status 400
            if (error instanceof z.ZodError){

                //ดึงข้อมูลจาก error.issues ก่อน (มาตรฐาน Zod) ถ้าไม่มีค่อยไปหา error.errors
                const zodIssues = error.issues || error.errors;
                // 2. ดึงแล้วยังมีค่า ให้เอามา .map (ใส่ ? เผื่อถ้ามันยังเป็น undefined อีกจะได้ไม่พัง)
                const errorMessages = zodIssues?.map((err) => ({

                    // บางครั้ง err.path อาจจะว่างเปล่า เราเลยเช็คเผื่อไว้ด้วย
                    field: err.path && err.path.length > 0 ? err.path[0] : "unknown_field",
                    message: err.message
                }));

                return res.status(400).json({
                    status: "error",
                    errors: errorMessages
                });
            }
            // ถ้าพังเรื่องอื่น
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}