"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ADMIN_SELECTABLE_STATUSES, type Application, type ApplicationStatus } from "@/lib/applications";

type LoadState = "checking" | "needs-login" | "ready";

export default function AdminPage() {
  const [state, setState] = useState<LoadState>("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadList = async () => {
    const res = await fetch("/api/admin/applications");
    if (res.status === 401) {
      setState("needs-login");
      return;
    }
    const json = (await res.json()) as { applications?: Application[]; error?: string };
    if (!res.ok) {
      setListError(json.error ?? "목록을 불러오지 못했습니다.");
      setState("ready");
      return;
    }
    setApps(json.applications ?? []);
    setListError(null);
    setState("ready");
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 목록을 불러옵니다.
    void loadList();
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const json = (await res.json()) as { error?: string };
    if (!res.ok) {
      setLoginError(json.error ?? "로그인에 실패했습니다.");
      return;
    }
    setPassword("");
    setState("checking");
    loadList();
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setApps([]);
    setState("needs-login");
  };

  const onStatusChange = async (id: string, status: ApplicationStatus) => {
    setSavingId(id);
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
    }
    setSavingId(null);
  };

  if (state === "checking") {
    return (
      <div className="grid min-h-screen place-items-center bg-chalk text-muted">확인 중…</div>
    );
  }

  if (state === "needs-login") {
    return (
      <div className="grid min-h-screen place-items-center bg-chalk px-4">
        <form
          onSubmit={onLogin}
          className="w-full max-w-[360px] rounded-xl border border-line bg-white p-8 shadow-sm"
        >
          <h1 className="font-serif text-[22px] font-bold text-ink">관리자 로그인</h1>
          <p className="mt-1 text-[13px] text-muted">보증 신청 내역을 확인하려면 로그인하세요.</p>
          <label className="mt-6 block text-[14px] font-medium text-ink">
            비밀번호
            <input
              type="password"
              required
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-line px-3.5 py-2.5 text-[15px] outline-none focus:border-harbor focus:ring-1 focus:ring-harbor"
            />
          </label>
          {loginError && <p className="mt-3 text-[13px] text-red-600">{loginError}</p>}
          <button
            type="submit"
            className="mt-6 w-full rounded-md bg-ink py-3 text-[15px] font-medium text-white hover:bg-harbor"
          >
            로그인
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-chalk px-4 py-10 lg:px-10">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex items-center justify-between">
          <h1 className="font-serif text-[24px] font-bold text-ink">보증 신청 관리</h1>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-md border border-ink px-4 py-2 text-[14px] font-medium text-ink hover:bg-ink hover:text-white"
          >
            로그아웃
          </button>
        </div>

        {listError && (
          <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-[14px] text-red-700">{listError}</p>
        )}

        <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white">
          <table className="w-full min-w-[820px] text-left text-[14px]">
            <thead className="border-b border-line bg-chalk text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">접수일</th>
                <th className="px-4 py-3 font-medium">보증번호</th>
                <th className="px-4 py-3 font-medium">신청인</th>
                <th className="px-4 py-3 font-medium">연락처</th>
                <th className="px-4 py-3 font-medium">유형</th>
                <th className="px-4 py-3 font-medium">금액</th>
                <th className="px-4 py-3 font-medium">기간</th>
                <th className="px-4 py-3 font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {apps.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-muted">
                    접수된 신청이 없습니다.
                  </td>
                </tr>
              )}
              {apps.map((a) => (
                <tr key={a.id}>
                  <td className="px-4 py-3 tabular-nums text-muted">
                    {new Date(a.created_at).toLocaleString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums text-harbor">{a.guarantee_number}</td>
                  <td className="px-4 py-3">{a.name}</td>
                  <td className="px-4 py-3 tabular-nums">{a.phone}</td>
                  <td className="px-4 py-3">{a.type}</td>
                  <td className="px-4 py-3 tabular-nums">{a.amount.toLocaleString()}원</td>
                  <td className="px-4 py-3">{a.period}</td>
                  <td className="px-4 py-3">
                    <select
                      value={a.status}
                      disabled={savingId === a.id}
                      onChange={(e) => onStatusChange(a.id, e.target.value as ApplicationStatus)}
                      className="rounded-md border border-line px-2 py-1.5 text-[13px] outline-none focus:border-harbor"
                    >
                      {a.status === "접수 완료" && <option value="접수 완료">접수 완료</option>}
                      {ADMIN_SELECTABLE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
