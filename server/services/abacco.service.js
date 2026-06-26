//server\services\abacco.service.js
import prisma from "../config/prismaClient.js";

export const createAbaccoAdmin = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error("All fields are required");
  }

  // check if already exists
  const existing = await prisma.abaccoAdmin.findUnique({
    where: { email }
  });

  if (existing) {
    throw new Error("Email already registered");
  }

  // ❌ NO HASH (as per your request)
  const admin = await prisma.abaccoAdmin.create({
    data: {
      name,
      email,
      password
    }
  });

  return admin;
};

export const loginAbaccoService = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const admin = await prisma.abaccoAdmin.findUnique({
    where: { email }
  });

  if (!admin) {
    throw new Error("Admin not found");
  }

  // ❌ plain text compare
  if (admin.password !== password) {
    throw new Error("Invalid password");
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email
  };
};