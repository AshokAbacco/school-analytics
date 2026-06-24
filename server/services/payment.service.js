import prisma from "../config/prismaClient.js";

export const getPaymentsAnalytics = async () => {
  const payments = await prisma.payment.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      university: {
        select: {
          id: true,
          name: true,
        },
      },

      School: {
        select: {
          id: true,
          name: true,
          type: true,
        },
      },

      subscriptions: {
        include: {
          plan: true,
        },
      },
    },
  });

  // =========================
  // SUCCESSFUL PAYMENTS
  // =========================
  const successfulPayments = payments.filter(
    (payment) => payment.status === "SUCCESS"
  );

  // =========================
  // TOTAL REVENUE
  // =========================
  const totalRevenue = successfulPayments.reduce(
    (acc, item) => acc + Number(item.amount || 0),
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
    .reduce((acc, item) => acc + Number(item.amount || 0), 0);

  // =========================
  // UNIVERSITY REVENUE
  // =========================
  const universityRevenueMap = {};

  successfulPayments.forEach((payment) => {
    // ✅ FIXED UNIVERSITY NAME FETCH
    const universityName =
      payment.university?.name ||
      payment.university?.name ||
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
      payment.amount || 0
    );

    universityRevenueMap[universityName].totalPayments += 1;

    if (payment.School?.name) {
      universityRevenueMap[universityName].schools.add(
        payment.School.name
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
      payment.subscriptions?.[0]?.plan?.name ||
      payment.plan?.name ||
      "Basic Plan";

    if (!packageAnalyticsMap[planName]) {
      packageAnalyticsMap[planName] = {
        planName,
        totalRevenue: 0,
        totalSubscriptions: 0,
      };
    }

    packageAnalyticsMap[planName].totalRevenue += Number(
      payment.amount || 0
    );

    packageAnalyticsMap[planName].totalSubscriptions += 1;
  });

  const packageAnalytics = Object.values(packageAnalyticsMap);

  // =========================
  // PAYMENT HISTORY
  // =========================
  const paymentHistory = payments.map((payment) => ({
    id: payment.id,

    // ✅ FIXED UNIVERSITY NAME
    universityName:
      payment.university?.name ||
      payment.university?.name ||
      "Unknown University",

    schoolName:
      payment.School?.name ||
      payment.schoolName ||
      "N/A",

    schoolType:
      payment.School?.type || "N/A",

    amount: payment.amount,

    status: payment.status,

    razorpayOrderId: payment.razorpayOrderId,

    razorpayPaymentId: payment.razorpayPaymentId,

    paymentDate: payment.createdAt,

    packages:
      payment.subscriptions?.length > 0
        ? payment.subscriptions.map(
            (sub) => sub.plan?.name || "Basic Plan"
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