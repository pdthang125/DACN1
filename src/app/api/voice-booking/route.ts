import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("VOICE BOOKING:", body);

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: "cmp5n4z5n0001vzjkrtpkhf4d",

        // Tạm thời gán user đầu tiên
        userId: (await prisma.user.findFirst())!.id,

        date: new Date(),
        time: body.time,

        phoneNumber: body.phoneNumber,

        symptom: body.service,
        reason: body.service,

        status: "CONFIRMED",
      },
    });

    return NextResponse.json({
      success: true,
      appointment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}