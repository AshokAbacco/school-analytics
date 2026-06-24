// server/services/access_control.service.js

import prisma from "../config/prismaClient.js";

// ── FETCH ─────────────────────────────────────────────────────────────────────
export const fetchAccessControlData = async () => {
  const universities = await prisma.university.findMany({
    select: {
      id: true,
      name: true,
      code: true,
      email: true,
      phone: true,
      isActive: true,
      isDeactivated: true,
      deactivatedAt: true,
      createdAt: true,
      superAdmins: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
        },
      },
      schools: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return universities.map((uni) => ({
    id: uni.id,
    name: uni.name,
    code: uni.code,
    email: uni.email,
    phone: uni.phone,
    isActive: uni.isActive,
    isDeactivated: uni.isDeactivated,
    deactivatedAt: uni.deactivatedAt,
    createdAt: uni.createdAt,
    totalSchools: uni.schools.length,
    superAdmins: uni.superAdmins,
  }));
};

// ── TOGGLE UNIVERSITY ─────────────────────────────────────────────────────────
// Reactivate:  isDeactivated→false, deactivatedAt→null, isActive→true,  all superAdmins isActive→true
// Deactivate:  isDeactivated→true,  deactivatedAt→now,  isActive→false, all superAdmins isActive→false
export const toggleUniversity = async (id) => {
  const university = await prisma.university.findUnique({
    where: { id },
    select: { isDeactivated: true },
  });

  if (!university) throw new Error("University not found");

  const reactivating = university.isDeactivated;

  const [updatedUni] = await prisma.$transaction([
    prisma.university.update({
      where: { id },
      data: {
        isDeactivated: !reactivating,
        deactivatedAt: reactivating ? null : new Date(),
        isActive: reactivating ? true : false,
      },
    }),
    prisma.superAdmin.updateMany({
      where: { universityId: id },
      data: {
        isActive: reactivating ? true : false,
      },
    }),
  ]);

  return updatedUni;
};

// ── TOGGLE SUPER ADMIN ────────────────────────────────────────────────────────
// Individual super admin toggle — does NOT touch the university itself
export const toggleSuperAdmin = async (id) => {
  const admin = await prisma.superAdmin.findUnique({
    where: { id },
    select: { isActive: true },
  });

  if (!admin) throw new Error("Super admin not found");

  const updated = await prisma.superAdmin.update({
    where: { id },
    data: { isActive: !admin.isActive },
  });

  return updated;
};