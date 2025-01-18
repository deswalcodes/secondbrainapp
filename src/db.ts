import mongoose, { Schema } from "mongoose";


mongoose.connect("mongodb+srv://priyanshudeswal92:nv81yRGKDOlcJDlV@cluster0.sgjzb.mongodb.net/brainly" 
  
);


const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const ContentSchema = new Schema ({
    title : String,
    link : String,
    tags : [{type:mongoose.Types.ObjectId,ref : 'Tag'}],
    userId : {type:mongoose.Types.ObjectId,ref : 'User',requires : true}
})


export const UserModel = mongoose.model("User", UserSchema);
export const ContentModel = mongoose.model("Content",ContentSchema)