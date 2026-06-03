"use client";

import { useEffect, useState } from "react";

import { getDoctors } from "@/lib/actions/doctors";

function RecentDoctors() {

  const [doctors, setDoctors] =
    useState<any[]>([]);

  useEffect(() => {

    async function fetchDoctors() {

      const data =
        await getDoctors();

      setDoctors(data);

    }

    fetchDoctors();

  }, []);

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">

      <div className="mb-6">

        <h2 className="text-2xl font-black text-slate-900">
          Bác sĩ nổi bật
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Đội ngũ bác sĩ đang hoạt động
        </p>

      </div>

      <div className="space-y-5">

        {doctors
          .slice(0, 3)
          .map((doctor: any) => (

            <div
              key={doctor.id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 p-5 transition-all hover:bg-slate-50"
            >

              <div className="flex items-center gap-4">

                <img
                  src={doctor.imageUrl}
                  alt={doctor.name}
                  className="h-14 w-14 rounded-full object-cover"
                />

                <div>

                  <h3 className="font-bold text-slate-900">
                    {doctor.name}
                  </h3>

                  <p className="text-sm text-slate-500">
                    {doctor.speciality}
                  </p>

                </div>

              </div>

              <div>

                {doctor.isActive ? (

                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                    Hoạt động
                  </span>

                ) : (

                  <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700">
                    Tạm nghỉ
                  </span>

                )}

              </div>

            </div>
          ))}

      </div>

    </div>
  );
}

export default RecentDoctors;