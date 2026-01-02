import { Router } from "express";
import { supabase } from "../supabaseClient";

const router = Router();

// GET ALL
router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET BY ID
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ message: 'Product not found' });
  res.json(data);
});

// POST
router.post('/', async (req, res) => {
  const { title, description, price, category, image, rating } = req.body;
  if (!title || !description || !price || !category || !image || !rating)
    return res.status(400).json({ message: 'Missing required fields' });

  const { data, error } = await supabase
    .from('products')
    .insert([{ title, description, price, category, image, rate: rating.rate, count: rating.count }])
    .select()
    .single();
    
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

// PUT
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const updateData = { ...req.body };

  // Handle rating object flattening
  if (updateData.rating) {
    updateData.rate = updateData.rating.rate;
    updateData.count = updateData.rating.count;
    delete updateData.rating;
  }
  
  const { data, error } = await supabase
    .from('products')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ message: 'Product not found' });
  res.json(data);
});

// DELETE
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { error, count } = await supabase.from('products').delete({ count: 'exact' }).eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }
  
  if (count === 0) {
    return res.status(404).json({ message: 'Product not found' });
  }

  res.json({ message: 'Product deleted successfully' });
});

export default router;
