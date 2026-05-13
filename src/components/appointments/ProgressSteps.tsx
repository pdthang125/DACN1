import { CheckCircle2 } from "lucide-react";

const PROGRESS_STEPS = ["Chọn Bác sĩ", "Chọn Giờ", "Xác nhận"];

function ProgressSteps({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      {PROGRESS_STEPS.map((stepName, index) => {
        const stepNumber = index + 1;
        const isCompleted = currentStep > stepNumber;
        const isActive = currentStep === stepNumber;

        return (
          <div key={stepNumber} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`size-10 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-300 shadow-md ${
                  isCompleted
                    ? "bg-emerald-500 text-white shadow-emerald-200"
                    : isActive
                    ? "bg-blue-600 text-white shadow-blue-200 scale-110"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {isCompleted ? <CheckCircle2 className="size-5" /> : stepNumber}
              </div>
              <span
                className={`text-sm font-bold tracking-tight transition-colors ${
                  isActive ? "text-blue-700" : isCompleted ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                {stepName}
              </span>
            </div>

            {stepNumber < PROGRESS_STEPS.length && (
              <div className="w-12 h-0.5 bg-slate-200 rounded-full mx-2 overflow-hidden">
                <div 
                  className={`h-full bg-blue-500 transition-all duration-500 ${isCompleted ? "w-full" : "w-0"}`} 
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ProgressSteps;
