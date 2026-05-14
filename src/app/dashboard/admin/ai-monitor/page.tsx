export default function AiMonitorPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-black">
        AI Phân tích
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-3xl border">
          <p className="text-slate-500">
            AI Conversations
          </p>

          <h2 className="text-5xl font-black mt-3">
            128
          </h2>
        </div>

        <div className="bg-white p-8 rounded-3xl border">
          <p className="text-slate-500">
            AI Accuracy
          </p>

          <h2 className="text-5xl font-black mt-3 text-green-600">
            96%
          </h2>
        </div>

        <div className="bg-white p-8 rounded-3xl border">
          <p className="text-slate-500">
            Active Sessions
          </p>

          <h2 className="text-5xl font-black mt-3 text-blue-600">
            24
          </h2>
        </div>
      </div>
    </div>
  );
}