import { prisma } from "../config/db.js";

const getUsers = async (req,res) =>{
    try {
        const { name } = req.query;

        const users = await prisma.user.findMany({
            where: name ? {name: name} : {},
        });
        res.status(200).json
        ({ status: "success",
           data: users });

    }catch(err){
        console.log("Error fatching user:",err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const getUserById = async (req,res) =>{
    try{
        const {id} = req.params;

        const user = await prisma.user.findUnique({
            where: {id:id},
        });

        if (!user){
            return res.status(404).json({
                status: "error",
                error: "Not found user"
            });
        }
        
        res.status(200).json({
            status: "success",
            data: user
        })

    } catch (error){
        console.error("Error fetching user by Id",error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


const createUser = async (req,res) =>{
    try{
        const { name, dob, address, description } = req.body;

        // 1. Validation เบื้องต้น: ชื่อต้องห้ามว่าง
        if (!name) {
            return res.status(400).json({ error: "Name is not required" });
        }
        
        // 2. จัดการข้อมูล (Data Preparation): ถ้าส่ง dob เป็นค่าว่างมา ให้แปลงเป็น nul
        let parsedDob = null;
        if (dob && dob.trim() !== "") {
            parsedDob = new Date(dob);
        }
        
        // Create
        const createuser = await prisma.user.create({
            data: {
                name,
                dob: parsedDob,
                address,
                description
            },
        });

        res.status(201).json({
            status: "success",
            message: "User created successfully",
            data: createuser
        })
    }catch(error){
        console.error("Error creating product", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

const updateUser = async (req,res) =>{
    try{
        const {name,dob,address,description} = req.body;

        const userUpdate = await prisma.user.findUnique({
            where: {id: req.params.id},
        });

        if (!userUpdate){
            return res.status(404).json({error: "user Not found"})
        }

        // Build update date
        const updateData = {};
        if(name !== undefined) updateData.name = name;
        if(address !== undefined) updateData.address = address;
        if(description !== undefined) updateData.description = description;

        // 3. จัดการกรณีส่ง dob (วันเกิด) มาอัปเดต
        if (dob !== undefined) {
            if (dob.trim() === "") {
                updateData.dob = null;
            } else {
                // srt to date
                updateData.dob = new Date(dob);
            }
        }

        const updateItem = await prisma.user.update({
            where: {id: req.params.id},
            data: updateData,
        });

        res.status(200).json({
            status: "success",
            message: "User updated successfully",
            data: updateData
        });
    }catch (error) {
        console.error("Error updating user",error);
        res.status(500).json({error:"Internal Server Error"})

    }
}

const deleteUser = async(req,res) =>{
    try{
        const existingUser = await prisma.user.findUnique({
            where:{id:req.params.id},
        });

        if (!existingUser){
            return res.status(404).json({error: "user not found"});
        }

        await prisma.user.delete({
            where: {id: req.params.id},
        });

        res.status(200).json({
            status: "success",
            message: "User removed from database"
        });

    } catch (error){
        console.error("Error Remove User", error);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export { getUsers, getUserById, createUser, updateUser, deleteUser };