// lib/users.ts
interface User {
  id: string;
  email: string;
  password?: string; // Should be hashed in real app
  role: string;
  name: string;
}

const users: User[] = [
  {
    id: 'user1',
    email: 'gestionnaire@example.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$6O53cO6+0V+f6yE0U72Nqw$N25dK7iU/uY71L2064t254jW6Jb81xM0jM94c5w628s',
    role: 'gestionnaire',
    name: 'Gestionnaire Test',
  },
  {
    id: 'user2',
    email: 'secretaire@example.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$6O53cO6+0V+f6yE0U72Nqw$N25dK7iU/uY71L2064t254jW6Jb81xM0jM94c5w628s',
    role: 'secretaire',
    name: 'Secretaire Test',
  },
  {
    id: 'user3',
    email: 'magasinier@example.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$6O53cO6+0V+f6yE0U72Nqw$N25dK7iU/uY71L2064t254jW6Jb81xM0jM94c5w628s',
    role: 'magasinier',
    name: 'Magasinier Test',
  },
  {
    id: 'user4',
    email: 'agent@example.com',
    password:
      '$argon2id$v=19$m=65536,t=3,p=4$6O53cO6+0V+f6yE0U72Nqw$N25dK7iU/uY71L2064t254jW6Jb81xM0jM94c5w628s',
    role: 'agent',
    name: 'Agent Test',
  },
];

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const user = users.find((user) => user.email === email);
  return user ? user : null;
};
