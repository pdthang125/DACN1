import { Activity, Brain, Database, Shield } from "lucide-react";

function SystemStatus() {
  return (
    <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-7 h-full">
      <h2 className="text-2xl font-black text-slate-900">
        Trạng thái hệ thống
      </h2>

      <p className="text-slate-500 mt-1">
        Theo dõi nhanh hoạt động nền tảng
      </p>

      <div className="space-y-5 mt-8">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50">
          <div className="flex items-center gap-3">
            <Activity className="size-5 text-emerald-600" />

            <div>
              <div className="font-bold text-slate-900">
                Server hoạt động
              </div>

              <div className="text-sm text-slate-500">
                Thời gian phản hồi ổn định
              </div>
            </div>
          </div>

          <div className="size-3 rounded-full bg-emerald-500" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50">
          <div className="flex items-center gap-3">
            <Brain className="size-5 text-blue-600" />

            <div>
              <div className="font-bold text-slate-900">
                AI Assistant
              </div>

              <div className="text-sm text-slate-500">
                Đang phản hồi người dùng
              </div>
            </div>
          </div>

          <div className="size-3 rounded-full bg-blue-500" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-violet-50">
          <div className="flex items-center gap-3">
            <Database className="size-5 text-violet-600" />

            <div>
              <div className="font-bold text-slate-900">
                Database
              </div>

              <div className="text-sm text-slate-500">
                Đồng bộ dữ liệu thành công
              </div>
            </div>
          </div>

          <div className="size-3 rounded-full bg-violet-500" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-50">
          <div className="flex items-center gap-3">
            <Shield className="size-5 text-amber-600" />

            <div>
              <div className="font-bold text-slate-900">
                Bảo mật hệ thống
              </div>

              <div className="text-sm text-slate-500">
                Không phát hiện bất thường
              </div>
            </div>
          </div>

          <div className="size-3 rounded-full bg-amber-500" />
        </div>
      </div>
    </div>
  );
}

export default SystemStatus;