import { Router } from "express";
import { supabase } from "../supabaseClient";
import * as bcrypt from "bcrypt";

const router = Router();

/* =========================
   GET ALL USERS
========================= */
router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("*");

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

/* =========================
   GET USER BY ID
========================= */
router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(data);
});

/* =========================
   CREATE USER (POST)
========================= */
router.post("/", async (req, res) => {
  const {
    email,
    username,
    password,
    firstname,
    lastname,
    phone,
    street,
    number,
    city,
    zipcode,
    lat,
    long,
    __v
  } = req.body;

  // VALIDATION
  if (
    !email ||
    !username ||
    !password ||
    !firstname ||
    !lastname ||
    !phone ||
    !street ||
    !number ||
    !city ||
    !zipcode ||
    !lat ||
    !long
  ) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          email,
          username,
          password: hashedPassword,
          firstname,
          lastname,
          phone,
          street,
          number,
          city,
          zipcode,
          lat,
          long,
          __v: __v ?? 0
        }
      ])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json(data);

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* =========================
   UPDATE USER (PUT)
========================= */
router.put("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData: any = { ...req.body };

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const { data, error } = await supabase
    .from("users")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (!data) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(data);
});

/* =========================
   DELETE USER
========================= */
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const { error, count } = await supabase
    .from("users")
    .delete({ count: "exact" })
    .eq("id", id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  if (count === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ message: "User deleted successfully" });
});

export default router;
