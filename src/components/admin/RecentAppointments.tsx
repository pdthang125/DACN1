"use client";

import {
  useGetAppointments,
} from "@/hooks/use-appointment";

function RecentAppointments() {

  const {
    data: appointments = [],
  } = useGetAppointments();

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>

          <h2 className="text-2xl font-black text-slate-900">
            Lịch hẹn gần đây
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Theo dõi nhanh lịch khám mới nhất
          </p>

        </div>

      </div>

      <div className="space-y-5">

        {appointments
          .slice(0, 3)
          .map((appointment) => (

            <div
              key={appointment.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    appointment.patientName
                  )}&background=2563eb&color=ffffff`}
                  alt={
                    appointment.patientName
                  }
                  className="h-12 w-12 rounded-full"
                />

                <div>

                  <h3 className="font-bold text-slate-900">
                    {
                      appointment.patientName
                    }
                  </h3>

                  <p className="text-sm text-slate-500">
                    {
                      appointment.doctorName
                    }
                  </p>

                </div>

              </div>

              <div className="text-right">

                <p className="font-bold text-slate-900">
                  {
                    appointment.time
                  }
                </p>

                <p className="text-sm text-slate-500">

                  {new Date(
                    appointment.date
                  ).toLocaleDateString(
                    "vi-VN"
                  )}

                </p>

              </div>

            </div>
          ))}

      </div>

    </div>
  );
}

export default RecentAppointments;