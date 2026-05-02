import prisma from "../config/prismaClient.js";

export const getPaymentsAnalytics = async () => {
  const payments = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      school: {
        select: {
          id: true,
          name: true,
          type: true,

          university: {
            select: {
              id: true,
              name: true,
            },
          },
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
  // ALL PAYMENTS
  // =========================
  const successfulPayments = payments;

  // =========================
  // TOTAL REVENUE
  // =========================
  const totalRevenue = successfulPayments.reduce(
    (acc, item) => acc + Number(item.amount),
    0
  );

  // =========================
  // MONTHLY REVENUE
  // =========================
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyRevenue = successfulPayments
    .filter((payment) => {
      const date = new Date(payment.createdAt);

      return (
        date.getMonth() === currentMonth &&
        date.getFullYear() === currentYear
      );
    })
    .reduce((acc, item) => acc + Number(item.amount), 0);

  // =========================
  // UNIVERSITY REVENUE
  // =========================
  const universityRevenueMap = {};

  successfulPayments.forEach((payment) => {
    const universityName =
      payment.school?.university?.name ||
      "Unknown University";

    if (!universityRevenueMap[universityName]) {
      universityRevenueMap[universityName] = {
        universityName,
        totalRevenue: 0,
        totalPayments: 0,
        schools: new Set(),
      };
    }

    universityRevenueMap[universityName].totalRevenue += Number(
      payment.amount
    );

    universityRevenueMap[universityName].totalPayments += 1;

    if (payment.school?.name) {
      universityRevenueMap[universityName].schools.add(
        payment.school.name
      );
    }
  });

  const universityRevenue = Object.values(
    universityRevenueMap
  ).map((item) => ({
    universityName: item.universityName,
    totalRevenue: item.totalRevenue,
    totalPayments: item.totalPayments,
    totalSchools: item.schools.size,
  }));

  // =========================
  // PACKAGE ANALYTICS
  // =========================
  const packageAnalyticsMap = {};

  successfulPayments.forEach((payment) => {
    const planName =
      payment.Subscription?.[0]?.plan?.name ||
      "Basic Plan";

    if (!packageAnalyticsMap[planName]) {
      packageAnalyticsMap[planName] = {
        planName,
        totalRevenue: 0,
        totalSubscriptions: 0,
      };
    }

    packageAnalyticsMap[planName].totalRevenue += Number(
      payment.amount
    );

    packageAnalyticsMap[planName].totalSubscriptions += 1;
  });

  const packageAnalytics = Object.values(
    packageAnalyticsMap
  );

  // =========================
  // PAYMENT HISTORY
  // =========================
  const paymentHistory = payments.map((payment) => ({
    id: payment.id,

    universityName:
      payment.school?.university?.name ||
      "Unknown University",

    schoolName:
      payment.school?.name ||
      payment.schoolName ||
      "N/A",

    schoolType:
      payment.school?.type || "N/A",

    amount: payment.amount,

    status: payment.status,

    razorpayOrderId: payment.razorpayOrderId,

    razorpayPaymentId: payment.razorpayPaymentId,

    paymentDate: payment.createdAt,

    packages:
      payment.Subscription?.length > 0
        ? payment.Subscription.map(
            (sub) => sub.plan?.name
          )
        : ["Basic Plan"],
  }));

  return {
    summary: {
      totalRevenue,
      monthlyRevenue,
      totalPayments: payments.length,
      successfulPayments:
        successfulPayments.length,

      failedPayments: payments.filter(
        (p) => p.status === "FAILED"
      ).length,

      pendingPayments: payments.filter(
        (p) => p.status === "PENDING"
      ).length,
    },

    universityRevenue,

    packageAnalytics,

    paymentHistory,
  };
};