import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { UserModel,ContentModel, LinkModel } from './db';
const app = express();
app.use(express.json());
import { JWT_PASSWORD } from './config';
import { userMiddleware } from './middleware';
import { random } from './util';
import cors from "cors"
app.use(cors())


app.post("/api/v1/signin",async (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if(existingUser){
        const token = jwt.sign({
            id : existingUser._id
        },JWT_PASSWORD)
        res.json({
            token
        })
       
    }
    else{
        res.status(403).json({
            message : "incorrect credentials"
        })
    }



})




app.post("/api/v1/signup",async (req,res) => {
    //Zod valodation,hash the password
    const username = req.body.username;
    const password = req.body.password;
    try {
        await UserModel.create({
            username : username,
            password : password
        })
        res.json({
            message : "User SignedUp"
        })
    
    }
    catch(e){
        res.status(411).json({
            message  :"User already exists"
        })
    }
    
})



app.post("/api/v1/content",userMiddleware,async (req,res) => {
    const link = req.body.link;
    const title = req.body.title;
    await ContentModel.create({
        link,
        title,
        //@ts-ignore
        userId : req.userId,
        tags : []

        
    })
    res.json({
        message : "Content added"
    })


    
})




app.get("/api/v1/content",userMiddleware,async (req,res) => {
    //@ts-ignore
    const userId = req.userId
    const content = await ContentModel.find({
        userId : userId
    }).populate("userId","username")
    res.json({
        content
    })
    
})



app.delete("/api/v1/content",userMiddleware,async(req,res) => {
    const contentId = req.body.contentId;
    await ContentModel.deleteOne({
        contentId,
        //@ts-ignore
        userId : req.userId
    })
    res.json({
        message : "deleted successfully"
    })
    
})




app.post("/api/v1/brain/share",userMiddleware,async(req,res) => {
    const share = req.body.share;
    const hash = random(10) 
    if(share){
        await LinkModel.create({
            //@ts-ignore
            userId : req.userId,
            hash : hash

        })
        
        
    }
    else{
        await LinkModel.deleteOne({
            //@ts-ignore
            userId : req.userId
        })
    }
    res.json({
        message : "/share/" + hash
    })

    

})



app.get("/api/v1/brain/:shareLink",async(req,res) => {
    const hash = req.params.shareLink;
    const link =  await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(411).json({
            message : "Sorry Incorrect Input"
        })
        return;
    }
    
    const content = await ContentModel.find({
            //@ts-ignore
            userId : link.userId
        })
        res.json({
            content
        })
    



})

app.listen(3000);


