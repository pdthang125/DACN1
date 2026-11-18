import { prisma } from "@/lib/prisma";

export async function getActiveServicesService() {
  const services = await prisma.service.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      durationMinutes: true,
      price: true,
    },
    orderBy: { name: "asc" },
  });

  return services.map((service) => ({
    ...service,
    price: service.price.toNumber(),
  }));
}
