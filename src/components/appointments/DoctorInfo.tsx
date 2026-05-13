import { useAvailableDoctors } from "@/hooks/use-doctors";
import Image from "next/image";

function DoctorInfo({ doctorId }: { doctorId: string }) {
  const { data: doctors = [] } = useAvailableDoctors();
  const doctor = doctors.find((d) => d.id === doctorId);

  if (!doctor) return null;

  return (
    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
      <div className="size-14 rounded-xl overflow-hidden border-2 border-white shadow-sm shrink-0">
        <img
          src={doctor.imageUrl || "https://github.com/shadcn.png"}
          alt={doctor.name}
          className="size-full object-cover"
        />
      </div>
      <div>
        <h3 className="font-black text-slate-900 leading-tight">{doctor.name}</h3>
        <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mt-0.5">
          {doctor.speciality || "Nha khoa Tổng quát"}
        </p>
      </div>
    </div>
  );
}

export default DoctorInfo;
