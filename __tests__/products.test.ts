
import request from 'supertest';
import app from '../app';
import { supabase } from '../supabaseClient';

// Mockear explícitamente la estructura de supabase
jest.mock('../supabaseClient', () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(), // <-- Corrección clave
  },
}));

const mockedSupabase = supabase as jest.Mocked<typeof supabase>;

// --- Mocks para las funciones encadenadas de Supabase ---
const selectMock = jest.fn();
const insertMock = jest.fn();
const updateMock = jest.fn();
const deleteMock = jest.fn();
const eqMock = jest.fn();
const singleMock = jest.fn();

(mockedSupabase.from as jest.Mock).mockReturnValue({
  select: selectMock,
  insert: insertMock,
  update: updateMock,
  delete: deleteMock,
});

selectMock.mockReturnValue({ eq: eqMock, single: singleMock });
insertMock.mockReturnValue({ select: selectMock });
updateMock.mockReturnValue({ eq: eqMock });
deleteMock.mockReturnValue({ eq: eqMock });
eqMock.mockReturnValue({ select: selectMock, single: singleMock });


describe('/api/products', () => {
  beforeEach(() => {
    // Limpiar todos los mocks antes de cada prueba
    (mockedSupabase.from as jest.Mock).mockClear();
    selectMock.mockClear();
    insertMock.mockClear();
    updateMock.mockClear();
    deleteMock.mockClear();
    eqMock.mockClear();
    singleMock.mockClear();
    
    // Restaurar la configuración por defecto del mock de .from
    (mockedSupabase.from as jest.Mock).mockReturnValue({
        select: selectMock, insert: insertMock, update: updateMock, delete: deleteMock
    });
  });

  describe('GET /', () => {
    it('should return a list of products', async () => {
      const mockProducts = [{ id: 1, title: 'Product 1' }];
      selectMock.mockResolvedValueOnce({ data: mockProducts, error: null });
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });

    it('should return 500 on database error', async () => {
      const mockError = { message: 'Database error' };
      selectMock.mockResolvedValueOnce({ data: null, error: mockError });
      const response = await request(app).get('/api/products');
      expect(response.status).toBe(500);
    });
  });

  describe('POST /', () => {
    it('should create a new product and return it', async () => {
      const newProduct = { title: 'New Product', description: 'A great one', price: 100, category: 'cat', image: 'img.png', rating: { rate: 5, count: 1 } };
      const createdProduct = { id: 1, ...newProduct };
      selectMock.mockReturnValueOnce({ single: singleMock });
      singleMock.mockResolvedValueOnce({ data: createdProduct, error: null });
      const response = await request(app).post('/api/products').send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdProduct);
    });
  });

  describe('PUT /:id', () => {
    it('should update a product and return it', async () => {
        const productUpdate = { title: "Updated Title" };
        const updatedProduct = { id: 1, title: "Updated Title" };
        eqMock.mockReturnValueOnce({ select: selectMock });
        selectMock.mockReturnValueOnce({ single: singleMock });
        singleMock.mockResolvedValueOnce({ data: updatedProduct, error: null });
        const response = await request(app).put('/api/products/1').send(productUpdate);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(updatedProduct);
    });

    it('should return 404 if product not found', async () => {
        // CORRECTO: Simular que no se encuentra data, sin error.
        eqMock.mockReturnValueOnce({ select: selectMock });
        selectMock.mockReturnValueOnce({ single: singleMock });
        singleMock.mockResolvedValueOnce({ data: null, error: null }); 
        const response = await request(app).put('/api/products/999').send({ title: 'ghost' });
        expect(response.status).toBe(404);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a product and return a success message', async () => {
        eqMock.mockResolvedValueOnce({ error: null, count: 1 });
        const response = await request(app).delete('/api/products/1');
        expect(response.status).toBe(200);
    });

    it('should return 404 if product to delete is not found', async () => {
        eqMock.mockResolvedValueOnce({ error: null, count: 0 });
        const response = await request(app).delete('/api/products/999');
        expect(response.status).toBe(404);
    });
  });
});
