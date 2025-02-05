import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import pg from "pg";

const app=  express();
const port=3000;
const API_URl="https://covers.openlibrary.org/b/isbn/0545790352-S.jpg";

const db=new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"BookSite",
    password:"Shivesh@123",
    port:5432
});
db.connect();

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",async (req,res)=>{
    res.render("index.ejs");
});
app.post("/reviews",async (req,res)=>{
    const result= await db.query("SELECT * FROM books ORDER BY id DESC");
  const data=result.rows;
   res.render("reviews.ejs",{data:data});
});
app.get("/create",async (req,res)=>{
    res.render("create.ejs",{but:"Submit"});
});
app.post("/submit",async (req,res)=>{
    const name=req.body.name;
    const author=req.body.author;
    const isbn=req.body.isbn;
    const description=req.body.description;
    const rating=req.body.rating;

    await db.query("INSERT INTO books (name,author,rating,isbn,description) VALUES ($1,$2,$3,$4,$5)",[name,author,rating,isbn,description]);
    const result= await db.query("SELECT * FROM books ORDER BY id DESC");
    const data=result.rows;
    res.render("reviews.ejs",{data:data});
});

app.post("/search", async(req,res)=>{
    const input=req.body.searched;
   const result= await db.query("SELECT * FROM books WHERE name LIKE '%' || $1 || '%' ORDER BY id DESC;",[input]);
   const data=result.rows;
   res.render("reviews.ejs",{data:data})
});
app.post("/sort",async (req,res)=>{
    const result= await db.query("SELECT * FROM books ORDER BY rating DESC");
    const data=result.rows;
     res.render("reviews.ejs",{data:data});
});
app.post("/edit",async(req,res)=>{
    const id=req.body.editId;
    const result= await db.query("SELECT * FROM books WHERE id=$1",[id]);
  const data=result.rows[0];
    res.render("create.ejs",{but:"Update",info:data});
});
app.post("/update",async(req,res)=>{
    const id=req.body.updateid;
    const name=req.body.name;
    const author=req.body.author;
    const isbn=req.body.isbn;
    const description=req.body.description;
    const rating=req.body.rating;
    await db.query("UPDATE books  SET name=$1,author=$2,rating=$3,isbn=$4,description=$5 WHERE id=$6 ",[name,author,rating,isbn,description,id]);
    const result= await db.query("SELECT * FROM books ORDER BY id DESC");
    const data=result.rows;
    res.render("reviews.ejs",{data:data});
});
app.post("/delete",async(req,res)=>{
    const id=req.body.deleteId;
    await db.query("DELETE FROM books WHERE id=$1",[id]);
    const result= await db.query("SELECT * FROM books ORDER BY id DESC");
    const data=result.rows;
     res.render("reviews.ejs",{data:data});
});

app.listen(port,()=>{
    console.log(`Server running on port ${port}..`);
});