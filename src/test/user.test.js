import request from 'supertest';
import app from '../index.js'; 
import { prisma } from '../config/db.js'; 

describe(" ทดสอบ User API (Full CRUD)", () => {
    
    // ตัวแปรกลางสำหรับเก็บ ID ของ User ที่เพิ่งสร้าง 
    // เพื่อเอาไปใช้เทสต์เส้น GET, PATCH, DELETE ต่อ
    let testUserId; 

    
    // 1. Tests สำหรับเส้นทาง POST (Create)
    
    it("1. [POST] ควรจะคืนค่า Status 400 ถ้าไม่ส่งชื่อ (name) มา", async () => {
        const res = await request(app)
            .post("/users")
            .send({
                dob: "1995-10-25",
                address: "Bangkok"
            });

        expect(res.status).toBe(400);
        expect(res.body.status).toBe("error"); 
        expect(res.body.errors[0].field).toBe("name");
    });

    it("2. [POST] ควรจะสร้าง User สำเร็จและได้ Status 201 ถ้าข้อมูลครบ", async () => {
        const res = await request(app)
            .post("/users")
            .send({
                name: "John Test",
                dob: "1990-01-01",
                address: "Test City",
                description: "Testing API"
            });

        expect(res.status).toBe(201);
        expect(res.body.status).toBe("success");
        expect(res.body.data.name).toBe("John Test");
        expect(res.body.data).toHaveProperty("id"); 

        //  สำคัญ: เก็บ ID ไว้ใช้ในเทสต์ข้อถัดๆ ไป!
        testUserId = res.body.data.id;
    });

   
    // 2. Tests สำหรับเส้นทาง GET (Read)
   
    it("3. [GET] ควรจะดึงข้อมูล User ทั้งหมดได้ (Status 200)", async () => {
        const res = await request(app).get("/users");
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(Array.isArray(res.body.data)).toBe(true); // ข้อมูลต้องมาเป็น Array
    });

    it("4. [GET /:id] ควรจะดึงข้อมูล User รายบุคคลได้ถูกต้อง", async () => {
        // เอา testUserId ที่ได้จากข้อ 2 มาใช้
        const res = await request(app).get(`/users/${testUserId}`);
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data.id).toBe(testUserId);
        expect(res.body.data.name).toBe("John Test");
    });

    it("5. [GET /:id] ควรจะคืนค่า Status 404 ถ้าหา ID ไม่เจอ", async () => {
        // จำลองสถานการณ์ใส่ ID มั่วๆ ที่เป็น UUID ปลอม
        const fakeId = "123e4567-e89b-12d3-a456-426614174000";
        const res = await request(app).get(`/users/${fakeId}`);
        
        expect(res.status).toBe(404);
        expect(res.body.status).toBe("error");
    });

    // 3. Tests สำหรับเส้นทาง PATCH (Update)
    
    it("6. [PATCH /:id] ควรจะอัปเดตข้อมูลบางส่วนได้ (Partial Update)", async () => {
        const res = await request(app)
            .patch(`/users/${testUserId}`)
            .send({
                name: "John Updated", // ลองเปลี่ยนแค่ชื่อ
                address: "New City"   // เปลี่ยนเมือง
            });
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.data.name).toBe("John Updated"); // ชื่อต้องเปลี่ยน
        expect(res.body.data.address).toBe("New City");
    });

    
    // 4. Tests สำหรับเส้นทาง DELETE (Delete)
    
    it("7. [DELETE /:id] ควรจะลบข้อมูล User ได้สำเร็จ", async () => {
        const res = await request(app).delete(`/users/${testUserId}`);
        
        expect(res.status).toBe(200);
        expect(res.body.status).toBe("success");
        expect(res.body.message).toBe("User removed from database");
    });

    it("8. [GET /:id] ควรจะหา User ไม่เจอแล้วหลังจากถูกลบไป (ตรวจสอบความแน่ใจ)", async () => {
        const res = await request(app).get(`/users/${testUserId}`);
        
        // ควรจะได้ 404 เพราะลบไปแล้วในเทสต์ข้อ 7
        expect(res.status).toBe(404); 
    });

    
    // Cleanup: สั่งปิดการเชื่อมต่อ Database 
   
    afterAll(async () => {
        await prisma.$disconnect();
    });
});