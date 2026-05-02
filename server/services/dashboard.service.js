import prisma from "../config/prismaClient.js";

export const getDashboardAnalytics = async () => {
  // =========================
  // TOTAL COUNTS
  // =========================

  const totalSchools = await prisma.school.count();

  const totalUniversities =
    await prisma.university.count();

  const totalSubscriptions =
    await prisma.subscription.count({
      where: {
        status: "ACTIVE",
      },
    });

  // =========================
  // PAYMENTS
  // =========================

  const payments = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      school: {
        include: {
          university: true,
        },
      },

      Subscription: {
        include: {
          plan: true,
        },
      },
    },
  });

  // =========================
  // REVENUE
  // =========================

  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS"
  );

  const totalRevenue =
    successfulPayments.reduce(
      (acc, item) =>
        acc + Number(item.amount),
      0
    );

  // =========================
  // MONTHLY REVENUE
  // =========================

  const currentMonth = new Date().getMonth();

  const currentYear = new Date().getFullYear();

  const monthlyRevenue =
    successfulPayments
      .filter((payment) => {
        const date = new Date(
          payment.createdAt
        );

        return (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        );
      })
      .reduce(
        (acc, item) =>
          acc + Number(item.amount),
        0
      );

  // =========================
  // UNIVERSITY ANALYTICS
  // =========================

  const universityMap = {};

  successfulPayments.forEach((payment) => {
    const universityName =
      payment.school?.university?.name ||
      "Unknown University";

    if (!universityMap[universityName]) {
      universityMap[universityName] = {
        universityName,
        revenue: 0,
        schools: new Set(),
      };
    }

    universityMap[
      universityName
    ].revenue += Number(payment.amount);

    if (payment.school?.name) {
      universityMap[
        universityName
      ].schools.add(
        payment.school.name
      );
    }
  });

  const universityAnalytics =
    Object.values(universityMap).map(
      (item) => ({
        universityName:
          item.universityName,

        revenue: item.revenue,

        totalSchools:
          item.schools.size,
      })
    );

  // =========================
  // PLAN ANALYTICS
  // =========================

  const planMap = {};

  successfulPayments.forEach((payment) => {
    const subscriptions =
      payment.Subscription || [];

    subscriptions.forEach((sub) => {
      const planName =
        sub.plan?.name || "Basic Plan";

      if (!planMap[planName]) {
        planMap[planName] = {
          planName,
          revenue: 0,
          subscriptions: 0,
        };
      }

      planMap[planName]
        .revenue += Number(
        payment.amount
      );

      planMap[
        planName
      ].subscriptions += 1;
    });
  });

  const planAnalytics =
    Object.values(planMap);

  // =========================
  // RECENT PAYMENTS
  // =========================

  const recentPayments =
    payments.slice(0, 10).map(
      (payment) => ({
        id: payment.id,

        school:
          payment.school?.name ||
          payment.schoolName,

        university:
          payment.school?.university
            ?.name ||
          "Unknown University",

        amount: payment.amount,

        status: payment.status,

        plan:
          payment.Subscription?.[0]
            ?.plan?.name ||
          "Basic Plan",

        createdAt:
          payment.createdAt,
      })
    );

  // =========================
  // RETURN
  // =========================

  return {
    summary: {
      totalRevenue,
      monthlyRevenue,
      totalSchools,
      totalUniversities,
      totalSubscriptions,
    },

    universityAnalytics,

    planAnalytics,

    recentPayments,
  };
};