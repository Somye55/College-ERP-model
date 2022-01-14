const express = require('express');
const Student = require('../Schema')
const router = express.Router();
const mongoose = require('mongoose');
const ejs = require('ejs')
const app = express()
app.use(express.urlencoded({ extended: true }));
const methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.set('view engine','ejs')
router.get('/login',(req,res)=>{
    res.send("login page!")
})
const requireLogin = ((req,res,next)=>{
    if(!req.session.user_id){
       return res.redirect('/login')
    }
    else{
        next();
    }
})
router.get(`/home/:id`, async (req,res,next)=>{
    const findadmin = await Student.findById(req.params.id)
    req.flash('success')  
    res.render('./admin/databasemenu',{findadmin})
   
})
router.get('/database/view/:id1/:id',async (req,res)=>{
    const {id1} = req.params;
    const {id} = req.params;
    console.log(id,id1)
    const findadmin = await Student.findById(id1)
    const stud = await Student.findById(id)
    console.log(stud,findadmin)
    if(stud.role == 'admin'){
        res.render('./admin/view',{stud,findadmin})
    }
    else{
        res.render('./student/view',{stud,findadmin})
    }
    
})
router.get('/database/new_student/:id', async (req,res)=>{
    const {id} = req.params
    const findadmin = await Student.findById(id) 
    console.log(findadmin)
    res.render('./student/new',{findadmin})
})
router.get('/database/new_admin/:id',async (req,res)=>{
    const {id} = req.params
    const findadmin = await Student.findById(id) 
    res.render('./admin/new',{findadmin})
})
// router.get('/database/update_student',(req,res)=>{
//     res.send('student')
// })
// router.get('/database/update_admin',async (req,res)=>{
//     const admins = await Student.find({role:'admin'})
//     res.render('./admin/update',{admins})
// })
// router.get('/database/delete_student',(req,res)=>{
//     res.render('./student/delete')
// })
// router.get('/database/delete_admin',(req,res)=>{
//     res.render('./admin/delete')
// })
// router.get('/database/update:id',async (req,res)=>{
//     const {id} = req.params
//     const updatawait Student.finById(id)
//     res.render('./admin/update')
// })
router.get('/database/view_database_student/:id',async (req,res)=>{
    const findadmin =  await Student.findById(req.params.id)
    const students =  await Student.find({role:'student'})
    res.render("./databasestudent",{students,findadmin})
})
router.get('/database/view_database_admin/:id',async (req,res)=>{
    const findadmin =  await Student.findById(req.params.id)
    const admins = await Student.find({role: 'admin'})
    // res.render('./admin/viewdat',{admins})
    res.render('./databaseadmin',{admins,findadmin})
})
module.exports = router;

