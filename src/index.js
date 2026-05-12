import express from 'express'
import { config } from 'dotenv';
import { connectDB, disconnectDB } from './config/db.js';

// Import Swagger
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

// import Routes
import userrouts from "./routes/userRoutes.js"


config();
connectDB();
const app = express();

app.use(express.json());


// 2. ตั้งค่าหน้าปกเอกสาร ( API เราชื่ออะไร เวอร์ชั่นไหน)
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Wiredcraft User API ',
            version: '1.0.0',
            description: 'คู่มือการใช้งาน API สำหรับจัดการระบบผู้ใช้งาน',
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
            },
        ],
    },
    // บอกให้ Swagger ไปตามหาคอมเมนต์ในโฟลเดอร์ routes ของเรา
    apis: ['./src/routes/*.js'], 
};

// 3. สร้างเส้นทางสำหรับดูเอกสาร (เข้าผ่าน /api-docs)
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// API Routes
app.use("/users",userrouts);


if (process.env.NODE_ENV !== 'test') {
    connectDB();

    const port = process.env.PORT || 3001;

    app.listen(port, "0.0.0.0", () => {
        console.log(`http://localhost:${port}`);
    });
}

export default app;


