//server\services\university.service.js
import prisma from "../config/prismaClient.js";

export const getDashboardData = async () => {
  const universities = await prisma.university.findMany({
    select: {
      id: true,
      name: true,
      schools: {
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              students: true,
              parents: true,
              teachers: true,
              StaffProfile: true
            }
          }
        }
      }
    }
  });

  return universities.map((uni) => ({
    id: uni.id,
    name: uni.name,
    totalSchools: uni.schools.length,
    schools: uni.schools.map((school) => ({
      id: school.id,
      name: school.name,
      studentCount: school._count.students,
      teacherCount: school._count.teachers,
      parentCount: school._count.parents,
      staffCount: school._count.StaffProfile
    }))
  }));
};