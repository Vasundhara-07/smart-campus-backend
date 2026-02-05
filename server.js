const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

/* ================= DATABASE ================= */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
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

/* ================= STUDENTS ================= */
app.post("/students", async (req, res) => {
  const student = new Student(req.body);
  await student.save();
  res.json({ message: "Student Added" });
});

app.get("/students", async (req, res) => {
  res.json(await Student.find());
});

app.put("/students/:id", async (req, res) => {
  await Student.findByIdAndUpdate(req.params.id, req.body);
  res.json({ message: "Updated" });
});

app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

/* ================= ATTENDANCE ================= */
app.post("/attendance", async (req, res) => {
  await new Attendance(req.body).save();
  res.json({ message: "Saved" });
});

app.get("/attendance", async (req, res) => {
  res.json(await Attendance.find());
});

/* ================= NOTICES ================= */
app.get("/notices", async (req, res) => {
  res.json(await Notice.find());
});

/* ================= TIMETABLE ================= */
app.get("/timetable", async (req, res) => {
  res.json(await Timetable.find());
});

/* ================= SEED DATA (RUN ONCE) ================= */
app.get("/seed", async (req, res) => {
  await Notice.insertMany([
    { text: "Mid exams start Monday" },
    { text: "Campus closed on Friday" },
    { text: "Project submission deadline next week" }
  ]);

  await Timetable.insertMany([
    { day: "Monday", subject: "Maths", time: "9:00 AM" },
    { day: "Tuesday", subject: "Physics", time: "10:00 AM" },
    { day: "Wednesday", subject: "Chemistry", time: "11:00 AM" },
    { day: "Thursday", subject: "English", time: "12:00 PM" },
    { day: "Friday", subject: "Computer Science", time: "1:00 PM" }
  ]);

  res.send("Database Seeded");
});

/* ================= SERVER ================= */
app.listen(process.env.PORT || 5000, () =>
  console.log("Server running 🚀")
);
