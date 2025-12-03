import { jest } from '@jest/globals';

import { ValidationError } from '@/error/validationErrors';

const mockCreateUser = jest.fn() as jest.MockedFunction<any>;

jest.unstable_mockModule('./services', () => ({
  createUser: mockCreateUser,
}));

const { NextRequest } = await import('next/server');
const { POST } = await import('./route');

describe('User route POST', () => {
  const baseUrl = 'http://localhost/api/user';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns 201 and user payload on success', async () => {
    mockCreateUser.mockResolvedValue({
      id: 'user-id-1',
      name: 'Tester',
      email: 'test@example.com',
      password: 'hashed',
      type: 'USER',
    });

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Tester',
        email: 'test@example.com',
        password: '12345678',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(mockCreateUser).toHaveBeenCalledWith({
      name: 'Tester',
      email: 'test@example.com',
      password: '12345678',
    });
    expect(res.status).toBe(201);
    expect(json.user).toEqual({
      id: 'user-id-1',
      name: 'Tester',
      email: 'test@example.com',
    });
  });

  test('maps ValidationError to 400', async () => {
    mockCreateUser.mockRejectedValue(
      new ValidationError('invalidInput', 'requiredFields', undefined, 400)
    );

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(400);
    expect(json.error).toBe('The given input is invalid.');
  });

  test('returns 500 on unexpected errors', async () => {
    mockCreateUser.mockRejectedValue(new Error('boom'));

    const req = new NextRequest(baseUrl, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        name: 'Tester',
        email: 'test@example.com',
        password: '12345678',
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(500);
    expect(json.error).toBe('Interner Serverfehler');
  });
});
