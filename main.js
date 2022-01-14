
const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require("path");
const flash = require('connect-flash')
const Student = require('./Schema');
const session = require('express-session')
const ejsMate = require('ejs-mate')
app.use(session({secret:'session-code',resave:false,saveUninitialized:false,httpOnly:true,cookie:{
    expires: Date.now() + 1000 + 60 + 60+ 24 + 7,
    maxAge: 1000 + 60 + 60+ 24 + 7
}}))
// const cookie = require('cookie-parser')
const methodOverride = require('method-override')
app.engine('ejs',ejsMate)
app.set('view engine','ejs')
app.use(express.urlencoded({ extended: true }));
const router = express.Router();
app.use(methodOverride('_method'))
app.use(flash())
// app.use(cookie())
const adminRoutes = require('./routes/admin')
const studentRoutes = require('./routes/student')
// app.set('views', path.join('project1','views'))
mongoose.connect('mongodb://localhost:27017/srms', {
    useNewUrlParser: true,
    // useCreateIndex:true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("CONNECTED TO MONGO!");
    })
    .catch(err => {
        console.log("NOT CONNECTED TO MONGO!")
    });
    app.listen(5000,()=>{
    console.log("CONENCTED TO LOCAL HOST 5000!")
    
});

const requireLogin = ((req,res,next)=>{
    console.log(req.session.user_id)
    if(!req.session.user_id){
       return res.redirect('/login')
    }
    next();
    
})
app.get('/logout',(req,res)=>{
    console.log(req.session.user_id)
    req.session.user_id = null
    res.redirect('/login')
})

app.post('/login',async (req,res,next)=>{
    const {username,password} = req.body;
    
    if(req.body.login == 'student'){
        let findstudent = await Student.findOne({username,role:'student'});
        // console.log(req.body)
        
        if(findstudent && password == findstudent.password){
            req.session.user_id = findstudent._id
            console.log(req.session.user_id)
            req.flash('success','Welcome back')
        res.redirect(`/student/home/${findstudent._id}`)
        
    }
    
        else{
            req.flash('failure','Incorrect Username or Password!')
            console.log('Incorrect Username or Password!')
            res.redirect('/login')
        
        }
    }
    else{  
        let findstudent = await Student.findOne({username,role:'admin'});  
        console.log(findstudent)
        if(findstudent && password == findstudent.password){
             req.session.user_id = findstudent._id
             console.log(req.session.user_id)
             req.flash('success','Welcome back')
        res.redirect(`/admin/home/${findstudent._id}`)
        next();
    }
    else{
        req.flash('failure','Incorrect Username or Password!')
        console.log('Incorrect Username or Password!')
    res.redirect('/login')
}}
next();
})


app.use((req,res,next)=>{
    res.locals.success = req.flash('success')
    next();
})
app.use((req,res,next)=>{
    res.locals.failure = req.flash('failure')
    next();
})

app.get(`/student/home/:id`,async (req,res)=>{
    const {id} = req.params

    const findstudent = await Student.findById(id);
    
    // console.log(findstudent)
   res.render('./student/loggedin',{findstudent})
    
})    
app.get('/student/study_material/assignments/:id',async (req,res)=>{
    const {id} = req.params

    const findadmin = await Student.findById(id);
    console.log(findadmin)
    
    // console.log(findstudent)
   res.render('./student/asspage',{findadmin})
    
})    
app.get('/student/study_material/notes/:id',async (req,res)=>{
    const {id} = req.params

    const findadmin = await Student.findById(id);
    console.log(findadmin)
    
    // console.log(findstudent)
   res.render('./student/notespage',{findadmin})
    
})    
app.get('/student/study_material/tutorials/:id',async (req,res)=>{
    const {id} = req.params

    const findadmin = await Student.findById(id);
    console.log(findadmin)
    
    // console.log(findstudent)
   res.render('./student/tutpage',{findadmin})
    
})    
app.get('/student/study_material/others/:id',async (req,res)=>{
    const {id} = req.params

    const findadmin = await Student.findById(id);
    console.log(findadmin)
    
    // console.log(findstudent)
   res.render('./student/otherspage',{findadmin})
    
})    
app.get('/student/view_profile/:id',async (req,res)=>{
    const {id} = req.params

    const findstudent = await Student.findById(id);
   res.render('./student/viewprof',{findstudent})
    
})    
app.get('/student/circulars/:id',async (req,res)=>{
    const {id} = req.params

    const findadmin = await Student.findById(id);
   res.render('./student/circulars',{findadmin})
    
})  
app.get('/student/faculty_helpdesk/:id',async (req,res)=>{
    const {id} = req.params

    const findstudent = await Student.findById(id);
   res.render('./student/faculty',{findstudent})
    
})  
  
app.get('/project1/:file',(req,res)=>{
    const {file} = req.params
    console.log(file)
   res.render(`/project1/${file}`)
    
})  
  
app.get('/student/study_material/others/',(req,res)=>{   
})    
app.get('/labmanual.pdf',(req,res)=>{  
    res.download('./views/student/labmanual.pdf') 
})    
app.get('/handbook.pdf',(req,res)=>{  
    res.download('./views/student/handbook.pdf') 
})    

app.get('/login', (req,res)=>{
    
    res.render('./admin/login')
})
app.use('/admin/', adminRoutes)

app.put('/admin/database/:id1/:id/update_stud',async (req,res)=>{
    const {id} = req.params
    const {id1} = req.params
    const updatead = await Student.findOneAndUpdate((req.body.id,{role:'admin'}),(req.body),{runValidators:true})
    const findadmin = await Student.findById(id1)
    res.redirect(`/admin/database/view_database_admin/${id1}`)

})
app.put('/admin/database/:id1/:id/update_student',async (req,res)=>{
    const {id} = req.params
    const {id1} = req.params
    const updatead = await Student.findOneAndUpdate((req.body.id,{role:'student'}),(req.body),{runValidators:true})
    // console.log(updatead)
    const findadmin = await Student.findById(id1)
    // res.redirect('/admin/home/:id')
    res.redirect(`/admin/database/view_database_student/${id1}`)

})
app.delete('/admin/database/del_stud/:id1/:id',async (req,res)=>{
    const{id} = req.params
    const{id1} = req.params
    const findadmin = await Student.findById(id1)
    // console.log(id)
    const delstud = await Student.findByIdAndDelete(id)
    res.redirect(`/admin/home/${id1}`)

})
app.post('/admin/student/:id',async(req,res)=>{
    const {id} = req.params
    const loginstud = new Student(req.body);
    loginstud.role = 'student'
    console.log(loginstud)
    await loginstud.save()
    res.redirect(`/admin/home/${id}`)
})
app.post('/admin/admin/:id', async(req,res)=>{
    const {id} = req.params
    const loginad = new Student(req.body);
    loginad.role = 'admin'
    console.log(loginad)
    await loginad.save()
    res.redirect(`/admin/home/${id}`)
})
app.get('/student/polls/:id',(req,res)=>{
    console.log(req.session.user_id)
    if(req.session.user_id){
        res.send("Verified")
    }
    else{
        res.send("nope")
    }
})
app.get('/student/about_us/:id',async (req,res)=>{
    const {id} = req.params
    const findstudent = await Student.findById(id)
    res.render('./student/aboutus',{findstudent})
})
    
 
app.get('*',(req,res)=>{
    res.render('./student/error404')
})
