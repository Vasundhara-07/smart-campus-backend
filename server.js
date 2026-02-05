const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.connect("mongodb://127.0.0.1:27017/smartcampus")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

/* ================= SCHEMAS ================= */
const Student = mongoose.model("Student", {
  name: String,
  course: String
});

const Attendance = mongoose.model("Attendance", {
  name: String,
  present: String
});

const Notice = mongoose.model("Notice", {
  text: String
});

const Timetable = mongoose.model("Timetable", {
  day: String,
  subject: String,
  time: String
});

/* ================= LOGIN ================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === "admin" && password === "1234")
    res.json({ success: true, role: "admin" });

  else if (username === "student" && password === "1234")
    res.json({ success: true, role: "student" });

  else
    res.json({ success: false });
});

/* ================= STUDENTS CRUD ================= */
app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json({ message: "Student Added" });
});

app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

app.put("/students/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Student Updated" });
});

app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Student Deleted" });
});

/* ================= ATTENDANCE ================= */
app.post("/attendance", async (req, res) => {
  const record = new Attendance(req.body);
  await record.save();
  res.json({ message: "Attendance Saved" });
});

app.get("/attendance", async (req, res) => {
  const records = await Attendance.find();
  res.json(records);
});

/* ================= NOTICES ================= */
app.get("/notices", async (req, res) => {
  const notices = await Notice.find();
  res.json(notices);
});

/* ================= TIMETABLE ================= */
app.get("/timetable", async (req, res) => {
  const data = await Timetable.find();
  res.json(data);
});

/* ================= SERVER ================= */
app.listen(process.env.PORT || 5000, () =>
  console.log("Server running 🚀")
);
