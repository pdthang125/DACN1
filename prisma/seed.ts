import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Seed danh sách bác sĩ
  await prisma.doctor.createMany({
    data: [
      {
        name: "Nguyễn Minh Minh",
        speciality: "Chỉnh nha",
        imageUrl: "/doctors/doctor-1.jpg",
        email: "minhanh@smilecare.vn",
        phone: "0905123123",
        gender: "FEMALE",
        isActive: true,
      },
      {
        name: "Trần Quốc Bảo",
        speciality: "Implant",
        imageUrl: "/doctors/doctor-2.jpg",
        email: "quocbao@smilecare.vn",
        phone: "0905222123",
        gender: "MALE",
        isActive: true,
      },
      {
        name: "Lê Hoàng Nam",
        speciality: "Nha tổng quát",
        imageUrl: "/doctors/doctor-3.jpg",
        email: "hoangnam@smilecare.vn",
        phone: "0905666789",
        gender: "MALE",
        isActive: true,
      },
      {
        name: "Phạm Thu Hà",
        speciality: "Răng sứ thẩm mỹ",
        imageUrl: "/doctor/doctor1.png",
        email: "thuha@smilecare.vn",
        phone: "0905888999",
        gender: "FEMALE",
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // 2. Seed danh mục dịch vụ nha khoa
  const services = [
    {
      id: "checkup",
      name: "Khám Tổng Quát",
      code: "SC-CHECKUP",
      description: "Khám và tư vấn tình trạng răng miệng tổng quát",
      durationMinutes: 60,
      price: 500000,
      isActive: true,
    },
    {
      id: "cleaning",
      name: "Cạo Vôi Răng",
      code: "SC-CLEAN",
      description: "Lấy cao răng và đánh bóng bằng máy siêu âm",
      durationMinutes: 45,
      price: 300000,
      isActive: true,
    },
    {
      id: "consultation",
      name: "Tư Vấn Chuyên Sâu",
      code: "SC-CONSULT",
      description: "Tư vấn niềng răng, thẩm mỹ, cấy ghép implant",
      durationMinutes: 30,
      price: 0,
      isActive: true,
    },
    {
      id: "emergency",
      name: "Khám Cấp Cứu",
      code: "SC-EMERGENCY",
      description: "Cấp cứu đau nhức, chảy máu, chấn thương răng",
      durationMinutes: 30,
      price: 800000,
      isActive: true,
    },
    {
      id: "whitening",
      name: "Tẩy Trắng Răng",
      code: "SC-WHITE",
      description: "Tẩy trắng răng công nghệ Laser Whitening",
      durationMinutes: 60,
      price: 1500000,
      isActive: true,
    },
    {
      id: "extraction",
      name: "Nhổ Răng Khôn",
      code: "SC-EXTRACT",
      description: "Tiểu phẫu nhổ răng khôn không đau bằng sóng siêu âm",
      durationMinutes: 45,
      price: 1200000,
      isActive: true,
    },
    {
      id: "implant",
      name: "Trồng Răng Implant",
      code: "SC-IMPLANT",
      description: "Cấy ghép trụ Implant phục hình răng đã mất",
      durationMinutes: 90,
      price: 12000000,
      isActive: true,
    },
    {
      id: "orthodontics",
      name: "Niềng Răng Thẩm Mỹ",
      code: "SC-BRACES",
      description: "Chỉnh nha mắc cài / máng trong suốt",
      durationMinutes: 60,
      price: 25000000,
      isActive: true,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { code: service.code },
      update: {
        name: service.name,
        description: service.description,
        durationMinutes: service.durationMinutes,
        price: service.price,
        isActive: service.isActive,
      },
      create: service,
    });
  }

  console.log("Seed data created successfully 😎🔥");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
 