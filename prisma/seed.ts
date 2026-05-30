import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

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
  });

  console.log("Seed data created 😎🔥");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });