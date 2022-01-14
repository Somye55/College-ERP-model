const mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost:27017/srms', {
//     useNewUrlParser: true,
//     // useCreateIndex:true,
//     useUnifiedTopology: true
// })
//     .then(() => {
//         console.log("CONNECTED!");
//     })
//     .catch(err => {
//         console.log("NOPE!")
//     });
const studentSchema = new mongoose.Schema({
    username: {
        type:Number,
        required:true,
        min: 13,
    },
    password:{
        type: Number,
        required:true,
        min: 13

    },
    name:{
        type: String,
        required:true,
        
    },
    role: {
        type: String,
        required: true,
        enum: ['student','admin']


    }

});
const Student = new mongoose.model('Student',studentSchema);
module.exports = Student;

