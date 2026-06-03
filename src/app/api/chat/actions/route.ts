import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// API endpoint cho chatbot truy vấn dữ liệu từ Database
export async function POST(req: NextRequest) {
  try {
    const { action, params } = await req.json();

    switch (action) {
      // ===== 1. LẤY DANH SÁCH BÁC SĨ ĐANG LÀM VIỆC =====
      case "getDoctors": {
        const doctors = await prisma.doctor.findMany({
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            speciality: true,
            phone: true,
            bio: true,
          },
          orderBy: { name: "asc" },
        });

        return NextResponse.json({
          success: true,
          data: doctors,
        });
      }

      // ===== 2. KIỂM TRA LỊCH TRỐNG =====
      case "getAvailableSlots": {
        const { doctorId, doctorName, date } = params || {};

        if ((!doctorId && !doctorName) || !date) {
          return NextResponse.json({
            success: false,
            error: "Thiếu thông tin bác sĩ hoặc ngày",
          });
        }

        // Tìm bác sĩ - thử nhiều chiến lược
        let resolvedDoctorId = doctorId;

        if (!resolvedDoctorId && doctorName) {
          // Làm sạch tên: bỏ prefix "Bác sĩ", "bs", "dr" ...
          const cleanName = doctorName
            .replace(/^(bác sĩ|bacsi|bs\.?|dr\.?)\s*/i, "")
            .trim();

          // Thử tìm theo tên đầy đủ trước
          let doctorByName = await prisma.doctor.findFirst({
            where: { name: { contains: cleanName, mode: "insensitive" }, isActive: true },
            select: { id: true },
          });

          // Nếu không tìm được → thử từng từ trong tên
          if (!doctorByName) {
            const nameParts = cleanName.split(/\s+/).filter(Boolean);
            for (const part of nameParts.reverse()) {
              if (part.length < 2) continue;
              doctorByName = await prisma.doctor.findFirst({
                where: { name: { contains: part, mode: "insensitive" }, isActive: true },
                select: { id: true },
              });
              if (doctorByName) break;
            }
          }

          if (doctorByName) {
            resolvedDoctorId = doctorByName.id;
          }
        }

        if (!resolvedDoctorId) {
          return NextResponse.json({
            success: false,
            error: "Không tìm thấy bác sĩ này trong hệ thống.",
          });
        }

        // Validate date format (phải là YYYY-MM-DD)
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
          return NextResponse.json({
            success: false,
            error: `Định dạng ngày không hợp lệ: "${date}". Vui lòng dùng định dạng YYYY-MM-DD (ví dụ: 2026-06-15)`,
          });
        }

        const bookedAppointments = await prisma.appointment.findMany({
          where: {
            doctorId: resolvedDoctorId,
            date: parsedDate,
            status: {
              in: ["CONFIRMED", "COMPLETED"],
            },
          },
          select: {
            time: true,
          },
        });

        const bookedTimes = bookedAppointments.map((a) => a.time);

        const allSlots = [
          "09:00",
          "09:30",
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "14:00",
          "14:30",
          "15:00",
          "15:30",
          "16:00",
          "16:30",
        ];

        const availableSlots = allSlots.filter(
          (s) => !bookedTimes.includes(s)
        );

        return NextResponse.json({
          success: true,
          data: {
            availableSlots,
            bookedTimes,
          },
        });
      }

      // ===== 3. XEM LỊCH HẸN =====

      case "getMyAppointments": {
        const { userId } = await auth();

        if (!userId) {
          return NextResponse.json({
            success: false,
            error: "Anh/Chị cần đăng nhập để xem lịch hẹn ạ.",
          });
        }

        const user = await prisma.user.findUnique({
          where: {
            clerkId: userId,
          },
        });

        if (!user) {
          return NextResponse.json({
            success: false,
            error: "Không tìm thấy thông tin người dùng.",
          });
        }

        const appointments = await prisma.appointment.findMany({
          where: {
            userId: user.id,
          },

          include: {
            doctor: {
              select: {
                name: true,
                speciality: true,
              },
            },
          },

          orderBy: [
            {
              date: "asc",
            },
            {
              time: "asc",
            },
          ],
        });

        const formattedAppointments = appointments.map((a) => ({
          id: a.id,
          doctorName: a.doctor.name,
          doctorSpeciality: a.doctor.speciality,
          date: a.date.toISOString().split("T")[0],
          time: a.time,
          reason: a.reason || "Khám tổng quát",
          status: a.status,
          phoneNumber: a.phoneNumber,
          symptom: a.symptom,
        }));

        return NextResponse.json({
          success: true,
          data: formattedAppointments,
        });
      }

      // ===== 4. ĐẶT LỊCH KHÁM =====
      case "bookAppointment": {
        const { userId: clerkUserId } = await auth();

        if (!clerkUserId) {
          return NextResponse.json({
            success: false,
            error: "Anh/Chị cần đăng nhập để đặt lịch ạ.",
          });
        }

        const currentUser = await prisma.user.findUnique({
          where: {
            clerkId: clerkUserId,
          },
        });

        if (!currentUser) {
          return NextResponse.json({
            success: false,
            error: "Không tìm thấy thông tin người dùng.",
          });
        }

        const {
          doctorId: bookDoctorId,
          doctorName: bookDoctorName,
          date: bookDate,
          time: bookTime,
          reason: bookReason,

          // NEW
          phoneNumber,
          symptom,
        } = params || {};

        if (
          !bookDate ||
          !bookTime ||
          !phoneNumber ||
          !symptom
        ) {
          return NextResponse.json({
            success: false,
            error: "Vui lòng nhập đầy đủ thông tin đặt lịch.",
          });
        }

        // Tìm bác sĩ - thử nhiều chiến lược
        let resolvedDoctorId = bookDoctorId;

        if (!resolvedDoctorId && bookDoctorName) {
          // Làm sạch tên: bỏ prefix "Bác sĩ", "bs", "dr" ...
          const cleanName = bookDoctorName
            .replace(/^(bác sĩ|bacsi|bs\.?|dr\.?)\s*/i, "")
            .trim();

          // Thử tìm theo tên đầy đủ trước
          let doctorByName = await prisma.doctor.findFirst({
            where: { name: { contains: cleanName, mode: "insensitive" }, isActive: true },
            select: { id: true },
          });

          // Nếu không tìm được → thử từng từ trong tên (họ, tên đệm, tên)
          if (!doctorByName) {
            const nameParts = cleanName.split(/\s+/).filter(Boolean);
            for (const part of nameParts.reverse()) { // ưu tiên tên (phần cuối)
              if (part.length < 2) continue;
              doctorByName = await prisma.doctor.findFirst({
                where: { name: { contains: part, mode: "insensitive" }, isActive: true },
                select: { id: true },
              });
              if (doctorByName) break;
            }
          }

          if (doctorByName) {
            resolvedDoctorId = doctorByName.id;
          }
        }

        if (!resolvedDoctorId) {
          return NextResponse.json({
            success: false,
            error:
              "Không tìm thấy bác sĩ. Anh/Chị vui lòng chọn lại bác sĩ ạ.",
          });
        }

        // Kiểm tra bác sĩ
        const doctor = await prisma.doctor.findUnique({
          where: {
            id: resolvedDoctorId,
          },

          select: {
            id: true,
            name: true,
            isActive: true,
          },
        });

        if (!doctor || !doctor.isActive) {
          return NextResponse.json({
            success: false,
            error: "Không tìm thấy bác sĩ trong hệ thống.",
          });
        }

        // Kiểm tra trùng lịch
        const existingAppointment =
          await prisma.appointment.findFirst({
            where: {
              doctorId: doctor.id,
              date: new Date(bookDate),
              time: bookTime,

              status: {
                in: ["CONFIRMED", "COMPLETED"],
              },
            },
          });

        if (existingAppointment) {
          return NextResponse.json({
            success: false,
            error:
              "Khung giờ này đã có người đặt rồi ạ. Anh/Chị chọn giờ khác nhé!",
          });
        }

        // ===== TẠO LỊCH HẸN =====
        const newAppointment =
          await prisma.appointment.create({
            data: {
              userId: currentUser.id,
              doctorId: doctor.id,

              date: new Date(bookDate),
              time: bookTime,

              reason: bookReason || "Khám tổng quát",

              // NEW
              phoneNumber,
              symptom,

              status: "CONFIRMED",
            },

            include: {
              doctor: {
                select: {
                  name: true,
                },
              },
            },
          });

        return NextResponse.json({
          success: true,

          data: {
            id: newAppointment.id,
            doctorName: newAppointment.doctor.name,
            date: newAppointment.date
              .toISOString()
              .split("T")[0],

            time: newAppointment.time,
            reason: newAppointment.reason,

            phoneNumber: newAppointment.phoneNumber,
            symptom: newAppointment.symptom,
          },
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: "Hành động không hợp lệ",
        });
    }
  } catch (error) {
    console.error("Chat Actions Error:", error);

    return NextResponse.json({
      success: false,
      error: "Đã xảy ra lỗi hệ thống",
    });
  }
}