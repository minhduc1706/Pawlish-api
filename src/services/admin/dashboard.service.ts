import { User } from "../../models/user.model";
import { Appointment } from "../../models/appointment.model";
import { Product } from "../../models/product.model";
import { Order } from "../../models/order.model";

export class AdminService {
  static async getStats(period: string) {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        console.log("Period: day, Start Date:", startDate.toISOString());
        break;
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7)); 
        console.log("Period: week, Start Date:", startDate.toISOString());
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        console.log("Period: month, Start Date:", startDate.toISOString());
        break;
      case "year":
        startDate = new Date(now.getFullYear(), 0, 1);
        console.log("Period: year, Start Date:", startDate.toISOString());
        break;
      default:
        console.error("Invalid period:", period);
        throw new Error("Invalid period");
    }

    const customers = await User.countDocuments({ role: "customer" });
    const newCustomers = await User.countDocuments({
      role: "customer",
      createdAt: { $gte: startDate },
    });
    console.log("Customers:", customers, "New Customers:", newCustomers);

    const appointments = await Appointment.countDocuments({
      date: { $gte: startDate },
    });
    const pendingAppointments = await Appointment.countDocuments({
      status: "pending",
      date: { $gte: startDate },
    });
    console.log("Appointments:", appointments, "Pending Appointments:", pendingAppointments);

    const revenueData = await Appointment.aggregate([
      {
        $match: {
          status: "completed",
          date: { $gte: startDate },
        },
      },
      { $lookup: { from: "services", localField: "service_id", foreignField: "_id", as: "service" } },
      { $unwind: "$service" },
      { $group: { _id: null, total: { $sum: "$service.price" }, count: { $sum: 1 } } },
    ]);
    const revenue = revenueData[0]?.total || 0;
    const avgRevenuePerOrder = revenueData[0]?.count ? Math.round(revenue / revenueData[0].count) : 0;
    console.log("Revenue Data:", revenueData);
    console.log("Revenue:", revenue, "Avg Revenue/Order:", avgRevenuePerOrder);

    const lowStockProducts = await Product.countDocuments({
      stock_quantity: { $lt: 10 },
    });
    console.log("Low Stock Products:", lowStockProducts);

    const result = {
      stats: { customers, appointments, revenue, lowStockProducts },
      secondary: {
        customers: `+${newCustomers} new`,
        appointments: `${pendingAppointments} pending`,
        revenue: `Avg ${avgRevenuePerOrder}/order`,
        lowStockProducts: "Restock needed",
      },
    };
    console.log("Final Result:", JSON.stringify(result, null, 2));
    return result;
  }

  static async getSales(period: string) {
    const now = new Date();
    let startDate: Date;
    let groupBy: any;
    let labelFormat: (date: Date, index?: number) => string;
    let limit: number;

    switch (period) {
      case "daily":
        startDate = new Date(now.setDate(now.getDate() - 6)); // 7 ngày gần nhất
        startDate.setHours(0, 0, 0, 0);
        groupBy = { $dayOfWeek: "$date" }; // Sửa lại để dùng trong $group
        labelFormat = (date: Date) => {
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          return days[date.getDay()];
        };
        limit = 7;
        break;
      case "weekly":
        startDate = new Date(now.setDate(now.getDate() - 27)); // 4 tuần gần nhất
        startDate.setHours(0, 0, 0, 0);
        groupBy = { week: { $week: "$date" }, year: { $year: "$date" } }; // Nhóm theo tuần và năm
        labelFormat = (_, index) => `Week ${index + 1}`;
        limit = 4;
        break;
      case "monthly":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1); // 12 tháng gần nhất
        groupBy = { $month: "$date" };
        labelFormat = (date: Date) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return months[date.getMonth()];
        };
        limit = 12;
        break;
      default:
        throw new Error("Invalid period");
    }

    const salesData = await Appointment.aggregate([
      {
        $match: {
          status: "completed",
          date: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $group: {
          _id: groupBy,
          sales: { $sum: "$service.price" },
          fullDate: { $min: "$date" }, // Lấy ngày nhỏ nhất để format
        },
      },
      { $sort: { "fullDate": 1 } },
      { $limit: limit },
      {
        $project: {
          date: "$fullDate",
          sales: 1,
          _id: 0,
        },
      },
    ]);

    const formattedData = salesData.map((item, index) => ({
      date: period === "weekly" ? labelFormat(item.date, index) : labelFormat(new Date(item.date)),
      sales: item.sales,
    }));

    if (period === "daily") {
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const todayIndex = now.getDay();
      const orderedDays = [...days.slice(todayIndex + 1), ...days.slice(0, todayIndex + 1)];
      const fullData = orderedDays.slice(-7).map((day) => {
        const found = formattedData.find((d) => d.date === day);
        return found || { date: day, sales: 0 };
      });
      return fullData;
    } else if (period === "weekly") {
      return Array.from({ length: 4 }, (_, i) => ({
        date: `Week ${i + 1}`,
        sales: formattedData[i]?.sales || 0,
      }));
    } else if (period === "monthly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonth = now.getMonth();
      const orderedMonths = [...months.slice(currentMonth + 1), ...months.slice(0, currentMonth + 1)];
      const fullData = orderedMonths.slice(-12).map((month) => {
        const found = formattedData.find((d) => d.date === month);
        return found || { date: month, sales: 0 };
      });
      return fullData;
    }

    return formattedData;
  }

  static async getRevenueProfit(period: "monthly" | "quarterly" | "yearly" = "monthly") {
    const now = new Date();
    let startDate: Date;
    let groupBy: any;
    let labelFormat: (date: Date, index?: number) => string;
    let limit: number;

    switch (period) {
      case "monthly": 
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        groupBy = { $month: "$date" };
        labelFormat = (date: Date) => {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          return months[date.getMonth()];
        };
        limit = 12;
        break;
      case "quarterly": 
        startDate = new Date(now.getFullYear() - 1, now.getMonth() - 9, 1); 
        groupBy = {
          quarter: {
            $cond: [
              { $lte: [{ $month: "$date" }, 3] },
              1,
              {
                $cond: [
                  { $lte: [{ $month: "$date" }, 6] },
                  2,
                  {
                    $cond: [{ $lte: [{ $month: "$date" }, 9] }, 3, 4],
                  },
                ],
              },
            ],
          },
          year: { $year: "$date" },
        };
        labelFormat = (_, index) => `Q${index + 1}`;
        limit = 4;
        break;
      case "yearly": 
        startDate = new Date(now.getFullYear() - 4, 0, 1);
        groupBy = { $year: "$date" };
        labelFormat = (date: Date) => date.getFullYear().toString();
        limit = 5;
        break;
      default:
        throw new Error("Invalid period");
    }

    const revenueProfitData = await Appointment.aggregate([
      {
        $match: {
          status: "completed",
          date: { $gte: startDate },
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service",
        },
      },
      { $unwind: "$service" },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: "$service.price" },
          fullDate: { $min: "$date" },
        },
      },
      { $sort: { "fullDate": 1 } },
      { $limit: limit },
      {
        $project: {
          date: "$fullDate",
          revenue: 1,
          _id: 0,
        },
      },
    ]);

    const formattedData = revenueProfitData.map((item, index) => ({
      month: period === "quarterly" ? labelFormat(item.date, index) : labelFormat(new Date(item.date)),
      revenue: item.revenue,
      profit: Math.round(item.revenue * 0.25),
    }));

    if (period === "monthly") {
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const currentMonth = now.getMonth();
      const orderedMonths = [...months.slice(currentMonth + 1), ...months.slice(0, currentMonth + 1)];
      const fullData = orderedMonths.slice(-12).map((month) => {
        const found = formattedData.find((d) => d.month === month);
        return found || { month, revenue: 0, profit: 0 };
      });
      return fullData;
    } else if (period === "quarterly") {
      return Array.from({ length: 4 }, (_, i) => ({
        month: `Q${i + 1}`,
        revenue: formattedData[i]?.revenue || 0,
        profit: formattedData[i]?.profit || 0,
      }));
    } else if (period === "yearly") {
      const currentYear = now.getFullYear();
      return Array.from({ length: 5 }, (_, i) => {
        const year = currentYear - 4 + i;
        const found = formattedData.find((d) => d.month === year.toString());
        return found || { month: year.toString(), revenue: 0, profit: 0 };
      });
    }

    return formattedData;
  }

  static async getProductCategories() {
    const categoryData = await Order.aggregate([
      {
        $match: {
          status: "delivered", 
        },
      },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "productcategories",
          localField: "product.category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          totalRevenue: { $sum: { $multiply: ["$product.price", "$products.quantity"] } },
        },
      },
      {
        $project: {
          name: 1,
          revenue: "$totalRevenue",
          _id: 0,
        },
      },
    ]);

    const totalRevenue = categoryData.reduce((sum, item) => sum + item.revenue, 0);
    const formattedData = categoryData.map((item) => ({
      name: item.name,
      value: totalRevenue ? Math.round((item.revenue / totalRevenue) * 100) : 0,
    }));

    return formattedData;
  }

  static async getProductStats() {
    const totalProducts = await Product.countDocuments();

    const categoryData = await Product.aggregate([
      {
        $lookup: {
          from: "productcategories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category._id",
          name: { $first: "$category.name" },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: 1,
          count: 1,
          _id: 0,
        },
      },
    ]);

    const totalCount = categoryData.reduce((sum, item) => sum + item.count, 0);
    const categories = categoryData.map((item) => ({
      name: item.name,
      count: item.count,
      percentage: totalCount ? Math.round((item.count / totalCount) * 100) : 0,
    }));

    const topSellingData = await Order.aggregate([
      { $match: { status: "delivered" } },
      { $unwind: "$products" },
      {
        $lookup: {
          from: "products",
          localField: "products.product_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product._id",
          name: { $first: "$product.name" },
          sales: { $sum: "$products.quantity" },
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 3 },
      {
        $project: {
          name: 1,
          sales: 1,
          _id: 0,
        },
      },
    ]);

    const inventoryStatus = await Product.aggregate([
      {
        $bucket: {
          groupBy: "$stock_quantity",
          boundaries: [0, 1, 10],
          default: "inStock",
          output: {
            count: { $sum: 1 },
          },
        },
      },
    ]);

    const inventory = {
      outOfStock: inventoryStatus.find((item) => item._id === 0)?.count || 0,
      lowStock: inventoryStatus.find((item) => item._id === 1)?.count || 0,
      inStock: inventoryStatus.find((item) => item._id === "inStock")?.count || 0,
    };

    return {
      totalProducts,
      categories,
      topSelling: topSellingData,
      inventoryStatus: inventory,
    };
  }

  static async getLowStockProducts() {
    const LOW_STOCK_THRESHOLD = 10;
    const MAX_STOCK_DEFAULT = 200;   

    const lowStockProducts = await Product.aggregate([
      {
        $match: {
          stock_quantity: { $lte: LOW_STOCK_THRESHOLD },
        },
      },
      {
        $lookup: {
          from: "productcategories",
          localField: "category_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          id: "$_id",
          name: 1,
          quantity: "$stock_quantity",
          maxStock: { $literal: MAX_STOCK_DEFAULT }, 
          category: "$category.name",
          _id: 0,
        },
      },
    ]);

    return lowStockProducts;
  }

  static async getRecentActivities() {
    const newCustomers = await User.find({ role: "customer" })
      .sort({ createdAt: -1 }) 
      .select("full_name createdAt")
      .lean()
      .then((users) =>
        users.map((user) => ({
          id: user._id.toString(),
          type: "customer" as const,
          message: `New customer: ${user.full_name || "Unnamed Customer"}`,
          time: user.createdAt || new Date(),
        }))
      );

    const appointments = await Appointment.aggregate([
      {
        $match: {
          $or: [{ status: "pending" }, { status: "completed" }],
        },
      },
      {
        $lookup: {
          from: "services",
          localField: "service_id",
          foreignField: "_id",
          as: "service",
        },
      },
      {
        $unwind: {
          path: "$service",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          id: "$_id",
          type: "appointment" as const,
          message: {
            $cond: {
              if: { $eq: ["$status", "pending"] },
              then: { $concat: ["New appointment: ", { $ifNull: ["$service.name", "Unnamed Service"] }] },
              else: { $concat: ["Completed service: ", { $ifNull: ["$service.name", "Unnamed Service"] }] },
            },
          },
          time: "$createdAt", 
        },
      },
      { $sort: { time: -1 } },
    ]);

    const newProducts = await Product.find()
      .sort({ createdAt: -1 })
      .select("name createdAt")
      .lean()
      .then((products) =>
        products.map((product) => ({
          id: product._id.toString(),
          type: "inventory" as const,
          message: `New stock added: ${product.name || "Unnamed Product"}`,
          time: product.createdAt || new Date(),
        }))
      );

    const allActivities = [...newCustomers, ...appointments, ...newProducts].sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );

    const now = new Date();
    const formattedActivities = allActivities.map((activity) => {
      const activityTime = new Date(activity.time);
      if (isNaN(activityTime.getTime())) {
        return {
          id: activity.id,
          type: activity.type,
          message: activity.message,
          time: "Just now",
        };
      }
      const diffMs = now.getTime() - activityTime.getTime();
      const diffMins = Math.round(diffMs / 60000);
      let timeStr = "";
      if (diffMins < 60) {
        timeStr = `${diffMins} minute${diffMins !== 1 ? "s" : ""} ago`;
      } else {
        const diffHours = Math.round(diffMins / 60);
        timeStr = `${diffHours} hour${diffHours !== 1 ? "s" : ""} ago`;
      }
      return {
        id: activity.id,
        type: activity.type,
        message: activity.message,
        time: timeStr,
      };
    });

    return formattedActivities;
  }
}