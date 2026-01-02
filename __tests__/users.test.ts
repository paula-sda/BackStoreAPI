
import request from 'supertest';
import app from '../app';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcrypt';

// --- Mockear dependencias ---
jest.mock('../supabaseClient', () => ({
  __esModule: true,
  supabase: {
    from: jest.fn(), // <-- ¡Esta es la corrección clave!
  },
}));
jest.mock('bcrypt');

const mockedSupabase = supabase as jest.Mocked<typeof supabase>;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

// --- Mocks para Supabase ---
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

describe('/api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mockedBcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
  });

  describe('GET /', () => {
    it('should return a list of users', async () => {
      const mockUsers = [{ id: 1, username: 'user1' }];
      selectMock.mockResolvedValueOnce({ data: mockUsers, error: null });
      const response = await request(app).get('/api/users');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUsers);
    });
  });

  describe('POST /', () => {
    const newUser = {
        email: 'test@test.com', username: 'testuser', password: 'password123',
        firstname: 'Test', lastname: 'User', phone: '123456789',
        street: 'Main St', number: '123', city: 'Testville', zipcode: '12345',
        lat: '1.0', long: '2.0'
    };

    it('should create a new user and return it', async () => {
      const createdUser = { id: 1, ...newUser, password: 'hashed_password' };
      selectMock.mockReturnValueOnce({ single: singleMock });
      singleMock.mockResolvedValueOnce({ data: createdUser, error: null });

      const response = await request(app).post('/api/users').send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(createdUser);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
    });
  });

  describe('PUT /:id', () => {
    it('should update a user and return it', async () => {
      const userUpdate = { username: "updateduser" };
      const updatedUser = { id: 1, username: "updateduser" };
      eqMock.mockReturnValueOnce({ select: selectMock });
      selectMock.mockReturnValueOnce({ single: singleMock });
      singleMock.mockResolvedValueOnce({ data: updatedUser, error: null });

      const response = await request(app).put('/api/users/1').send(userUpdate);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedUser);
    });

     it('should hash password if it is being updated', async () => {
        const passwordUpdate = { password: "newpassword" };
        eqMock.mockReturnValueOnce({ select: selectMock });
        selectMock.mockReturnValueOnce({ single: singleMock });
        singleMock.mockResolvedValueOnce({ data: { id: 1, password: 'hashed_new_password' }, error: null });

        await request(app).put('/api/users/1').send(passwordUpdate);

        expect(mockedBcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    });
  });

  describe('DELETE /:id', () => {
    it('should delete a user and return a success message', async () => {
      eqMock.mockResolvedValueOnce({ error: null, count: 1 });

      const response = await request(app).delete('/api/users/1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'User deleted successfully' });
      expect(eqMock).toHaveBeenCalledWith('id', 1);
    });

    it('should return 404 if user to delete is not found', async () => {
      eqMock.mockResolvedValueOnce({ error: null, count: 0 });
      const response = await request(app).delete('/api/users/999');
      expect(response.status).toBe(404);
    });
  });
});
