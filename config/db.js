import { connect } from "mongoose";
import { get } from "config";

const db = get('mongoURI');

const connectDB = async () =>{
    try{
        await connect(db,{
            useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: false,
			useUnifiedTopology: true
        });

        console.log("connected to DB!");
    }catch(err){
        console.error(err.message);
        //Exit process on failure
        process.exit(1);
    }
}

export default connectDB;