"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import {
  ADMIN_SELECTABLE_STATUSES,
  CERTIFICATE_MAX_BYTES,
  type Application,
  type ApplicationStatus,
} from "@/lib/applications";

type LoadState = "checking" | "needs-login" | "ready";

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function PaymentEditor({
  app,
  onSaved,
}: {
  app: Application;
  onSaved: (updated: Application) => void;
}) {
  const [premium, setPremium] = useState(app.premium_amount != null ? String(app.premium_amount) : "");
  const [account, setAccount] = useState(app.payment_account ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const onSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch(`/api/admin/applications/${app.id}/payment`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ premiumAmount: premium || null, paymentAccount: account || null }),
      });
      const json = (await res.json()) as { application?: Application; error?: string };
      if (!res.ok || !json.application) {
        setError(json.error ?? "저장 중 오류가 발생했습니다.");
      } else {
        onSaved(json.application);
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }
    } catch {
      setError("서버에 연결할 수 없습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-w-[220px] flex-col gap-1.5">
      <input
        type="number"
        min={0}
        value={premium}
        onChange={(e) => setPremium(e.target.value)}
        placeholder="보험료(원)"
        className="rounded-md border border-line px-2 py-1.5 text-[13px] outline-none focus:border-harbor"
      />
      <input
        value={account}
        onChange={(e) => setAccount(e.target.value)}
        placeholder="입금 계좌 (예: 국민 123-456-7890)"
        className="rounded-md border border-line px-2 py-1.5 text-[13px] outline-none focus:border-harbor"
      />
      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="self-start rounded-md border border-line px-2.5 py-1 text-[12px] hover:border-harbor disabled:opacity-60"
      >
        {saving ? "저장 중…" : saved ? "저장됨" : "저장"}
      </button>
      {error && <p className="text-[12px] text-red-600">{error}</p>}
    </div>
  );
}

export default function AdminPage() {
  const [state, setState] = useState<LoadState>("checking");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [apps, setApps] = useState<Application[]>([]);
  const [listError, setListError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [certBusyId, setCertBusyId] = useState<string | null>(null);
  const [certError, setCertError] = useState<{ id: string; message: string } | null>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  const loadList = async () => {
    try {
      const res = await fetch("/api/admin/applications");
      if (res.status === 401) {
        setState("needs-login");
        return;
      }
      let json: { applications?: Application[]; error?: string };
      try {
        json = (await res.json()) as { applications?: Application[]; error?: string };
      } catch {
        setListError(`서버 응답을 해석할 수 없습니다. (status ${res.status})`);
        setState("ready");
        return;
      }
      if (!res.ok) {
        setListError(json.error ?? "목록을 불러오지 못했습니다.");
        setState("ready");
        return;
      }
      setApps(json.applications ?? []);
      setListError(null);
      setState("ready");
    } catch {
      setListError("서버에 연결할 수 없습니다. 잠시 후 새로고침해 주세요.");
      setState("ready");
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 최초 마운트 시 목록을 불러옵니다.
    void loadList();
  }, []);

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
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
    } catch {
      setLoginError("서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const onLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setApps([]);
    setState("needs-login");
  };

  const onStatusChange = async (id: string, status: ApplicationStatus) => {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
      }
    } finally {
      setSavingId(null);
    }
  };

  const onCertificateSelected = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setCertError(null);
    if (file.size > CERTIFICATE_MAX_BYTES) {
      setCertError({ id, message: "이미지 용량이 너무 큽니다. 3MB 이하로 올려주세요." });
      return;
    }
    setCertBusyId(id);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const res = await fetch(`/api/admin/applications/${id}/certificate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl }),
      });
      const json = (await res.json()) as { application?: Application; error?: string };
      if (!res.ok || !json.application) {
        setCertError({ id, message: json.error ?? "업로드 중 오류가 발생했습니다." });
        return;
      }
      setApps((prev) => prev.map((a) => (a.id === id ? json.application! : a)));
    } catch {
      setCertError({ id, message: "파일을 읽는 중 오류가 발생했습니다." });
    } finally {
      setCertBusyId(null);
    }
  };

  const onCertificateRemove = async (id: string) => {
    setCertBusyId(id);
    setCertError(null);
    try {
      const res = await fetch(`/api/admin/applications/${id}/certificate`, { method: "DELETE" });
      if (res.ok) {
        setApps((prev) => prev.map((a) => (a.id === id ? { ...a, certificate_data: null } : a)));
      } else {
        const json = (await res.json()) as { error?: string };
        setCertError({ id, message: json.error ?? "삭제 중 오류가 발생했습니다." });
      }
    } catch {
      setCertError({ id, message: "서버에 연결할 수 없습니다." });
    } finally {
      setCertBusyId(null);
    }
  };

  if (state === "checking") {
    return <div className="grid min-h-screen place-items-center bg-chalk text-muted">확인 중…</div>;
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
      <div className="mx-auto max-w-[1200px]">
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
          <table className="w-full min-w-[1220px] text-left text-[14px]">
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
                <th className="px-4 py-3 font-medium">보증서 이미지</th>
                <th className="px-4 py-3 font-medium">보험료 / 계좌</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {apps.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-muted">
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
                  <td className="px-4 py-3">
                    <input
                      ref={(el) => {
                        fileInputs.current[a.id] = el;
                      }}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={(e) => onCertificateSelected(a.id, e)}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={certBusyId === a.id}
                        onClick={() => fileInputs.current[a.id]?.click()}
                        className="rounded-md border border-line px-2.5 py-1.5 text-[13px] hover:border-harbor disabled:opacity-60"
                      >
                        {certBusyId === a.id ? "처리 중…" : a.certificate_data ? "교체" : "업로드"}
                      </button>
                      {a.certificate_data && (
                        <>
                          <a
                            href={a.certificate_data}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[13px] text-harbor hover:underline"
                          >
                            보기
                          </a>
                          <button
                            type="button"
                            disabled={certBusyId === a.id}
                            onClick={() => onCertificateRemove(a.id)}
                            className="text-[13px] text-red-600 hover:underline disabled:opacity-60"
                          >
                            삭제
                          </button>
                        </>
                      )}
                    </div>
                    {certError?.id === a.id && (
                      <p className="mt-1 text-[12px] text-red-600">{certError.message}</p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <PaymentEditor
                      app={a}
                      onSaved={(updated) =>
                        setApps((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
                      }
                    />
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
