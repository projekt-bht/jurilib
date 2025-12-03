import { jest } from '@jest/globals';

import { ValidationError } from '@/error/validationErrors';

const mockHash = jest.fn() as jest.Mock<any>;
const mockFindUnique = jest.fn() as jest.Mock<any>;
const mockCreate = jest.fn() as jest.Mock<any>;

jest.unstable_mockModule('bcryptjs', () => ({
  default: { hash: mockHash },
}));

jest.unstable_mockModule('@/lib/db', () => {
  const mockPrisma = {
    user: {
      findUnique: mockFindUnique,
      create: mockCreate,
    },
  };
  return { default: mockPrisma, prisma: mockPrisma };
});

const { createUser } = await import('./services');

describe('createUser service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('creates user when input is valid', async () => {
    mockFindUnique.mockResolvedValue(null);
    mockHash.mockResolvedValue('hashed-pw');
    mockCreate.mockResolvedValue({
      id: 'user-1',
      name: 'Alice',
      email: 'alice@example.com',
      password: 'hashed-pw',
      type: 'USER',
    });

    const user = await createUser({
      name: 'Alice',
      email: 'alice@example.com',
      password: 'supersecret',
      type: 'USER',
    });

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'alice@example.com' },
      select: { id: true },
    });
    expect(mockHash).toHaveBeenCalledWith('supersecret', 10);
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        name: 'Alice',
        email: 'alice@example.com',
        password: 'hashed-pw',
        type: 'USER',
      },
    });
    expect(user.id).toBe('user-1');
  });

  test('throws ValidationError when required fields missing', async () => {
    await expect(
      createUser({
        email: 'alice@example.com',
        password: 'supersecret',
      } as any)
    ).rejects.toBeInstanceOf(ValidationError);
  });

  test('throws ValidationError when password too short', async () => {
    await expect(
      createUser({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'short',
        type: 'USER',
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });
  test('throws ValidationError on duplicate email', async () => {
    mockFindUnique.mockResolvedValue({ id: 'existing' });

    await expect(
      createUser({
        name: 'Alice',
        email: 'alice@example.com',
        password: 'supersecret',
        type: 'USER',
      })
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
